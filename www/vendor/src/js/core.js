(function() {
  "use strict";
  return {
    init: function() {
      this.frame = $("#main");
      this.refererFrame = Array();
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
        $(".back-frame").on("touchstart", function(_e) {
          var goFrame = __this.refererFrame.pop();
          __this.frame = goFrame;
          __this.appList.css("left", -parseInt(goFrame.css("left")));
        });
      }
    },
    goFrame: function() {
      var __this = this;
      $(".go-frame").on("touchstart", function(_e) {
        var $frame = $($(this).data("frame"));
        if ($frame) {
          __this.refererFrame.push(__this.frame);
          __this.frame = $frame;
          __this.appList.css("left", -parseInt($frame.css("left")));
        }
        return false;
      });
    }
  };
})().init();
