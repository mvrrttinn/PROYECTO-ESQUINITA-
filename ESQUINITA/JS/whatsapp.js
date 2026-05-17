/**
 * =====================================================
 *  LA ESQUINITA - WhatsApp + Método de Pago (whatsapp.js)
 * =====================================================
 */

async function enviarPedidoWhatsApp() {
    const cart = obtenerCarrito();
    if (cart.length === 0) {
        mostrarNotificacion('⚠️ Tu carrito está vacío');
        return;
    }

    // Verificar método de pago seleccionado
    const pago = obtenerMetodoPago();
    if (!pago) {
        mostrarNotificacion('⚠️ Selecciona un método de pago');
        return;
    }

    // Labels de método de pago
    const pagoLabels = {
        efectivo: '💵 Efectivo (pago al recibir)',
        debito: '💳 Débito - Transbank (pago al recibir)',
        transferencia: '🏦 Transferencia Bancaria'
    };

    // Construir mensaje
    let msg = '🌭 *PEDIDO - LA ESQUINITA* 🌭\n\n';

    cart.forEach((item, i) => {
        const sub = item.precio * item.cantidad;
        msg += `${i + 1}. *${item.nombre}*\n`;
        msg += `   Cantidad: ${item.cantidad}\n`;
        msg += `   Precio c/u: ${formatearPrecio(item.precio)}\n`;
        msg += `   Subtotal: ${formatearPrecio(sub)}\n\n`;
    });

    const subtotal = calcularTotal();
    const entregaRenca = esEntregaRenca();
    const deliveryCosto = entregaRenca ? CONFIG.deliveryFeeRenca : 0;
    const total = subtotal + deliveryCosto;
    const items = cart.reduce((s, i) => s + i.cantidad, 0);

    msg += `───────────────\n`;
    msg += `📦 *Productos:* ${items}\n`;
    if (entregaRenca) msg += `🚚 *Delivery Renca:* ${formatearPrecio(deliveryCosto)}\n`;
    msg += `💰 *TOTAL: ${formatearPrecio(total)}*\n\n`;
    msg += `───────────────\n`;
    msg += `💳 *Método de pago:* ${pagoLabels[pago]}\n`;

    // Si es transferencia, agregar recordatorio sin mostrar datos sensibles públicamente
    if (pago === 'transferencia') {
        msg += `\n⚠️ *Adjuntar comprobante de transferencia en este chat*\n`;
        msg += `🏦 Datos: BancoEstado - Cuenta RUT/Vista\n`;
        msg += `👤 Nombre: La Esquinita\n`;
    }

    const direccion = typeof obtenerDireccion === 'function' ? obtenerDireccion() : '';
    const nombreCliente = typeof obtenerClienteNombre === 'function' ? obtenerClienteNombre() : '';
    msg += `\n───────────────\n`;
    msg += `📍 *Dirección de entrega:* ${direccion || '(indicar aquí)'}\n`;
    msg += `📞 *Nombre:* ${nombreCliente || '(indicar aquí)'}\n`;
    msg += `\n¡Gracias por elegir La Esquinita! 🔥`;

    const esPromocional = esPedidoSoloPromocional(cart);

    if (!esPromocional) {
        try {
            await crearPedidoBackend(cart, pago);
            mostrarNotificacion('✅ Pedido guardado en backend. Abriendo WhatsApp...');
        } catch (err) {
            console.warn('No se pudo guardar el pedido en backend:', err);
            mostrarNotificacion('⚠️ Pedido enviado por WhatsApp. Backend no disponible');
        }
    } else {
        mostrarNotificacion('⚠️ Pedido promocional no se guarda en backend. Abriendo WhatsApp...');
    }

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

function esPedidoSoloPromocional(cart) {
    if (!cart || !cart.length) {
        return false;
    }

    return cart.every(item => {
        const categoria = String(item.categoria || '').toLowerCase();
        const nombre = String(item.nombre || '').toLowerCase();
        const esPromo = categoria.includes('promo') || nombre.includes('promo') || nombre.includes('promoción') || nombre.includes('promocion');
        return esPromo || item.promo === true || item.promocional === true;
    });
}

async function crearPedidoBackend(cart, pago) {
    const apiBaseUrl = CONFIG.apiBaseUrl?.replace(/\/$/, '');
    if (!apiBaseUrl) {
        throw new Error('API base no configurada');
    }

    const direccion = typeof obtenerDireccion === 'function' ? obtenerDireccion() : '';
    const nombreCliente = typeof obtenerClienteNombre === 'function' ? obtenerClienteNombre() : 'Cliente WhatsApp';
    const entregaRenca = typeof esEntregaRenca === 'function' ? esEntregaRenca() : false;
    const deliveryCosto = entregaRenca ? CONFIG.deliveryFeeRenca : 0;
    const total = calcularTotal() + deliveryCosto;

    const payload = {
        productos: cart,
        total,
        metodoPago: pago,
        cliente: {
            nombre: nombreCliente,
            telefono: '',
            direccion: direccion
        },
        delivery: entregaRenca,
        deliveryCosto: entregaRenca ? deliveryCosto : 0
    };

    if (pago === 'transferencia') {
        payload.transferencia = {
            referencia: 'Pedido enviado por WhatsApp',
            comprobanteUrl: ''
        };
    }

    const response = await fetch(`${apiBaseUrl}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}`);
    }

    return response.json();
}
