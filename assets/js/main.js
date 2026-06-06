
// =====================================================
// ResinLux Studio — Premium JavaScript (v2)
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------
  // 1. Dark/Light Theme Toggle
  // --------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme  = localStorage.getItem('rl-theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    if (themeToggle) {
      themeToggle.textContent   = theme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
      localStorage.setItem('rl-theme', next);
      applyTheme(next);
    });
  }

  // --------------------------------------------------
  // 2. Active Nav Link Highlight
  // --------------------------------------------------
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.rl-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --------------------------------------------------
  // 3. Custom Mobile Drawer — replaces Bootstrap collapse
  //    No "top-up" effect, slides in from right with blur
  // --------------------------------------------------
  const navToggler    = document.querySelector('.rl-toggler');
  const navDrawer     = document.getElementById('rlNav');
  const navOverlay    = document.createElement('div');
  navOverlay.className = 'rl-nav-overlay';
  document.body.appendChild(navOverlay);

  function openDrawer() {
    navDrawer?.classList.add('rl-drawer-open');
    navOverlay.classList.add('rl-overlay-active');
    document.body.style.overflow = 'hidden';
    navToggler?.setAttribute('aria-expanded', 'true');
    if (navToggler) navToggler.innerHTML = '<i class="bi bi-x" style="color:var(--rl-text);font-size:24px;"></i>';
  }

  function closeDrawer() {
    navDrawer?.classList.remove('rl-drawer-open');
    navOverlay.classList.remove('rl-overlay-active');
    document.body.style.overflow = '';
    navToggler?.setAttribute('aria-expanded', 'false');
    if (navToggler) navToggler.innerHTML = '<i class="bi bi-list" style="color:var(--rl-text);font-size:22px;"></i>';
  }

  if (navToggler && navDrawer) {
    // Prevent Bootstrap collapse; we handle it ourselves
    navToggler.removeAttribute('data-bs-toggle');
    navToggler.removeAttribute('data-bs-target');

    navToggler.addEventListener('click', () => {
      const isOpen = navDrawer.classList.contains('rl-drawer-open');
      isOpen ? closeDrawer() : openDrawer();
    });

    navOverlay.addEventListener('click', closeDrawer);

    navDrawer.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (event) => {
        if (window.innerWidth >= 992) return;
        event.preventDefault();
        event.stopPropagation();
        const dropdown = toggle.closest('.dropdown');
        if (!dropdown) return;
        dropdown.classList.toggle('rl-mobile-dropdown-open');
      });
    });

    // Close on nav link click (mobile)
    navDrawer.querySelectorAll('.rl-nav-link:not(.dropdown-toggle), .rl-dropdown-item, .rl-login-btn').forEach(el => {
      el.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          const href = el.getAttribute('href');
          if (href && href !== '#' && !href.startsWith('#')) {
            // Close the drawer instantly without transitions on page navigation
            // to avoid rendering animations while the browser is unloading/loading pages
            navDrawer.style.transition = 'none';
            navOverlay.style.transition = 'none';
            closeDrawer();
            setTimeout(() => {
              navDrawer.style.transition = '';
              navOverlay.style.transition = '';
            }, 50);
          } else {
            closeDrawer();
          }
        }
      });
    });

    // Re-close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) closeDrawer();
    });
  }

  // --------------------------------------------------
  // 4. Floating Glow Orb Ambient Background
  //    Only on desktop — orb animations cause GPU jank on mobile
  // --------------------------------------------------
  if (!matchMedia('(pointer: coarse)').matches) {
    const orbContainer = document.createElement('div');
    orbContainer.className = 'rl-orb-container';
    orbContainer.innerHTML = `
      <div class="rl-orb rl-orb-1"></div>
      <div class="rl-orb rl-orb-2"></div>
      <div class="rl-orb rl-orb-3"></div>
    `;
    document.body.insertBefore(orbContainer, document.body.firstChild);
  }

  // --------------------------------------------------
  // 5. Click Ripple Effect
  // --------------------------------------------------
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'rl-ripple';
    ripple.style.left = `${e.pageX}px`;
    ripple.style.top  = `${e.pageY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  // --------------------------------------------------
  // 6. Cursor Spotlight (pointer devices only)
  // --------------------------------------------------
  if (!matchMedia('(pointer: coarse)').matches) {
    const spotlight = document.createElement('div');
    spotlight.className = 'rl-spotlight';
    document.body.appendChild(spotlight);

    let mouseX = 0, mouseY = 0, spotX = 0, spotY = 0;
    const speed = 0.08;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    (function trackSpotlight() {
      spotX += (mouseX - spotX) * speed;
      spotY += (mouseY - spotY) * speed;
      // Use GPU-accelerated translate3d to avoid layout reflows on mouse move
      spotlight.style.transform = `translate3d(calc(${spotX}px - 50%), calc(${spotY}px - 50%), 0)`;
      requestAnimationFrame(trackSpotlight);
    })();
  }

  // --------------------------------------------------
  // 7. Scroll-Reveal — Professional Entrance Animations
  // --------------------------------------------------
  const revealEls = document.querySelectorAll(
    '.rl-card, .rl-stat, .rl-step, .rl-service-item, .rl-price-card, ' +
    '.rl-section-title, .rl-split > *, .rl-porthole, .rl-finish-badge, ' +
    '.rl-cta-panel, .rl-footer-brand, .rl-flow-lab'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add rl-revealing first to enable will-change before animation
        entry.target.classList.add('rl-revealing');
        // Defer the actual reveal by one rAF so will-change layer is ready
        requestAnimationFrame(() => {
          entry.target.classList.add('rl-revealed');
        });
        // Remove will-change after animation completes to free GPU memory
        entry.target.addEventListener('transitionend', () => {
          entry.target.classList.remove('rl-revealing');
        }, { once: true });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach((el, i) => {
    el.classList.add('rl-reveal');
    // Stagger children in grids
    const parent = el.parentElement;
    if (parent) {
      const siblings = [...parent.children].filter(c => c.classList.contains(el.classList[0]));
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = `${idx * 90}ms`;
    }
    revealObserver.observe(el);
  });

  // --------------------------------------------------
  // 8. Parallax Hero Depth on Scroll — rAF throttled
  // --------------------------------------------------
  const hero = document.querySelector('.rl-hero');
  const heroInner = document.querySelector('.rl-hero-inner');
  if (hero && heroInner) {
    let heroRafPending = false;
    let lastHeroScroll = 0;

    window.addEventListener('scroll', () => {
      lastHeroScroll = window.scrollY;
      if (!heroRafPending) {
        heroRafPending = true;
        requestAnimationFrame(() => {
          const y = lastHeroScroll;
          // Only apply parallax when hero is in view
          if (y < window.innerHeight * 1.5) {
            heroInner.style.transform = `translateY(${y * 0.15}px)`;
            heroInner.style.opacity   = `${Math.max(0, 1 - y / 500)}`;
          }
          heroRafPending = false;
        });
      }
    }, { passive: true });
  }

  // --------------------------------------------------
  // 9. Smooth Scroll-to-Top Button
  // --------------------------------------------------
  const topBtn = document.createElement('button');
  topBtn.className  = 'rl-top-btn';
  topBtn.innerHTML  = '<i class="bi bi-arrow-up"></i>';
  topBtn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(topBtn);

  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('rl-top-btn-visible', window.scrollY > 350);
  }, { passive: true });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --------------------------------------------------
  // 10. Navbar Shrink on Scroll
  // --------------------------------------------------
  const navbar = document.querySelector('.rl-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('rl-navbar-scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // --------------------------------------------------
  // 11. Animated Counter (Stats Strip)
  // --------------------------------------------------
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el       = entry.target;
          const target   = parseInt(el.dataset.count, 10);
          const suffix   = el.dataset.suffix || '';
          const duration = 1800;
          const start    = performance.now();

          (function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          })(performance.now());

          cObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => cObserver.observe(el));
  }

  // --------------------------------------------------
  // 12. Gallery Filter Tabs
  // --------------------------------------------------
  const filterBtns  = document.querySelectorAll('.rl-filter-btn');
  const galleryItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length && galleryItems.length) {
    const balanceGalleryGrid = () => {
      const masonry = document.getElementById('gallery-masonry');
      if (!masonry) return;

      const visibleItems = [...masonry.querySelectorAll('.rl-masonry-item')]
        .filter(item => item.style.display !== 'none');

      masonry.querySelectorAll('.rl-masonry-item').forEach(item => {
        item.classList.remove('rl-center-last');
      });

      const columns = window.innerWidth > 1024 ? 3 : (window.innerWidth > 576 ? 2 : 1);
      const hasSingleLastCard = columns > 1 && visibleItems.length > columns && visibleItems.length % columns === 1;

      if (hasSingleLastCard) {
        visibleItems[visibleItems.length - 1].classList.add('rl-center-last');
      }
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          const show = cat === 'all' || item.dataset.category === cat;
          item.style.opacity   = show ? '' : '0';
          item.style.display   = show ? '' : 'none';
        });
        balanceGalleryGrid();
      });
    });
    balanceGalleryGrid();
    window.addEventListener('resize', balanceGalleryGrid);
  }

  // --------------------------------------------------
  // 13. Flow Lab Visualizer (index.html)
  // --------------------------------------------------
  const timberL       = document.getElementById('rl-timber-l');
  const timberR       = document.getElementById('rl-timber-r');
  const resinRiver    = document.getElementById('rl-resin-river');
  const shimmerOverlay = document.getElementById('rl-shimmer-overlay');
  const flakesOverlay  = document.getElementById('rl-flakes-overlay');
  const specReadout    = document.getElementById('rl-spec-readout');

  if (timberL && resinRiver) {
    let selectedTimber = 'Rustic Walnut';
    let selectedResin  = 'Oceanic Teal';
    let selectedSparkle = 'No Shimmer';

    const updateReadout = () => {
      if (specReadout) specReadout.textContent = `${selectedTimber} + ${selectedResin} (${selectedSparkle})`;
    };

    document.querySelectorAll('[data-timber]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-timber]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const t = btn.dataset.timber;
        selectedTimber = btn.dataset.label || btn.textContent.trim();
        timberL.className = `rl-timber rl-timber-l wood-${t}`;
        timberR.className = `rl-timber rl-timber-r wood-${t}`;
        updateReadout();
      });
    });

    document.querySelectorAll('[data-resin]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-resin]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const r = btn.dataset.resin;
        selectedResin = btn.dataset.label || btn.textContent.trim();
        resinRiver.className = `rl-resin-river resin-${r}`;
        if (shimmerOverlay) resinRiver.appendChild(shimmerOverlay);
        if (flakesOverlay)  resinRiver.appendChild(flakesOverlay);
        updateReadout();
      });
    });

    document.querySelectorAll('[data-sparkle]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-sparkle]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const s = btn.dataset.sparkle;
        selectedSparkle = btn.dataset.label || btn.textContent.trim();
        if (shimmerOverlay) shimmerOverlay.classList.remove('active');
        if (flakesOverlay)  flakesOverlay.classList.remove('active');
        if (s === 'shimmer' && shimmerOverlay) shimmerOverlay.classList.add('active');
        if (s === 'flakes'  && flakesOverlay)  flakesOverlay.classList.add('active');
        updateReadout();
      });
    });
  }

  // --------------------------------------------------
  // 14. Commission Capsule Visualizer (index.html)
  // --------------------------------------------------
  const capsulePreview = document.getElementById('rl-capsule-preview');
  const capsuleObject  = document.getElementById('rl-capsule-object');
  const capsuleTitle   = document.getElementById('rl-capsule-title');
  const capsuleReadout = document.getElementById('rl-capsule-readout');
  const capsuleProduct = document.getElementById('rl-capsule-product');
  const capsulePalette = document.getElementById('rl-capsule-palette');
  const capsuleFinish  = document.getElementById('rl-capsule-finish');

  if (capsulePreview && capsuleObject) {
    const paletteVars = {
      ocean: ['#004f5f', '#00e5ff', '#e2b354'],
      emerald: ['#063f35', '#00bfa5', '#e2b354'],
      rose: ['#f8b7cc', '#fff1f6', '#e2b354'],
      galaxy: ['#080b16', '#4051b5', '#00e5ff']
    };

    const capsuleState = {
      product: 'table',
      productLabel: 'River Table',
      palette: 'ocean',
      paletteLabel: 'Ocean Luxe',
      finish: 'gloss',
      finishLabel: 'Gloss Depth'
    };

    const updateCapsule = () => {
      capsulePreview.dataset.product = capsuleState.product;
      capsulePreview.dataset.palette = capsuleState.palette;
      capsulePreview.dataset.finish = capsuleState.finish;

      const colors = paletteVars[capsuleState.palette] || paletteVars.ocean;
      capsuleObject.style.setProperty('--capsule-a', colors[0]);
      capsuleObject.style.setProperty('--capsule-b', colors[1]);
      capsuleObject.style.setProperty('--capsule-c', colors[2]);

      const readout = `${capsuleState.productLabel} + ${capsuleState.paletteLabel} + ${capsuleState.finishLabel}`;
      if (capsuleTitle) capsuleTitle.textContent = `${capsuleState.productLabel} / ${capsuleState.paletteLabel} / ${capsuleState.finishLabel}`;
      if (capsuleReadout) capsuleReadout.textContent = readout;
      if (capsuleProduct) capsuleProduct.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> ${capsuleState.productLabel}`;
      if (capsulePalette) capsulePalette.innerHTML = `<i class="bi bi-palette"></i> ${capsuleState.paletteLabel}`;
      if (capsuleFinish) capsuleFinish.innerHTML = `<i class="bi bi-stars"></i> ${capsuleState.finishLabel}`;
    };

    const bindCapsuleButtons = (selector, stateKey, dataKey, labelKey) => {
      document.querySelectorAll(selector).forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll(selector).forEach(item => {
            item.classList.remove('active');
            item.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          capsuleState[stateKey] = btn.dataset[dataKey];
          capsuleState[labelKey] = btn.dataset.label || btn.textContent.trim();
          updateCapsule();
        });
      });
    };

    bindCapsuleButtons('[data-capsule-product]', 'product', 'capsuleProduct', 'productLabel');
    bindCapsuleButtons('[data-capsule-palette]', 'palette', 'capsulePalette', 'paletteLabel');
    bindCapsuleButtons('[data-capsule-finish]', 'finish', 'capsuleFinish', 'finishLabel');
    updateCapsule();
  }

  // --------------------------------------------------
  // 15. Price Calculator (pricing.html)
  // --------------------------------------------------
  const calcSizeEl   = document.getElementById('calc-size');
  const calcTimberEl = document.getElementById('calc-timber');
  const calcResinEl  = document.getElementById('calc-resin');
  const calcTotalEl  = document.getElementById('calc-total');

  if (calcSizeEl && calcTotalEl) {
    const sizePrices  = { small: 999, medium: 4499, large: 24999 };
    const timberExtra = { pine: 0, oak: 2000, walnut: 6000 };
    const resinExtra  = { matte: 0, pearl: 800, glow: 1800 };

    const updateCalc = () => {
      const base   = sizePrices[calcSizeEl.value]   || 999;
      const tExtra = timberExtra[calcTimberEl.value] || 0;
      const rExtra = resinExtra[calcResinEl.value]   || 0;
      if (calcTotalEl) calcTotalEl.textContent = '₹' + (base + tExtra + rExtra).toLocaleString('en-IN');
    };

    [calcSizeEl, calcTimberEl, calcResinEl].forEach(el => { if (el) el.addEventListener('change', updateCalc); });
    updateCalc();
  }

  // --------------------------------------------------
  // 16. Interactive Review Hub (shop.html)
  // --------------------------------------------------
  const reviewsData = [
    { title: '"The center of conversations"', quote: 'Our bespoke walnut coffee table completely changed the mood of our studio flat. The deep ocean river shines under natural noon sunlight.', author: '— Rajesh K., Bangalore', stars: '★★★★★', category: 'Living Room Rivers', image: 'assets/images/male1.jpg', pour: 'Walnut Slab / 750ml Teal Flow', polish: '10,000-grit wet diamond polish', cure: '100% Cured & Certified', code: 'RLX-WN-9804', timber: 'Select Walnut', artisan: 'R. K. Sharma (Lead Caster)' },
    { title: '"Almost too beautiful to use"', quote: 'The turquoise serving trays and ocean wave coaster set were the perfect housewarming gifts. The high-gloss finish feels exceptionally premium.', author: '— Priya M., Chennai', stars: '★★★★★', category: 'Glossy Tray Sets', image: 'assets/images/female1.jpg', pour: 'Hard Maple / 350ml Swirl Pour', polish: 'Hardwax oil food-safe coating', cure: 'Certified & Lab Sealed', code: 'RLX-MP-5120', timber: 'Hard Maple', artisan: 'A. K. Bose (Wood Artisan)' },
    { title: '"A wearable work of art"', quote: 'I ordered three matching gold-flake floral pendants for my bridesmaids. They are lightweight, completely custom, and catch the light perfectly.', author: '— Sarah T., Mumbai', stars: '★★★★★', category: 'Bespoke Pendants', image: 'assets/images/female2.jpg', pour: 'UV-Stabilized Crystalline Pour', polish: '24k gold leaf shimmer flakes', cure: 'Cured & Certified Authentic', code: 'RLX-PD-7089', timber: 'None (Jewelry Grade)', artisan: 'V. Mehta (Fine Caster)' }
  ];

  const reviewTabs    = document.getElementById('rl-review-tabs');
  const activeTitle   = document.getElementById('rl-review-title');
  const activeQuote   = document.getElementById('rl-review-quote');
  const activeAuthor  = document.getElementById('rl-review-author');
  const activeStars   = document.getElementById('rl-review-stars');
  const activeCatText = document.getElementById('rl-review-cat');
  const activeImage   = document.getElementById('rl-review-image');
  const telPour       = document.getElementById('rl-tel-pour');
  const telPolish     = document.getElementById('rl-tel-polish');
  const telCure       = document.getElementById('rl-tel-cure');
  const telCode       = document.getElementById('rl-tel-code');
  const telTimber     = document.getElementById('rl-tel-timber');
  const telArtisan    = document.getElementById('rl-tel-artisan');

  function renderReview(idx) {
    const d = reviewsData[idx];
    if (!d) return;
    if (activeTitle)   activeTitle.textContent   = d.title;
    if (activeQuote)   activeQuote.textContent   = d.quote;
    if (activeAuthor)  activeAuthor.textContent  = d.author;
    if (activeStars)   activeStars.textContent   = d.stars;
    if (activeCatText) activeCatText.textContent = d.category;
    if (activeImage)   { activeImage.style.opacity = '0'; activeImage.src = d.image; activeImage.onload = () => { activeImage.style.opacity = '1'; }; }
    if (telPour)       telPour.textContent       = d.pour;
    if (telPolish)     telPolish.textContent     = d.polish;
    if (telCure)       telCure.textContent       = d.cure;
    if (telCode)       telCode.textContent       = d.code;
    if (telTimber)     telTimber.textContent     = d.timber || 'Custom Timber';
    if (telArtisan)    telArtisan.textContent    = d.artisan || 'Studio Artisan';
  }

  if (reviewTabs) {
    reviewTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.rl-review-tab-btn');
      if (!btn) return;
      document.querySelectorAll('.rl-review-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderReview(parseInt(btn.dataset.index, 10));
    });
  }

  const formStarsEl = document.getElementById('rl-form-stars');
  let selectedRating = 5;

  if (formStarsEl) {
    formStarsEl.addEventListener('click', (e) => {
      const star = e.target.closest('span');
      if (!star) return;
      selectedRating = parseInt(star.dataset.value, 10);
      document.querySelectorAll('#rl-form-stars span').forEach((s, i) => {
        s.classList.toggle('active', i < selectedRating);
      });
    });
  }

  const reviewForm = document.getElementById('rl-review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('rl-form-name')?.value.trim();
      const city    = document.getElementById('rl-form-city')?.value.trim();
      const product = document.getElementById('rl-form-product')?.value;
      const text    = document.getElementById('rl-form-text')?.value.trim();
      if (!name || !city || !text) return;

      const newRev = { title: `"${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`, quote: text, author: `— ${name}, ${city}`, stars: '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating), category: product, image: 'assets/images/home-hero.jpg', pour: 'Custom Studio Pour', polish: 'Standard diamond finish', cure: '100% Cured & Authenticated', code: `RLX-CST-${Math.floor(1000 + Math.random() * 9000)}`, timber: 'Premium Select', artisan: 'Studio Team' };
      reviewsData.push(newRev);
      const idx = reviewsData.length - 1;

      const newBtn = document.createElement('button');
      newBtn.className    = 'rl-review-tab-btn';
      newBtn.dataset.index = idx;
      newBtn.textContent  = `${name.split(' ')[0]}'s Review`;
      if (reviewTabs) reviewTabs.appendChild(newBtn);
      document.querySelectorAll('.rl-review-tab-btn').forEach(b => b.classList.remove('active'));
      newBtn.classList.add('active');
      renderReview(idx);
      reviewForm.reset();
      selectedRating = 5;
      document.querySelectorAll('#rl-form-stars span').forEach(s => s.classList.add('active'));
    });
  }

  // --------------------------------------------------
  // 17. Dashboard Sidebar Tab Switching
  // --------------------------------------------------
  const dashTabs   = document.querySelectorAll('.rl-sidebar-link[data-tab]');
  const dashPanels = document.querySelectorAll('.rl-dash-panel');

  if (dashTabs.length && dashPanels.length) {
    dashTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        dashTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        dashPanels.forEach(panel => {
          panel.style.display = panel.id === target ? 'block' : 'none';
        });
      });
    });
    if (dashPanels[0]) dashPanels[0].style.display = 'block';
    dashPanels.forEach((p, i) => { if (i > 0) p.style.display = 'none'; });
  }

});
