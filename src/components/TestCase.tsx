import { useState, useEffect, useRef, FC } from 'react';
import {
  formatMetric,
  formatTotalTime,
  formatAverageTime,
  formatWithIterations,
} from '../utils/performance';
import type { TestCase as TestCaseType, TestResult } from '../types';

interface TestCaseProps {
  test: TestCaseType;
  isRunning: boolean;
  result: TestResult | null;
  onRun: (test: TestCaseType) => void;
}

const TestCase: FC<TestCaseProps> = ({ test, isRunning, result, onRun }) => {
  const [animating, setAnimating] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);


  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  useEffect(() => {
    if (isRunning) {
      setAnimating(true);
    } else {
      const timer = setTimeout(() => setAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isRunning]);

  const getStatusEmoji = (): string => {
    return '';
  };

  const getCardClass = (): string => {
    let classes = 'test-case';
    if (isRunning) classes += ' running';
    if (result && !isRunning) classes += ' complete';
    if (result?.surprising) classes += ' surprising';
    if (animating) classes += ' animating';
    return classes;
  };

  return (
    <div className={getCardClass()}>
      <div className="test-header">
        <div className="test-title">{test.name}</div>
        <div className="test-status">{getStatusEmoji()}</div>
      </div>
      <div className="test-description">{test.description}</div>

      {result && (
        <div className="iterations-info">
          <small>
            Iterations:{' '}
            {result.withoutMemo?.iterations?.toLocaleString() || 'N/A'}
          </small>
        </div>
      )}

      {result && (
        <div className="metrics">
          {test.id === 'rerender-impact' ? (
            <>
              <div className="metric-group">
                <div className="metric-group-title">Stable Dependencies</div>
                <div className="metric">
                  <span className="metric-label">Without useMemo</span>
                  <span className="metric-value">
                    {result.stableWithout
                      ? formatTotalTime(result.stableWithout)
                      : 'N/A'}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">With useMemo</span>
                  <span
                    className={`metric-value ${
                      result.stableWinner === 'with' ? 'faster' : 'slower'
                    }`}
                  >
                    {result.stableWith
                      ? formatTotalTime(result.stableWith)
                      : 'N/A'}
                    {result.stableWinner === 'with' ? ' 🏆' : ' ⚠️'}
                  </span>
                </div>
              </div>
              <div className="metric-group">
                <div className="metric-group-title">Changing Dependencies</div>
                <div className="metric">
                  <span className="metric-label">Without useMemo</span>
                  <span className="metric-value">
                    {result.changingWithout
                      ? formatTotalTime(result.changingWithout)
                      : 'N/A'}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">With useMemo</span>
                  <span
                    className={`metric-value ${
                      result.changingWinner === 'with' ? 'faster' : 'slower'
                    }`}
                  >
                    {result.changingWith
                      ? formatTotalTime(result.changingWith)
                      : 'N/A'}
                    {result.changingWinner === 'with' ? ' 🏆' : ' ⚠️'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="metric">
                <span className="metric-label">Without useMemo</span>
                <span
                  className={`metric-value ${
                    result.winner === 'without' ? 'faster' : 'slower'
                  }`}
                >
                  {result.withoutMemo
                    ? formatTotalTime(result.withoutMemo)
                    : 'N/A'}
                  {result.winner === 'without' ? ' 🏆' : ''}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">With useMemo</span>
                <span
                  className={`metric-value ${
                    result.winner === 'with' ? 'faster' : 'slower'
                  }`}
                >
                  {result.withMemo ? formatTotalTime(result.withMemo) : 'N/A'}
                  {result.winner === 'with' ? ' 🏆' : ' ⚠️'}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Difference</span>
                <span
                  className={`metric-value ${
                    result.winner === 'with' ? 'faster' : 'slower'
                  }`}
                >
                  {result.winner === 'with' ? '↓' : '↑'}
                  {formatMetric(result.difference!, true)}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {!result && !isRunning && (
        <div className="test-actions">
          <button className="btn btn-sm" onClick={() => onRun(test)}>
            Run test
          </button>
          {test.codeSnippet && (
            <button
              className="btn-link"
              onClick={() => dialogRef.current?.showModal()}
            >
              View code
            </button>
          )}
        </div>
      )}

      {isRunning && (
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      )}

      {test.codeSnippet && (
        <dialog ref={dialogRef} className="code-dialog" onClick={handleDialogClick}>
          <div className="dialog-content">
            <div className="dialog-header">
              <h3>{test.name}</h3>
              <button
                className="dialog-close"
                onClick={() => dialogRef.current?.close()}
              >
                ×
              </button>
            </div>
            <div className="code-content">
              <div>{test.codeSnippet}</div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default TestCase;
