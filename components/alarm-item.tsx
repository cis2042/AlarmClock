"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Trash2, Bell, Cloud, Calendar, Sparkles, User } from "lucide-react"
import type { Alarm } from "@/lib/types"
import { characters } from "@/lib/characters"

interface AlarmItemProps {
  alarm: Alarm
  onToggle: () => void
  onDelete: () => void
}

const messageTypeIcons = {
  weather: <Cloud className="h-4 w-4 text-muted-foreground" />,
  schedule: <Calendar className="h-4 w-4 text-muted-foreground" />,
  inspirational: <Sparkles className="h-4 w-4 text-muted-foreground" />,
  generic: <Bell className="h-4 w-4 text-muted-foreground" />,
}

export default function AlarmItem({ alarm, onToggle, onDelete }: AlarmItemProps) {
  const character = characters.find((c) => c.id === alarm.characterId)
  const CharacterIcon = character ? character.icon : User
  const characterName = character ? character.name.split(" (")[0] : "Unknown"

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":")
    const h = Number.parseInt(hour, 10)
    const ampm = h >= 12 ? "PM" : "AM"
    const formattedHour = h % 12 === 0 ? 12 : h % 12
    return `${formattedHour}:${minute} ${ampm}`
  }

  const getRepeatText = () => {
    if (alarm.repeat.length === 7) return "每天"
    if (alarm.repeat.length === 0) return "一次"
    if (
      alarm.repeat.length === 5 &&
      alarm.repeat.includes("Mon") &&
      alarm.repeat.includes("Tue") &&
      alarm.repeat.includes("Wed") &&
      alarm.repeat.includes("Thu") &&
      alarm.repeat.includes("Fri")
    ) {
      return "工作日"
    }
    return alarm.repeat.join(", ")
  }

  return (
    <div className="relative group">
      {/* 漸層邊框效果 */}
      <div className={`absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${alarm.enabled ? 'animate-gradient-shift' : ''}`} />

      <Card className={`relative card-hover transition-all duration-300 ${
        !alarm.enabled
          ? "opacity-50 grayscale"
          : "hover:shadow-lg hover:shadow-purple-500/20"
      }`}>
        <CardContent className="p-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Switch
                checked={alarm.enabled}
                onCheckedChange={onToggle}
                className="transition-all duration-300"
              />
              {alarm.enabled && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-30 animate-pulse" />
              )}
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-semibold transition-all duration-300 ${
                alarm.enabled
                  ? "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  : "text-muted-foreground"
              }`}>
                {formatTime(alarm.time)}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 transition-all duration-300 hover:text-purple-400">
                  <div className="relative">
                    {messageTypeIcons[alarm.messageType as keyof typeof messageTypeIcons]}
                    {alarm.enabled && (
                      <div className="absolute inset-0 animate-ping opacity-30">
                        {messageTypeIcons[alarm.messageType as keyof typeof messageTypeIcons]}
                      </div>
                    )}
                  </div>
                  <span>{getRepeatText()}</span>
                </div>
                <div className="flex items-center gap-1 transition-all duration-300 hover:text-blue-400">
                  <div className="relative">
                    <CharacterIcon className="h-4 w-4 text-muted-foreground transition-colors duration-300" />
                    {alarm.enabled && (
                      <div className="absolute inset-0 animate-pulse opacity-50">
                        <CharacterIcon className="h-4 w-4 text-blue-400" />
                      </div>
                    )}
                  </div>
                  <span>{characterName}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="relative overflow-hidden group/btn hover:bg-red-500/10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
            <Trash2 className="h-5 w-5 text-red-500 transition-all duration-300 group-hover/btn:scale-110" />
          </Button>
        </CardContent>

        {/* 底部發光效果 */}
        {alarm.enabled && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50 animate-pulse" />
        )}
      </Card>
    </div>
  )
}
