# 🧪 Pruebas de la API — La Esquinita

> Copia y pega estos comandos en tu terminal para probar cada endpoint.
> También puedes usar **Thunder Client** (extensión de VS Code).

## Requisitos
- Backend corriendo: `npm run dev`
- Base con datos: `node seeds/seed.js`

---

## 🟢 Probar en el NAVEGADOR (solo GET)

Simplemente abre estas URLs en Chrome:

```
http://localhost:4000/api/health
http://localhost:4000/api/productos
http://localhost:4000/api/productos?categoria=Churrascos
http://localhost:4000/api/ingredientes
http://localhost:4000/api/ingredientes/alertas
http://localhost:4000/api/pedidos
```

---

## 🔧 Probar con CURL (todos los métodos)

### PRODUCTOS

```bash
# Listar todos los productos
curl http://localhost:4000/api/productos

# Filtrar por categoría
curl "http://localhost:4000/api/productos?categoria=Vienesas"

# Crear un producto nuevo
curl -X POST http://localhost:4000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Churrasco Especial TEST","categoria":"Churrascos","precio":4000,"descripcion":"Producto de prueba"}'

# Actualizar precio (reemplaza ID_DEL_PRODUCTO con un ID real)
curl -X PUT http://localhost:4000/api/productos/ID_DEL_PRODUCTO \
  -H "Content-Type: application/json" \
  -d '{"precio":4500}'

# Desactivar/activar un producto
curl -X PATCH http://localhost:4000/api/productos/ID_DEL_PRODUCTO/disponibilidad
```

### PEDIDOS

```bash
# Listar todos los pedidos
curl http://localhost:4000/api/pedidos

# Crear un pedido nuevo
curl -X POST http://localhost:4000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "productos": [
      {"nombre":"Completo","precio":1700,"cantidad":2,"categoria":"Vienesas"},
      {"nombre":"Papas Fritas Grande","precio":4000,"cantidad":1,"categoria":"Papas Fritas"}
    ],
    "total": 7400,
    "metodoPago": "debito",
    "cliente": {"nombre":"Juan","telefono":"+56912345678","direccion":"Calle 123, Renca"},
    "delivery": true
  }'

# Cambiar estado de un pedido
curl -X PATCH http://localhost:4000/api/pedidos/ID_DEL_PEDIDO/estado \
  -H "Content-Type: application/json" \
  -d '{"estado":"preparando"}'

# Estadísticas del día
curl http://localhost:4000/api/pedidos/stats/resumen
```

### INGREDIENTES

```bash
# Listar todos
curl http://localhost:4000/api/ingredientes

# Ver alertas de stock bajo
curl http://localhost:4000/api/ingredientes/alertas

# Agregar stock (sumar 20 unidades)
curl -X PATCH http://localhost:4000/api/ingredientes/ID_DEL_INGREDIENTE/stock \
  -H "Content-Type: application/json" \
  -d '{"cantidad":20,"operacion":"sumar"}'

# Restar stock
curl -X PATCH http://localhost:4000/api/ingredientes/ID_DEL_INGREDIENTE/stock \
  -H "Content-Type: application/json" \
  -d '{"cantidad":5,"operacion":"restar"}'
```

---

## 💡 TIP: ¿Cómo obtener un ID real?

1. Haz GET a un recurso:
   ```bash
   curl http://localhost:4000/api/productos
   ```
2. Busca el campo `"_id"` en la respuesta:
   ```json
   { "_id": "665f1a2b3c4d5e6f7a8b9c0d", "nombre": "Completo" }
   ```
3. Usa ese ID en los otros comandos.

---

## 📊 Estados de un Pedido

```
pendiente → confirmado → preparando → en_camino → entregado
                                                  ↘ cancelado
```
