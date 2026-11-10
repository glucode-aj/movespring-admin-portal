import type { ComponentPropsWithoutRef } from 'react';
export function Input({ className = '', type, ...props }: ComponentPropsWithoutRef<'input'>) {
  const field = !['checkbox', 'radio'].includes(type || 'text');
  return <input {...props} type={type} className={`${field ? 'ui-input' : 'ui-choice'} ${className}`} />;
}
export function Textarea({ className = '', ...props }: ComponentPropsWithoutRef<'textarea'>) { return <textarea {...props} className={`ui-input ${className}`} />; }
export function Select({ className = '', ...props }: ComponentPropsWithoutRef<'select'>) { return <select {...props} className={`ui-input ${className}`} />; }
