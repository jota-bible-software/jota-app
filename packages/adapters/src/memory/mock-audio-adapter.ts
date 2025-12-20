/**
 * Mock audio adapter
 * For testing audio functionality
 */

import type {
  IAudioAdapter,
  IAudioHandle,
  AudioOptions,
  AudioEvent,
  AudioEventCallback,
  AudioMetadata,
  AudioAdapterConfig,
} from '../interfaces/audio'

let handleIdCounter = 0

interface MockAudioInstance {
  handle: IAudioHandle
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  isMuted: boolean
  previousVolume: number
  listeners: Set<AudioEventCallback>
}

/**
 * Mock audio adapter for testing
 */
export class MockAudioAdapter implements IAudioAdapter {
  private instances: Map<string, MockAudioInstance> = new Map()
  private preloadedUrls: Set<string> = new Set()
  private config: AudioAdapterConfig
  private mockDurations: Map<string, number> = new Map()

  constructor(config: AudioAdapterConfig = {}) {
    this.config = {
      defaultVolume: 1.0,
      defaultPlaybackRate: 1.0,
      ...config,
    }
  }

  /**
   * Set mock duration for a URL
   */
  setMockDuration(url: string, duration: number): void {
    this.mockDurations.set(url, duration)
  }

  private notifyListeners(instance: MockAudioInstance, eventType: AudioEvent['type']): void {
    const event: AudioEvent = {
      type: eventType,
      handle: { ...instance.handle },
      currentTime: instance.currentTime,
      duration: instance.duration,
    }

    instance.listeners.forEach((callback) => callback(event))
  }

  // Playback control

  async play(url: string, options?: AudioOptions): Promise<IAudioHandle> {
    const handleId = `mock_audio_${++handleIdCounter}`

    const handle: IAudioHandle = {
      id: handleId,
      url,
      state: 'playing',
    }

    const instance: MockAudioInstance = {
      handle,
      currentTime: options?.startTime ?? 0,
      duration: this.mockDurations.get(url) ?? 180, // Default 3 minutes
      volume: options?.volume ?? this.config.defaultVolume ?? 1.0,
      playbackRate: options?.playbackRate ?? this.config.defaultPlaybackRate ?? 1.0,
      isMuted: false,
      previousVolume: options?.volume ?? this.config.defaultVolume ?? 1.0,
      listeners: new Set(),
    }

    this.instances.set(handleId, instance)

    // Simulate loaded event
    setTimeout(() => this.notifyListeners(instance, 'loaded'), 0)

    return handle
  }

  async pause(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.handle.state = 'paused'
    this.notifyListeners(instance, 'statechange')
  }

  async resume(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.handle.state = 'playing'
    this.notifyListeners(instance, 'statechange')
  }

  async stop(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.handle.state = 'idle'
    instance.currentTime = 0
    this.notifyListeners(instance, 'statechange')
    this.instances.delete(handle.id)
  }

  // Seek and position

  async getCurrentTime(handle: IAudioHandle): Promise<number> {
    const instance = this.instances.get(handle.id)
    return instance?.currentTime ?? 0
  }

  async setCurrentTime(handle: IAudioHandle, time: number): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.currentTime = Math.max(0, Math.min(time, instance.duration))
    this.notifyListeners(instance, 'timeupdate')
  }

  async getDuration(handle: IAudioHandle | string): Promise<number> {
    if (typeof handle === 'string') {
      return this.mockDurations.get(handle) ?? 180
    }

    const instance = this.instances.get(handle.id)
    return instance?.duration ?? 0
  }

  // Volume control

  async getVolume(handle: IAudioHandle): Promise<number> {
    const instance = this.instances.get(handle.id)
    return instance?.volume ?? 0
  }

  async setVolume(handle: IAudioHandle, volume: number): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.volume = Math.max(0, Math.min(1, volume))
    instance.previousVolume = instance.volume
    instance.isMuted = false
  }

  async mute(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    if (!instance.isMuted) {
      instance.previousVolume = instance.volume
      instance.volume = 0
      instance.isMuted = true
    }
  }

  async unmute(handle: IAudioHandle): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    if (instance.isMuted) {
      instance.volume = instance.previousVolume
      instance.isMuted = false
    }
  }

  // Playback rate

  async getPlaybackRate(handle: IAudioHandle): Promise<number> {
    const instance = this.instances.get(handle.id)
    return instance?.playbackRate ?? 1.0
  }

  async setPlaybackRate(handle: IAudioHandle, rate: number): Promise<void> {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.playbackRate = Math.max(0.25, Math.min(4, rate))
  }

  // Metadata

  async getMetadata(url: string): Promise<AudioMetadata> {
    return {
      duration: this.mockDurations.get(url) ?? 180,
    }
  }

  // Preloading

  async preload(url: string): Promise<void> {
    this.preloadedUrls.add(url)
  }

  async cancelPreload(url: string): Promise<void> {
    this.preloadedUrls.delete(url)
  }

  /**
   * Check if a URL was preloaded (for testing)
   */
  isPreloaded(url: string): boolean {
    return this.preloadedUrls.has(url)
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
    this.instances.clear()
    this.preloadedUrls.clear()
  }

  /**
   * Get all active instances (for testing)
   */
  getActiveInstances(): IAudioHandle[] {
    return Array.from(this.instances.values()).map((i) => i.handle)
  }

  /**
   * Simulate end of playback (for testing)
   */
  simulateEnd(handle: IAudioHandle): void {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.handle.state = 'ended'
    instance.currentTime = instance.duration
    this.notifyListeners(instance, 'ended')
  }

  /**
   * Simulate error (for testing)
   */
  simulateError(handle: IAudioHandle, message: string): void {
    const instance = this.instances.get(handle.id)
    if (!instance) return

    instance.handle.state = 'error'
    const event: AudioEvent = {
      type: 'error',
      handle: { ...instance.handle },
      error: message,
    }
    instance.listeners.forEach((callback) => callback(event))
  }
}

/**
 * Create a mock audio adapter
 */
export function createMockAudio(config?: AudioAdapterConfig): MockAudioAdapter {
  return new MockAudioAdapter(config)
}
