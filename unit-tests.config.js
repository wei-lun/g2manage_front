export default {
  require: ['./test/unit.ava.setup.js'],
  ignoredByWatcher: ['!**/*.{js,vue}'],
  files: ['test/specs/**/*'],
  // files: ['test/specs/sitestatus.spec.js'],
  timeout: '100000',
  tap: true,
  verbose: true
}
