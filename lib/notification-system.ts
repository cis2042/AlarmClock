import type { AlarmTriggerEvent } from './types'

export interface NotificationPermissionState {
  granted: boolean
  denied: boolean
  prompt: boolean
}

export class NotificationSystem {
  private permission: NotificationPermission = 'default'
  private activeNotifications: Map<string, Notification> = new Map()

  constructor() {
    this.checkPermission()
  }

  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    if (this.permission === 'denied') {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  public getPermissionState(): NotificationPermissionState {
    return {
      granted: this.permission === 'granted',
      denied: this.permission === 'denied',
      prompt: this.permission === 'default'
    }
  }

  public async showAlarmNotification(event: AlarmTriggerEvent): Promise<void> {
    if (!this.canShowNotifications()) {
      console.warn('Cannot show notifications - permission not granted')
      return
    }

    try {
      // Close any existing notification for this alarm
      this.closeNotification(event.alarm.id)

      const notification = new Notification('Alarm Clock', {
        body: event.message,
        icon: '/placeholder-logo.png',
        badge: '/placeholder-logo.png',
        tag: event.alarm.id,
        requireInteraction: true,
        actions: [
          {
            action: 'snooze',
            title: 'Snooze (9 min)'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ],
        data: {
          alarmId: event.alarm.id,
          triggerTime: event.triggerTime.toISOString()
        }
      })

      // Store the notification
      this.activeNotifications.set(event.alarm.id, notification)

      // Handle notification clicks
      notification.onclick = () => {
        this.handleNotificationClick(event.alarm.id)
      }

      // Handle notification close
      notification.onclose = () => {
        this.activeNotifications.delete(event.alarm.id)
      }

      // Handle notification errors
      notification.onerror = (error) => {
        console.error('Notification error:', error)
        this.activeNotifications.delete(event.alarm.id)
      }

      // Auto-close after 30 seconds if not interacted with
      setTimeout(() => {
        if (this.activeNotifications.has(event.alarm.id)) {
          notification.close()
        }
      }, 30000)

    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  public closeNotification(alarmId: string): void {
    const notification = this.activeNotifications.get(alarmId)
    if (notification) {
      notification.close()
      this.activeNotifications.delete(alarmId)
    }
  }

  public closeAllNotifications(): void {
    for (const [alarmId, notification] of this.activeNotifications) {
      notification.close()
    }
    this.activeNotifications.clear()
  }

  private canShowNotifications(): boolean {
    return 'Notification' in window && this.permission === 'granted'
  }

  private handleNotificationClick(alarmId: string): void {
    // Focus the window when notification is clicked
    if (window.focus) {
      window.focus()
    }

    // Close the notification
    this.closeNotification(alarmId)

    // Dispatch custom event for the app to handle
    window.dispatchEvent(new CustomEvent('alarm-notification-click', {
      detail: { alarmId }
    }))
  }

  public setupNotificationActionHandlers(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'notification-action') {
          const { action, alarmId } = event.data
          
          // Dispatch custom event for the app to handle
          window.dispatchEvent(new CustomEvent('alarm-notification-action', {
            detail: { action, alarmId }
          }))
        }
      })
    }
  }

  public async showTestNotification(): Promise<void> {
    if (!this.canShowNotifications()) {
      throw new Error('Notifications not permitted')
    }

    const notification = new Notification('Alarm Clock Test', {
      body: 'This is a test notification. Your alarms will work!',
      icon: '/placeholder-logo.png',
      tag: 'test-notification'
    })

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close()
    }, 5000)
  }

  public isSupported(): boolean {
    return 'Notification' in window
  }

  public async checkAndRequestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    if (this.permission === 'denied') {
      return false
    }

    return await this.requestPermission()
  }
}

// Singleton instance
export const notificationSystem = new NotificationSystem()

// Set up notification action handlers when the module loads
if (typeof window !== 'undefined') {
  notificationSystem.setupNotificationActionHandlers()
}
