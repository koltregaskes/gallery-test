// AI Art Gallery JavaScript - Fixed Version
class ArtGallery {
    constructor() {
        this.artworks = [];
        this.filteredArtworks = [];
        this.currentFilter = 'all';
        this.currentSearchTerm = '';
        this.showFeaturedOnly = false;
        this.currentLightboxIndex = -1;
        this.theme = localStorage.getItem('galleryTheme') || 'light';
        
        this.init();
    }
    
    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.initializeTheme();
        this.renderGallery();
        this.updateStats();
    }
    
    loadSampleData() {
        // Sample artwork data with working placeholder images
        this.artworks = [
            {
                id: 1,
                title: "Cyberpunk Cityscape",
                imageUrl: "https://picsum.photos/800/1200?random=1&t=1",
                thumbnailUrl: "https://picsum.photos/400/600?random=1&t=1",
                category: "Focus",
                platform: "Midjourney",
                date: "2025-06-10",
                prompt: "Cyberpunk cityscape at night, neon lights, flying cars, rain-soaked streets --ar 2:3 --v 6",
                tags: ["cyberpunk", "cityscape", "neon", "futuristic"],
                featured: true,
                description: "A stunning cyberpunk cityscape featuring towering skyscrapers with neon advertisements."
            },
            {
                id: 2,
                title: "Ethereal Forest",
                imageUrl: "https://picsum.photos/800/800?random=2&t=2",
                thumbnailUrl: "https://picsum.photos/400/400?random=2&t=2",
                category: "Latest",
                platform: "Midjourney",
                date: "2025-06-11",
                prompt: "Mystical forest with glowing mushrooms, fairy lights, ethereal atmosphere --ar 1:1 --v 6",
                tags: ["forest", "mystical", "glowing", "nature"],
                featured: false,
                description: "An enchanted forest scene with bioluminescent fungi and magical atmosphere."
            },
            {
                id: 3,
                title: "Abstract Geometry",
                imageUrl: "https://picsum.photos/600/800?random=3&t=3",
                thumbnailUrl: "https://picsum.photos/300/400?random=3&t=3",
                category: "Archive",
                platform: "Midjourney",
                date: "2025-05-15",
                prompt: "Abstract geometric shapes, vibrant colors, 3D render, modernist style --ar 3:4 --v 6",
                tags: ["abstract", "geometric", "3d", "colorful"],
                featured: true,
                description: "Bold geometric composition with striking color combinations."
            },
            {
                id: 4,
                title: "Ocean Dreams",
                imageUrl: "https://picsum.photos/900/600?random=4&t=4",
                thumbnailUrl: "https://picsum.photos/450/300?random=4&t=4",
                category: "Latest",
                platform: "Midjourney",
                date: "2025-06-12",
                prompt: "Underwater scene, coral reef, tropical fish, sunbeams through water --ar 3:2 --v 6",
                tags: ["ocean", "underwater", "coral", "tropical"],
                featured: false,
                description: "Vibrant underwater ecosystem with diverse marine life."
            },
            {
                id: 5,
                title: "Space Station",
                imageUrl: "https://picsum.photos/700/900?random=5&t=5",
                thumbnailUrl: "https://picsum.photos/350/450?random=5&t=5",
                category: "Focus",
                platform: "Midjourney",
                date: "2025-06-08",
                prompt: "Futuristic space station orbiting Earth, detailed architecture, cosmic background --ar 7:9 --v 6",
                tags: ["space", "futuristic", "station", "cosmic"],
                featured: true,
                description: "Advanced orbital space station with Earth visible in the background."
            },
            {
                id: 6,
                title: "Vintage Portrait",
                imageUrl: "https://picsum.photos/600/900?random=6&t=6",
                thumbnailUrl: "https://picsum.photos/300/450?random=6&t=6",
                category: "Archive",
                platform: "Midjourney",
                date: "2025-04-20",
                prompt: "Vintage style portrait, film noir lighting, 1940s aesthetic --ar 2:3 --v 6",
                tags: ["vintage", "portrait", "noir", "1940s"],
                featured: false,
                description: "Classic film noir style portrait with dramatic lighting."
            }
        ];
        
        // Initialize filtered artworks
        this.filteredArtworks = [...this.artworks];
    }
    
    setupEventListeners() {
        // Theme toggle - Fixed
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.currentSearchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300));
            
            // Enter key for search
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.currentSearchTerm = e.target.value.toLowerCase();
                    this.applyFilters();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchInput = document.getElementById('searchInput');
                this.currentSearchTerm = searchInput.value.toLowerCase();
                this.applyFilters();
            });
        }
        
        // Category filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Apply filter
                this.currentFilter = e.target.dataset.category;
                this.applyFilters();
            });
        });
        
        // Featured toggle
        const featuredToggle = document.getElementById('featuredToggle');
        if (featuredToggle) {
            featuredToggle.addEventListener('change', (e) => {
                this.showFeaturedOnly = e.target.checked;
                this.applyFilters();
            });
        }
        
        // Lightbox controls - Fixed
        this.setupLightboxControls();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }
    
    setupLightboxControls() {
        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        
        if (!lightbox) return;
        
        const lightboxOverlay = lightbox.querySelector('.lightbox__overlay');
        
        // Close lightbox - Fixed
        if (lightboxClose) {
            lightboxClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeLightbox();
            });
        }
        
        if (lightboxOverlay) {
            lightboxOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeLightbox();
            });
        }
        
        // Navigation - Fixed
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.navigateLightbox(-1);
            });
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.navigateLightbox(1);
            });
        }
        
        // Touch/swipe support for mobile
        this.setupTouchNavigation(lightbox);
    }
    
    setupTouchNavigation(lightbox) {
        let startX = 0;
        let startY = 0;
        
        lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.navigateLightbox(1); // Swipe left - next image
                } else {
                    this.navigateLightbox(-1); // Swipe right - previous image
                }
            }
            
            startX = 0;
            startY = 0;
        }, { passive: true });
    }
    
    handleKeyboardNavigation(e) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) {
            switch(e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateLightbox(1);
                    break;
            }
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    initializeTheme() {
        // Set initial theme
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        this.updateThemeIcons();
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        
        // Save to localStorage
        try {
            localStorage.setItem('galleryTheme', this.theme);
        } catch (e) {
            console.log('Unable to save theme preference');
        }
        
        this.updateThemeIcons();
    }
    
    updateThemeIcons() {
        const lightIcon = document.querySelector('.theme-icon--light');
        const darkIcon = document.querySelector('.theme-icon--dark');
        
        if (lightIcon && darkIcon) {
            if (this.theme === 'dark') {
                lightIcon.classList.add('hidden');
                darkIcon.classList.remove('hidden');
            } else {
                lightIcon.classList.remove('hidden');
                darkIcon.classList.add('hidden');
            }
        }
    }
    
    applyFilters() {
        this.filteredArtworks = this.artworks.filter(artwork => {
            // Category filter
            const categoryMatch = this.currentFilter === 'all' || artwork.category === this.currentFilter;
            
            // Featured filter
            const featuredMatch = !this.showFeaturedOnly || artwork.featured;
            
            // Search filter
            const searchMatch = !this.currentSearchTerm || 
                artwork.title.toLowerCase().includes(this.currentSearchTerm) ||
                artwork.description.toLowerCase().includes(this.currentSearchTerm) ||
                artwork.prompt.toLowerCase().includes(this.currentSearchTerm) ||
                artwork.tags.some(tag => tag.toLowerCase().includes(this.currentSearchTerm)) ||
                artwork.platform.toLowerCase().includes(this.currentSearchTerm);
            
            return categoryMatch && featuredMatch && searchMatch;
        });
        
        this.renderGallery();
        this.updateStats();
    }
    
    renderGallery() {
        const gallery = document.getElementById('gallery');
        const loading = document.getElementById('loading');
        const noResults = document.getElementById('noResults');
        
        if (!gallery) return;
        
        // Show loading
        if (loading) loading.classList.remove('hidden');
        gallery.innerHTML = '';
        if (noResults) noResults.classList.add('hidden');
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            if (loading) loading.classList.add('hidden');
            
            if (this.filteredArtworks.length === 0) {
                if (noResults) noResults.classList.remove('hidden');
                return;
            }
            
            // Create gallery items
            this.filteredArtworks.forEach((artwork, index) => {
                const galleryItem = this.createGalleryItem(artwork, index);
                gallery.appendChild(galleryItem);
            });
            
        }, 200);
    }
    
    createGalleryItem(artwork, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-index', index);
        
        const formattedDate = new Date(artwork.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        item.innerHTML = `
            <img class="gallery-item__image" 
                 src="${artwork.thumbnailUrl}" 
                 alt="${artwork.title}"
                 loading="lazy">
            ${artwork.featured ? '<div class="gallery-item__featured">Featured</div>' : ''}
            <div class="gallery-item__overlay">
                <h3 class="gallery-item__title">${artwork.title}</h3>
                <div class="gallery-item__meta">
                    <span class="gallery-item__platform">${artwork.platform}</span>
                    <span class="gallery-item__date">${formattedDate}</span>
                </div>
                <div class="gallery-item__tags">
                    ${artwork.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Add click handler for lightbox - Fixed
        item.addEventListener('click', (e) => {
            e.preventDefault();
            this.openLightbox(index);
        });
        
        return item;
    }
    
    openLightbox(index) {
        if (index < 0 || index >= this.filteredArtworks.length) return;
        
        this.currentLightboxIndex = index;
        const artwork = this.filteredArtworks[index];
        
        // Get lightbox elements
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxPlatform = document.getElementById('lightboxPlatform');
        const lightboxDescription = document.getElementById('lightboxDescription');
        const lightboxPrompt = document.getElementById('lightboxPrompt');
        const lightboxDate = document.getElementById('lightboxDate');
        const lightboxTags = document.getElementById('lightboxTags');
        
        if (!lightbox) return;
        
        // Update lightbox content - Fixed
        if (lightboxImage) {
            lightboxImage.src = artwork.imageUrl;
            lightboxImage.alt = artwork.title;
        }
        
        if (lightboxTitle) lightboxTitle.textContent = artwork.title;
        if (lightboxPlatform) lightboxPlatform.textContent = artwork.platform;
        if (lightboxDescription) lightboxDescription.textContent = artwork.description;
        if (lightboxPrompt) lightboxPrompt.textContent = artwork.prompt;
        
        if (lightboxDate) {
            const formattedDate = new Date(artwork.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            lightboxDate.textContent = formattedDate;
        }
        
        // Update tags
        if (lightboxTags) {
            lightboxTags.innerHTML = artwork.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');
        }
        
        // Show lightbox
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Update navigation buttons
        this.updateLightboxNavigation();
        
        // Focus management for accessibility
        setTimeout(() => {
            const closeBtn = document.getElementById('lightboxClose');
            if (closeBtn) closeBtn.focus();
        }, 100);
    }
    
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.add('hidden');
        }
        document.body.style.overflow = '';
        this.currentLightboxIndex = -1;
    }
    
    navigateLightbox(direction) {
        const newIndex = this.currentLightboxIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.filteredArtworks.length) {
            this.openLightbox(newIndex);
        }
    }
    
    updateLightboxNavigation() {
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentLightboxIndex > 0 ? 'flex' : 'none';
        }
        
        if (nextBtn) {
            nextBtn.style.display = this.currentLightboxIndex < this.filteredArtworks.length - 1 ? 'flex' : 'none';
        }
    }
    
    updateStats() {
        const totalCount = document.getElementById('totalCount');
        const featuredCount = document.getElementById('featuredCount');
        
        if (totalCount) {
            this.animateNumber(totalCount, parseInt(totalCount.textContent) || 0, this.filteredArtworks.length);
        }
        
        if (featuredCount) {
            this.animateNumber(featuredCount, parseInt(featuredCount.textContent) || 0, 
                this.filteredArtworks.filter(artwork => artwork.featured).length);
        }
    }
    
    animateNumber(element, start, end) {
        const duration = 500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    // API methods for future integration
    addArtwork(artwork) {
        const newArtwork = {
            id: Date.now(),
            ...artwork,
            date: artwork.date || new Date().toISOString().split('T')[0]
        };
        
        this.artworks.unshift(newArtwork);
        this.applyFilters();
        
        return newArtwork.id;
    }
    
    updateArtwork(id, updates) {
        const index = this.artworks.findIndex(artwork => artwork.id === id);
        if (index !== -1) {
            this.artworks[index] = { ...this.artworks[index], ...updates };
            this.applyFilters();
            return true;
        }
        return false;
    }
    
    deleteArtwork(id) {
        const index = this.artworks.findIndex(artwork => artwork.id === id);
        if (index !== -1) {
            this.artworks.splice(index, 1);
            this.applyFilters();
            return true;
        }
        return false;
    }
    
    exportData() {
        return {
            artworks: this.artworks,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }
    
    importData(data) {
        if (data.artworks && Array.isArray(data.artworks)) {
            this.artworks = data.artworks;
            this.applyFilters();
            return true;
        }
        return false;
    }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit more to ensure all elements are ready
    setTimeout(() => {
        window.artGallery = new ArtGallery();
        
        console.log('🎨 AI Art Gallery initialized');
        console.log('📦 Ready for Notion DB integration');
        console.log('🔧 Access gallery instance via window.artGallery');
    }, 100);
});