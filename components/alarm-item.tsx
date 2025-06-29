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
    <Card className={!alarm.enabled ? "opacity-50" : ""}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Switch checked={alarm.enabled} onCheckedChange={onToggle} />
          <div>
            <p className="text-2xl font-semibold">{formatTime(alarm.time)}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {messageTypeIcons[alarm.messageType as keyof typeof messageTypeIcons]}
                <span>{getRepeatText()}</span>
              </div>
              <div className="flex items-center gap-1">
                <CharacterIcon className="h-4 w-4 text-muted-foreground" />
                <span>{characterName}</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-5 w-5 text-red-500" />
        </Button>
      </CardContent>
    </Card>
  )
}
