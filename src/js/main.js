window.essen = window.essen || {};

essen.init = function () {
  essen.cacheSelectors();
  essen.detectScroll();

  $(window).on('scroll', essen.detectScroll);
  $(window).on('load', essen.equalHeights);
  $(window).on('resize', essen.debounce(essen.onResize, 200));
};

essen.cacheSelectors = function () {
  essen.cache = {
    $reservations  : $('.reservations'),
    $menu          : $('.nav-wrapper'),
    $siteHeader    : $('header'),
    isSticky : false,
    isUnsticky : false,
    //scroll position
    scrollPosition : 0
  };
};

essen.onResize = function () {
  console.log('resize');
  essen.cache.siteHeaderHeight = essen.cache.$siteHeader.outerHeight();
};

essen.onNavClick = function () {

};

essen.detectScroll = function () {
  var currentScrollTop = $(window).scrollTop();

  //if we're still near the top of the page
  if (currentScrollTop <= 0) {
    if (essen.cache.isSticky) {
      essen.cache.$reservations.removeClass('sticky');
      essen.cache.$menu.removeClass('sticky');
      essen.cache.isSticky = false;
    }

    if (essen.cache.isUnsticky) {
      essen.cache.$reservations.removeClass('unsticky');
      essen.cache.$menu.removeClass('unsticky');
      essen.cache.isUnsticky = false;
    }

    essen.cache.scrollPosition = currentScrollTop;
    return;
  }

  //scroll Down && we're below the header
  if (currentScrollTop > essen.cache.scrollPosition && currentScrollTop > essen.cache.siteHeaderHeight + 50) {
    if (essen.cache.isSticky){
      essen.cache.$reservations.removeClass('sticky');
      essen.cache.$menu.removeClass('sticky');
      essen.cache.isSticky = false;
    }

    if (!essen.cache.isUnsticky) {
      essen.cache.$reservations.addClass('unsticky');
      essen.cache.$menu.addClass('unsticky');
      essen.cache.isUnsticky = true;
    }

    essen.cache.scrollPosition = currentScrollTop;

    return;
  }



  //scroll Up
  if (currentScrollTop < essen.cache.scrollPosition) {
    //check if we've scrolled past or are at the bottom of the document as is possible on OSX and iOS
    if (currentScrollTop + window.innerHeight >= document.body.scrollHeight ) {
      return;
    }

    if (currentScrollTop < essen.cache.siteHeaderHeight -170) {
      if (essen.cache.isUnsticky) {
        essen.cache.$menu.removeClass('unsticky');
        essen.cache.$reservations.removeClass('unsticky');
        essen.cache.isUnsticky = false;
      }
      essen.cache.$menu.removeClass('sticky');
    }

    if(essen.cache.isUnsticky){
      essen.cache.$reservations.removeClass('unsticky');
      essen.cache.$menu.removeClass('unsticky');

      essen.cache.isUnsticky = false;
    }

    if (!essen.cache.isSticky) {
      essen.cache.$reservations.addClass('sticky');
      essen.cache.$menu.addClass('sticky');
      essen.cache.isSticky = true;
    }


    essen.cache.scrollPosition = currentScrollTop;
    return;
  }
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
essen.debounce = function (func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

$(essen.init);
