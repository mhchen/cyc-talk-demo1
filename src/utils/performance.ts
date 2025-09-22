import type { Item, PerformanceMetrics } from '../types';

export const measurePerformance = (fn: () => any, iterations: number = 100): PerformanceMetrics => {
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  const sorted = times.sort((a, b) => a - b);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const median = sorted[Math.floor(times.length / 2)];
  const p95 = sorted[Math.floor(times.length * 0.95)];

  return {
    avg,
    median,
    min: Math.min(...times),
    max: Math.max(...times),
    p95,
    raw: times
  };
};

export const generateItems = (size: number): Item[] => {
  return Array.from({ length: size }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random() * 1000,
    category: (['A', 'B', 'C', 'D'] as const)[Math.floor(Math.random() * 4)],
    date: new Date(Date.now() - Math.random() * 10000000000),
    description: `This is item number ${i} with some additional text for complexity`,
    tags: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => `tag${j}`),
    nested: {
      level1: {
        level2: {
          value: Math.random() * 100
        }
      }
    }
  }));
};

export const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

export const complexCalculation = (items: Item[]) => {
  return items
    .filter(item => item.value > 500)
    .map(item => ({
      ...item,
      computed: item.value * Math.sin(item.value) * Math.cos(item.value),
      formattedDate: item.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      categoryStats: items
        .filter(i => i.category === item.category)
        .reduce((acc, curr) => acc + curr.value, 0)
    }))
    .sort((a, b) => b.computed - a.computed);
};

export const formatMetric = (value: number, isComparison: boolean = false): string => {
  if (isComparison) {
    const formatted = Math.abs(value).toFixed(1);
    if (value > 0) return `+${formatted}%`;
    if (value < 0) return `-${formatted}%`;
    return '0%';
  }

  if (value < 0.01) return `${(value * 1000).toFixed(2)}μs`;
  if (value < 1) return `${value.toFixed(3)}ms`;
  if (value < 1000) return `${value.toFixed(2)}ms`;
  return `${(value / 1000).toFixed(2)}s`;
};