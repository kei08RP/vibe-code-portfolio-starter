// =========================================================
// Portfolio scripts
// =========================================================

// Book page navigation
const pages = Array.from(document.querySelectorAll('.book-page'));
const pageCounter = document.querySelector('.page-counter');
const book = document.querySelector('.book');

let currentPage = 0;
let dragStartX = 0;
let dragCurrentX = 0;
let isDragging = false;

function updatePageDisplay(index) {
  currentPage = (index + pages.length) % pages.length;

  pages.forEach((page, pageIndex) => {
    const isActive = pageIndex === currentPage;
    page.classList.toggle('active', isActive);
    page.style.zIndex = isActive ? '2' : '1';
    page.style.transform = isActive
      ? 'translateX(0) rotateY(0deg) scale(1)'
      : 'translateX(26px) rotateY(18deg) scale(0.985)';
    page.style.transition = 'opacity 320ms ease, visibility 320ms ease, transform 500ms ease, filter 320ms ease';
  });

  pageCounter.textContent = `${String(currentPage + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`;
}

function handlePointerMove(event) {
  if (!isDragging) return;
  dragCurrentX = event.clientX;
  const deltaX = dragCurrentX - dragStartX;
  const activePage = pages[currentPage];
  const maxTurn = 80;
  const angle = Math.max(Math.min((deltaX / Math.max(book.clientWidth, 1)) * 110, maxTurn), -maxTurn);

  activePage.style.transition = 'none';
  activePage.style.transform = `translateX(${deltaX * 0.2}px) rotateY(${angle}deg) scale(1)`;
}

function handlePointerUp() {
  if (!isDragging) return;

  const deltaX = dragCurrentX - dragStartX;
  const threshold = 110;

  if (deltaX < -threshold && currentPage < pages.length - 1) {
    currentPage += 1;
  } else if (deltaX > threshold && currentPage > 0) {
    currentPage -= 1;
  }

  isDragging = false;
  updatePageDisplay(currentPage);
}

book?.addEventListener('mousedown', (event) => {
  if (event.target.closest('a, button')) return;
  isDragging = true;
  dragStartX = event.clientX;
  dragCurrentX = event.clientX;
});

window.addEventListener('mousemove', handlePointerMove);
window.addEventListener('mouseup', handlePointerUp);

document.querySelectorAll('a[href^="#page-"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#page-')) return;

    event.preventDefault();
    const targetIndex = pages.findIndex((page) => `#${page.id}` === targetId);
    if (targetIndex >= 0) {
      updatePageDisplay(targetIndex);
    }
  });
});

updatePageDisplay(0);
