<?php
ob_start();
  define('PATH', dirname(__FILE__) . '/');
  function ainc($name) {
    $path = PATH . 'assets/' . $name . '.php';
    if(file_exists($path) === true) {
      return require_once($path);
    }
    echo('Such file not found ' . $path);
  }
  require_once(PATH . 'tpl/header.php');
?>
  <?php //require_once(PATH . 'tpl/launch.php'); ?>
<div class="app" id="app">
  <div class="app__list" id="app-list">
    <?php
      require_once(PATH . 'tpl/main.php');
      require_once(PATH . 'tpl/restaurant.php');
    ?>
  </div>
</div>
<?php
  require_once(PATH . 'tpl/footer.php');
ob_end_flush();
