(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const guide = document.getElementById("portfolioGuide");
  const guideToggle = document.getElementById("guideToggle");
  const guideMessage = document.getElementById("guideMessage");
  const guideSection = document.getElementById("guideSection");
  const guideProgress = document.getElementById("guideProgress");

  document.documentElement.classList.add("page-loaded");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menuToggle.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });
    navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.innerHTML = '<i class="bi bi-list"></i>';
    }));
  }

  const sections = [
    ["home", "01 / HOME", "👋 Hi! Welcome to my portfolio. Explore my work, skills and experience — I’ll guide you along the way."],
    ["about", "02 / ABOUT", "A little about me: I’m a B.Tech AI & Data Science graduate with hands-on Python, Django and Flask experience."],
    ["toolkit", "03 / TOOLKIT", "Here’s my toolkit — Python, Django, Flask, Streamlit, Gemini API, OpenCV and the tools I use to build."],
    ["experience", "04 / EXPERIENCE", "I’ve completed three internships across Python full-stack development, AI/ML and web development."],
    ["projects", "05 / SELECTED WORK", "Take a look at RePlate, CareerAI, MediByte and SignSync. RePlate and CareerAI have live demos."],
    ["details", "06 / THE DETAILS", "Need the full overview? The resume section downloads my attached PDF directly."],
    ["education", "07 / EDUCATION", "My academic background includes a B.Tech in AI & Data Science and Higher Secondary education in Bio/Maths."],
    ["certifications", "08 / CERTIFICATIONS", "I’ve added six certifications covering Generative AI, machine learning, web development, AI tools, MongoDB and IIoT."],
    ["contact", "09 / CONTACT", "Thanks for exploring! Reach me through email, LinkedIn or GitHub — I’d be glad to connect."]
  ];
  const navAnchors = [...document.querySelectorAll(".nav-links a")];

  function setGuide(sectionId) {
    const index = sections.findIndex(item => item[0] === sectionId);
    if (index < 0) return;
    const [, label, message] = sections[index];
    if (guideMessage) {
      guideMessage.style.opacity = "0";
      window.setTimeout(() => {
        guideMessage.textContent = message;
        guideMessage.style.opacity = "1";
      }, 100);
    }
    if (guideSection) guideSection.textContent = label;
    if (guideProgress) guideProgress.style.width = String(((index + 1) / sections.length) * 100) + "%";
    navAnchors.forEach(link => {
      const active = link.getAttribute("href") === "#" + sectionId;
      link.classList.toggle("active", active);
    });
  }

  if (guideToggle && guide) {
    guideToggle.addEventListener("click", () => {
      const minimized = guide.classList.toggle("is-minimized");
      guideToggle.setAttribute("aria-expanded", String(!minimized));
      guideToggle.setAttribute("aria-label", minimized ? "Expand portfolio guide" : "Minimize portfolio guide");
      guideToggle.innerHTML = minimized ? '<i class="bi bi-chat-dots"></i>' : '<i class="bi bi-dash-lg"></i>';
    });
  }

  const revealTargets = document.querySelectorAll(
    ".section-heading,.about-grid,.skill-card,.timeline-item,.project-card,.resume-panel,.education-card,.cert-card,.contact-panel"
  );
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    if (element.matches(".skill-card,.project-card,.cert-card")) {
      element.style.transitionDelay = String((index % 4) * 75) + "ms";
    }
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(element => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setGuide(visible.target.dataset.section);
    }, { threshold: [0.25, 0.45, 0.65], rootMargin: "-12% 0px -30% 0px" });
    document.querySelectorAll("[data-section]").forEach(section => sectionObserver.observe(section));
  } else {
    revealTargets.forEach(element => element.classList.add("is-visible"));
  }

  const counters = document.querySelectorAll(".counter[data-count]");
  function animateCounter(counter) {
    const target = Number(counter.dataset.count);
    if (!Number.isFinite(target)) return;
    const start = performance.now();
    const duration = reducedMotion ? 1 : 900;
    const tick = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.7 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  if (!reducedMotion) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", event => {
        const selector = anchor.getAttribute("href");
        const destination = selector && document.querySelector(selector);
        if (!destination) return;
        event.preventDefault();
        destination.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", selector);
      });
    });
  }
})();