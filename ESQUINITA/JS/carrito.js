/**
 * =====================================================
 *  LA ESQUINITA - Carrito + Métodos de Pago (carrito.js)
 * =====================================================
 */

const PAGO_KEY = 'esquinita_pago';

// ===== BADGE DEL CARRITO =====
function updateCartBadge() {
    const b = document.getElementById('cartCount'); if (!b) return;
    try {
        const c = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
        const t = c.reduce((s, i) => s + (i.cantidad || 1), 0);
        b.textContent = t;
        if (t > 0) { b.style.display = 'inline-flex'; b.classList.add('cart-badge-active'); }
        else { b.style.display = 'none'; b.classList.remove('cart-badge-active'); }
    } catch (e) { b.style.display = 'none'; }
}

// ===== CRUD CARRITO =====
function obtenerCarrito() { try { return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || []; } catch { return []; } }
function guardarCarrito(c) { localStorage.setItem(CONFIG.storageKey, JSON.stringify(c)); updateCartBadge(); }

function agregarAlCarrito(p) {
    try {
        let c = obtenerCarrito();
        const i = c.findIndex(x => x.nombre === p.nombre);
        if (i > -1) c[i].cantidad += (p.cantidad || 1);
        else c.push({ nombre: p.nombre, precio: p.precio, cantidad: p.cantidad || 1, categoria: p.categoria || 'General' });
        guardarCarrito(c);
        mostrarNotificacion(`✅ ${p.nombre} agregado al carrito`);
    } catch (e) { console.error(e); }
}

function eliminarDelCarrito(i) {
    let c = obtenerCarrito(); const n = c[i]?.nombre || 'Producto';
    c.splice(i, 1); guardarCarrito(c);
    mostrarNotificacion(`🗑️ ${n} eliminado`); renderizarCarrito();
}

function actualizarCantidad(i, q) {
    if (q <= 0) { eliminarDelCarrito(i); return; }
    let c = obtenerCarrito(); c[i].cantidad = q; guardarCarrito(c); renderizarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem(CONFIG.storageKey);
    localStorage.removeItem(PAGO_KEY);
    updateCartBadge(); renderizarCarrito();
    mostrarNotificacion('🗑️ Carrito vaciado');
}

function calcularTotal() { return obtenerCarrito().reduce((t, i) => t + (i.precio * i.cantidad), 0); }

// ===== MÉTODO DE PAGO =====
function seleccionarPago(metodo) {
    localStorage.setItem(PAGO_KEY, metodo);

    // Actualizar UI
    document.querySelectorAll('.pago-option').forEach(el => el.classList.remove('pago-selected'));
    const selected = document.querySelector(`.pago-option[data-pago="${metodo}"]`);
    if (selected) selected.classList.add('pago-selected');

    // Mostrar/ocultar datos de transferencia
    const transferInfo = document.getElementById('transfer-info');
    if (transferInfo) {
        transferInfo.style.display = metodo === 'transferencia' ? 'block' : 'none';
    }

    // Actualizar texto del botón
    const btnEnviar = document.getElementById('btn-enviar-pedido');
    if (btnEnviar) {
        const labels = {
            efectivo: '💵 Enviar Pedido (Efectivo)',
            debito: '💳 Enviar Pedido (Débito)',
            transferencia: '🏦 Enviar Pedido (Transferencia)'
        };
        btnEnviar.innerHTML = `<i class="bi bi-whatsapp"></i> ${labels[metodo] || 'Enviar Pedido'}`;
    }
}

function obtenerMetodoPago() {
    return localStorage.getItem(PAGO_KEY) || null;
}

// ===== RENDERIZAR CARRITO =====
function renderizarCarrito() {
    const el = document.getElementById('cart-container'); if (!el) return;
    const cart = obtenerCarrito(), total = calcularTotal();
    const pagoActual = obtenerMetodoPago();

    // --- CARRITO VACÍO ---
    if (cart.length === 0) {
        el.innerHTML = `
            <div class="cart-empty text-center py-5">
                <div class="cart-empty-icon">🛒</div>
                <h3 class="mt-3">Tu carrito está vacío</h3>
                <p class="text-muted">¡Agrega productos desde nuestro menú!</p>
                <a href="menu.html" class="btn btn-primary-custom btn-lg mt-3 px-5">
                    <i class="bi bi-book"></i> Ver Menú
                </a>
            </div>`;
        const s = document.getElementById('cart-summary'); if (s) s.style.display = 'none';
        return;
    }

    // --- TABLA DE PRODUCTOS ---
    let h = `<div class="table-responsive"><table class="table cart-table align-middle">
        <thead><tr><th>Producto</th><th class="text-center">Precio</th><th class="text-center">Cantidad</th>
        <th class="text-center">Subtotal</th><th class="text-center"></th></tr></thead><tbody>`;

    cart.forEach((item, i) => {
        const sub = item.precio * item.cantidad;
        h += `<tr class="cart-item-row">
            <td><div class="cart-product-info"><strong>${item.nombre}</strong>
                <small class="text-muted d-block">${item.categoria}</small></div></td>
            <td class="text-center">${formatearPrecio(item.precio)}</td>
            <td class="text-center"><div class="quantity-controls">
                <button class="btn btn-sm btn-outline-secondary qty-btn" onclick="actualizarCantidad(${i},${item.cantidad - 1})"><i class="bi bi-dash"></i></button>
                <span class="qty-display">${item.cantidad}</span>
                <button class="btn btn-sm btn-outline-secondary qty-btn" onclick="actualizarCantidad(${i},${item.cantidad + 1})"><i class="bi bi-plus"></i></button>
            </div></td>
            <td class="text-center fw-bold">${formatearPrecio(sub)}</td>
            <td class="text-center"><button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${i})"><i class="bi bi-trash3"></i></button></td>
        </tr>`;
    });
    h += `</tbody></table></div>`;
    el.innerHTML = h;

    // --- SECCIÓN DE PAGO + RESUMEN ---
    const s = document.getElementById('cart-summary');
    if (s) {
        s.style.display = 'block';
        const isEfectivo = pagoActual === 'efectivo';
        const isDebito = pagoActual === 'debito';
        const isTransfer = pagoActual === 'transferencia';

        s.innerHTML = `
        <div class="cart-summary-card">
            <!-- MÉTODO DE PAGO -->
            <h5 class="mb-3"><i class="bi bi-credit-card-2-front"></i> Método de Pago</h5>

            <div class="pago-options mb-4">
                <div class="pago-option ${isEfectivo ? 'pago-selected' : ''}" data-pago="efectivo" onclick="seleccionarPago('efectivo')">
                    <span class="pago-icon">💵</span>
                    <span class="pago-name">Efectivo</span>
                    <span class="pago-desc">Pago al recibir</span>
                </div>
                <div class="pago-option ${isDebito ? 'pago-selected' : ''}" data-pago="debito" onclick="seleccionarPago('debito')">
                    <span class="pago-icon">💳</span>
                    <span class="pago-name">Débito</span>
                    <span class="pago-desc">Transbank al recibir</span>
                </div>
                <div class="pago-option ${isTransfer ? 'pago-selected' : ''}" data-pago="transferencia" onclick="seleccionarPago('transferencia')">
                    <span class="pago-icon">🏦</span>
                    <span class="pago-name">Transferencia</span>
                    <span class="pago-desc">Depósito bancario</span>
                </div>
            </div>

            <!-- DATOS DE TRANSFERENCIA (visible solo si seleccionada) -->
            <div id="transfer-info" class="transfer-info-card" style="display:${isTransfer ? 'block' : 'none'};">
                <h6><i class="bi bi-bank"></i> Datos para Transferencia</h6>
                <div class="transfer-data">
                    <div class="transfer-row"><span>Banco</span><strong>BancoEstado</strong></div>
                    <div class="transfer-row"><span>Tipo Cuenta</span><strong>Cuenta RUT / Vista</strong></div>
                    <div class="transfer-row"><span>Nombre</span><strong>La Esquinita</strong></div>
                    <div class="transfer-row"><span>RUT</span><strong>20.139.714-6</strong></div>
                    <div class="transfer-row"><span>Email</span><strong>laesquinita@email.cl</strong></div>
                </div>
                <p class="transfer-note">
                    <i class="bi bi-info-circle"></i> Envía el comprobante de transferencia junto con tu pedido por WhatsApp.
                </p>
            </div>

            <hr>

            <!-- RESUMEN -->
            <h5 class="mb-3"><i class="bi bi-receipt"></i> Resumen del Pedido</h5>
            <div class="summary-line">
                <span>Productos (${cart.reduce((a, b) => a + b.cantidad, 0)})</span>
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

            <!-- BOTONES -->
            <button id="btn-enviar-pedido" class="btn btn-whatsapp w-100 btn-lg mt-4" onclick="enviarPedidoWhatsApp()">
                <i class="bi bi-whatsapp"></i> ${pagoActual ? (pagoActual === 'efectivo' ? '💵 Enviar Pedido (Efectivo)' : pagoActual === 'debito' ? '💳 Enviar Pedido (Débito)' : '🏦 Enviar Pedido (Transferencia)') : 'Selecciona un método de pago'}
            </button>
            <button class="btn btn-outline-danger w-100 mt-2" onclick="vaciarCarrito()">
                <i class="bi bi-trash3"></i> Vaciar Carrito
            </button>
            <a href="menu.html" class="btn btn-outline-warning w-100 mt-2">
                <i class="bi bi-plus-circle"></i> Seguir Comprando
            </a>
        </div>`;
    }
}
