(function() {
  "use strict";
  return {
    init: function() {
      this.frame = Object();
      this.refererFrame = Object();
      this.appContainer = $("#app");
      this.appList = $("#app-list");
      this.initFrames();
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
      var __this = this;
      if (__this.refererFrame) {
        $(".back-frame").on("click", function(_e) {
          var goFrame = __this.refererFrame;
          this.refererFrame = __this.frame;
          __this.frame = goFrame;
          __this.appList.css("left", goFrame.offset().left);
        });
      }
    },
    goFrame: function() {
      var __this = this;
      $(".go-frame").on("click", function(_e) {
        var $frame = $($(this).data("frame"));
        if ($frame) {
          __this.refererFrame = __this.frame;
          __this.frame = $frame;
          __this.appList.css("left", -$frame.offset().left);
        }
        return false;
      });
    }
  };
})().init();
