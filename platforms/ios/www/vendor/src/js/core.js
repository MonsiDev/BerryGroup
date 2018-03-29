var Core = (function() {
  "use strict";
  return {
    init: function() {
      this.frame = $("#main");
      this.refererFrame = Array();
      this.appContainer = $("#app");
      this.appList = $("#app-list");
      this.restIframe = "";
      this.initFrames();
      $("#delivery-send").on("click", function(_e) {
        Basket.sendDelivery();
      });
    },
    initFrames: function() {
      this.frame = $("#main");

      var app_items = $(".app__item");
      var i;

      $(".app__item").css("width", $(window).width());
      $(".app__list").css("width", $(window).width() * app_items.length);
      for (i = 0; i < app_items.length; i++) {
        $(app_items[i]).css("left", $(window).width() * i);
      }
      this.goFrame();
      this.backFrame();
    },
    backFrame: function() {
      var Core = this;
      if (Core.refererFrame) {
        $(".back-frame").on("click", function(_e) {
          var goFrame = Core.refererFrame.pop();
          Core.frame = goFrame;
          Core.appList.css("left", -parseInt(goFrame.css("left")));
        });
      }
    },
    goFrame: function() {
      $(".go-frame").on("click", Core.onEventGo);
    },
    onEventGo: function(_e) {
      if (
        $(this)
          .parent()
          .hasClass("main-nav")
      ) {
        $(this)
          .parent()
          .removeClass("active");
        $("body").removeClass("on-shadow");
      }
      var $frame = $($(this).data("frame"));
      if ($frame) {
        Core.refererFrame.push(Core.frame);
        Core.frame = $frame;
        if ($(this).hasClass("go-basket")) {
          Basket.goBasket();
        }
        if ($(this).data("iframe")) {
          Core.restUrl = $(this).data("url");
          Core.restIframe = document.getElementById($(this).data("iframe"));
          $('#rest-header-bg').css('background-image', "url(" + $($(this).find('.main-card__bg')[0]).attr('src') + ")");
          $('#rest-header-logo').attr('src', $( $(this).find('.main-card__logo img')[0] ).attr('src') );
          $('#rest-header-title').html($( $(this).find('.main-card__header')[0] ).html());
          cNet.restCategory();
        }
        if (
          $(this).data("rest-category") &&
          $(this).data("rest-category") != Core.restCategory
        ) {
          Core.restCategory = $(this).data("rest-category");
          $('#foods-header-title').text($(this).text());
          cNet.restFoods();
        }
        Core.appList.css("left", -parseInt(Core.frame.css("left")));
      }
      return false;
    }
  };
})();

Core.init();
