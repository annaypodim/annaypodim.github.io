(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var gallery = document.querySelector('.journalism-gallery');
    if (!gallery) {
      return;
    }

    var desktopQuery = window.matchMedia('(min-width: 900px)');
    var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery.matches) {
      return;
    }

    var shouldCapture = false;
    var wheelAttached = false;
    var wheelOptions = { passive: false };

    function isScrollable() {
      return gallery.scrollWidth - gallery.clientWidth > 1;
    }

    function onWheel(event) {
      if (!shouldCapture || !desktopQuery.matches || !isScrollable()) {
        return;
      }

      var delta = event.deltaY;
      if (!delta) {
        return;
      }

      var prev = gallery.scrollLeft;
      var maxScroll = gallery.scrollWidth - gallery.clientWidth;
      var next = Math.max(0, Math.min(maxScroll, prev + delta));

      if (next !== prev) {
        gallery.scrollLeft = next;
        event.preventDefault();
      }
    }

    function updateWheelListener() {
      var needsListener = shouldCapture && desktopQuery.matches && isScrollable();
      if (needsListener && !wheelAttached) {
        window.addEventListener('wheel', onWheel, wheelOptions);
        wheelAttached = true;
      } else if (!needsListener && wheelAttached) {
        window.removeEventListener('wheel', onWheel, wheelOptions);
        wheelAttached = false;
      }
    }

    function checkFullyVisible() {
      var rect = gallery.getBoundingClientRect();
      var fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      shouldCapture = fullyVisible;
      updateWheelListener();
    }

    window.addEventListener('scroll', checkFullyVisible, { passive: true });
    checkFullyVisible();

    function handleMediaChange() {
      updateWheelListener();
    }

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', handleMediaChange);
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener(handleMediaChange);
    }

    window.addEventListener('pagehide', cleanup);
    window.addEventListener('beforeunload', cleanup);

    function cleanup() {
      window.removeEventListener('wheel', onWheel, wheelOptions);
      if (typeof desktopQuery.removeEventListener === 'function') {
        desktopQuery.removeEventListener('change', handleMediaChange);
      } else if (typeof desktopQuery.removeListener === 'function') {
        desktopQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener('scroll', checkFullyVisible);
      wheelAttached = false;
    }
  });
})();
