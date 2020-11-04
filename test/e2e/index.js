import { resolve } from 'path'
import test from 'ava'
import { Nuxt, Builder } from 'nuxt'

// import Vuex from 'vuex'
// import Vuetify from 'vuetify'
// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null
// let vuetify

// Init Nuxt.js and start listening on localhost:4000
test.before('Init Nuxt.js', async (t) => {
  const rootDir = resolve(__dirname, '../../')
  let config = {}
  try {
    config = require(resolve(rootDir, 'nuxt.config.js'))
  } catch (e) {}
  config.rootDir = rootDir // project folder
  config.dev = false // production build
  // config.mode = 'universal' // Isomorphic application
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  nuxt.listen(4000, 'localhost')
  // vuetify = new Vuetify({
  //   breakpoint: { width: 1000 }
  // })
})

// Example of testing only generated html
test('Route / exits and render HTML', async (t) => {
  const context = {}
  const { html } = await nuxt.renderRoute('/', context)
  // console.log('##########')
  // console.log(html)
  // console.log('##########')
  t.true(html.includes('Welcome to JIG'))
})

// Example of testing via DOM checking
test('Route / exists and renders HTML with CSS applied', async (t) => {
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/')
  const element = window.document.querySelector('.company-name')
  t.not(element, null)
  // t.is(element.textContent, 'Hello world!')
  t.is(element.className, 'company-name')
  // t.is(window.getComputedStyle(element).color, 'red')
  // console.log('##########')
  // console.log(window.document)
  // console.log('##########')
})

// Close the Nuxt server
test.after('Closing server', (t) => {
  nuxt.close()
})
