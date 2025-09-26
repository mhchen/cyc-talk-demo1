import { useState, useEffect, useCallback, ComponentType } from 'react';
import type { PerformanceMetrics, TestResult } from '../types';

interface TestComponentProps {
  iteration: number;
  maxIterations: number;
  onComplete: (metrics: PerformanceMetrics) => void;
}

interface WallClockTestOrchestratorProps {
  iterations: number;
  onComplete: (result: TestResult) => void;
  WithoutMemoComponent: ComponentType<TestComponentProps>;
  WithMemoComponent: ComponentType<TestComponentProps>;
}

export function WallClockTestOrchestrator({
  iterations,
  onComplete,
  WithoutMemoComponent,
  WithMemoComponent,
}: WallClockTestOrchestratorProps) {
  const [phase, setPhase] = useState<'without' | 'with' | 'complete'>('without');
  const [currentIteration, setCurrentIteration] = useState(1);
  const [withoutMemoResult, setWithoutMemoResult] = useState<PerformanceMetrics | null>(null);
  const [phaseStartTime, setPhaseStartTime] = useState(performance.now());


  const handleWithoutMemoComplete = useCallback(
    (metrics: PerformanceMetrics) => {
      const phaseTime = performance.now() - phaseStartTime;

      // Use wall-clock time as the meaningful metric, not just calculation time
      const wallClockMetrics = {
        ...metrics,
        total: phaseTime,
        avg: phaseTime / metrics.iterations,
      };

      setWithoutMemoResult(wallClockMetrics);
      setPhase('with');
      setCurrentIteration(1); // Reset for memo phase
      setPhaseStartTime(performance.now()); // Reset timer for memo phase
    },
    [phaseStartTime]
  );

  const handleWithMemoComplete = useCallback(
    (metrics: PerformanceMetrics) => {
      if (withoutMemoResult) {
        const phaseTime = performance.now() - phaseStartTime;

        // Use wall-clock time as the meaningful metric, not just calculation time
        const wallClockMetrics = {
          ...metrics,
          total: phaseTime,
          avg: phaseTime / metrics.iterations,
        };

        const difference =
          ((wallClockMetrics.avg - withoutMemoResult.avg) / withoutMemoResult.avg) * 100;

        const result = {
          withoutMemo: withoutMemoResult,
          withMemo: wallClockMetrics,
          difference,
          winner: withoutMemoResult.avg < wallClockMetrics.avg ? 'without' : 'with',
          surprising: withoutMemoResult.avg < wallClockMetrics.avg,
        };

        onComplete(result);

        setPhase('complete');
      }
    },
    [withoutMemoResult, phaseStartTime, onComplete]
  );

  // Control re-rendering by incrementing iteration
  useEffect(() => {
    if (phase !== 'complete' && currentIteration < iterations) {
      const timer = setTimeout(() => {
        setCurrentIteration((prev) => prev + 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentIteration, iterations, phase]);

  if (phase === 'complete') {
    return null;
  }

  return (
    <>
      {phase === 'without' && (
        <WithoutMemoComponent
          iteration={currentIteration}
          maxIterations={iterations}
          onComplete={handleWithoutMemoComplete}
        />
      )}
      {phase === 'with' && (
        <WithMemoComponent
          iteration={currentIteration}
          maxIterations={iterations}
          onComplete={handleWithMemoComplete}
        />
      )}
    </>
  );
}