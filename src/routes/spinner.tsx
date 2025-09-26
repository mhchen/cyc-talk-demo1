import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { DemoLayout } from '../components/shared/DemoLayout';
import { Button } from '../components/shared/Button';
import { LoadingIndicator } from '../components/shared/LoadingIndicator';
import { fibonacci } from '../utils/performance';

export const Route = createFileRoute('/spinner')({
  component: SpinnerDemo,
});

function SpinnerDemo() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Click a button');
  const [renderCount, setRenderCount] = useState(0);

  const heavyWork = () => {
    return fibonacci(38);
  };

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
          backgroundColor: '#fff',
        }}
      >
        {loading ? (
          <LoadingIndicator message="Processing..." />
        ) : (
          <div style={{ fontSize: '24px', textAlign: 'center' }}>
            <div>{message}</div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
}
