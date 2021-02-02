<template>
  <div id="app">
    <v-app id="inspire" :dark="isDark"
       v-touch="{
         right: () => drawer = true,
         left: () => drawer = false
       }"
    >
      <v-navigation-drawer
        v-model="drawer"
        app
        fixed
        temporary
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Pixiv Viewer
            </v-list-item-title>
            <v-list-item-subtitle>
              Made by Lxns
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list
          dense
          nav
        >
          <v-list-item-group color="primary">
            <v-list-item
              link @click="toPath('/')"
            >
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ this.$i18n.t('header.homePage') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <div v-if="session !== null">
              <v-list-item link @click="toPath('/user/bookmark_new_illusts')">
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ this.$i18n.t('header.bookmarkNewIllustsPage') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="toPath('/user/discovery')">
                <v-list-item-icon>
                  <v-icon>mdi-compass</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ this.$i18n.t('header.discoveryPage') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
            <v-list-item
              link @click="toPath('/about')"
            >
              <v-list-item-icon>
                <v-icon>mdi-information</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ this.$i18n.t('header.aboutPage') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link @click="toPath('/settings')"
            >
              <v-list-item-icon>
                <v-icon>mdi-settings</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ this.$i18n.t('header.settingsPage') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-divider />
        <v-list
          dense
          nav
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ this.$i18n.t('header.darkMode') }}</v-list-item-title>
            </v-list-item-content>
            <v-switch style="margin-top: -4px;"
                      v-model="$vuetify.theme.dark"
                      hide-details
                      inset
                      @change="darkMode()"
            />
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <div>
        <v-app-bar
          app
          elevate-on-scroll
          :color="$vuetify.theme.dark ? '' : 'blue darken-3'"
          dark
          height="56px"
          v-if="!headerSrc"
        >
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          <v-toolbar-title
            style="width: 300px"
            class="ml-0 pl-4"
          >
            <span>Pixiv Viewer</span>
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon>
            <v-icon>mdi-apps</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-bell</v-icon>
          </v-btn>
        </v-app-bar>
        <v-app-bar
          app
          elevate-on-scroll
          color="blue darken-3"
          dark
          height="56px"
          :src="proxyUrl + headerSrc"
          v-else
        >
          <template v-slot:img="{ props }">
            <v-img
              v-bind="props"
              gradient="to top, rgba(0,0,0,.2), rgba(0,0,0,.2)"
            />
          </template>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          <v-toolbar-title
            style="width: 300px"
            class="ml-0 pl-4"
          >
            <span>Pixiv Viewer</span>
          </v-toolbar-title>
        </v-app-bar>
      </div>
      <div
      >
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"
                       v-on:getValue="getValueFunc" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"
                     v-on:getValue="getValueFunc" />
      </div>
    </v-app>
  </div>
</template>

<script>
import Axios from 'axios'

export default {
  name: 'App',
  data: vm => ({
    drawer: null,
    headerSrc: null,
    proxyUrl: 'https://lxns.org/proxy.php?type=pixiv&header=image/png&link=',
    session: localStorage.getItem('session'),
    isDark: !!localStorage.getItem('darkMode') || false
  }),
  mounted () {
  },
  methods: {
    getValueFunc: function (text) { // 子部件传参
      if (text.headerSrc !== null) {
        this.headerSrc = text.headerSrc
      }
      if (text.session !== null) {
        this.session = text.session
      }
      if (text.clearSession !== null) {
        if (text.clearSession === true) {
          this.session = null
        }
      }
    },
    toPath (path) {
      this.headerSrc = null
      if (this.$route.path !== path) {
        this.$router.push({ path: path })
      }
    },
    darkMode () {
      this.isDark = !this.isDark
      this.$nextTick(() => {
        localStorage.setItem('darkMode', (!this.isDark).toString())
      })
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log(to.path)
      // console.log(from.path)
      if (localStorage.getItem('session') !== null) {
        Axios
          .post('https://pixiv-api.lxns.org/refresh.php', 'session=' + localStorage.getItem('session'), undefined)
          .then(res => {
            if (res.data.status !== 'success') {
              localStorage.removeItem('session')
            }
          })
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
