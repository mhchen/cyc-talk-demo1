import { useState } from 'react';
import { WithoutMemoComponent, WithMemoComponent, WithMemoChangingDepsComponent } from './MemoTestComponents';
import type { PerformanceMetrics, TestResult } from '../types';

interface MemoTestOrchestratorProps {
  operation: () => any;
  dependencies: any[];
  iterations: number;
  onComplete: (result: TestResult) => void;
}

export function MemoTestOrchestrator({ operation, dependencies, iterations, onComplete }: MemoTestOrchestratorProps) {
  const [phase, setPhase] = useState<'without' | 'with' | 'complete'>('without');
  const [withoutMemoResult, setWithoutMemoResult] = useState<PerformanceMetrics | null>(null);

  const handleWithoutMemoComplete = (metrics: PerformanceMetrics) => {
    setWithoutMemoResult(metrics);
    setPhase('with');
  };

  const handleWithMemoComplete = (metrics: PerformanceMetrics) => {
    if (withoutMemoResult) {
      const difference = ((metrics.avg - withoutMemoResult.avg) / withoutMemoResult.avg) * 100;

      onComplete({
        withoutMemo: withoutMemoResult,
        withMemo: metrics,
        difference,
        winner: withoutMemoResult.avg < metrics.avg ? 'without' : 'with',
        surprising: withoutMemoResult.avg < metrics.avg,
      });

      setPhase('complete');
    }
  };

  if (phase === 'complete') {
    return null;
  }

  return (
    <>
      {phase === 'without' && (
        <WithoutMemoComponent
          operation={operation}
          iterations={iterations}
          onComplete={handleWithoutMemoComplete}
        />
      )}
      {phase === 'with' && (
        <WithMemoComponent
          operation={operation}
          dependencies={dependencies}
          iterations={iterations}
          onComplete={handleWithMemoComplete}
        />
      )}
    </>
  );
}

