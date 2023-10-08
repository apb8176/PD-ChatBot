/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        '11': 'repeat(11, minmax(0, 1fr))',

        // Complex site-specific column configuration
        'footer': '200px minmax(900px, 1fr) 100px',
      },
      colors: {
        gray: {
          100: 'rgba(242, 242, 247, 0.60)',
          // ...
          900: '#1a202c',
        },
        "base-shade-100": "var(--base-shade-100)",
        "light-black": "var(--light-black)",
      },
    },
  },
  plugins: [],
}

