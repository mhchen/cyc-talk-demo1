import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '1rem' }}>
        React Performance Experiments
      </h2>
      <p
        style={{ lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.1rem' }}
      >
        Interactive demonstrations exploring React performance concepts through
        hands-on examples and real-time measurements.
      </p>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        <Link to="/usememo" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: '2rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#007acc';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#007acc' }}>
              🧠 useMemo performance
            </h3>
            <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
              When does memoization actually help? Compare operations with and
              without useMemo to understand the performance trade-offs.
            </p>
          </div>
        </Link>

        <Link to="/spinner" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: '2rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#007acc';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#007acc' }}>
              🔄 Loading spinners
            </h3>
            <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
              Why don't loading spinners show during heavy work? Explore
              microtasks vs macrotasks and the JavaScript event loop.
            </p>
          </div>
        </Link>

        <Link to="/worker" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: '2rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#007acc';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#007acc' }}>
              ⚡ Web worker demo
            </h3>
            <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
              Experience the difference between main thread vs web worker
              processing. See how Fibonacci(42) freezes the UI on main thread
              but stays responsive with workers.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
