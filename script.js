let slides = [];
let currentSlide = 0;
const contentBox = document.getElementById('contentBox');
const caption = document.getElementById('caption');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');

// Fetch slides from JSON file
fetch('slide.json')
    .then(response => response.json())
    .then(data => {
        slides = data;
        if (slides.length > 0) {
            renderSlide(0);
        }
    })
    .catch(error => {
        console.error('Error loading slides:', error);
        contentBox.innerHTML = '<div class="placeholder">Error loading slides</div>';
    });

function renderSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    const slide = slides[index];
    contentBox.innerHTML = '';
    
    // Add URL display for all types
    const urlDisplay = document.createElement('div');
    urlDisplay.className = 'url-display';
    urlDisplay.textContent = slide.src;
    contentBox.appendChild(urlDisplay);
    
    if (slide.type === 'image') {
        const img = document.createElement('img');
        // Convert Google Drive link to direct image link
        if (slide.src.includes('drive.google.com')) {
            const fileId = slide.src.match(/\/d\/(.*?)\/view/)?.[1];
            if (fileId) {
                img.src = `https://drive.google.com/uc?export=view&id=${fileId}`;
            } else {
                img.src = slide.src;
            }
        } else {
            img.src = slide.src;
        }
        img.alt = slide.caption;
        contentBox.appendChild(img);
    } else if (slide.type === 'website') {
        if (slide.src.includes('x.com') || slide.src.includes('twitter.com')) {
            // For Twitter/X links, open in new tab
            const link = document.createElement('a');
            link.href = slide.src;
            link.target = '_blank';
            link.textContent = 'Open Tweet in New Tab';
            link.className = 'external-link';
            contentBox.appendChild(link);
        } else if (slide.src.includes('instagram.com')) {
            // For Instagram, create a link with post preview
            const container = document.createElement('div');
            container.className = 'instagram-container';
            
            const link = document.createElement('a');
            link.href = slide.src;
            link.target = '_blank';
            link.className = 'external-link';
            link.textContent = 'View Instagram Post';
            
            container.appendChild(link);
            contentBox.appendChild(container);
            
            // Try to fetch Instagram oEmbed data
            fetch(`https://api.instagram.com/oembed/?url=${encodeURIComponent(slide.src)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.html) {
                        container.innerHTML = data.html;
                    }
                })
                .catch(() => {
                    // Keep the link as fallback if oEmbed fails
                    console.log('Instagram embed failed, falling back to link');
                });
        } else {
            const iframe = document.createElement('iframe');
            iframe.src = slide.src;
            iframe.title = slide.caption;
            contentBox.appendChild(iframe);
        }
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