// Simulate useMemo behavior for performance testing
// We can't use actual hooks outside of React components, so we simulate the memoization logic

// React uses Object.is() for dependency comparison, not JSON.stringify
function areEqual(a: any, b: any): boolean {
  return Object.is(a, b);
}

function areDepsEqual(prevDeps: any[], nextDeps: any[]): boolean {
  if (prevDeps.length !== nextDeps.length) {
    return false;
  }
  for (let i = 0; i < prevDeps.length; i++) {
    if (!areEqual(prevDeps[i], nextDeps[i])) {
      return false;
    }
  }
  return true;
}

export function simulateUseMemo<T>(factory: () => T, deps: any[]): T {
  // This simulates the internal behavior of useMemo using React's actual comparison logic
  // React uses Object.is() for dependency comparison, not JSON.stringify

  if (!simulateUseMemo.cache) {
    simulateUseMemo.cache = { value: undefined, deps: undefined };
  }

  const cache = simulateUseMemo.cache as { value: T; deps: any[] } | { value: undefined; deps: undefined };

  // Check if dependencies have changed using React's comparison logic
  if (cache.deps !== undefined && areDepsEqual(cache.deps, deps)) {
    return cache.value as T;
  }

  // Dependencies changed or first run - compute new value
  const value = factory();
  simulateUseMemo.cache = { value, deps: [...deps] }; // Store copy of deps

  return value;
}

// Add static property to function for cache
(simulateUseMemo as any).cache = { value: undefined, deps: undefined };

export function clearMemoCache() {
  (simulateUseMemo as any).cache = { value: undefined, deps: undefined };
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

  const sorted = times.sort((a, b) => a - b);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const total = times.reduce((a, b) => a + b, 0);

  return {
    avg,
    total,
    iterations,
    median: sorted[Math.floor(times.length / 2)],
    min: Math.min(...times),
    max: Math.max(...times),
    p95: sorted[Math.floor(times.length * 0.95)],
    raw: times
  };
}