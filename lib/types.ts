export type Day = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"

export interface Alarm {
  id: string
  time: string
  repeat: Day[]
  messageType: string
  characterId: string
  enabled: boolean
  lastTriggered?: string // ISO string of last trigger time
  snoozedUntil?: string // ISO string of snooze end time
}

export interface AlarmTriggerEvent {
  alarm: Alarm
  triggerTime: Date
  message: string
}

export interface AppSettings {
  defaultSnoozeMinutes: number
  volume: number
  notificationsEnabled: boolean
  soundEnabled: boolean
  selectedSoundId: string
}
