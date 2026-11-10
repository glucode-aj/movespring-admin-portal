/** All palette values are owned by src/core/theme/theme.css. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: Object.fromEntries(['background', 'surface', 'surfaceElevated', 'textPrimary', 'textSecondary', 'border', 'primary', 'primaryHover', 'accent', 'success', 'warning', 'danger'].map(name => [name, `var(--${name.replace(/[A-Z]/g, c => '-' + c.toLowerCase())})`])),
      boxShadow: { raised: 'var(--shadow-raised)', inset: 'var(--shadow-inset)' },
      borderRadius: { card: 'var(--radius-card)', control: 'var(--radius-control)' },
      backgroundImage: { 'surface-gradient': 'var(--surface-gradient)' },
    },
  },
};
