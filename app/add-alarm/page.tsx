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
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* 動態背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-gradient-shift" />

      {/* 浮動裝飾 */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full floating-animation" />
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full floating-animation" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="gradient-border animate-scale-in">
          <div className="gradient-border-content">
            <Card className="border-0 shadow-2xl">
              <CardHeader className="relative">
                <div className="flex items-center relative">
                  <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="absolute -left-2 hover:bg-purple-500/10 transition-all duration-300">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <CardTitle className="text-center flex-grow bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Add Alarm
                  </CardTitle>
                </div>
                {/* 標題下方發光線 */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <Label htmlFor="time" className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Time
                  </Label>
                  <div className="relative">
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="text-2xl p-4 text-center border-2 focus:border-purple-400 transition-all duration-300 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                <div className="grid gap-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <Label className="text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Repeat
                  </Label>
                  <div className="flex justify-between items-center space-x-1">
                    {daysOfWeek.map((day, index) => (
                      <Button
                        key={day}
                        variant={repeat.includes(day) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDayToggle(day)}
                        className={`w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 ${
                          repeat.includes(day)
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
                            : "hover:border-purple-400 hover:text-purple-400"
                        }`}
                        style={{ animationDelay: `${0.05 * index}s` }}
                      >
                        {day.slice(0, 1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <Label htmlFor="message-type" className="text-sm font-medium bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Wake-up Message
                  </Label>
                  <div className="relative">
                    <Select value={messageType} onValueChange={setMessageType}>
                      <SelectTrigger id="message-type" className="border-2 focus:border-green-400 transition-all duration-300 hover:shadow-md">
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-green-400/20">
                        <SelectItem value="weather" className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20">Weather Based</SelectItem>
                        <SelectItem value="schedule" className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20">Schedule Based</SelectItem>
                        <SelectItem value="inspirational" className="hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-900/20 dark:hover:to-orange-900/20">Inspirational</SelectItem>
                        <SelectItem value="generic" className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-900/20 dark:hover:to-slate-900/20">Generic Greeting</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                <div className="grid gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Label className="text-sm font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Voice & Character
                  </Label>
                  <div className="grid gap-3 max-h-64 overflow-y-auto border-2 border-purple-200/50 dark:border-purple-800/50 rounded-md p-3 bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-900/10 dark:to-pink-900/10">
                    {characters.map((char, index) => {
                      const Icon = char.icon
                      const isSelected = characterId === char.id
                      const isPlaying = playingCharacter === char.id

                      return (
                        <div
                          key={char.id}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-fade-in-up ${
                            isSelected
                              ? "border-purple-400 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-lg"
                              : "border-border hover:border-purple-400/50 hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
                          }`}
                          onClick={() => setCharacterId(char.id)}
                          style={{ animationDelay: `${0.05 * index + 0.4}s` }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`p-2 rounded-full transition-all duration-300 ${
                                isSelected
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                  : "bg-muted hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800 dark:hover:to-pink-800"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium transition-colors duration-300 ${
                                isSelected ? "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" : ""
                              }`}>
                                {char.name}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{char.description}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={`ml-2 h-8 w-8 p-0 transition-all duration-300 hover:scale-110 ${
                              isSelected
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                : "hover:border-purple-400 hover:text-purple-400"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePlayPreview(char.id)
                            }}
                            disabled={isPlaying}
                          >
                            <Play className={`h-4 w-4 transition-all duration-300 ${isPlaying ? "animate-pulse scale-110" : ""}`} />
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  {/* 顯示當前選中的角色 */}
                  <div className="mt-2 p-3 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Selected:</span>
                      {(() => {
                        const selectedChar = characters.find((c) => c.id === characterId)
                        if (selectedChar) {
                          const Icon = selectedChar.icon
                          return (
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {selectedChar.name}
                              </span>
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
                  <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-400/50 rounded-lg animate-fade-in-up shadow-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Playing preview: {characters.find((c) => c.id === playingCharacter)?.name}
                    </span>
                  </div>
                )}

                <Button
                  onClick={handleSave}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 animate-fade-in-up shadow-lg hover:shadow-xl"
                  size="lg"
                  style={{ animationDelay: '0.6s' }}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <span className="relative z-10 font-semibold">Save Alarm</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
