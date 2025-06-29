export interface AlarmSound {
  id: string
  name: string
  url: string
  duration?: number
}

export const ALARM_SOUNDS: AlarmSound[] = [
  {
    id: 'gentle-chimes',
    name: 'Gentle Chimes',
    url: '/sounds/gentle-chimes.mp3',
    duration: 30
  },
  {
    id: 'morning-birds',
    name: 'Morning Birds',
    url: '/sounds/morning-birds.mp3',
    duration: 45
  },
  {
    id: 'soft-piano',
    name: 'Soft Piano',
    url: '/sounds/soft-piano.mp3',
    duration: 60
  },
  {
    id: 'nature-sounds',
    name: 'Nature Sounds',
    url: '/sounds/nature-sounds.mp3',
    duration: 90
  },
  {
    id: 'classic-alarm',
    name: 'Classic Alarm',
    url: '/sounds/classic-alarm.mp3',
    duration: 15
  },
  {
    id: 'digital-beep',
    name: 'Digital Beep',
    url: '/sounds/digital-beep.mp3',
    duration: 10
  }
]

export class AudioSystem {
  private audioContext: AudioContext | null = null
  private currentAudio: HTMLAudioElement | null = null
  private gainNode: GainNode | null = null
  private isPlaying = false
  private volume = 0.7
  private fadeInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeAudioContext()
  }

  private async initializeAudioContext(): Promise<void> {
    try {
      // Create AudioContext for better control
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
      this.gainNode.gain.value = this.volume
    } catch (error) {
      console.warn('AudioContext not supported, falling back to HTML5 audio:', error)
    }
  }

  public async playAlarmSound(soundId: string = 'gentle-chimes'): Promise<void> {
    try {
      // Stop any currently playing sound
      this.stopAlarmSound()

      const sound = ALARM_SOUNDS.find(s => s.id === soundId) || ALARM_SOUNDS[0]
      
      // Create new audio element
      this.currentAudio = new Audio(sound.url)
      this.currentAudio.loop = true
      this.currentAudio.volume = this.volume

      // Handle audio loading and playing
      await new Promise<void>((resolve, reject) => {
        if (!this.currentAudio) {
          reject(new Error('Audio element not created'))
          return
        }

        this.currentAudio.addEventListener('canplaythrough', () => {
          resolve()
        }, { once: true })

        this.currentAudio.addEventListener('error', (e) => {
          reject(new Error(`Failed to load audio: ${e}`))
        }, { once: true })

        this.currentAudio.load()
      })

      // Resume AudioContext if suspended (required by some browsers)
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Play the audio
      await this.currentAudio.play()
      this.isPlaying = true

      // Start fade-in effect
      this.fadeIn()

    } catch (error) {
      console.error('Failed to play alarm sound:', error)
      // Fallback to system beep or notification
      this.playFallbackSound()
    }
  }

  public stopAlarmSound(): void {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
      this.fadeInterval = null
    }

    this.isPlaying = false
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume
    }
    
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume
    }
  }

  public getVolume(): number {
    return this.volume
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }

  private fadeIn(): void {
    if (!this.currentAudio) return

    let currentVolume = 0
    this.currentAudio.volume = 0

    this.fadeInterval = setInterval(() => {
      if (!this.currentAudio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval)
        return
      }

      currentVolume += 0.05
      if (currentVolume >= this.volume) {
        currentVolume = this.volume
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval)
          this.fadeInterval = null
        }
      }

      this.currentAudio.volume = currentVolume
    }, 100)
  }

  public fadeOut(duration: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      if (!this.currentAudio) {
        resolve()
        return
      }

      const startVolume = this.currentAudio.volume
      const fadeStep = startVolume / (duration / 100)

      const fadeInterval = setInterval(() => {
        if (!this.currentAudio) {
          clearInterval(fadeInterval)
          resolve()
          return
        }

        this.currentAudio.volume = Math.max(0, this.currentAudio.volume - fadeStep)

        if (this.currentAudio.volume <= 0) {
          clearInterval(fadeInterval)
          this.stopAlarmSound()
          resolve()
        }
      }, 100)
    })
  }

  private playFallbackSound(): void {
    // Create a simple beep using Web Audio API
    if (this.audioContext) {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.5)

      // Repeat the beep
      setTimeout(() => {
        if (this.isPlaying) {
          this.playFallbackSound()
        }
      }, 1000)
    }
  }

  public async testSound(soundId: string): Promise<void> {
    try {
      const sound = ALARM_SOUNDS.find(s => s.id === soundId) || ALARM_SOUNDS[0]
      const testAudio = new Audio(sound.url)
      testAudio.volume = this.volume * 0.5 // Lower volume for testing
      
      await testAudio.play()
      
      // Stop after 3 seconds
      setTimeout(() => {
        testAudio.pause()
        testAudio.currentTime = 0
      }, 3000)
    } catch (error) {
      console.error('Failed to test sound:', error)
      throw error
    }
  }

  public async requestAudioPermissions(): Promise<boolean> {
    try {
      // Try to create and resume AudioContext
      if (!this.audioContext) {
        await this.initializeAudioContext()
      }

      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Test if we can play audio
      const testAudio = new Audio()
      testAudio.volume = 0
      await testAudio.play()
      testAudio.pause()

      return true
    } catch (error) {
      console.warn('Audio permissions not granted:', error)
      return false
    }
  }

  public dispose(): void {
    this.stopAlarmSound()
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Singleton instance
export const audioSystem = new AudioSystem()
