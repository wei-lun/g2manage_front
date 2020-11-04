import colors from 'vuetify/es5/util/colors'
import zhHans from 'vuetify/es5/locale/zh-Hans'
import '@mdi/font/css/materialdesignicons.css'

const themeDark = localStorage.getItem('user_dark_theme')
  ? JSON.parse(localStorage.getItem('user_dark_theme'))
  : true

const theme = {
  dark: themeDark,
  themes: {
    light: {
      primary: colors.blue.darken3,
      accent: colors.grey.darken1,
      secondary: colors.grey,
      info: colors.teal.lighten1,
      warning: colors.amber.darken2,
      error: colors.deepOrange.darken1,
      danger: colors.deepOrange.darken1,
      success: colors.green.darken1
    },
    dark: {
      primary: colors.blue.darken3,
      accent: colors.grey.darken3,
      secondary: colors.grey.darken2,
      info: colors.teal.lighten1,
      warning: colors.amber.darken2,
      error: colors.deepOrange.darken1,
      danger: colors.deepOrange.darken1,
      success: colors.green.darken1
    }
  }
}

const lang = {
  locales: { zhHans },
  current: 'zhHans'
}

const icons = {
  iconfont: 'mdi' // default - only for display purposes
}

export default {
  icons,
  theme,
  lang
}
