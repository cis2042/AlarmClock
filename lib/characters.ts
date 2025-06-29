import type { LucideIcon } from "lucide-react"
import { Wind, Megaphone, Rocket, ConciergeBell, Heart, Target, Leaf, Bot, User, Smile } from "lucide-react"

export interface Character {
  id: string
  name: string
  description: string
  icon: LucideIcon
}

export const characters: Character[] = [
  {
    id: "serene-sage",
    name: "寧靜聖人 (Serene Sage)",
    description: "用平靜、智慧的聲音溫柔地喚醒您。",
    icon: Wind,
  },
  {
    id: "drill-sergeant",
    name: "魔鬼教官 (Drill Sergeant)",
    description: "給需要強力推動的人一個響亮的激勵。",
    icon: Megaphone,
  },
  {
    id: "cosmic-guide",
    name: "宇宙嚮導 (Cosmic Guide)",
    description: "帶有科幻音效的飄渺太空主題角色。",
    icon: Rocket,
  },
  {
    id: "personal-butler",
    name: "私人管家 (Personal Butler)",
    description: "一位彬彬有禮、正式且樂於助人的助手。",
    icon: ConciergeBell,
  },
  {
    id: "anime-heroine",
    name: "動漫女主角 (Anime Heroine)",
    description: "充滿活力和可愛的動漫風格聲音。",
    icon: Heart,
  },
  {
    id: "super-agent",
    name: "超級特工 (Super Agent)",
    description: "任務簡報風格的起床號。",
    icon: Target,
  },
  {
    id: "natures-whisper",
    name: "自然低語 (Nature's Whisper)",
    description: "伴隨著溫柔聲音的自然之聲。",
    icon: Leaf,
  },
  {
    id: "robot-assistant",
    name: "機器人助理 (Robot Assistant)",
    description: "高效、略帶幽默的未來派夥伴。",
    icon: Bot,
  },
  {
    id: "friendly-neighbor",
    name: "友善鄰居 (Friendly Neighbor)",
    description: "一個溫暖、愉快的聲音，讓您的一天有個陽光的開始。",
    icon: User,
  },
  {
    id: "cheerful-child",
    name: "開朗小孩 (Cheerful Child)",
    description: "一個充滿歡笑和活力的有趣聲音。",
    icon: Smile,
  },
]
