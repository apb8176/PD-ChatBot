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
          100: 'rgba(242, 242, 247)',
          // ...
          900: '#1a202c',
        },
        'primary': '#6FCD82',
        "base-shade-100": "var(--base-shade-100)",
        "light-black": "var(--light-black)",
        'slate-600':"#436879",
        'teal-500':"rgba(49, 179, 174, 0.75)",
        
      },
    },
  },
  plugins: [],
}

