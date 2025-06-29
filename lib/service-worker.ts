export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null
  private isSupported = false

  constructor() {
    this.isSupported = 'serviceWorker' in navigator
  }

  public async register(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Service Worker not supported')
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registered successfully:', this.registration)

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('New service worker version available')
            }
          })
        }
      })

      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  public async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const result = await this.registration.unregister()
      this.registration = null
      return result
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
      return false
    }
  }

  public sendMessage(message: any): void {
    if (!this.registration || !this.registration.active) {
      console.warn('Service Worker not active, cannot send message')
      return
    }

    this.registration.active.postMessage(message)
  }

  public startAlarmMonitoring(): void {
    this.sendMessage({
      type: 'start-monitoring'
    })
  }

  public stopAlarmMonitoring(): void {
    this.sendMessage({
      type: 'stop-monitoring'
    })
  }

  public updateAlarms(alarms: any[]): void {
    this.sendMessage({
      type: 'update-alarms',
      data: alarms
    })
  }

  public isRegistered(): boolean {
    return this.registration !== null
  }

  public isServiceWorkerSupported(): boolean {
    return this.isSupported
  }

  public async getRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported) {
      return null
    }

    try {
      return await navigator.serviceWorker.getRegistration()
    } catch (error) {
      console.error('Failed to get service worker registration:', error)
      return null
    }
  }

  public setupMessageListener(callback: (event: MessageEvent) => void): void {
    if (!this.isSupported) {
      return
    }

    navigator.serviceWorker.addEventListener('message', callback)
  }

  public removeMessageListener(callback: (event: MessageEvent) => void): void {
    if (!this.isSupported) {
      return
    }

    navigator.serviceWorker.removeEventListener('message', callback)
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManager()
