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

  // Experience & Leadership
  initializeExperience();

});


// Experience & Leadership
function initializeExperience() {
  const items = [
    {
      company: 'Cloudflare',
      role: 'AI Discoverability & Optimization Intern',
      date: 'May 2026 - Aug 2026',
      description: [
        'Working on the AEO (AI Engine Optimization) team focused on how large language models index, retrieve, and surface web content at scale.',
        'Building technical frameworks to improve AI-driven content discoverability across Cloudflare\'s global network.'
      ]
    },
    {
      company: 'Texas A&M AgriLife',
      role: 'Machine Learning Researcher',
      date: 'Mar 2026 - Present',
      description: [
        'Building PyTorch-based predictive models on 50GB+ of livestock biosensor data to forecast animal health indicators across 3+ active research deployments.',
        'Architecting scalable ML pipelines on AWS (S3, Athena) to ingest and process raw biological data streams, cutting preprocessing time by 35%.',
        'Implementing automated feature engineering to extract health signals from noisy multi-sensor inputs, improving model training throughput and prediction reliability.'
      ]
    },
    {
      company: 'TCG Digital Solutions',
      role: 'Data Science Intern',
      date: 'May 2025 - Aug 2025',
      description: [
        'Architected an end-to-end CV pipeline using Gemini Pro and OpenCV to automate soccer highlight extraction, hitting 95% precision across 100+ match hours and reducing manual processing by 80%.',
        'Developed and tuned XGBoost and CatBoost gradient-boosting models on 1M+ rows of player tracking data, using SHAP values to surface tactical insights to downstream athletic analysis teams.',
        'Optimized real-time video inference via multi-threaded Python processing, cutting event extraction latency and enabling near-zero delay delivery of match-critical clips.'
      ]
    },
    {
      company: 'Texas A&M University',
      role: 'Undergraduate Teaching Assistant',
      date: 'Aug 2025 - Dec 2025',
      description: [
        'Mentored 100+ first-year engineering students across 15 weekly lab sessions in Python-based problem-solving, data structures, and algorithmic thinking.',
        'Facilitated collaborative debugging and technical troubleshooting for complex programming assignments.'
      ]
    },
    {
      company: 'Lovable.dev | TAMU Datathon',
      role: 'Campus Ambassador | Challenges Organizer',
      date: 'Jan 2026 - Present',
      description: [
        'Hosted campus-wide AI platform workshops for 200+ engineering students as Lovable Campus Ambassador.',
        'Directed ML problem set creation for 500+ competing students at TAMU Datathon using Python, SQL, and scikit-learn.'
      ]
    }
  ];

  const listContainer = document.getElementById('experience-list');
  const descContainer = document.getElementById('experience-description');
  const arrowUp = document.getElementById('arrow-up');
  const arrowDown = document.getElementById('arrow-down');
  
  if (!listContainer || !descContainer) return;

  let currentIndex = 0;

  // Create list items
  items.forEach((item, index) => {
    const listItem = document.createElement('div');
    listItem.className = 'experience-item';
    listItem.dataset.index = index;
    
    const company = document.createElement('h3');
    company.textContent = item.company;
    
    const date = document.createElement('p');
    date.className = 'experience-date';
    date.textContent = item.date;
    
    listItem.appendChild(company);
    listItem.appendChild(date);
    
    if (index === 0) {
      listItem.classList.add('active');
    } else {
      listItem.classList.add('blurred');
    }
    
    listContainer.appendChild(listItem);
  });


  // Update display
  function updateDisplay() {
    // Update list items
    document.querySelectorAll('.experience-item').forEach((item, index) => {
      if (index === currentIndex) {
        item.classList.remove('blurred');
        item.classList.add('active');
      } else {
        item.classList.remove('active');
        item.classList.add('blurred');
      }
    });

    // Fade out description
    const descContainer = document.getElementById('experience-description');
    descContainer.classList.add('fade-out');

    // Update description after fade out
    setTimeout(() => {
      const currentItem = items[currentIndex];
      document.getElementById('desc-title').textContent = currentItem.role;
      
      const descList = document.getElementById('desc-content');
      descList.innerHTML = '';
      currentItem.description.forEach(desc => {
        if (desc.trim() !== '') {
          const li = document.createElement('li');
          li.textContent = desc;
          descList.appendChild(li);
        } else {
          const li = document.createElement('li');
          li.style.visibility = 'hidden';
          li.textContent = 'placeholder';
          descList.appendChild(li);
        }
      });

      // Fade in description
      descContainer.classList.remove('fade-out');
    }, 200);

    // Update arrow states
    arrowUp.disabled = currentIndex === 0;
    arrowDown.disabled = currentIndex === items.length - 1;
  }

  // Navigation
  arrowUp.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateDisplay();
    }
  });

  arrowDown.addEventListener('click', () => {
    if (currentIndex < items.length - 1) {
      currentIndex++;
      updateDisplay();
    }
  });

  // Initialize
  updateDisplay();
}

// Life Stats Dashboard Functions
function initializeLifeStats() {
  // Fetch GitHub stats
  fetchGitHubStats();
  
  // Initialize charts
  initializeCharts();
}

async function fetchGitHubStats() {
  // Set to 200+ as requested
  const commitsElement = document.getElementById('github-commits');
  if (commitsElement) {
    commitsElement.textContent = '200+';
  }
}

// Store chart instances
let chartInstances = {};

function initializeCharts() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  Chart.defaults.color = '#b3b3b3';
  Chart.defaults.borderColor = '#292929';
  Chart.defaults.backgroundColor = 'rgba(230, 230, 230, 0.1)';

  // Typing Rhythm Chart
  const typingRhythmCtx = document.getElementById('typing-rhythm-chart');
  if (typingRhythmCtx) {
    fetch('typing_stats.json')
      .then(response => response.json())
      .then(data => {
        const wpmData = data.wpm_over_time || [];
        // Limit the number of points rendered to speed up load/render
        const MAX_POINTS = 200;
        const recentData = wpmData.slice(-MAX_POINTS);
        const labels = recentData.map(item => {
          const date = new Date(item.timestamp);
          return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        });
        const wpmValues = recentData.map(item => item.wpm);
        const avgWPM = data.summary?.avg_wpm || (wpmValues.length > 0 ? wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length : 0);
        const medianWPM = wpmValues.length > 0 ? [...wpmValues].sort((a, b) => a - b)[Math.floor(wpmValues.length / 2)] : 0;
        const mean = avgWPM;
        const variance = wpmValues.length > 0 ? wpmValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpmValues.length : 0;
        const stdDev = Math.sqrt(variance);
        const avgLine = new Array(wpmValues.length).fill(avgWPM);
        const medianLine = new Array(wpmValues.length).fill(medianWPM);
        const upperBand = new Array(wpmValues.length).fill(mean + stdDev);
        const lowerBand = new Array(wpmValues.length).fill(mean - stdDev);
        
        const ctx = typingRhythmCtx.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#4A90E2');
        gradient.addColorStop(0.5, '#50C878');
        gradient.addColorStop(1, '#4A90E2');
        const fillGradient = ctx.createLinearGradient(0, 0, 0, 400);
        fillGradient.addColorStop(0, 'rgba(74, 144, 226, 0.15)');
        fillGradient.addColorStop(0.5, 'rgba(80, 200, 120, 0.15)');
        fillGradient.addColorStop(1, 'rgba(74, 144, 226, 0.15)');
        const pointColors = wpmValues.map(wpm => {
          if (wpm < avgWPM - stdDev) return '#4A90E2';
          if (wpm < avgWPM) return '#50C878';
          if (wpm < avgWPM + stdDev) return '#50C878';
          return '#4A90E2';
        });
        
        chartInstances.typingRhythm = new Chart(typingRhythmCtx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'WPM Over Time',
                data: wpmValues,
                borderColor: gradient,
                backgroundColor: fillGradient,
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: pointColors,
                pointBorderColor: '#0b0b0b',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 6,
                order: 3
              },
              {
                label: 'Mean WPM',
                data: avgLine,
                borderColor: '#FF6B6B',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
                order: 2
              },
              {
                label: 'Median WPM',
                data: medianLine,
                borderColor: '#FFA500',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [3, 3],
                fill: false,
                pointRadius: 0,
                order: 1
              },
              {
                label: '±1 Std Dev',
                data: upperBand,
                borderColor: 'rgba(155, 89, 182, 0.4)',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                borderWidth: 1,
                borderDash: [2, 2],
                fill: '+1',
                pointRadius: 0,
                order: 0
              },
              {
                label: 'Lower Band',
                data: lowerBand,
                borderColor: 'rgba(155, 89, 182, 0.4)',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                borderWidth: 1,
                borderDash: [2, 2],
                fill: false,
                pointRadius: 0,
                order: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            interaction: {
              intersect: false,
              mode: 'nearest'
            },
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  color: '#b3b3b3',
                  padding: 6,
                  font: { size: 11 },
                  usePointStyle: true,
                  filter: function(item) { return item.text !== 'Lower Band'; }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    if (label === 'WPM Over Time') return 'WPM: ' + value.toFixed(1);
                    if (label === 'Mean WPM') return 'Mean: ' + value.toFixed(1) + ' WPM';
                    if (label === 'Median WPM') return 'Median: ' + value.toFixed(1) + ' WPM';
                    if (label === '±1 Std Dev') return 'Upper Bound: ' + value.toFixed(1) + ' WPM';
                    return label + ': ' + value.toFixed(1);
                  },
                  footer: function(tooltipItems) {
                    const wpmItem = tooltipItems.find(item => item.datasetIndex === 0);
                    if (wpmItem && stdDev > 0) {
                      const wpm = wpmItem.parsed.y;
                      const zScore = ((wpm - avgWPM) / stdDev).toFixed(2);
                      return 'Z-score: ' + zScore + 'σ';
                    }
                    return '';
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { 
                  color: '#b3b3b3', 
                  font: { size: 11 },
                  maxTicksLimit: 5
                },
                grid: { color: '#292929' }
              },
              x: {
                ticks: { 
                  color: '#b3b3b3', 
                  font: { size: 11 },
                  maxRotation: 45, 
                  minRotation: 45,
                  maxTicksLimit: 8
                },
                grid: { color: '#292929' }
              }
            }
          }
        });
      })
      .catch(error => {
        console.error('Error loading typing stats:', error);
      });
  }

  // Tech Stack Usage Chart
  const techstackCtx = document.getElementById('techstack-chart');
  if (techstackCtx) {
    chartInstances.techstack = new Chart(techstackCtx, {
      type: 'bar',
      data: {
        labels: ['Python', 'SQL', 'TypeScript', 'R', 'C++', 'JavaScript'],
        datasets: [{
          label: 'Usage Frequency',
          data: [98, 82, 65, 55, 45, 60],
          backgroundColor: [
            'rgba(74, 144, 226, 0.7)',
            'rgba(80, 200, 120, 0.7)',
            'rgba(255, 107, 107, 0.7)',
            'rgba(255, 165, 0, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(0, 206, 209, 0.7)'
          ],
          borderColor: [
            '#4A90E2',
            '#50C878',
            '#FF6B6B',
            '#FFA500',
            '#9B59B6',
            '#00CED1'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.2,
        indexAxis: 'y',
        interaction: {
          intersect: true,
          mode: 'index'
        },
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
              font: { size: 11 },
              callback: function(value) { return value + '%'; }
            },
            grid: { color: '#292929' }
          },
          y: {
            ticks: { color: '#b3b3b3', font: { size: 11 } },
            grid: { color: '#292929' }
          }
        }
      }
    });
  }

}

