const state = {
  productos: [],
  categorias: [],
  clientes: [],
  proveedores: [],
  ventas: [],
  ventasAbiertas: [],
  ventaActual: null,
  compras: [],
  descuentos: [],
  faltantes: [],
  reembolsos: [],
  correcciones: [],
  reportes: [],
  usuarios: [
    {
      id: 'USER-ADMIN-001',
      nombre: 'Administrador',
      usuario: 'admin',
      rol: 'admin',
      activo: true,
      fechaCreacion: '01/04/2026'
    },
    {
      id: 'USER-CAJERO-001',
      nombre: 'Cajero Principal',
      usuario: 'cajero',
      rol: 'cajero',
      activo: true,
      fechaCreacion: '01/04/2026'
    }
  ],
  rolActual: null, // null hasta que inicie sesión
  usuarioActual: null,
  logueado: false,
  productCounter: 1000,
  saleCounter: 5000,
  purchaseCounter: 3000,
  discountCounter: 7000,
  missingCounter: 6000,
  refundCounter: 8000,
  correctionCounter: 9000
};

function generateProductCode() {
  return `PROD-${++state.productCounter}`;
}

function generateSaleId() {
  return `VTA-${++state.saleCounter}`;
}

function generatePurchaseId() {
  return `CMP-${++state.purchaseCounter}`;
}

function generateDiscountId() {
  return `DESC-${++state.discountCounter}`;
}

function generateMissingItemId() {
  return `FALT-${++state.missingCounter}`;
}

function generateRefundId() {
  return `REEM-${++state.refundCounter}`;
}

function generateCorrectionId() {
  return `CORR-${++state.correctionCounter}`;
}

function getState() {
  return state;
}

function setState(newState) {
  Object.assign(state, newState);
}