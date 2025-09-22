# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite + TypeScript application that demonstrates the performance characteristics of `useMemo`. It's an interactive educational tool that runs benchmarks comparing operations with and without memoization across different scenarios to show when `useMemo` is beneficial vs harmful.

## Common Commands

- **Development**: `npm run dev` - Start Vite development server
- **Build**: `npm run build` - Build for production
- **Lint**: `npm run lint` - Run ESLint
- **Preview**: `npm run preview` - Preview production build locally

## Architecture & Key Components

### Core Structure
- **App.tsx**: Main application component containing test orchestration, UI state management, and all test case definitions
- **TestCase.tsx**: Reusable component for displaying individual test results with metrics and animations
- **types/index.ts**: TypeScript interfaces for test data structures and performance metrics
- **utils/performance.ts**: Performance measurement utilities and test data generation
- **utils/memoSimulation.ts**: Simulates `useMemo` behavior outside React components using React's actual comparison logic (`Object.is()`)

### Test System Architecture
The application uses a sophisticated performance testing framework:

1. **Test Cases**: Each test compares identical operations with/without memoization
2. **Performance Metrics**: Measures avg, total, median, min, max, p95 across multiple iterations
3. **Dependency Simulation**: Uses `Object.is()` comparison to match React's actual behavior
4. **Results Analysis**: Automatically determines winners and identifies "surprising" results where memoization hurts performance

### Key Test Scenarios
- Simple calculations (where memoization overhead exceeds benefit)
- Small vs large array operations (finding performance crossover points)
- Complex multi-step operations
- Expensive computations (fibonacci)
- Re-render impact testing (stable vs changing dependencies)

### Performance Testing Utilities
- `measurePerformance()`: Basic timing measurement across iterations
- `measureMemoizedOperation()`: Simulates useMemo with proper dependency checking
- `simulateUseMemo()`: Implements React's memoization logic using Object.is()
- Various formatting utilities for displaying performance metrics

## Development Notes

- Uses React 19 with modern hooks and TypeScript strict mode
- Vite for fast development and building
- ESLint configured for React hooks and best practices
- Performance measurements use `performance.now()` for high precision
- Test iterations vary by complexity (100-100,000) to ensure statistical significance
- This project uses bun

Never run npm run dev to verify things. When I am working on this project, I always have a dev server running.