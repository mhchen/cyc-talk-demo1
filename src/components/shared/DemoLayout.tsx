import { ReactNode } from 'react';

interface DemoLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  explanation?: ReactNode;
}

export function DemoLayout({
  title,
  subtitle,
  children,
  actions,
  explanation
}: DemoLayoutProps) {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'monospace',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          margin: '0 0 0.5rem 0',
          color: '#333',
          fontSize: '2.5rem'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '1.2rem',
            fontStyle: 'italic'
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          {actions}
        </div>
      )}

      <main>
        {children}
      </main>

      {explanation && (
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: '4px solid #007acc'
        }}>
          {explanation}
        </div>
      )}
    </div>
  );
}