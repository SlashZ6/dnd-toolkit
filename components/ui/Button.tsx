
import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'destructive' | 'ghost';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, size = 'md', variant = 'default', ...props }, ref) => {
    const sizeClasses = {
        sm: 'py-1 px-3 text-sm rounded-md',
        md: 'py-2 px-6 text-base rounded-lg',
        lg: 'py-3 px-8 text-lg rounded-lg',
    }
  
    const variantClasses = {
        default: 'bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-[var(--text-inverted)] shadow-lg hover:shadow-[0_0_15px_var(--glow-secondary)] focus:shadow-[0_0_15px_var(--glow-secondary)] focus:ring-[var(--accent-secondary)]',
        destructive: 'bg-[var(--bg-destructive)] hover:bg-[var(--bg-destructive-hover)] text-[var(--text-inverted)] shadow-lg hover:shadow-[0_0_15px_var(--glow-destructive)] focus:shadow-[0_0_15px_var(--glow-destructive)] focus:ring-[var(--accent-destructive)]',
        ghost: 'bg-transparent hover:bg-[var(--bg-ghost-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:ring-[var(--border-secondary)]',
    }
  
    return (
      <button
        ref={ref}
        {...props}
        className={`
          font-bold transition-all duration-200 transform hover:-translate-y-px active:translate-y-0
          disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${props.className || ''}
        `}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;