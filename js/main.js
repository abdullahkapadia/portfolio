document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    if(typeof initConstellation === 'function') initConstellation();
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') { themeIcon.className = 'fa-solid fa-sun'; } 
    else { themeIcon.className = 'fa-solid fa-moon'; }
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- Active Menu ---
  const sections = document.querySelectorAll('section, footer, .projects-wrapper');
  const navItems = document.querySelectorAll('.menu-item');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - 200)) { current = section.getAttribute('id'); }
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (current && item.getAttribute('href').includes(current)) {
        item.classList.add('active');
      }
    });
  });

  // --- 1. Constellation (Canvas) ---
  const canvas = document.getElementById('constellation-canvas');
  let ctx, particles = [], mouse = { x: null, y: null, radius: 150 };
  
  if (canvas) {
    ctx = canvas.getContext('2d');
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  }

  class Particle {
    constructor(x, y, label, isCore, dpr) {
      this.x = x; this.y = y;
      this.baseX = x; this.baseY = y;
      this.size = (isCore ? 6 : 3) * dpr;
      this.label = label;
      this.isCore = isCore;
      this.density = (Math.random() * 30) + 1;
      this.dpr = dpr;
    }
    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? '#ffffff' : '#000000';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      
      if(this.isCore || (mouse.x && Math.abs(mouse.x - this.x) < 150*this.dpr && Math.abs(mouse.y - this.y) < 150*this.dpr)) {
        ctx.font = this.isCore ? `bold ${14 * this.dpr}px Space Grotesk` : `${12 * this.dpr}px Inter`;
        ctx.fillText(this.label, this.x + (12 * this.dpr), this.y + (4 * this.dpr));
      }
    }
    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDist = mouse.radius * this.dpr;
      let force = (maxDist - distance) / maxDist;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < maxDist) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) { this.x -= (this.x - this.baseX) / 10; }
        if (this.y !== this.baseY) { this.y -= (this.y - this.baseY) / 10; }
      }
    }
  }

  window.initConstellation = function() {
    if(!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    particles = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = dpr;
    
    // Define the skills
    const coreSkills = ["Python", "Dart", "C++", "JavaScript", "Rust"];
    const subSkills = [
      "Django", "Machine Learning", "Flask", "Flutter", "Supabase", "PHP", "Git",
      "TypeScript", "React", "Node.js", "Next.js", "NestJS", "HTML", "CSS"
    ];

    // Radius dynamically scales based on screen size (keeps nodes on screen)
    const minDim = Math.min(canvas.width, canvas.height);
    const coreRadius = minDim * 0.2;
    const subRadius = minDim * 0.4;

    // Distribute Core Skills in an inner circle
    coreSkills.forEach((skill, i) => {
      const angle = (i / coreSkills.length) * Math.PI * 2;
      const x = cx + Math.cos(angle) * coreRadius;
      const y = cy + Math.sin(angle) * coreRadius;
      particles.push(new Particle(x, y, skill, true, dpr));
    });

    // Distribute Sub Skills in an outer circle
    subSkills.forEach((skill, i) => {
      const angle = (i / subSkills.length) * Math.PI * 2 + 0.5; // slight offset
      // Add slight randomness to radius for a more natural "constellation" look
      const r = subRadius + (Math.random() * 40 * dpr - 20 * dpr);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      particles.push(new Particle(x, y, skill, false, dpr));
    });
  };

  function connect() {
    let opacityValue = 1;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const rgb = isDark ? '255,255,255' : '0,0,0';
    const dpr = window.devicePixelRatio || 1;
    
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
          + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
        
        let maxDist = (canvas.width/3) * (canvas.height/3);
        if (distance < maxDist) {
          opacityValue = 1 - (distance / maxDist);
          ctx.strokeStyle = `rgba(${rgb},${opacityValue})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateConstellation() {
    if(!canvas) return;
    requestAnimationFrame(animateConstellation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
  }
  
  if(canvas) {
    initConstellation();
    animateConstellation();
    window.addEventListener('resize', initConstellation);
  }

  const codeString = `
<span class="ide-comment"># Timeline Execution Script</span>
<span class="ide-keyword">def</span> <span class="ide-function">get_timeline</span>():
    <span class="ide-keyword">return</span> [
        {
            <span class="ide-string">"type"</span>: <span class="ide-string">"Experience"</span>,
            <span class="ide-string">"date"</span>: <span class="ide-string">"Jun 2024 – Aug 2024"</span>,
            <span class="ide-string">"role"</span>: <span class="ide-string">"Frontend Developer"</span>,
            <span class="ide-string">"company"</span>: <span class="ide-string">"CSRBOX"</span>,
            <span class="ide-string">"desc"</span>: <span class="ide-string">"Built responsive web interfaces and collaborated with dev teams."</span>
        },
        {
            <span class="ide-string">"type"</span>: <span class="ide-string">"Experience"</span>,
            <span class="ide-string">"date"</span>: <span class="ide-string">"Aug 2023"</span>,
            <span class="ide-string">"role"</span>: <span class="ide-string">"Python Developer"</span>,
            <span class="ide-string">"company"</span>: <span class="ide-string">"Saifee Cyber"</span>,
            <span class="ide-string">"desc"</span>: <span class="ide-string">"Developed Python-based solutions for software workflows."</span>
        },
        {
            <span class="ide-string">"type"</span>: <span class="ide-string">"Education"</span>,
            <span class="ide-string">"date"</span>: <span class="ide-string">"2025 – 2028"</span>,
            <span class="ide-string">"degree"</span>: <span class="ide-string">"B.Tech Information Technology"</span>,
            <span class="ide-string">"school"</span>: <span class="ide-string">"GCET"</span>,
            <span class="ide-string">"cgpa"</span>: <span class="ide-number">9.05</span>
        },
        {
            <span class="ide-string">"type"</span>: <span class="ide-string">"Education"</span>,
            <span class="ide-string">"date"</span>: <span class="ide-string">"2022 – 2025"</span>,
            <span class="ide-string">"degree"</span>: <span class="ide-string">"Diploma in Computer Eng."</span>,
            <span class="ide-string">"school"</span>: <span class="ide-string">"Govt Polytechnic"</span>,
            <span class="ide-string">"cgpa"</span>: <span class="ide-number">9.32</span>
        }
    ]

<span class="ide-keyword">print</span>(<span class="ide-function">get_timeline</span>())
`;

  const typingTarget = document.getElementById('typing-code');
  const lineNumbers = document.querySelector('.line-numbers');
  let hasTyped = false;

  const ideObserver = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting && !hasTyped && typingTarget) {
      hasTyped = true;
      
      let lines = codeString.trim().split('\n').length;
      for(let l=1; l<=lines; l++) { lineNumbers.innerHTML += `<div>${l}</div>`; }
      
      let htmlString = codeString.trim();
      let charIndex = 0;
      let isTag = false;
      let currentHTML = "";
      
      function typeChar() {
        if (charIndex < htmlString.length) {
          let char = htmlString.charAt(charIndex);
          if (char === '<') isTag = true;
          currentHTML += char;
          if (char === '>') isTag = false;
          
          charIndex++;
          
          if (!isTag) {
            typingTarget.innerHTML = currentHTML;
            setTimeout(typeChar, 5 + Math.random() * 15);
          } else {
            typeChar(); // Skip timeout for HTML tags
          }
        }
      }
      typeChar();
    }
  }, { threshold: 0.5 });
  
  const ideSection = document.getElementById('experience');
  if(ideSection) ideObserver.observe(ideSection);

  // --- 3. Projects: Canvas Honeycomb ---
  const hcCanvas = document.getElementById('honeycomb-canvas');
  if (hcCanvas) {
    const hcCtx = hcCanvas.getContext('2d');
    let hcMouse = { x: -1000, y: -1000 };
    
    hcCanvas.addEventListener('mousemove', (e) => {
      const rect = hcCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      hcMouse.x = (e.clientX - rect.left) * dpr;
      hcMouse.y = (e.clientY - rect.top) * dpr;
    });
    
    hcCanvas.addEventListener('mouseleave', () => {
      hcMouse.x = -1000; hcMouse.y = -1000;
    });

    // Support touch devices for hover effect
    hcCanvas.addEventListener('touchmove', (e) => {
      const rect = hcCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const touch = e.touches[0];
      hcMouse.x = (touch.clientX - rect.left) * dpr;
      hcMouse.y = (touch.clientY - rect.top) * dpr;
    }, {passive: true});

    const projectData = [
      { name: "MyGCET", stack: "Flutter • Supabase", url: "https://mygcetofficial53.github.io/mygcet/", q: 0, r: 0 }, // Center
      { name: "AI Salary", stack: "Python • ML", url: "https://github.com/abdullahkapadia/AI-Salary-Prediction", q: 0, r: -1 }, // Top-Left
      { name: "Text Analyzer", stack: "Python • Django", url: "https://github.com/abdullahkapadia/textutils", q: 1, r: -1 }, // Top-Right
      { name: "AlgoPro", stack: "Algorithms", url: "https://github.com/abdullahkapadia/-AlgoPro-Tracker", q: -1, r: 1 }, // Bottom-Left
      { name: "Password Mgr", stack: "Security", url: "https://github.com/abdullahkapadia/password-manger", q: 0, r: 1 }  // Bottom-Right
    ];

    let hexRadius = 80;
    let hexWidth = 0;
    let hexHeight = 0;
    
    function drawHexagon(ctx, x, y, r, isGlowing, isProject) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30); // Pointy top
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      if (isProject) {
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
      } else if (isGlowing) {
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1 * (window.devicePixelRatio || 1);
      } else {
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 1 * (window.devicePixelRatio || 1);
      }
      ctx.stroke();
    }

    function animateHoneycomb() {
      if (!hcCanvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = hcCanvas.parentElement.getBoundingClientRect();
      
      // Update canvas size if it changed
      if (hcCanvas.width !== rect.width * dpr || hcCanvas.height !== rect.height * dpr) {
        hcCanvas.width = rect.width * dpr;
        hcCanvas.height = rect.height * dpr;
      }
      
      // Responsive Hexagon Sizing
      const isMobile = hcCanvas.width < 600 * dpr;
      if (isMobile) {
        hexRadius = Math.min(hcCanvas.width, hcCanvas.height) / 5;
        if (hexRadius < 45*dpr) hexRadius = 45*dpr;
        if (hexRadius > 65*dpr) hexRadius = 65*dpr;
      } else {
        hexRadius = Math.min(hcCanvas.width, hcCanvas.height) / 8;
        if (hexRadius < 70*dpr) hexRadius = 70*dpr;
        if (hexRadius > 110*dpr) hexRadius = 110*dpr;
      }
      
      hexWidth = Math.sqrt(3) * hexRadius;
      hexHeight = 2 * hexRadius;

      const cx = hcCanvas.width / 2;
      const cy = hcCanvas.height / 2;
      
      hcCtx.clearRect(0, 0, hcCanvas.width, hcCanvas.height);
      
      const cols = Math.ceil(hcCanvas.width / hexWidth) + 2;
      const rows = Math.ceil(hcCanvas.height / (hexHeight * 0.75)) + 2;
      
      let hoveredProject = null;

      for (let r = -rows; r <= rows; r++) {
        // Offset q to prevent the grid from shearing into a parallelogram (Rhombus bounding)
        let r_offset = Math.floor(r / 2);
        for (let q = -cols - r_offset; q <= cols - r_offset; q++) {
          let x = cx + hexWidth * (q + r/2);
          let y = cy + hexHeight * 0.75 * r;
          
          let dist = Math.sqrt(Math.pow(hcMouse.x - x, 2) + Math.pow(hcMouse.y - y, 2));
          let isGlowing = dist < hexRadius * 1.5;
          let isProject = projectData.find(p => p.q === q && p.r === r);
          
          if (isProject && dist < hexRadius) {
            hoveredProject = isProject;
            hcCanvas.style.cursor = 'pointer';
          }
          
          drawHexagon(hcCtx, x, y, hexRadius, isGlowing, isProject);
          
          if (isProject) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            hcCtx.fillStyle = isDark ? '#ffffff' : '#000000';
            hcCtx.textAlign = 'center';
            hcCtx.textBaseline = 'middle';
            
            // Responsive Fonts
            const titleSize = isMobile ? 12 : 16;
            const stackSize = isMobile ? 9 : 11;
            const yOffsetTitle = isMobile ? 5 : 8;
            const yOffsetStack = isMobile ? 12 : 16;

            hcCtx.font = `bold ${titleSize * dpr}px Space Grotesk`;
            hcCtx.fillText(isProject.name, x, y - yOffsetTitle*dpr);
            
            hcCtx.font = `${stackSize * dpr}px Inter`;
            hcCtx.fillStyle = '#888888';
            hcCtx.fillText(isProject.stack, x, y + yOffsetStack*dpr);
          }
        }
      }
      
      if (!hoveredProject) {
        hcCanvas.style.cursor = 'crosshair';
      }
      
      requestAnimationFrame(animateHoneycomb);
    }
    
    animateHoneycomb();
    
    // Fix click events for mobile
    hcCanvas.addEventListener('click', (e) => {
      const rect = hcCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Handle both mouse click and touch
      let clientX = e.clientX;
      let clientY = e.clientY;
      if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
      
      const clickX = (clientX - rect.left) * dpr;
      const clickY = (clientY - rect.top) * dpr;

      const cx = hcCanvas.width / 2;
      const cy = hcCanvas.height / 2;
      
      for (let p of projectData) {
        let x = cx + hexWidth * (p.q + p.r/2);
        let y = cy + hexHeight * 0.75 * p.r;
        let dist = Math.sqrt(Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2));
        if (dist < hexRadius) {
          window.open(p.url, '_blank');
        }
      }
    });
  }
});
