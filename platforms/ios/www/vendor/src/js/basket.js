var Basket = {
  goods: {},
  total: 0,
  total_: 0,
  count_: 0,
  delivery: true,
  init: function() {
    $(".fixed").css(
      "left",
      parseInt(
        $(this)
          .parent()
          .css("left")
      )
    );
  },
  add: function(name_, title_, imgUrl_, price_, weight_) {
    this.total_ += price_;
    this.count_++;
    this.viewRefresh();
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
    this.total_ -= this.goods[name_]["price"];
    this.count_--;
    this.viewRefresh();
    this.goods[name_]["count"]--;
    if (this.goods[name_]["count"] == 0) {
      this.goods[name_] = undefined;
    }
  },
  viewRefresh: function() {
    if(this.total_ > 0){
      $('#basket-fixed').removeClass('basket-fixed--hidden');
    } else {
      $('#basket-fixed').addClass('basket-fixed--hidden');
    }
    $('#basket-bar-fixed-price').text(this.total_);
    $('#basket-bar-fixed-count').text(this.count_);
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
    if (Basket.goods.length != 0) {
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
        formValid[0].val() != "" &&
        formValid[1].val() != "" &&
        formValid[0].val() != ""
      ) {
        $("#send-del-load-screen").css("display", "flex");
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
          "POST",
          "send",
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
            if (json["status"] == "OK") {
              $("#basket-orders").html("");
              Basket.goods = [];
              Basket.total = 0;
              $("#send-del-load-screen").text("Отправлено");
              $("#send-del-load-screen").addClass("none");
              animate(3000, function() {
                $("#send-del-load-screen").css("display", "");
                Basket.goBasket();
              });
            }
          }
        );
      }
    }
  }
};

Basket.init();
