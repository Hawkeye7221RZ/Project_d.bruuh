/* ==========================================================
   MOBILE MENU — hamburger toggle, dropdown via tap
   ========================================================== */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

function closeMobileMenu() {
  if (navLinks) navLinks.classList.remove('open');
  if (navBackdrop) navBackdrop.classList.remove('open');
  if (menuToggle) menuToggle.classList.remove('open');
  document.querySelectorAll('.nav-dropdown').forEach((d) => {
    d.classList.remove('mobile-open');
    const m = d.querySelector('.nav-dropdown-menu');
    if (m) m.style.display = 'none';
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    if (navBackdrop) navBackdrop.classList.toggle('open', isOpen);
  });

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
  }

  // dropdown "Konten" & "Komunitas" dibuka pakai tap, bukan hover, khusus mobile
  document.querySelectorAll('.nav-dropdown-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = btn.closest('.nav-dropdown');
        const submenu = parent.querySelector('.nav-dropdown-menu');
        const alreadyOpen = parent.classList.contains('mobile-open');

        // tutup semua dropdown lain dulu (class + inline style)
        document.querySelectorAll('.nav-dropdown').forEach((d) => {
          d.classList.remove('mobile-open');
          const m = d.querySelector('.nav-dropdown-menu');
          if (m) m.style.display = 'none';
        });

        // kalau yang diklik sebelumnya belum kebuka, buka sekarang
        if (!alreadyOpen) {
          parent.classList.add('mobile-open');
          if (submenu) submenu.style.display = 'block';
        }
      }
    });
  });

  // klik link biasa (bukan tombol dropdown) langsung nutup menu mobile
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMobileMenu();
    });
  });

  // tutup menu kalau layar di-resize balik ke ukuran desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });
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
