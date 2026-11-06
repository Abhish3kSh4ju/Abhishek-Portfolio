(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

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

  const navAnchors = [...document.querySelectorAll(".nav-links a")];
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
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { threshold: 0.35, rootMargin: "-12% 0px -30% 0px" });
    document.querySelectorAll("main [data-section]").forEach(section => sectionObserver.observe(section));
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
      counter.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
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
