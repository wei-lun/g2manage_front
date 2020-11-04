export default {
  require: ['./test/e2e.ava.setup.js'],
  ignoredByWatcher: ['!**/*.{js,vue}'],
  files: ['test/e2e/**/*'],
  timeout: '100000',
  tap: true,
  verbose: true
}
