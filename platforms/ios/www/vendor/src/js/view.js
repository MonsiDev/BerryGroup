(function() {
  "use strict";
  return {
    screen_launch: function() {
      animate(2000, function() {
        if ($("#launch_screen")) {
          $("#launch_screen").addClass("launch-screen--transparent");
          animate(3000, function() {
            $("#launch_screen").css("visibility", "hidden");
          });
        }
      });
    },
    activity_init: function($_, unactivity, onShadow = false) {
      var $activity = $($($_).data("activity"));
      if ($activity) {
        $($_).on("click", function(_e) {
          $activity.addClass("active");
          if (onShadow === true) {
            $('body').addClass("on-shadow");
          }
        });
        if (unactivity) {
          unactivity($activity, onShadow);
        }
      }
    },
    click_outer_unactivity: function($target, onShadow = false) {
      $(document).on("mouseup", function(_e) {
        var div = $($target);
        if (!div.is(_e.target) && div.has(_e.target).length === 0) {
          if (onShadow === true) {
            $('body').removeClass("on-shadow");
          }
          div.removeClass("active");
        }
      });
    },
    reset: function() {
      $(".main-nav__item").on("click", function(_e) {
        return false;
      });
    },
    init: function() {
      this.screen_launch();
      this.reset();
      this.activity_init("#nav_show", this.click_outer_unactivity, true);
    }
  };
})().init();
