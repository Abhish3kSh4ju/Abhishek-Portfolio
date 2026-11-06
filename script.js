(() => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const assistant = document.getElementById("avatarAssistant");
  const assistantToggle = document.getElementById("assistantToggle");
  const assistantClose = document.getElementById("assistantClose");
  const assistantMessage = document.getElementById("assistantMessage");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  let bubbleTimeout;
  function guide(message) {
    if (!assistant || !assistantMessage || assistant.classList.contains("is-minimized")) return;
    assistantMessage.textContent = message;
    assistant.classList.add("is-speaking");
    window.clearTimeout(bubbleTimeout);
    bubbleTimeout = window.setTimeout(() => assistant.classList.remove("is-speaking"), 2600);
  }

  if (assistantToggle && assistant && assistantClose) {
    assistantToggle.addEventListener("click", () => {
      const minimized = assistant.classList.toggle("is-minimized");
      assistantToggle.setAttribute("aria-expanded", String(!minimized));
      if (!minimized) guide("Hey again! Pick a section and I’ll help you explore Abhi’s work.");
    });
    assistantClose.addEventListener("click", () => {
      assistant.classList.add("is-minimized");
      assistantToggle.setAttribute("aria-expanded", "false");
    });
  }

  // The guide responds to interactions within this page only. No camera, microphone or
  // off-page monitoring is used; messages are triggered by navigation, focus and scroll.
  const guideMessages = {
    home: "Hi! I’m Abhi’s portfolio guide. Explore the projects, skills and experience below.",
    about: "Abhi is a B.Tech AI & Data Science graduate with hands-on Python and Django experience.",
    skills: "Here’s the toolkit from Abhi’s resume — Python, Django, Flask, Streamlit and more.",
    experience: "Abhi has completed three internships across Python full stack, AI/ML and web development.",
    projects: "Explore the four projects. RePlate and CareerAI have live demos you can open.",
    resume: "Want the details? Download Abhi’s resume as a PDF from this section.",
    contact: "Let’s connect — reach Abhi through email, LinkedIn or GitHub."
  };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
        const section = entry.target.dataset.section;
        if (guideMessages[section]) guide(guideMessages[section]);
      }
    });
  }, { threshold: [0.25, 0.45, 0.7] });

  document.querySelectorAll("[data-section]").forEach(section => sectionObserver.observe(section));

  document.addEventListener("pointerover", event => {
    const target = event.target.closest("[data-guide]");
    if (target && target.dataset.guide) guide(target.dataset.guide);
  });
  document.addEventListener("focusin", event => {
    const target = event.target.closest("[data-guide]");
    if (target && target.dataset.guide) guide(target.dataset.guide);
  });

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("a")) return;
      if (card.dataset.guide) guide(card.dataset.guide);
    });
    card.addEventListener("focusin", () => {
      if (card.dataset.guide) guide(card.dataset.guide);
    });
  });

  // Smooth in-page navigation, with native behavior retained for reduced motion.
  if (!reducedMotion) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", event => {
        const destination = document.querySelector(anchor.getAttribute("href"));
        if (!destination) return;
        event.preventDefault();
        destination.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", anchor.getAttribute("href"));
      });
    });
  }
})();

// Cursor-tracking eyes: the pupils follow the pointer continuously, with a gentle clamp.
(() => {
 const eyes = [...document.querySelectorAll(".eye-pupil")];
 const face = document.querySelector(".character-face");
 if (!eyes.length || !face) return;
 let frame = 0, point = {x: innerWidth/2, y: innerHeight/2};
 const update = () => {
   const rect = face.getBoundingClientRect();
   const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
   const dx = point.x-cx, dy = point.y-cy, angle = Math.atan2(dy,dx);
   const distance = Math.min(7, Math.hypot(dx,dy)/35);
   const x = Math.cos(angle)*distance, y = Math.sin(angle)*distance;
   eyes.forEach(eye => { eye.style.transform = `translate(${x}px,${y}px)`; });
   frame = 0;
 };
 document.addEventListener("pointermove", e => {
   point={x:e.clientX,y:e.clientY};
   if(!frame) frame=requestAnimationFrame(update);
 }, {passive:true});
 window.addEventListener("resize", () => { if(!frame) frame=requestAnimationFrame(update); });
})();

// Reveal sections and cards as they enter the viewport; stagger sibling cards.
(() => {
 const targets=document.querySelectorAll(".section-heading,.about-grid,.skill-card,.timeline-item,.project-card,.resume-panel,.education-row,.certifications,.contact-panel");
 if(!("IntersectionObserver" in window)){targets.forEach(el=>el.classList.add("is-visible"));return;}
 targets.forEach((el,i)=>{el.classList.add("reveal-on-scroll");if(el.matches(".skill-card,.project-card"))el.style.transitionDelay=`${(i%4)*90}ms`;});
 const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add("is-visible");reveal.unobserve(entry.target);}
 }),{threshold:.12,rootMargin:"0px 0px -45px 0px"});
 targets.forEach(el=>reveal.observe(el));
})();
