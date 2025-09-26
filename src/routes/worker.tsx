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
  const [mainThreadResult, setMainThreadResult] = useState<WorkloadResult | null>(null);
  const [workerResult, setWorkerResult] = useState<WorkloadResult | null>(null);

  return (
    <DemoLayout
      title="Fibonacci(42): Main Thread vs Web Worker"
      subtitle="Experience how heavy computation freezes the UI on main thread but stays responsive with workers"
      explanation={
        <>
          <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>The Experiment</h3>
          <div style={{ lineHeight: '1.6', color: '#555' }}>
            <p>
              <strong>What we're computing:</strong> Fibonacci(42) using recursive calculation -
              a simple but extremely CPU-intensive operation that takes several seconds to complete.
            </p>
            <p>
              <strong>Main Thread:</strong> All processing happens on the main thread, completely blocking the UI.
              The spinner freezes, timers stop, and buttons become unresponsive during processing.
            </p>
            <p>
              <strong>Web Worker:</strong> Processing happens in a background thread. The UI stays
              fully responsive - spinners keep rotating, timers keep ticking, and you can interact with everything.
            </p>
            <p>
              <strong>Try it:</strong> Click "Start" on both panels simultaneously and watch the difference.
              Try hovering buttons or interacting with the page during processing.
            </p>
          </div>
        </>
      }
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginTop: '1rem'
      }}>
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
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: '4px solid #007acc'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>Performance Comparison</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {mainThreadResult && (
              <div>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#dc3545' }}>Main Thread Results</h5>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                  <div>{mainThreadResult.result}</div>
                  <div>Processing time: {Math.round(mainThreadResult.processingTime)}ms</div>
                  <div style={{ color: '#dc3545', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    ❌ UI was frozen during processing
                  </div>
                </div>
              </div>
            )}

            {workerResult && (
              <div>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#28a745' }}>Web Worker Results</h5>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                  <div>{workerResult.result}</div>
                  <div>Processing time: {Math.round(workerResult.processingTime)}ms</div>
                  <div style={{ color: '#28a745', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    ✅ UI remained responsive
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        borderLeft: '4px solid #ffc107'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#856404' }}>Key Observations</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#856404', lineHeight: '1.6' }}>
          <li>Processing time is identical for both approaches (~2-8 seconds depending on your device)</li>
          <li>Main thread completely freezes the entire UI during computation</li>
          <li>Web worker keeps everything responsive - try hovering buttons during processing!</li>
          <li>This recursive fibonacci calculation is intentionally inefficient to show the blocking effect</li>
          <li>In production, use web workers for any computation that might take &gt;100ms</li>
        </ul>
      </div>
    </DemoLayout>
  );
}