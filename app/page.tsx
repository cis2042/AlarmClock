"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Sun, Moon } from "lucide-react"
import AlarmItem from "@/components/alarm-item"
import type { Alarm } from "@/lib/types"

export default function AlarmClockHome() {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Load alarms from local storage
    const savedAlarms = localStorage.getItem("alarms")
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms))
    }

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Save alarms to local storage whenever they change
    localStorage.setItem("alarms", JSON.stringify(alarms))
  }, [alarms])

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map((alarm) => (alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm)))
  }

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id))
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
              <Link href="/add-alarm" passHref>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Alarm
                </Button>
              </Link>
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
      </div>
    </div>
  )
}
