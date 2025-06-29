export enum ErrorType {
  AUDIO_PERMISSION_DENIED = 'AUDIO_PERMISSION_DENIED',
  NOTIFICATION_PERMISSION_DENIED = 'NOTIFICATION_PERMISSION_DENIED',
  AUDIO_PLAYBACK_FAILED = 'AUDIO_PLAYBACK_FAILED',
  STORAGE_ERROR = 'STORAGE_ERROR',
  SERVICE_WORKER_ERROR = 'SERVICE_WORKER_ERROR',
  ALARM_TRIGGER_FAILED = 'ALARM_TRIGGER_FAILED',
  TIMEZONE_ERROR = 'TIMEZONE_ERROR',
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED'
}

export interface AppError {
  type: ErrorType
  message: string
  details?: any
  timestamp: Date
  userMessage: string
  recoverable: boolean
}

export class ErrorHandler {
  private errors: AppError[] = []
  private maxErrors = 50

  public handleError(type: ErrorType, message: string, details?: any): AppError {
    const error: AppError = {
      type,
      message,
      details,
      timestamp: new Date(),
      userMessage: this.getUserMessage(type),
      recoverable: this.isRecoverable(type)
    }

    this.logError(error)
    this.storeError(error)

    return error
  }

  private getUserMessage(type: ErrorType): string {
    switch (type) {
      case ErrorType.AUDIO_PERMISSION_DENIED:
        return 'Audio permissions are required for alarm sounds. Please enable audio permissions in your browser settings.'
      
      case ErrorType.NOTIFICATION_PERMISSION_DENIED:
        return 'Notification permissions help ensure you don\'t miss alarms. You can enable them in browser settings.'
      
      case ErrorType.AUDIO_PLAYBACK_FAILED:
        return 'Failed to play alarm sound. Check your audio settings and try again.'
      
      case ErrorType.STORAGE_ERROR:
        return 'Failed to save alarm data. Your alarms may not persist between sessions.'
      
      case ErrorType.SERVICE_WORKER_ERROR:
        return 'Background alarm monitoring is not available. Alarms may not work when the app is closed.'
      
      case ErrorType.ALARM_TRIGGER_FAILED:
        return 'Failed to trigger alarm properly. Please check your permissions and settings.'
      
      case ErrorType.TIMEZONE_ERROR:
        return 'Timezone detection failed. Alarms may not trigger at the correct time.'
      
      case ErrorType.BROWSER_NOT_SUPPORTED:
        return 'Some features may not work in this browser. For best experience, use a modern browser.'
      
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  private isRecoverable(type: ErrorType): boolean {
    switch (type) {
      case ErrorType.AUDIO_PERMISSION_DENIED:
      case ErrorType.NOTIFICATION_PERMISSION_DENIED:
      case ErrorType.AUDIO_PLAYBACK_FAILED:
      case ErrorType.ALARM_TRIGGER_FAILED:
        return true
      
      case ErrorType.STORAGE_ERROR:
      case ErrorType.SERVICE_WORKER_ERROR:
      case ErrorType.TIMEZONE_ERROR:
      case ErrorType.BROWSER_NOT_SUPPORTED:
        return false
      
      default:
        return false
    }
  }

  private logError(error: AppError): void {
    console.error(`[${error.type}] ${error.message}`, error.details)
  }

  private storeError(error: AppError): void {
    this.errors.unshift(error)
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
    }

    // Store in localStorage for debugging
    try {
      localStorage.setItem('alarm-app-errors', JSON.stringify(this.errors.slice(0, 10)))
    } catch (e) {
      // Ignore storage errors when storing errors
    }
  }

  public getRecentErrors(): AppError[] {
    return [...this.errors]
  }

  public clearErrors(): void {
    this.errors = []
    try {
      localStorage.removeItem('alarm-app-errors')
    } catch (e) {
      // Ignore
    }
  }

  public getErrorSummary(): { [key in ErrorType]?: number } {
    const summary: { [key in ErrorType]?: number } = {}
    
    for (const error of this.errors) {
      summary[error.type] = (summary[error.type] || 0) + 1
    }
    
    return summary
  }
}

// Browser compatibility checker
export class CompatibilityChecker {
  public checkBrowserSupport(): { supported: boolean; issues: string[] } {
    const issues: string[] = []

    // Check for required APIs
    if (!('Notification' in window)) {
      issues.push('Browser notifications not supported')
    }

    if (!('serviceWorker' in navigator)) {
      issues.push('Service Worker not supported')
    }

    if (!('AudioContext' in window) && !('webkitAudioContext' in window)) {
      issues.push('Web Audio API not supported')
    }

    if (!('localStorage' in window)) {
      issues.push('Local storage not supported')
    }

    if (!('requestPermission' in Notification)) {
      issues.push('Notification permission API not supported')
    }

    // Check for modern JavaScript features
    try {
      new Function('async () => {}')
    } catch (e) {
      issues.push('Modern JavaScript features not supported')
    }

    return {
      supported: issues.length === 0,
      issues
    }
  }

  public checkTimezoneSupport(): boolean {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      return Boolean(timezone)
    } catch (e) {
      return false
    }
  }

  public getUserTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch (e) {
      return 'UTC'
    }
  }
}

// Timezone utilities
export class TimezoneHandler {
  private userTimezone: string

  constructor() {
    this.userTimezone = this.detectTimezone()
  }

  private detectTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch (e) {
      console.warn('Failed to detect timezone, using UTC')
      return 'UTC'
    }
  }

  public getCurrentTime(): Date {
    return new Date()
  }

  public formatTimeForAlarm(date: Date): string {
    try {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: this.userTimezone
      })
    } catch (e) {
      // Fallback to basic formatting
      return date.toTimeString().slice(0, 5)
    }
  }

  public getTimezoneOffset(): number {
    return new Date().getTimezoneOffset()
  }

  public getUserTimezone(): string {
    return this.userTimezone
  }
}

// Recovery strategies
export class RecoveryManager {
  private errorHandler: ErrorHandler
  private retryAttempts: Map<string, number> = new Map()
  private maxRetries = 3

  constructor(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler
  }

  public async retryOperation<T>(
    operation: () => Promise<T>,
    operationId: string,
    errorType: ErrorType
  ): Promise<T | null> {
    const attempts = this.retryAttempts.get(operationId) || 0

    if (attempts >= this.maxRetries) {
      this.errorHandler.handleError(
        errorType,
        `Max retry attempts reached for ${operationId}`,
        { attempts }
      )
      return null
    }

    try {
      const result = await operation()
      this.retryAttempts.delete(operationId) // Reset on success
      return result
    } catch (error) {
      this.retryAttempts.set(operationId, attempts + 1)
      
      this.errorHandler.handleError(
        errorType,
        `Operation failed: ${operationId}`,
        { error, attempt: attempts + 1 }
      )

      // Exponential backoff
      const delay = Math.pow(2, attempts) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))

      return this.retryOperation(operation, operationId, errorType)
    }
  }

  public resetRetries(operationId: string): void {
    this.retryAttempts.delete(operationId)
  }

  public getRetryCount(operationId: string): number {
    return this.retryAttempts.get(operationId) || 0
  }
}

// Singleton instances
export const errorHandler = new ErrorHandler()
export const compatibilityChecker = new CompatibilityChecker()
export const timezoneHandler = new TimezoneHandler()
export const recoveryManager = new RecoveryManager(errorHandler)
