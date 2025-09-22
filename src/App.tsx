import { useState, useCallback } from 'react';
import './App.css';
import TestCase from './components/TestCase';
import { WallClockTestOrchestrator } from './components/WallClockTestOrchestrator';
import {
  SimpleCalculationWithoutMemo,
  SimpleCalculationWithMemo,
  PersonObjectWithoutMemo,
  PersonObjectWithMemo,
  ArraySortSmallWithoutMemo,
  ArraySortSmallWithMemo,
  ArraySortLargeWithoutMemo,
  ArraySortLargeWithMemo,
  ComplexCalculationWithoutMemo,
  ComplexCalculationWithMemo,
  FibonacciWithoutMemo,
  FibonacciWithMemo,
} from './components/MemoTestComponents';
import type { TestCase as TestCaseType, TestResult } from './types';

const TEST_PARAMETERS = {
  dataSize: 1000,
  fibonacciN: 20,
  iterations: 10000,
};

function App() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>(
    {}
  );
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [activeTestRunner, setActiveTestRunner] = useState<string | null>(null);

  const handleTestComplete = useCallback(
    (testId: string, result: TestResult) => {
      setTestResults((prev) => ({
        ...prev,
        [testId]: result,
      }));
      setActiveTestRunner(null);
      setCurrentTest(null);
    },
    []
  );

  const createTestCases = useCallback(
    (): TestCaseType[] => [
      {
        id: 'simple-calc',
        name: 'Simple calculation',
        description: 'Single multiplication (42 * 2)',
      },
      {
        id: 'person-object',
        name: 'Person object creation',
        description: 'Create large object with ~20 properties',
      },
      {
        id: 'array-sort-small',
        name: 'Small array sort (10 items)',
        description: 'Sort 10 random numbers',
      },
      {
        id: 'array-sort-large',
        name: `Large array sort (${TEST_PARAMETERS.dataSize} items)`,
        description: 'Sort 1000 random numbers',
      },
      {
        id: 'complex-calculation',
        name: 'Complex calculation',
        description: 'Chain filter → map → sort operations on 50 items',
      },
      {
        id: 'fibonacci',
        name: 'Expensive computation',
        description: 'Calculate fibonacci(20) recursively',
      },
    ],
    []
  );

  const testCases = createTestCases();

  const runTest = async (testCase: TestCaseType): Promise<void> => {
    setCurrentTest(testCase.id);
    setActiveTestRunner(testCase.id);

    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const runAllTests = async () => {
    console.log('Starting all tests...');
    setIsRunning(true);
    setTestResults({});

    for (const testCase of testCases) {
      await runTest(testCase);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsRunning(false);
    console.log('All tests complete!');
  };

  const resetDemo = () => {
    setTestResults({});
    setCurrentTest(null);
    console.log('Demo reset');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>React.useMemo</h1>
        <p className="subtitle">When does memoization actually help?</p>
      </div>

      <div className="test-info">
        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={runAllTests}
            disabled={isRunning}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
          <button className="btn btn-danger" onClick={resetDemo}>
            Reset Demo
          </button>
        </div>
      </div>

      <div className="test-cases">
        {testCases.map((testCase) => (
          <TestCase
            key={testCase.id}
            test={testCase}
            isRunning={currentTest === testCase.id}
            result={testResults[testCase.id] || null}
            onRun={runTest}
          />
        ))}
      </div>

      {activeTestRunner === 'simple-calc' && (
        <WallClockTestOrchestrator
          iterations={TEST_PARAMETERS.iterations}
          onComplete={(result) => handleTestComplete('simple-calc', result)}
          WithoutMemoComponent={SimpleCalculationWithoutMemo}
          WithMemoComponent={SimpleCalculationWithMemo}
        />
      )}
      {activeTestRunner === 'person-object' && (
        <WallClockTestOrchestrator
          iterations={TEST_PARAMETERS.iterations}
          onComplete={(result) => handleTestComplete('person-object', result)}
          WithoutMemoComponent={PersonObjectWithoutMemo}
          WithMemoComponent={PersonObjectWithMemo}
        />
      )}
      {activeTestRunner === 'array-sort-small' && (
        <WallClockTestOrchestrator
          iterations={TEST_PARAMETERS.iterations}
          onComplete={(result) =>
            handleTestComplete('array-sort-small', result)
          }
          WithoutMemoComponent={ArraySortSmallWithoutMemo}
          WithMemoComponent={ArraySortSmallWithMemo}
        />
      )}
      {activeTestRunner === 'array-sort-large' && (
        <WallClockTestOrchestrator
          iterations={TEST_PARAMETERS.iterations}
          onComplete={(result) =>
            handleTestComplete('array-sort-large', result)
          }
          WithoutMemoComponent={ArraySortLargeWithoutMemo}
          WithMemoComponent={ArraySortLargeWithMemo}
        />
      )}
      {activeTestRunner === 'complex-calculation' && (
        <WallClockTestOrchestrator
          iterations={TEST_PARAMETERS.iterations}
          onComplete={(result) =>
            handleTestComplete('complex-calculation', result)
          }
          WithoutMemoComponent={ComplexCalculationWithoutMemo}
          WithMemoComponent={ComplexCalculationWithMemo}
        />
      )}
      {activeTestRunner === 'fibonacci' && (
        <WallClockTestOrchestrator
          iterations={TEST_PARAMETERS.iterations}
          onComplete={(result) => handleTestComplete('fibonacci', result)}
          WithoutMemoComponent={FibonacciWithoutMemo}
          WithMemoComponent={FibonacciWithMemo}
        />
      )}
    </div>
  );
}

export default App;
