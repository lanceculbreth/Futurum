/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Futurum Light Theme (based on product screenshot)
        futurum: {
          // Backgrounds
          bg: '#f5f7fa',           // Main background (light gray)
          bgAlt: '#eef1f5',        // Alternate background
          white: '#ffffff',         // Cards, surfaces
          
          // Primary blue accent
          primary: '#357CA3',       // Primary blue
          primaryHover: '#2a6285',  // Primary hover
          primaryLight: '#e8f1f6',  // Light blue background
          
          // Text colors
          text: '#1a1a2e',          // Primary text (dark)
          textMuted: '#5a6578',     // Secondary text
          textDim: '#8c95a4',       // Dimmed text
          
          // Borders and dividers
          border: '#e2e8f0',        // Light border
          borderDark: '#cbd5e1',    // Darker border
          
          // Status colors
          pending: '#f59e0b',       // Orange/amber
          pendingBg: '#fef3c7',
          success: '#10b981',       // Green
          successBg: '#d1fae5',
          info: '#357CA3',          // Blue
          infoBg: '#e8f1f6',
          warning: '#ef4444',       // Red
          warningBg: '#fee2e2',
          
          // Sidebar
          sidebar: '#ffffff',
          sidebarHover: '#f1f5f9',
          sidebarActive: 'rgba(53, 124, 163, 0.05)',
        },
        // Futurum Dark Theme
        dark: {
          // Backgrounds
          bg: '#0f1117',            // Main background
          bgAlt: '#1a1d24',         // Alternate background
          surface: '#1e2128',       // Cards, surfaces
          
          // Primary blue accent
          primary: '#4a9fd4',       // Primary blue (brighter for dark)
          primaryHover: '#5db4e8',  // Primary hover
          primaryLight: '#1e3a4a',  // Dark blue background
          
          // Text colors
          text: '#f1f5f9',          // Primary text (light)
          textMuted: '#94a3b8',     // Secondary text
          textDim: '#64748b',       // Dimmed text
          
          // Borders and dividers
          border: '#2d3341',        // Dark border
          borderDark: '#3d4451',    // Darker border
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'cardHover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
