var View = (function() {
  "use strict";
  return {
    screen_launch: function() {
      window.addEventListener('load', function(_e) {
        $("#launch_screen").addClass("launch-screen--transparent");
        animate(1000, function() {
          $("#launch_screen").css("visibility", "hidden");
        });
      });
    },
    activity_init: function($_, unactivity, onShadow = false) {
      var $activity = $($($_).data("activity"));
      if ($activity) {
        $($_).on("click", function(_e) {
          $activity.addClass("active");
          if (onShadow === true) {
            $("body").addClass("on-shadow");
          }
        });
        if (unactivity) {
          unactivity($activity, onShadow);
        }
      }
    },
    unactivity_init: function($_) {
      var $unactivity = $($($_).data("unactivity"));
      if ($unactivity) {
        $($_).on("click", function(_e) {
          $unactivity.removeClass("active");
        });
      }
    },
    click_outer_unactivity: function($target, onShadow = false) {
      $(document).on("mouseup", function(_e) {
        var div = $($target);
        if (!div.is(_e.target) && div.has(_e.target).length === 0) {
          if (onShadow === true) {
            $("body").removeClass("on-shadow");
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
    stars_init: function($_) {
      this.startTouch = function(_e) {
        $_.removeClass("active");
        for (var i = 0; i < $(this).index() + 1; i++) {
          $($_[i]).addClass("active");
        }
      };
      $_.on("touchstart", this.startTouch);
    },
    init: function() {
      this.screen_launch();
      this.reset();
      this.activity_init("#nav_show", this.click_outer_unactivity, true);
      this.activity_init("#rest-info-activity");
      this.unactivity_init("#rest-info-unactivity");
      this.stars_init($(".rest-header__star"));
    }
  };
})();

View.init();
