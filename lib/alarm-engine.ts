import type { Alarm, Day, AlarmTriggerEvent } from './types'
import { messageGenerator } from './message-generator'

export class AlarmEngine {
  private alarms: Alarm[] = []
  private checkInterval: NodeJS.Timeout | null = null
  private onAlarmTrigger: ((event: AlarmTriggerEvent) => void) | null = null
  private isRunning = false

  constructor() {
    this.loadAlarms()
  }

  private loadAlarms(): void {
    try {
      const savedAlarms = localStorage.getItem('alarms')
      if (savedAlarms) {
        this.alarms = JSON.parse(savedAlarms)
      }
    } catch (error) {
      console.error('Failed to load alarms from localStorage:', error)
      this.alarms = []
    }
  }

  private saveAlarms(): void {
    try {
      localStorage.setItem('alarms', JSON.stringify(this.alarms))
    } catch (error) {
      console.error('Failed to save alarms to localStorage:', error)
    }
  }

  public updateAlarms(newAlarms: Alarm[]): void {
    this.alarms = newAlarms
    this.saveAlarms()
  }

  public start(onTrigger: (event: AlarmTriggerEvent) => void): void {
    if (this.isRunning) {
      this.stop()
    }

    this.onAlarmTrigger = onTrigger
    this.isRunning = true
    
    // Check every 30 seconds for better accuracy
    this.checkInterval = setInterval(() => {
      this.checkAlarms()
    }, 30000)

    // Also check immediately
    this.checkAlarms()
  }

  public stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    this.isRunning = false
    this.onAlarmTrigger = null
  }

  private checkAlarms(): void {
    const now = new Date()
    const currentTime = this.formatTime(now)
    const currentDay = this.getCurrentDay(now)

    for (const alarm of this.alarms) {
      if (this.shouldTriggerAlarm(alarm, now, currentTime, currentDay)) {
        this.triggerAlarm(alarm, now)
      }
    }
  }

  private shouldTriggerAlarm(alarm: Alarm, now: Date, currentTime: string, currentDay: Day): boolean {
    // Check if alarm is enabled
    if (!alarm.enabled) {
      return false
    }

    // Check if alarm is snoozed
    if (alarm.snoozedUntil) {
      const snoozeEnd = new Date(alarm.snoozedUntil)
      if (now < snoozeEnd) {
        return false
      }
      // Clear snooze if time has passed
      this.clearSnooze(alarm.id)
    }

    // Check if time matches (within 1 minute window)
    if (!this.isTimeMatch(alarm.time, currentTime)) {
      return false
    }

    // Check if day matches
    if (!this.isDayMatch(alarm, currentDay)) {
      return false
    }

    // Check if already triggered today (for non-repeating alarms)
    if (this.wasTriggeredToday(alarm, now)) {
      return false
    }

    return true
  }

  private isTimeMatch(alarmTime: string, currentTime: string): boolean {
    // Convert both times to minutes for comparison
    const alarmMinutes = this.timeToMinutes(alarmTime)
    const currentMinutes = this.timeToMinutes(currentTime)
    
    // Allow 1-minute window for triggering
    return Math.abs(currentMinutes - alarmMinutes) <= 1
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private isDayMatch(alarm: Alarm, currentDay: Day): boolean {
    // If no repeat days specified, it's a one-time alarm
    if (alarm.repeat.length === 0) {
      return true
    }
    
    return alarm.repeat.includes(currentDay)
  }

  private wasTriggeredToday(alarm: Alarm, now: Date): boolean {
    if (!alarm.lastTriggered) {
      return false
    }

    const lastTrigger = new Date(alarm.lastTriggered)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const triggerDate = new Date(lastTrigger.getFullYear(), lastTrigger.getMonth(), lastTrigger.getDate())
    
    return triggerDate.getTime() === today.getTime()
  }

  private triggerAlarm(alarm: Alarm, triggerTime: Date): void {
    // Update last triggered time
    const updatedAlarm = {
      ...alarm,
      lastTriggered: triggerTime.toISOString()
    }

    // Update the alarm in the array
    const alarmIndex = this.alarms.findIndex(a => a.id === alarm.id)
    if (alarmIndex !== -1) {
      this.alarms[alarmIndex] = updatedAlarm
      this.saveAlarms()
    }

    // Generate message based on alarm type
    const message = this.generateAlarmMessage(alarm)

    // Create trigger event
    const triggerEvent: AlarmTriggerEvent = {
      alarm: updatedAlarm,
      triggerTime,
      message
    }

    // Call the trigger callback
    if (this.onAlarmTrigger) {
      this.onAlarmTrigger(triggerEvent)
    }
  }

  private generateAlarmMessage(alarm: Alarm): string {
    return messageGenerator.generateMessage(alarm)
  }

  public snoozeAlarm(alarmId: string, snoozeMinutes: number = 9): void {
    const alarm = this.alarms.find(a => a.id === alarmId)
    if (!alarm) return

    const snoozeUntil = new Date()
    snoozeUntil.setMinutes(snoozeUntil.getMinutes() + snoozeMinutes)

    const updatedAlarm = {
      ...alarm,
      snoozedUntil: snoozeUntil.toISOString()
    }

    const alarmIndex = this.alarms.findIndex(a => a.id === alarmId)
    if (alarmIndex !== -1) {
      this.alarms[alarmIndex] = updatedAlarm
      this.saveAlarms()
    }
  }

  public clearSnooze(alarmId: string): void {
    const alarm = this.alarms.find(a => a.id === alarmId)
    if (!alarm) return

    const updatedAlarm = {
      ...alarm,
      snoozedUntil: undefined
    }

    const alarmIndex = this.alarms.findIndex(a => a.id === alarmId)
    if (alarmIndex !== -1) {
      this.alarms[alarmIndex] = updatedAlarm
      this.saveAlarms()
    }
  }

  public dismissAlarm(alarmId: string): void {
    const alarm = this.alarms.find(a => a.id === alarmId)
    if (!alarm) return

    // For one-time alarms, disable them after dismissal
    if (alarm.repeat.length === 0) {
      const updatedAlarm = {
        ...alarm,
        enabled: false,
        snoozedUntil: undefined
      }

      const alarmIndex = this.alarms.findIndex(a => a.id === alarmId)
      if (alarmIndex !== -1) {
        this.alarms[alarmIndex] = updatedAlarm
        this.saveAlarms()
      }
    } else {
      // For repeating alarms, just clear snooze
      this.clearSnooze(alarmId)
    }
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5) // HH:MM format
  }

  private getCurrentDay(date: Date): Day {
    const days: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[date.getDay()]
  }

  public getAlarms(): Alarm[] {
    return [...this.alarms]
  }

  public isActive(): boolean {
    return this.isRunning
  }
}

// Singleton instance
export const alarmEngine = new AlarmEngine()
