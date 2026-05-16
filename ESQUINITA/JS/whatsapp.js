/**
 * =====================================================
 *  LA ESQUINITA - WhatsApp (whatsapp.js)
 * =====================================================
 *  Genera el mensaje formateado del pedido
 *  y abre la conversación de WhatsApp.
 *
 *  Depende de: app.js (CONFIG, formatearPrecio, mostrarNotificacion)
 *              carrito.js (obtenerCarrito, calcularTotal, vaciarCarrito)
 * =====================================================
 */

/**
 * Genera un mensaje con todos los productos del carrito
 * y abre WhatsApp para enviarlo.
 */
function enviarPedidoWhatsApp() {
    const cart = obtenerCarrito();

    if (cart.length === 0) {
        mostrarNotificacion('⚠️ Tu carrito está vacío');
        return;
    }

    // Construir mensaje formateado
    let mensaje = '🌭 *PEDIDO - LA ESQUINITA* 🌭\n\n';

    cart.forEach((item, i) => {
        const subtotal = item.precio * item.cantidad;
        mensaje += `${i + 1}. *${item.nombre}*\n`;
        mensaje += `   Cantidad: ${item.cantidad}\n`;
        mensaje += `   Precio c/u: ${formatearPrecio(item.precio)}\n`;
        mensaje += `   Subtotal: ${formatearPrecio(subtotal)}\n\n`;
    });

    const total = calcularTotal();
    const totalItems = cart.reduce((s, i) => s + i.cantidad, 0);

    mensaje += `───────────────\n`;
    mensaje += `📦 *Productos:* ${totalItems}\n`;
    mensaje += `💰 *TOTAL: ${formatearPrecio(total)}*\n\n`;
    mensaje += `📍 *Dirección de entrega:* (indicar aquí)\n`;
    mensaje += `📞 *Nombre:* (indicar aquí)\n`;
    mensaje += `\n¡Gracias por elegir La Esquinita! 🔥`;

    // Abrir WhatsApp con el mensaje codificado
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}
