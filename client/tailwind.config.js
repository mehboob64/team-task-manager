/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17212b',
        brand: '#2563eb',
        mint: '#10b981'
      }
    }
  },
  plugins: []
};
