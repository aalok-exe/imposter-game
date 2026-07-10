import type { ButtonHTMLAttributes } from 'react';

interface StampButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function StampButton({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: StampButtonProps) {
  return (
    <button className={`btn ${variant} ${className}`} {...rest}>
      {children}
    </button>
  );
}
