# Papel & Luna POS — v3.0

Sistema de punto de venta full-stack para papelería. Frontend SPA en HTML/CSS/JS vanilla con diseño cálido "Papel & Luna", backend Node.js/Express/Sequelize con SQLite (desarrollo) o MySQL (producción).

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
npm run db:migrate

# Cargar datos de prueba (usuarios, productos, categorías)
npm run db:seed
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
- ✅ Audit log de acciones críticas (login, creación/edición/desactivación de usuarios, cambio de contraseña)

### Gestión de usuarios (admin)
- ✅ CRUD completo de usuarios
- ✅ Activar / desactivar (soft delete — nunca se borran físicamente)
- ✅ Cambio de contraseña por admin o por el propio usuario
- ✅ Campo email opcional
- ✅ Permisos granulares por módulo

### Configuración
- ✅ Endpoint `/api/settings` para leer y actualizar configuración clave-valor
- ✅ Endpoint `/api/audit-log` con paginación y filtros por acción/entidad/fecha

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

### Usuarios (admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar usuarios |
| POST | `/api/users` | Crear usuario |
| PATCH | `/api/users/:id` | Editar usuario |
| PATCH | `/api/users/:id/status` | Activar / desactivar |
| PATCH | `/api/users/:id/password` | Cambiar contraseña (admin) |
| DELETE | `/api/users/:id` | Desactivar (soft delete) |
| GET | `/api/users/me/permissions` | Permisos del usuario actual |
| PATCH | `/api/users/me/password` | Cambiar propia contraseña |

### Entidades
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST/PATCH/DELETE | `/api/customers` | Clientes |
| GET/POST/PATCH/DELETE | `/api/suppliers` | Proveedores |
| GET/POST/PATCH/DELETE | `/api/missing-requests` | Faltantes |

### Configuración y auditoría (admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/settings` | Leer configuración del negocio |
| PUT | `/api/settings/:key` | Actualizar un valor |
| GET | `/api/audit-log` | Log de acciones. Soporta `?page&limit&action&entity&from&to` |
| GET | `/api/roles` | Lista de roles disponibles |

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

### Backend → Render (Web Service)

El archivo `render.yaml` en la raíz del proyecto automatiza la configuración.

1. Conecta el repositorio en [render.com](https://render.com) → **New Web Service**
2. **Root Directory**: `backend`
3. **Build Command**: `npm install && npm run db:migrate && npm run db:seed`
4. **Start Command**: `npm start`
5. Crea un servicio MySQL en Render y copia las credenciales
6. En **Environment** del Web Service agrega:

```env
NODE_ENV=production
JWT_SECRET=<genera con: node -e "console.log(require('crypto').randomBytes(40).toString('hex'))">
FRONTEND_URL=https://papelyluna.netlify.app
DB_HOST=<host MySQL de Render>
DB_PORT=3306
DB_NAME=papel_luna_pos
DB_USER=<usuario>
DB_PASSWORD=<password>
IVA_RATE=0.19
LOW_STOCK_THRESHOLD=10
```

### Frontend → Netlify

1. Arrastra la carpeta raíz del proyecto (**sin** incluir `backend/`) a [netlify.com](https://netlify.com)
2. No requiere build command — es HTML estático
3. En `js/config.js`, reemplaza `_productionApiUrl` con la URL real de Render:
   ```javascript
   _productionApiUrl: "https://papel-y-luna-backend.onrender.com/api"
   ```

### Opción alternativa: todo en Railway

1. Mismo proceso pero sin separar frontend/backend
2. Railway sirve ambos desde el mismo dominio
3. En `FRONTEND_URL` poner `*` o la URL que asigne Railway

---

## Estructura del proyecto

```
Tarea 23/
├── index.html              # SPA principal
├── netlify.toml            # Config de despliegue en Netlify
├── css/styles.css          # Design system "Papel & Luna" (light/dark mode)
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
    ├── seeders/                # Datos iniciales (roles, usuarios, productos)
    ├── .env.example            # Plantilla de variables de entorno
    └── papel_luna_pos.sqlite   # BD de desarrollo (SQLite)
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
