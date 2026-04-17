// ===== REPORTS & USER MANAGEMENT =====

// User Management
function createUser(nombre, usuarioLogin, rol, contraseña) {
  if (!nombre || !usuarioLogin || !rol || !contraseña) { showToast("Datos incompletos", "error"); return null; }
  const usuario = {
    id: `USER-${Date.now()}`,
    nombre: nombre,
    usuario: usuarioLogin,   // campo requerido para el login
    rol: rol,                // 'admin' o 'cajero'
    contraseña: contraseña,
    activo: true,
    fechaCreacion: new Date().toLocaleDateString()
  };
  return usuario;
}

async function saveUser(usuario) {
  state.usuarios.push(usuario);
  const saved = await saveSheetData("usuarios", usuario);
  if (saved) {
    showToast("Usuario creado exitosamente", "success");
    return true;
  } else {
    showToast("Error guardando usuario", "error");
    return false;
  }
}

function loginUser(nombre, contraseña) {
  const usuario = state.usuarios.find(u => u.nombre === nombre && u.contraseña === contraseña);
  if (usuario) {
    state.usuarioActual = usuario;
    state.rolActual = usuario.rol;
    showToast(`Bienvenido ${usuario.nombre}`, "success");
    return true;
  } else {
    showToast("Usuario o contraseña incorrectos", "error");
    return false;
  }
}

function logoutUser() {
  state.usuarioActual = null;
  state.rolActual = null;
  state.logueado = false;
  localStorage.removeItem("usuarioActual");
  showToast("Sesión cerrada", "success");
  setTimeout(() => {
    mostrarPantallaLogin();
  }, 1500);
}

// Reports Generation
function generateSalesReport(desde, hasta) {
  const ventasFiltradas = state.ventas.filter(v => {
    const fecha = new Date(v.fecha);
    const desdeDate = new Date(desde);
    const hastaDate = new Date(hasta);
    return fecha >= desdeDate && fecha <= hastaDate;
  });

  let totalVentas = 0;
  let totalDescuentos = 0;
  let totalImpuestos = 0;
  let totalArticulos = 0;

  ventasFiltradas.forEach(venta => {
    totalVentas += parseFloat(venta.total);
    totalImpuestos += parseFloat(venta.impuesto);
    const items = JSON.parse(venta.itemsJson);
    totalArticulos += items.reduce((sum, item) => sum + item.cantidad, 0);
  });

  return {
    tipo: "Reporte de Ventas",
    periodo: `${desde} a ${hasta}`,
    totalVentas: totalVentas.toFixed(2),
    totalDescuentos: totalDescuentos.toFixed(2),
    totalImpuestos: totalImpuestos.toFixed(2),
    totalArticulos: totalArticulos,
    cantidadTransacciones: ventasFiltradas.length,
    fecha: new Date().toLocaleDateString()
  };
}

function generateInventoryReport() {
  let valorTotal = 0;
  let productosConBajoStock = [];

  state.productos.forEach(producto => {
    if (producto.stock < 10) {
      productosConBajoStock.push({
        nombre: producto.nombre,
        stock: producto.stock,
        precio: producto.precio
      });
    }
    valorTotal += producto.stock * producto.precio;
  });

  return {
    tipo: "Reporte de Inventario",
    totalProductos: state.productos.length,
    valorTotalInventario: valorTotal.toFixed(2),
    productosConBajoStock: productosConBajoStock,
    fecha: new Date().toLocaleDateString()
  };
}

function generateClientReport() {
  return {
    tipo: "Reporte de Clientes",
    totalClientes: state.clientes.length,
    clientesActivos: state.clientes.filter(c => c.activo).length,
    totalClientesInactivos: state.clientes.filter(c => !c.activo).length,
    fecha: new Date().toLocaleDateString()
  };
}

function generatePurchaseReport(desde, hasta) {
  const comprasFiltradas = state.compras.filter(c => {
    const fecha = new Date(c.fecha);
    const desdeDate = new Date(desde);
    const hastaDate = new Date(hasta);
    return fecha >= desdeDate && fecha <= hastaDate;
  });

  let totalCompras = 0;
  let totalArticulos = 0;

  comprasFiltradas.forEach(compra => {
    totalCompras += parseFloat(compra.total);
    totalArticulos += compra.cantidad;
  });

  return {
    tipo: "Reporte de Compras",
    periodo: `${desde} a ${hasta}`,
    totalCompras: totalCompras.toFixed(2),
    totalArticulos: totalArticulos,
    cantidadTransacciones: comprasFiltradas.length,
    fecha: new Date().toLocaleDateString()
  };
}

async function saveReport(reporte) {
  state.reportes.push(reporte);
  const saved = await saveSheetData("reportes", reporte);
  if (saved) {
    showToast("Reporte guardado exitosamente", "success");
    return true;
  } else {
    showToast("Error guardando reporte", "error");
    return false;
  }
}

// Filters & Search
function filterSalesBy(criteria) {
  let resultado = state.ventas;

  if (criteria.metodoPago) {
    resultado = resultado.filter(v => v.metodoPago === criteria.metodoPago);
  }

  if (criteria.desde && criteria.hasta) {
    resultado = resultado.filter(v => {
      const fecha = new Date(v.fecha);
      const desde = new Date(criteria.desde);
      const hasta = new Date(criteria.hasta);
      return fecha >= desde && fecha <= hasta;
    });
  }

  if (criteria.minimo || criteria.maximo) {
    resultado = resultado.filter(v => {
      const total = parseFloat(v.total);
      if (criteria.minimo && total < criteria.minimo) return false;
      if (criteria.maximo && total > criteria.maximo) return false;
      return true;
    });
  }

  return resultado;
}

function filterInventoryBy(criteria) {
  let resultado = state.productos;

  if (criteria.categoria) {
    resultado = resultado.filter(p => p.categoria === criteria.categoria);
  }

  if (criteria.minStock) {
    resultado = resultado.filter(p => p.stock <= criteria.minStock);
  }

  if (criteria.buscar) {
    resultado = resultado.filter(p => 
      p.nombre.toLowerCase().includes(criteria.buscar.toLowerCase())
    );
  }

  return resultado;
}

function filterClientesBy(criteria) {
  let resultado = state.clientes;

  if (criteria.activo !== undefined) {
    resultado = resultado.filter(c => c.activo === criteria.activo);
  }

  if (criteria.buscar) {
    resultado = resultado.filter(c => 
      c.nombre.toLowerCase().includes(criteria.buscar.toLowerCase()) ||
      c.email.toLowerCase().includes(criteria.buscar.toLowerCase())
    );
  }

  return resultado;
}
