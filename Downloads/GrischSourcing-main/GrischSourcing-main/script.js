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

  // Build product URLs with query parameters for each product card
  var productLinks = document.querySelectorAll(".product-card__link");

  productLinks.forEach(function (link) {
    var card = link.closest(".product-card");
    if (!card) return;

    var titleEl = card.querySelector(".product-card__title");
    var metaEl = card.querySelector(".product-card__meta");
    var imageEl = card.querySelector(".product-card__image");

    var name = (titleEl && titleEl.textContent.trim()) || "";
    var price = link.dataset.productPrice || "";
    var description =
      link.dataset.productDescription ||
      (metaEl && metaEl.textContent.trim()) ||
      "";
    var image = (imageEl && imageEl.getAttribute("src")) || "";

    var params = new URLSearchParams();

    if (name) params.set("name", name);
    if (price) params.set("price", price);
    if (image) params.set("image", image);
    if (description) params.set("description", description);

    var baseHref = link.getAttribute("href") || "product.html";
    var baseUrl = baseHref.split("?")[0];

    link.href = baseUrl + "?" + params.toString();
  });

  // On product detail page, read URL parameters and update content
  var productDetailEl = document.querySelector(".product-detail");
  if (productDetailEl) {
    var searchParams = new URLSearchParams(window.location.search);

    var nameParam = searchParams.get("name");
    var priceParam = searchParams.get("price");
    var imageParam = searchParams.get("image");
    var descriptionParam = searchParams.get("description");

    var nameEl = document.getElementById("product-name");
    var priceEl = document.getElementById("product-price");
    var imageEl = document.getElementById("product-image");
    var descriptionEl = document.getElementById("product-description");

    if (nameParam && nameEl) {
      nameEl.textContent = nameParam;
      document.title = nameParam + " — Grisch Atelier";
    }

    if (priceParam && priceEl) {
      priceEl.textContent = priceParam;
    }

    if (imageParam && imageEl) {
      imageEl.src = imageParam;
      if (nameParam) {
        imageEl.alt = nameParam;
      }
    }

    if (descriptionParam && descriptionEl) {
      descriptionEl.textContent = descriptionParam;
    }

    // Update WhatsApp inquiry message with product name, if present
    var inquiryLink = productDetailEl.querySelector(
      ".product-detail__actions a.button--primary"
    );
    if (inquiryLink && nameParam) {
      var baseWhatsApp = inquiryLink.href.split("?")[0];
      var waParams = new URLSearchParams();
      waParams.set(
        "text",
        "I would like to inquire about the " + nameParam + "."
      );
      inquiryLink.href = baseWhatsApp + "?" + waParams.toString();
    }
  }
});

