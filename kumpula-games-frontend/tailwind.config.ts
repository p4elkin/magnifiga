export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        'card': '1fr auto',
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        'card': 'auto auto auto',
      },

      height: {
        '100': '24rem',
      },
      flexBasis: {
        '8-card-layout': 'calc(25% - 1rem)',
      }
    },
    plugins: [  ]
  }
}