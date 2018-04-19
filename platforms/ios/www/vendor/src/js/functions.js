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
