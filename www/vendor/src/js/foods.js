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
}.init($("#foods-container"));
