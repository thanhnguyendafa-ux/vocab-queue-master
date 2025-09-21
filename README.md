# Vocab Quiz Master

A comprehensive vocabulary learning web application built with React, TypeScript, and Vite, featuring smart spaced repetition learning with queue management and mastery tracking.

## 🚀 Features

- **Smart Spaced Repetition**: Advanced queue-based learning system with tempPassed1/tempPassed2 mechanics
- **Multiple Question Types**: Multiple choice (MCQ), true/false, and typing exercises
- **Mastery Tracking**: Comprehensive statistics with Passed1, Passed2, Failed counts and success rates
- **CSV Import/Export**: Full vocabulary management with data validation and template support
- **Module & Project System**: Create custom question modules and organize study sessions
- **Backup & Sync**: Complete data management with encryption options and auto-backup
- **Offline-First**: Works completely offline with local storage persistence
- **Mobile-Responsive**: Touch-friendly interface optimized for all screen sizes

## 🎯 Core Learning Mechanics

### Queue-Based Spaced Repetition
- **Incorrect Answer**: Item moves back 2 positions, tempPassed1 resets, Failed increments
- **First Correct**: tempPassed1 increments, item moves to end of queue
- **Second Correct**: tempPassed2 increments, item removed from session
- **Session Complete**: When all items reach tempPassed2 ≥ 1

### Smart Filtering & Focus Modes
- **Overdue Items**: Items not practiced recently
- **Low Success Rate**: Items needing more practice
- **Queue Management**: Items currently in study queue

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM 6
- **State Management**: React Context + useReducer
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React
- **Build Tool**: Vite 5
- **Testing**: Vitest

## 📁 Project Structure

```
src/
├── App.tsx                    # Main application component
├── contexts/
│   └── AppContext.tsx         # Global state management
├── services/
│   ├── queueService.ts        # Spaced repetition algorithms
│   ├── csvService.ts          # CSV import/export functionality
│   └── storageService.ts      # Local storage management
├── features/                  # Feature-based architecture
│   ├── home/
│   │   └── Home.tsx           # Dashboard and quick start
│   ├── study/
│   │   └── Study.tsx          # Study sessions and quiz player
│   ├── library/
│   │   └── Library.tsx        # Vocabulary management
│   ├── build/
│   │   └── Build.tsx          # Module and project creation
│   └── settings/
│       └── Settings.tsx       # Backup and configuration
└── data/
    └── sampleData.ts          # Sample vocabulary data
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Development

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd vocab-quiz-master
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest

## 🌐 GitHub Pages Deployment

### Option 1: Manual Deployment
1. **Build the project**:
```bash
npm run build
```

2. **Deploy to GitHub Pages**:
- Go to your repository on GitHub
- Navigate to Settings → Pages
- Select "Deploy from a branch"
- Choose the `gh-pages` branch or create a new branch
- Push the `dist` folder contents to your deployment branch

## 🚀 GitHub Pages Deployment

### Option 2: GitHub Actions (Recommended)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout 🛎️
      uses: actions/checkout@v4

    - name: Setup Node.js 📦
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies 🔧
      run: npm ci

    - name: Build project 🏗️
      run: npm run build:github

    - name: Deploy to GitHub Pages 🚀
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Option 3: Static Hosting
The built application can be deployed to any static hosting service:
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repo
- **Surge.sh**: `surge dist`

## 📖 Usage Guide

### Getting Started
1. **Try Sample Mode**: Click "Practice Sample" to explore with built-in data
2. **Import Vocabulary**: Upload a CSV file with your vocabulary
3. **Create Modules**: Define how questions are generated from your data
4. **Build Projects**: Organize your study sessions
5. **Start Learning**: Use the spaced repetition system to master vocabulary

### CSV Import Format
```csv
Keyword,Tag,Definition,Example,Pronunciation,ImageURL
algorithm,Computer Science,A process or set of rules...,The sorting algorithm...,/ˈælɡəˌrɪðəm/,
ubiquitous,Vocabulary,Present everywhere...,Smartphones are ubiquitous...,/juːˈbɪkwɪtəs/,
```

### Learning Flow
1. **Study Setup**: Select vocabulary and configure your session
2. **Quiz Session**: Answer questions with real-time feedback
3. **Progress Tracking**: Monitor your learning statistics
4. **Smart Review**: Items reappear based on your performance

## 🔧 Configuration

Access settings through the Settings tab:
- **Speed Mode**: Enable faster quiz progression
- **Auto-backup**: Configure automatic data backups
- **Language**: Interface language selection
- **Data Management**: Export/import vocabulary data

## 🎨 Features Overview

### Home Dashboard
- **Statistics Overview**: Today's progress, streak tracking
- **Quick Actions**: Fast access to common tasks
- **Recent Activity**: Resume previous study sessions
- **Performance Metrics**: Top performers and items needing attention

### Study System
- **Queue Management**: Visual progress tracking
- **Question Types**: MCQ, True/False, Typing
- **Smart Feedback**: Detailed explanations and statistics
- **Session Control**: Pause, resume, and quit functionality

### Library Management
- **Data Import**: CSV upload with validation
- **Table Views**: Grid and board view options
- **Batch Operations**: Multi-select actions
- **Export Options**: Data-only or data+stats formats

### Build Tools
- **Module Creation**: Custom question generation
- **Project Organization**: Study session planning
- **Configuration Options**: Question types and settings

### Settings & Backup
- **App Preferences**: Interface and behavior settings
- **Data Backup**: Manual and automatic backup options
- **Security**: Optional password encryption
- **Reset Options**: Settings and factory reset

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with expanded navigation
- **Tablet**: Adaptive layout with touch optimization
- **Mobile**: Bottom navigation with touch-friendly interface

## 🔒 Data Security

- **Local Storage**: All data stored locally in browser
- **Export/Import**: Full control over data movement
- **Encryption**: Optional password protection for exports
- **Backup System**: Comprehensive data protection

## 📊 Performance

- **Fast Loading**: Optimized build with code splitting
- **Smooth Animations**: 60fps interactions
- **Efficient Storage**: Minimal memory footprint
- **Offline Capable**: Works without internet connection

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions or issues:
1. Check the documentation above
2. Review the browser console for errors
3. Test with sample data first
4. Check your browser's compatibility

---

**Built with ❤️ for vocabulary learners everywhere!**
