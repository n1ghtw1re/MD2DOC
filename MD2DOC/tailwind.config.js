/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#00ff00',
            a: {
              color: '#00ff00',
              '&:hover': {
                color: '#00cc00',
              },
            },
            h1: {
              color: '#00ff00',
              fontWeight: '700',
            },
            h2: {
              color: '#00ff00',
              fontWeight: '600',
            },
            h3: {
              color: '#00ff00',
              fontWeight: '600',
            },
            code: {
              color: '#00ff00',
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};