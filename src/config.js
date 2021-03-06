require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
  app: {
    title: 'Rideness',
    description: 'Drive smarter, not harder.',
    head: {
      titleTemplate: 'Rideness: %s',
      meta: [
        {name: 'description', content: 'Drive smarter, not harder.'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'Rideness'},
        {property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'Rideness'},
        {property: 'og:description', content: 'Drive smarter, not harder.'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@erikras'},
        {property: 'og:creator', content: '@erikras'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
