import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import TestCase from './components/TestCase';
import {
  measurePerformance,
  generateItems,
  fibonacci,
  complexCalculation,
  formatMetric
} from './utils/performance';
import { measureMemoizedOperation, clearMemoCache } from './utils/memoSimulation';
import type { TestCase as TestCaseType, TestResult } from './types';

type Complexity = 'simple' | 'medium' | 'complex';

function App() {
  const [dataSize, setDataSize] = useState<number>(100);
  const [complexity, setComplexity] = useState<Complexity>('medium');
  const [rerenderFreq, setRerenderFreq] = useState<number>(1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [surprisingFinding, setSurprisingFinding] = useState<string | null>(null);
  const [forceRerenderCount, setForceRerenderCount] = useState<number>(0);
  const [rerenderActive, setRerenderActive] = useState<boolean>(false);
  const rerenderInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const createTestCases = useCallback((): TestCaseType[] => [
    {
      id: 'simple-calc',
      name: 'Simple Calculation',
      description: 'Doubling a number - is useMemo worth it?',
      run: () => {
        const value = 42;

        // Test without memoization
        const withoutMemo = measurePerformance(() => {
          return value * 2;
        }, 10000);

        // Test with memoization simulation
        const withMemo = measureMemoizedOperation(() => {
          return value * 2;
        }, [value], 10000);

        const difference = ((withMemo.avg - withoutMemo.avg) / withoutMemo.avg) * 100;

        return {
          withoutMemo: withoutMemo.avg,
          withMemo: withMemo.avg,
          difference,
          winner: withoutMemo.avg < withMemo.avg ? 'without' : 'with',
          surprising: withoutMemo.avg < withMemo.avg
        };
      }
    },
    {
      id: 'array-sort-small',
      name: 'Small Array Sort (10 items)',
      description: 'Sorting a small array - overhead vs benefit',
      run: () => {
        const items = generateItems(10);

        const withoutMemo = measurePerformance(() => {
          return [...items].sort((a, b) => a.value - b.value);
        }, 1000);

        const withMemo = measureMemoizedOperation(() => {
          return [...items].sort((a, b) => a.value - b.value);
        }, [items], 1000);

        const difference = ((withMemo.avg - withoutMemo.avg) / withoutMemo.avg) * 100;

        return {
          withoutMemo: withoutMemo.avg,
          withMemo: withMemo.avg,
          difference,
          winner: withoutMemo.avg < withMemo.avg ? 'without' : 'with',
          surprising: withoutMemo.avg < withMemo.avg
        };
      }
    },
    {
      id: 'array-sort-large',
      name: `Large Array Sort (${dataSize} items)`,
      description: 'Sorting a large array - where useMemo shines?',
      run: () => {
        const items = generateItems(dataSize);

        const withoutMemo = measurePerformance(() => {
          return [...items].sort((a, b) => a.value - b.value);
        }, 100);

        const withMemo = measureMemoizedOperation(() => {
          return [...items].sort((a, b) => a.value - b.value);
        }, [items], 100);

        const difference = ((withMemo.avg - withoutMemo.avg) / withoutMemo.avg) * 100;

        return {
          withoutMemo: withoutMemo.avg,
          withMemo: withMemo.avg,
          difference,
          winner: withoutMemo.avg < withMemo.avg ? 'without' : 'with',
          surprising: dataSize < 500 && withoutMemo.avg < withMemo.avg
        };
      }
    },
    {
      id: 'complex-object',
      name: 'Complex Object Creation',
      description: 'Building a config object with transformations',
      run: () => {
        const data = generateItems(50);

        const withoutMemo = measurePerformance(() => {
          return complexCalculation(data);
        }, 500);

        const withMemo = measureMemoizedOperation(() => {
          return complexCalculation(data);
        }, [data], 500);

        const difference = ((withMemo.avg - withoutMemo.avg) / withoutMemo.avg) * 100;

        return {
          withoutMemo: withoutMemo.avg,
          withMemo: withMemo.avg,
          difference,
          winner: withoutMemo.avg < withMemo.avg ? 'without' : 'with',
          surprising: false
        };
      }
    },
    {
      id: 'expensive-compute',
      name: 'Expensive Computation',
      description: `Fibonacci(${complexity === 'simple' ? 10 : complexity === 'medium' ? 20 : 30}) - clear useMemo territory?`,
      run: () => {
        const n = complexity === 'simple' ? 10 : complexity === 'medium' ? 20 : 30;

        const withoutMemo = measurePerformance(() => {
          return fibonacci(n);
        }, complexity === 'complex' ? 5 : 20);

        const withMemo = measureMemoizedOperation(() => {
          return fibonacci(n);
        }, [n], complexity === 'complex' ? 5 : 20);

        const difference = ((withMemo.avg - withoutMemo.avg) / withoutMemo.avg) * 100;

        return {
          withoutMemo: withoutMemo.avg,
          withMemo: withMemo.avg,
          difference,
          winner: withoutMemo.avg < withMemo.avg ? 'without' : 'with',
          surprising: false
        };
      }
    },
    {
      id: 'rerender-impact',
      name: 'Re-render Impact Test',
      description: 'Stable vs changing dependencies - the critical factor',
      run: () => {
        const items = generateItems(100);

        // Stable dependencies test
        const stableDepsWithout = measurePerformance(() => {
          return [...items].sort((a, b) => a.value - b.value);
        }, 500);

        const stableDepsWithMemo = measureMemoizedOperation(() => {
          return [...items].sort((a, b) => a.value - b.value);
        }, [items], 500);

        // Changing dependencies test - simulate frequently changing deps
        const changingDepsWithout = measurePerformance(() => {
          const newItems = [...items, { ...items[0], id: Math.random() }];
          return [...newItems].sort((a, b) => a.value - b.value);
        }, 500);

        const changingDepsWithMemo = (() => {
          const results: number[] = [];
          for (let i = 0; i < 500; i++) {
            clearMemoCache(); // Clear cache each time to simulate changing deps
            const start = performance.now();
            const newItems = [...items, { ...items[0], id: Math.random() }];
            measureMemoizedOperation(() => {
              return [...newItems].sort((a, b) => a.value - b.value);
            }, [newItems], 1);
            const end = performance.now();
            results.push(end - start);
          }
          return {
            avg: results.reduce((a, b) => a + b, 0) / results.length
          };
        })();

        return {
          stableWithout: stableDepsWithout.avg,
          stableWith: stableDepsWithMemo.avg,
          changingWithout: changingDepsWithout.avg,
          changingWith: changingDepsWithMemo.avg,
          stableWinner: stableDepsWithout.avg < stableDepsWithMemo.avg ? 'without' : 'with',
          changingWinner: changingDepsWithout.avg < changingDepsWithMemo.avg ? 'without' : 'with',
          surprising: changingDepsWithout.avg < changingDepsWithMemo.avg
        };
      }
    }
  ], [dataSize, complexity]);

  const testCases = createTestCases();

  const runTest = async (testCase: TestCaseType): Promise<TestResult> => {
    console.log(`🧪 Running test: ${testCase.name}`);
    setCurrentTest(testCase.id);

    // Visual delay for demo effect
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = testCase.run();
    console.log(`📊 Results for ${testCase.name}:`, result);

    setTestResults(prev => ({
      ...prev,
      [testCase.id]: result
    }));

    // Check for surprising findings
    if (result.surprising) {
      const finding = testCase.id === 'simple-calc'
        ? "🤯 For simple calculations, useMemo actually makes things SLOWER! The overhead of the hook exceeds the computation cost."
        : testCase.id === 'array-sort-small'
        ? "🤯 Small arrays sort faster WITHOUT useMemo! The memoization overhead isn't worth it for < 100 items."
        : testCase.id === 'array-sort-large' && dataSize < 500
        ? `🤯 Even with ${dataSize} items, raw computation beats useMemo! The break-even point is around 500+ items.`
        : testCase.id === 'rerender-impact'
        ? "🤯 When dependencies change frequently, useMemo adds overhead with NO benefit! It's actually making things worse."
        : null;

      if (finding) {
        setSurprisingFinding(finding);
      }
    }

    setCurrentTest(null);
    return result;
  };

  const runAllTests = async () => {
    console.log('🚀 Starting all tests...');
    setIsRunning(true);
    setTestResults({});
    setSurprisingFinding(null);

    for (const testCase of testCases) {
      await runTest(testCase);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsRunning(false);
    console.log('✅ All tests complete!');
  };

  const toggleRerender = () => {
    if (rerenderActive) {
      if (rerenderInterval.current) {
        clearInterval(rerenderInterval.current);
      }
      setRerenderActive(false);
    } else {
      rerenderInterval.current = setInterval(() => {
        setForceRerenderCount(prev => prev + 1);
      }, rerenderFreq);
      setRerenderActive(true);
    }
  };

  const resetDemo = () => {
    setTestResults({});
    setSurprisingFinding(null);
    setCurrentTest(null);
    setForceRerenderCount(0);
    if (rerenderInterval.current) {
      clearInterval(rerenderInterval.current);
      setRerenderActive(false);
    }
    console.log('🔄 Demo reset');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isRunning) {
        e.preventDefault();
        runAllTests();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetDemo();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning]);

  useEffect(() => {
    return () => {
      if (rerenderInterval.current) {
        clearInterval(rerenderInterval.current);
      }
    };
  }, []);

  const allTestsComplete = Object.keys(testResults).length === testCases.length;

  return (
    <div className="container">
      <div className="header">
        <h1>⚔️ React.useMemo - The Performance Holy War</h1>
        <p className="subtitle">When does memoization actually help? Let's measure, not guess!</p>
      </div>

      <div className="hypothesis">
        <h2>🤔 The Great Debate</h2>
        <div className="hypothesis-content">
          <div className="belief-box team-a">
            <h3>Team "Memoize Everything" 🛡️</h3>
            <p>"useMemo prevents performance issues before they happen. The cost is negligible, the protection is valuable."</p>
          </div>
          <div className="belief-box team-b">
            <h3>Team "YAGNI" ⚡</h3>
            <p>"useMemo adds complexity and memory overhead. Most computations are fast enough without it."</p>
          </div>
        </div>
      </div>

      <div className="controls">
        <h2>🎛️ Experiment Controls</h2>
        <div className="control-group">
          <div className="control-item">
            <label>Data Size</label>
            <select value={dataSize} onChange={(e) => setDataSize(Number(e.target.value))}>
              <option value={10}>10 items</option>
              <option value={100}>100 items</option>
              <option value={500}>500 items</option>
              <option value={1000}>1000 items</option>
              <option value={5000}>5000 items</option>
            </select>
          </div>
          <div className="control-item">
            <label>Computation Complexity</label>
            <select value={complexity} onChange={(e) => setComplexity(e.target.value as Complexity)}>
              <option value="simple">Simple (Fib 10)</option>
              <option value="medium">Medium (Fib 20)</option>
              <option value="complex">Complex (Fib 30)</option>
            </select>
          </div>
          <div className="control-item">
            <label>Re-render Frequency</label>
            <select value={rerenderFreq} onChange={(e) => setRerenderFreq(Number(e.target.value))}>
              <option value={100}>Very Fast (100ms)</option>
              <option value={500}>Fast (500ms)</option>
              <option value={1000}>Normal (1s)</option>
              <option value={5000}>Slow (5s)</option>
            </select>
          </div>
        </div>
        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={runAllTests}
            disabled={isRunning}
          >
            {isRunning ? '⏱️ Running Tests...' : '🚀 Run All Tests'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={toggleRerender}
          >
            {rerenderActive ? '⏸️ Stop' : '▶️ Simulate Re-renders'}
            {rerenderActive && ` (${forceRerenderCount})`}
          </button>
          <button
            className="btn btn-danger"
            onClick={resetDemo}
          >
            🔄 Reset Demo
          </button>
        </div>
      </div>

      <div className="test-cases">
        {testCases.map(testCase => (
          <TestCase
            key={testCase.id}
            test={testCase}
            isRunning={currentTest === testCase.id}
            result={testResults[testCase.id] || null}
            onRun={runTest}
          />
        ))}
      </div>

      {surprisingFinding && (
        <div className="surprising-finding show">
          <h2>⚠️ Surprising Finding!</h2>
          <p>{surprisingFinding}</p>
        </div>
      )}

      {allTestsComplete && (
        <>
          <div className="results-table">
            <h2>📊 Results Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Test Case</th>
                  <th>Without useMemo</th>
                  <th>With useMemo</th>
                  <th>Winner</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {testCases.filter(tc => tc.id !== 'rerender-impact').map(testCase => {
                  const result = testResults[testCase.id];
                  if (!result) return null;

                  return (
                    <tr key={testCase.id}>
                      <td>{testCase.name}</td>
                      <td className={result.winner === 'without' ? 'winner' : ''}>
                        {formatMetric(result.withoutMemo!)}
                      </td>
                      <td className={result.winner === 'with' ? 'winner' : 'loser'}>
                        {formatMetric(result.withMemo!)}
                      </td>
                      <td>
                        {result.winner === 'with' ? 'useMemo ✅' : 'No Memo ❌'}
                      </td>
                      <td>
                        {result.surprising ? '🤯 Surprising!' : '✅ Expected'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="summary">
            <h2>🎯 The Nuanced Truth</h2>
            <div className="conclusion-grid">
              <div className="conclusion-card">
                <h3>✅ Use useMemo When:</h3>
                <ul>
                  <li>Computation takes &gt; 10ms</li>
                  <li>Processing &gt; 500 items</li>
                  <li>Parent re-renders frequently</li>
                  <li>Dependencies rarely change</li>
                  <li>Building expensive objects</li>
                </ul>
              </div>
              <div className="conclusion-card">
                <h3>❌ Skip useMemo When:</h3>
                <ul>
                  <li>Simple calculations (&lt; 1ms)</li>
                  <li>Small arrays (&lt; 100 items)</li>
                  <li>Dependencies always change</li>
                  <li>Parent rarely re-renders</li>
                  <li>Primitive value transforms</li>
                </ul>
              </div>
              <div className="conclusion-card">
                <h3>🔬 The Gray Zone (Measure!):</h3>
                <ul>
                  <li>100-500 items</li>
                  <li>1-10ms computations</li>
                  <li>Mixed dependency patterns</li>
                  <li>Component-specific patterns</li>
                  <li>Production vs Development</li>
                </ul>
              </div>
            </div>
            <p className="conclusion-footer">
              The answer isn't "always" or "never" - it's "measure and decide" 📏
            </p>
          </div>
        </>
      )}

      <div className={`keyboard-hints ${!isRunning ? 'show' : ''}`}>
        <div>⌨️ Keyboard Shortcuts:</div>
        <div>Space - Run all tests</div>
        <div>R - Reset demo</div>
      </div>
    </div>
  );
}

export default App;