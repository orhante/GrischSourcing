document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".site-header");
  var yearEl = document.getElementById("year");
  var scrollLinks = document.querySelectorAll("a.js-scroll[href^='#']");

  // Update footer year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Subtle header shadow when scrolling
  var lastKnownScrollY = 0;
  var ticking = false;

  function onScroll() {
    lastKnownScrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (header) {
          if (lastKnownScrollY > 12) {
            header.classList.add("site-header--scrolled");
          } else {
            header.classList.remove("site-header--scrolled");
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Smooth scroll for in-page navigation
  scrollLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId.charAt(0) !== "#") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      var headerOffset = (header && header.offsetHeight) || 0;
      var elementRect = target.getBoundingClientRect();
      var absoluteY = elementRect.top + window.pageYOffset;
      var offsetPosition = absoluteY - headerOffset - 16;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });
});

