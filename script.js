const carousel = document.querySelector('#bird-carousel');
const slides = [...carousel.querySelectorAll('.bird-slide')];
const dots = [...carousel.querySelectorAll('.dot')];
const previousButton = carousel.querySelector('.previous');
const nextButton = carousel.querySelector('.next');
const pauseButton = carousel.querySelector('.pause');
let activeIndex = 0;
let autoplay;
let isPaused = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function showSlide(index) {
	activeIndex = (index + slides.length) % slides.length;
	slides.forEach((slide, slideIndex) => {
		const isActive = slideIndex === activeIndex;
		slide.classList.toggle('is-active', isActive);
		slide.setAttribute('aria-hidden', String(!isActive));
	});
	dots.forEach((dot, dotIndex) => {
		const isActive = dotIndex === activeIndex;
		dot.classList.toggle('is-active', isActive);
		dot.setAttribute('aria-current', isActive ? 'true' : 'false');
	});
}

function startAutoplay() {
	clearInterval(autoplay);
	if (!reducedMotion.matches && !isPaused) autoplay = setInterval(() => showSlide(activeIndex + 1), 6500);
}

function moveTo(index) {
	showSlide(index);
	startAutoplay();
}

previousButton.addEventListener('click', () => moveTo(activeIndex - 1));
nextButton.addEventListener('click', () => moveTo(activeIndex + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => moveTo(index)));
pauseButton.addEventListener('click', () => {
	isPaused = !isPaused;
	pauseButton.setAttribute('aria-pressed', String(isPaused));
	pauseButton.setAttribute('aria-label', isPaused ? 'Reanudar reproducción automática' : 'Pausar reproducción automática');
	pauseButton.textContent = isPaused ? '▶' : '❚❚';
	startAutoplay();
});
carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
carousel.addEventListener('mouseleave', startAutoplay);
carousel.addEventListener('focusin', () => clearInterval(autoplay));
carousel.addEventListener('focusout', startAutoplay);

let touchStartX = 0;
carousel.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
carousel.addEventListener('touchend', (event) => {
	const distance = event.changedTouches[0].screenX - touchStartX;
	if (Math.abs(distance) > 45) moveTo(activeIndex + (distance < 0 ? 1 : -1));
}, { passive: true });
document.addEventListener('keydown', (event) => {
	if (!carousel.contains(document.activeElement)) return;
	if (event.key === 'ArrowLeft') { event.preventDefault(); moveTo(activeIndex - 1); }
	if (event.key === 'ArrowRight') { event.preventDefault(); moveTo(activeIndex + 1); }
});

showSlide(0);
startAutoplay();
