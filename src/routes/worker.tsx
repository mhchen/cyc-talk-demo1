import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { DemoLayout } from '../components/shared/DemoLayout';
import { Button } from '../components/shared/Button';
import { WorkerPanel } from '../components/WorkerPanel';

export const Route = createFileRoute('/worker')({
  component: WorkerDemo,
});

interface WorkloadResult {
  result: any;
  processingTime: number;
}

function WorkerDemo() {
  const workload = { label: 'Fibonacci(42)', type: 'fibonacci', size: 42 };
  const [mainThreadResult, setMainThreadResult] =
    useState<WorkloadResult | null>(null);
  const [workerResult, setWorkerResult] = useState<WorkloadResult | null>(null);

  return (
    <DemoLayout
      title="Main Thread vs Web Worker"
      subtitle="Calculating the 42nd Fibonacci number"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginTop: '1rem',
        }}
      >
        <WorkerPanel
          title="🔴 Main Thread Panel"
          workload={workload}
          useWorker={false}
          onComplete={setMainThreadResult}
        />

        <WorkerPanel
          title="✅ Web Worker Panel"
          workload={workload}
          useWorker={true}
          onComplete={setWorkerResult}
        />
      </div>

      {(mainThreadResult || workerResult) && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #007acc',
          }}
        >
          <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>
            Performance Comparison
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            {mainThreadResult && (
              <div>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#dc3545' }}>
                  Main Thread Results
                </h5>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                  <div>{mainThreadResult.result}</div>
                  <div>
                    Processing time:{' '}
                    {Math.round(mainThreadResult.processingTime)}ms
                  </div>
                </div>
              </div>
            )}

            {workerResult && (
              <div>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#28a745' }}>
                  Web Worker Results
                </h5>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                  <div>{workerResult.result}</div>
                  <div>
                    Processing time: {Math.round(workerResult.processingTime)}ms
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </DemoLayout>
  );
}
