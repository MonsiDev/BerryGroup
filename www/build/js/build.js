var Core = (function() {
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
})();

Core.init();


var cFoods = {
  __const: {
    item: ".foods__item",
    form: ".foods__item-form",
    formButton: ".foods__item-form-button",
    orderForm: ".foods__item-form-order",
    orderPlus: ".foods__item-form-order-button.plus",
    orderMinus: ".foods__item-form-order-button.minus",
    orderCountView: ".foods__item-form-order-count"
  },
  orderPush: function(_e) {
    this.foods.prices["price-" + this.index] += this.price;
    this.foods.orderCount['price-' + this.index]++;
    $(this.button).addClass("hidden");
    $(this.orderForm).removeClass("hidden");
    this.orderCountView.text(this.foods.orderCount["price-" + this.index] + ' шт.');
  },
  orderPop: function(_e) {
    this.foods.prices["price-" + this.index] -= this.price;
    this.foods.orderCount['price-' + this.index]--;
    if (this.foods.prices["price-" + this.index] <= 0) {
      $(this.button).removeClass("hidden");
      $(this.orderForm).addClass("hidden");
      this.foods.prices["price-" + this.index] = 0;
    }
    this.orderCountView.text(this.foods.orderCount["price-" + this.index] + ' шт.');
  },
  init: function($_) {
    this.items = $_.find(this.__const.item);
    this.forms = this.items.find(this.__const.form);
    this.formButtons = this.items.find(this.__const.formButton);
    this.orderForms = this.items.find(this.__const.orderForm);
    this.prices = Array();
    this.orderCount = Array();
    for (var i = 0; i < this.formButtons.length; i++) {
      this.prices["price-" + i] = 0;
      this.orderCount["price-" + i] = 0;
      var bindData = {
        index: i,
        button: this.formButtons[i],
        orderForm: this.orderForms[i],
        form: this.forms[i],
        foods: this,
        price: $(this.forms[i]).data("price"),
        orderCountView: $(this.orderForms[i]).find(this.__const.orderCountView)
      };
      $(this.orderForms[i])
        .find(this.__const.orderMinus)
        .on("touchstart", this.orderPop.bind(bindData));
      $(this.orderForms[i])
        .find(this.__const.orderPlus)
        .on("touchstart", this.orderPush.bind(bindData));
      $(this.formButtons[i]).on("touchstart", this.orderPush.bind(bindData));
    }
  }
};
cFoods.init($("#foods-container"));

function animate(duration, func_end_anim) {
  var start = performance.now();

  requestAnimationFrame(function animate(time) {
    var timePassed = time - start;
    if (timePassed > duration) {
      timePassed = duration;
      func_end_anim();
    }
    if (timePassed < duration) {
      requestAnimationFrame(animate);
    }
  });
}

var Radio = (function() {
  "use strict";
  return {
    init: function($_) {
      this.innerCircle = document.createElement("span");
      this.outerCircle = document.createElement("span");
      this.radio = $_.find("input[type=radio]");

      this.innerCircle.classList.add(
        "basket-getup-delivery__radio-inner-circle"
      );
      this.outerCircle.classList.add(
        "basket-getup-delivery__radio-outer-circle"
      );

      this.outerCircle.appendChild(this.innerCircle);
      $_.append(this.outerCircle);
      this.element = $_;

      $_.on("change", this.onUpdate.bind(this));
    },

    onUpdate: function(_e) {
      var radio = $(".basket-getup-delivery__radio input[type=radio]");
      $(radio)
        .parent()
        .removeClass("basket-getup-delivery__radio--checked");
      for (var i = 0; i < radio.length; i++) {
        if ($(radio[i]).is(":checked")) {
          $(radio[i])
            .parent()
            .addClass("basket-getup-delivery__radio--checked");
        }
      }
    }
  };
})();

Radio.init($(".basket-getup-delivery__radio"));

var View = (function() {
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
