<template>
  <v-main fluid style="padding: 70px 12px 12px 12px">
    <v-card flat v-if="member.userId">
      <div>
        <div v-if="r18 === true || illust.tags.tags !== null && (r18 === false && JSON.stringify(illust.tags.tags).search(/R-18(|G)/) < 0)">
          <v-carousel v-if="illustPage.length > 1"
                      class="grey lighten-2"
                      v-model="pageId">
            <v-carousel-item
              v-for="(page, t) in illustPage"
              :key="t"
              :src="'https://lxns.org/proxy.php?type=pixiv&link=' + page.image_urls.original"
              :lazy-src="'https://lxns.org/proxy.php?type=pixiv&link=' + page.image_urls.large"
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
                 :src="'https://lxns.org/proxy.php?type=pixiv&link=' + illust.urls.original"
                 :lazy-src="'https://lxns.org/proxy.php?type=pixiv&link=' + (illust.urls.regular ? illust.urls.original : illust.urls.regular)"
                 aspect-ratio="1"
                 class="grey lighten-2"
                 max-height="500"
                 style="cursor: zoom-in; "
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
        </div>
        <div v-else class="text-center">
          <v-icon style="font-size: 128px; margin-top: 12px;">mdi-image-off</v-icon>
          <p class="headline" style="margin-bottom: 8px;">{{ this.$i18n.t('r18Content') }}</p>
          <p class="subtitle-1">{{ this.$i18n.t('r18ContentDetail') }}</p>
        </div>
      </div>
      <div>
        <v-overlay :value="overlay" v-if="illustPage.length > 1">
          <img
            :alt="illust.illustTitle + '_' + pageId"
            :src="'https://lxns.org/proxy.php?type=pixiv&link=' + illustPage[pageId].image_urls.original"
            :style="'cursor: zoom-out; max-height: ' + maxHeight + 'px; max-width: ' + maxWidth + 'px; display: block;'"
            @click="overlay = false"
          />
        </v-overlay>
        <v-overlay :value="overlay" v-else>
          <img
            :alt="illust.illustTitle"
            :src="'https://lxns.org/proxy.php?type=pixiv&link=' + illust.urls.original"
            :lazy-src="'https://lxns.org/proxy.php?type=pixiv&link=' + illust.urls.regular"
            :style="'cursor: zoom-out; max-height: ' + maxHeight + 'px; max-width: ' + maxWidth + 'px; display: block;'"
            @click="overlay = false"
          />
        </v-overlay>
      </div>
      <v-list two-line subheader>
        <div class="text-center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="mx-2" tile icon
                     @click="copyToClipboard('https://pixiv.lxns.org/artworks/' + illust.illustId)">
                <v-icon>mdi-link</v-icon>
              </v-btn>
            </template>
            <span>{{ this.$i18n.t('copyLink') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="r18 === true || illust.tags.tags !== null && (r18 === false && JSON.stringify(illust.tags.tags).search(/R-18(|G)/) < 0)">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="mx-2" tile icon v-if="illustPage.length > 1"
                     @click="toUrl('https://lxns.org/proxy.php?type=pixiv&dl=true&link=' + illustPage[pageId].urls.original)">
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-btn v-on="on" class="mx-2" tile icon v-else
                     @click="toUrl('https://lxns.org/proxy.php?type=pixiv&dl=true&link=' + illust.urls.original)">
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </template>
            <span>{{ this.$i18n.t('save') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="session !== null">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="mx-2" tile icon
                     @click="bookmark(isBookmarked ? 0 : 1)">
                <v-icon :color="isBookmarked ? 'red' : ''">mdi-heart{{isBookmarked ? '' : '-outline'}}</v-icon>
              </v-btn>
            </template>
            <span v-if="isBookmarked === false">{{ this.$i18n.t('favourite') }}</span>
            <span v-else>{{ this.$i18n.t('unfavourite') }}</span>
          </v-tooltip>
        </div>
        <v-divider />
        <v-card-title>{{illust.illustTitle}}</v-card-title>
        <v-card-subtitle v-html="illust.illustComment">{{illust.illustComment}}</v-card-subtitle>
        <div style="margin-left: 8px;">
          <v-chip
            class="ma-2"
            label v-for="(tags, j) in illust.tags.tags"
            :key="j"
          >
            {{tags.tag}}
          </v-chip>
        </div>
        <div style="margin-left: 8px;">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip v-on="on"
                      class="ma-2"
              >
                <v-avatar left>
                  <v-icon>mdi-thumb-up</v-icon>
                </v-avatar>
                {{illust.likeCount}}
              </v-chip>
            </template>
            <span>{{ this.$i18n.t('like') }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip v-on="on"
                      class="ma-2"
              >
                <v-avatar left>
                  <v-icon>mdi-eye</v-icon>
                </v-avatar>
                {{illust.viewCount}}
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
                {{illust.bookmarkCount}}
              </v-chip>
            </template>
            <span>{{ this.$i18n.t('favourite') }}</span>
          </v-tooltip>
        </div>
        <v-card-subtitle>{{illust.createDate}}</v-card-subtitle>
        <v-divider />
        <v-list-item v-if="session !== null"><!-- 登录 -->
          <v-list-item-avatar size="48" @click="toPath('/users/' + illust.userId)">
            <v-img class="grey lighten-2"
                   :src="'https://lxns.org/proxy.php?type=pixiv&link=' + member.image" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="illust.userName" />
            <v-list-item-subtitle v-html="'@' + illust.userAccount" />
          </v-list-item-content>
          <v-btn text large v-if="isFollowed === false" @click="follow(1)">{{ this.$i18n.t('follow') }}</v-btn>
          <v-btn text large v-else @click="follow(0)">{{ this.$i18n.t('unFollow') }}</v-btn>
        </v-list-item>
        <v-list-item @click="toPath('/users/' + illust.userId)" v-else><!-- 未登录 -->
          <v-list-item-avatar size="48">
            <v-img class="grey lighten-2"
                   :src="'https://lxns.org/proxy.php?type=pixiv&link=' + member.image" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="illust.userName" />
            <v-list-item-subtitle v-html="'@' + illust.userAccount" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card flat v-if="member.userId" style="margin-top: 12px;">
      <v-card-title>{{ this.$i18n.t('recentArtworks') }}</v-card-title>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon style="right: 12px; top: 12px; position: absolute;" @click="toPath('/users/' + illust.userId)">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </template>
        <span>{{ this.$i18n.t('viewArtworks') }}</span>
      </v-tooltip>
      <v-slide-group
        class="pa-4"
        center-active
        show-arrows
        style="padding: 0 !important;"
      >
        <v-slide-item
          v-for="(list, n) in illustList"
          v-if="list"
          :key="n"
        >
          <v-card class="ma-4" height="150" width="100"
                  v-if="r18 === true || list.tags !== null && (r18 === false && JSON.stringify(list.tags).search(/R-18(|G)/) < 0)"
                  :style="'background:url(https://lxns.org/proxy.php?type=pixiv&link=' + list.url + '); background-size: cover; background-position: center center;'"
                  @click="illustListToggle(list.id)"
          />
          <v-card class="ma-4" height="150" width="100" color="grey"
                  v-else
                  @click="illustListToggle(list.id)">
            <v-row
              class="fill-height"
              align="center"
              justify="center"
            >
              <v-icon
                color="white"
                size="48"
                v-text="'mdi-image-off'" />
            </v-row>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-card>
    <div class="text-center" style="margin-top: 12px;" v-if="!loaded">
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          {{ $i18n.t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script>
import Axios from 'axios'
import {getWindowHeight, getWindowWidth} from '../screen'

export default {
  name: 'Illusts',
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
    illust: [null],
    illustPage: [null],
    illustList: [null],
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
    artworkId: vm.$route.params.id,
    share: false,
    shareId: 0,
    r18: false,
    snackbar: false,
    snackbarText: null,
    session: localStorage.getItem('session'),
    isBookmarked: false,
    isFollowed: false
  }),
  mounted () {
    const _this = this
    if (localStorage.getItem('r18') !== null) {
      _this.r18 = localStorage.getItem('r18') === 'true'
    } else {
      localStorage.setItem('r18', 'false')
    }
    Axios
      .post('https://pixiv-api.lxns.org/illustDetail.php', 'illust_id=' + _this.artworkId, undefined)
      .then(res => {
        _this.illust = res.data.body
        Axios
          .post('https://pixiv-api.lxns.org/userDetail.php', 'user_id=' + _this.illust.userId, undefined)
          .then(res => {
            _this.member = res.data.body
            if (_this.illust.pageCount > 1 && _this.session === null) {
              _this.snackbarText = this.$i18n.t('errorContent.multiPageRequireLogin')
              _this.snackbar = true
            }
            _this.loaded = true
          })
        for (let i in _this.illust.userIllusts) {
          if (_this.illust.userIllusts[i] !== null) {
            _this.illustList.push(_this.illust.userIllusts[i])
          }
        }
        _this.illustList.reverse()
      })
    _this.handleResize()
  },
  created () {
    const _this = this
    window.addEventListener('resize', this.handleResize)
    _this.loading = false
    _this.loaded = false
    // localStorage 貌似在 created () 才会初始化
    if (_this.session !== null) { // 是否收藏
      Axios
        .post('https://pixiv-api.lxns.org/illustDetail.php', 'session=' + localStorage.getItem('session') + '&illust_id=' + _this.artworkId, undefined)
        .then(res => {
          _this.illustPage = res.data.illust.meta_pages
          _this.isBookmarked = res.data.illust.is_bookmarked === true
          _this.isFollowed = res.data.illust.user.is_followed === true
        })
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('popstate', this.illustListToggle, false)
  },
  methods: {
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
      let _this = this
      _this.snackbarText = this.$i18n.t('copiedLink')
      _this.snackbar = true
    },
    illustListToggle (illustId) {
      let _this = this
      _this.toPath('/artworks/' + illustId)
      _this.illustPage = [null]
      if (localStorage.getItem('session') !== null) { // 是否收藏
        _this.artworkId = illustId
        Axios
          .post('https://pixiv-api.lxns.org/illustDetail.php', 'session=' + localStorage.getItem('session') + '&illust_id=' + illustId, undefined)
          .then(res => {
            _this.isBookmarked = res.data.illust.is_bookmarked === true
            _this.isFollowed = res.data.illust.user.is_followed === true
          })
      }
      Axios
        .post('https://pixiv-api.lxns.org/illustDetail.php', 'illust_id=' + illustId, undefined)
        .then(res => {
          _this.illust = res.data.body
          if (_this.illust.pageCount > 1) {
            _this.isMultiPage = true
          }
          _this.loaded = true
          _this.illustList = [null]
          for (let i in _this.illust.userIllusts) {
            if (_this.illust.userIllusts[i] !== null) {
              _this.illustList.push(_this.illust.userIllusts[i])
            }
          }
          _this.illustList.reverse()
        })
      _this.handleResize()
    },
    bookmark (type = 1) {
      let _this = this
      let reqUrl
      if (type === 0) { // 删除收藏
        reqUrl = 'https://pixiv-api.lxns.org/illustBookmarkDelete.php'
      } else {
        reqUrl = 'https://pixiv-api.lxns.org/illustBookmarkAdd.php'
      }
      Axios
        .post(reqUrl, 'session=' + localStorage.getItem('session') + '&illust_id=' + _this.artworkId)
        .then(res => {
          if (JSON.stringify(res.data) === '{}') {
            _this.isBookmarked = true
          }
        })
    },
    follow (type = 1) {
      let _this = this
      let reqUrl
      if (type === 0) { // 取消关注
        reqUrl = 'https://pixiv-api.lxns.org/private/meFavouriteUsersUnfollow.php'
      } else {
        reqUrl = 'https://pixiv-api.lxns.org/private/meFavouriteUsersFollow.php'
      }
      Axios
        .post(reqUrl, 'session=' + localStorage.getItem('session') + '&user_id=' + _this.illust.userId)
        .then(res => {
          if (res.data.status === 'success') {
            _this.isFollowed = true
          }
        })
    }
  },
  watch: {
    '$route' (to, from) {
      this.illustListToggle(this.$route.params.id)
    }
  }
}
</script>
<style scoped>

</style>
