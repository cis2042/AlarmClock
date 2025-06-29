# 🚨 Smart Alarm Clock

A modern, feature-rich alarm clock web application built with Next.js, featuring character voices, smart messages, and comprehensive alarm management.

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Clock Display** - Beautiful, responsive time display with greeting messages
- **Smart Alarm Management** - Create, edit, delete, and toggle alarms
- **Repeat Scheduling** - Set alarms for specific days of the week
- **Snooze & Dismiss** - Full alarm interaction with customizable snooze duration

### 🎭 Character Voices & Messages
- **10 Unique Characters** - From serene sage to drill sergeant
- **Dynamic Messages** - Weather-based, schedule-based, inspirational, and generic greetings
- **Multilingual Support** - Character names in both English and Chinese

### 🔊 Audio & Notifications
- **Web Audio API** - High-quality audio playback with volume control
- **Multiple Alarm Sounds** - Gentle chimes, nature sounds, classic alarms, and more
- **Browser Notifications** - Never miss an alarm even when the app isn't visible
- **Fallback Audio** - Generated beep sounds when audio files aren't available

### ⚙️ Advanced Settings
- **Volume Control** - Adjustable alarm volume with mute option
- **Notification Preferences** - Enable/disable browser notifications
- **Snooze Configuration** - Customizable default snooze duration
- **Sound Selection** - Choose from various alarm sounds
- **Settings Export/Import** - Backup and restore your preferences

### 🔧 Technical Features
- **PWA Support** - Install as a native app on mobile devices
- **Service Worker** - Background alarm monitoring
- **Local Storage** - Persistent alarm and settings storage
- **Error Handling** - Comprehensive error management and recovery
- **Timezone Support** - Automatic timezone detection and handling
- **Responsive Design** - Works perfectly on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cis2042/AlarmClock.git
   cd AlarmClock
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 📱 Usage Guide

### Setting Up Your First Alarm

1. **Grant Permissions**
   - Click "Enable Permissions" to allow notifications and audio
   - Accept browser prompts for notifications and audio access

2. **Create an Alarm**
   - Click "Add Alarm" button
   - Set your desired time
   - Choose repeat days (or leave empty for one-time alarm)
   - Select message type and character voice
   - Save the alarm

3. **Manage Alarms**
   - Toggle alarms on/off with the switch
   - Delete alarms with the trash icon
   - View alarm details in the main list

### Customizing Settings

1. **Access Settings**
   - Click the "Settings" button on the main page

2. **Audio Configuration**
   - Adjust volume slider
   - Test different alarm sounds
   - Enable/disable sound entirely

3. **Notification Setup**
   - Toggle browser notifications
   - Test notification functionality

4. **Alarm Preferences**
   - Set default snooze duration (1-30 minutes)

### When Alarms Trigger

1. **Alarm Modal**
   - Full-screen alarm interface appears
   - Shows character message and alarm details
   - Volume control and snooze options

2. **Interaction Options**
   - **Snooze**: Delay alarm by specified minutes
   - **Dismiss**: Turn off alarm completely
   - **Volume**: Adjust or mute during alarm

3. **Background Notifications**
   - Browser notifications appear even when app isn't visible
   - Click notifications to return to app

## 🏗️ Technology Stack

### Frontend Framework
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - Pre-built component library

### Audio & Notifications
- **Web Audio API** - High-quality audio playback
- **Notification API** - Browser notifications
- **Service Worker** - Background processing

### State & Storage
- **React Hooks** - Local state management
- **localStorage** - Persistent data storage
- **Custom Settings Manager** - Centralized configuration

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Fast package manager

## 📁 Project Structure

```
AlarmClock/
├── app/                    # Next.js App Router
│   ├── add-alarm/         # Add alarm page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── alarm-item.tsx    # Alarm list item
│   ├── alarm-modal.tsx   # Alarm trigger modal
│   └── theme-provider.tsx # Theme context
├── lib/                  # Core libraries
│   ├── alarm-engine.ts   # Alarm logic engine
│   ├── audio-system.ts   # Audio management
│   ├── notification-system.ts # Notifications
│   ├── message-generator.ts # Dynamic messages
│   ├── error-handler.ts  # Error management
│   ├── settings.ts       # Settings management
│   ├── service-worker.ts # SW utilities
│   ├── characters.ts     # Character definitions
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── public/               # Static assets
│   ├── sounds/          # Alarm sound files
│   ├── sw.js            # Service worker
│   └── manifest.json    # PWA manifest
└── scripts/             # Build scripts
    └── generate-sounds.js # Sound file generator
```

## 🎨 Character Voices

The app features 10 unique character personalities:

1. **寧靜聖人 (Serene Sage)** - Peaceful, wisdom-focused wake-ups
2. **魔鬼教官 (Drill Sergeant)** - Energetic, motivational alarms
3. **宇宙嚮導 (Cosmic Guide)** - Sci-fi themed space explorer
4. **私人管家 (Personal Butler)** - Polite, formal assistant
5. **動漫女主角 (Anime Heroine)** - Energetic anime-style character
6. **超級特工 (Super Agent)** - Mission briefing style wake-ups
7. **自然低語 (Nature's Whisper)** - Gentle nature-themed messages
8. **機器人助理 (Robot Assistant)** - Efficient, slightly humorous AI
9. **友善鄰居 (Friendly Neighbor)** - Warm, cheerful greetings
10. **開朗小孩 (Cheerful Child)** - Fun, energetic wake-ups

## 🔊 Alarm Sounds

Available alarm sounds include:
- **Gentle Chimes** - Soft, pleasant wake-up tones
- **Morning Birds** - Natural bird sounds
- **Soft Piano** - Gentle piano melodies
- **Nature Sounds** - Relaxing nature ambience
- **Classic Alarm** - Traditional alarm clock sound
- **Digital Beep** - Simple digital beeping

## 🛠️ Development

### Adding New Features

1. **New Character**
   - Add character definition to `lib/characters.ts`
   - Add messages to `lib/message-generator.ts`

2. **New Alarm Sound**
   - Add sound file to `public/sounds/`
   - Update `ALARM_SOUNDS` in `lib/audio-system.ts`

3. **New Settings**
   - Update `AppSettings` interface in `lib/types.ts`
   - Add setting controls to `app/settings/page.tsx`
   - Update `SettingsManager` in `lib/settings.ts`

### Code Quality

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Build verification
pnpm build
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Configure build settings (auto-detected)

2. **Environment Variables**
   - No environment variables required for basic functionality

3. **Deploy**
   - Automatic deployment on git push

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Browser Compatibility

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Required APIs
- Web Audio API
- Notification API
- Service Worker API
- localStorage
- Intl.DateTimeFormat

## 🐛 Troubleshooting

### Common Issues

1. **Alarms Not Triggering**
   - Ensure browser notifications are enabled
   - Keep browser tab active or install as PWA
   - Check system notification settings

2. **No Sound**
   - Grant audio permissions
   - Check volume settings
   - Verify sound files are accessible

3. **Time Zone Issues**
   - App automatically detects timezone
   - Ensure system time is correct

### Error Recovery

The app includes comprehensive error handling:
- Automatic permission requests
- Fallback audio generation
- Settings backup/restore
- Graceful degradation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by modern alarm clock applications

---

**Made with ❤️ for better mornings** 🌅

**[https://vercel.com/cis2042/v0-smart-alarm-clock-app](https://vercel.com/cis2042/v0-smart-alarm-clock-app)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/DhEzZWaiBBC](https://v0.dev/chat/projects/DhEzZWaiBBC)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository