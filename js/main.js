// Main JavaScript - Interactions & Rendering
let currentFilter = 'all';
let projectsMeta = null; // cached zh.json projects metadata

document.addEventListener('DOMContentLoaded', async () => {
  await I18n.init();
  // Cache zh.json project metadata for structural fields (tech, year, images, featured, category, links)
  await cacheProjectsMeta();
  renderSkills();
  renderFilters();
  renderWorks();
  initScrollReveal();
  initNavHighlight();
  initLangToggle();
  initHamburgerMenu();
  initWorkCardSaveScroll();
  initParallax();
  restoreScrollPosition();
});

function restoreScrollPosition() {
  var savedY = sessionStorage.getItem('worksScrollY');
  if (savedY !== null) {
    var y = parseInt(savedY);
    sessionStorage.removeItem('worksScrollY');
    // Remove hash to prevent browser auto-scrolling to anchor
    if (location.hash) {
      history.replaceState(null, '', location.pathname);
    }
    // Disable smooth scroll, restore position after layout
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    requestAnimationFrame(function() {
      window.scrollTo(0, y);
      setTimeout(function() {
        window.scrollTo(0, y);
        document.documentElement.style.scrollBehavior = '';
      }, 200);
    });
  }
}

// Save scroll position when clicking a project card
function initWorkCardSaveScroll() {
  document.addEventListener('click', function(e) {
    var card = e.target.closest('.work-card');
    if (card) {
      sessionStorage.setItem('worksScrollY', window.scrollY);
    }
  });
}

async function cacheProjectsMeta() {
  const response = await fetch(`${I18n.basePath}i18n/zh.json`);
  const zhData = await response.json();
  projectsMeta = zhData.projects;
}

// ===== Parallax (desktop only) =====
function initParallax() {
  // Skip on mobile/tablet to prevent scroll jank
  if (window.innerWidth <= 768) return;

  var portrait = document.querySelector('.hero-portrait');
  var hero = document.querySelector('.hero');
  if (!portrait || !hero) return;

  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    var heroHeight = hero.offsetHeight;
    if (scrollY < heroHeight) {
      var rate = scrollY * 0.3;
      portrait.style.transform = 'translateY(' + rate + 'px)';
    }
  }, { passive: true });
}

function initLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    await I18n.toggle();
    renderSkills();
    renderFilters();
    renderWorks();
  });
}

function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  const categories = I18n.get('skills.categories');
  if (!categories || typeof categories === 'string') return;

  grid.innerHTML = Object.values(categories).map(cat => `
    <div class="skill-category reveal">
      <h3>${cat.name}</h3>
      <div class="skill-tags">
        ${cat.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
      </div>
    </div>
  `).join('');

  initScrollReveal();
}

function renderFilters() {
  const bar = document.getElementById('filterBar');
  if (!bar) return;
  const filters = I18n.get('works.filters');
  if (!filters || typeof filters === 'string') return;

  bar.innerHTML = Object.entries(filters).map(([key, label]) => `
    <button class="filter-btn${key === currentFilter ? ' active' : ''}" data-filter="${key}">${label}</button>
  `).join('');

  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderWorks();
    });
  });
}

function renderWorks() {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;
  const projects = I18n.data.projects;
  if (!projects || !projectsMeta) return;

  const entries = Object.entries(projects).filter(([id, proj]) => {
    if (currentFilter === 'all') return true;
    const meta = projectsMeta[id] || proj;
    return meta.category === currentFilter;
  });

  grid.innerHTML = entries.map(([id, proj]) => {
    const meta = projectsMeta[id] || {};
    const tech = meta.tech || proj.tech || [];
    const year = meta.year || proj.year || '';
    const images = meta.images || proj.images || [];
    const featured = meta.featured || proj.featured || false;
    const name = proj.name || meta.name || '';
    const short = proj.short || meta.short || '';

    return `
      <a class="work-card reveal" href="projects/${id}.html">
        ${featured ? '<span class="work-card-featured">Featured</span>' : ''}
        <div class="work-card-image">
          ${images.length > 0
            ? `<img src="${images[0].startsWith('http') ? images[0] : 'assets/images/' + images[0]}" loading="lazy" alt="${name}">`
            : `<span>${name}</span>`}
        </div>
        <div class="work-card-body">
          <h3>${name} <span>${year}</span></h3>
          <p>${short}</p>
          <div class="work-card-tags">
            ${tech.map(t => `<span class="work-card-tag">${t}</span>`).join('')}
          </div>
        </div>
      </a>
    `;
  }).join('');

  initScrollReveal();
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    observer.observe(el);
  });
}

function initNavHighlight() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

function initHamburgerMenu() {
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}
