import type { ComponentPropsWithoutRef, ElementType } from 'react';
type CardProps<T extends ElementType> = { as?: T; variant?: 'default' | 'elevated' | 'interactive'; className?: string; borderWidth?: 'thin' | 'default' } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;
/** No default padding: each migrated card keeps its original content geometry. */
export function Card<T extends ElementType = 'div'>({ as, variant = 'default', className = '', borderWidth = 'default', ...props }: CardProps<T>) {
  const Component = as || 'div';
  return <Component {...props} className={`ui-card ui-card--${variant} ui-card-border--${borderWidth} ${className}`} />;
}
