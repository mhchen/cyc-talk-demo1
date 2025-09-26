# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite + TypeScript application with multiple interactive performance demonstrations. Built with TanStack Router, it includes educational tools for exploring React performance concepts including `useMemo` benchmarking and JavaScript event loop behavior.

## Common Commands

- **Development**: `npm run dev` - Start Vite development server
- **Build**: `npm run build` - Build for production
- **Lint**: `npm run lint` - Run ESLint
- **Preview**: `npm run preview` - Preview production build locally

## Architecture & Key Components

### Core Structure
- **main.tsx**: App entry point with TanStack Router setup
- **routes/**: File-based routing structure
  - **index.tsx**: Landing page with demo navigation
  - **usememo.tsx**: useMemo performance demonstration
  - **spinner.tsx**: Event loop and loading spinner demo
- **components/**: Reusable UI components and shared utilities
  - **TestCase.tsx**: Component for displaying test results with metrics
  - **WallClockTestOrchestrator.tsx**: Orchestrates performance tests with wall-clock timing
  - **MemoTestComponents.tsx**: Test components for useMemo comparisons
  - **shared/**: Common UI components (Button, CodeBlock, LoadingIndicator, etc.)
- **types/index.ts**: TypeScript interfaces for test data structures and performance metrics
- **utils/performance.ts**: Performance measurement utilities and test data generation

### Performance Testing Architecture
The useMemo demo uses a sophisticated wall-clock performance testing framework:

1. **WallClockTestOrchestrator**: Manages test execution phases and measures real render time
2. **Test Components**: Paired components (with/without memo) for each performance scenario
3. **Performance Metrics**: Measures avg, total, median, min, max, p95 across multiple iterations
4. **Wall-Clock Timing**: Uses actual render time rather than just calculation time for realistic measurements
5. **Results Analysis**: Automatically determines winners and identifies "surprising" results where memoization hurts performance

### Demo Features

**useMemo Performance Demo:**
- Simple calculations (where memoization overhead exceeds benefit)
- Small vs large array operations (finding performance crossover points)
- Complex multi-step operations (filter → map → sort chains)
- Expensive computations (recursive fibonacci)
- Object creation and manipulation scenarios

**Spinner/Event Loop Demo:**
- Demonstrates why loading spinners don't show during heavy synchronous work
- Explores microtasks vs macrotasks in the JavaScript event loop

### Key Utilities
- **WallClockTestOrchestrator**: Manages test phases and measures actual component render time
- **Performance measurement**: High-precision timing using `performance.now()`
- **Test components**: Paired implementations for direct memoization comparisons
- **Routing**: TanStack Router with file-based routing structure

## Development Notes

- Uses React 19 with modern hooks and TypeScript strict mode
- TanStack Router for file-based routing and navigation
- Vite for fast development and building
- ESLint configured for React hooks and best practices
- Performance measurements use `performance.now()` with wall-clock timing for realistic results
- Test iterations typically run 10,000 times for statistical significance
- This project uses bun as the package manager

Never run npm run dev to verify things. When I am working on this project, I always have a dev server running.