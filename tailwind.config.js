/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'islamic-green': '#0D9488',
        'islamic-blue': '#4F46E5',
        'islamic-gold': '#F59E0B',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
      },
      backgroundImage: {
        'prayer-pattern': "url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
      }
    },
  },
  plugins: [],
}
