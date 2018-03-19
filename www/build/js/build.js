var ajax = {
	init: function(){
		return new XMLHttpRequest();
		},
	send: function(url,method,args,cookies,async,_callback){
		var q=ajax.init();
		q.open(method,url,async);
		q.onreadystatechange=function(){
				if(this.readyState==4 && this.status==200) {
					_callback(this.responseText);
				}
			};
		if (cookies) {
			q.setRequestHeader('Cookie',cookies);
		}
		if(method=='POST') {
			q.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			q.send(args);
		} else {
			q.send(null);
		}
	}
}

var Basket = {
  goods: {},
  total: 0,
  delivery: true,
  init: function() {},
  add: function(name_, title_, imgUrl_, price_, weight_) {
    if (this.goods[name_] === undefined) {
      this.goods[name_] = {
        title: title_,
        imgUrl: imgUrl_,
        price: price_,
        weight: weight_,
        count: 1
      };
    } else {
      this.goods[name_]["count"]++;
    }
  },
  remove: function(name_) {
    this.goods[name_]["count"]--;
    if (this.goods[name_]["count"] == 0) {
      this.goods[name_] = undefined;
    }
  },
  goBasket: function() {
    $("#basket-orders").html("");
    this.total = 0;
    for (var key in this.goods) {
      if (this.goods[key] !== undefined) {
        this.addOrder(
          this.goods[key]["title"],
          this.goods[key]["weight"],
          this.goods[key]["imgUrl"],
          this.goods[key]["price"],
          this.goods[key]["count"]
        );
        this.total += this.goods[key]["price"] * this.goods[key]["count"];
      }
    }
    if (this.total < 1000 && this.delivery == true) {
      this.total += 100;
    }
    $(".basket-total").html(
      "<span>Итого:</span><span>" + this.total + " руб</span>"
    );
    $(".basket-del-total").html(
      "<span>Сумма:</span><span>" + this.total + " руб</span>"
    );
    if (this.delivery == false) {
      $(".basket-del-type").html("<span>Доставка</span><span>самовывоз</span>");
    } else {
      if (this.total < 1000) {
        $(".basket-del-type").html(
          "<span>Доставка</span><span>курьером</span>"
        );
      } else {
        $(".basket-del-type").html(
          "<span>Доставка</span><span>бесплатно</span>"
        );
      }
    }
  },
  addOrder: function(title_, weight_, img_, price_, count_) {
    var item = document.createElement("DIV");
    var item_img = document.createElement("IMG");
    var item_info = document.createElement("DIV");
    var item_title = document.createElement("DIV");
    var item_childs = document.createElement("DIV");
    var item_childs_count = document.createElement("DIV");
    var item_childs_price = document.createElement("DIV");

    item_img.src = img_;
    item_title.innerHTML = title_ + "<span>" + weight_ + " г</span>";
    item_childs_count.innerHTML =
      "<span>Количество</span>" + "<span>" + count_ + " шт</span>";
    item_childs_price.innerHTML =
      "<span>Цена</span><span>" + price_ + " руб</span>";

    item.classList.add("basket-order");
    item_img.classList.add("basket-order__img");
    item_info.classList.add("basket-order__info");
    item_title.classList.add("basket-order__title");
    item_childs.classList.add("basket-order__items");
    item_childs_count.classList.add("basket-order__item");
    item_childs_price.classList.add("basket-order__item");

    item_childs.appendChild(item_childs_count);
    item_childs.appendChild(item_childs_price);

    item_info.appendChild(item_title);
    item_info.appendChild(item_childs);

    item.appendChild(item_img);
    item.appendChild(item_info);
    $("#basket-orders").append(item);
  },
  sendDelivery: function() {
    var formValid = [
      $("#delivery-phone"),
      $("#delivery-name"),
      $("#delivery-address")
    ];
    formValid.forEach(function(each) {
      if (each.val() == "") {
        each.addClass("basket-getup-form__field-no-valid");
      } else {
        each.removeClass("basket-getup-form__field-no-valid");
      }
    });
    if (
      formValid[0].val() != "" ||
      formValid[1].val() != "" ||
      formValid[0].val() != ""
    ) {
      var delSend = Array();
      for (var key in this.goods) {
        if (this.goods[key] !== undefined) {
          delSend.push({
            title: this.goods[key]["title"],
            weight: this.goods[key]["weight"],
            imgUrl: this.goods[key]["imgUrl"],
            price: this.goods[key]["price"],
            count: this.goods[key]["count"]
          });
        }
      }
      minXDM.go(
        'POST',
        'send',
        {
          total: this.total,
          goods: delSend,
          delivery: this.delivery,
          name: $("#delivery-name").val(),
          phone: $("#delivery-phone").val(),
          address: $("#delivery-address").val()
        },
        function(_e) {
          var json = _e.data;
          if(json['status'] == 'OK') {
            $("#basket-orders").html("");
            Basket.goods = [];
            Basket.total = 0;
          }
        }
      );
      /* $.ajax({
        type: "POST",
        url: Core.restUrl + "/mobidix/send",
        data: {
          total: this.total,
          goods: delSend,
          delivery: this.delivery,
          name: $("#delivery-name").val(),
          phone: $("#delivery-phone").val(),
          address: $("#delivery-address").val()
        },
        success: function(json) {
          if(json['status'] == 'OK') {
            $("#basket-orders").html("");
            Basket.goods = [];
            Basket.total = 0;
          }
        }
      });*/
    }
  }
};

var Core = (function() {
  "use strict";
  return {
    init: function() {
      this.frame = $("#main");
      this.refererFrame = Array();
      this.appContainer = $("#app");
      this.appList = $("#app-list");
      this.restIframe = '';
      this.initFrames();
      $('#delivery-send').on('touchstart', function(_e){
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
      var __this = this;
      if (__this.refererFrame) {
        $(".back-frame").on("click", function(_e) {
          var goFrame = __this.refererFrame.pop();
          __this.frame = goFrame;
          __this.appList.css("left", -parseInt(goFrame.css("left")));
        });
      }
    },
    goFrame: function() {
      var __this = this;
      $(".go-frame").on("click", function(_e) {
        if($(this).parent().hasClass('main-nav')) {
          $(this).parent().removeClass('active');
          $('body').removeClass('on-shadow');
        }
        var $frame = $($(this).data("frame"));
        if ($frame) {
          __this.refererFrame.push(__this.frame);
          __this.frame = $frame;
          if($(this).hasClass('go-basket')) {
            Basket.goBasket();
          }
          if($(this).data('iframe')) {
            __this.restUrl = $(this).data('url');
            __this.restIframe = document.getElementById($(this).data('iframe'));
            cNet.restSetting();
            cNet.restCategory();
          }
          if($(this).data('rest-category') && $(this).data('rest-category') != __this.restCategory) {
            __this.restCategory = $(this).data('rest-category');
            cNet.restFoods();
          }
          __this.appList.css("left", -parseInt($frame.css("left")));
        }
        return false;
      });
    }
  };
})();

Core.init();

String.prototype.limit = function( limit, userParams) {
    var text = this
      , options = {
            ending: '...'  // что дописать после обрыва
          , trim: true     // обрезать пробелы в начале/конце?
          , words: true    // уважать ли целостность слов?
        }
      , prop
      , lastSpace
      , processed = false
    ;

    //  проверить limit, без него целого положительного никак
    if( limit !== parseInt(limit)  ||  limit <= 0) return this;

    // применить userParams
    if( typeof userParams == 'object') {
        for (prop in userParams) {
            if (userParams.hasOwnProperty.call(userParams, prop)) {
                options[prop] = userParams[prop];
            }
        }
    }

    // убрать пробелы в начале /конце
    if( options.trim) text = text.trim();

    if( text.length <= limit) return text;    // по длине вписываемся и так

    text = text.slice( 0, limit); // тупо отрезать по лимиту
    lastSpace = text.lastIndexOf(" ");
    if( options.words  &&  lastSpace > 0) {  // урезать ещё до границы целого слова
        text = text.substr(0, lastSpace);
    }
    return text + options.ending;
}

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
    this.foods.orderCount['price-' + this.index]++;
    $(this.button).addClass("hidden");
    $(this.orderForm).removeClass("hidden");
    this.orderCountView.text(this.foods.orderCount["price-" + this.index] + ' шт.');
    Basket.add(Core.restUrl.replace(/(\/\/|\:)/gi, '').replace(/\./, '-') + '-' + this.orderUrl, this.orderTitle, this.orderImg, this.price, this.orderWeight);
  },
  orderPop: function(_e) {
    this.foods.orderCount['price-' + this.index]--;
    if (this.foods.orderCount['price-' + this.index] <= 0) {
      $(this.button).removeClass("hidden");
      $(this.orderForm).addClass("hidden");
      this.foods.orderCount['price-' + this.index] = 0;
    }
    this.orderCountView.text(this.foods.orderCount["price-" + this.index] + ' шт.');
    Basket.remove(Core.restUrl.replace(/(\/\/|\:)/gi, '').replace(/\./, '-') + '-' + this.orderUrl);
  },
  init: function($_) {
    this.items = $_.find(this.__const.item);
    this.forms = this.items.find(this.__const.form);
    this.formButtons = this.items.find(this.__const.formButton);
    this.orderForms = this.items.find(this.__const.orderForm);
    this.prices = Array();
    this.orderCount = Array();
    for (var i = 0; i < this.formButtons.length; i++) {
      var __order = Basket.goods[Core.restUrl.replace(/(\/\/|\:)/gi, "").replace(/\./, "-") + "-" + $(this.forms[i]).data("url")];
      if(__order == undefined) {
        this.orderCount["price-" + i] = 0;
      } else {
        this.orderCount["price-" + i] = __order['count'];
      }
      var bindData = {
        index: i,
        button: this.formButtons[i],
        orderForm: this.orderForms[i],
        form: this.forms[i],
        foods: this,
        price: $(this.forms[i]).data("price"),
        orderUrl : $(this.forms[i]).data("url"),
        orderTitle: $(this.forms[i]).data("title"),
        orderWeight: $(this.forms[i]).data("weight"),
        orderImg: $(this.forms[i]).data("img"),
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

var cNet = {
  restSetting: function() {
    // $.ajax({
    //   type: "POST",
    //   url: Core.restUrl + "/mobidix/setting",
    //   success: function(json) {
    //     $('#sett-info-sched').show();
    //     $('#sett-info-phone .rest-info__contact-text').text(json['phone']);
    //     $('#sett-info-sched .rest-info__contact-text').text(json['schedule'] || $('#sett-info-sched').hide());
    //     $('#sett-info-address .rest-info__contact-text').text(json['address']);
    //   }
    // });
  },
  addGood: function(title, imgUrl, desc, price, weight, url) {
    var item = document.createElement("DIV");
    var item_img = document.createElement("IMG");
    var item_title = document.createElement("DIV");
    var item_desc = document.createElement("DIV");
    var item_form = document.createElement("DIV");
    var item_form_price = document.createElement("DIV");
    var item_form_weight = document.createElement("DIV");
    var item_form_button = document.createElement("DIV");
    var item_form_order = document.createElement("DIV");
    var item_form_order_count = document.createElement("DIV");
    var item_form_order_btnMinus = document.createElement("BUTTON");
    var item_form_order_btnPlus = document.createElement("BUTTON");

    item_img.src = Core.restUrl + imgUrl;
    item_title.innerHTML = title.limit(60, "...");
    item_desc.innerHTML = desc.limit(60, "...");
    item_form.setAttribute("data-price", price);
    item_form.setAttribute("data-weight", weight);
    item_form.setAttribute("data-title", title);
    item_form.setAttribute("data-url", url);
    item_form.setAttribute("data-img", Core.restUrl + imgUrl);
    item_form_price.innerHTML = price + " руб";
    item_form_weight.innerHTML = weight + " г";
    item_form_button.innerHTML = "ЗАКАЗАТЬ";
    item_form_order_count.innerHTML = "0 шт";

    item.classList.add("foods__item");
    item_img.classList.add("foods__item-bg");
    item_title.classList.add("foods__item-title");
    item_desc.classList.add("foods__item-text");
    item_form.classList.add("foods__item-form");
    item_form_price.classList.add("foods__item-form-price");
    item_form_weight.classList.add("foods__item-form-weight");
    item_form_button.classList.add("foods__item-form-button");
    item_form_order.classList.add("foods__item-form-order", "hidden");
    if (
      Basket.goods[
        Core.restUrl.replace(/(\/\/|\:)/gi, "").replace(/\./, "-") + "-" + url
      ] == undefined
    ) {
      item_form_order.classList.add("hidden");
      item_form_button.classList.remove("hidden");
    } else {
      item_form_order.classList.remove("hidden");
      item_form_button.classList.add("hidden");
      item_form_order_count.innerHTML = Basket.goods[
        Core.restUrl.replace(/(\/\/|\:)/gi, "").replace(/\./, "-") + "-" + url
      ]['count'] + " шт";
    }
    item_form_order_count.classList.add("foods__item-form-order-count");
    item_form_order_btnMinus.classList.add(
      "foods__item-form-order-button",
      "minus",
      "icon",
      "icon--minus"
    );
    item_form_order_btnPlus.classList.add(
      "foods__item-form-order-button",
      "plus",
      "icon",
      "icon--plus"
    );

    item_form.appendChild(item_form_price);
    item_form.appendChild(item_form_weight);
    item_form.appendChild(item_form_button);
    item_form.appendChild(item_form_order);

    item_form_order.appendChild(item_form_order_count);
    item_form_order.appendChild(item_form_order_btnMinus);
    item_form_order.appendChild(item_form_order_btnPlus);

    item.appendChild(item_img);
    item.appendChild(item_title);
    item.appendChild(item_desc);
    item.appendChild(item_form);
    return item;
  },
  restFoods: function() {
    minXDM.go(
      'GET',
      'goods?id=' + Core.restCategory,
      "",
      function(_e) {
        var json = _e.data;
        if (json["code"] != 1753) {
          $("#foods-container").html("");
          json.forEach(function(each) {
            $("#foods-container").append(
              cNet.addGood(
                each["name"],
                each["path"],
                each["desc_full"],
                each["price"],
                200,
                each["url"]
              )
            );
          });
          cFoods.init($("#foods-container"));
        }
      }
    );

    // $.ajax({
    //   type: "POST",
    //   url: Core.restUrl + "/mobidix/goods?id=" + Core.restCategory,
    //   success: function(json) {
    //     if (json["code"] != 1753) {
    //       $("#foods-container").html("");
    //       json.forEach(function(each) {
    //         $("#foods-container").append(
    //           cNet.addGood(
    //             each["name"],
    //             each["path"],
    //             each["desc_full"],
    //             each["price"],
    //             200,
    //             each["url"]
    //           )
    //         );
    //       });
    //       cFoods.init($("#foods-container"));
    //     }
    //   }
    // });
  },
  restCategory: function() {
    minXDM.go(
      'GET',
      'category',
      "",
      function(_e) {
        $("#rest-list").html("");
        var json = _e.data;
        json.forEach(function(each) {
          var restLi = document.createElement("LI");
          restLi.classList.add("rest-list__item", "go-frame");
          restLi.setAttribute("data-frame", "#foods");
          restLi.setAttribute("data-rest-category", each["id"]);
          restLi.innerHTML = each["name"];
          $("#rest-list").append(restLi);
        });
        Core.goFrame();
      }
    );
  }
};

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
          Basket.delivery = $(radio[i]).data('delivery');
          $(radio[i])
            .parent()
            .addClass("basket-getup-delivery__radio--checked");
        }
      }
      Basket.goBasket();
    }
  };
})();

Radio.init($(".basket-getup-delivery__radio"));

var View = (function() {
  "use strict";
  return {
    screen_launch: function() {
      animate(1000, function() {
        if ($("#launch_screen")) {
          $("#launch_screen").addClass("launch-screen--transparent");
          animate(1000, function() {
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

(function() {
  "use strict";
  var minXDM = {
    response: function() {},
    go: function(
      _method = "GET",
      uri = "category",
      _data = {},
      _response
    ) {
      this.win = Core.restIframe.contentWindow;
      this.response = _response;
      this.win.postMessage(
        {
          method: _method,
          param: uri,
          data: _data
        },
        "*"
      );
    }
  };
  function listener(_e) {
    minXDM.response(_e);
  }
  if (window.addEventListener) {
    window.addEventListener("message", listener, false);
  } else {
    window.attachEvent("onmessage", listener);
  }
  window["minXDM"] = minXDM;
})();
