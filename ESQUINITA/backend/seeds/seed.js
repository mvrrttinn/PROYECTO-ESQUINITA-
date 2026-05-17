/**
 * =====================================================
 *  LA ESQUINITA - Seed (Datos Iniciales)
 * =====================================================
 *  Ejecutar: node seeds/seed.js
 *  Esto llena la base de datos con todos los productos
 *  del menú, ingredientes y un pedido de prueba.
 * =====================================================
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const Ingrediente = require('../models/Ingrediente');
const Pedido = require('../models/Pedido');

// ===== INGREDIENTES =====
const ingredientes = [
    // Carnes
    { nombre: 'Churrasco vacuno', categoria: 'Carnes', stockActual: 50, stockMinimo: 10, unidad: 'unidad', costoUnitario: 800 },
    { nombre: 'Posta rosada', categoria: 'Carnes', stockActual: 30, stockMinimo: 8, unidad: 'unidad', costoUnitario: 700 },
    { nombre: 'Pollo', categoria: 'Carnes', stockActual: 20, stockMinimo: 5, unidad: 'kg', costoUnitario: 3500 },
    { nombre: 'Tocino', categoria: 'Carnes', stockActual: 15, stockMinimo: 5, unidad: 'paquete', costoUnitario: 2500 },

    // Embutidos
    { nombre: 'Vienesa', categoria: 'Embutidos', stockActual: 100, stockMinimo: 20, unidad: 'unidad', costoUnitario: 200 },

    // Pan
    { nombre: 'Pan de completo', categoria: 'Pan', stockActual: 80, stockMinimo: 15, unidad: 'unidad', costoUnitario: 100 },
    { nombre: 'Pan de churrasco', categoria: 'Pan', stockActual: 50, stockMinimo: 10, unidad: 'unidad', costoUnitario: 150 },
    { nombre: 'Masa empanada', categoria: 'Pan', stockActual: 60, stockMinimo: 15, unidad: 'unidad', costoUnitario: 120 },
    { nombre: 'Tortilla fajita', categoria: 'Pan', stockActual: 20, stockMinimo: 5, unidad: 'unidad', costoUnitario: 200 },

    // Verduras
    { nombre: 'Palta', categoria: 'Verduras', stockActual: 25, stockMinimo: 8, unidad: 'unidad', costoUnitario: 800 },
    { nombre: 'Tomate', categoria: 'Verduras', stockActual: 30, stockMinimo: 10, unidad: 'kg', costoUnitario: 1200 },
    { nombre: 'Lechuga', categoria: 'Verduras', stockActual: 10, stockMinimo: 3, unidad: 'unidad', costoUnitario: 500 },
    { nombre: 'Cebolla', categoria: 'Verduras', stockActual: 15, stockMinimo: 5, unidad: 'kg', costoUnitario: 800 },
    { nombre: 'Champiñón', categoria: 'Verduras', stockActual: 12, stockMinimo: 4, unidad: 'bandeja', costoUnitario: 1500 },
    { nombre: 'Poroto verde', categoria: 'Verduras', stockActual: 8, stockMinimo: 3, unidad: 'kg', costoUnitario: 1200 },
    { nombre: 'Choclo', categoria: 'Verduras', stockActual: 10, stockMinimo: 3, unidad: 'unidad', costoUnitario: 400 },
    { nombre: 'Ají caprí', categoria: 'Verduras', stockActual: 5, stockMinimo: 2, unidad: 'unidad', costoUnitario: 300 },

    // Quesos
    { nombre: 'Queso laminado', categoria: 'Quesos', stockActual: 20, stockMinimo: 5, unidad: 'paquete', costoUnitario: 2000 },
    { nombre: 'Queso cheddar', categoria: 'Quesos', stockActual: 10, stockMinimo: 3, unidad: 'paquete', costoUnitario: 2500 },
    { nombre: 'Queso para empanada', categoria: 'Quesos', stockActual: 15, stockMinimo: 5, unidad: 'kg', costoUnitario: 4000 },

    // Salsas
    { nombre: 'Mayo casera', categoria: 'Salsas', stockActual: 10, stockMinimo: 3, unidad: 'litro', costoUnitario: 1500 },
    { nombre: 'Americana', categoria: 'Salsas', stockActual: 8, stockMinimo: 2, unidad: 'litro', costoUnitario: 1800 },
    { nombre: 'Chucrut', categoria: 'Salsas', stockActual: 5, stockMinimo: 2, unidad: 'kg', costoUnitario: 2000 },

    // Otros
    { nombre: 'Papas (para freír)', categoria: 'Otros', stockActual: 40, stockMinimo: 10, unidad: 'kg', costoUnitario: 1000 },
    { nombre: 'Huevo', categoria: 'Otros', stockActual: 60, stockMinimo: 12, unidad: 'unidad', costoUnitario: 150 },
    { nombre: 'Aceite', categoria: 'Otros', stockActual: 10, stockMinimo: 2, unidad: 'litro', costoUnitario: 2000 },
    { nombre: 'Camarón', categoria: 'Otros', stockActual: 5, stockMinimo: 2, unidad: 'kg', costoUnitario: 8000 },
    { nombre: 'Ciboulette', categoria: 'Verduras', stockActual: 5, stockMinimo: 2, unidad: 'paquete', costoUnitario: 500 },
    { nombre: 'Jamón', categoria: 'Embutidos', stockActual: 10, stockMinimo: 3, unidad: 'paquete', costoUnitario: 2200 }
];

// ===== PRODUCTOS DEL MENÚ =====
const productos = [
    // --- Vienesas ---
    { nombre: 'Hot Dog', categoria: 'Vienesas', descripcion: 'Vienesa en pan con salsas a elección', precio: 1200, precioXL: 1500, imagen: 'vienesas/hot-dog.webp', orden: 1 },
    { nombre: 'Completo', categoria: 'Vienesas', descripcion: 'Vienesa, tomate, palta, mayo, chucrut', precio: 1700, precioXL: 2200, imagen: 'vienesas/completo.webp', orden: 2 },
    { nombre: 'Italiano', categoria: 'Vienesas', descripcion: 'Vienesa, tomate, palta, mayo', precio: 1700, precioXL: 2200, imagen: 'vienesas/italiano.webp', orden: 3 },
    { nombre: 'Dinámico', categoria: 'Vienesas', descripcion: 'Vienesa, tomate, palta, americana, chucrut, mayo', precio: 2500, precioXL: 3000, imagen: 'vienesas/dinamico.webp', orden: 4 },

    // --- Churrascos ---
    { nombre: 'Churrasco Italino', categoria: 'Churrascos', descripcion: 'Churrasco vacuno, tomate, palta, mayo casera', precio: 3500, promo: { activa: true, descripcion: '2x $6.000', precio: 6000 }, imagen: 'churrascos/italino.webp', orden: 1 },
    { nombre: 'Churrasco Chacarero', categoria: 'Churrascos', descripcion: 'Churrasco vacuno, tomate, poroto verde, ají caprí, mayo casera', precio: 3500, promo: { activa: true, descripcion: '2x $6.000', precio: 6000 }, imagen: 'churrascos/chacarero.webp', orden: 2 },
    { nombre: 'Churrasco Luco', categoria: 'Churrascos', descripcion: 'Churrasco vacuno, queso', precio: 3500, promo: { activa: true, descripcion: '2x $6.000', precio: 6000 }, imagen: 'churrascos/luco.webp', orden: 3 },
    { nombre: 'Churrasco Brasileño', categoria: 'Churrascos', descripcion: 'Churrasco vacuno, tomate, palta, queso, mayo casera', precio: 4000, promo: { activa: true, descripcion: '2x $7.000', precio: 7000 }, imagen: 'churrascos/brasileno.webp', orden: 5 },
    { nombre: 'Churrasco Glotón', categoria: 'Churrascos', descripcion: 'Churrasco vacuno, tomate, palta, queso, tocino, mayo casera', precio: 4500, promo: { activa: true, descripcion: '2x $8.000', precio: 8000 }, imagen: 'churrascos/gloton.webp', orden: 10 },

    // --- ASS ---
    { nombre: 'ASS Italino', categoria: 'ASS', descripcion: 'Posta rosada, tomate, palta, mayo casera', precio: 2500, precioXL: 3000, imagen: 'ass/italino.webp', orden: 1 },
    { nombre: 'ASS Dinámico', categoria: 'ASS', descripcion: 'Posta rosada, tomate, palta, chucrut, americana, mayo casera', precio: 3000, precioXL: 3500, imagen: 'ass/dinamico.webp', orden: 4 },
    { nombre: 'ASS Brasileño', categoria: 'ASS', descripcion: 'Posta rosada, tomate, palta, queso derretido, mayo casera', precio: 3000, precioXL: 3500, imagen: 'ass/brasileno.webp', orden: 6 },

    // --- Empanadas Fritas ---
    { nombre: 'Empanada Pollo Queso Ciboulette', categoria: 'Empanadas Fritas', precio: 2000, imagen: 'empanadas/pollo-queso-ciboulette.webp', orden: 1 },
    { nombre: 'Empanada Champiñón Queso', categoria: 'Empanadas Fritas', precio: 2000, imagen: 'empanadas/champinon-queso.webp', orden: 2 },
    { nombre: 'Empanada Churrasco Queso', categoria: 'Empanadas Fritas', precio: 2000, imagen: 'empanadas/churrasco-queso.webp', orden: 3 },
    { nombre: 'Empanada Camarón Queso', categoria: 'Empanadas Fritas', precio: 2000, imagen: 'empanadas/camaron-queso.webp', orden: 4 },
    { nombre: 'Empanada Queso', categoria: 'Empanadas Fritas', precio: 1500, imagen: 'empanadas/queso.webp', orden: 9 },

    // --- Papas Fritas ---
    { nombre: 'Papas Fritas Pequeña', categoria: 'Papas Fritas', precio: 1000, imagen: 'papas/pequena.webp', orden: 1 },
    { nombre: 'Papas Fritas Mediana', categoria: 'Papas Fritas', precio: 2000, imagen: 'papas/mediana.webp', orden: 2 },
    { nombre: 'Papas Fritas Grande', categoria: 'Papas Fritas', precio: 4000, imagen: 'papas/grande.webp', orden: 3 },
    { nombre: 'Papas Fritas Extra Grande', categoria: 'Papas Fritas', precio: 7000, imagen: 'papas/extra-grande.webp', orden: 4 },

    // --- Salchipapas ---
    { nombre: 'Salchipapas Mediana', categoria: 'Salchipapas', precio: 3000, imagen: 'salchipapas/mediana.webp', orden: 1 },
    { nombre: 'Salchipapas Grande', categoria: 'Salchipapas', precio: 5000, imagen: 'salchipapas/grande.webp', orden: 2 },
    { nombre: 'Salchipapas Extra Grande', categoria: 'Salchipapas', precio: 8000, imagen: 'salchipapas/extra-grande.webp', orden: 3 },

    // --- Chorrillanas ---
    { nombre: 'Chorrillana Individual', categoria: 'Chorrillanas', descripcion: 'Papas fritas, vienesas salteadas, huevo frito, cebolla acaramelizada, churrasco o pollo', precio: 6000, imagen: 'chorrillanas/individual.webp', orden: 1 },
    { nombre: 'Chorrillana para 2', categoria: 'Chorrillanas', precio: 11500, imagen: 'chorrillanas/para-2.webp', orden: 2 },
    { nombre: 'Chorrillana Familiar', categoria: 'Chorrillanas', precio: 16500, imagen: 'chorrillanas/familiar.webp', orden: 4 },

    // --- Fajitas ---
    { nombre: 'Fajita (1 unidad)', categoria: 'Fajitas', descripcion: 'Tomate, palta, choclo, lechuga, mayo casera. Base: pollo, carne o champiñón', precio: 4000, imagen: 'fajitas/fajita-1.webp', orden: 1 },
    { nombre: 'Fajitas (2 unidades)', categoria: 'Fajitas', precio: 7000, imagen: 'fajitas/fajitas-2.webp', orden: 2 },

    // --- Supremas & Pinchos ---
    { nombre: 'Suprema Chica', categoria: 'Supremas & Pinchos', descripcion: 'Papas fritas, queso cheddar, ciboulette, tocino a la plancha', precio: 5500, imagen: 'supremas/suprema-chica.webp', orden: 1 },
    { nombre: 'Suprema Grande', categoria: 'Supremas & Pinchos', precio: 10500, imagen: 'supremas/suprema-grande.webp', orden: 3 },
    { nombre: 'Pincho Chico', categoria: 'Supremas & Pinchos', descripcion: 'Papas fritas, vienesa frita, tomate, palta, mayo', precio: 5500, imagen: 'supremas/pincho-chico.webp', orden: 4 },
    { nombre: 'Pincho Grande', categoria: 'Supremas & Pinchos', precio: 10500, imagen: 'supremas/pincho-grande.webp', orden: 6 }
];

// ===== PEDIDO DE PRUEBA =====
const pedidoPrueba = {
    productos: [
        { nombre: 'Churrasco Brasileño', precio: 4000, cantidad: 2, categoria: 'Churrascos' },
        { nombre: 'Completo', precio: 1700, cantidad: 3, categoria: 'Vienesas' },
        { nombre: 'Papas Fritas Grande', precio: 4000, cantidad: 1, categoria: 'Papas Fritas' }
    ],
    total: 17100,
    metodoPago: 'efectivo',
    cliente: {
        nombre: 'Pedido de Prueba',
        telefono: '+56982362728',
        direccion: 'Manuel Rodríguez 1655, Renca'
    },
    delivery: true,
    notas: 'Este es un pedido de prueba generado por el seed'
};


// ===== EJECUTAR SEED =====
async function seed() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/laesquinita');
        console.log('✅ Conectado a MongoDB');

        // Limpiar colecciones existentes
        console.log('\n🗑️  Limpiando base de datos...');
        await Ingrediente.deleteMany({});
        await Producto.deleteMany({});
        await Pedido.deleteMany({});

        // Insertar ingredientes
        console.log('🧅 Insertando ingredientes...');
        const ingredientesCreados = await Ingrediente.insertMany(ingredientes);
        console.log(`   ✅ ${ingredientesCreados.length} ingredientes creados`);

        // Insertar productos
        console.log('🍔 Insertando productos...');
        const productosCreados = await Producto.insertMany(productos);
        console.log(`   ✅ ${productosCreados.length} productos creados`);

        // Insertar pedido de prueba
        console.log('📦 Insertando pedido de prueba...');
        const pedido = await Pedido.create(pedidoPrueba);
        console.log(`   ✅ Pedido creado: ${pedido.numeroPedido}`);

        // Resumen
        console.log('\n' + '='.repeat(45));
        console.log('🎉 SEED COMPLETADO EXITOSAMENTE');
        console.log('='.repeat(45));
        console.log(`   📦 Ingredientes: ${ingredientesCreados.length}`);
        console.log(`   🍔 Productos:    ${productosCreados.length}`);
        console.log(`   🧾 Pedidos:      1 (prueba)`);
        console.log('\n💡 Ahora ejecuta: npm run dev');
        console.log('   Y abre: http://localhost:4000/api/productos\n');

    } catch (error) {
        console.error('❌ Error en seed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
    }
}

seed();
