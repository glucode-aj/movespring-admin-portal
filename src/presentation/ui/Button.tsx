import type { ComponentPropsWithoutRef } from 'react';
import { Card } from './Card';
export function Button({ className = '', variant = 'default', type = 'button', card = false, ...props }: ComponentPropsWithoutRef<'button'> & { variant?: 'default' | 'primary'; card?: boolean }) {
  const classes = `ui-button ui-button--${variant} ${className}`;
  return card ? <Card as="button" variant="interactive" {...props} type={type} className={classes} /> : <button {...props} type={type} className={classes} />;
}
