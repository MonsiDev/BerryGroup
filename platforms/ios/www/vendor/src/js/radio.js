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
