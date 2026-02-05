(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var typeTargets = document.querySelectorAll('.typewriter');
    if (!typeTargets.length) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    typeTargets.forEach(function (heading) {
      var textSpan = heading.querySelector('.typewriter-text');
      if (!textSpan) return;

      var finalText = (heading.dataset.typeText || textSpan.textContent || '').trim();
      if (!finalText) return;

      var cursor = heading.querySelector('.typewriter-cursor');

      if (prefersReducedMotion) {
        textSpan.textContent = finalText;
        if (cursor) cursor.style.display = 'inline-block';
        return;
      }

      var typingDelay = Number(heading.dataset.typeSpeed) || 90;
      var startDelay = Number(heading.dataset.typeDelay) || 300;
      textSpan.textContent = '';
      var index = 0;

      var typeNext = function () {
        if (index < finalText.length) {
          textSpan.textContent += finalText.charAt(index);
          index += 1;
          window.setTimeout(typeNext, typingDelay);
        }
      };

      window.setTimeout(typeNext, startDelay);
    });
  });
})();
