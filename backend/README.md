# Papel & Luna POS Backend

Backend REST + Socket.IO para reemplazar Google Sheets con MySQL.

## Requisitos

- Node.js 20+
- MySQL 8+
- Base de datos creada, por ejemplo: `papel_luna_pos`

## Configuración

1. Copiar `.env.example` a `.env`.
2. Ajustar credenciales MySQL.
3. Instalar dependencias con `npm install`.
4. Ejecutar migraciones y seeders:

```bash
npm run db:migrate
npm run db:seed
```

## Ejecutar

```bash
npm run dev
```

API local:

```text
http://localhost:8000/api
```

Health check:

```text
GET /api/health
```

## Usuarios De Prueba

- `admin` / `admin123`
- `encargado` / `encargado123`
- `cajero` / `cajero123`

## Flujo Principal

- Login: `POST /api/auth/login`
- Productos: `/api/products`
- Ventas: `/api/sales`
- Compras: `/api/purchases`
- Clientes: `/api/customers`
- Proveedores: `/api/suppliers`
- Reportes: `/api/reports/dashboard`

## Nota De Diseño

El backend es la fuente de verdad. Las ventas descuentan stock usando transacciones SQL; las compras aumentan stock; los reembolsos pueden devolver stock. El frontend actual debe cambiar `js/api.js` para consumir esta API en vez de Google Sheets.
