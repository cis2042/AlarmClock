export type Day = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"

export interface Alarm {
  id: string
  time: string
  repeat: Day[]
  messageType: string
  characterId: string
  enabled: boolean
}
