document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', function() {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню если открыто
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Изменение шапки при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Частицы
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#9d8ac7" },
            "shape": { "type": "circle" },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": { "enable": true, "speed": 1, "opacity_min": 0.1 }
            },
            "size": { "value": 3, "random": true },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#7d6ba0",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out"
            }
        },
        "interactivity": {
            "events": {
                "onhover": { "enable": true, "mode": "repulse" }
            }
        }
    });

    // Анимации при скролле
    const animateElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-scale-in');
    
    function checkAnimation() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.animationPlayState = 'running';
            }
        });
    }
    
    window.addEventListener('scroll', checkAnimation);
    window.addEventListener('load', checkAnimation);

    // Анимация скролла мыши
    const scrollBtn = document.querySelector('.hero-scroll-btn');
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });

    // Загрузка фото в галерею
    const photoUploadForm = document.getElementById('photoUploadForm');
    if (photoUploadForm) {
        photoUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('photoInput');
            const description = document.getElementById('photoDescription').value;
            
            if (fileInput.files.length > 0) {
                // Здесь должна быть логика загрузки на сервер
                // В демо-версии просто имитируем загрузку
                
                Array.from(fileInput.files).forEach(file => {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const galleryGrid = document.querySelector('.gallery-grid');
                        
                        const newItem = document.createElement('div');
                        newItem.className = 'gallery-item animate-scale-in';
                        
                        newItem.innerHTML = `
                            <img src="${e.target.result}" alt="${description || 'Фото клуба'}">
                            <div class="gallery-overlay">
                                <h3>${description || 'Новое фото'}</h3>
                            </div>
                        `;
                        
                        galleryGrid.appendChild(newItem);
                    };
                    
                    reader.readAsDataURL(file);
                });
                
                alert('Фото успешно добавлены в галерею!');
                photoUploadForm.reset();
            } else {
                alert('Пожалуйста, выберите файлы для загрузки');
            }
        });
    }

    // Добавление социальных сетей
    const socialForm = document.getElementById('socialForm');
    if (socialForm) {
        socialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('socialType').value;
            const url = document.getElementById('socialUrl').value;
            
            if (url) {
                const socialLinks = document.querySelector('.social-links');
                const icons = {
                    'vk': 'fab fa-vk',
                    'telegram': 'fab fa-telegram',
                    'instagram': 'fab fa-instagram',
                    'youtube': 'fab fa-youtube',
                    'tiktok': 'fab fa-tiktok'
                };
                
                const newLink = document.createElement('a');
                newLink.href = url;
                newLink.target = '_blank';
                newLink.innerHTML = `<i class="${icons[type]}"></i>`;
                
                socialLinks.appendChild(newLink);
                socialForm.reset();
                alert('Социальная сеть добавлена!');
            } else {
                alert('Пожалуйста, введите ссылку');
            }
        });
    }
});