import { useMemo, useEffect, useRef, useState } from 'react';
import type { PerformanceMetrics } from '../types';

function calculateMetrics(times: number[]): PerformanceMetrics {
  const sorted = times.sort((a, b) => a - b);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const total = times.reduce((a, b) => a + b, 0);

  return {
    avg,
    total,
    iterations: times.length,
    median: sorted[Math.floor(times.length / 2)],
    min: Math.min(...times),
    max: Math.max(...times),
    p95: sorted[Math.floor(times.length * 0.95)],
    raw: [], // Remove the 10k element array
  };
}

// Simple Calculation Test Components
interface SimpleCalculationTestProps {
  iteration: number;
  maxIterations: number;
  onComplete: (metrics: PerformanceMetrics) => void;
}

export function SimpleCalculationWithoutMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Run simple calculation and measure time
  const start = performance.now();
  const result = 42 * 2;
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);


    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

export function SimpleCalculationWithMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Use actual React.useMemo with stable dependencies
  const start = performance.now();
  const result = useMemo(() => {
    return 42 * 2;
  }, []);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

export function PersonObjectWithoutMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  const start = performance.now();
  const person = {
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
    company: 'Tech Corp',
    salary: 85000,
    isActive: true,
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: true,
      newsletter: false,
    },
    socialMedia: {
      twitter: '@johndoe',
      linkedin: 'john-doe-123',
      github: 'johndoe',
    },
    pets: [
      { name: 'Buddy', type: 'dog', age: 3, breed: 'Golden Retriever' },
      { name: 'Whiskers', type: 'cat', age: 2, breed: 'Siamese' },
    ],
    hobbies: ['photography', 'hiking', 'cooking', 'reading'],
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'spouse',
      phone: '+1-555-987-6543',
    },
    onCreate: () => console.log('Person created'),
    onUpdate: () => console.log('Person updated'),
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    },
  };
  console.log(person);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

export function PersonObjectWithMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Create large person object with memo
  const start = performance.now();
  const person = useMemo(
    () => ({
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
      company: 'Tech Corp',
      salary: 85000,
      isActive: true,
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
        newsletter: false,
      },
      socialMedia: {
        twitter: '@johndoe',
        linkedin: 'john-doe-123',
        github: 'johndoe',
      },
      pets: [
        { name: 'Buddy', type: 'dog', age: 3, breed: 'Golden Retriever' },
        { name: 'Whiskers', type: 'cat', age: 2, breed: 'Siamese' },
      ],
      hobbies: ['photography', 'hiking', 'cooking', 'reading'],
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'spouse',
        phone: '+1-555-987-6543',
      },
      onCreate: () => console.log('Person created'),
      onUpdate: () => console.log('Person updated'),
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      },
    }),
    []
  );
  console.log(person);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

// Array Sort Small Test Components
export function ArraySortSmallWithoutMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Sort small array without memo
  const start = performance.now();
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    value: Math.random() * 1000,
  }));
  const result = [...items].sort((a, b) => a.value - b.value);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

export function ArraySortSmallWithMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Sort small array with memo
  const start = performance.now();
  const result = useMemo(() => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      value: Math.random() * 1000,
    }));
    return [...items].sort((a, b) => a.value - b.value);
  }, []);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

// Array Sort Large Test Components
export function ArraySortLargeWithoutMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Sort large array without memo
  const start = performance.now();
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: Math.random() * 1000,
  }));
  const result = [...items].sort((a, b) => a.value - b.value);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

export function ArraySortLargeWithMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Sort large array with memo
  const start = performance.now();
  const result = useMemo(() => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      value: Math.random() * 1000,
    }));
    return [...items].sort((a, b) => a.value - b.value);
  }, []);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

// Complex Calculation Test Components
export function ComplexCalculationWithoutMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Complex calculation without memo
  const start = performance.now();
  const items = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random() * 1000,
    category: (['A', 'B', 'C', 'D'] as const)[Math.floor(Math.random() * 4)],
  }));

  const result = items
    .filter((item) => item.value > 500)
    .map((item) => ({
      ...item,
      computed: item.value * Math.sin(item.value) * Math.cos(item.value),
    }))
    .sort((a, b) => b.computed - a.computed);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

export function ComplexCalculationWithMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Complex calculation with memo
  const start = performance.now();
  const result = useMemo(() => {
    const items = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
      category: (['A', 'B', 'C', 'D'] as const)[Math.floor(Math.random() * 4)],
    }));

    return items
      .filter((item) => item.value > 500)
      .map((item) => ({
        ...item,
        computed: item.value * Math.sin(item.value) * Math.cos(item.value),
      }))
      .sort((a, b) => b.computed - a.computed);
  }, []);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

// Fibonacci Test Components
export function FibonacciWithoutMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Fibonacci calculation without memo
  const start = performance.now();
  const fibonacci = (n: number): number => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };
  const result = fibonacci(20);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

export function FibonacciWithMemo({
  iteration,
  maxIterations,
  onComplete,
}: SimpleCalculationTestProps) {
  const timesRef = useRef<number[]>([]);

  // Fibonacci calculation with memo
  const start = performance.now();
  const result = useMemo(() => {
    const fibonacci = (n: number): number => {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    };
    return fibonacci(20);
  }, []);
  const end = performance.now();

  useEffect(() => {
    const time = end - start;
    timesRef.current.push(time);

    if (timesRef.current.length >= maxIterations) {
      onComplete(calculateMetrics(timesRef.current));
    }
  }, [iteration, maxIterations, onComplete, end, start]);

  return null;
}

// Generic Components for other test cases (fixed to avoid infinite loops)
interface WithoutMemoProps {
  operation: () => any;
  iterations: number;
  onComplete: (metrics: PerformanceMetrics) => void;
}

export function WithoutMemoComponent({
  operation,
  iterations,
  onComplete,
}: WithoutMemoProps) {
  const [currentIteration, setCurrentIteration] = useState(1);
  const timesRef = useRef<number[]>([]);

  // Run operation and measure time
  const start = performance.now();
  const result = operation();
  const end = performance.now();

  useEffect(() => {
    timesRef.current.push(end - start);

    if (currentIteration >= iterations) {
      onComplete(calculateMetrics(timesRef.current));
    } else {
      // Use setTimeout to avoid immediate re-render
      const timer = setTimeout(() => {
        setCurrentIteration((prev) => prev + 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentIteration, iterations, onComplete, end, start]);

  return null;
}

interface WithMemoProps {
  operation: () => any;
  dependencies: any[];
  iterations: number;
  onComplete: (metrics: PerformanceMetrics) => void;
}

export function WithMemoComponent({
  operation,
  dependencies,
  iterations,
  onComplete,
}: WithMemoProps) {
  const [currentIteration, setCurrentIteration] = useState(1);
  const timesRef = useRef<number[]>([]);

  // Use actual React.useMemo
  const start = performance.now();
  const result = useMemo(() => operation(), dependencies);
  const end = performance.now();

  useEffect(() => {
    timesRef.current.push(end - start);

    if (currentIteration >= iterations) {
      onComplete(calculateMetrics(timesRef.current));
    } else {
      // Use setTimeout to avoid immediate re-render
      const timer = setTimeout(() => {
        setCurrentIteration((prev) => prev + 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentIteration, iterations, onComplete, end, start]);

  return null;
}
