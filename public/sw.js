// Service Worker for Alarm Clock App
// Handles background alarm monitoring and notifications

const CACHE_NAME = 'alarm-clock-v1'
const ALARM_CHECK_INTERVAL = 30000 // 30 seconds

// Cache essential files
const urlsToCache = [
  '/',
  '/add-alarm',
  '/manifest.json',
  '/placeholder-logo.png'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Background sync for alarm checking
let alarmCheckInterval = null

// Start alarm monitoring
function startAlarmMonitoring() {
  if (alarmCheckInterval) {
    clearInterval(alarmCheckInterval)
  }

  alarmCheckInterval = setInterval(() => {
    checkAlarms()
  }, ALARM_CHECK_INTERVAL)
}

// Stop alarm monitoring
function stopAlarmMonitoring() {
  if (alarmCheckInterval) {
    clearInterval(alarmCheckInterval)
    alarmCheckInterval = null
  }
}

// Check for triggered alarms
async function checkAlarms() {
  try {
    // Get alarms from IndexedDB or localStorage
    const alarms = await getStoredAlarms()
    if (!alarms || alarms.length === 0) {
      return
    }

    const now = new Date()
    const currentTime = formatTime(now)
    const currentDay = getCurrentDay(now)

    for (const alarm of alarms) {
      if (shouldTriggerAlarm(alarm, now, currentTime, currentDay)) {
        await triggerBackgroundAlarm(alarm)
      }
    }
  } catch (error) {
    console.error('Error checking alarms in service worker:', error)
  }
}

// Get stored alarms (fallback implementation)
async function getStoredAlarms() {
  try {
    // Try to get from IndexedDB first, then localStorage
    // This is a simplified implementation
    return []
  } catch (error) {
    console.error('Error getting stored alarms:', error)
    return []
  }
}

// Check if alarm should trigger
function shouldTriggerAlarm(alarm, now, currentTime, currentDay) {
  if (!alarm.enabled) return false
  
  // Check if snoozed
  if (alarm.snoozedUntil) {
    const snoozeEnd = new Date(alarm.snoozedUntil)
    if (now < snoozeEnd) return false
  }

  // Check time match (within 1 minute)
  if (!isTimeMatch(alarm.time, currentTime)) return false

  // Check day match
  if (!isDayMatch(alarm, currentDay)) return false

  // Check if already triggered today
  if (wasTriggeredToday(alarm, now)) return false

  return true
}

// Time matching logic
function isTimeMatch(alarmTime, currentTime) {
  const alarmMinutes = timeToMinutes(alarmTime)
  const currentMinutes = timeToMinutes(currentTime)
  return Math.abs(currentMinutes - alarmMinutes) <= 1
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Day matching logic
function isDayMatch(alarm, currentDay) {
  if (alarm.repeat.length === 0) return true
  return alarm.repeat.includes(currentDay)
}

// Check if triggered today
function wasTriggeredToday(alarm, now) {
  if (!alarm.lastTriggered) return false
  
  const lastTrigger = new Date(alarm.lastTriggered)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const triggerDate = new Date(lastTrigger.getFullYear(), lastTrigger.getMonth(), lastTrigger.getDate())
  
  return triggerDate.getTime() === today.getTime()
}

// Trigger background alarm
async function triggerBackgroundAlarm(alarm) {
  try {
    // Show notification
    await self.registration.showNotification('Alarm Clock', {
      body: generateSimpleMessage(alarm),
      icon: '/placeholder-logo.png',
      badge: '/placeholder-logo.png',
      tag: alarm.id,
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
        alarmId: alarm.id,
        triggerTime: new Date().toISOString()
      }
    })

    // Update last triggered time
    await updateAlarmLastTriggered(alarm.id)

  } catch (error) {
    console.error('Error triggering background alarm:', error)
  }
}

// Generate simple message for background notifications
function generateSimpleMessage(alarm) {
  const time = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
  return `Time to wake up! It's ${time}.`
}

// Update alarm last triggered time
async function updateAlarmLastTriggered(alarmId) {
  // This would update the alarm in storage
  // Implementation depends on storage method used
}

// Utility functions
function formatTime(date) {
  return date.toTimeString().slice(0, 5)
}

function getCurrentDay(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[date.getDay()]
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const { action, data } = event
  const { alarmId } = data || {}

  if (action === 'snooze') {
    // Handle snooze action
    handleSnoozeAction(alarmId)
  } else if (action === 'dismiss') {
    // Handle dismiss action
    handleDismissAction(alarmId)
  } else {
    // Default click - open app
    event.waitUntil(
      clients.openWindow('/')
    )
  }

  // Send message to main app
  event.waitUntil(
    sendMessageToClients({
      type: 'notification-action',
      action: action || 'click',
      alarmId
    })
  )
})

// Handle snooze action
async function handleSnoozeAction(alarmId) {
  // Implementation for snoozing alarm
  console.log('Snoozing alarm:', alarmId)
}

// Handle dismiss action
async function handleDismissAction(alarmId) {
  // Implementation for dismissing alarm
  console.log('Dismissing alarm:', alarmId)
}

// Send message to all clients
async function sendMessageToClients(message) {
  const clients = await self.clients.matchAll()
  clients.forEach(client => {
    client.postMessage(message)
  })
}

// Handle messages from main app
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {}

  switch (type) {
    case 'start-monitoring':
      startAlarmMonitoring()
      break
    case 'stop-monitoring':
      stopAlarmMonitoring()
      break
    case 'update-alarms':
      // Handle alarm updates
      break
    default:
      console.log('Unknown message type:', type)
  }
})

// Start monitoring when service worker activates
self.addEventListener('activate', () => {
  startAlarmMonitoring()
})
