<template>
  <div>
    <v-toolbar style="margin-top: 56px" flat>
      <v-toolbar-title>{{ this.$i18n.t('bookmarkNewIllustsTitle') }}</v-toolbar-title>
    </v-toolbar>
    <v-main fluid style="padding: 12px 12px 12px 12px">
      <v-bottom-sheet v-model="share" inset v-if="shareId !== 0">
        <v-list>
          <v-subheader>{{ this.$i18n.t('shareTo') }}</v-subheader>
          <v-list-item @click="share = false,
                             copyToClipboard('https://pixiv.lxns.org/artworks/' + shareId)">
            <v-list-item-avatar>
              <v-avatar size="32px" tile>
                <v-icon>mdi-link</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>{{ this.$i18n.t('copyLink') }}</v-list-item-title>
            <v-list-item-subtitle>https://pixiv.lxns.org/artworks/{{shareId}}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item @click="share = false,
                             toUrl('https://lxns.org/proxy.php?type=pixiv&dl=true&link=' + list[dialogId].image_urls.small.replace(/c\/150x150\/img-master/, 'img-original').replace(/_master1200/, ''))">
            <v-list-item-avatar>
              <v-avatar size="32px" tile>
                <v-icon>mdi-download</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>{{ this.$i18n.t('save') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-bottom-sheet>
      <v-row dense>
        <v-col class="flex-grow-0 flex-shrink-0"
               v-for="(item, i) in this.list"
               v-if="r18 === true || list[i] !== null && (r18 === false && JSON.stringify(list[i].tags).search(/R-18(|G)/) < 0)"
               :key="i"
               :cols="cardCol">
          <v-card v-if="item !== null">
            <v-img
              :src="'https://lxns.org/proxy.php?type=pixiv&link=' + item.image_urls.small.replace(/150x150/, '250x250_80_a2')"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="item.title" />
            </v-img>
            <v-card-actions>
              <v-chip v-if="(item.tags[j] === 'R-18' || item.tags[j] === 'R-18G')"
                      v-for="(tags, j) in item.tags"
                      :key="j"
                      class="ma-2"
                      style="margin: 0 !important;"
                      color="red"
                      text-color="white"
              >
                {{ item.tags[j] }}
              </v-chip>
              <v-spacer />
              <v-btn icon
                     @click.stop="share = true,
                     shareId = item.id,
                     dialogId = i">
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
              <v-btn icon
                     @click.stop="toPath('/artworks/' + item.id)">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <div class="text-center" style="margin-top: 12px;" v-if="!loaded">
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>
      <v-fab-transition>
        <v-btn
          v-if="hidden"
          color="pink"
          dark
          fab
          @click="$vuetify.goTo(0, {
          duration: 400,
          offset: 0,
          easing: 'easeInOutCubic',
        })"
          style="position: fixed; right: 24px; bottom: 24px;"
        >
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-main>
  </div>
</template>

<script>
import Axios from 'axios'
import {getScrollHeight, getScrollTop, getWindowHeight, getWindowWidth} from '../../screen'

export default {
  name: 'MeFollowingWorks',
  props: {
    source: String,
    attrs: {
      type: Object,
      default: () => ({})
    }
  },
  data: vm => ({
    page: 1,
    loading: true,
    loaded: false,
    list: [],
    member: [],
    hidden: true,
    dialog: false,
    dialogId: null,
    pageId: 0,
    overlay: false,
    maxHeight: getWindowHeight(),
    maxWidth: getWindowWidth(),
    date: new Date().toISOString().substr(0, 10),
    scrollTop: 0,
    scrollTopDefault: 0,
    errorContent: null,
    cardCol: 1,
    memberId: vm.$route.params.id,
    share: false,
    shareId: 0,
    r18: false,
    session: localStorage.getItem('session')
  }),
  mounted () {
    if (localStorage.getItem('darkMode') === 'true') {
      this.$vuetify.theme.dark = true
    }
    const _this = this
    if (localStorage.getItem('r18') !== null) {
      _this.r18 = localStorage.getItem('r18') === 'true'
    } else {
      localStorage.setItem('r18', 'false')
    }
    if (localStorage.getItem('session') !== null) {
      Axios
        .post('https://pixiv-api.lxns.org/private/meFollowingWorks.php', 'session=' + _this.session)
        .then(res => {
          if (res.data.status === 'success') {
            _this.page = res.data.pagination.next
            if (res.data.response.length !== 0) {
              for (let i = 0; i < res.data.response.length; i++) {
                _this.list.push(res.data.response[i])
              }
            }
          }
        })
    } else {
      _this.toPath('/')
    }
    _this.handleResize()
  },
  created () {
    const _this = this
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
    _this.loading = false
    _this.loaded = false
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  activated () {
    if (localStorage.getItem('darkMode') === 'true') {
      this.$vuetify.theme.dark = true
    }
    const _this = this
    if (localStorage.getItem('r18') !== null) {
      _this.r18 = localStorage.getItem('r18') === 'true'
    } else {
      localStorage.setItem('r18', 'false')
    }
  },
  methods: {
    handleScroll (event) {
      if (this.$route.path !== '/user/bookmark_new_illusts') {
        return
      }
      const _this = this
      if (getScrollTop() + getWindowHeight() >= getScrollHeight() - 64 && _this.loading === false && _this.loaded === false) {
        _this.loading = true
        Axios
          .post('https://pixiv-api.lxns.org/private/meFollowingWorks.php', 'page=' + _this.page + '&session=' + localStorage.getItem('session'), undefined)
          .then(res => {
            if (res.data.status === 'success') {
              _this.page = res.data.pagination.next
              if (res.data.response.length !== 0) {
                for (let i = 0; i < res.data.response.length; i++) {
                  _this.list.push(res.data.response[i])
                }
              } else {
                _this.loaded = true
              }
            }
          })
        _this.loading = false
      }
      _this.hidden = getScrollTop() !== 0
    },
    handleResize (event) {
      const _this = this
      if (getWindowWidth() >= 1100) {
        _this.cardCol = 2
      } else if (getWindowWidth() >= 700) {
        _this.cardCol = 3
      } else if (getWindowWidth() >= 600) {
        _this.cardCol = 4
      } else if (getWindowWidth() >= 400) {
        _this.cardCol = 6
      } else {
        _this.cardCol = 12
      }
      _this.maxHeight = getWindowHeight()
      _this.maxWidth = getWindowWidth()
    },
    toPath (path) {
      const _this = this
      _this.dialog = false
      if (this.$route.path !== path) {
        this.$router.push({ path: path })
      }
    },
    toUrl (url) {
      window.open(url, '_blank')
    },
    copyToClipboard (str) {
      const el = document.createElement('textarea')
      el.addEventListener('focusin', e => e.stopPropagation())
      el.value = str
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }
}
</script>
<style scoped>

</style>
