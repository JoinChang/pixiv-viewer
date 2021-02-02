<template>
  <v-main fluid style="padding: 56px 0 0 0">
    <v-list flat>
      <v-list-item-group
        subheader
        two-line
        flat
      >
        <v-subheader>{{ this.$i18n.t('settings.account') }}</v-subheader>
        <v-list-item-group>
          <v-list-item @click="loginDialog = true" v-if="session === null"><!-- 未登录 -->
            <v-list-item-content>
              <v-list-item-title>{{ this.$i18n.t('settings.login') }}</v-list-item-title>
              <v-list-item-subtitle>{{ this.$i18n.t('settings.loginDetail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout()" v-else><!-- 登录 -->
            <v-list-item-content>
              <v-list-item-title>{{ this.$i18n.t('settings.logout') }}</v-list-item-title>
              <v-list-item-subtitle>{{ this.$i18n.t('settings.logoutDetail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-dialog v-model="loginDialog" max-width="300px">
            <v-card>
              <v-card-title class="headline">{{ this.$i18n.t('settings.loginDialog') }}</v-card-title>
              <v-text-field style="margin: 0 24px"
                v-model="loginAccount"
                :label="this.$i18n.t('settings.loginAccount')" />
              <v-text-field style="margin: 0 24px"
                v-model="loginPassword"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :label="this.$i18n.t('settings.loginPassword')"
                @click:append="showPassword = !showPassword" />
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="loginDialog = false">{{ this.$i18n.t('settings.loginDialogCancel') }}</v-btn>
                <v-btn text @click="loginDialog = false, loginSubmit()">{{ this.$i18n.t('settings.loginDialogSubmit') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item-group>
      </v-list-item-group>
      <v-list-item-group
        subheader
        two-line
        flat
      >
        <v-subheader>{{ this.$i18n.t('settings.display') }}</v-subheader>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                color="primary"
                v-model="r18"
                @change="r18DialogFunc()"
              />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ this.$i18n.t('settings.r18') }}</v-list-item-title>
              <v-list-item-subtitle>{{ this.$i18n.t('settings.r18Detail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-dialog v-model="r18Dialog" persistent max-width="300px">
            <v-card>
              <v-card-title class="headline">{{ this.$i18n.t('settings.r18Dialog') }}</v-card-title>
              <v-card-text>{{ this.$i18n.t('settings.r18DialogContent') }}</v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="r18Dialog = false, r18 = false">{{ this.$i18n.t('settings.r18DialogDisagree') }}</v-btn>
                <v-btn text @click="r18Dialog = false, r18DialogFunc(true)">{{ this.$i18n.t('settings.r18DialogAgree') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item-group>
      </v-list-item-group>
      <v-list-item-group subheader two-line flat>
        <v-subheader>{{ this.$i18n.t('settings.accessibility') }}</v-subheader>
        <v-list-item-group>
          <v-list-item @click="dialog = true">
            <v-list-item-icon>
              <v-icon>mdi-earth</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ this.$i18n.t('settings.language') }}</v-list-item-title>
              <v-list-item-subtitle>{{ this.$i18n.t('settings.languageDetail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-dialog v-model="dialog" scrollable max-width="300px">
            <v-card>
              <v-card-title>{{ this.$i18n.t('settings.language') }}</v-card-title>
              <v-divider />
              <v-list>
                <v-list-item-group @change="changeLang" v-model="selectLang" mandatory>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>简体中文</v-list-item-title>
                      <v-list-item-subtitle>中国</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>繁體中文</v-list-item-title>
                      <v-list-item-subtitle>中国台湾</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>日本語</v-list-item-title>
                      <v-list-item-subtitle>日本</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>English</v-list-item-title>
                      <v-list-item-subtitle>US</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-dialog>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                color="primary"
                v-model="$vuetify.theme.dark"
                @change="darkMode()"
              />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ this.$i18n.t('settings.darkMode') }}</v-list-item-title>
              <v-list-item-subtitle>{{ this.$i18n.t('settings.darkModeDetail') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list-item-group>
    </v-list>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <v-btn text @click="snackbar = false" color="pink">
        {{ this.$i18n.t('close') }}
      </v-btn>
    </v-snackbar>
  </v-main>
</template>

<script>
import Axios from 'axios'

export default {
  name: 'Settings',
  data: vm => ({
    selectLang: 3,
    dialog: false,
    r18Dialog: false,
    r18: false,
    loginDialog: false,
    showPassword: false,
    loginPassword: null,
    loginAccount: null,
    snackbar: false,
    snackbarText: null,
    session: null
  }),
  mounted () {
    const _this = this
    if (localStorage.getItem('r18') !== null) {
      _this.r18 = localStorage.getItem('r18') === 'true'
    } else {
      localStorage.setItem('r18', 'false')
    }
    if (localStorage.getItem('session') !== null) {
      _this.session = localStorage.getItem('session')
    }
    if (localStorage.getItem('locale') === 'zhHans') {
      _this.selectLang = 0
    } else if (localStorage.getItem('locale') === 'zhHant') {
      _this.selectLang = 1
    } else if (localStorage.getItem('locale') === 'ja') {
      _this.selectLang = 2
    }
  },
  methods: {
    darkMode () {
      localStorage.setItem('darkMode', this.$vuetify.theme.dark)
    },
    changeLang () {
      let _this = this
      if (_this.selectLang === 0) {
        localStorage.setItem('locale', 'zhHans')
      } else if (_this.selectLang === 1) {
        localStorage.setItem('locale', 'zhHant')
      } else if (_this.selectLang === 2) {
        localStorage.setItem('locale', 'ja')
      } else {
        localStorage.setItem('locale', 'en')
      }
      this.$i18n.locale = localStorage.getItem('locale')
      _this.dialog = false
    },
    r18DialogFunc (action) {
      if (action === true) {
        localStorage.setItem('r18', 'true')
      } else {
        let _this = this
        if (_this.r18 === true) {
          _this.r18Dialog = true
        } else {
          localStorage.setItem('r18', 'false')
        }
      }
    },
    loginSubmit () {
      let _this = this
      Axios
        .post('https://pixiv-api.lxns.org/login.php', 'username=' + _this.loginAccount + '&password=' + _this.loginPassword, undefined)
        .then(res => {
          if (res.data.status === 'success') {
            localStorage.setItem('session', res.data.session)
          }
          _this.session = res.data.session
          _this.snackbarText = this.$i18n.t('statusCode.' + res.data.code)
          _this.snackbar = true
          this.$emit('getValue', {session: _this.session})
        })
    },
    logout () {
      let _this = this
      _this.session = null
      localStorage.removeItem('session')
      this.$emit('getValue', {clearSession: true})
    }
  }
}
</script>

<style scoped>

</style>
