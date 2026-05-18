# Papel & Luna POS — MVP 3

Sistema de punto de venta full-stack para papelería. Frontend SPA en Vanilla JS + backend Node.js/Express con SQLite (desarrollo) o MySQL (producción).

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JS (SPA) |
| Backend | Node.js 20 + Express 5 |
| ORM | Sequelize 6 |
| BD Desarrollo | SQLite (sin configuración extra) |
| BD Producción | MySQL 8+ |
| Autenticación | JWT + bcrypt |
| Tiempo real | Socket.IO |
| Validación | Zod |
| Seguridad | Helmet, CORS, rate limiting |

---

## Instalación y arranque local

### 1. Clonar o descomprimir el proyecto

```bash
cd "Tarea 23"
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Variables de entorno

El archivo `.env` ya está incluido con valores para desarrollo local (SQLite, sin MySQL). Para personalizarlo:

```env
NODE_ENV=development   # Usa SQLite automáticamente
PORT=8000
JWT_SECRET=papel_luna_dev_secret_change_before_production
IVA_RATE=0.19
```

### 4. Ejecutar migraciones y datos de prueba

```bash
# Crear las tablas
npx sequelize-cli db:migrate

# Cargar datos de prueba (usuarios, productos, categorías)
node seed.js
```

### 5. Iniciar el servidor

```bash
npm run dev     # Desarrollo con auto-reload
npm start       # Producción
```

El backend sirve también el frontend estático. Abrir en el navegador:

```
http://localhost:8000
```

---

## Usuarios de prueba

| Usuario | Contraseña | Rol    | Accesos |
|---------|-----------|--------|---------|
| admin   | admin123  | Admin  | Todo el sistema |
| cajero  | cajero123 | Cajero | POS, historial, faltantes, clientes |

---

## Funcionalidades implementadas

### Ventas
- ✅ Crear venta nueva con múltiples ítems
- ✅ Buscar y agregar productos al carrito
- ✅ Modificar cantidades y remover productos
- ✅ Cálculo automático de subtotal, IVA (19%) y total
- ✅ Pausar venta y retomarla después
- ✅ Métodos de pago: Efectivo, Nequi, Tarjeta, Transferencia, Debe
- ✅ Asociación de cliente obligatoria en método "Debe"
- ✅ Generar comprobante/factura inmediatamente
- ✅ Ver factura desde el historial
- ✅ Historial con 6 filtros (texto, estado, método, fecha, monto mín/máx)

### Descuentos (nuevo en MVP 3)
- ✅ CRUD completo de descuentos predefinidos
- ✅ Tipo porcentaje (0-100%) o monto fijo ($)
- ✅ Aplicar descuento en el momento de la venta
- ✅ Validación: no permite totales negativos
- ✅ Solo un descuento activo por venta
- ✅ Persistencia real en base de datos

### Correcciones de ventas (admin)
- ✅ Modificar ítems y cantidades de ventas cerradas
- ✅ Cambiar cliente asociado a la venta
- ✅ Cambiar método de pago
- ✅ Recálculo automático de totales
- ✅ Registro de quién corrigió y cuándo
- ✅ Ajuste automático del inventario

### Reembolsos (admin)
- ✅ Reembolso parcial (por ítem y cantidad)
- ✅ Reembolso total
- ✅ Motivo obligatorio
- ✅ Opción de retornar al inventario (checkbox configurable)
- ✅ Persistencia en base de datos

### Inventario
- ✅ CRUD completo de productos
- ✅ Actualización automática por ventas
- ✅ Actualización automática por compras
- ✅ Ajuste por correcciones y reembolsos
- ✅ Historial de movimientos de inventario
- ✅ Alertas de stock bajo

### Faltantes
- ✅ Registrar productos agotados o no registrados
- ✅ Listar y filtrar
- ✅ Marcar como resuelto via API
- ✅ Eliminar (admin)

### Compras a proveedores
- ✅ Registrar compra con múltiples ítems
- ✅ Seleccionar proveedor
- ✅ Actualización automática de stock

### Autenticación y roles
- ✅ Login con JWT (8h de duración)
- ✅ Validación de sesión al recargar
- ✅ Logout
- ✅ Rol admin: acceso completo
- ✅ Rol cajero: acceso restringido
- ✅ Restricciones en backend y frontend

### Reportes (admin)
- ✅ Ventas por rango de fechas
- ✅ Productos más vendidos (top 20)
- ✅ Inventario con valor y margen
- ✅ Compras por rango de fechas
- ✅ Faltantes frecuentes

---

## Endpoints de la API

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor y base de datos |
| POST | `/api/auth/login` | Iniciar sesión — retorna JWT |
| GET | `/api/auth/me` | Usuario autenticado |
| POST | `/api/auth/logout` | Cerrar sesión |

### Catálogo
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/api/products` | Listar productos | Todos |
| POST | `/api/products` | Crear producto | Admin |
| PATCH | `/api/products/:id` | Editar producto | Admin |
| DELETE | `/api/products/:id` | Eliminar producto | Admin |
| GET/POST | `/api/categories` | Listar / crear categorías | Todos/Admin |
| PATCH/DELETE | `/api/categories/:id` | Editar / eliminar | Admin |

### Ventas
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/api/sales` | Listar ventas | Todos |
| GET | `/api/sales/:id` | Detalle de venta | Todos |
| POST | `/api/sales` | Crear venta | Todos |
| POST | `/api/sales/:id/cancel` | Anular venta | Admin |
| POST | `/api/sales/:id/correct` | Corregir venta | Admin |
| POST | `/api/sales/:id/refunds` | Reembolso parcial/total | Admin |
| PATCH | `/api/sales/:id` | Actualizar estado | Admin |

### Descuentos
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/api/discounts` | Listar descuentos | Todos |
| POST | `/api/discounts` | Crear descuento | Admin |
| PATCH | `/api/discounts/:id` | Editar descuento | Admin |
| DELETE | `/api/discounts/:id` | Eliminar descuento | Admin |

### Compras
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/api/purchases` | Listar compras | Todos |
| POST | `/api/purchases` | Registrar compra | Admin |

### Entidades
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST/PATCH/DELETE | `/api/customers` | Clientes |
| GET/POST/PATCH/DELETE | `/api/suppliers` | Proveedores |
| GET/POST/PATCH/DELETE | `/api/users` | Usuarios (admin) |
| GET/POST/PATCH/DELETE | `/api/missing-requests` | Faltantes |

### Reportes (admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reports/dashboard` | KPIs globales |
| GET | `/api/reports/sales?desde=&hasta=` | Ventas por rango |
| GET | `/api/reports/products?desde=&hasta=` | Productos más vendidos |
| GET | `/api/reports/inventory` | Estado del inventario |
| GET | `/api/reports/purchases?desde=&hasta=` | Compras por rango |
| GET | `/api/reports/missing?desde=&hasta=` | Faltantes frecuentes |

---

## Pruebas de endpoints con curl

```bash
# 1. Login (guarda el token)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Usar TOKEN del paso anterior en los siguientes comandos

# 2. Health check
curl http://localhost:8000/api/health

# 3. Listar productos
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer $TOKEN"

# 4. Crear descuento
curl -X POST http://localhost:8000/api/discounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Descuento estudiante","type":"porcentaje","value":10,"description":"Con carné"}'

# 5. Crear venta
curl -X POST http://localhost:8000/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"paymentMethod":"efectivo","amountReceived":10000,"items":[{"productId":"UUID","quantity":1}]}'

# 6. Reporte de ventas de hoy
curl "http://localhost:8000/api/reports/sales?desde=$(date +%Y-%m-%d)&hasta=$(date +%Y-%m-%d)" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Despliegue en producción

### Opción A: Todo en Railway (recomendado — frontend + backend juntos)

1. Crear cuenta en [railway.app](https://railway.app)
2. Nuevo proyecto → Deploy from GitHub repo
3. Configurar el **Root Directory** como `backend/`
4. Agregar servicio de base de datos MySQL en Railway
5. En **Variables de entorno** del servicio, agregar:

```env
NODE_ENV=production
PORT=8000
JWT_SECRET=<clave-segura-32-chars>
IVA_RATE=0.19
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
FRONTEND_URL=*
```

6. Railway ejecuta automáticamente `npm install` y `node src/server.js`
7. Ejecutar migraciones una vez:
   ```bash
   # Desde Railway CLI o la terminal del servicio
   npx sequelize-cli db:migrate
   node seed.js
   ```
8. La URL que da Railway sirve tanto el frontend como la API

### Opción B: Frontend en Netlify + Backend en Railway (separados)

**Backend en Railway:**
1. Mismo proceso que Opción A
2. Anotar la URL del backend (ej: `https://papel-luna.up.railway.app`)
3. Agregar esa URL en `FRONTEND_URL`

**Frontend en Netlify:**
1. Crear cuenta en [netlify.com](https://netlify.com)
2. Arrastrar la carpeta raíz del proyecto (no `backend/`) a Netlify
3. **Build settings:** no build command, publish directory = `.`
4. Editar `js/config.js` y cambiar `_productionApiUrl`:
   ```javascript
   _productionApiUrl: "https://tu-backend.up.railway.app/api"
   ```
5. Redesplegar

---

## Estructura del proyecto

```
Tarea 23/
├── index.html              # SPA principal
├── netlify.toml            # Config de despliegue en Netlify
├── css/styles.css          # Estilos glassmorphism
├── js/
│   ├── config.js           # URL del API y constantes
│   ├── state.js            # Estado global de la app
│   ├── api.js              # Capa HTTP con el backend
│   ├── app.js              # Inicialización, navegación, roles
│   ├── products.js         # Lógica de productos
│   ├── sales.js            # Lógica de ventas y carrito
│   ├── reports.js          # Generación de reportes
│   └── ui.js               # Renderizado de todas las vistas
└── backend/
    ├── src/
    │   ├── server.js           # Entry point
    │   ├── app.js              # Express + CORS + middlewares
    │   ├── models/             # Sequelize ORM (19 modelos)
    │   │   └── discount.model.js  # Nuevo en MVP 3
    │   ├── controllers/        # Handlers HTTP
    │   ├── services/           # Lógica de negocio (transacciones)
    │   ├── routes/             # Definición de rutas REST
    │   ├── middlewares/        # auth, validate, error, logger
    │   ├── validators/         # Esquemas Zod
    │   └── config/             # database.js, env.js
    ├── migrations/             # Esquema de BD (versionado)
    │   └── 20260517000400-create-discounts.js  # Nuevo en MVP 3
    ├── seed.js                 # Datos iniciales
    ├── railway.toml            # Config despliegue Railway
    ├── .env.example            # Plantilla de variables de entorno
    └── papel_luna_pos.sqlite   # BD de desarrollo
```

---

## Base de datos — Tablas

| Tabla | Descripción |
|-------|-------------|
| `roles` | Roles del sistema (admin, cajero) |
| `users` | Usuarios con hash bcrypt |
| `categories` | Categorías de productos |
| `products` | Catálogo de productos |
| `customers` | Clientes |
| `suppliers` | Proveedores |
| `sales` | Ventas con totales, IVA, descuento, método de pago |
| `sale_items` | Ítems de cada venta |
| `discounts` | Descuentos predefinidos (nuevo MVP 3) |
| `purchases` | Órdenes de compra |
| `purchase_items` | Ítems de cada compra |
| `refunds` | Reembolsos |
| `refund_items` | Ítems reembolsados |
| `sale_corrections` | Historial de correcciones con before/after |
| `inventory_movements` | Auditoría completa de cambios de stock |
| `audit_logs` | Log de acciones de usuarios |
| `missing_requests` | Faltantes registrados |
| `settings` | Configuración clave-valor |
| `request_logs` | Log de peticiones HTTP |
