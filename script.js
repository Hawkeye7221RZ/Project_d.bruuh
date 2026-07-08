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
