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
  
  // Initialize charts
  initializeCharts();
}

async function fetchGitHubStats() {
  try {
    const response = await fetch('https://api.github.com/users/AliAbouelazm');
    if (response.ok) {
      const data = await response.json();
      // Calculate approximate commits (GitHub API doesn't provide this directly)
      // We'll use public repos as a proxy
      const commitsElement = document.getElementById('github-commits');
      if (commitsElement) {
        // Estimate: average 50-100 commits per repo
        const estimatedCommits = data.public_repos * 75;
        commitsElement.textContent = estimatedCommits.toLocaleString() + '+';
      }
    }
  } catch (error) {
    console.log('GitHub API fetch failed, using default values');
    const commitsElement = document.getElementById('github-commits');
    if (commitsElement) {
      commitsElement.textContent = '500+';
    }
  }
}

// Store chart instances
let chartInstances = {};

function initializeCharts() {
  // Chart.js default colors for dark theme
  Chart.defaults.color = '#b3b3b3';
  Chart.defaults.borderColor = '#292929';
  Chart.defaults.backgroundColor = 'rgba(230, 230, 230, 0.1)';

  // Productivity by Day Chart
  const productivityCtx = document.getElementById('productivity-chart');
  if (productivityCtx) {
    chartInstances.productivity = new Chart(productivityCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Coding Hours',
          data: [4, 5, 4, 5, 4, 2, 1],
          backgroundColor: [
            'rgba(74, 144, 226, 0.7)',
            'rgba(80, 200, 120, 0.7)',
            'rgba(255, 107, 107, 0.7)',
            'rgba(255, 165, 0, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(243, 156, 18, 0.7)',
            'rgba(231, 76, 60, 0.7)'
          ],
          borderColor: [
            '#4A90E2',
            '#50C878',
            '#FF6B6B',
            '#FFA500',
            '#9B59B6',
            '#F39C12',
            '#E74C3C'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#b3b3b3'
            },
            grid: {
              color: '#292929'
            }
          },
          x: {
            ticks: {
              color: '#b3b3b3'
            },
            grid: {
              color: '#292929'
            }
          }
        }
      }
    });
  }

  // Daily Routine Pie Chart
  const routineCtx = document.getElementById('routine-chart');
  if (routineCtx) {
    chartInstances.routine = new Chart(routineCtx, {
      type: 'doughnut',
      data: {
        labels: ['Sleep', 'Coding/Work', 'Studying', 'Food', 'Exercise', 'Social/Other'],
        datasets: [{
          data: [29, 20, 20, 8, 6, 17],
          backgroundColor: [
            'rgba(74, 144, 226, 0.8)',
            'rgba(80, 200, 120, 0.8)',
            'rgba(255, 107, 107, 0.8)',
            'rgba(255, 165, 0, 0.8)',
            'rgba(155, 89, 182, 0.8)',
            'rgba(243, 156, 18, 0.8)'
          ],
          borderColor: '#0b0b0b',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#b3b3b3',
              padding: 12,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const percentage = context.parsed || 0;
                const hours = (percentage * 24 / 100).toFixed(1);
                return label + ': ' + hours + ' hrs (' + percentage.toFixed(1) + '%)';
              }
            }
          }
        }
      }
    });
  }

  // Learning Progress Line Chart
  const learningCtx = document.getElementById('learning-chart');
  if (learningCtx) {
    // Calculate linear regression prediction for 2026
    // Data points: (2022, 0), (2023, 1), (2024, 8), (2025, 10)
    // Using linear regression: y = mx + b
    const x = [0, 1, 2, 3]; // Years from 2022
    const y = [0, 1, 8, 10]; // Actual values
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    // Predict for 2026 (x = 4)
    const predicted2026 = Math.round(slope * 4 + intercept);
    
    chartInstances.learning = new Chart(learningCtx, {
      type: 'line',
      data: {
        labels: ['2022', '2023', '2024', '2025', '2026'],
        datasets: [
          {
            label: 'Courses/Certifications',
            data: [0, 1, 8, 10, null], // Actual data
            borderColor: '#4A90E2',
            backgroundColor: 'rgba(74, 144, 226, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4A90E2',
            pointBorderColor: '#0b0b0b',
            pointBorderWidth: 2,
            pointRadius: 5,
            spanGaps: false
          },
          {
            label: 'Projected',
            data: [null, null, null, 10, predicted2026], // Projection from last point
            borderColor: '#666666',
            backgroundColor: 'rgba(102, 102, 102, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5], // Dashed line
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#666666',
            pointBorderColor: '#0b0b0b',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointStyle: 'circle',
            pointHoverBackgroundColor: '#666666',
            pointHoverBorderColor: '#0b0b0b'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#b3b3b3',
              padding: 12,
              font: {
                size: 11
              },
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                if (context.datasetIndex === 1) {
                  return label + ': ' + value + ' (projected)';
                }
                return label + ': ' + value;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#b3b3b3'
            },
            grid: {
              color: '#292929'
            }
          },
          x: {
            ticks: {
              color: '#b3b3b3'
            },
            grid: {
              color: '#292929'
            }
          }
        }
      }
    });
  }

  // Tech Stack Usage Chart
  const techstackCtx = document.getElementById('techstack-chart');
  if (techstackCtx) {
    chartInstances.techstack = new Chart(techstackCtx, {
      type: 'bar',
      data: {
        labels: ['Python', 'SQL', 'R', 'JavaScript', 'Java', 'C++'],
        datasets: [{
          label: 'Usage Frequency',
          data: [95, 80, 60, 50, 40, 30],
          backgroundColor: [
            'rgba(74, 144, 226, 0.7)',
            'rgba(80, 200, 120, 0.7)',
            'rgba(255, 107, 107, 0.7)',
            'rgba(255, 165, 0, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(243, 156, 18, 0.7)'
          ],
          borderColor: [
            '#4A90E2',
            '#50C878',
            '#FF6B6B',
            '#FFA500',
            '#9B59B6',
            '#F39C12'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed.x || 0;
                return label + ': ' + value + '%';
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: '#b3b3b3',
              callback: function(value) {
                return value + '%';
              }
            },
            grid: {
              color: '#292929'
            }
          },
          y: {
            ticks: {
              color: '#b3b3b3'
            },
            grid: {
              color: '#292929'
            }
          }
        }
      }
    });
  }
}

