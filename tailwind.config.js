/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#E1F5D1',
        'brand-yellow': '#FFF2B8',
        'deep-green': '#183D2A',
        'page-bg': '#FBFCF8',
        'surface': '#FFFFFF',
        'text-muted': '#647566',
        'success': '#287A45',
        'warning': '#A66B00',
        'danger': '#B42318',
        'border': '#E1E8DE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'control': '9px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(24, 61, 42, 0.05), 0 1px 2px 0 rgba(24, 61, 42, 0.03)',
        'card': '0 4px 6px -1px rgba(24, 61, 42, 0.05), 0 2px 4px -1px rgba(24, 61, 42, 0.03)',
        'dropdown': '0 10px 15px -3px rgba(24, 61, 42, 0.08), 0 4px 6px -2px rgba(24, 61, 42, 0.04)',
      },
      keyframes: {
        dialogIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        drawerIn: {
          '0%': { opacity: '0', transform: 'translateX(-1rem)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(0.5rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'dialog-in': 'dialogIn 150ms ease-out',
        'drawer-in': 'drawerIn 200ms ease-out',
        'toast-in': 'toastIn 200ms ease-out',
      },
    },
  },
  plugins: [],
};
