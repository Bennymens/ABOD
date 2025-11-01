// Site-wide search modal and toggle
if (window.__site_search_installed) {
  // already installed
} else {
  window.__site_search_installed = true;

  function createSearchDropdown() {
    const existing = document.getElementById("global-search-dropdown");
    if (existing) {
      // toggle close
      existing.remove();
      return;
    }

    const nav = document.querySelector("nav.navbar");
    const rect = nav ? nav.getBoundingClientRect() : { bottom: 56 };
    const top = rect.bottom + window.scrollY;

    const dropdown = document.createElement("div");
    dropdown.id = "global-search-dropdown";
    dropdown.style.position = "absolute";
    dropdown.style.left = "0";
    dropdown.style.right = "0";
    dropdown.style.top = top + "px";
    dropdown.style.display = "flex";
    dropdown.style.justifyContent = "center";
    dropdown.style.zIndex = "9999";
    dropdown.style.pointerEvents = "none";

    const box = document.createElement("div");
    box.style.width = "min(1100px, 96vw)";
    box.style.background = "#fff";
    box.style.padding = "12px 14px";
    box.style.borderRadius = "8px";
    box.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12)";
    box.style.transform = "translateY(-8px)";
    box.style.opacity = "0";
    box.style.transition = "transform 260ms ease, opacity 220ms ease";
    box.style.pointerEvents = "auto";

    const form = document.createElement("form");
    form.method = "get";
    form.action = "/search/";
    form.style.display = "flex";
    form.style.gap = "8px";

    const input = document.createElement("input");
    input.type = "text";
    input.name = "q";
    input.id = "global-search-input";
    input.placeholder = "Search the site...";
    input.style.flex = "1";
    input.style.fontSize = "1rem";
    input.style.padding = "10px 12px";
    input.style.border = "1px solid #e6e6e6";
    input.style.borderRadius = "6px";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Search";
    submit.style.padding = "10px 14px";
    submit.style.border = "none";
    submit.style.borderRadius = "6px";
    submit.style.background = "#e67e22";
    submit.style.color = "#fff";
    submit.style.cursor = "pointer";

    form.appendChild(input);
    form.appendChild(submit);
    box.appendChild(form);
    dropdown.appendChild(box);
    document.body.appendChild(dropdown);

    // force next frame then animate down
    requestAnimationFrame(() => {
      box.style.transform = "translateY(0)";
      box.style.opacity = "1";
    });

    // focus input
    setTimeout(() => input.focus(), 50);

    function updatePosition() {
      const nav = document.querySelector("nav.navbar");
      const rect = nav ? nav.getBoundingClientRect() : { bottom: 56 };
      const top = rect.bottom + window.scrollY;
      dropdown.style.top = top + "px";
    }

    function closeDropdown() {
      const el = document.getElementById("global-search-dropdown");
      if (!el) return;
      const inner = el.firstChild;
      inner.style.transform = "translateY(-8px)";
      inner.style.opacity = "0";
      setTimeout(() => el.remove(), 240);
      document.removeEventListener("click", outsideClick);
      document.removeEventListener("keydown", escHandler);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    }

    function outsideClick(e) {
      if (
        !box.contains(e.target) &&
        !e.target.closest('.icon-link[title="Search"]')
      ) {
        closeDropdown();
      }
    }

    function escHandler(e) {
      if (e.key === "Escape") closeDropdown();
    }

    // close when clicking outside or pressing escape
    setTimeout(() => document.addEventListener("click", outsideClick), 0);
    document.addEventListener("keydown", escHandler);
    // update position on resize/scroll (handles mobile menu changes)
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
  }

  function createInFlowSearch() {
    // if already exists, toggle
    var existing = document.getElementById("search-bar");
    if (existing) {
      // ensure existing matches our standard structure
      ensureStandardSearch(existing);
      existing.classList.toggle("active");
      var inp = existing.querySelector("input");
      if (inp) inp.focus();
      return;
    }

    var nav = document.querySelector("nav.navbar");
    if (!nav) return;

    var built = buildStandardSearch();
    var wrapper = built.wrapper;
    var input = built.input;

    // insert after navbar
    nav.parentNode.insertBefore(wrapper, nav.nextSibling);

    // animate in
    requestAnimationFrame(function () {
      wrapper.classList.add("active");
    });

    setTimeout(function () {
      input.focus();
    }, 120);
  }

  function buildStandardSearch() {
    var wrapper = document.createElement("div");
    wrapper.id = "search-bar";
    wrapper.className =
      "results-search-wrapper navbar-results-search search-bar full-bleed in-flow-search";
    wrapper.style.width = "100%";
    wrapper.style.boxSizing = "border-box";

    var form = document.createElement("form");
    form.method = "get";
    form.action = "/search/";
    form.className = "results-search-form";

    var bar = document.createElement("div");
    bar.className = "results-search-bar";

    var submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "results-search-submit";
    submit.setAttribute("aria-label", "Submit search");
    submit.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

    var input = document.createElement("input");
    input.type = "text";
    input.name = "q";
    input.id = "results-search-input";
    input.placeholder = "search ABOD";
    input.setAttribute("aria-label", "Search ABOD");
    input.style.flex = "1";

    var clear = document.createElement("button");
    clear.type = "button";
    clear.className = "results-search-clear";
    clear.id = "results-search-clear";
    clear.setAttribute("aria-label", "Clear search");
    clear.textContent = "×";
    clear.addEventListener("click", function () {
      if (input.value && input.value.trim().length > 0) {
        input.value = "";
        input.focus();
      } else {
        wrapper.remove();
      }
    });

    bar.appendChild(submit);
    bar.appendChild(input);
    bar.appendChild(clear);
    form.appendChild(bar);
    wrapper.appendChild(form);

    return { wrapper: wrapper, input: input };
  }

  function ensureStandardSearch(el) {
    // If element already looks correct, do nothing
    if (
      el.classList.contains("results-search-wrapper") &&
      el.querySelector &&
      el.querySelector(".results-search-bar")
    ) {
      return;
    }

    // Otherwise, replace it with our standard structure while keeping any
    // existing JS references stable by replacing in-place.
    var built = buildStandardSearch();
    el.parentNode.replaceChild(built.wrapper, el);
    return built.wrapper;
  }

  document.addEventListener("click", function (e) {
    const target =
      e.target.closest && e.target.closest('.icon-link[title="Search"]');
    if (target) {
      e.preventDefault();
      // Delegate to createInFlowSearch which handles both toggling an existing
      // search bar and creating/animating a new one with the standard markup.
      createInFlowSearch();
    }
  });

  // Install a site-wide hamburger/mobile menu toggle so every page that includes
  // this script gets consistent behavior (no inline JS required in templates).
  if (!window.__hamburger_installed) {
    window.__hamburger_installed = true;

    function closeMobileMenu(hamburger, mobileMenu) {
      if (hamburger) hamburger.classList.remove("active");
      if (mobileMenu) mobileMenu.classList.remove("open");
      const overlay = document.getElementById("mobile-overlay");
      if (overlay) overlay.remove();
    }

    function openMobileMenu(hamburger, mobileMenu) {
      if (hamburger) hamburger.classList.add("active");
      if (mobileMenu) mobileMenu.classList.add("open");
      // add semi-opaque overlay to indicate modal state and capture clicks
      let overlay = document.getElementById("mobile-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "mobile-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "rgba(0,0,0,0.35)";
        overlay.style.zIndex = "999";
        overlay.style.backdropFilter = "blur(2px)";
        document.body.appendChild(overlay);
        overlay.addEventListener("click", () =>
          closeMobileMenu(hamburger, mobileMenu)
        );
      }
    }

    document.addEventListener("DOMContentLoaded", function () {
      const hamburger = document.getElementById("hamburger");
      const mobileMenu = document.getElementById("mobile-menu");

      if (!hamburger || !mobileMenu) return;

      // ensure clicking the hamburger toggles the menu
      hamburger.addEventListener("click", function (e) {
        e.stopPropagation();
        if (hamburger.classList.contains("active")) {
          closeMobileMenu(hamburger, mobileMenu);
        } else {
          openMobileMenu(hamburger, mobileMenu);
        }
      });

      // close when clicking a nav link inside the mobile menu
      mobileMenu.querySelectorAll &&
        mobileMenu.querySelectorAll(".mobile-nav-links a").forEach((link) => {
          link.addEventListener("click", function () {
            closeMobileMenu(hamburger, mobileMenu);
          });
        });

      // close on escape
      document.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape") closeMobileMenu(hamburger, mobileMenu);
      });
    });
  }
}
