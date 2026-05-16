/**
 * =====================================================
 *  LA ESQUINITA - WhatsApp + Método de Pago (whatsapp.js)
 * =====================================================
 */

function enviarPedidoWhatsApp() {
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

    const total = calcularTotal();
    const items = cart.reduce((s, i) => s + i.cantidad, 0);

    msg += `───────────────\n`;
    msg += `📦 *Productos:* ${items}\n`;
    msg += `💰 *TOTAL: ${formatearPrecio(total)}*\n\n`;
    msg += `───────────────\n`;
    msg += `💳 *Método de pago:* ${pagoLabels[pago]}\n`;

    // Si es transferencia, agregar recordatorio
    if (pago === 'transferencia') {
        msg += `\n⚠️ *Adjuntar comprobante de transferencia en este chat*\n`;
        msg += `🏦 Datos: BancoEstado - Cuenta RUT/Vista\n`;
        msg += `👤 Nombre: La Esquinita\n`;
        msg += `🔢 RUT: XX.XXX.XXX-X\n`;
    }

    msg += `\n───────────────\n`;
    msg += `📍 *Dirección de entrega:* (indicar aquí)\n`;
    msg += `📞 *Nombre:* (indicar aquí)\n`;
    msg += `\n¡Gracias por elegir La Esquinita! 🔥`;

    // Abrir WhatsApp
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}
