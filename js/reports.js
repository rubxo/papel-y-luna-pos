function parseAppDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;

  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isBetweenDates(value, desde, hasta) {
  const date = parseAppDate(value);
  if (!date) return true;
  const start = desde ? parseAppDate(desde) : null;
  const end = hasta ? parseAppDate(hasta) : null;
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(23, 59, 59, 999);
  return (!start || date >= start) && (!end || date <= end);
}

function getItemsFromRecord(record) {
  if (Array.isArray(record.items)) return record.items;
  if (!record.itemsJson) return [];
  try { return JSON.parse(record.itemsJson); } catch (e) { return []; }
}

function money(value) {
  return Number(value || 0);
}

function generateSalesReport(desde, hasta) {
  const ventasFiltradas = state.ventas.filter(v => isBetweenDates(v.fecha, desde, hasta) && v.estado !== "anulada");
  const totalVentas = ventasFiltradas.reduce((sum, venta) => sum + money(venta.total), 0);
  const totalDescuentos = ventasFiltradas.reduce((sum, venta) => sum + money(venta.descuento), 0);
  const totalImpuestos = ventasFiltradas.reduce((sum, venta) => sum + money(venta.impuesto), 0);
  const totalArticulos = ventasFiltradas.reduce((sum, venta) => sum + getItemsFromRecord(venta).reduce((s, item) => s + Number(item.cantidad || 0), 0), 0);

  return {
    tipo: "Reporte de Ventas",
    periodo: `${desde || "Inicio"} a ${hasta || "Hoy"}`,
    totalVentas: totalVentas.toFixed(2),
    totalDescuentos: totalDescuentos.toFixed(2),
    totalImpuestos: totalImpuestos.toFixed(2),
    totalArticulos,
    cantidadTransacciones: ventasFiltradas.length,
    ticketPromedio: ventasFiltradas.length ? (totalVentas / ventasFiltradas.length).toFixed(2) : "0.00",
    fecha: new Date().toLocaleDateString("es-CO")
  };
}

function generateInventoryReport() {
  const productos = state.productos || [];
  const productosConBajoStock = productos
    .filter(producto => producto.seguimientoInventario !== false && Number(producto.stock || 0) < 10)
    .map(producto => ({ nombre: producto.nombre, stock: producto.stock, precio: producto.precio }));

  const valorTotal = productos.reduce((sum, producto) => sum + Number(producto.stock || 0) * Number(producto.precio || 0), 0);
  const costoTotal = productos.reduce((sum, producto) => sum + Number(producto.stock || 0) * Number(producto.costo || 0), 0);

  return {
    tipo: "Reporte de Inventario",
    totalProductos: productos.length,
    productosAgotados: productos.filter(p => Number(p.stock || 0) === 0).length,
    productosConBajoStock,
    valorTotalInventario: valorTotal.toFixed(2),
    costoTotalInventario: costoTotal.toFixed(2),
    gananciaPotencial: (valorTotal - costoTotal).toFixed(2),
    fecha: new Date().toLocaleDateString("es-CO")
  };
}

function generateClientReport() {
  const clientes = state.clientes || [];
  return {
    tipo: "Reporte de Clientes",
    totalClientes: clientes.length,
    clientesActivos: clientes.filter(c => c.activo !== false).length,
    totalClientesInactivos: clientes.filter(c => c.activo === false).length,
    fecha: new Date().toLocaleDateString("es-CO")
  };
}

function generatePurchaseReport(desde, hasta) {
  const comprasFiltradas = (state.compras || []).filter(c => isBetweenDates(c.fecha, desde, hasta));
  const totalCompras = comprasFiltradas.reduce((sum, compra) => sum + money(compra.total), 0);
  const totalArticulos = comprasFiltradas.reduce((sum, compra) => sum + getItemsFromRecord(compra).reduce((s, item) => s + Number(item.cantidad || 0), 0), 0);

  return {
    tipo: "Reporte de Compras",
    periodo: `${desde || "Inicio"} a ${hasta || "Hoy"}`,
    totalCompras: totalCompras.toFixed(2),
    totalArticulos,
    cantidadTransacciones: comprasFiltradas.length,
    fecha: new Date().toLocaleDateString("es-CO")
  };
}

async function saveReport(reporte) {
  state.reportes.push(reporte);
  saveToLocalStorage("reportes", state.reportes);
  showToast("Reporte generado", "success");
  return true;
}

function filterSalesBy(criteria) {
  let resultado = [...(state.ventas || [])];

  if (criteria.buscar) {
    const q = criteria.buscar.toLowerCase();
    resultado = resultado.filter(v => {
      const items = getItemsFromRecord(v);
      return String(v.id || "").toLowerCase().includes(q) ||
        String(v.numero || "").toLowerCase().includes(q) ||
        String(v.metodoPago || "").toLowerCase().includes(q) ||
        String(v.estado || "").toLowerCase().includes(q) ||
        items.some(item => String(item.nombre || "").toLowerCase().includes(q));
    });
  }

  if (criteria.metodoPago) resultado = resultado.filter(v => v.metodoPago === criteria.metodoPago);
  if (criteria.estado) resultado = resultado.filter(v => (v.estado || "cerrada") === criteria.estado);
  if (criteria.desde || criteria.hasta) resultado = resultado.filter(v => isBetweenDates(v.fecha, criteria.desde, criteria.hasta));

  if (criteria.minimo !== null && criteria.minimo !== undefined) {
    resultado = resultado.filter(v => money(v.total) >= Number(criteria.minimo));
  }

  if (criteria.maximo !== null && criteria.maximo !== undefined) {
    resultado = resultado.filter(v => money(v.total) <= Number(criteria.maximo));
  }

  return resultado;
}

function filterInventoryBy(criteria) {
  let resultado = state.productos || [];
  if (criteria.categoria) resultado = resultado.filter(p => p.categoria === criteria.categoria);
  if (criteria.minStock) resultado = resultado.filter(p => Number(p.stock || 0) <= Number(criteria.minStock));
  if (criteria.buscar) resultado = resultado.filter(p => p.nombre.toLowerCase().includes(criteria.buscar.toLowerCase()));
  return resultado;
}

function filterClientesBy(criteria) {
  let resultado = state.clientes || [];
  if (criteria.activo !== undefined) resultado = resultado.filter(c => c.activo === criteria.activo);
  if (criteria.buscar) {
    const q = criteria.buscar.toLowerCase();
    resultado = resultado.filter(c => String(c.nombre || "").toLowerCase().includes(q) || String(c.correo || c.email || "").toLowerCase().includes(q));
  }
  return resultado;
}
