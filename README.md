# GYMovoo 💪

> Smart fitness app that generates personalized workout plans based on fitness level, goals and available equipment.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/Yehuda-sh/GYMovoo-v1.git
cd GYMovoo-v1
npm install

# Start development
npx expo start
```

## ✨ Key Features

- 📋 **Smart Questionnaire** - 7 dynamic questions for personalized training
- 🤖 **AI-Powered Plans** - Custom workouts from 100+ exercises
- ⏱️ **Real-time Tracking** - Timer, sets, weights, and progress
- 🏆 **Personal Records** - Automatic detection of new achievements
- 📊 **Progress Dashboard** - Statistics and workout history
- 🌙 **Dark/Light Mode** - Full theme support
- 🌍 **RTL Hebrew Support** - Complete right-to-left interface
- 🔧 **Full TypeScript** - 100% type safety

## 🧭 Onboarding Flow (Updated 2025-09-04)

1. Welcome (unauthenticated users only)
2. Smart Questionnaire (ALWAYS before account creation)
3. Register (answers already collected – attached to new user)
4. MainApp (guarded: cannot enter without completed questionnaire)

Rules:

- Returning user without questionnaire is forced into Questionnaire (cannot reach MainApp)
- Questionnaire completion for unauthenticated user always navigates to Register (not directly to MainApp)
- After successful registration the questionnaire data is attached (local → server best-effort) and user is reset into MainApp
- MainScreen now contains a runtime guard that redirects if questionnaire data/flags are missing

## 🛠️ Tech Stack

- **React Native** + **Expo** - Cross-platform mobile development
- **TypeScript** - Type safety and code quality
- **Zustand** - State management
- **Supabase** - Database and authentication
- **React Navigation** - Screen navigation
- **AsyncStorage** - Local caching

## 📱 Main Screens

- **Welcome & Auth** - Registration and login
- **Smart Questionnaire** - Personalized fitness profile setup
- **Dashboard** - Progress overview and quick actions
- **Active Workout** - Real-time workout tracking
- **Exercise Library** - 100+ exercises with muscle mapping
- **Profile & History** - User data and workout history

## 📚 Documentation

- 🏗️ **[Technical Guide](docs/TECHNICAL_IMPLEMENTATION_GUIDE.md)** - Architecture and implementation
- 🧭 **[Navigation Guide](docs/NAVIGATION_GUIDE.md)** - Screen structure and routing
- 📱 **[Screens Guide](docs/screens/README.md)** - Complete screen documentation
- 📋 **[Development Guidelines](docs/DEVELOPMENT_GUIDELINES.md)** - Coding standards and practices

## 🔧 Development

```bash
# Development
npm start              # Start Expo development server
npm run android        # Run on Android
npm run ios           # Run on iOS
npm test              # Run tests

# Code Quality
npm run lint          # ESLint check
npx tsc --noEmit     # TypeScript check
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 📞 Contact

- GitHub: [@Yehuda-sh](https://github.com/Yehuda-sh)
- Repository: [GYMovoo-v1](https://github.com/Yehuda-sh/GYMovoo-v1)

---

<p align="center">Made with ❤️ by the GYMovoo Team</p>
