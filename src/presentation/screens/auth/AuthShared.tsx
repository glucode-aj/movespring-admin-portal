import React from 'react';

/** Shared authentication shell and brand icons. */

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="ms-root">
    
    <div className="ms-shell">{children}</div>
  </div>
);

/** Approximation of the brand mark. Swap for the exported Figma SVG for pixel accuracy. */
export const BrandMark: React.FC = () => (
  <svg
    className="ms-logo"
    viewBox="0 0 99 151"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="MoveSpring Logo"
  >
    <path d="M97.1 19.6A55 55 0 1 0 73.8 106.7L63.9 79.4A26 26 0 1 1 74.9 38.3Z" />
    <path d="M53 117A62 62 0 0 0 99 99V105A46 46 0 0 1 53 151Z" />
  </svg>
);

export const EyeIcon: React.FC<{ off?: boolean }> = ({ off }) =>
  off ? (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  ) : (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

export const ArrowIcon: React.FC = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);