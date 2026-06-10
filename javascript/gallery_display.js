document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const headerCenter = document.querySelector('.header-center');

    if (!menuToggle || !headerCenter) {
        return;
    }

    menuToggle.addEventListener('click', function () {
        headerCenter.classList.toggle('open');
        const isOpen = headerCenter.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.header-center nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (headerCenter.classList.contains('open')) {
                headerCenter.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
});

// image gallery script
let galleryImages = [];
let currentImageIndex = 0;


        function loadGalleryImages(maxIndex = 50) {
            const checks = [];
            for (let i = 1; i <= maxIndex; i++) {
                checks.push(new Promise((resolve) => {
                    const img = new Image();
                    const src = `image_gallery/${i}.jpg`;
                    img.onload = () => resolve(src);
                    img.onerror = () => resolve(null);

                    img.src = src;
                }));
            }
            return Promise.all(checks).then(results => {
                galleryImages = results.filter(Boolean);
            });
        }

        function renderGallery() {
            const container = document.getElementById('galleryContainer');
            container.innerHTML = '';

            if (!galleryImages.length) {
                container.innerHTML = '<p>Brak zdjęć w galerii. Dodaj pliki do folderu image_gallery i zaktualizuj listę nazw w skrypcie.</p>';
                return;
            }
            
            galleryImages.forEach((image, index) => {
                const article = document.createElement('article');
                article.className = 'gallery-item';
                article.innerHTML = `
                    <div class="gallery-tile" style="width:100%; height:250px; border-radius:16px; overflow:hidden; cursor:pointer; background:#fafafa; border:1px solid #ddd; display:flex; align-items:center; justify-content:center; transition:transform 0.3s ease, box-shadow 0.3s ease; position:relative;">
                        <img src="${image}" alt="Zdjęcie galerii" style="width:100%; height:100%; object-fit:cover;">
                        <div style="position:absolute; inset:0; background:rgba(0,0,0,0); transition:background 0.3s ease;" class="overlay"></div>
                    </div>
                `;
                
                const tile = article.querySelector('.gallery-tile');
                tile.addEventListener('click', () => openLightbox(index));
                tile.addEventListener('mouseenter', () => {
                    tile.style.transform = 'scale(1.05)';
                    tile.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                    article.querySelector('.overlay').style.background = 'rgba(0,0,0,0.2)';
                });
                tile.addEventListener('mouseleave', () => {
                    tile.style.transform = 'scale(1)';
                    tile.style.boxShadow = 'none';
                    article.querySelector('.overlay').style.background = 'rgba(0,0,0,0)';
                });
                
                container.appendChild(article);
            });
        }

        function openLightbox(index) {
            currentImageIndex = index;
            const lightbox = document.getElementById('lightbox');
            const img = document.getElementById('lightboxImage');
            img.src = galleryImages[index];
            lightbox.style.display = 'flex';
        }

        function closeLightbox() {
            document.getElementById('lightbox').style.display = 'none';
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            document.getElementById('lightboxImage').src = galleryImages[currentImageIndex];
        }

        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            document.getElementById('lightboxImage').src = galleryImages[currentImageIndex];
        }

        document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
        
        const nextBtn = document.getElementById('nextImage');
        if (nextBtn) nextBtn.addEventListener('click', nextImage);
        
        const prevBtn = document.getElementById('prevImage');
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target === document.getElementById('lightbox')) closeLightbox();
        });

        loadGalleryImages(50).then(renderGallery).catch(() => {
        
            renderGallery();
        });