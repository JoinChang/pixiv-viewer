<template>
  <v-main fluid style="padding: 70px 12px 12px 12px">
    <v-card flat v-if="member.body">
      <v-list-item two-line>
        <v-list-item-avatar size="96" class="grey lighten-2">
          <v-img :src="'https://lxns.org/proxy.php?type=pixiv&link=' + member.body.imageBig" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{member.body.name}}</v-list-item-title>
          <v-list-item-subtitle class="subtitle-1">{{member.body.userId}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-chip v-if="member.body.social"
              class="ma-2"
              color="cyan"
              label
              @click="toUrl(member.body.social.twitter.url)"
              text-color="white"
              style="margin-left: 16px !important;"
      >
        <v-icon left>mdi-twitter</v-icon>
        {{member.body.social.twitter.url.replace("https://twitter.com/", "")}}
      </v-chip>
      <v-card-text style="white-space: pre-wrap;" v-if="member.body.comment">{{member.body.comment}}</v-card-text>
    </v-card>
    <div v-if="member.user">
      <v-divider style="margin: 12px 0 20px 0;" />
      <p class="headline">{{ this.$i18n.t('memberIllustListTitle') }}</p>
    </div>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" v-if="dialogId !== null && list[dialogId] !== null">
      <v-card
        style="overflow-x: hidden;">
        <v-toolbar dark
                   color="primary"
                   style="position: absolute; width: 100%; z-index: 1; background-color: rgba(0,0,0,0) !important; box-shadow: none;">
          <v-btn icon dark @click="dialog = false, pageId = 0">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ this.$i18n.t('illustInfo') }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="share = true,
                                   shareId = list[dialogId].id">
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
          <v-btn icon dark @click="toPath('/artworks/' + list[dialogId].id)">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row>
          <v-carousel v-if="list[dialogId].meta_pages !== null && list[dialogId].meta_pages.length > 0"
                      class="grey lighten-2"
                      v-model="pageId">
            <v-carousel-item
              v-for="(page, t) in list[dialogId].meta_pages"
              :key="t"
              :src="'https://lxns.org/proxy.php?type=pixiv&link=' + page.image_urls.original"
              :lazy-src="'https://lxns.org/proxy.php?type=pixiv&link=' + (page.image_urls.medium ? page.image_urls.large : page.image_urls.medium)"
              reverse-transition="fade-transition"
              transition="fade-transition"
              gradient="to top, rgba(0,0,0,0), rgba(0,0,0,.1)"
              @click="overlay = true"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate color="grey lighten-5" />
                </v-row>
              </template>
            </v-carousel-item>
          </v-carousel>
          <v-img v-else
                 :src="'https://lxns.org/proxy.php?type=pixiv&link=' + list[dialogId].meta_single_page.original_image_url"
                 :lazy-src="'https://lxns.org/proxy.php?type=pixiv&link=' + (list[dialogId].image_urls.medium ? list[dialogId].image_urls.large : list[dialogId].image_urls.medium)"
                 aspect-ratio="1"
                 class="grey lighten-2"
                 max-height="500"
                 style="cursor: zoom-in; width: calc(100% - 12px);"
                 gradient="to top, rgba(0,0,0,0), rgba(0,0,0,.1)"
                 @click="overlay = !overlay"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>
        </v-row>
        <div>
          <v-overlay :value="overlay" v-if="list[dialogId].meta_pages !== null && list[dialogId].meta_pages.length > 0">
            <img
              :alt="list[dialogId].title + '_' + pageId"
              :src="'https://lxns.org/proxy.php?type=pixiv&link=' + list[dialogId].meta_pages[pageId].image_urls.original"
              :style="'cursor: zoom-out; max-height: ' + maxHeight + 'px; max-width: ' + maxWidth + 'px; display: block;'"
              @click="overlay = false"
            />
          </v-overlay>
          <v-overlay :value="overlay" v-else>
            <img
              :alt="list[dialogId].title"
              :src="'https://lxns.org/proxy.php?type=pixiv&link=' + list[dialogId].meta_single_page.original_image_url"
              :lazy-src="'https://lxns.org/proxy.php?type=pixiv&link=' + list[dialogId].image_urls.medium"
              :style="'cursor: zoom-out; max-height: ' + maxHeight + 'px; max-width: ' + maxWidth + 'px; display: block;'"
              @click="overlay = false"
            />
          </v-overlay>
        </div>
        <v-list two-line subheader>
          <v-card-title>{{list[dialogId].title}}</v-card-title>
          <v-card-subtitle v-html="list[dialogId].caption">{{list[dialogId].caption}}</v-card-subtitle>
          <div style="margin-left: 8px;">
            <v-chip
              class="ma-2"
              label v-for="(tags, j) in list[dialogId].tags"
              :key="j"
            >
              {{tags.name}}
            </v-chip>
          </div>
          <div style="margin-left: 8px;">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip v-on="on"
                        class="ma-2"
                >
                  <v-avatar left>
                    <v-icon>mdi-eye</v-icon>
                  </v-avatar>
                  {{list[dialogId].total_view}}
                </v-chip>
              </template>
              <span>{{ this.$i18n.t('view') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip v-on="on"
                        class="ma-2"
                >
                  <v-avatar left>
                    <v-icon>mdi-heart</v-icon>
                  </v-avatar>
                  {{list[dialogId].total_bookmarks}}
                </v-chip>
              </template>
              <span>{{ this.$i18n.t('favourite') }}</span>
            </v-tooltip>
          </div>
          <v-card-subtitle>{{list[dialogId].create_date}}</v-card-subtitle>
          <v-divider />
          <v-list-item>
            <v-list-item-avatar size="48">
              <v-img class="grey lighten-2"
                     :src="'https://lxns.org/proxy.php?type=pixiv&link=' + list[dialogId].user.profile_image_urls.medium" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-html="list[dialogId].user.name" />
              <v-list-item-subtitle v-html="'@' + list[dialogId].user.account" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
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
                             toUrl('https://lxns.org/proxy.php?type=pixiv&dl=true&link=' + list[dialogId].meta_single_page.original_image_url)">
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
            :src="'https://lxns.org/proxy.php?type=pixiv&link=' + item.image_urls.medium"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          >
            <v-card-title v-text="item.title" />
          </v-img>
          <v-card-actions>
            <v-chip v-if="(item.tags[j].name === 'R-18' || item.tags[j].name === 'R-18G')"
                    v-for="(tags, j) in item.tags"
                    :key="j"
                    class="ma-2"
                    style="margin: 0 !important;"
                    color="red"
                    text-color="white"
            >
              {{ item.tags[j].name }}
            </v-chip>
            <v-spacer />
            <v-btn icon
                   @click.stop="share = true,
                     shareId = item.id,
                     dialogId = i">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
            <v-btn icon
                   @click.stop="dialog = true,
                     dialogId = i">
              <v-icon>mdi-open-in-app</v-icon>
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
</template>

<script>
import Axios from 'axios'
import {getScrollHeight, getScrollTop, getWindowHeight, getWindowWidth} from '../screen'

export default {
  name: 'Member',
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
    list: [null],
    member: [null],
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
    r18: false
  }),
  mounted () {
    const _this = this
    if (localStorage.getItem('r18') !== null) {
      _this.r18 = localStorage.getItem('r18') === 'true'
    } else {
      localStorage.setItem('r18', 'false')
    }
    Axios
      .post('https://pixiv-api.lxns.org/userDetail.php', 'user_id=' + _this.memberId)
      .then(res => {
        _this.member = res.data
        this.$emit('getValue', {headerSrc: _this.member.body.imageBig})
      })
    Axios
      .post('https://pixiv-api.lxns.org/userIllusts.php', 'user_id=' + _this.memberId)
      .then(res => {
        _this.list = res.data.illusts
      })
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
  methods: {
    handleScroll (event) {
      if (this.$route.path.replace(/\d+/, '') !== '/member/' && this.$route.path.replace(/\d+/, '') !== '/users/') {
        return
      }
      const _this = this
      if (getScrollTop() + getWindowHeight() >= getScrollHeight() - 64 && _this.loading === false && _this.loaded === false) {
        _this.loading = true
        _this.page += 1
        let reqUrl = 'https://api.imjad.cn/pixiv/v2/?type=member_illust&id=' + _this.memberId + '&page=' + _this.page
        Axios
          .get(reqUrl)
          .then(res => {
            if (res.data.illusts.length !== 0) {
              for (var i = 0; i < res.data.illusts.length; i++) {
                _this.list.push(res.data.illusts[i])
              }
            } else {
              _this.loaded = true
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
      _this.pageId = 0
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
