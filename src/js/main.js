window.essen = window.essen || {};

essen.init = function () {
  essen.cacheSelectors();
  essen.detectScroll();
  essen.foundation();

  essen.cache.$navItems.on('click', essen.smoothScroll);

  $(window).on('scroll', essen.detectScroll);
  $(window).on('resize', essen.debounce(essen.onResize, 200));
};

essen.foundation = function () {
  $(document).foundation({
    "magellan-expedition": {
      active_class: 'active', // specify the class used for active sections
      threshold: essen.cache.siteHeaderHeight,
      destination_threshold: 200, // pixels from the top of destination for it to be considered active
      fixed_top: 123, // top distance in pixels assigned to the fixed element on scroll
    }
  });
};

essen.cacheSelectors = function () {
  essen.cache = {
    // $main             : $('body'),
    $reservations     : $('.reservations'),
    $menu             : $('.nav-wrapper'),
    $subNav           : $('.sub-nav__wrapper'),
    $siteHeader       : $('header'),
    $siteNavDinner    : $('.nav-item__dinner'),
    $siteNavBrunch    : $('.nav-item__brunch'),
    $subNavDinner     : $('.sub-nav__dinner'),
    $subNavBrunch     : $('.sub-nav__brunch'),
    brunchOffsetTop   : $('#Brunch').offset().top,
    siteHeaderHeight  : $('header').outerHeight(),
    menuHeight        : $('.nav-wrapper').height(),
    reservationHeight : $('.reservations').height(),
    isSticky          : false,
    isUnsticky        : false,
    isDinnerActive    : false,
    isBrunchActive    : false,

    //scroll position
    scrollPosition    : 0,
    $navItems         : $('nav a')
  };
};

essen.onResize = function () {
  essen.cache.siteHeaderHeight = essen.cache.$siteHeader.outerHeight();
  essen.cache.menuHeight =  $('.nav-wrapper').height();
  essen.cache.reservationHeight = $('.reservations').height();

  $(document).foundation({
    "magellan-expedition": {
      threshold: essen.cache.siteHeaderHeight
    }
  });
};

essen.onNavClick = function () {
};

essen.detectScroll = function () {
  var currentScrollTop = $(window).scrollTop();

  //if we're still near the top of the page
  if (currentScrollTop <= 0) {
    if (essen.cache.isSticky) {
      essen.removeStickyNav();
    }

    if (essen.cache.isUnsticky) {
      essen.removeUnstickyNav();
    }

    essen.cache.scrollPosition = currentScrollTop;
    return;
  }

  //scroll Down && we're below the header
  if (currentScrollTop > essen.cache.scrollPosition && currentScrollTop > essen.cache.siteHeaderHeight + 50) {
    if (essen.cache.isSticky){
     essen.removeStickyNav();
    }

    if (!essen.cache.isUnsticky) {
      essen.addUnstickyNav();
    }

    if (currentScrollTop > essen.cache.brunchOffsetTop) {
      essen.markBrunchActive();
    } else {
      essen.markDinnerActive();
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

    if (currentScrollTop < essen.cache.siteHeaderHeight - essen.cache.menuHeight) {
      if (essen.cache.isUnsticky) {
        essen.removeUnstickyNav();
      }
      essen.cache.$menu.removeClass('sticky');
      essen.cache.$menu.removeAttr('style');
      // essen.cache.$reservations.css('height', essen.cache.reservationHeight);
    }

    if(essen.cache.isUnsticky){
      essen.removeUnstickyNav();
    }

    if (!essen.cache.isSticky) {
      essen.addStickyNav();
    }

    if (currentScrollTop > essen.cache.brunchOffsetTop  && !essen.cache.isBrunchActive) {
      essen.markBrunchActive();
      essen.cache.isBrunchActive = true;
      essen.cache.isDinnerActive = false;
    }

    if (currentScrollTop < essen.cache.brunchOffsetTop && !essen.cache.isDinnerActive) {
      essen.markDinnerActive();
      essen.cache.isBrunchActive = false;
      essen.cache.isDinnerActive = true;
    }

    essen.cache.scrollPosition = currentScrollTop;
    return;
  }


};

essen.markDinnerActive = function () {
  essen.cache.$siteNavDinner.addClass('active');
  essen.cache.$subNavDinner.addClass('active');
  essen.cache.$siteNavBrunch.removeClass('active');
  essen.cache.$subNavBrunch.removeClass('active');
};

essen.markBrunchActive = function () {
  essen.cache.$siteNavBrunch.addClass('active');
  essen.cache.$subNavBrunch.addClass('active');
  essen.cache.$siteNavDinner.removeClass('active');
  essen.cache.$subNavDinner.removeClass('active');
};

essen.addStickyNav = function () {
  essen.cache.$reservations.addClass('sticky');
  essen.cache.$menu.css('height', essen.cache.menuHeight + essen.cache.reservationHeight);
  // essen.cache.$reservations.css('height', essen.cache.menuHeight + essen.cache.reservationHeight);
  essen.cache.$menu.addClass('sticky');
  essen.cache.isSticky = true;
};

essen.removeStickyNav = function () {
  essen.cache.$menu.removeAttr('style');
  essen.cache.$reservations.removeAttr('style');
  essen.cache.$reservations.removeClass('sticky');
  essen.cache.$menu.removeClass('sticky');
  // essen.cache.$main.removeAttr('style');
  essen.cache.isSticky = false;
};

essen.addUnstickyNav = function () {
  essen.cache.$reservations.addClass('unsticky');
  essen.cache.$menu.addClass('unsticky');
  essen.cache.$subNav.removeAttr('style');

  essen.cache.isUnsticky = true;
};

essen.removeUnstickyNav = function () {
  essen.cache.$reservations.removeClass('unsticky');
  essen.cache.$menu.removeClass('unsticky');
  // essen.cache.$main.removeAttr('style');
  essen.cache.isUnsticky = false;
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

essen.smoothScroll = function() {
  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top
      }, 1000);

      if (essen.cache.isSticky) {
        window.setTimeout(function () {
          essen.removeStickyNav();
          essen.addUnstickyNav();
        }, 1100);
      }
      return false;
    }
  }
};

$(essen.init);
