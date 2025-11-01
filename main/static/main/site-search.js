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
      existing.classList.toggle("active");
      var inp = existing.querySelector("input");
      if (inp) inp.focus();
      return;
    }

    var nav = document.querySelector("nav.navbar");
    if (!nav) return;

    var wrapper = document.createElement("div");
    wrapper.id = "search-bar";
    wrapper.className =
      "results-search-wrapper navbar-results-search in-flow-search active";
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

    // insert after navbar
    nav.parentNode.insertBefore(wrapper, nav.nextSibling);
    setTimeout(function () {
      input.focus();
    }, 50);
  }

  document.addEventListener("click", function (e) {
    const target =
      e.target.closest && e.target.closest('.icon-link[title="Search"]');
    if (target) {
      e.preventDefault();
      // If the page has a visible search bar with id "search-bar", toggle that instead
      const pageSearch = document.getElementById("search-bar");
      if (pageSearch) {
        pageSearch.classList.toggle("active");
        const inp = pageSearch.querySelector("input");
        if (inp) inp.focus();
        return;
      }

      // create an in-flow search bar under the navbar so all pages share the same UI
      createInFlowSearch();
    }
  });
}
