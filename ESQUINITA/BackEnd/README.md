# 🌭 La Esquinita - Backend API

## Instalación

```bash
cd backend
npm install
cp .env.example .env    # Configura tus variables
npm run dev             # Inicia con nodemon (desarrollo)
```

## Requisitos
- Node.js 18+
- MongoDB (local o Atlas)

## Endpoints API

### Productos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/productos | Listar (?categoria=X&disponible=true) |
| GET | /api/productos/:id | Obtener uno |
| POST | /api/productos | Crear |
| PUT | /api/productos/:id | Actualizar |
| PATCH | /api/productos/:id/disponibilidad | Toggle on/off |
| DELETE | /api/productos/:id | Eliminar |
| GET | /api/productos/check/disponibilidad | Verificar stock |

### Pedidos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/pedidos | Listar (?estado=X&fecha=YYYY-MM-DD) |
| GET | /api/pedidos/:id | Obtener uno |
| POST | /api/pedidos | Crear pedido |
| PATCH | /api/pedidos/:id/estado | Cambiar estado |
| GET | /api/pedidos/stats/resumen | Estadísticas del día |

### Ingredientes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/ingredientes | Listar |
| GET | /api/ingredientes/alertas | Stock bajo ⚠️ |
| POST | /api/ingredientes | Crear |
| PUT | /api/ingredientes/:id | Actualizar |
| PATCH | /api/ingredientes/:id/stock | Ajustar stock (+/-) |
| DELETE | /api/ingredientes/:id | Eliminar |

## Estructura de Pedido (JSON)
```json
{
  "productos": [
    { "nombre": "Churrasco Brasileño", "precio": 4000, "cantidad": 2, "categoria": "Churrascos" }
  ],
  "total": 8000,
  "metodoPago": "efectivo",
  "cliente": { "nombre": "Juan", "telefono": "+56912345678", "direccion": "Calle 123, Renca" },
  "delivery": true
}
```
