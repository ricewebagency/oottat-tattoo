(() => {
  const root = document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const siteHeader = document.querySelector("[data-site-header]");

  const getHeaderOffset = () => {
    if (!siteHeader) {
      return 0;
    }
    return Math.ceil(siteHeader.getBoundingClientRect().height + 12);
  };

  const scrollToHash = (hash, behavior = "smooth") => {
    if (!hash || hash === "#") {
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    const targetTop =
      target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior,
    });
  };

  const update = () => {
    if (mediaQuery.matches) {
      root.classList.remove("scroll-smooth");
      return;
    }
    root.classList.add("scroll-smooth");
  };

  update();
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", update);
  } else {
    mediaQuery.addListener(update);
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest('a[href^="#"]');
    if (!trigger) {
      return;
    }

    const hash = trigger.getAttribute("href");
    if (!hash) {
      return;
    }

    if (hash === "#") {
      event.preventDefault();
      history.replaceState(null, "", "#");
      window.scrollTo({ top: 0, behavior: mediaQuery.matches ? "auto" : "smooth" });
      return;
    }

    if (!document.querySelector(hash)) {
      return;
    }

    event.preventDefault();
    history.replaceState(null, "", hash);
    scrollToHash(hash, mediaQuery.matches ? "auto" : "smooth");
  });

  window.addEventListener("hashchange", () => {
    scrollToHash(window.location.hash, mediaQuery.matches ? "auto" : "smooth");
  });

  if (window.location.hash) {
    window.requestAnimationFrame(() => {
      scrollToHash(window.location.hash, "auto");
    });
  }
})();
