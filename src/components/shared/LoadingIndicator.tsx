interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const getSizeStyles = (size: LoadingIndicatorProps['size']) => {
  switch (size) {
    case 'small':
      return { fontSize: '24px', padding: '1rem' };
    case 'large':
      return { fontSize: '64px', padding: '3rem' };
    case 'medium':
    default:
      return { fontSize: '48px', padding: '2rem' };
  }
};

export function LoadingIndicator({
  size = 'medium',
  message = 'Loading...',
  variant = 'spinner'
}: LoadingIndicatorProps) {
  const sizeStyles = getSizeStyles(size);

  const getIndicator = () => {
    switch (variant) {
      case 'dots':
        return '⋯';
      case 'pulse':
        return '●';
      case 'spinner':
      default:
        return '🔄';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...sizeStyles
    }}>
      <div style={{
        fontSize: sizeStyles.fontSize,
        animation: variant === 'spinner' ? 'spin 1s linear infinite' :
                  variant === 'pulse' ? 'pulse 1.5s ease-in-out infinite' : 'none'
      }}>
        {getIndicator()}
      </div>
      <div style={{
        marginTop: '0.5rem',
        fontSize: '1rem',
        color: '#666'
      }}>
        {message}
      </div>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
}