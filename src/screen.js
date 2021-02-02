export function getScrollTop () {
  var scrollTop = 0
  var bodyScrollTop = 0
  var documentScrollTop = 0
  if (document.body) {
    bodyScrollTop = document.body.scrollTop
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
  return scrollTop
}

export function getScrollHeight () {
  var scrollHeight = 0
  var bodyScrollHeight = 0
  var documentScrollHeight = 0
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight
  }
  scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight
  return scrollHeight
}

export function getWindowHeight () {
  var windowHeight = 0
  if (document.compatMode === 'CSS1Compat') {
    windowHeight = document.documentElement.clientHeight
  } else {
    windowHeight = document.body.clientHeight
  }
  return windowHeight
}

export function getWindowWidth () {
  var windowWidth = 0
  if (document.compatMode === 'CSS1Compat') {
    windowWidth = document.documentElement.clientWidth
  } else {
    windowWidth = document.body.clientWidth
  }
  return windowWidth
}
