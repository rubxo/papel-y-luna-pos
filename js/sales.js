function startSale() {
  state.ventaActual = {
    id: generateSaleId(),
    fecha: new Date().toLocaleDateString(),
    items: [],
    subtotal: 0,
    descuentoValor: 0,   // valor original ingresado (% o $)
    descuento: 0,         // valor monetario calculado (para mostrar)
    descuentoTipo: 'porcentaje', // 'porcentaje' o 'monto'
    impuesto: 0,
    total: 0,
    metodoPago: null
  };
}

function addItemToSale(productoId, cantidad = 1) {
  const product = getProductById(productoId);
  if (!product) { showToast("Producto no encontrado", "error"); return false; }
  if (product.stock < cantidad) { showToast(`Stock insuficiente. Disponible: ${product.stock}`, "warning"); return false; }

  const existingItem = state.ventaActual.items.find(item => item.id === productoId);
  if (existingItem) {
    if (product.stock < existingItem.cantidad + cantidad) { showToast("Stock insuficiente para esta cantidad", "warning"); return false; }
    existingItem.cantidad += cantidad;
  } else {
    state.ventaActual.items.push({
      id: productoId,
      nombre: product.nombre,
      precio: product.precio,
      cantidad: cantidad,
      subtotal: product.precio * cantidad
    });
  }

  calculateSaleTotals();
  return true;
}

function changeItemQuantity(productoId, newQty) {
  const item = state.ventaActual.items.find(item => item.id === productoId);
  if (!item) return false;

  const product = getProductById(productoId);
  if (!product) return false;

  if (newQty > product.stock) { showToast(`Stock insuficiente. Disponible: ${product.stock}`, "warning"); return false; }
  if (newQty <= 0) { removeItemFromSale(productoId); return true; }

  item.cantidad = newQty;
  item.subtotal = product.precio * newQty;
  calculateSaleTotals();
  return true;
}

function removeItemFromSale(productoId) {
  const index = state.ventaActual.items.findIndex(item => item.id === productoId);
  if (index > -1) {
    state.ventaActual.items.splice(index, 1);
    calculateSaleTotals();
    return true;
  }
  return false;
}

function calculateSaleTotals() {
  state.ventaActual.subtotal = state.ventaActual.items.reduce((sum, item) => sum + item.subtotal, 0);

  // Calcular descuento siempre desde descuentoValor (valor original), nunca sobreescribir
  const dv = state.ventaActual.descuentoValor || 0;
  if (state.ventaActual.descuentoTipo === 'porcentaje') {
    state.ventaActual.descuento = (state.ventaActual.subtotal * dv) / 100;
  } else {
    state.ventaActual.descuento = Math.min(dv, state.ventaActual.subtotal);
  }

  const subtotalConDescuento = state.ventaActual.subtotal - state.ventaActual.descuento;
  state.ventaActual.impuesto = subtotalConDescuento * 0.19;
  state.ventaActual.total = subtotalConDescuento + state.ventaActual.impuesto;
}

async function closeSale(metodoPago, valorRecibido) {
  if (state.ventaActual.items.length === 0) { showToast("La venta no tiene items", "warning"); return false; }
  if (state.ventaActual.total > valorRecibido) { showToast("Dinero insuficiente", "error"); return false; }

  let stockOk = true;
  state.ventaActual.items.forEach(item => {
    const product = getProductById(item.id);
    if (product) product.stock -= item.cantidad;
    else stockOk = false;
  });

  if (!stockOk) showToast("Error descontando stock", "warning");

  const ventaCerrada = {
    id: state.ventaActual.id,
    fecha: state.ventaActual.fecha,
    itemsJson: JSON.stringify(state.ventaActual.items),
    subtotal: state.ventaActual.subtotal.toFixed(2),
    impuesto: state.ventaActual.impuesto.toFixed(2),
    total: state.ventaActual.total.toFixed(2),
    metodoPago: metodoPago,
    cambio: (valorRecibido - state.ventaActual.total).toFixed(2),
    estado: "cerrada"
  };

  const success = await saveSheetData("ventas", ventaCerrada);
  if (success) {
    state.ventas.push(ventaCerrada);
    state.ventaActual = null;
    showToast("Venta cerrada exitosamente", "success");
    return true;
  } else {
    showToast("Error guardando venta", "error");
    return false;
  }
}

function pausarVentaActual() {
  if (!state.ventaActual || state.ventaActual.items.length === 0) { showToast("No hay venta actual para pausar", "warning"); return false; }
  state.ventasAbiertas.push({
    id: state.ventaActual.id, fecha: state.ventaActual.fecha,
    items: [...state.ventaActual.items],
    subtotal: state.ventaActual.subtotal, impuesto: state.ventaActual.impuesto, total: state.ventaActual.total
  });
  state.ventaActual = null;
  showToast("Venta pausada", "success");
  return true;
}

function retomarVenta(idAbierta) {
  const openSale = state.ventasAbiertas.find(v => v.id === idAbierta);
  if (!openSale) { showToast("Venta no encontrada", "error"); return false; }
  state.ventaActual = {
    id: openSale.id, fecha: openSale.fecha,
    items: [...openSale.items],
    subtotal: openSale.subtotal, impuesto: openSale.impuesto, total: openSale.total, metodoPago: null
  };
  const index = state.ventasAbiertas.indexOf(openSale);
  state.ventasAbiertas.splice(index, 1);
  showToast("Venta reanudada", "success");
  return true;
}

function getSalesHistory() {
  return state.ventas;
}

// ===== DESCUENTOS =====
function applyDiscountToSale(cantidad, tipo = 'porcentaje') {
  if (!state.ventaActual) { showToast("No hay venta activa", "error"); return false; }
  if (cantidad < 0) { showToast("El descuento no puede ser negativo", "error"); return false; }
  if (tipo === 'porcentaje' && cantidad > 100) { showToast("El porcentaje no puede superar 100%", "error"); return false; }

  // Guardar el valor original para recalcular correctamente cuando cambien los ítems
  state.ventaActual.descuentoValor = cantidad;
  state.ventaActual.descuentoTipo = tipo;

  calculateSaleTotals();
  showToast(`Descuento aplicado: ${cantidad}${tipo === 'porcentaje' ? '%' : '$'}`, "success");
  return true;
}

function createDiscount(nombre, porcentaje, condiciones) {
  const descuento = {
    id: generateDiscountId(),
    nombre: nombre,
    porcentaje: porcentaje,
    condiciones: condiciones,
    fecha: new Date().toLocaleDateString(),
    activo: true
  };
  return descuento;
}

async function saveDiscount(descuento) {
  state.descuentos.push(descuento);
  const saved = await saveSheetData("descuentos", descuento);
  if (saved) {
    showToast("Descuento guardado exitosamente", "success");
    return true;
  } else {
    showToast("Error guardando descuento", "error");
    return false;
  }
}

// ===== FALTANTES =====
function recordMissingItem(productoNombre, productoId, cantidad, clienteNombre) {
  const faltante = {
    id: generateMissingItemId(),
    productoNombre: productoNombre,
    productoId: productoId,
    cantidad: cantidad,
    clienteNombre: clienteNombre,
    fecha: new Date().toLocaleDateString(),
    estado: "pendiente"
  };
  return faltante;
}

async function saveMissingItem(faltante) {
  state.faltantes.push(faltante);
  const saved = await saveSheetData("faltantes", faltante);
  if (saved) {
    showToast("Faltante registrado exitosamente", "success");
    return true;
  } else {
    showToast("Error guardando faltante", "error");
    return false;
  }
}

function resolveMissingItem(faltanteId) {
  const faltante = state.faltantes.find(f => f.id === faltanteId);
  if (faltante) {
    faltante.estado = "resuelto";
    showToast("Faltante marcado como resuelto", "success");
    return true;
  }
  return false;
}

// ===== REEMBOLSOS =====
function createRefund(ventaId, monto, razon, tipo = 'total') {
  const venta = state.ventas.find(v => v.id === ventaId);
  if (!venta) { showToast("Venta no encontrada", "error"); return null; }
  
  const reembolso = {
    id: generateRefundId(),
    ventaId: ventaId,
    monto: monto,
    razon: razon,
    tipo: tipo, // 'total' o 'parcial'
    fecha: new Date().toLocaleDateString(),
    estado: "procesado"
  };
  return reembolso;
}

async function saveRefund(reembolso) {
  state.reembolsos.push(reembolso);
  const saved = await saveSheetData("reembolsos", reembolso);
  if (saved) {
    showToast("Reembolso procesado exitosamente", "success");
    return true;
  } else {
    showToast("Error guardando reembolso", "error");
    return false;
  }
}

// ===== CORRECCIONES DE VENTAS =====
function createSaleCorrection(ventaId, razon, cambios) {
  const venta = state.ventas.find(v => v.id === ventaId);
  if (!venta) { showToast("Venta no encontrada", "error"); return null; }
  
  const correccion = {
    id: generateCorrectionId(),
    ventaId: ventaId,
    razon: razon,
    cambios: cambios,
    fecha: new Date().toLocaleDateString(),
    estado: "completada"
  };
  return correccion;
}

async function saveCorrection(correccion) {
  state.correcciones.push(correccion);
  const saved = await saveSheetData("correcciones", correccion);
  if (saved) {
    showToast("Corrección guardada exitosamente", "success");
    return true;
  } else {
    showToast("Error guardando corrección", "error");
    return false;
  }
}