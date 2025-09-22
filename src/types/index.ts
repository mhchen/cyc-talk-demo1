export interface Item {
  id: number;
  name: string;
  value: number;
  category: 'A' | 'B' | 'C' | 'D';
  date: Date;
  description: string;
  tags: string[];
  nested: {
    level1: {
      level2: {
        value: number;
      };
    };
  };
}

export interface PerformanceMetrics {
  avg: number;
  median: number;
  min: number;
  max: number;
  p95: number;
  raw: number[];
}

export interface TestResult {
  withoutMemo?: number;
  withMemo?: number;
  difference?: number;
  winner?: 'with' | 'without';
  surprising?: boolean;
  // For rerender-impact test
  stableWithout?: number;
  stableWith?: number;
  changingWithout?: number;
  changingWith?: number;
  stableWinner?: 'with' | 'without';
  changingWinner?: 'with' | 'without';
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  run: () => TestResult;
}