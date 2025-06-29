"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Sun, Moon, Bell, Settings } from "lucide-react"
import AlarmItem from "@/components/alarm-item"
import AlarmModal from "@/components/alarm-modal"
import type { Alarm, AlarmTriggerEvent } from "@/lib/types"
import { alarmEngine } from "@/lib/alarm-engine"
import { audioSystem } from "@/lib/audio-system"
import { notificationSystem } from "@/lib/notification-system"
import { toast } from "sonner"

export default function AlarmClockHome() {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeAlarm, setActiveAlarm] = useState<AlarmTriggerEvent | null>(null)
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false)
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Load alarms from local storage
    const savedAlarms = localStorage.getItem("alarms")
    if (savedAlarms) {
      const loadedAlarms = JSON.parse(savedAlarms)
      setAlarms(loadedAlarms)
      alarmEngine.updateAlarms(loadedAlarms)
    }

    // Initialize permissions
    initializePermissions()

    // Start alarm engine
    alarmEngine.start(handleAlarmTrigger)

    return () => {
      clearInterval(timer)
      alarmEngine.stop()
      audioSystem.dispose()
    }
  }, [])

  useEffect(() => {
    // Save alarms to local storage whenever they change
    localStorage.setItem("alarms", JSON.stringify(alarms))
    alarmEngine.updateAlarms(alarms)
  }, [alarms])

  const initializePermissions = async () => {
    try {
      // Request notification permissions
      const notificationGranted = await notificationSystem.checkAndRequestPermission()

      // Request audio permissions
      const audioGranted = await audioSystem.requestAudioPermissions()

      setPermissionsGranted(notificationGranted && audioGranted)

      if (!notificationGranted) {
        toast.warning("Notifications disabled. You may miss alarms when the app is not visible.")
      }

      if (!audioGranted) {
        toast.warning("Audio permissions not granted. Alarms may not play sounds.")
      }
    } catch (error) {
      console.error("Failed to initialize permissions:", error)
      toast.error("Failed to set up alarm permissions")
    }
  }

  const handleAlarmTrigger = async (event: AlarmTriggerEvent) => {
    try {
      // Set active alarm and show modal
      setActiveAlarm(event)
      setIsAlarmModalOpen(true)

      // Play alarm sound
      await audioSystem.playAlarmSound()

      // Show browser notification
      await notificationSystem.showAlarmNotification(event)

      // Show toast notification as backup
      toast.info(`Alarm: ${event.message}`, {
        duration: 10000,
        action: {
          label: "Dismiss",
          onClick: () => handleDismissAlarm()
        }
      })
    } catch (error) {
      console.error("Failed to trigger alarm:", error)
      toast.error("Alarm trigger failed")
    }
  }

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map((alarm) => (alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm)))
  }

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id))
  }

  const handleSnoozeAlarm = (minutes?: number) => {
    if (activeAlarm) {
      alarmEngine.snoozeAlarm(activeAlarm.alarm.id, minutes)
      audioSystem.stopAlarmSound()
      notificationSystem.closeNotification(activeAlarm.alarm.id)
      setIsAlarmModalOpen(false)
      setActiveAlarm(null)
      toast.success(`Alarm snoozed for ${minutes || 9} minutes`)
    }
  }

  const handleDismissAlarm = () => {
    if (activeAlarm) {
      alarmEngine.dismissAlarm(activeAlarm.alarm.id)
      audioSystem.stopAlarmSound()
      notificationSystem.closeNotification(activeAlarm.alarm.id)
      setIsAlarmModalOpen(false)
      setActiveAlarm(null)
      toast.success("Alarm dismissed")
    }
  }

  const handleCloseAlarmModal = () => {
    // Allow closing modal but keep alarm ringing
    setIsAlarmModalOpen(false)
  }

  const greeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 bg-background">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            {currentTime.getHours() < 6 || currentTime.getHours() >= 20 ? <Moon /> : <Sun />}
            <span>{greeting()}</span>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </h1>
        </header>

        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Alarms</h2>
              <div className="flex gap-2">
                {!permissionsGranted && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={initializePermissions}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Enable Permissions
                  </Button>
                )}
                <Link href="/settings" passHref>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Button>
                </Link>
                <Link href="/add-alarm" passHref>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Alarm
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {alarms.length > 0 ? (
            alarms.map((alarm) => (
              <AlarmItem
                key={alarm.id}
                alarm={alarm}
                onToggle={() => toggleAlarm(alarm.id)}
                onDelete={() => deleteAlarm(alarm.id)}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <p>No alarms set.</p>
              <p>Click "Add Alarm" to get started.</p>
            </div>
          )}
        </div>

        {/* Alarm Modal */}
        <AlarmModal
          isOpen={isAlarmModalOpen}
          alarmEvent={activeAlarm}
          onSnooze={handleSnoozeAlarm}
          onDismiss={handleDismissAlarm}
          onClose={handleCloseAlarmModal}
        />
      </div>
    </div>
  )
}
