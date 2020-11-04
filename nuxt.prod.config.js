export default {
  mode: 'spa',
  router: {
    middleware: ['authenticated', 'route_info'],
    base: '/g2m/'
  },
  env: {
    apiUrl: 'http://test.com.tw',
    mqUrl: 'wss://rabbitmq.jutainet.com:53533/ws',
    mqheader: {
      login: 'java',
      passcode: '12345',
      vhost: 'demo_mq'
    },
    dev: false
  },
  generate: {
    dir: 'dist-prod'
  },
  /*
   ** Headers of the page
   */
  head: {
    // titleTemplate: '%s - ' + process.env.npm_package_name,
    title: 'JIG总后台', // process.env.npm_package_name || ''
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    // CSS file in the project
    '@/assets/main.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/api_config', '~/plugins/api_route'],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    [
      'nuxt-i18n',
      {
        defaultLocale: 'zh-cn',
        locales: [
          { code: 'zh-cn', name: '简体中文', file: 'zhHans.js' }
          // { code: 'en', name: 'English', file: 'en.js' },
          // { code: 'zh-tw', name: '正体中文', file: 'zhHant.js' }
        ],
        langDir: '/lang/',
        seo: false,
        lazy: true
      }
    ]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    optionsPath: '~/plugins/vuetify.js'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
