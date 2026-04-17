// MANEJO DEL ESTADO GLOBAL
let state = {
  productos: [],
  ventas: [],
  compras: [],
  clientes: [],
  proveedores: [],
  categorias: [],
  ventaActual: null,
  ventasAbiertas: [],
  nextProductCode: 1,
  nextSaleId: 1
};

function getState() {
  return state;
}

function setState(newState) {
  state = newState;
}

function generateProductCode() {
  const code = 'PL-' + String(state.nextProductCode).padStart(4, '0');
  state.nextProductCode++;
  return code;
}

function generateSaleId() {
  const id = state.nextSaleId;
  state.nextSaleId++;
  return id;
}
