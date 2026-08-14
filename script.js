// interactive dot-grid background — subtle, glows & drifts toward cursor
(function(){
  const canvas = document.getElementById('dotGrid');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let dots = [];
  let mouse = { x: -9999, y: -9999 };
  const spacing = 42;
  const influence = 130;
  const maxShift = 6;

  function buildGrid(){
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    dots = [];
    for(let y = spacing / 2; y < h; y += spacing){
      for(let x = spacing / 2; x < w; x += spacing){
        dots.push({ baseX: x, baseY: y, x, y });
      }
    }
  }

  function frame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      const dx = mouse.x - d.baseX;
      const dy = mouse.y - d.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let targetX = d.baseX;
      let targetY = d.baseY;
      let glow = 0;

      if(dist < influence){
        glow = 1 - dist / influence;
        const angle = Math.atan2(dy, dx);
        targetX = d.baseX + Math.cos(angle) * glow * maxShift;
        targetY = d.baseY + Math.sin(angle) * glow * maxShift;
      }

      d.x += (targetX - d.x) * 0.12;
      d.y += (targetY - d.y) * 0.12;

      const alpha = 0.14 + glow * 0.55;
      const radius = 1.3 + glow * 1.8;

      if(glow > 0.05){
        ctx.shadowBlur = 10 * glow;
        ctx.shadowColor = 'rgba(244,13,48,0.8)';
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(244,13,48,${alpha})`;
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', buildGrid);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  buildGrid();
  requestAnimationFrame(frame);
})();

// typewriter effect for hero name
const heroName = document.getElementById('heroName');
if(heroName){
  const fullText = "ABHISHEK\nSHAJU";
  let i = 0;
  function typeChar(){
    if(i < fullText.length){
      const ch = fullText.charAt(i);
      heroName.innerHTML += (ch === '\n') ? '<br>' : ch;
      i++;
      setTimeout(typeChar, 70);
    }
  }
  setTimeout(typeChar, 500);
}

// ---------- hero terminal widget: whoami.py style typing loop ----------
(function(){
  const body = document.getElementById('termBody');
  if(!body) return;

  // edit this list to change what the terminal "types" — cmd is the
  // fake command, out is the response line printed under it
  const sequence = [
    { cmd: 'whoami',   out: 'Python Developer .py' },
    { cmd: 'build',    out: 'Building web applications' },
    { cmd: 'mindset',  out: 'Problem Solver' },
    { cmd: 'stack',    out: 'Python · Django · SQL' },
    { cmd: 'status',   out: 'Open to opportunities' }
  ];

  const TYPE_SPEED = 55;      // ms per character while "typing" a command
  const OUT_PAUSE = 350;      // pause before showing the output line
  const HOLD_AFTER_LINE = 900;// pause after a finished line before next command
  const MAX_VISIBLE_PAIRS = 4;// how many cmd/out pairs stay on screen before it clears
  const RESTART_PAUSE = 1400; // pause before the terminal clears & restarts

  let seqIndex = 0;
  let visiblePairs = 0;

  function makeLine(){
    const p = document.createElement('p');
    p.className = 'term-line';
    const prompt = document.createElement('span');
    prompt.className = 'term-prompt';
    prompt.textContent = '$';
    const cmd = document.createElement('span');
    cmd.className = 'term-cmd';
    const caret = document.createElement('span');
    caret.className = 'term-caret';
    p.appendChild(prompt);
    p.appendChild(cmd);
    p.appendChild(caret);
    body.appendChild(p);
    return { p, cmd, caret };
  }

  function typeCommand(cmdEl, caretEl, text, cb){
    let i = 0;
    (function step(){
      if(i <= text.length){
        cmdEl.textContent = ' ' + text.slice(0, i);
        i++;
        setTimeout(step, TYPE_SPEED);
      } else {
        caretEl.remove();
        setTimeout(cb, OUT_PAUSE);
      }
    })();
  }

  function printOutput(item, after){
    const out = document.createElement('span');
    out.className = 'term-out';
    out.textContent = item.out;
    body.appendChild(out);
    visiblePairs++;
    setTimeout(after, HOLD_AFTER_LINE);
  }

  function next(){
    if(visiblePairs >= MAX_VISIBLE_PAIRS){
      // clear and restart the loop
      setTimeout(() => {
        body.innerHTML = '';
        visiblePairs = 0;
        next();
      }, RESTART_PAUSE);
      return;
    }
    const item = sequence[seqIndex % sequence.length];
    seqIndex++;
    const { cmd, caret } = makeLine();
    typeCommand(cmd, caret, item.cmd, () => printOutput(item, next));
  }

  setTimeout(next, 900);
})();

// scroll-reveal animation for sections & cards
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// floating rocket: scroll to top / bottom
const rocket = document.getElementById('scrollRocket');
if(rocket){
  function updateRocket(){
    const nearTop = window.scrollY < 200;
    rocket.classList.toggle('point-down', nearTop);
    rocket.setAttribute('aria-label', nearTop ? 'Scroll to bottom' : 'Scroll to top');
  }
  rocket.addEventListener('click', () => {
    const nearTop = window.scrollY < 200;
    window.scrollTo({
      top: nearTop ? document.body.scrollHeight : 0,
      behavior: 'smooth'
    });
  });
  window.addEventListener('scroll', updateRocket);
  updateRocket();
}