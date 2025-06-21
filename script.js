// Sample JSON data - replace this with your actual data
const slides = [
    {
        "type": "image",
        "src": "https://picsum.photos/800/400?random=1",
        "caption": "Beautiful landscape image"
    },
    {
        "type": "website",
        "src": "https://www.example.com",
        "caption": "Example website embedded"
    },
    {
        "type": "image",
        "src": "https://picsum.photos/800/400?random=2",
        "caption": "Another stunning image"
    },
    {
        "type": "website",
        "src": "https://www.wikipedia.org",
        "caption": "Wikipedia homepage"
    }
];

let currentSlide = 0;
const contentBox = document.getElementById('contentBox');
const caption = document.getElementById('caption');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');

function renderSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    const slide = slides[index];
    contentBox.innerHTML = '';
    
    if (slide.type === 'image') {
        const img = document.createElement('img');
        img.src = slide.src;
        img.alt = slide.caption;
        contentBox.appendChild(img);
    } else if (slide.type === 'website') {
        const iframe = document.createElement('iframe');
        iframe.src = slide.src;
        iframe.title = slide.caption;
        contentBox.appendChild(iframe);
    }
    
    // Add slide counter
    const counter = document.createElement('div');
    counter.className = 'slide-counter';
    counter.textContent = `${index + 1} / ${slides.length}`;
    contentBox.appendChild(counter);
    
    caption.textContent = slide.caption;
    updateButtons();
}

function updateButtons() {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === slides.length - 1;
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        renderSlide(currentSlide);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        renderSlide(currentSlide);
    }
}

// Event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Initialize
if (slides.length > 0) {
    renderSlide(0);
}