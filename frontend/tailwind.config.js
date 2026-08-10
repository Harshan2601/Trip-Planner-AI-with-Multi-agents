/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#0B1220',
          elev: '#121B2E',
          line: '#1E2A42',
        },
        paper: '#F4EDE1',
        cream: '#F5EFE6',
        muted: '#9AA5B8',
        amber: {
          DEFAULT: '#E8A33D',
          soft: '#F2C374',
        },
        coral: {
          DEFAULT: '#FF6B4A',
          hover: '#FF8567',
        },
        teal: {
          DEFAULT: '#4FB0A5',
          soft: '#8FD1C8',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
