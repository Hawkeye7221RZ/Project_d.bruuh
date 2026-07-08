/* ==========================================================
   NAVBAR HEIGHT SYNC — supaya konten gak ketutup navbar fixed di HP
   ========================================================== */
const navbarEl = document.querySelector('.navbar');

function syncNavbarHeight() {
  if (!navbarEl) return;
  if (window.innerWidth <= 768) {
    const h = navbarEl.offsetHeight;
    document.documentElement.style.setProperty('--navbar-h', h + 'px');
  } else {
    document.documentElement.style.removeProperty('--navbar-h');
  }
}

syncNavbarHeight();
window.addEventListener('resize', syncNavbarHeight);
window.addEventListener('load', syncNavbarHeight);

/* ==========================================================
   MOBILE NAV — hamburger, backdrop, dropdown accordion
   ========================================================== */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

function openMobileMenu() {
  navLinks.classList.add('open');
  navBackdrop.classList.add('open');
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // biar konten belakang gak ikut kescroll
}

function closeMobileMenu() {
  navLinks.classList.remove('open');
  navBackdrop.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';

  // tutup juga semua accordion dropdown yang lagi kebuka
  document.querySelectorAll('.nav-dropdown.mobile-open').forEach((el) => {
    el.classList.remove('mobile-open');
  });
}

if (menuToggle && navLinks && navBackdrop) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  navBackdrop.addEventListener('click', closeMobileMenu);

  // tutup menu dengan tombol Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // dropdown "Konten" / "Komunitas" jadi accordion pas mobile
  document.querySelectorAll('.nav-dropdown-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // di layar besar dropdown udah jalan otomatis lewat hover, jadi skip
      if (window.innerWidth > 768) return;

      e.preventDefault();
      const parent = btn.closest('.nav-dropdown');
      const isOpen = parent.classList.contains('mobile-open');

      // tutup dropdown lain biar cuma satu yang kebuka
      document.querySelectorAll('.nav-dropdown.mobile-open').forEach((el) => {
        if (el !== parent) el.classList.remove('mobile-open');
      });

      parent.classList.toggle('mobile-open', !isOpen);
    });
  });

  // klik link biasa di dalam menu mobile langsung nutup menu
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMobileMenu();
    });
  });

  // kalau layar di-resize balik ke ukuran desktop, reset state mobile menu
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });
}

/* ==========================================================
   HERO SLIDER — cuma lewat tombol panah, tanpa swipe
   ========================================================== */
const heroTrack = document.getElementById('heroTrack');

if (heroTrack) {
  const slides = heroTrack.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let index = 0;

  // bikin dots otomatis sesuai jumlah foto
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ke foto ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.hero-dot');

  function goToSlide(newIndex) {
    index = (newIndex + slides.length) % slides.length; // muter balik ke awal/akhir
    heroTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  prevBtn.addEventListener('click', () => goToSlide(index - 1));
  nextBtn.addEventListener('click', () => goToSlide(index + 1));
}

/* ==========================================================
   FILTER KATEGORI — QUICK GALLERY
   ========================================================== */
const filterTabs = document.getElementById('filterTabs');
const quickGrid = document.getElementById('quickGrid');
const emptyState = document.getElementById('emptyState');

if (filterTabs && quickGrid) {
  const tabs = filterTabs.querySelectorAll('.tab');
  const cards = quickGrid.querySelectorAll('.photo-card');

  filterTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;

    // toggle active state pada tab
    tabs.forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visibleCount = 0;

    cards.forEach((card) => {
      const match = filter === 'Semua' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  });
}

/* ==========================================================
   TOMBOL "TULIS PESAN" — placeholder sebelum sistem login teman jadi
   ========================================================== */
const btnTulisPesan = document.getElementById('btnTulisPesan');
if (btnTulisPesan) {
  btnTulisPesan.addEventListener('click', () => {
    alert('Fitur tulis pesan bakal aktif setelah sistem login teman (invite code) selesai dibuat.');
  });
}

/* ==========================================================
   MODAL VIDEO
   ========================================================== */
const videoGrid = document.getElementById('videoGrid');
const videoModal = document.getElementById('videoModal');
const modalClose = document.getElementById('modalClose');
const modalVideoTitle = document.getElementById('modalVideoTitle');

function openVideoModal(title) {
  if (modalVideoTitle) {
    modalVideoTitle.textContent = `Video akan tampil di sini setelah diunggah: ${title}`;
  }
  videoModal.classList.add('open');
}

function closeVideoModal() {
  videoModal.classList.remove('open');
}

if (videoGrid && videoModal) {
  videoGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.video-card');
    if (!card) return;
    openVideoModal(card.dataset.title);
  });

  modalClose.addEventListener('click', closeVideoModal);

  // tutup modal kalau klik area gelap di luar konten
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  // tutup modal dengan tombol Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });
}
