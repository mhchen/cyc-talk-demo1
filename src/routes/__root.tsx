import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{
        padding: '1rem',
        borderBottom: '2px solid #333',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
          React performance demos
        </h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link
            to="/"
            style={{
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              backgroundColor: '#007acc',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
            activeProps={{
              style: {
                backgroundColor: '#005999'
              }
            }}
          >
            Home
          </Link>
          <Link
            to="/usememo"
            style={{
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              backgroundColor: '#007acc',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
            activeProps={{
              style: {
                backgroundColor: '#005999'
              }
            }}
          >
            useMemo demo
          </Link>
          <Link
            to="/spinner"
            style={{
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              backgroundColor: '#007acc',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
            activeProps={{
              style: {
                backgroundColor: '#005999'
              }
            }}
          >
            Spinner demo
          </Link>
          <Link
            to="/worker"
            style={{
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              backgroundColor: '#007acc',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
            activeProps={{
              style: {
                backgroundColor: '#005999'
              }
            }}
          >
            Worker demo
          </Link>
        </nav>
      </div>
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
})