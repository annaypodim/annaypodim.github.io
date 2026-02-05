(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var heading = document.querySelector('.typewriter');
    if (!heading) return;

    var textSpan = heading.querySelector('.typewriter-text');
    if (!textSpan) return;

    var finalText = (heading.dataset.typeText || textSpan.textContent || '').trim();
    if (!finalText) return;

    var cursor = heading.querySelector('.typewriter-cursor');
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      textSpan.textContent = finalText;
      if (cursor) cursor.style.display = 'inline-block';
      return;
    }

    var typingDelay = Number(heading.dataset.typeSpeed) || 90;
    textSpan.textContent = '';
    var index = 0;

    var typeNext = function () {
      if (index < finalText.length) {
        textSpan.textContent += finalText.charAt(index);
        index += 1;
        window.setTimeout(typeNext, typingDelay);
      }
    };

    window.setTimeout(typeNext, 300);
  });
})();
