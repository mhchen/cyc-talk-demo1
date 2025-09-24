import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: '#007acc',
        color: 'white',
        border: '1px solid #007acc',
      };
    case 'danger':
      return {
        backgroundColor: '#dc3545',
        color: 'white',
        border: '1px solid #dc3545',
      };
    case 'secondary':
    default:
      return {
        backgroundColor: '#6c757d',
        color: 'white',
        border: '1px solid #6c757d',
      };
  }
};

const getSizeStyles = (size: ButtonProps['size']) => {
  switch (size) {
    case 'small':
      return {
        padding: '0.375rem 0.75rem',
        fontSize: '0.875rem',
      };
    case 'large':
      return {
        padding: '0.75rem 1.5rem',
        fontSize: '1.125rem',
      };
    case 'medium':
    default:
      return {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
      };
  }
};

export function Button({
  children,
  variant = 'secondary',
  size = 'medium',
  style,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <button
      style={{
        ...variantStyles,
        ...sizeStyles,
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}