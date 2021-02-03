<template>
  <v-main fluid style="padding: 70px 12px 12px 12px">
    <v-card style="margin-bottom: 12px;">
      <v-text-field
        :placeholder="this.$i18n.t('search')"
        solo
        flat
        style="height: 48px"
        v-model="searchContent"
      />
      <v-toolbar flat height="0px">
        <v-spacer />
        <v-btn absolute icon text style="float: right; right: 48px; top: -48px;"
               @click="searchTerm" :disabled="!searchContent">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn absolute icon text style="float: right; right: 12px; top: -48px;"
               @click="filterExpand" :color="filter ? 'pink' : ''">
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </v-toolbar>
      <v-expansion-panels flat hover v-model="filterPanel" multiple>
        <v-expansion-panel :key="1">
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <p>{{ this.$i18n.t('dateSort') }}</p>
                <v-radio-group v-model="dateSort" :mandatory="false">
                  <v-radio :label="this.$i18n.t('dateSortDesc')" value="date_desc" />
                  <v-radio :label="this.$i18n.t('dateSortAsc')" value="date_asc" />
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <p>{{ this.$i18n.t('searchType') }}</p>
                <v-radio-group v-model="searchType" :mandatory="false">
                  <v-radio :label="this.$i18n.t('partialMatchForTags')" value="partial_match_for_tags" />
                  <v-radio :label="this.$i18n.t('exactMatchForTags')" value="exact_match_for_tags" />
                  <v-radio :label="this.$i18n.t('titleAndCaption')" value="title_and_caption" />
                </v-radio-group>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <div v-if="!searchContent">
      <v-select :items="[this.$i18n.t('dailyRank'),
                        this.$i18n.t('weeklyRank'),
                        this.$i18n.t('monthlyRank'),
                        this.$i18n.t('weekRookie'),
                        this.$i18n.t('dayMale'),
                        this.$i18n.t('dayFemale')]"
                :label="this.$i18n.t('rankType')"
                solo style="height: 48px; margin-bottom: 12px"
      />

      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn
            icon style="float: right; position: relative; right: 0;"
            v-on="on"
          >
            <v-icon>mdi-calendar</v-icon>
          </v-btn>
        </template>
        <v-date-picker @change="getRankFromDate" v-model="date" :max="new Date().toISOString().substr(0, 10)" :picker-date.sync="pickerDate" />
      </v-menu>
    </div>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" v-if="dialogId !== null && list[dialogId] !== null">
      <v-card
        style="overflow-x: hidden;">
        <v-toolbar dark color="primary"
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
                  {{ list[dialogId].total_view }}
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
                  {{ list[dialogId].total_bookmarks }}
                </v-chip>
              </template>
              <span>{{ this.$i18n.t('favourite') }}</span>
            </v-tooltip>
          </div>
          <v-card-subtitle>{{list[dialogId].create_date}}</v-card-subtitle>
          <v-divider />
          <v-list-item @click="toPath('/users/' + list[dialogId].user.id)">
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
    <v-row dense style="margin-top: 56px;">
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
    <v-alert border="right"
             colored-border
             type="error"
             elevation="2"
             v-if="errorContent !== null">{{errorContent}}</v-alert>
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
  name: 'Main',
  props: {
    source: String,
    attrs: {
      type: Object,
      default: () => ({})
    }
  },
  data: vm => ({
    drawer: null,
    page: 1,
    loading: true,
    loaded: false,
    list: [null],
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
    pickerDate: null,
    searchContent: null,
    dateSort: 'date_desc',
    searchType: 'partial_match_for_tags',
    searchUrl: null,
    errorContent: null,
    filter: false,
    filterPanel: [],
    cardCol: 1,
    share: false,
    shareId: 0,
    session: localStorage.getItem('session'),
    r18: false
  }),
  mounted () {
    const _this = this
    Axios
      .post('https://pixiv-api.lxns.org/illustRanking.php', 'page=1&session=' + _this.session + '&date=' + _this.date + '&mode=day')
      .then(res => {
        _this.list = res.data.illusts
        if (_this.list) {
          if (_this.list.length === 0) {
            _this.errorContent = this.$i18n.t('errorContent.failedGetRankOfDay')
            _this.loaded = true
          }
        } else if (res.data.code === -1) {
          _this.errorContent = this.$i18n.t('errorContent.needLogin')
          _this.loaded = true
        }
      })
    this.$emit('getValue', {headerSrc: null})
    _this.handleResize()
  },
  created () {
    const _this = this
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
    _this.page = 1
    _this.loaded = false
    _this.loading = false
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('scroll', this.handleResize)
  },
  activated () {
    const _this = this
    if (localStorage.getItem('r18') !== null) {
      _this.r18 = localStorage.getItem('r18') === 'true'
    } else {
      localStorage.setItem('r18', 'false')
    }
    this.$emit('getValue', {headerSrc: null})
  },
  methods: {
    handleScroll (event) {
      if (this.$route.path !== '/') {
        return
      }
      const _this = this
      if (getScrollTop() + getWindowHeight() >= getScrollHeight() - 64 && _this.loading === false && _this.loaded === false) {
        _this.loading = true
        _this.page += 1
        let reqUrl
        let postContent
        if (_this.searchContent !== null) {
          reqUrl = 'https://pixiv-api.lxns.org/searchIllust.php'
          postContent = 'word=' + _this.searchContent + '&session=' + _this.session + '&sort=' + _this.dateSort + '&search_target=' + _this.searchType + '&page=' + _this.page
        } else {
          reqUrl = 'https://pixiv-api.lxns.org/illustRanking.php'
          postContent = 'page=' + _this.page + '&session=' + _this.session + '&date=' + _this.date + '&mode=day'
        }
        Axios
          .post(reqUrl, postContent)
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
    clearContent () {
      const _this = this
      _this.errorContent = null
      _this.loaded = false
      _this.list = []
    },
    getRankFromDate () {
      const _this = this
      _this.clearContent()
      Axios
        .post('https://pixiv-api.lxns.org/illustRanking.php', 'page=' + _this.page + '&session=' + _this.session + '&date=' + _this.date + '&mode=day')
        .then(res => {
          _this.list = res.data.illusts
          if (_this.list.length === 0 || _this.list.illusts === []) {
            _this.errorContent = this.$i18n.t('errorContent.failedGetRankOfDay')
            _this.loaded = true
          }
        })
    },
    searchTerm () {
      const _this = this
      _this.clearContent()
      Axios
        .post('https://pixiv-api.lxns.org/searchIllust.php', 'word=' + _this.searchContent + '&session=' + _this.session + '&sort=' + _this.dateSort + '&search_target=' + _this.searchType + '&page=1')
        .then(res => {
          _this.list = res.data.illusts
        })
    },
    filterExpand () {
      const _this = this
      _this.filter = !_this.filter
      if (_this.filter === false) {
        _this.filterPanel = []
      } else {
        _this.filterPanel = [...Array(1).keys()].map((k, i) => i)
      }
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
