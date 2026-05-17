# 📂 Estructura del Proyecto - La Esquinita

## ⚠️ REGLA CLAVE
> **`index.html` DEBE estar en la RAÍZ de ESQUINITA, NO dentro de una subcarpeta.**
> Si lo metes en `frontend/` o cualquier carpeta, live-server mostrará un listado de archivos.

---

## ✅ ESTRUCTURA CORRECTA

```
ESQUINITA/                       ← RAÍZ DEL PROYECTO (abre VS Code AQUÍ)
│
│── index.html                   ← 🏠 Página principal
│── package.json                 ← Scripts (npm run frontend, npm run dev)
│── .gitignore                   ← Archivos ignorados por Git
│── .liveignore                  ← Oculta backend del servidor web
│── README.md
│
├── css/
│   ├── style.css                ← Estilos principales
│   └── pago.css                 ← Estilos de métodos de pago
│
├── js/
│   ├── app.js                   ← Lógica core (navbar, componentes)
│   ├── carrito.js               ← Carrito + métodos de pago
│   └── whatsapp.js              ← Generar mensaje WhatsApp
│
├── pages/
│   ├── menu.html                ← Menú completo
│   ├── carrito.html             ← Página del carrito
│   └── contacto.html            ← Página de contacto
│
├── components/
│   ├── nav.html                 ← Navbar (se carga dinámicamente)
│   └── footer.html              ← Footer (se carga dinámicamente)
│
├── assets/
│   └── img/
│       └── products/
│           ├── vienesas/        ← hot-dog.webp, completo.webp...
│           ├── churrascos/      ← italino.webp, brasileno.webp...
│           ├── ass/
│           ├── empanadas/
│           ├── papas/
│           ├── salchipapas/
│           ├── chorrillanas/
│           ├── fajitas/
│           └── supremas/
│
└── backend/                     ← 🖥️ SERVIDOR (corre APARTE, puerto 4000)
    ├── server.js
    ├── package.json             ← Tiene su propio package.json
    ├── .env                     ← Variables de entorno (NO subir a Git)
    ├── .env.example
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── Producto.js
    │   ├── Pedido.js
    │   └── Ingrediente.js
    ├── routes/
    │   ├── productos.js
    │   ├── pedidos.js
    │   └── ingredientes.js
    └── middleware/
        └── errorHandler.js
```

---

## ❌ ESTRUCTURA INCORRECTA (lo que probablemente tienes)

```
ESQUINITA/
├── frontend/                    ← ❌ NO hagas esto
│   ├── index.html               ← Live-server no lo encuentra aquí
│   ├── css/
│   └── js/
└── backend/
```

---

## 🔧 CÓMO ARREGLARLO

### Si tienes la estructura incorrecta, ejecuta estos comandos:

```bash
# Desde la raíz de ESQUINITA
# 1. Mover todo el contenido de frontend/ a la raíz
mv frontend/index.html .
mv frontend/css .
mv frontend/js .
mv frontend/pages .
mv frontend/components .
mv frontend/assets .

# 2. Eliminar la carpeta frontend vacía
rm -rf frontend

# 3. Verificar que index.html esté en la raíz
ls index.html   # Debe mostrar: index.html
```

### En Windows (PowerShell):
```powershell
# Desde la raíz de ESQUINITA
Move-Item frontend\index.html .
Move-Item frontend\css .
Move-Item frontend\js .
Move-Item frontend\pages .
Move-Item frontend\components .
Move-Item frontend\assets .
Remove-Item frontend -Recurse -Force

# Verificar
dir index.html
```

---

## 🚀 CÓMO CORRER EL PROYECTO

### Solo Frontend (sin backend):
```bash
npm run frontend
# O directamente:
npx live-server --port=3000 --open=index.html --ignore=backend
```

### Solo Backend:
```bash
npm run backend
# O directamente:
cd backend && npm run dev
```

### AMBOS a la vez (recomendado para desarrollo):
```bash
npm install              # Solo la primera vez (instala concurrently)
npm run install-backend  # Solo la primera vez (instala deps del backend)
npm run dev              # Levanta frontend:3000 + backend:4000
```

---

## 💡 ¿POR QUÉ FUNCIONA ASÍ?

- **`live-server`** busca `index.html` en la carpeta desde donde se ejecuta.
- Si NO encuentra `index.html`, muestra un listado de carpetas.
- El archivo `.liveignore` le dice a live-server que IGNORE la carpeta `backend/`,
  así no aparece en el navegador.
- El backend corre en un **puerto diferente** (4000), es invisible para el usuario.

---

## 🏗️ PUERTOS

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend (live-server) | 3000 | http://localhost:3000 |
| Backend (Express API) | 4000 | http://localhost:4000/api |
| MongoDB | 27017 | mongodb://localhost:27017 |
