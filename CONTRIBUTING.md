# 🤝 Contributing to Smart Alarm Clock

Thank you for your interest in contributing to Smart Alarm Clock! We welcome contributions from developers of all skill levels.

## 🌟 Ways to Contribute

### 🐛 Bug Reports
- Use the [GitHub Issues](https://github.com/cis2042/AlarmClock/issues) to report bugs
- Include steps to reproduce, expected behavior, and actual behavior
- Add screenshots or recordings if helpful

### ✨ Feature Requests
- Suggest new features through GitHub Issues
- Explain the use case and potential implementation
- Check existing issues to avoid duplicates

### 🔧 Code Contributions
- Fix bugs or implement new features
- Improve performance or code quality
- Add tests for new functionality

### 📝 Documentation
- Improve README or other documentation
- Add code comments
- Create tutorials or guides

### 🎨 Design & UX
- Improve the user interface
- Enhance user experience
- Create new themes or visual elements

### 🔊 Audio Content
- Add new alarm sounds
- Improve existing audio files
- Create character voice samples

### 🌍 Internationalization
- Add translations for new languages
- Improve existing translations
- Help with locale-specific features

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AlarmClock.git
   cd AlarmClock
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/cis2042/AlarmClock.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open http://localhost:3000**

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new alarm sound selection
fix: resolve notification permission issue
docs: update installation instructions
style: improve button hover effects
refactor: optimize alarm engine performance
test: add unit tests for message generator
```

### Branch Naming
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation
- `refactor/description` - for refactoring

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Test your changes thoroughly
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use a descriptive title
   - Explain what changes you made and why
   - Reference any related issues
   - Add screenshots for UI changes

## 🧪 Testing

### Manual Testing
- Test alarm functionality with different settings
- Verify PWA installation works
- Check responsive design on different devices
- Test browser notifications and audio

### Code Quality
```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Build verification
pnpm build
```

## 📁 Project Structure

```
AlarmClock/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── *.tsx             # Feature-specific components
├── lib/                  # Core libraries and utilities
│   ├── alarm-engine.ts   # Alarm logic
│   ├── audio-system.ts   # Audio management
│   ├── notification-system.ts # Notifications
│   └── *.ts              # Other utilities
├── public/               # Static assets
│   ├── sounds/          # Alarm sound files
│   └── *.json           # PWA manifest, etc.
└── scripts/             # Build and utility scripts
```

## 🎯 Contribution Ideas

### Easy (Good First Issues)
- Add new alarm sounds
- Improve error messages
- Fix typos in documentation
- Add new character personalities
- Improve accessibility

### Medium
- Add new message types
- Implement settings import/export
- Improve mobile responsiveness
- Add keyboard shortcuts
- Enhance error handling

### Advanced
- Weather API integration
- Calendar synchronization
- Voice recognition
- Smart home integration
- Advanced audio processing

## 🔊 Adding New Alarm Sounds

1. **Add audio file**
   ```bash
   # Add your .mp3 file to public/sounds/
   cp your-sound.mp3 public/sounds/
   ```

2. **Update audio system**
   ```typescript
   // In lib/audio-system.ts
   export const ALARM_SOUNDS: AlarmSound[] = [
     // ... existing sounds
     {
       id: 'your-sound-id',
       name: 'Your Sound Name',
       url: '/sounds/your-sound.mp3',
       duration: 30 // seconds
     }
   ]
   ```

## 🎭 Adding New Characters

1. **Add character definition**
   ```typescript
   // In lib/characters.ts
   {
     id: 'your-character-id',
     name: 'Character Name',
     description: 'Character description',
     icon: YourIcon // from lucide-react
   }
   ```

2. **Add character messages**
   ```typescript
   // In lib/message-generator.ts
   'your-character-id': {
     weather: { /* message templates */ },
     schedule: { /* message templates */ },
     inspirational: { /* message templates */ },
     generic: { /* message templates */ }
   }
   ```

## 📞 Getting Help

- 💬 **GitHub Discussions** - Ask questions and share ideas
- 🐛 **GitHub Issues** - Report bugs or request features
- 📧 **Email** - Contact maintainers for sensitive issues

## 📜 Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Celebrate diverse perspectives

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to join the core team (for significant contributions)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Smart Alarm Clock better for everyone!** 🌟
