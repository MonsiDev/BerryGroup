<div class="app__item" id="basket">
  <?php ainc('basket/header'); ?>
  <?php ainc('basket/logo'); ?>
  <div id="basket-orders">
    <?php
      for($i = 0; $i < 3; $i++) {
        ainc('basket/order');
      }
    ?>
  </div>  
  <?php
      ainc('basket/order-calc');
      ainc('basket/order-bar');
    ?>
</div>
