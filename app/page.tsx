"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Sun, Moon, Sparkles } from "lucide-react"
import AlarmItem from "@/components/alarm-item"
import type { Alarm } from "@/lib/types"
import { useTheme } from "next-themes"

export default function AlarmClockHome() {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
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

  const getTimeBasedGradient = () => {
    const hour = currentTime.getHours()
    if (hour >= 5 && hour < 12) {
      // 早晨漸層
      return "from-orange-400 via-pink-400 to-purple-500"
    } else if (hour >= 12 && hour < 18) {
      // 下午漸層
      return "from-blue-400 via-cyan-400 to-teal-500"
    } else {
      // 晚上漸層
      return "from-purple-600 via-blue-600 to-indigo-800"
    }
  }

  if (!mounted) {
    return null // 避免 hydration 錯誤
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* 動態漸層背景 */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'gradient-bg-dark' : 'gradient-bg'} opacity-20`} />

      {/* 浮動裝飾元素 */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 floating-animation" />
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-20 floating-animation" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 floating-animation" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <header className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            {currentTime.getHours() < 6 || currentTime.getHours() >= 20 ?
              <Moon className="animate-pulse" /> :
              <Sun className="animate-pulse text-yellow-500" />
            }
            <span className="text-lg font-medium">{greeting()}</span>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          <div className="relative">
            <h1 className={`text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter bg-gradient-to-r ${getTimeBasedGradient()} bg-clip-text text-transparent animate-pulse-glow`}>
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </h1>
            {/* 發光效果背景 */}
            <div className={`absolute inset-0 text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter bg-gradient-to-r ${getTimeBasedGradient()} bg-clip-text text-transparent opacity-30 blur-sm -z-10`}>
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </header>

        <div className="gradient-border mb-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="gradient-border-content">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Alarms
                </h2>
                <Link href="/add-alarm" passHref>
                  <Button size="sm" className="relative overflow-hidden group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <Plus className="mr-2 h-4 w-4" /> Add Alarm
                  </Button>
                </Link>
              </div>
            </CardContent>
          </div>
        </div>

        <div className="space-y-4">
          {alarms.length > 0 ? (
            alarms.map((alarm, index) => (
              <div
                key={alarm.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <AlarmItem
                  alarm={alarm}
                  onToggle={() => toggleAlarm(alarm.id)}
                  onDelete={() => deleteAlarm(alarm.id)}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-10 animate-fade-in-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-xl" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg p-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-medium mb-2">No alarms set.</p>
                  <p className="text-sm opacity-70">Click "Add Alarm" to get started.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
