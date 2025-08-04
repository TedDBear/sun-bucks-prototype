/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        primary: 'black',
        background: '#ffffff',
        foreground: '#252525',          // Approximate oklch(0.145 0 0) → dark gray
        card: '#ffffff',
        'card-foreground': '#252525',  // same as foreground approx
        popover: '#ffffff',             // oklch(1 0 0) = white
        'popover-foreground': '#252525',
        'primary-foreground': '#ffffff',  // oklch(1 0 0) white
        secondary: '#f6f6f7',           // approx oklch(0.95 0.0058 264.53)
        'secondary-foreground': '#030213',
        muted: '#ececf0',
        'muted-foreground': '#717182',
        accent: '#e9ebef',
        'accent-foreground': '#030213',
        destructive: '#d4183d',
        'destructive-foreground': '#ffffff',
        border: 'rgba(0, 0, 0, 0.1)',
        input: 'transparent',
        'input-background': '#f3f3f5',
        'switch-background': '#cbced4',
        ring: '#b4b4b4',                // approx oklch(0.708 0 0)
        'chart-1': '#a19e56',           // approx oklch(0.646 0.222 41.116)
        'chart-2': '#9999ff',           // approx oklch(0.6 0.118 184.704)
        'chart-3': '#6b74e0',           // approx oklch(0.398 0.07 227.392)
        'chart-4': '#c1a856',           // approx oklch(0.828 0.189 84.429)
        'chart-5': '#bba856',           // approx oklch(0.769 0.188 70.08)
        sidebar: '#ffffff',
        'sidebar-foreground': '#252525',
        'sidebar-primary': '#030213',
        'sidebar-primary-foreground': '#ffffff',
        'sidebar-accent': '#f8f8f8',     // approx oklch(0.97 0 0)
        'sidebar-accent-foreground': '#585858',
        'sidebar-border': '#454545',
        'sidebar-ring': '#b4b4b4',
      },
      fontSize: {
        base: '14px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
      },
      borderRadius: {
        DEFAULT: '0.625rem', // 10px
      },
    },
    
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [],
};