var cNet = {
  restSetting: function() {
    minXDM.go("GET", "setting", "", function(_e) {
      var json = _e.data;
      $("#sett-info-sched").show();
      $("#sett-info-phone .rest-info__contact-text").html(json["phone"]);
      if (json["schedule"]) {
        $("#sett-info-sched .rest-info__contact-text").html(json["schedule"]);
      } else {
        $("#sett-info-sched").hide();
      }
      $("#sett-info-address .rest-info__contact-text").html(json["address"]);
    });
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
      item_form_order_count.innerHTML =
        Basket.goods[
          Core.restUrl.replace(/(\/\/|\:)/gi, "").replace(/\./, "-") + "-" + url
        ]["count"] + " шт";
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
    minXDM.go("GET", "goods?id=" + Core.restCategory, "", function(_e) {
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
    });
  },
  restCategory: function() {
    minXDM.go("GET", "category", "", function(_e) {
      $("#rest-list").html("");
      var json = _e.data;
      json.forEach(function(each) {
        var restLi = document.createElement("LI");
        restLi.classList.add("rest-list__item", "go-frame");
        restLi.setAttribute("data-frame", "#foods");
        restLi.setAttribute("data-rest-category", each["id"]);
        restLi.innerHTML = each["name"];
        $(restLi).on("click", Core.onEventGo);
        document.getElementById("rest-list").appendChild(restLi);
      });
      cNet.restSetting();
    });
  }
};
