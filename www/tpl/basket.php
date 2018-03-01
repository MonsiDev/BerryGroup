<div class="app__item" id="basket">
  <?php ainc('basket/header'); ?>
  <?php ainc('basket/logo'); ?>
  <?php
    for($i = 0; $i < 2; $i++) {
      ainc('basket/order');
    }
    ainc('basket/order-calc');
    ainc('basket/order-bar');
  ?>
</div>
