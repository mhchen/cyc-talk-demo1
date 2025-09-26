import { useState, useEffect, useRef } from 'react';
import { Button } from './shared/Button';
import { LoadingIndicator } from './shared/LoadingIndicator';

interface Workload {
  type: string;
  size: number;
  label: string;
}

interface WorkloadResult {
  result: any;
  processingTime: number;
}

interface WorkerPanelProps {
  title: string;
  workload: Workload;
  useWorker: boolean;
  onComplete?: (result: WorkloadResult) => void;
}

// CPU-intensive operations
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

export function WorkerPanel({ title, workload, useWorker, onComplete }: WorkerPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<WorkloadResult | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [uiFrozenTime, setUiFrozenTime] = useState(0);

  const workerRef = useRef<Worker | null>(null);
  const intervalRef = useRef<number | null>(null);
  const uiFreezeCheckRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Initialize worker if needed
  useEffect(() => {
    if (useWorker) {
      workerRef.current = new Worker('/src/workers/computation.worker.ts', { type: 'module' });

      workerRef.current.onmessage = (event) => {
        const { type, result, processingTime, error } = event.data;

        if (type === 'COMPLETE') {
          const workloadResult = { result, processingTime };
          setResult(workloadResult);
          setIsProcessing(false);
          onComplete?.(workloadResult);
        } else if (type === 'ERROR') {
          console.error('Worker error:', error);
          setIsProcessing(false);
        }
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (uiFreezeCheckRef.current) {
        clearInterval(uiFreezeCheckRef.current);
      }
    };
  }, [useWorker, onComplete]);

  // Timer for elapsed time
  useEffect(() => {
    if (isProcessing) {
      const startTime = performance.now();
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(Math.round((performance.now() - startTime) / 1000 * 10) / 10);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isProcessing]);

  // UI freeze detection for main thread
  useEffect(() => {
    if (isProcessing && !useWorker) {
      lastFrameTimeRef.current = performance.now();
      let totalFrozenTime = 0;

      uiFreezeCheckRef.current = window.setInterval(() => {
        const now = performance.now();
        const frameDuration = now - lastFrameTimeRef.current;

        // If more than 100ms between frames, consider it frozen
        if (frameDuration > 100) {
          totalFrozenTime += frameDuration;
          setUiFrozenTime(Math.round(totalFrozenTime));
        }

        lastFrameTimeRef.current = now;
      }, 16); // Check every 16ms (60fps)
    } else {
      if (uiFreezeCheckRef.current) {
        clearInterval(uiFreezeCheckRef.current);
        uiFreezeCheckRef.current = null;
      }
    }

    return () => {
      if (uiFreezeCheckRef.current) {
        clearInterval(uiFreezeCheckRef.current);
      }
    };
  }, [isProcessing, useWorker]);

  const handleStart = async () => {
    setIsProcessing(true);
    setResult(null);
    setElapsedTime(0);
    setUiFrozenTime(0);

    if (useWorker && workerRef.current) {
      // Use web worker
      workerRef.current.postMessage({
        type: workload.type.toUpperCase(),
        size: workload.size
      });
    } else {
      // Process on main thread
      try {
        const operation = heavyOperations[workload.type as keyof typeof heavyOperations];
        const workloadResult = operation(workload.size);

        setResult(workloadResult);
        setIsProcessing(false);
        onComplete?.(workloadResult);
      } catch (error) {
        console.error('Processing error:', error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div style={{
      border: '2px solid #ddd',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: 'white',
      minHeight: '300px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{
        margin: '0 0 1rem 0',
        color: useWorker ? '#28a745' : '#dc3545',
        borderBottom: `2px solid ${useWorker ? '#28a745' : '#dc3545'}`,
        paddingBottom: '0.5rem'
      }}>
        {title}
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <Button
          onClick={handleStart}
          disabled={isProcessing}
          variant={useWorker ? 'primary' : 'secondary'}
        >
          {isProcessing ? 'Processing...' : `Start ${workload.label}`}
        </Button>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isProcessing ? (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <LoadingIndicator size="medium" message="" />
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <div>
                {workload.label}...
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                Elapsed: {elapsedTime}s
                {!useWorker && uiFrozenTime > 0 && (
                  <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                    UI frozen for: {(uiFrozenTime / 1000).toFixed(1)}s
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : result ? (
          <div style={{ fontSize: '0.9rem', lineHeight: '1.4', width: '100%' }}>
            <strong>Result:</strong>
            <div>{result.result}</div>
            <div>Processing time: {Math.round(result.processingTime)}ms</div>
            {!useWorker && uiFrozenTime > 0 && (
              <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                UI frozen for: {(uiFrozenTime / 1000).toFixed(1)}s
              </div>
            )}
            {useWorker && (
              <div style={{ color: '#28a745', fontWeight: 'bold' }}>
                UI remained responsive
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666' }}>
            Click "Start" to begin heavy computation
          </div>
        )}
      </div>

      <div style={{
        fontSize: '0.8rem',
        color: '#666',
        borderTop: '1px solid #ddd',
        paddingTop: '0.5rem',
        marginTop: 'auto'
      }}>
        <strong>{useWorker ? 'Web Worker:' : 'Main Thread:'}</strong>{' '}
        {useWorker
          ? 'Processing happens in background, UI stays responsive'
          : 'Processing blocks UI, spinner freezes during work'
        }
      </div>
    </div>
  );
}