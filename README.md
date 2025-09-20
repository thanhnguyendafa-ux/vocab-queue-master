# Vocab Queue Master

A vocabulary learning web application built with React, TypeScript, and Vite, featuring smart spaced repetition and mastery scoring designed for Grade 5 learners.

## Features

- **Smart Learning Algorithm**: Uses smoothed success rate (SR_smooth) and time-based decay (SR_decay) for optimal spaced repetition
- **Multiple Question Types**: Multiple choice, true/false, and typing exercises
- **Mastery Tracking**: Tracks learning progress with Passed1, Passed2, and Failed statistics
- **Focus Modes**: Smart filtering for overdue, low-success, and decayed vocabulary
- **Grade 5 Optimized**: Age-appropriate interface and learning patterns

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **Data Import/Export**: PapaParse (CSV)
- **Local Storage**: IndexedDB via Dexie (optional)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vocab-queue-master
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── app/
│   └── routes.tsx              # Main routing configuration
├── modules/
│   ├── home/                   # Home page module
│   ├── study/                  # Study session module
│   ├── library/                # Vocabulary library module
│   ├── build/                  # Content creation module
│   └── settings/               # Settings module
├── store/
│   └── useQuizStore.ts         # Zustand store for app state
├── core/
│   ├── models.ts               # TypeScript interfaces
│   ├── algo/
│   │   ├── stats.ts           # SR_smooth, SR_decay algorithms
│   │   └── queue.ts           # Queue management logic
│   └── csv.ts                 # CSV import/export utilities
└── components/
    ├── layout/                 # Layout components
    ├── ui/                     # Reusable UI components
    └── quiz/                   # Quiz-specific components
```

## Core Algorithms

### SR_smooth (Smoothed Success Rate)
```
SR_smooth = (Passed1 + Passed2 + 1) / (Passed1 + Passed2 + Failed + 2)
```

### Time Decay
```
d(t) = 0.5^(t / H)
SR_decay = baseline + (SR_smooth - baseline) * d(t)
```

Where:
- `t` = days since last review
- `H` = half-life in days (default: 7)
- `baseline` = guessing baseline (default: 0.5)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest

## Learning Flow

1. **Incorrect Answer**: Item moves back 2 positions in queue, Passed1 resets, Failed increments
2. **First Correct**: Passed1 increments, item moves to end of queue
3. **Second Correct**: Passed2 increments, item removed from current session
4. **Session Complete**: When all items reach Passed2 ≥ 1

## Configuration

Default settings can be modified in the Settings module:

- **Half-life**: 7 days (how quickly mastery decays)
- **Guess Baseline**: 0.5 (50% random chance)
- **Speed Mode**: Auto-advance after answers
- **Focus Thresholds**: Overdue days, decay minimums, success rate minimums

## Development Status

This is the initial project setup (Prompt 1 completed). Next steps:

- [ ] Implement core algorithms (stats.ts, queue.ts)
- [ ] Build quiz components and study flow
- [ ] Add vocabulary library management
- [ ] Implement CSV import/export
- [ ] Add focus modes and smart filtering
- [ ] Create settings interface
- [ ] Add authentication and sync (optional)

## License

MIT License - see LICENSE file for details
