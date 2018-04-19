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
        .on("click", this.orderPop.bind(bindData));
      $(this.orderForms[i])
        .find(this.__const.orderPlus)
        .on("click", this.orderPush.bind(bindData));
      $(this.formButtons[i]).on("click", this.orderPush.bind(bindData));
    }
  }
};
