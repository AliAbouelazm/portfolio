document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll(".section"));
  const navLinks = Array.from(document.querySelectorAll(".tab-list a"));
  const currentYear = document.getElementById("current-year");
  const siteHeader = document.querySelector(".site-header");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const sectionMap = new Map(
    sections.map((section) => [section.id, section])
  );

  const setActiveSection = (id, updateHash = false) => {
    if (!id) return;

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (updateHash && window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
  };

  const headerOffset = () => (siteHeader?.offsetHeight ?? 0) + 12;

  const scrollToSection = (id) => {
    const target = sectionMap.get(id);
    if (!target) return;

    const top =
      window.scrollY + target.getBoundingClientRect().top - headerOffset();
    window.scrollTo({ top, behavior: "smooth" });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const id = link.getAttribute("href")?.replace("#", "");
      if (!id) return;
      scrollToSection(id);
      history.pushState(null, "", `#${id}`);
    });

    const hotkey = link.dataset.hotkey;
    if (hotkey) {
      link.setAttribute("title", `Press ${hotkey}`);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target;
        if (!(target instanceof HTMLElement)) return;

        if (entry.isIntersecting) {
          target.classList.add("is-visible");
          setActiveSection(target.id, true);
        } else {
          target.classList.remove("is-visible");
        }
      });
    },
    {
      root: null,
      threshold: 0.55,
    }
  );

  sections.forEach((section) => observer.observe(section));

  const goToSectionByOffset = (offset) => {
    if (!sections.length) return;
    const currentIndex = sections.findIndex((section) =>
      section.classList.contains("is-visible")
    );
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = Math.min(
      sections.length - 1,
      Math.max(0, safeIndex + offset)
    );
    const target = sections[nextIndex];
    if (target) {
      scrollToSection(target.id);
    }
  };

  document.addEventListener("keydown", (event) => {
    const tagName = document.activeElement?.tagName;
    if (tagName === "INPUT" || tagName === "TEXTAREA") {
      return;
    }

    const numberKey = Number.parseInt(event.key, 10);
    if (numberKey >= 1 && numberKey <= navLinks.length) {
      event.preventDefault();
      const targetId = navLinks[numberKey - 1]
        .getAttribute("href")
        ?.replace("#", "");
      if (targetId) {
        scrollToSection(targetId);
      }
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        goToSectionByOffset(-1);
        break;
      case "ArrowRight":
        event.preventDefault();
        goToSectionByOffset(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        window.scrollBy({
          top: -window.innerHeight * 0.25,
          behavior: "smooth",
        });
        break;
      case "ArrowDown":
        event.preventDefault();
        window.scrollBy({
          top: window.innerHeight * 0.25,
          behavior: "smooth",
        });
        break;
      default:
        break;
    }
  });

  if (window.location.hash) {
    const hashId = window.location.hash.replace("#", "");
    if (sectionMap.has(hashId)) {
      setTimeout(() => scrollToSection(hashId), 120);
    }
  } else if (sections[0]) {
    sections[0].classList.add("is-visible");
    setActiveSection(sections[0].id, true);
  }
});

