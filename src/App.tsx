import { useState, useCallback } from 'react';
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
        codeSnippet: 'return 42 * 2;',
      },
      {
        id: 'person-object',
        name: 'Person object creation',
        description: 'Create large object with ~20 properties',
        codeSnippet: `return {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1-555-123-4567',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'USA',
  },
  dateOfBirth: new Date(1990, 5, 15),
  occupation: 'Software Engineer',
  // ... 15+ more properties
};`,
      },
      {
        id: 'array-sort-small',
        name: 'Small array sort (10 items)',
        description: 'Sort 10 random numbers',
        codeSnippet: `const items = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  value: Math.random() * 1000,
}));
return [...items].sort((a, b) => a.value - b.value);`,
      },
      {
        id: 'array-sort-large',
        name: `Large array sort (${TEST_PARAMETERS.dataSize} items)`,
        description: 'Sort 1000 random numbers',
        codeSnippet: `const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  value: Math.random() * 1000,
}));
return [...items].sort((a, b) => a.value - b.value);`,
      },
      {
        id: 'complex-calculation',
        name: 'Complex calculation',
        description: 'Chain filter → map → sort operations on 50 items',
        codeSnippet: `const items = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  name: \`Item \${i}\`,
  value: Math.random() * 1000,
  category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
}));

return items
  .filter((item) => item.value > 500)
  .map((item) => ({
    ...item,
    computed: item.value * Math.sin(item.value) * Math.cos(item.value),
  }))
  .sort((a, b) => b.computed - a.computed);`,
      },
      {
        id: 'fibonacci',
        name: 'Expensive computation',
        description: 'Calculate fibonacci(20) recursively',
        codeSnippet: `const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};
return fibonacci(20);`,
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
            {isRunning ? 'Running tests...' : 'Run all tests'}
          </button>
          <button className="btn btn-danger" onClick={resetDemo}>
            Reset demo
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
