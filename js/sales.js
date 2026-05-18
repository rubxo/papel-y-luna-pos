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
  
  // El precio de venta ya incluye IVA (19%).
  // Extraer el IVA hacia atrás (Base = Total / 1.19, IVA = Total - Base)
  state.ventaActual.total = subtotalConDescuento;
  state.ventaActual.impuesto = subtotalConDescuento - (subtotalConDescuento / 1.19);
}

async function closeSale(metodoPago, valorRecibido) {
  if (state.ventaActual.items.length === 0) { showToast("La venta no tiene items", "warning"); return false; }
  if (state.ventaActual.total > valorRecibido) { showToast("Dinero insuficiente", "error"); return false; }

  if (localStorage.getItem("modoLocal") === "true") {
    for (const item of state.ventaActual.items) {
      const product = getProductById(item.id);
      if (!product) { showToast("Producto no encontrado", "error"); return false; }
      if (product.seguimientoInventario !== false && product.stock < item.cantidad) {
        showToast(`Stock insuficiente. Disponible: ${product.stock}`, "warning");
        return false;
      }
    }

    state.ventaActual.items.forEach(item => {
      const product = getProductById(item.id);
      if (product && product.seguimientoInventario !== false) product.stock -= item.cantidad;
    });

    const ventaCerrada = {
      id: state.ventaActual.id,
      fecha: state.ventaActual.fecha,
      items: [...state.ventaActual.items],
      itemsJson: JSON.stringify(state.ventaActual.items),
      subtotal: state.ventaActual.subtotal,
      descuento: state.ventaActual.descuento,
      descuentoTipo: state.ventaActual.descuentoTipo,
      descuentoValor: state.ventaActual.descuentoValor,
      impuesto: state.ventaActual.impuesto,
      total: state.ventaActual.total,
      metodoPago,
      cambio: metodoPago === "efectivo" ? valorRecibido - state.ventaActual.total : 0,
      estado: "cerrada"
    };

    state.ventas.unshift(ventaCerrada);
    saveToLocalStorage("ventas", state.ventas);
    saveToLocalStorage("productos", state.productos);
    localStorage.setItem("backup_ventas", JSON.stringify(state.ventas));
    localStorage.setItem("backup_productos", JSON.stringify(state.productos));
    state.ventaActual = null;
    showToast("Venta cerrada en modo local", "success");
    return true;
  }

  try {
    const rawClienteId = state.ventaActual.clienteId || null;
    const isValidUUID = rawClienteId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawClienteId);
    const result = await apiRequest("/sales", {
      method: "POST",
      body: JSON.stringify({
        customerId: isValidUUID ? rawClienteId : null,
        paymentMethod: metodoPago,
        amountReceived: valorRecibido,
        discountType: state.ventaActual.descuentoValor > 0 ? state.ventaActual.descuentoTipo : null,
        discountValue: state.ventaActual.descuentoValor || 0,
        items: state.ventaActual.items.map(item => ({
          productId: item.id,
          quantity: item.cantidad
        }))
      })
    });

    const ventaCerrada = mapFromAPI("ventas", result.data);
    state.ventas.unshift(ventaCerrada);
    await loadAllDataFromAPI(true);
    state.ventaActual = null;
    showToast("Venta cerrada exitosamente", "success");
    return true;
  } catch (error) {
    showToast(error.message || "Error guardando venta", "error");
    return false;
  }
}

function pausarVentaActual() {
  if (!state.ventaActual || state.ventaActual.items.length === 0) { 
    showToast("No hay venta actual para pausar", "warning"); 
    return false; 
  }
  state.ventasAbiertas.push({
    id: state.ventaActual.id, 
    fecha: state.ventaActual.fecha,
    items: [...state.ventaActual.items],
    subtotal: state.ventaActual.subtotal, 
    impuesto: state.ventaActual.impuesto, 
    total: state.ventaActual.total
  });
  state.ventaActual = null;
  guardarVentasAbiertas();
  mostrarVentasAbiertas();
  showToast("Venta pausada en espera", "success");
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
  guardarVentasAbiertas();
  mostrarVentasAbiertas();
  showToast("Venta reanudada", "success");
  return true;
}

async function eliminarVentaPausada(idAbierta) {
  const index = state.ventasAbiertas.findIndex(v => v.id === idAbierta);
  if (index === -1) { showToast("Venta no encontrada", "error"); return false; }
  
  const venta = state.ventasAbiertas[index];
  if (await customConfirm(`¿Eliminar la venta en espera ${venta.id}? Total: $${venta.total.toFixed(2)}`)) {
    state.ventasAbiertas.splice(index, 1);
    guardarVentasAbiertas();
    mostrarVentasAbiertas();
    showToast("Venta pausada eliminada", "warning");
    return true;
  }
  return false;
}

function guardarVentasAbiertas() {
  localStorage.setItem("ventasAbiertas", JSON.stringify(state.ventasAbiertas));
}

function cargarVentasAbiertas() {
  const guardadas = localStorage.getItem("ventasAbiertas");
  if (guardadas) {
    try {
      state.ventasAbiertas = JSON.parse(guardadas);
    } catch (e) {
      console.error("Error al cargar ventas abiertas:", e);
    }
  }
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
  if (localStorage.getItem("modoLocal") === "true") {
    state.faltantes.push(faltante);
    showToast("Faltante registrado (modo local)", "success");
    return true;
  }
  try {
    const result = await apiRequest("/missing-requests", {
      method: "POST",
      body: JSON.stringify({
        productName: faltante.nombre,
        type: faltante.estadoProducto === "no registrado" ? "no_registrado" : "agotado",
        quantity: faltante.cantidad ? Number(faltante.cantidad) : null,
        notes: faltante.observacion || null
      })
    });
    const saved = mapFromAPI("faltantes", result.data);
    state.faltantes.unshift(saved);
    showToast("Faltante registrado exitosamente", "success");
    return true;
  } catch (error) {
    showToast(error.message || "Error guardando faltante", "error");
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
