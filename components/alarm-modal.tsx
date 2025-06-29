"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Clock, Volume2, VolumeX, Snooze, X, Bell } from "lucide-react"
import type { AlarmTriggerEvent } from "@/lib/types"
import { characters } from "@/lib/characters"
import { audioSystem } from "@/lib/audio-system"

interface AlarmModalProps {
  isOpen: boolean
  alarmEvent: AlarmTriggerEvent | null
  onSnooze: (minutes?: number) => void
  onDismiss: () => void
  onClose: () => void
}

export default function AlarmModal({ 
  isOpen, 
  alarmEvent, 
  onSnooze, 
  onDismiss, 
  onClose 
}: AlarmModalProps) {
  const [snoozeMinutes, setSnoozeMinutes] = useState(9)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (isOpen && alarmEvent) {
      // Start timer to show how long alarm has been ringing
      const startTime = Date.now()
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen, alarmEvent])

  useEffect(() => {
    // Update audio volume when slider changes
    if (!isMuted) {
      audioSystem.setVolume(volume)
    }
  }, [volume, isMuted])

  const handleVolumeToggle = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    audioSystem.setVolume(newMuted ? 0 : volume)
  }

  const handleSnooze = () => {
    onSnooze(snoozeMinutes)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatAlarmTime = (time: string): string => {
    const [hour, minute] = time.split(':')
    const h = Number.parseInt(hour, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const formattedHour = h % 12 === 0 ? 12 : h % 12
    return `${formattedHour}:${minute} ${ampm}`
  }

  if (!alarmEvent) return null

  const character = characters.find(c => c.id === alarmEvent.alarm.characterId)
  const CharacterIcon = character?.icon || Bell

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Bell className="h-6 w-6 text-primary animate-pulse" />
            Alarm
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Time Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {formatAlarmTime(alarmEvent.alarm.time)}
            </div>
            <div className="text-sm text-muted-foreground">
              Alarm has been ringing for {formatTime(timeElapsed)}
            </div>
          </div>

          {/* Alarm Message */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CharacterIcon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium mb-1">
                    {character?.name.split(' (')[0] || 'Alarm Clock'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {alarmEvent.message}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alarm Details */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {formatAlarmTime(alarmEvent.alarm.time)}
            </Badge>
            {alarmEvent.alarm.repeat.length > 0 && (
              <Badge variant="outline">
                {alarmEvent.alarm.repeat.length === 7 
                  ? 'Daily' 
                  : alarmEvent.alarm.repeat.length === 5 && 
                    alarmEvent.alarm.repeat.includes('Mon') &&
                    alarmEvent.alarm.repeat.includes('Tue') &&
                    alarmEvent.alarm.repeat.includes('Wed') &&
                    alarmEvent.alarm.repeat.includes('Thu') &&
                    alarmEvent.alarm.repeat.includes('Fri')
                  ? 'Weekdays'
                  : alarmEvent.alarm.repeat.join(', ')
                }
              </Badge>
            )}
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Volume</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVolumeToggle}
                className="h-8 w-8 p-0"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={(value) => setVolume(value[0] / 100)}
              max={100}
              step={5}
              className="w-full"
              disabled={isMuted}
            />
          </div>

          {/* Snooze Duration */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Snooze Duration</span>
            <div className="flex gap-2">
              {[5, 9, 15, 30].map((minutes) => (
                <Button
                  key={minutes}
                  variant={snoozeMinutes === minutes ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSnoozeMinutes(minutes)}
                  className="flex-1"
                >
                  {minutes}m
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSnooze}
              className="flex-1"
              size="lg"
            >
              <Snooze className="h-4 w-4 mr-2" />
              Snooze {snoozeMinutes}m
            </Button>
            <Button
              onClick={onDismiss}
              className="flex-1"
              size="lg"
            >
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
