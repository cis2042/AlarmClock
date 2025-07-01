"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play } from "lucide-react"
import Link from "next/link"
import type { Alarm, Day } from "@/lib/types"
import { characters } from "@/lib/characters"

const daysOfWeek: Day[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function AddAlarmPage() {
  const router = useRouter()
  const [time, setTime] = useState("07:00")
  const [repeat, setRepeat] = useState<Day[]>(["Mon", "Tue", "Wed", "Thu", "Fri"])
  const [messageType, setMessageType] = useState("weather")
  const [characterId, setCharacterId] = useState(characters[0].id)
  const [playingCharacter, setPlayingCharacter] = useState<string | null>(null)

  const handleDayToggle = (day: Day) => {
    setRepeat((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleSave = () => {
    const newAlarm: Alarm = {
      id: new Date().toISOString(),
      time,
      repeat,
      messageType,
      characterId,
      enabled: true,
    }

    const savedAlarms = localStorage.getItem("alarms")
    const alarms = savedAlarms ? JSON.parse(savedAlarms) : []
    alarms.push(newAlarm)
    localStorage.setItem("alarms", JSON.stringify(alarms))

    router.push("/")
  }

  const handlePlayPreview = (characterId: string) => {
    setPlayingCharacter(characterId)

    // 顯示試聽提示
    const selectedChar = characters.find((c) => c.id === characterId)
    if (selectedChar) {
      // 這裡可以添加實際的音頻播放邏輯
      console.log(`Playing preview for: ${selectedChar.name}`)
    }

    // 模擬播放聲音 3 秒
    setTimeout(() => {
      setPlayingCharacter(null)
    }, 3000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center relative">
              <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="absolute -left-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <CardTitle className="text-center flex-grow">Add Alarm</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-2xl p-4 text-center"
              />
            </div>

            <div className="grid gap-2">
              <Label>Repeat</Label>
              <div className="flex justify-between items-center space-x-1">
                {daysOfWeek.map((day) => (
                  <Button
                    key={day}
                    variant={repeat.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDayToggle(day)}
                    className="w-10 h-10 rounded-full"
                  >
                    {day.slice(0, 1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message-type">Wake-up Message</Label>
              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger id="message-type">
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weather">Weather Based</SelectItem>
                  <SelectItem value="schedule">Schedule Based</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="generic">Generic Greeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Voice & Character</Label>
              <div className="grid gap-3 max-h-64 overflow-y-auto border rounded-md p-3">
                {characters.map((char) => {
                  const Icon = char.icon
                  const isSelected = characterId === char.id
                  const isPlaying = playingCharacter === char.id

                  return (
                    <div
                      key={char.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent/50 ${
                        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setCharacterId(char.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`p-2 rounded-full ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isSelected ? "text-primary" : ""}`}>{char.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{char.description}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className="ml-2 h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlayPreview(char.id)
                        }}
                        disabled={isPlaying}
                      >
                        <Play className={`h-4 w-4 ${isPlaying ? "animate-pulse" : ""}`} />
                      </Button>
                    </div>
                  )
                })}
              </div>

              {/* 顯示當前選中的角色 */}
              <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Selected:</span>
                  {(() => {
                    const selectedChar = characters.find((c) => c.id === characterId)
                    if (selectedChar) {
                      const Icon = selectedChar.icon
                      return (
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-primary">{selectedChar.name}</span>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              </div>
            </div>

            {/* 播放狀態指示器 */}
            {playingCharacter && (
              <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-primary">
                  Playing preview: {characters.find((c) => c.id === playingCharacter)?.name}
                </span>
              </div>
            )}

            <Button onClick={handleSave} className="w-full" size="lg">
              Save Alarm
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
