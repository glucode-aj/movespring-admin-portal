import React from 'react';

/**
 * Self-contained styles for the Sign In / Sign Up screens.
 * No Tailwind or global CSS required: every rule is scoped under .ms-root.
 */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap');

.ms-root, .ms-root * { box-sizing: border-box; }
.ms-root * { margin: 0; }
.ms-root button, .ms-root input { font-family: inherit; }

.ms-root {
  /* Break out of any centered / max-width parent (#root, body flex, etc.) */
  position: fixed;
  inset: 0;
  z-index: 10;
  overflow-x: hidden;
  overflow-y: auto;
  background: #ffffff;
  color: #000000;
  color-scheme: light;
  text-align: left;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: normal;
  -webkit-font-smoothing: antialiased;
  user-select: none;
}
.ms-root .ms-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
}

/* Left brand panel */
.ms-root .ms-left {
  display: none;
  width: 50%;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #ffffff;
  border-right: 1px solid #000000;
}
.ms-root .ms-logo { width: 99px; height: auto; color: #000000; }

/* Right panel */
.ms-root .ms-right {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 40px 32px 112px;
  background: #ffffff;
}
.ms-root .ms-narrow { width: 100%; max-width: 613px; margin: 0 auto; }

/* Pill toggle */
.ms-root .ms-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: 9999px;
}
.ms-root .ms-pill-btn {
  padding: 14px 48px;
  white-space: nowrap;
  border: 0;
  border-radius: 9999px;
  background: #ffffff;
  color: #000000;
  font-size: 15px;
  line-height: 24px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.15s;
}
.ms-root .ms-pill-btn:hover { color: #525252; }
.ms-root .ms-pill-btn.ms-active { background: #000000; color: #ffffff; cursor: default; }
.ms-root .ms-pill-btn.ms-active:hover { color: #ffffff; }

/* Form block */
.ms-root .ms-formwrap { margin: auto; padding: 40px 0; }
.ms-root .ms-eyebrow {
  margin-bottom: 48px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.ms-root .ms-title {
  margin-bottom: 20px;
  font-family: inherit;
  color: #000000;
  text-align: left;
  text-transform: none;
  font-size: 36px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.025em;
}
.ms-root .ms-sub { margin-bottom: 44px; font-family: inherit; font-size: 14px; font-weight: 400; line-height: 1.5; text-align: left; color: #525252; }
.ms-root .ms-sub.ms-tight { margin-bottom: 32px; }

.ms-root .ms-stack-lg > * + * { margin-top: 64px; }
.ms-root .ms-stack-sm > * + * { margin-top: 20px; }

.ms-root .ms-label { display: block; margin-bottom: 20px; font-size: 13px; font-weight: 700; }

/* Gray field with inset dashed border */
.ms-root .ms-field { position: relative; padding: 13px 16px; background: #D9D9D9; transition: background 0.15s; }
.ms-root .ms-field.ms-field-name { padding-left: 6px; padding-right: 6px; }
.ms-root .ms-field:focus-within { background: #ffffff; }
.ms-root .ms-input {
  display: block;
  width: 100%;
  height: 55px;
  padding: 0 16px;
  background: transparent;
  border: 2px dashed #525252;
  border-radius: 0;
  outline: none;
  font-size: 14px;
  color: #000000;
  transition: border-color 0.15s;
}
.ms-root .ms-input::placeholder { color: #737373; }
.ms-root .ms-input:focus { border-style: solid; border-color: #000000; }
.ms-root .ms-input.ms-pw { padding-right: 56px; }
.ms-root .ms-pwbox { position: relative; }
.ms-root .ms-eye {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  display: flex;
  padding: 0;
  border: 0;
  background: none;
  color: #000000;
  cursor: pointer;
}
.ms-root .ms-eye:hover { opacity: 0.75; }

.ms-root .ms-grid-names { display: grid; grid-template-columns: 1fr; gap: 20px; }

/* Checkbox rows */
.ms-root .ms-row { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; font-size: 11px; }
.ms-root .ms-checklabel { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.ms-root .ms-check { width: 14px; height: 14px; accent-color: #000000; cursor: pointer; }
.ms-root .ms-muted { color: #404040; }
.ms-root .ms-strong { font-weight: 700; color: #000000; text-decoration: underline; }
.ms-root .ms-link {
  padding: 0;
  border: 0;
  background: none;
  color: #000000;
  font-size: 11px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}
.ms-root .ms-link:hover { text-decoration: none; }
.ms-root .ms-terms { margin-top: 20px; }

/* Primary CTA */
.ms-root .ms-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 48px;
  padding: 16px 24px;
  border: 0;
  background: #F09343;
  opacity: 1;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 6px 6px 0 0 #000000;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
}
.ms-root .ms-cta.ms-cta-tight { margin-top: 20px; }
.ms-root .ms-cta:hover { background: #F3A15E; }
.ms-root .ms-cta:active { background: #E07D2C; transform: translate(4px, 4px); box-shadow: none; }

/* Help button */
.ms-root .ms-help {
  position: absolute;
  right: 24px;
  bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background: #525252;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
}
.ms-root .ms-help:hover { background: #262626; }

@media (min-width: 640px) {
  .ms-root .ms-grid-names { grid-template-columns: 1fr 1fr; gap: 40px; }
}
@media (min-width: 768px) {
  .ms-root .ms-shell { flex-direction: row; }
  .ms-root .ms-left { display: flex; }
  .ms-root .ms-right { width: 50%; padding: 112px 56px 112px; }
  .ms-root .ms-title { font-size: 54px; }
}
@media (min-width: 1024px) {
  .ms-root .ms-right { padding-left: 96px; padding-right: 96px; }
}
`;

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="ms-root">
    <style>{CSS}</style>
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