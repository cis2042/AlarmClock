import type { AppSettings } from './types'
import { ALARM_SOUNDS } from './audio-system'

const DEFAULT_SETTINGS: AppSettings = {
  defaultSnoozeMinutes: 9,
  volume: 0.7,
  notificationsEnabled: true,
  soundEnabled: true,
  selectedSoundId: 'gentle-chimes'
}

const SETTINGS_KEY = 'alarm-app-settings'

export class SettingsManager {
  private settings: AppSettings
  private listeners: Set<(settings: AppSettings) => void> = new Set()

  constructor() {
    this.settings = this.loadSettings()
  }

  private loadSettings(): AppSettings {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Merge with defaults to handle new settings
        return { ...DEFAULT_SETTINGS, ...parsed }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
    return { ...DEFAULT_SETTINGS }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings))
      this.notifyListeners()
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getSettings())
      } catch (error) {
        console.error('Settings listener error:', error)
      }
    })
  }

  public getSettings(): AppSettings {
    return { ...this.settings }
  }

  public updateSettings(updates: Partial<AppSettings>): void {
    const oldSettings = { ...this.settings }
    this.settings = { ...this.settings, ...updates }
    
    // Validate settings
    this.validateSettings()
    
    this.saveSettings()
    
    console.log('Settings updated:', { old: oldSettings, new: this.settings })
  }

  private validateSettings(): void {
    // Validate volume
    if (this.settings.volume < 0 || this.settings.volume > 1) {
      this.settings.volume = Math.max(0, Math.min(1, this.settings.volume))
    }

    // Validate snooze minutes
    if (this.settings.defaultSnoozeMinutes < 1 || this.settings.defaultSnoozeMinutes > 60) {
      this.settings.defaultSnoozeMinutes = Math.max(1, Math.min(60, this.settings.defaultSnoozeMinutes))
    }

    // Validate sound ID
    const validSoundIds = ALARM_SOUNDS.map(s => s.id)
    if (!validSoundIds.includes(this.settings.selectedSoundId)) {
      this.settings.selectedSoundId = DEFAULT_SETTINGS.selectedSoundId
    }
  }

  public resetToDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS }
    this.saveSettings()
  }

  public exportSettings(): string {
    return JSON.stringify(this.settings, null, 2)
  }

  public importSettings(settingsJson: string): boolean {
    try {
      const imported = JSON.parse(settingsJson)
      
      // Validate imported settings
      if (typeof imported === 'object' && imported !== null) {
        this.updateSettings(imported)
        return true
      }
    } catch (error) {
      console.error('Failed to import settings:', error)
    }
    return false
  }

  public addListener(listener: (settings: AppSettings) => void): void {
    this.listeners.add(listener)
  }

  public removeListener(listener: (settings: AppSettings) => void): void {
    this.listeners.delete(listener)
  }

  // Convenience getters
  public getVolume(): number {
    return this.settings.volume
  }

  public getDefaultSnoozeMinutes(): number {
    return this.settings.defaultSnoozeMinutes
  }

  public isNotificationsEnabled(): boolean {
    return this.settings.notificationsEnabled
  }

  public isSoundEnabled(): boolean {
    return this.settings.soundEnabled
  }

  public getSelectedSoundId(): string {
    return this.settings.selectedSoundId
  }

  // Convenience setters
  public setVolume(volume: number): void {
    this.updateSettings({ volume })
  }

  public setDefaultSnoozeMinutes(minutes: number): void {
    this.updateSettings({ defaultSnoozeMinutes: minutes })
  }

  public setNotificationsEnabled(enabled: boolean): void {
    this.updateSettings({ notificationsEnabled: enabled })
  }

  public setSoundEnabled(enabled: boolean): void {
    this.updateSettings({ soundEnabled: enabled })
  }

  public setSelectedSoundId(soundId: string): void {
    this.updateSettings({ selectedSoundId: soundId })
  }
}

// Settings validation utilities
export const SettingsValidation = {
  isValidVolume: (volume: number): boolean => {
    return typeof volume === 'number' && volume >= 0 && volume <= 1
  },

  isValidSnoozeMinutes: (minutes: number): boolean => {
    return typeof minutes === 'number' && minutes >= 1 && minutes <= 60
  },

  isValidSoundId: (soundId: string): boolean => {
    return ALARM_SOUNDS.some(sound => sound.id === soundId)
  },

  isValidSettings: (settings: any): boolean => {
    if (typeof settings !== 'object' || settings === null) {
      return false
    }

    const required = ['defaultSnoozeMinutes', 'volume', 'notificationsEnabled', 'soundEnabled', 'selectedSoundId']
    return required.every(key => key in settings)
  }
}

// Singleton instance
export const settingsManager = new SettingsManager()
