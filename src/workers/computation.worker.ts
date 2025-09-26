interface ComputationMessage {
  type: 'SORT' | 'FIBONACCI' | 'LOOPS';
  size: number;
}

interface ComputationResponse {
  type: 'COMPLETE' | 'ERROR';
  result?: string;
  processingTime?: number;
  error?: string;
}

// CPU-intensive operations (same as in WorkerPanel)
const heavyOperations = {
  sort: (size: number) => {
    const arr = Array.from({ length: size }, () => Math.random());
    const startTime = performance.now();
    arr.sort((a, b) => a - b);
    const processingTime = performance.now() - startTime;
    return { result: `Sorted ${size} items`, processingTime };
  },

  fibonacci: (n: number) => {
    const startTime = performance.now();

    function fib(num: number): number {
      if (num <= 1) return num;
      return fib(num - 1) + fib(num - 2);
    }

    const result = fib(n);
    const processingTime = performance.now() - startTime;
    return { result: `Fibonacci(${n}) = ${result}`, processingTime };
  },

  loops: (iterations: number) => {
    const startTime = performance.now();
    let result = 0;

    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i);
      if (i % 10000 === 0) {
        // Add some extra work
        Math.sin(i) * Math.cos(i);
      }
    }

    const processingTime = performance.now() - startTime;
    return { result: `Processed ${iterations} iterations`, processingTime };
  }
};

self.onmessage = (event: MessageEvent<ComputationMessage>) => {
  const { type, size } = event.data;

  try {
    let result;

    switch (type) {
      case 'SORT':
        result = heavyOperations.sort(size);
        break;
      case 'FIBONACCI':
        result = heavyOperations.fibonacci(size);
        break;
      case 'LOOPS':
        result = heavyOperations.loops(size);
        break;
      default:
        throw new Error(`Unknown computation type: ${type}`);
    }

    self.postMessage({
      type: 'COMPLETE',
      result: result.result,
      processingTime: result.processingTime
    } as ComputationResponse);
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ComputationResponse);
  }
};

export {};