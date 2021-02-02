// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import VueResources from 'vue-resource'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

// Translation provided by Lxns
import zhHans from './locale/zh-Hans.json'
import zhHant from './locale/zh-Hant.json'
import en from './locale/en.json'
import ja from './locale/ja.json'

Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(Vuetify)
Vue.use(VueResources)

let language = 'en'
if (localStorage.getItem('locale') !== null) {
  language = localStorage.getItem('locale')
} else {
  if (navigator.language === 'zh-CN') {
    localStorage.setItem('locale', 'zhHans')
  } else if (navigator.language === 'zh-TW') {
    localStorage.setItem('locale', 'zhHant')
  } else if (navigator.language === 'ja-JP') {
    localStorage.setItem('locale', 'ja')
  } else {
    localStorage.setItem('locale', 'en')
  }
}
language = localStorage.getItem('locale')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: vm => ({
    initialDark: vm.$vuetify
      ? localStorage.getItem('darkMode')
      : false
  }),
  mounted () {
    if (localStorage.getItem('darkMode') === 'true') {
      this.$vuetify.theme.dark = true
    }
  },
  vuetify: new Vuetify({
    /*
    lang: {
      locales: {
        zhHans,
        zhHant,
        en,
        ja
      },
      current: language
    },
    */
    icons: {
      iconfont: 'mdi'
    }
  }),
  i18n: new VueI18n({
    locale: language,
    messages: {
      'zhHans': zhHans,
      'zhHant': zhHant,
      'en': en,
      'ja': ja
    }
  })
})
