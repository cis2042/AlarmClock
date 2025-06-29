# Alarm Sounds

This directory contains audio files for the alarm clock application.

## Required Sound Files:

- **gentle-chimes.mp3**: Soft, pleasant chimes for gentle wake-up
- **morning-birds.mp3**: Natural bird sounds for peaceful awakening
- **soft-piano.mp3**: Gentle piano melody
- **nature-sounds.mp3**: Relaxing nature ambience
- **classic-alarm.mp3**: Traditional alarm clock sound
- **digital-beep.mp3**: Simple digital beeping sound

## Adding Sound Files:

1. Add your audio files (MP3 format recommended) to this directory
2. Ensure files are named exactly as listed above
3. Keep file sizes reasonable (under 1MB each)
4. Use appropriate audio quality (44.1kHz, 16-bit minimum)

## Fallback:

If sound files are missing, the application will:
1. Try to play the available sounds
2. Fall back to generated beep sounds using Web Audio API
3. Show appropriate error messages to users

## License:

Ensure all audio files are properly licensed for use in your application.
