import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { DemoLayout } from '../components/shared/DemoLayout';
import { Button } from '../components/shared/Button';
import { LoadingIndicator } from '../components/shared/LoadingIndicator';

export const Route = createFileRoute('/spinner')({
  component: SpinnerDemo,
})

function SpinnerDemo() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Click a button');
  const [renderCount, setRenderCount] = useState(0);

  // CPU-intensive synchronous work
  const heavyWork = (iterations = 50000000) => {
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i);
    }
    return result;
  };

  // Version 1: Promise chain (microtasks) - spinner won't show
  const handlePromiseChain = () => {
    setLoading(true);
    setMessage('Processing...');
    console.log('Setting loading to true');

    Promise.resolve()
      .then(() => {
        console.log('Promise 1: doing heavy work');
        return heavyWork();
      })
      .then(() => {
        console.log('Promise 2: doing more work');
        return heavyWork();
      })
      .then(() => {
        console.log('Promise 3: final work');
        return heavyWork();
      })
      .then(() => {
        setLoading(false);
        setMessage('Done with promises!');
        console.log('Setting loading to false');
      });
  };

  // Version 2: setTimeout (macrotask) - spinner WILL show
  const handleSetTimeout = () => {
    setLoading(true);
    setMessage('Processing...');
    console.log('Setting loading to true');

    setTimeout(() => {
      console.log('setTimeout: doing heavy work');
      heavyWork();
      heavyWork();
      heavyWork();
      setLoading(false);
      setMessage('Done with setTimeout!');
      console.log('Setting loading to false');
    }, 0);
  };

  // Version 3: Async with await and strategic delay
  const handleAsyncWithBreaks = async () => {
    setLoading(true);
    setMessage('Processing...');
    console.log('Setting loading to true');

    // This forces a macrotask, allowing render
    await new Promise((resolve) => setTimeout(resolve, 0));

    heavyWork();
    heavyWork();
    heavyWork();

    setLoading(false);
    setMessage('Done with async/await!');
    console.log('Setting loading to false');
  };

  // Track renders
  useState(() => {
    setRenderCount((prev) => prev + 1);
  });

  return (
    <DemoLayout
      title="Microtask Loading Spinner Test"
      subtitle="Why don't loading spinners show during heavy work?"
      actions={
        <>
          <Button onClick={handlePromiseChain} variant="secondary">
            Promise Chain (No Spinner!)
          </Button>
          <Button onClick={handleSetTimeout} variant="primary">
            setTimeout (Shows Spinner!)
          </Button>
          <Button onClick={handleAsyncWithBreaks} variant="primary">
            Async with Breaks (Shows Spinner!)
          </Button>
        </>
      }
      explanation={
        <>
          <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>How It Works</h3>
          <div style={{ lineHeight: '1.6', color: '#555' }}>
            <p><strong>Promise Chain:</strong> All work happens in microtasks, which prevent the browser from rendering between tasks.</p>
            <p><strong>setTimeout:</strong> Creates a macrotask that allows the browser to render the spinner before processing.</p>
            <p><strong>Async with Breaks:</strong> Uses setTimeout(0) to yield control back to the browser for rendering.</p>
          </div>
        </>
      }
    >
      <div
        style={{
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #ccc',
          margin: '20px 0',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}
      >
        {loading ? (
          <LoadingIndicator message="Processing..." />
        ) : (
          <div style={{ fontSize: '24px', textAlign: 'center' }}>
            <div>{message}</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '0.5rem' }}>
              Render count: {renderCount} | Open console to see timing
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
}