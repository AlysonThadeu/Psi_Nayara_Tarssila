/**
 * Landing Page — Naiara Tassila | Psicóloga Clínica
 * JavaScript Principal
 * 
 * @version 1.0.0
 * @description Animações e interatividade da landing page
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initTestimonialSlider();
  initFaqAccordion();
  initActiveNavHighlight();
  initParallax();
  initWhatsAppButton();
  initTypedText();
  initLazyLoading();
});

/**
 * Navbar Scroll Effect
 * Adiciona a classe 'scrolled' ao header quando o scroll for maior que 50px
 */
function initNavbar() {
    const header = document.querySelector('.header') || document.querySelector('#header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * Mobile Menu Toggle
 * Alterna o menu mobile e a classe no-scroll no body
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle') || document.querySelector('#navToggle');
    const navMenu = document.querySelector('.nav-menu') || document.querySelector('#navMenu');
    
    if (!navToggle || !navMenu) return;

    const toggleMenu = () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    navToggle.addEventListener('click', toggleMenu);

    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/**
 * Smooth Scroll
 * Rolagem suave para links internos
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Scroll Reveal
 * Revela os elementos gradualmente ao rolar a página
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (revealElements.length === 0) return;

    const isMobile = window.innerWidth <= 768;
    const observerOptions = {
        root: null,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px 80px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('active');
                
                const staggers = el.querySelectorAll('.stagger-item');
                staggers.forEach((stagger, index) => {
                    stagger.style.transitionDelay = isMobile ? `${index * 70}ms` : `${index * 100}ms`;
                });

                observer.unobserve(el);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Counter Animation
 * Anima os números de forma suave com formatação brasileira
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (counters.length === 0) return;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const easeOutProgress = progress * (2 - progress);
            const current = Math.floor(easeOutProgress * target);
            
            counter.innerText = current.toLocaleString('pt-BR');
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.innerText = target.toLocaleString('pt-BR');
            }
        };

        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counter.innerText = '0';
        observer.observe(counter);
    });
}

/**
 * Testimonial Slider
 * Carrossel de depoimentos com suporte a touch e autoplay
 */
function initTestimonialSlider() {
    const track = document.querySelector('.slider-track') || document.querySelector('#sliderTrack');
    const container = document.querySelector('.testimonial-slider') || document.querySelector('#testimonialSlider');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-prev') || document.querySelector('#sliderPrev');
    const nextBtn = document.querySelector('.slider-next') || document.querySelector('#sliderNext');
    const dotsContainer = document.querySelector('.slider-dots') || document.querySelector('#sliderDots');
    
    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval = null;
    let startX = 0;
    let isDragging = false;

    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Ir para o depoimento ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
        
        if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const updateSlider = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const goToSlide = (index) => {
        currentIndex = (index + cards.length) % cards.length;
        updateSlider();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        pauseAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoplay();
        }
        isDragging = false;
    });

    const startAutoplay = () => {
        if (!autoplayInterval) {
            autoplayInterval = setInterval(nextSlide, 5000);
        }
    };

    const pauseAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    };

    const resetAutoplay = () => {
        pauseAutoplay();
        startAutoplay();
    };

    if (container) {
        container.addEventListener('mouseenter', pauseAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
}

/**
 * FAQ Accordion
 * Gerencia o estado de abertura e fechamento das perguntas
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = item.classList.contains('active');

            // Todas as perguntas permanecem visíveis e apenas o bloco da resposta se expande ou minimiza.
            if (isOpen) {
                item.classList.remove('active');
                questionBtn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/**
 * Active Nav Highlight
 * Destaca o link do menu correspondente à seção atual
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(section => observer.observe(section));
}

/**
 * Parallax Effect
 * Efeito visual de profundidade nos shapes do hero no scroll
 */
function initParallax() {
    const parallaxEl = document.querySelector('.hero-bg-shapes');
    if (!parallaxEl || window.innerWidth <= 768) return;

    let ticking = false;

    const updateParallax = () => {
        const scrolled = window.scrollY;
        parallaxEl.style.transform = `translateY(${scrolled * 0.3}px)`;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * WhatsApp Button
 * Mostra o botão flutuante apenas após determinado scroll
 */
function initWhatsAppButton() {
    const waButton = document.querySelector('.whatsapp-float') || document.querySelector('#whatsappFloat');
    if (!waButton) return;

    const handleScroll = () => {
        if (window.scrollY > 500) {
            waButton.classList.add('show');
        } else {
            waButton.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Typed Text Effect
 * Efeito de máquina de escrever para palavras em destaque
 */
function initTypedText() {
    const typedTextEl = document.querySelector('.typed-text') || document.querySelector('#typedText');
    if (!typedTextEl) return;

    const words = ['Abordagem TCC', 'Abordagem ABA', 'Terapia Infantil & Adulto', 'Atendimento Online & Presencial'];
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    const type = () => {
        const fullWord = words[wordIndex];

        if (isDeleting) {
            currentText = fullWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = fullWord.substring(0, charIndex + 1);
            charIndex++;
        }

        typedTextEl.textContent = currentText;

        let nextSpeed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === fullWord.length) {
            nextSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            nextSpeed = 500;
        }

        setTimeout(type, nextSpeed);
    };

    setTimeout(type, 1000);
}

/**
 * Lazy Loading
 * Carregamento tardio de imagens para performance
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '50px 0px', threshold: 0.01 });

    lazyImages.forEach(img => observer.observe(img));
}
