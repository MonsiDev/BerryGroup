<div class="foods" id="foods-container">
  <?php for($i = 0; $i < 0; $i++) {
    ainc('foods/item');
  }?>
</div>
<div class="basket-fixed basket-fixed--hidden go-basket go-frame fixed" data-frame="#basket" id="basket-fixed">
  <div style="display:flex;align-items:center">
    <div class="basket-fixed__icon">
      <img src="img/shopping-cart.svg" width="15px" height="15px" alt="">
    </div>
    <span class="basket-fixed__text-1">В КОРЗИНЕ ТОВАРОВ:</span>
    <span class="basket-fixed__text-2">
      <span id="basket-bar-fixed-count">0</span> шт.
    </span>
  </div>
  <div class="basket-fixed__price">
    <span id="basket-bar-fixed-price">0</span> ₽
  </div>
</div>
