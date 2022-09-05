/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{html,js,tsx}',
    './src/**/*.{html,js,tsx,jsx}' ],
  theme: {
    extend: {
      height: theme => ( {
        'screen/1': '65vh',
        'screen/2': '50vh',
        'screen/0': '73vh',
        'screen/9': '80vg',
        'screen/3': 'calc(100vh / 3)',
        'screen/4': 'calc(100vh / 4)',
        'screen/5': 'calc(100vh / 5)'
      } ),
    }
  }
};
