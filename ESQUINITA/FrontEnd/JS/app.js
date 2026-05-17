/**
 * =====================================================
 *  LA ESQUINITA - Core App (app.js)
 * =====================================================
 *  Lógica principal: carga de componentes,
 *  navbar, navegación, utilidades.
 *  
 *  Dependencias: carrito.js, whatsapp.js
 * =====================================================
 */

// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    whatsappNumber: '56991754264',
    whatsappMessage: '¡Hola! Quiero hacer un pedido 🍔',
    storageKey: 'esquinita_cart'
};

// ===== CARGA DINÁMICA DE COMPONENTES =====
/**
 * Carga un archivo HTML dentro de un elemento placeholder.
 * Usamos fetch() para traer el contenido del componente
 * y lo insertamos en el DOM.
 * 
 * @param {string} componentPath - Ruta al archivo del componente
 * @param {string} placeholderId - ID del div donde se insertará
 */
async function loadComponent(componentPath, placeholderId) {
    try {
        const response = await fetch(componentPath);

        if (!response.ok) {
            throw new Error(`Error cargando ${componentPath}: ${response.status}`);
        }

        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);

        if (placeholder) {
            placeholder.innerHTML = html;
        }

        return true;
    } catch (error) {
        console.error('Error al cargar componente:', error);
        return false;
    }
}

/**
 * Detecta si estamos en la raíz o en una subcarpeta (pages/)
 * para construir la ruta correcta a los componentes.
 */
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '..';
    }
    return '.';
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', async function () {
    const basePath = getBasePath();

    // 1. Cargar navbar y footer en paralelo
    await Promise.all([
        loadComponent(`${basePath}/components/nav.html`, 'nav-placeholder'),
        loadComponent(`${basePath}/components/footer.html`, 'footer-placeholder')
    ]);

    // 2. Inicializar funcionalidades
    initNavbar();
    setActiveNavLink();
    updateCartBadge();   // definida en carrito.js
    initSmoothScroll();
    fixNavbarLinks();

    console.log('🌭 La Esquinita - Sitio cargado correctamente');
});

// ===== NAVBAR: EFECTO SCROLL =====
/**
 * Cambia el fondo del navbar:
 *  - Arriba del todo → TRANSPARENTE (sin clase navbar-scrolled)
 *  - Scrolleado       → SÓLIDO      (con clase navbar-scrolled)
 *
 * BUG FIX: En desktop, cuando scrollY <= 50 se remueve
 * la clase para que sea transparente.
 */
function initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    // Ejecutar inmediatamente al cargar
    handleScroll();

    // Escuchar scroll
    window.addEventListener('scroll', handleScroll);
}

// ===== NAVEGACIÓN ACTIVA =====
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link[data-page]');

    navLinks.forEach(link => {
        link.classList.remove('active');

        const page = link.getAttribute('data-page');

        if (page === 'index' && (currentPath.endsWith('/') || currentPath.endsWith('index.html'))) {
            link.classList.add('active');
        } else if (page !== 'index' && currentPath.includes(page)) {
            link.classList.add('active');
        }
    });
}

// ===== FIX RUTAS NAVBAR Y FOOTER =====
function fixNavbarLinks() {
    const basePath = getBasePath();
    const isInPages = basePath === '..';

    // Ajustar links del navbar
    document.querySelectorAll('#mainNavbar .nav-link, #mainNavbar .navbar-brand').forEach(link => {
        let href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('https') || href.startsWith('tel')) return;

        if (isInPages) {
            href = href.replace(/^\/index\.html/, '../index.html');
            href = href.replace(/^\/pages\//, './');
            link.setAttribute('href', href);
        }
    });

    // Ajustar links del footer
    document.querySelectorAll('.footer-section a').forEach(link => {
        let href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('https') || href.startsWith('tel')) return;

        if (isInPages) {
            href = href.replace(/^\/index\.html/, '../index.html');
            href = href.replace(/^\/pages\//, './');
            link.setAttribute('href', href);
        }
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href*="#"]');
        if (!link) return;

        const href = link.getAttribute('href');

        if (href.startsWith('#') || (href.includes('#') && href.includes('index.html'))) {
            const hash = href.split('#')[1];
            const target = document.getElementById(hash);

            if (target) {
                e.preventDefault();
                const navbarHeight = document.getElementById('mainNavbar')?.offsetHeight || 0;

                window.scrollTo({
                    top: target.offsetTop - navbarHeight - 10,
                    behavior: 'smooth'
                });

                // Cerrar menú móvil si está abierto
                const navCollapse = document.getElementById('navbarNav');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        }
    });
}

// ===== NOTIFICACIÓN TOAST =====
function mostrarNotificacion(mensaje) {
    const existente = document.querySelector('.esquinita-toast');
    if (existente) existente.remove();

    const toast = document.createElement('div');
    toast.className = 'esquinita-toast';
    toast.innerHTML = mensaje;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== FORMATEAR PRECIO =====
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CL');
}
