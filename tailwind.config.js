/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dark: '#9A7A2E',
        },
        obsidian: '#0A0A0F',
        deep: '#12121A',
        surface: {
          DEFAULT: '#1A1A26',
          2: '#22223A',
          3: '#2A2A45',
        },
        lux: {
          text: '#F0EDE8',
          muted: '#9896A0',
          dim: '#6A6878',
          accent: '#7C5CBF',
          accent2: '#4ECDC4',
          danger: '#E05C5C',
          success: '#5CB85C',
        },
        border: 'rgba(201,168,76,0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Tajawal', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        elegant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      borderRadius: {
        lux: '16px',
        'lux-sm': '10px',
      },
      boxShadow: {
        lux: '0 20px 60px rgba(0,0,0,0.5)',
        gold: '0 4px 20px rgba(201,168,76,0.3)',
        'gold-lg': '0 8px 30px rgba(201,168,76,0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #9A7A2E, #C9A84C, #E8C97A)',
        'obsidian-gradient': 'linear-gradient(180deg, #0A0A0F 0%, #12121A 100%)',
        'hero-radial': 'radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
