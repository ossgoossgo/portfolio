// Set base path for i18n (project pages are in /projects/ subdirectory)
I18n.basePath = '../';

document.addEventListener('DOMContentLoaded', async () => {
  await I18n.init();
  document.getElementById('langToggle').addEventListener('click', async () => {
    await I18n.toggle();
  });

  // Back link: use history.back() to preserve scroll position
  var backLink = document.querySelector('.back-link');
  if (backLink) {
    backLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (document.referrer && document.referrer.indexOf(location.host) !== -1) {
        history.back();
      } else {
        location.href = '../index.html#works';
      }
    });
  }

  // Lightbox event listeners
  var lightbox = document.getElementById('lightbox');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var lightboxImg = document.getElementById('lightboxImg');

  // Close only when clicking the dark background (not buttons or image)
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Prevent image click from closing
  lightboxImg.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (currentIndex > 0) {
      currentIndex--;
      showCurrentImage();
    }
  });

  nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (currentIndex < galleryImages.length - 1) {
      currentIndex++;
      showCurrentImage();
    }
  });
});

// ===== Lightbox with prev/next =====
var galleryImages = [];
var currentIndex = 0;

function openLightbox(img) {
  galleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));
  currentIndex = galleryImages.indexOf(img);

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  updateNavVisibility();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

function showCurrentImage() {
  var img = galleryImages[currentIndex];
  var lightboxImg = document.getElementById('lightboxImg');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  updateNavVisibility();
}

function updateNavVisibility() {
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var counter = document.getElementById('lightboxCounter');
  if (prevBtn) prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = currentIndex < galleryImages.length - 1 ? 'flex' : 'none';
  if (counter) counter.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
}

document.addEventListener('keydown', function(e) {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox.classList.contains('open')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; showCurrentImage(); }
  if (e.key === 'ArrowRight' && currentIndex < galleryImages.length - 1) { currentIndex++; showCurrentImage(); }
});
