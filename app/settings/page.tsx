"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Volume2, Bell, Download, Upload, RotateCcw, TestTube } from "lucide-react"
import Link from "next/link"
import { settingsManager } from "@/lib/settings"
import { audioSystem, ALARM_SOUNDS } from "@/lib/audio-system"
import { notificationSystem } from "@/lib/notification-system"
import type { AppSettings } from "@/lib/types"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<AppSettings>(settingsManager.getSettings())
  const [isTestingSound, setIsTestingSound] = useState(false)
  const [isTestingNotification, setIsTestingNotification] = useState(false)

  useEffect(() => {
    const handleSettingsChange = (newSettings: AppSettings) => {
      setSettings(newSettings)
    }

    settingsManager.addListener(handleSettingsChange)
    return () => settingsManager.removeListener(handleSettingsChange)
  }, [])

  const handleVolumeChange = (value: number[]) => {
    const volume = value[0] / 100
    settingsManager.setVolume(volume)
    audioSystem.setVolume(volume)
  }

  const handleSnoozeChange = (value: number[]) => {
    settingsManager.setDefaultSnoozeMinutes(value[0])
  }

  const handleSoundChange = (soundId: string) => {
    settingsManager.setSelectedSoundId(soundId)
  }

  const handleNotificationsToggle = (enabled: boolean) => {
    settingsManager.setNotificationsEnabled(enabled)
  }

  const handleSoundToggle = (enabled: boolean) => {
    settingsManager.setSoundEnabled(enabled)
  }

  const handleTestSound = async () => {
    if (isTestingSound) return

    setIsTestingSound(true)
    try {
      await audioSystem.testSound(settings.selectedSoundId)
      toast.success("Sound test completed")
    } catch (error) {
      toast.error("Failed to test sound")
    } finally {
      setIsTestingSound(false)
    }
  }

  const handleTestNotification = async () => {
    if (isTestingNotification) return

    setIsTestingNotification(true)
    try {
      await notificationSystem.showTestNotification()
      toast.success("Notification test completed")
    } catch (error) {
      toast.error("Failed to test notification")
    } finally {
      setIsTestingNotification(false)
    }
  }

  const handleExportSettings = () => {
    try {
      const settingsJson = settingsManager.exportSettings()
      const blob = new Blob([settingsJson], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'alarm-clock-settings.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Settings exported successfully")
    } catch (error) {
      toast.error("Failed to export settings")
    }
  }

  const handleImportSettings = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            if (settingsManager.importSettings(content)) {
              toast.success("Settings imported successfully")
            } else {
              toast.error("Invalid settings file")
            }
          } catch (error) {
            toast.error("Failed to import settings")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      settingsManager.resetToDefaults()
      toast.success("Settings reset to defaults")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center relative">
              <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="absolute -left-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <CardTitle className="text-center flex-grow">Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Audio</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled">Enable Sound</Label>
                  <Switch
                    id="sound-enabled"
                    checked={settings.soundEnabled}
                    onCheckedChange={handleSoundToggle}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Volume</Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[settings.volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  disabled={!settings.soundEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Alarm Sound</Label>
                <div className="flex gap-2">
                  <Select
                    value={settings.selectedSoundId}
                    onValueChange={handleSoundChange}
                    disabled={!settings.soundEnabled}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALARM_SOUNDS.map((sound) => (
                        <SelectItem key={sound.id} value={sound.id}>
                          {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleTestSound}
                    disabled={!settings.soundEnabled || isTestingSound}
                  >
                    <TestTube className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                  <Switch
                    id="notifications-enabled"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={handleNotificationsToggle}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Notifications help ensure you don't miss alarms when the app is not visible
                </p>
              </div>

              <Button
                variant="outline"
                onClick={handleTestNotification}
                disabled={!settings.notificationsEnabled || isTestingNotification}
                className="w-full"
              >
                <Bell className="mr-2 h-4 w-4" />
                Test Notification
              </Button>
            </div>

            {/* Alarm Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Alarms</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Default Snooze Duration</Label>
                  <span className="text-sm text-muted-foreground">
                    {settings.defaultSnoozeMinutes} min
                  </span>
                </div>
                <Slider
                  value={[settings.defaultSnoozeMinutes]}
                  onValueChange={handleSnoozeChange}
                  min={1}
                  max={30}
                  step={1}
                />
              </div>
            </div>

            {/* Settings Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Settings Management</h3>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportSettings} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" onClick={handleImportSettings} className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>

              <Button 
                variant="destructive" 
                onClick={handleResetSettings}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
