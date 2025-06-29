"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
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
              <Label htmlFor="character">Voice & Character</Label>
              <Select value={characterId} onValueChange={setCharacterId}>
                <SelectTrigger id="character">
                  <SelectValue placeholder="Select a character" />
                </SelectTrigger>
                <SelectContent>
                  {characters.map((char) => (
                    <SelectItem key={char.id} value={char.id}>
                      <div className="flex items-center gap-3 py-1">
                        <char.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{char.name}</p>
                          <p className="text-xs text-muted-foreground">{char.description}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} className="w-full" size="lg">
              Save Alarm
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
