import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '1rem' }}>
        React Performance Experiments
      </h2>
      <p style={{ lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.1rem' }}>
        Interactive demonstrations exploring React performance concepts through
        hands-on examples and real-time measurements.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
        <Link to="/usememo" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '2rem',
            border: '2px solid #ddd',
            borderRadius: '8px',
            backgroundColor: 'white',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#007acc';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#ddd';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#007acc' }}>
              🧠 useMemo Performance
            </h3>
            <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
              When does memoization actually help? Compare operations with and without
              useMemo to understand the performance trade-offs.
            </p>
          </div>
        </Link>

        <Link to="/spinner" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '2rem',
            border: '2px solid #ddd',
            borderRadius: '8px',
            backgroundColor: 'white',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#007acc';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#ddd';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#007acc' }}>
              🔄 Loading Spinners
            </h3>
            <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
              Why don't loading spinners show during heavy work? Explore microtasks
              vs macrotasks and the JavaScript event loop.
            </p>
          </div>
        </Link>
      </div>

      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        borderLeft: '4px solid #007acc'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>About This Project</h4>
        <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>
          This is an interactive educational toolkit for exploring React performance
          concepts. Each demo includes real performance measurements, source code,
          and explanations of the underlying JavaScript behavior.
        </p>
      </div>
    </div>
  )
}