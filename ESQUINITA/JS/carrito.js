/**
 * =====================================================
 *  LA ESQUINITA - Carrito de Compras (carrito.js)
 * =====================================================
 *  Lógica completa del carrito:
 *  - CRUD de productos en localStorage
 *  - Badge del navbar
 *  - Renderizado en la página del carrito
 *
 *  Depende de: app.js (CONFIG, mostrarNotificacion, formatearPrecio)
 * =====================================================
 */

// ===== BADGE DEL CARRITO =====
/**
 * Actualiza el contador visual del carrito en el navbar.
 *
 * BUG FIX: Cuando hay 0 items, el badge se OCULTA
 * completamente (display: none). Cuando hay items,
 * se muestra con animación.
 */
function updateCartBadge() {
    const cartBadge = document.getElementById('cartCount');
    if (!cartBadge) return;

    try {
        const cart = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 1), 0);

        cartBadge.textContent = totalItems;

        if (totalItems > 0) {
            cartBadge.style.display = 'inline-flex';
            cartBadge.classList.add('cart-badge-active');
        } else {
            // BUG FIX: Ocultar badge cuando es 0
            cartBadge.style.display = 'none';
            cartBadge.classList.remove('cart-badge-active');
        }
    } catch (error) {
        cartBadge.style.display = 'none';
    }
}

// ===== OBTENER CARRITO =====
function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
    } catch {
        return [];
    }
}

// ===== GUARDAR CARRITO =====
function guardarCarrito(cart) {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart));
    updateCartBadge();
}

// ===== AGREGAR AL CARRITO =====
/**
 * @param {Object} producto - { nombre, precio, cantidad, categoria }
 */
function agregarAlCarrito(producto) {
    try {
        let cart = obtenerCarrito();

        // Buscar si el producto ya existe
        const existente = cart.findIndex(item => item.nombre === producto.nombre);

        if (existente > -1) {
            cart[existente].cantidad += (producto.cantidad || 1);
        } else {
            cart.push({
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: producto.cantidad || 1,
                categoria: producto.categoria || 'General'
            });
        }

        guardarCarrito(cart);
        mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`);

    } catch (error) {
        console.error('Error al agregar al carrito:', error);
    }
}

// ===== ELIMINAR DEL CARRITO =====
function eliminarDelCarrito(index) {
    try {
        let cart = obtenerCarrito();
        const nombre = cart[index]?.nombre || 'Producto';
        cart.splice(index, 1);
        guardarCarrito(cart);
        mostrarNotificacion(`🗑️ ${nombre} eliminado del carrito`);
        renderizarCarrito();
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
    }
}

// ===== ACTUALIZAR CANTIDAD =====
function actualizarCantidad(index, nuevaCantidad) {
    try {
        let cart = obtenerCarrito();

        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(index);
            return;
        }

        cart[index].cantidad = nuevaCantidad;
        guardarCarrito(cart);
        renderizarCarrito();
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
    }
}

// ===== VACIAR CARRITO =====
function vaciarCarrito() {
    localStorage.removeItem(CONFIG.storageKey);
    updateCartBadge();
    renderizarCarrito();
    mostrarNotificacion('🗑️ Carrito vaciado');
}

// ===== CALCULAR TOTAL =====
function calcularTotal() {
    const cart = obtenerCarrito();
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// ===== RENDERIZAR CARRITO (página carrito.html) =====
function renderizarCarrito() {
    const container = document.getElementById('cart-container');
    if (!container) return; // Solo ejecutar en carrito.html

    const cart = obtenerCarrito();
    const total = calcularTotal();

    // --- CARRITO VACÍO ---
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty text-center py-5">
                <div class="cart-empty-icon">🛒</div>
                <h3 class="mt-3">Tu carrito está vacío</h3>
                <p class="text-muted">¡Agrega productos desde nuestro menú!</p>
                <a href="menu.html" class="btn btn-primary-custom btn-lg mt-3 px-5">
                    <i class="bi bi-book"></i> Ver Menú
                </a>
            </div>
        `;

        // Ocultar resumen
        const summary = document.getElementById('cart-summary');
        if (summary) summary.style.display = 'none';

        return;
    }

    // --- CARRITO CON PRODUCTOS ---
    let html = `
        <div class="table-responsive">
            <table class="table cart-table align-middle">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th class="text-center">Precio</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-center">Subtotal</th>
                        <th class="text-center">Acción</th>
                    </tr>
                </thead>
                <tbody>
    `;

    cart.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        html += `
                    <tr class="cart-item-row">
                        <td>
                            <div class="cart-product-info">
                                <strong>${item.nombre}</strong>
                                <small class="text-muted d-block">${item.categoria}</small>
                            </div>
                        </td>
                        <td class="text-center">${formatearPrecio(item.precio)}</td>
                        <td class="text-center">
                            <div class="quantity-controls">
                                <button class="btn btn-sm btn-outline-secondary qty-btn" 
                                        onclick="actualizarCantidad(${index}, ${item.cantidad - 1})">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <span class="qty-display">${item.cantidad}</span>
                                <button class="btn btn-sm btn-outline-secondary qty-btn" 
                                        onclick="actualizarCantidad(${index}, ${item.cantidad + 1})">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </td>
                        <td class="text-center fw-bold">${formatearPrecio(subtotal)}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="eliminarDelCarrito(${index})" 
                                    title="Eliminar">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </td>
                    </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;

    // --- RESUMEN ---
    const summary = document.getElementById('cart-summary');
    if (summary) {
        summary.style.display = 'block';
        summary.innerHTML = `
            <div class="cart-summary-card">
                <h4 class="mb-3"><i class="bi bi-receipt"></i> Resumen del Pedido</h4>
                <div class="summary-line">
                    <span>Productos (${cart.reduce((s, i) => s + i.cantidad, 0)})</span>
                    <span>${formatearPrecio(total)}</span>
                </div>
                <div class="summary-line">
                    <span>Delivery</span>
                    <span class="text-success">Consultar</span>
                </div>
                <hr>
                <div class="summary-line summary-total">
                    <span>TOTAL</span>
                    <span>${formatearPrecio(total)}</span>
                </div>
                <button class="btn btn-whatsapp w-100 btn-lg mt-4" onclick="enviarPedidoWhatsApp()">
                    <i class="bi bi-whatsapp"></i> Enviar Pedido por WhatsApp
                </button>
                <button class="btn btn-outline-danger w-100 mt-2" onclick="vaciarCarrito()">
                    <i class="bi bi-trash3"></i> Vaciar Carrito
                </button>
                <a href="menu.html" class="btn btn-outline-warning w-100 mt-2">
                    <i class="bi bi-plus-circle"></i> Seguir Comprando
                </a>
            </div>
        `;
    }
}
