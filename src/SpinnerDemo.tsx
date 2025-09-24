import { useState } from 'react';

function App() {
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
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Microtask Loading Spinner Test</h1>

      <div
        style={{
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #ccc',
          margin: '20px 0',
        }}
      >
        {loading ? (
          <div style={{ fontSize: '48px' }}>🔄 LOADING...</div>
        ) : (
          <div style={{ fontSize: '24px' }}>{message}</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handlePromiseChain}
          style={{ padding: '10px', fontSize: '16px' }}
        >
          Promise Chain (No Spinner!)
        </button>

        <button
          onClick={handleSetTimeout}
          style={{ padding: '10px', fontSize: '16px' }}
        >
          setTimeout (Shows Spinner!)
        </button>

        <button
          onClick={handleAsyncWithBreaks}
          style={{ padding: '10px', fontSize: '16px' }}
        >
          Async with Breaks (Shows Spinner!)
        </button>
      </div>

      <div>
        <p>Render count: {renderCount}</p>
        <p>Open console to see timing</p>
      </div>
    </div>
  );
}

export default App;
