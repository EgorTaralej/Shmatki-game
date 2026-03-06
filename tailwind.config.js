/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'shmatki-dark': '#12102e',
        'shmatki-purple': '#1e1b4b',
        'shmatki-cyan': '#22d3ee',
        'shmatki-magenta': '#a855f7',
      },
      backgroundImage: {
        'shmatki-gradient': 'linear-gradient(to bottom, #1e1b4b, #12102e)',
        'btn-gradient': 'linear-gradient(to right, #22d3ee, #a855f7)',
      },
      boxShadow: {
        'btn': '0 4px 20px rgba(34, 211, 238, 0.4)',
      }
    },
  },
  plugins: [],
}
