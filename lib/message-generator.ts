import type { Alarm } from './types'
import { characters } from './characters'

interface MessageTemplate {
  greeting: string[]
  timeAnnouncement: string[]
  motivation: string[]
  closing: string[]
}

interface CharacterMessages {
  [characterId: string]: {
    weather: MessageTemplate
    schedule: MessageTemplate
    inspirational: MessageTemplate
    generic: MessageTemplate
  }
}

const characterMessages: CharacterMessages = {
  'serene-sage': {
    weather: {
      greeting: ['Good morning, peaceful soul', 'Rise gently, dear one', 'Awaken with tranquility'],
      timeAnnouncement: ['It is now', 'The time shows', 'This moment brings us'],
      motivation: ['Let the day unfold naturally', 'Embrace whatever weather awaits', 'Find peace in the present moment'],
      closing: ['May your day be filled with serenity', 'Go forth with wisdom', 'Peace be with you']
    },
    schedule: {
      greeting: ['Good morning, organized soul', 'Time to begin mindfully', 'Awaken to purpose'],
      timeAnnouncement: ['It is', 'The clock shows', 'This moment marks'],
      motivation: ['Your schedule awaits your gentle attention', 'Approach your tasks with calm focus', 'Let wisdom guide your day'],
      closing: ['May your plans unfold smoothly', 'Go forth with intention', 'Balance guides you']
    },
    inspirational: {
      greeting: ['Good morning, beautiful spirit', 'Rise with grace', 'Awaken to possibility'],
      timeAnnouncement: ['It is', 'The time is', 'This moment is'],
      motivation: ['Today holds infinite potential', 'Your inner light shines bright', 'Wisdom flows through you'],
      closing: ['Embrace the day with open heart', 'Your journey continues beautifully', 'Peace and joy await']
    },
    generic: {
      greeting: ['Good morning', 'Time to rise', 'Gentle awakening'],
      timeAnnouncement: ['It is', 'The time is', 'Current time'],
      motivation: ['A new day begins', 'Rest is complete', 'Time to start fresh'],
      closing: ['Have a peaceful day', 'Go gently forward', 'Serenity be yours']
    }
  },
  'drill-sergeant': {
    weather: {
      greeting: ['RISE AND SHINE, SOLDIER!', 'UP AND AT \'EM!', 'MOVE IT, MOVE IT!'],
      timeAnnouncement: ['IT IS NOW', 'THE TIME IS', 'CURRENT TIME IS'],
      motivation: ['CHECK THAT WEATHER AND DRESS ACCORDINGLY!', 'NO EXCUSES - WEATHER IS JUST WEATHER!', 'ADAPT AND OVERCOME!'],
      closing: ['NOW DROP AND GIVE ME TWENTY!', 'MAKE THIS DAY COUNT!', 'VICTORY AWAITS!']
    },
    schedule: {
      greeting: ['ATTENTION! TIME TO MOVE!', 'GET UP, GET MOVING!', 'NO TIME TO WASTE!'],
      timeAnnouncement: ['IT IS', 'TIME IS', 'THE CLOCK READS'],
      motivation: ['YOUR MISSION AWAITS!', 'EXECUTE YOUR SCHEDULE WITH PRECISION!', 'NO DELAYS, NO EXCUSES!'],
      closing: ['MAKE IT HAPPEN!', 'SHOW THEM WHAT YOU\'RE MADE OF!', 'VICTORY IS YOURS!']
    },
    inspirational: {
      greeting: ['WAKE UP, CHAMPION!', 'RISE UP, WARRIOR!', 'GET UP, HERO!'],
      timeAnnouncement: ['IT IS', 'TIME IS', 'THE HOUR IS'],
      motivation: ['YOU\'VE GOT THIS!', 'NOTHING CAN STOP YOU!', 'TODAY IS YOUR DAY TO SHINE!'],
      closing: ['GO CONQUER THE WORLD!', 'MAKE YOURSELF PROUD!', 'VICTORY IS INEVITABLE!']
    },
    generic: {
      greeting: ['WAKE UP!', 'GET UP!', 'MOVE IT!'],
      timeAnnouncement: ['IT IS', 'TIME IS', 'THE TIME'],
      motivation: ['NO SNOOZING!', 'TIME TO GET MOVING!', 'LET\'S GO!'],
      closing: ['MAKE IT COUNT!', 'GET AFTER IT!', 'HOOAH!']
    }
  },
  'cosmic-guide': {
    weather: {
      greeting: ['Greetings, cosmic traveler', 'Transmission received, earthling', 'Awakening protocol initiated'],
      timeAnnouncement: ['Temporal coordinates show', 'Current Earth time reads', 'Chronometer indicates'],
      motivation: ['Atmospheric conditions await your analysis', 'Planetary weather systems require observation', 'Environmental data collection commences'],
      closing: ['May the cosmos guide you', 'Safe travels, space explorer', 'End transmission']
    },
    schedule: {
      greeting: ['Mission briefing commencing', 'Agent, your presence is required', 'Activation sequence complete'],
      timeAnnouncement: ['Mission time is', 'Operational hour shows', 'Timeline indicates'],
      motivation: ['Your mission parameters await review', 'Scheduled objectives require attention', 'Mission critical tasks are pending'],
      closing: ['Mission success is probable', 'Agent, you are cleared for action', 'Transmission complete']
    },
    inspirational: {
      greeting: ['Cosmic consciousness awakening', 'Universal energy flows through you', 'Stellar alignment achieved'],
      timeAnnouncement: ['Universal time shows', 'Cosmic clock reads', 'Dimensional time is'],
      motivation: ['The universe conspires in your favor', 'Infinite possibilities await exploration', 'Your cosmic potential is unlimited'],
      closing: ['May the stars align for you', 'Cosmic journey continues', 'Universal blessings upon you']
    },
    generic: {
      greeting: ['System online', 'Awakening sequence complete', 'Consciousness restored'],
      timeAnnouncement: ['Current time is', 'Temporal reading shows', 'Time coordinates'],
      motivation: ['Daily operations commence', 'System ready for input', 'Standby mode disengaged'],
      closing: ['System functioning optimally', 'Have a stellar day', 'End of wake sequence']
    }
  }
  // Add more characters as needed...
}

export class MessageGenerator {
  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  private getTimeString(): string {
    const now = new Date()
    return now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  private getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    if (hour < 21) return 'evening'
    return 'night'
  }

  private getWeatherContext(): string {
    // In a real app, this would fetch actual weather data
    const conditions = [
      'sunny and bright',
      'cloudy but pleasant',
      'a bit chilly',
      'warm and comfortable',
      'perfect weather',
      'refreshing and cool'
    ]
    return this.getRandomElement(conditions)
  }

  public generateMessage(alarm: Alarm): string {
    const character = characters.find(c => c.id === alarm.characterId)
    const characterId = character?.id || 'serene-sage'
    
    // Get character-specific messages or fall back to serene-sage
    const messages = characterMessages[characterId] || characterMessages['serene-sage']
    const messageType = alarm.messageType as keyof typeof messages
    const template = messages[messageType] || messages.generic

    const greeting = this.getRandomElement(template.greeting)
    const timeAnnouncement = this.getRandomElement(template.timeAnnouncement)
    const motivation = this.getRandomElement(template.motivation)
    const closing = this.getRandomElement(template.closing)
    const currentTime = this.getTimeString()

    // Build the message based on type
    let message = `${greeting}! ${timeAnnouncement} ${currentTime}.`

    // Add type-specific content
    switch (messageType) {
      case 'weather':
        const weather = this.getWeatherContext()
        message += ` The weather looks ${weather} today. ${motivation}.`
        break
      case 'schedule':
        message += ` Time to check your schedule and plan your day. ${motivation}.`
        break
      case 'inspirational':
        message += ` ${motivation}.`
        break
      default:
        message += ` ${motivation}.`
    }

    message += ` ${closing}!`

    return message
  }

  public generateQuickMessage(alarm: Alarm): string {
    const character = characters.find(c => c.id === alarm.characterId)
    const characterName = character?.name.split(' (')[0] || 'Alarm'
    const time = this.getTimeString()
    
    const quickMessages = [
      `${characterName} says: Time to wake up! It's ${time}.`,
      `Good ${this.getGreeting()}! Your ${time} alarm is ringing.`,
      `Wake up! ${characterName} is calling - it's ${time}.`,
      `Rise and shine! Your alarm for ${time} is going off.`
    ]

    return this.getRandomElement(quickMessages)
  }

  public generateSnoozeMessage(alarm: Alarm, snoozeMinutes: number): string {
    const character = characters.find(c => c.id === alarm.characterId)
    const characterId = character?.id || 'serene-sage'

    const snoozeMessages: { [key: string]: string[] } = {
      'serene-sage': [
        `Rest a little longer, dear one. I'll wake you in ${snoozeMinutes} minutes.`,
        `Take these ${snoozeMinutes} minutes to gather your energy peacefully.`,
        `A few more moments of rest. See you in ${snoozeMinutes} minutes.`
      ],
      'drill-sergeant': [
        `FINE! ${snoozeMinutes} MORE MINUTES, BUT THAT'S IT!`,
        `YOU GET ${snoozeMinutes} MINUTES TO REGROUP, SOLDIER!`,
        `SNOOZE GRANTED FOR ${snoozeMinutes} MINUTES. NO MORE DELAYS!`
      ],
      'cosmic-guide': [
        `Snooze protocol activated. Resuming in ${snoozeMinutes} Earth minutes.`,
        `Temporal delay of ${snoozeMinutes} minutes authorized.`,
        `Sleep cycle extension: ${snoozeMinutes} minutes. Standby mode engaged.`
      ]
    }

    const messages = snoozeMessages[characterId] || snoozeMessages['serene-sage']
    return this.getRandomElement(messages)
  }
}

export const messageGenerator = new MessageGenerator()
