module.exports = {
  purge: {
    content: ['./src/**/*.html', './src/**/*.css', './src/**/*.js'],
  },
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    textColor: ['responsive', 'hover', 'focus', 'visited'],
  },
  plugins: [],
};
