// Ensure page starts at top
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

// Also scroll to top on page load
if (document.readyState === "loading") {
  window.scrollTo(0, 0);
} else {
  window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  // Ensure page is at top
  window.scrollTo(0, 0);
  
  // Cover page typewriter and slide-up functionality
  const coverPage = document.getElementById("cover-page");
  const coverName = document.getElementById("cover-name");
  const name = "ALI ABOUELAZM";
  
  if (coverPage && coverName) {
    let charIndex = 0;
    const typeWriter = () => {
      if (charIndex < name.length) {
        coverName.textContent = name.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeWriter, 100);
      }
    };
    
    // Start typewriter animation
    typeWriter();
    
    // Function to hide cover page and scroll to About section
    const hideCover = () => {
      coverPage.classList.add("hidden");
      setTimeout(() => {
        coverPage.style.display = "none";
        // Scroll to About section
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          const headerOffset = siteHeader?.offsetHeight ?? 0;
          const top = aboutSection.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 800);
    };
    
    // Click anywhere on cover to hide
    coverPage.addEventListener("click", hideCover);
    
    // Also allow clicking the arrow container specifically
    const arrowContainer = document.querySelector(".cover-arrow-container");
    if (arrowContainer) {
      arrowContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        hideCover();
      });
    }
  }
  
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
      threshold: 0.2,
      rootMargin: '-100px 0px -100px 0px',
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

  // Check initial visibility for all sections
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (isInViewport) {
      section.classList.add("is-visible");
      setActiveSection(section.id, false);
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
    // If cover page is not visible, scroll to About section
    const coverPage = document.getElementById("cover-page");
    if (!coverPage || coverPage.classList.contains("hidden")) {
      setTimeout(() => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          const headerOffset = siteHeader?.offsetHeight ?? 0;
          const top = aboutSection.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  }

  // Life Stats Dashboard
  initializeLifeStats();
});

// Life Stats Dashboard Functions
function initializeLifeStats() {
  // Fetch GitHub stats
  fetchGitHubStats();
  
  // Charts removed - will be reimplemented
}

async function fetchGitHubStats() {
  // Set to 200+ as requested
  const commitsElement = document.getElementById('github-commits');
  if (commitsElement) {
    commitsElement.textContent = '200+';
  }
}

// Charts removed - will be reimplemented based on user specifications

