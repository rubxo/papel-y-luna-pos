const API_URL = CONFIG.API_URL;

const API_RESOURCE_MAP = {
  productos: "products",
  ventas: "sales",
  categorias: "categories",
  usuarios: "users",
  clientes: "customers",
  proveedores: "suppliers",
  compras: "purchases",
  faltantes: "missing-requests",
  descuentos: "discounts"
};

function getAuthToken() {
  return localStorage.getItem("accessToken") || "";
}

function setAuthSession(token, user) {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("usuarioActual", JSON.stringify(user));
}

function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("usuarioActual");
  localStorage.removeItem("modoLocal");
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token && !options.skipAuth) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      skipAuth: undefined,
      headers
    });
  } catch (error) {
    const friendlyError = new Error("No se pudo conectar con el servidor. Verifica que el backend esté encendido.");
    friendlyError.status = 0;
    friendlyError.originalMessage = error.message;
    throw friendlyError;
  }

  const result = await response.json().catch(() => ({}));

  // Si el servidor invalida la sesión (usuario desactivado o token expirado), cerrar sesión automáticamente
  if (response.status === 401 && !options.skipAuth && !path.includes("/auth/login") && localStorage.getItem("modoLocal") !== "true") {
    clearAuthSession();
    location.reload();
    return;
  }

  if (!response.ok || result.success === false) {
    const error = new Error(getFriendlyApiMessage(response.status, result.message));
    error.status = response.status;
    error.details = result.details;
    throw error;
  }

  return result;
}

function getFriendlyApiMessage(status, message) {
  if (status === 0) return "No se pudo conectar con el servidor. Verifica que el backend esté encendido.";
  if (status >= 500) return "La base de datos no está disponible. Entrando en modo local de prueba.";
  if (message && !/failed to fetch|ECONNREFUSED|SequelizeConnectionRefusedError/i.test(message)) return message;
  if (status === 400) return "Hay datos incompletos o inválidos. Revisa el formulario.";
  if (status === 401) return "Usuario o contraseña incorrectos.";
  if (status === 403) return "No tienes permiso para realizar esta acción.";
  if (status === 404) return "No se encontró la información solicitada.";
  if (status === 409) return "La operación no se pudo completar por un conflicto de datos.";
  return "No se pudo completar la operación.";
}

async function loginToAPI(username, password) {
  const databaseReady = await isDatabaseReady();
  if (!databaseReady) {
    throw new Error("No se puede conectar al servidor. Verifica que el backend esté en línea.");
  }

  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });

  const user = mapUserFromAPI(result.user);
  setAuthSession(result.token, user);
  return user;
}

async function isDatabaseReady() {
  try {
    const health = await apiRequest("/health", { skipAuth: true });
    return health.database !== "offline";
  } catch (_error) {
    return false;
  }
}


async function validateSession() {
  if (localStorage.getItem("modoLocal") === "true") {
    const user = JSON.parse(localStorage.getItem("usuarioActual") || "null");
    const savedUser = getLocalBackup("usuarios").find(u => u.id === user?.id);
    if (user && savedUser && savedUser.activo !== false) return { ...user, ...savedUser };
    clearAuthSession();
    throw new Error("Tu usuario fue deshabilitado.");
  }

  const result = await apiRequest("/auth/me");
  const user = mapUserFromAPI(result.user);
  localStorage.setItem("usuarioActual", JSON.stringify(user));
  return user;
}

async function fetchSheetData(resource) {
  if (localStorage.getItem("modoLocal") === "true") {
    seedLocalDemoData();
    return getLocalBackup(resource);
  }

  const endpoint = API_RESOURCE_MAP[resource];
  if (!endpoint) return getLocalBackup(resource);

  try {
    const result = await apiRequest(`/${endpoint}`);
    const data = (result.data || []).map(item => mapFromAPI(resource, item));
    localStorage.setItem(`backup_${resource}`, JSON.stringify(data));
    return data;
  } catch (error) {
    console.warn(`${resource} desde caché local (${error.message})`);
    return getLocalBackup(resource);
  }
}

async function saveSheetData(resource, data) {
  saveToLocalStorage(resource, data);

  if (localStorage.getItem("modoLocal") === "true") {
    return data;
  }

  const endpoint = API_RESOURCE_MAP[resource];
  if (!endpoint) return false;

  try {
    const payload = mapToAPI(resource, data);
    const isExistingUuid = data && typeof data.id === "string" && /^[0-9a-f-]{36}$/i.test(data.id);
    const result = await apiRequest(isExistingUuid ? `/${endpoint}/${data.id}` : `/${endpoint}`, {
      method: isExistingUuid ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });

    const saved = result.data ? mapFromAPI(resource, result.data) : data;
    saveToLocalStorage(resource, saved);
    return saved;
  } catch (error) {
    console.warn(`No se pudo guardar ${resource} en API: ${error.message}`);
    return false;
  }
}

async function deleteSheetData(resource, id) {
  if (localStorage.getItem("modoLocal") === "true") {
    const items = getLocalItems(resource).filter(item => String(item.id) !== String(id));
    localStorage.setItem(resource, JSON.stringify(items));
    localStorage.setItem(`backup_${resource}`, JSON.stringify(items));
    return true;
  }

  const endpoint = API_RESOURCE_MAP[resource];
  if (!endpoint) return false;

  try {
    await apiRequest(`/${endpoint}/${encodeURIComponent(id)}`, { method: "DELETE" });
    return true;
  } catch (error) {
    console.warn(`Error borrando ${resource}: ${error.message}`);
    return false;
  }
}

async function postToAPI(resource, data) {
  return saveSheetData(resource, data);
}

function saveToLocalStorage(resource, data) {
  try {
    if (Array.isArray(data)) {
      localStorage.setItem(resource, JSON.stringify(data));
      notifyLocalDataChange(resource);
      return;
    }
    const items = getLocalItems(resource);
    if (data && data.id) {
      const index = items.findIndex(item => item.id === data.id);
      if (index > -1) items[index] = data;
      else items.push(data);
    } else if (data) {
      items.push(data);
    }
    localStorage.setItem(resource, JSON.stringify(items));
    notifyLocalDataChange(resource);
  } catch (error) {
    console.error("Error en localStorage:", error);
  }
}

function notifyLocalDataChange(resource) {
  window.dispatchEvent(new CustomEvent("pos:data-changed", { detail: { resource } }));
}

function getLocalItems(resource) {
  const data = localStorage.getItem(resource);
  return data ? JSON.parse(data) : [];
}

function getLocalBackup(resource) {
  const backup = localStorage.getItem(`backup_${resource}`) || localStorage.getItem(resource);
  if (backup) return JSON.parse(backup);
  return [];
}

async function loadAllDataFromAPI(silent = false) {
  try {
    const [productos, ventas, categorias, clientes, proveedores, compras, usuarios, faltantes, descuentos] = await Promise.all([
      fetchSheetData("productos"),
      fetchSheetData("ventas"),
      fetchSheetData("categorias"),
      fetchSheetData("clientes"),
      fetchSheetData("proveedores"),
      fetchSheetData("compras"),
      fetchSheetData("usuarios"),
      fetchSheetData("faltantes"),
      fetchSheetData("descuentos")
    ]);

    state.productos = productos;
    state.ventas = ventas;
    state.categorias = categorias.length ? categorias : CATEGORIAS_DEFAULT;
    state.clientes = clientes;
    state.proveedores = proveedores;
    state.compras = compras;
    state.faltantes = faltantes;
    state.descuentos = descuentos;
    if (usuarios.length) {
      state.usuarios = usuarios.filter(u => u.rol !== "encargado");
    }

    // Siempre sincronizar permisos del usuario actual desde /auth/me (funciona para cajero y admin)
    if (state.usuarioActual && localStorage.getItem("modoLocal") !== "true") {
      try {
        const meResult = await apiRequest("/auth/me");
        if (meResult && meResult.user) {
          const updatedUser = mapUserFromAPI(meResult.user);
          const permisosChanged = JSON.stringify(updatedUser.permisos) !== JSON.stringify(state.usuarioActual.permisos);
          const activoChanged = updatedUser.activo !== state.usuarioActual.activo;
          if (permisosChanged || activoChanged) {
            state.usuarioActual = { ...state.usuarioActual, permisos: updatedUser.permisos, activo: updatedUser.activo };
            localStorage.setItem("usuarioActual", JSON.stringify(state.usuarioActual));
            if (typeof aplicarPermisosPorRol === "function") aplicarPermisosPorRol();
          }
        }
      } catch (_e) {}
    }

    if (!silent) {
      console.log(`Carga completa: ${state.productos.length} productos, ${state.ventas.length} ventas, ${state.categorias.length} categorías, ${faltantes.length} faltantes, ${descuentos.length} descuentos`);
    }
    return true;
  } catch (error) {
    console.error("Error cargando datos:", error);
    return false;
  }
}

async function sincronizarDatos() {
  try {
    showToast("Sincronizando con la base de datos...", "info");
    const ok = await loadAllDataFromAPI();
    showToast(ok ? "Datos actualizados" : "No se pudo sincronizar", ok ? "success" : "warning");
    return ok;
  } catch (e) {
    showToast("Error de sincronización", "error");
    return false;
  }
}

function mapFromAPI(resource, item) {
  if (!item) return item;

  if (resource === "productos") {
    return {
      id: item.id,
      codigo: item.code || "",
      nombre: item.name || "",
      descripcion: item.description || "",
      precio: parseFloat(item.salePrice ?? item.sale_price ?? 0),
      costo: parseFloat(item.costPrice ?? item.cost_price ?? 0),
      stock: parseInt(item.stock || 0),
      categoria: item.category?.name || item.categoria || "Sin categoría",
      categoriaId: item.categoryId || item.category_id || null,
      imagen: item.imageUrl || item.image_url || "",
      seguimientoInventario: item.trackInventory !== false && item.track_inventory !== false,
      activo: item.active !== false
    };
  }

  if (resource === "categorias") {
    return {
      id: item.id,
      nombre: item.name || "",
      descripcion: item.description || "",
      activo: item.active !== false
    };
  }

  if (resource === "clientes") {
    return {
      id: item.id,
      nombre: item.name || "",
      telefono: item.phone || "",
      correo: item.email || "",
      activo: item.active !== false
    };
  }

  if (resource === "proveedores") {
    return {
      id: item.id,
      nombre: item.name || "",
      nit: item.taxId || item.tax_id || "",
      contacto: item.contact || item.phone || "",
      telefono: item.phone || "",
      activo: item.active !== false
    };
  }

  if (resource === "ventas") {
    const items = (item.items || []).map(saleItem => ({
      id: saleItem.productId || saleItem.product_id,
      saleItemId: saleItem.id,
      nombre: saleItem.productName || saleItem.product_name,
      precio: parseFloat(saleItem.unitPrice ?? saleItem.unit_price ?? 0),
      cantidad: parseInt(saleItem.quantity || 0),
      subtotal: parseFloat(saleItem.subtotal || 0)
    }));

    return {
      id: item.id,
      numero: item.saleNumber || item.sale_number || "",
      fecha: formatDate(item.createdAt || item.created_at),
      items,
      itemsJson: JSON.stringify(items),
      subtotal: parseFloat(item.subtotal || 0),
      descuento: parseFloat(item.discountTotal ?? item.discount_total ?? 0),
      descuentoTipo: item.discountType || item.discount_type || null,
      descuentoValor: parseFloat(item.discountValue ?? item.discount_value ?? 0),
      impuesto: parseFloat(item.taxTotal ?? item.tax_total ?? 0),
      total: parseFloat(item.total || 0),
      metodoPago: item.paymentMethod || item.payment_method || "",
      cambio: parseFloat(item.changeAmount ?? item.change_amount ?? 0),
      estado: item.status || "cerrada",
      historialCorrecciones: parseItems(item.notes)
    };
  }

  if (resource === "compras") {
    const items = (item.items || []).map(purchaseItem => ({
      id: purchaseItem.productId || purchaseItem.product_id,
      cantidad: parseInt(purchaseItem.quantity || 0),
      costo: parseFloat(purchaseItem.unitCost ?? purchaseItem.unit_cost ?? 0),
      subtotal: parseFloat(purchaseItem.subtotal || 0)
    }));
    return {
      id: item.id,
      numero: item.purchaseNumber || item.purchase_number || "",
      fecha: formatDate(item.createdAt || item.created_at),
      proveedorId: item.supplierId || item.supplier_id || "",
      metodoPago: item.paymentMethod || item.payment_method || "",
      itemsJson: JSON.stringify(items),
      total: parseFloat(item.total || 0)
    };
  }

  if (resource === "faltantes") {
    return {
      id: item.id,
      nombre: item.productName || "",
      estadoProducto: item.type === "no_registrado" ? "no registrado" : (item.type || "agotado"),
      cantidad: item.quantity || null,
      observacion: item.notes || null,
      fecha: formatDate(item.createdAt || item.created_at),
      estado: item.status || "pendiente"
    };
  }

  if (resource === "descuentos") {
    return {
      id: item.id,
      nombre: item.name || "",
      tipo: item.type || "porcentaje",
      valor: parseFloat(item.value ?? 0),
      descripcion: item.description || "",
      activo: item.active !== false
    };
  }

  if (resource === "usuarios") return mapUserFromAPI(item);
  return item;
}

function mapToAPI(resource, item) {
  if (resource === "productos") {
    return {
      categoryId: item.categoriaId || null,
      code: item.codigo || `PL-${Date.now().toString().slice(-6)}`,
      name: item.nombre,
      description: item.descripcion || "",
      salePrice: Number(item.precio || 0),
      costPrice: Number(item.costo || 0),
      stock: Number(item.stock || 0),
      trackInventory: item.seguimientoInventario !== false,
      imageUrl: item.imagen || null,
      active: item.activo !== false
    };
  }

  if (resource === "categorias") {
    return { name: item.nombre, description: item.descripcion || "", active: item.activo !== false };
  }

  if (resource === "clientes") {
    return { name: item.nombre, phone: item.telefono || "", email: item.correo || "", active: item.activo !== false };
  }

  if (resource === "proveedores") {
    return { name: item.nombre, taxId: item.nit || "", contact: item.contacto || "", phone: item.telefono || item.contacto || "", active: item.activo !== false };
  }

  if (resource === "compras") {
    const items = parseItems(item.itemsJson).map(compraItem => ({
      productId: compraItem.id || compraItem.productoId,
      quantity: Number(compraItem.cantidad || 0),
      unitCost: Number(compraItem.costo || 0)
    })).filter(compraItem => compraItem.productId && compraItem.quantity > 0);

    return {
      supplierId: item.proveedorId || null,
      paymentMethod: item.metodoPago || "efectivo",
      notes: item.numero || item.id || "",
      items
    };
  }

  if (resource === "ventas") {
    return {
      status: item.estado || "cerrada",
      notes: JSON.stringify(item.historialCorrecciones || []),
      total: Number(item.total || 0),
      subtotal: Number(item.subtotal || 0),
      taxTotal: Number(item.impuesto || 0)
    };
  }

  if (resource === "faltantes") {
    return {
      productName: item.nombre,
      type: item.estadoProducto === "no registrado" ? "no_registrado" : "agotado",
      quantity: item.cantidad ? Number(item.cantidad) : null,
      notes: item.observacion || null,
      status: item.estado || "pendiente"
    };
  }

  if (resource === "descuentos") {
    return {
      name: item.nombre,
      type: item.tipo || "porcentaje",
      value: Number(item.valor || 0),
      description: item.descripcion || "",
      active: item.activo !== false
    };
  }

  if (resource === "usuarios") {
    return {
      fullName: item.nombre || item.fullName,
      username: item.usuario || item.username,
      roleId: item.roleId,
      rol: item.rol,
      active: item.activo !== false,
      permissions: Array.isArray(item.permisos) ? JSON.stringify(item.permisos) : (item.permisos || "[]"),
      password: item.password
    };
  }

  return item;
}

function mapUserFromAPI(user) {
  let permissions = user.permissions || user.permisos || [];
  if (typeof permissions === 'string') {
    try { permissions = JSON.parse(permissions); } catch(e) { permissions = []; }
  }

  return {
    id: user.id,
    nombre: user.fullName || user.nombre || "",
    usuario: user.username || user.usuario || "",
    email: user.email || null,
    rol: (user.role && user.role.name) || user.role || user.rol || "cajero",
    activo: user.active !== false && user.activo !== false,
    permisos: permissions,
    roleId: user.roleId || user.role?.id || user.role_id,
    fechaCreacion: formatDate(user.createdAt || user.created_at || user.fechaCreacion),
    ultimoLogin: formatDate(user.lastLoginAt || user.last_login_at)
  };
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-CO");
}

function parseItems(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try { return JSON.parse(value); } catch (e) { return []; }
}


function seedLocalDemoData() {
  if (localStorage.getItem("demoDataReady") === "true") {
    limpiarRolEncargadoLocal();
    return;
  }

  const categorias = CATEGORIAS_DEFAULT;
  const productos = [
    { id: "LOCAL-PROD-001", codigo: "PL-0001", nombre: "Cuaderno cuadriculado 100 hojas", descripcion: "Cuaderno escolar", precio: 6500, costo: 4200, stock: 35, categoria: "Papel y Cuadernos", imagen: "", seguimientoInventario: true, activo: true },
    { id: "LOCAL-PROD-002", codigo: "PL-0002", nombre: "Bolígrafo azul", descripcion: "Bolígrafo punta media", precio: 1200, costo: 650, stock: 120, categoria: "Escritura", imagen: "", seguimientoInventario: true, activo: true },
    { id: "LOCAL-PROD-003", codigo: "PL-0003", nombre: "Lápiz HB", descripcion: "Lápiz escolar", precio: 900, costo: 400, stock: 90, categoria: "Escritura", imagen: "", seguimientoInventario: true, activo: true },
    { id: "LOCAL-PROD-004", codigo: "PL-0004", nombre: "Resma carta", descripcion: "Papel tamaño carta", precio: 18500, costo: 14500, stock: 18, categoria: "Impresión", imagen: "", seguimientoInventario: true, activo: true },
    { id: "LOCAL-PROD-005", codigo: "PL-0005", nombre: "Cartulina blanca", descripcion: "Cartulina escolar", precio: 1500, costo: 800, stock: 60, categoria: "Manualidades", imagen: "", seguimientoInventario: true, activo: true }
  ];
  const clientes = [
    { id: "LOCAL-CLI-001", nombre: "Cliente mostrador", telefono: "", correo: "", activo: true },
    { id: "LOCAL-CLI-002", nombre: "Colegio San Martín", telefono: "3001234567", correo: "compras@colegio.test", activo: true }
  ];
  const proveedores = [
    { id: "LOCAL-PROV-001", nombre: "Distribuidora Escolar", nit: "900123456", contacto: "Laura Pérez", telefono: "6011234567", activo: true },
    { id: "LOCAL-PROV-002", nombre: "Papeles del Centro", nit: "901987654", contacto: "Carlos Ruiz", telefono: "6017654321", activo: true }
  ];

  localStorage.setItem("categorias", JSON.stringify(categorias));
  localStorage.setItem("backup_categorias", JSON.stringify(categorias));
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("backup_productos", JSON.stringify(productos));
  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("backup_clientes", JSON.stringify(clientes));
  localStorage.setItem("proveedores", JSON.stringify(proveedores));
  localStorage.setItem("backup_proveedores", JSON.stringify(proveedores));
  localStorage.setItem("ventas", JSON.stringify([]));
  localStorage.setItem("backup_ventas", JSON.stringify([]));
  localStorage.setItem("compras", JSON.stringify([]));
  localStorage.setItem("backup_compras", JSON.stringify([]));
  const usuarios = [
    { id: "LOCAL-ADMIN", nombre: "Administrador", usuario: "admin", rol: "admin", activo: true, fechaCreacion: new Date().toLocaleDateString() },
    { id: "LOCAL-CAJERO", nombre: "Cajero Principal", usuario: "cajero", rol: "cajero", activo: true, fechaCreacion: new Date().toLocaleDateString() }
  ];
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("backup_usuarios", JSON.stringify(usuarios));
  localStorage.setItem("demoDataReady", "true");
  limpiarRolEncargadoLocal();
}

function limpiarRolEncargadoLocal() {
  const usuarios = getLocalBackup("usuarios").filter(user => user.rol !== "encargado");
  if (usuarios.length) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("backup_usuarios", JSON.stringify(usuarios));
  }
}

const CATEGORIAS_DEFAULT = [
  { id: "CAT-001", nombre: "Escritura", descripcion: "Bolígrafos, lápices, marcadores, resaltadores" },
  { id: "CAT-002", nombre: "Papel y Cuadernos", descripcion: "Cuadernos, libretas, resmas, hojas" },
  { id: "CAT-003", nombre: "Arte y Dibujo", descripcion: "Pinturas, pinceles, lápices de colores, acuarelas" },
  { id: "CAT-004", nombre: "Oficina", descripcion: "Clips, grapas, carpetas, archivadores, sellos" },
  { id: "CAT-005", nombre: "Tecnología", descripcion: "USB, cables, pilas, calculadoras" },
  { id: "CAT-006", nombre: "Manualidades", descripcion: "Tijeras, pegamento, cinta, foamy, cartulina" },
  { id: "CAT-007", nombre: "Escolar", descripcion: "Reglas, transportadores, compases, sets escolares" },
  { id: "CAT-008", nombre: "Impresión", descripcion: "Tóner, tinta, paper craft, stickers" }
];
