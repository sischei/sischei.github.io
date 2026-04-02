document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    const setMenuState = (open) => {
      navLinks.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    };

    navToggle.addEventListener("click", () => {
      setMenuState(!navLinks.classList.contains("open"));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });

    document.addEventListener("click", (event) => {
      if (window.innerWidth > 768) {
        return;
      }

      if (!event.target.closest(".navbar")) {
        setMenuState(false);
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
      if (link.classList.contains("active")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  const searchInput = document.querySelector("[data-pub-search]");
  const sectionFilter = document.querySelector("[data-pub-section-filter]");
  const resultLabel = document.querySelector("[data-pub-results]");
  const emptyState = document.querySelector("[data-pub-empty]");
  const publicationSections = Array.from(document.querySelectorAll("[data-pub-section]"));

  if (!searchInput || publicationSections.length === 0) {
    return;
  }

  const updateResults = () => {
    const query = searchInput.value.trim().toLowerCase();
    const scope = sectionFilter ? sectionFilter.value : "all";
    let visibleItems = 0;

    publicationSections.forEach((section) => {
      let visibleInSection = 0;
      const inScope = scope === "all" || section.dataset.pubSection === scope;

      section.querySelectorAll(".pub-item").forEach((item) => {
        const haystack = item.textContent.toLowerCase().replace(/\s+/g, " ");
        const matches = (!query || haystack.includes(query)) && inScope;
        item.hidden = !matches;

        if (matches) {
          visibleItems += 1;
          visibleInSection += 1;
        }
      });

      section.hidden = visibleInSection === 0;
    });

    if (resultLabel) {
      const suffix = visibleItems === 1 ? "" : "s";
      resultLabel.textContent = `${visibleItems} publication${suffix} shown`;
    }

    if (emptyState) {
      emptyState.hidden = visibleItems !== 0;
    }
  };

  searchInput.addEventListener("input", updateResults);
  if (sectionFilter) {
    sectionFilter.addEventListener("change", updateResults);
  }
  updateResults();
});
