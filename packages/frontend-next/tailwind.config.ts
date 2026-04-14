import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.06em',
        'extra-tight': '-0.045em',
        tighter: '-0.03em',
      },
      colors: {
        'nv-dark': '#00172d',
        'nv-dark-80': '#00172d',
        'nv-cream': '#f7dba7',
        'nv-cream-light': 'rgb(251, 238, 213)',
        'nv-cream-dark': 'rgb(255, 231, 186)',
        'nv-yellow': '#ffd95a',
        'nv-text': '#52606d',
      },
      backgroundImage: {
        'nv-gradient':
          'linear-gradient(180deg, rgb(251, 238, 213) 6.17%, rgb(251, 238, 213) 75.14%, rgb(255, 231, 186) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
