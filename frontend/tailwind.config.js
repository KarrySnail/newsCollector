/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DE2910',
          dark: '#BE1800',
          light: '#FF3B1D'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            a: {
              color: '#DE2910',
              '&:hover': {
                color: '#BE1800'
              }
            },
            h1: {
              color: '#111',
              fontWeight: '700'
            },
            h2: {
              color: '#222',
              fontWeight: '600'
            },
            blockquote: {
              borderLeftColor: '#DE2910',
              color: '#666'
            }
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}