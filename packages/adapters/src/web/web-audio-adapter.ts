/**
 * Web Audio adapter
 * HTML5 Audio-based playback with Web Audio API enhancements
 */

import type {
  IAudioAdapter,
  IAudioHandle,
  AudioOptions,
  AudioEvent,
  AudioEventCallback,
  AudioMetadata,
  AudioState,
  AudioAdapterConfig,
} from '../interfaces/audio'
import { AudioError } from '../interfaces/audio'

let handleIdCounter = 0

function generateHandleId(): string {
  return `audio_${++handleIdCounter}_${Date.now()}`
}

interface AudioInstance {
  handle: IAudioHandle
  element: HTMLAudioElement
  listeners: Set<AudioEventCallback>
  isMuted: boolean
  previousVolume: number
}

/**
 * Web Audio adapter using HTML5 Audio element
 */
export class WebAudioAdapter implements IAudioAdapter {
  private instances: Map<string, AudioInstance> = new Map()
  private preloadedAudio: Map<string, HTMLAudioElement> = new Map()
  private config: AudioAdapterConfig

  constructor(config: AudioAdapterConfig = {}) {
    this.config = {
      defaultVolume: 1.0,
      defaultPlaybackRate: 1.0,
      ...config,
    }
  }

  private createAudioElement(url: string, options?: AudioOptions): HTMLAudioElement {
    // Check for preloaded audio
    const preloaded = this.preloadedAudio.get(url)
    if (preloaded) {
      this.preloadedAudio.delete(url)
      return preloaded
    }

    const audio = new Audio()
    audio.src = url
    audio.preload = options?.preload ?? 'auto'

    return audio
  }

  private getState(audio: HTMLAudioElement): AudioState {
    if (audio.error) return 'error'
    if (audio.ended) return 'ended'
    if (audio.paused && audio.currentTime === 0 && audio.readyState < 2) return 'loading'
    if (audio.paused) return 'paused'
    if (!audio.paused) return 'playing'
    return 'idle'
  }

  private notifyListeners(instance: AudioInstance, eventType: AudioEvent['type']): void {
    const audio = instance.element
    const event: AudioEvent = {
      type: eventType,
      handle: {
        ...instance.handle,
        state: this.getState(audio),
      },
      currentTime: audio.currentTime,
      duration: isNaN(audio.duration) ? undefined : audio.duration,
    }

    if (eventType === 'error' && audio.error) {
      event.error = audio.error.message
    }

    instance.listeners.forEach((callback) => callback(event))
  }

  private setupEventListeners(instance: AudioInstance): void {
    const audio = instance.element

    const events = [
      'play',
      'pause',
      'ended',
      'error',
      'loadedmetadata',
      'timeupdate',
    ] as const

    events.forEach((eventName) => {
      audio.addEventListener(eventName, () => {
        // Update handle state
        instance.handle.state = this.getState(audio)

        // Map to our event types
        let eventType: AudioEvent['type']
        switch (eventName) {
          case 'play':
          case 'pause':
            eventType = 'statechange'
            break
          case 'ended':
            eventType = 'ended'
            break
          case 'error':
            eventType = 'error'
            break
          case 'loadedmetadata':
            eventType = 'loaded'
            break
          case 'timeupdate':
            eventType = 'timeupdate'
            break
          default:
            return
        }

        this.notifyListeners(instance, eventType)
      })
    })
  }

  // Playback control

  async play(url: string, options?: AudioOptions): Promise<IAudioHandle> {
    const audio = this.createAudioElement(url, options)
    const handleId = generateHandleId()

    const handle: IAudioHandle = {
      id: handleId,
      url,
      state: 'loading',
    }

    const instance: AudioInstance = {
      handle,
      element: audio,
      listeners: new Set(),
      isMuted: false,
      previousVolume: options?.volume ?? this.config.defaultVolume ?? 1.0,
    }

    this.instances.set(handleId, instance)
    this.setupEventListeners(instance)

    // Apply options
    audio.volume = options?.volume ?? this.config.defaultVolume ?? 1.0
    audio.playbackRate = options?.playbackRate ?? this.config.defaultPlaybackRate ?? 1.0
    audio.loop = options?.loop ?? false

    if (options?.startTime) {
      audio.currentTime = options.startTime
    }

    try {
      await audio.play()
      handle.state = 'playing'
      return handle
    } catch (error) {
      handle.state = 'error'
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new AudioError(
          'Playback not allowed. User interaction required.',
          'PERMISSION_DENIED'
        )
      }
      throw new AudioError('Failed to play audio', 'UNKNOWN')
    }
  }

  async pause(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.element.pause()
    instance.handle.state = 'paused'
  }

  async resume(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    try {
      await instance.element.play()
      instance.handle.state = 'playing'
    } catch (error) {
      throw new AudioError('Failed to resume playback', 'UNKNOWN')
    }
  }

  async stop(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.element.pause()
    instance.element.currentTime = 0
    instance.element.src = ''
    instance.listeners.clear()
    instance.handle.state = 'idle'
    this.instances.delete(handle.id)
  }

  // Seek and position

  async getCurrentTime(handle: IAudioHandle): Promise<number> {
    const instance = this.instances.get(handle.id)
    if (!instance) return 0
    return instance.element.currentTime
  }

  async setCurrentTime(handle: IAudioHandle, time: number): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return
    instance.element.currentTime = time
  }

  async getDuration(handle: IAudioHandle | string): Promise<number> {
    if (typeof handle === 'string') {
      // Get duration from URL (need to load metadata)
      const metadata = await this.getMetadata(handle)
      return metadata.duration
    }

    const instance = this.instances.get(handle.id)
    if (!instance) return 0

    const duration = instance.element.duration
    return isNaN(duration) ? 0 : duration
  }

  // Volume control

  async getVolume(handle: IAudioHandle): Promise<number> {
    const instance = this.instances.get(handle.id)
    if (!instance) return 0
    return instance.element.volume
  }

  async setVolume(handle: IAudioHandle, volume: number): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    const clampedVolume = Math.max(0, Math.min(1, volume))
    instance.element.volume = clampedVolume
    instance.previousVolume = clampedVolume
    instance.isMuted = false
  }

  async mute(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    if (!instance.isMuted) {
      instance.previousVolume = instance.element.volume
      instance.element.volume = 0
      instance.isMuted = true
    }
  }

  async unmute(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    if (instance.isMuted) {
      instance.element.volume = instance.previousVolume
      instance.isMuted = false
    }
  }

  // Playback rate

  async getPlaybackRate(handle: IAudioHandle): Promise<number> {
    const instance = this.instances.get(handle.id)
    if (!instance) return 1.0
    return instance.element.playbackRate
  }

  async setPlaybackRate(handle: IAudioHandle, rate: number): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    // Clamp to reasonable range
    const clampedRate = Math.max(0.25, Math.min(4, rate))
    instance.element.playbackRate = clampedRate
  }

  // Metadata

  async getMetadata(url: string): Promise<AudioMetadata> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.preload = 'metadata'
      audio.src = url

      const cleanup = () => {
        audio.removeEventListener('loadedmetadata', onLoaded)
        audio.removeEventListener('error', onError)
      }

      const onLoaded = () => {
        cleanup()
        resolve({
          duration: audio.duration,
        })
      }

      const onError = () => {
        cleanup()
        reject(new AudioError('Failed to load audio metadata', 'NETWORK_ERROR'))
      }

      audio.addEventListener('loadedmetadata', onLoaded)
      audio.addEventListener('error', onError)
    })
  }

  // Preloading

  async preload(url: string): Promise<void> {
    if (this.preloadedAudio.has(url)) return

    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.src = url

      const cleanup = () => {
        audio.removeEventListener('canplaythrough', onCanPlay)
        audio.removeEventListener('error', onError)
      }

      const onCanPlay = () => {
        cleanup()
        this.preloadedAudio.set(url, audio)
        resolve()
      }

      const onError = () => {
        cleanup()
        reject(new AudioError('Failed to preload audio', 'NETWORK_ERROR'))
      }

      audio.addEventListener('canplaythrough', onCanPlay)
      audio.addEventListener('error', onError)
    })
  }

  async cancelPreload(url: string): Promise<void> {
    const audio = this.preloadedAudio.get(url)
    if (audio) {
      audio.src = ''
      this.preloadedAudio.delete(url)
    }
  }

  // Events

  onPlaybackChange(handle: IAudioHandle, callback: AudioEventCallback): () => void {
    const instance = this.instances.get(handle.id)
    if (!instance) {
      return () => {}
    }

    instance.listeners.add(callback)
    return () => {
      instance.listeners.delete(callback)
    }
  }

  // Cleanup

  async dispose(): Promise<void> {
    // Stop all active playback
    for (const [, instance] of this.instances) {
      instance.element.pause()
      instance.element.src = ''
      instance.listeners.clear()
    }
    this.instances.clear()

    // Clear preloaded audio
    for (const [, audio] of this.preloadedAudio) {
      audio.src = ''
    }
    this.preloadedAudio.clear()
  }
}

/**
 * Create a web audio adapter
 * @param config - Adapter configuration
 */
export function createWebAudio(config?: AudioAdapterConfig): IAudioAdapter {
  return new WebAudioAdapter(config)
}
