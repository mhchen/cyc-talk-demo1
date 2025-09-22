// Simulate useMemo behavior for performance testing
// We can't use actual hooks outside of React components, so we simulate the memoization logic

export function simulateUseMemo<T>(factory: () => T, deps: any[]): T {
  // This simulates the internal behavior of useMemo
  // In a real scenario, this would be managed by React's fiber system

  if (!simulateUseMemo.cache) {
    simulateUseMemo.cache = new Map();
  }

  const key = JSON.stringify(deps);
  const cached = simulateUseMemo.cache.get(key);

  if (cached) {
    return cached.value;
  }

  const value = factory();
  simulateUseMemo.cache.set(key, { value, deps });

  return value;
}

// Add static property to function for cache
(simulateUseMemo as any).cache = new Map();

export function clearMemoCache() {
  if ((simulateUseMemo as any).cache) {
    (simulateUseMemo as any).cache.clear();
  }
}

export function measureMemoizedOperation<T>(
  operation: () => T,
  deps: any[],
  iterations: number = 1000
) {
  // Measure the cost of memoization itself
  const times: number[] = [];

  // Clear cache before each measurement
  clearMemoCache();

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    simulateUseMemo(operation, deps);
    const end = performance.now();
    times.push(end - start);
  }

  return {
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)],
    min: Math.min(...times),
    max: Math.max(...times)
  };
}