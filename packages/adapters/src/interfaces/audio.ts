/**
 * Audio adapter interface
 * Platform-agnostic audio playback abstraction
 */

/**
 * Audio playback state
 */
export type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'

/**
 * Audio playback options
 */
export interface AudioOptions {
  /** Initial volume (0-1) */
  volume?: number
  /** Playback rate (0.5-2.0 typically) */
  playbackRate?: number
  /** Start position in seconds */
  startTime?: number
  /** Whether to loop playback */
  loop?: boolean
  /** Preload strategy */
  preload?: 'none' | 'metadata' | 'auto'
}

/**
 * Audio handle returned by play()
 * Used to control an active audio instance
 */
export interface IAudioHandle {
  /** Unique identifier for this playback instance */
  id: string
  /** Source URL */
  url: string
  /** Current playback state */
  state: AudioState
}

/**
 * Audio playback event data
 */
export interface AudioEvent {
  /** Event type */
  type: 'statechange' | 'timeupdate' | 'ended' | 'error' | 'loaded'
  /** Audio handle */
  handle: IAudioHandle
  /** Current playback time in seconds */
  currentTime?: number
  /** Total duration in seconds */
  duration?: number
  /** Error message (if type is 'error') */
  error?: string
}

/**
 * Audio event callback
 */
export type AudioEventCallback = (event: AudioEvent) => void

/**
 * Audio metadata
 */
export interface AudioMetadata {
  /** Duration in seconds */
  duration: number
  /** Sample rate in Hz */
  sampleRate?: number
  /** Number of audio channels */
  channels?: number
  /** File format */
  format?: string
}

/**
 * Audio adapter interface
 */
export interface IAudioAdapter {
  // Playback control
  /**
   * Start playing audio from a URL
   * @param url - Audio source URL
   * @param options - Playback options
   * @returns Audio handle for controlling playback
   */
  play(url: string, options?: AudioOptions): Promise<IAudioHandle>

  /**
   * Pause playback
   * @param handle - Audio handle from play()
   */
  pause(handle: IAudioHandle): Promise<void>

  /**
   * Resume paused playback
   * @param handle - Audio handle from play()
   */
  resume(handle: IAudioHandle): Promise<void>

  /**
   * Stop playback and release resources
   * @param handle - Audio handle from play()
   */
  stop(handle: IAudioHandle): Promise<void>

  // Seek and position
  /**
   * Get current playback position
   * @param handle - Audio handle
   * @returns Current time in seconds
   */
  getCurrentTime(handle: IAudioHandle): Promise<number>

  /**
   * Seek to a position
   * @param handle - Audio handle
   * @param time - Position in seconds
   */
  setCurrentTime(handle: IAudioHandle, time: number): Promise<void>

  /**
   * Get audio duration
   * @param handle - Audio handle or URL
   * @returns Duration in seconds
   */
  getDuration(handle: IAudioHandle | string): Promise<number>

  // Volume control
  /**
   * Get current volume
   * @param handle - Audio handle
   * @returns Volume (0-1)
   */
  getVolume(handle: IAudioHandle): Promise<number>

  /**
   * Set volume
   * @param handle - Audio handle
   * @param volume - Volume (0-1)
   */
  setVolume(handle: IAudioHandle, volume: number): Promise<void>

  /**
   * Mute audio
   * @param handle - Audio handle
   */
  mute(handle: IAudioHandle): Promise<void>

  /**
   * Unmute audio
   * @param handle - Audio handle
   */
  unmute(handle: IAudioHandle): Promise<void>

  // Playback rate
  /**
   * Get current playback rate
   * @param handle - Audio handle
   * @returns Playback rate (1.0 = normal)
   */
  getPlaybackRate(handle: IAudioHandle): Promise<number>

  /**
   * Set playback rate
   * @param handle - Audio handle
   * @param rate - Playback rate (0.5-2.0 typically)
   */
  setPlaybackRate(handle: IAudioHandle, rate: number): Promise<void>

  // Metadata
  /**
   * Get audio metadata
   * @param url - Audio URL
   */
  getMetadata(url: string): Promise<AudioMetadata>

  // Preloading
  /**
   * Preload audio for faster playback
   * @param url - Audio URL
   */
  preload(url: string): Promise<void>

  /**
   * Cancel preloading
   * @param url - Audio URL
   */
  cancelPreload(url: string): Promise<void>

  // Events
  /**
   * Subscribe to playback events
   * @param handle - Audio handle
   * @param callback - Event callback
   * @returns Cleanup function
   */
  onPlaybackChange(handle: IAudioHandle, callback: AudioEventCallback): () => void

  // Cleanup
  /**
   * Stop all playback and release all resources
   */
  dispose(): Promise<void>
}

/**
 * Audio error codes
 */
export type AudioErrorCode =
  | 'NOT_SUPPORTED'
  | 'NETWORK_ERROR'
  | 'DECODE_ERROR'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'ABORTED'
  | 'UNKNOWN'

/**
 * Audio error class
 */
export class AudioError extends Error {
  constructor(
    message: string,
    public readonly code: AudioErrorCode
  ) {
    super(message)
    this.name = 'AudioError'
  }
}

/**
 * Audio adapter configuration
 */
export interface AudioAdapterConfig {
  /** Default volume (0-1) */
  defaultVolume?: number
  /** Default playback rate */
  defaultPlaybackRate?: number
  /** Enable audio buffering */
  buffering?: boolean
  /** Buffer size in seconds */
  bufferSize?: number
}
