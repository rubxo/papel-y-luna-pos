// Usar la URL centralizada de config.js
const API_URL = CONFIG.API_URL;

// ====================================================================
// GET — Obtener datos desde Google Sheets
// ====================================================================
async function fetchSheetData(resource) {
  try {
    console.log(`🔍 Cargando ${resource}...`);
    const response = await fetch(`${API_URL}?resource=${resource}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (result && result.success) {
      // Limpiar espacios en blanco accidentales en los nombres de las columnas (ej. "id ")
      const cleanData = (result.data || []).map(item => {
        const cleanItem = {};
        Object.keys(item).forEach(k => cleanItem[k.trim()] = item[k]);
        return cleanItem;
      });

      localStorage.setItem(`backup_${resource}`, JSON.stringify(cleanData));
      console.log(`✅ ${resource}: ${cleanData.length} registros`);
      return cleanData;
    } else {
      console.warn(`⚠️ API rechazó ${resource}: ${result.message}`);
      return getLocalBackup(resource);
    }
  } catch (error) {
    console.warn(`📦 ${resource} desde caché local (${error.message})`);
    return getLocalBackup(resource);
  }
}

function getLocalBackup(resource) {
  const backup = localStorage.getItem(`backup_${resource}`);
  if (backup) return JSON.parse(backup);
  return [];
}

// ====================================================================
// POST — Enviar datos a Google Sheets
// ====================================================================
async function saveSheetData(resource, data) {
  // 1. Guardar en localStorage primero (siempre disponible)
  saveToLocalStorage(resource, data);

  // 2. Intentar sincronizar con Google Sheets
  try {
    console.log(`📤 Enviando a Sheets: ${resource}`, data);
    const response = await fetch(`${API_URL}?resource=${resource}`, {
      method: "POST",
      // CRÍTICO: Se usa text/plain para evitar errores de CORS (Options preflight) en Google Scripts
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log(`📥 Respuesta Sheets:`, result);

    if (result && result.success) {
      console.log(`✅ ${resource} guardado en Google Sheets`);
      return true;
    } else {
      console.warn(`⚠️ Sheets rechazó: ${result?.message}`);
      return false; // Falló en Sheets (pero sí en local)
    }
  } catch (error) {
    console.warn(`⚠️ No se pudo conectar con Google Sheets: ${error.message}`);
    return false; // Falló la conexión
  }
}

// ====================================================================
// DELETE — Eliminar datos en Google Sheets
// ====================================================================
async function deleteSheetData(resource, id) {
  try {
    console.log(`🗑️ Eliminando de Sheets: ${resource} [ID: ${id}]`);
    const response = await fetch(`${API_URL}?resource=${resource}&action=delete&id=${encodeURIComponent(id)}`, {
      method: "GET"
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.warn(`⏳ Error borrando en Sheets: ${error.message}`);
    return false;
  }
}

// Alias para uniformidad en los módulos
async function postToAPI(resource, data) {
  return saveSheetData(resource, data);
}

// ====================================================================
// localStorage helpers
// ====================================================================
function saveToLocalStorage(resource, data) {
  try {
    if (Array.isArray(data)) {
      localStorage.setItem(resource, JSON.stringify(data));
      return;
    }
    const items = getLocalItems(resource);
    if (data.id) {
      const index = items.findIndex(item => item.id === data.id);
      if (index > -1) items[index] = data;
      else items.push(data);
    } else {
      items.push(data);
    }
    localStorage.setItem(resource, JSON.stringify(items));
  } catch (error) {
    console.error("Error en localStorage:", error);
  }
}

function getLocalItems(resource) {
  const data = localStorage.getItem(resource);
  return data ? JSON.parse(data) : [];
}

// ====================================================================
// Carga inicial completa desde API
// ====================================================================
async function loadAllDataFromAPI(silent = false) {
  try {
    const [productos, ventas, categorias, usuarios, clientes, proveedores, compras] = await Promise.all([
      fetchSheetData("productos"),
      fetchSheetData("ventas"),
      fetchSheetData("categorias"),
      fetchSheetData("usuarios"),
      fetchSheetData("clientes"),
      fetchSheetData("proveedores"),
      fetchSheetData("compras")
    ]);

    function parseJsonSafe(str) {
      if (!str) return [];
      try { return JSON.parse(str); } catch (e) { return []; }
    }

    if (!state.eliminados) state.eliminados = [];

    // Productos
    const remoteProductos = (productos || []).map((p, idx) => ({
      id: p.id || `PROD-MANUAL-${p.codigo || p.nombre || idx}`,
      codigo: p.codigo || "",
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: parseFloat(p.precio) || 0,
      costo: parseFloat(p.costo) || 0,
      stock: parseInt(p.stock) || 0,
      categoria: p.categoria || "Sin categoría",
      imagen: p.imagen || "",
      seguimientoInventario: p.seguimientoInventario !== "false"
    })).filter(p => !state.eliminados.includes(String(p.id)));
    // MERGE: Conservar creados localmente que aún no salen en Sheets
    state.productos.forEach(localP => {
      if (!remoteProductos.some(rp => rp.id === localP.id)) remoteProductos.push(localP);
    });
    // MERGE: Actualizar datos de los existentes para no sobre-escribir ediciones muy recientes
    state.productos = remoteProductos;

    // Ventas
    state.ventas = (ventas || []).filter(v => v.id).map(v => ({
      id: v.id,
      fecha: v.fecha || "",
      itemsJson: v.itemsJson || "[]",
      items: parseJsonSafe(v.itemsJson),
      subtotal: parseFloat(v.subtotal) || 0,
      impuesto: parseFloat(v.impuesto) || 0,
      total: parseFloat(v.total) || 0,
      metodoPago: v.metodoPago || "",
      cambio: parseFloat(v.cambio) || 0,
      estado: v.estado || "cerrada"
    }));

    // Categorías
    const remoteCategorias = (categorias || []).map((c, idx) => ({
      id: c.id || `CAT-MANUAL-${c.nombre || idx}`,
      nombre: c.nombre || "",
      descripcion: c.descripcion || ""
    })).filter(c => !state.eliminados.includes(String(c.id)));
    state.categorias.forEach(localC => {
      if (!remoteCategorias.some(rc => rc.id === localC.id)) remoteCategorias.push(localC);
    });
    state.categorias = remoteCategorias;

    // Si Sheets devolvió 0 categorías, cargar defaults de papelería
    if (state.categorias.length === 0) {
      state.categorias = CATEGORIAS_DEFAULT;
      if (!silent) console.log("📂 Usando categorías por defecto (Sheets vacío). Sincronizándolas a la cuenta de Google...");

      // Enviarlas una a una en segundo plano a Google Sheets para que se reflejen en el Excel
      CATEGORIAS_DEFAULT.forEach(cat => {
        saveSheetData("categorias", cat).catch(e => console.warn("Error enviando categoría:", e));
      });
    }

    // Usuarios
    if (usuarios && usuarios.length > 0) {
      state.usuarios = usuarios.filter(u => u.id).map(u => ({
        id: u.id,
        nombre: u.nombre || "",
        usuario: u.usuario || "",
        contraseña: u.contraseña || "",
        rol: u.rol || "cajero",
        activo: u.activo !== "false" && u.activo !== false,
        fechaCreacion: u.fechaCreacion || ""
      }));
    }

    // Clientes
    const remoteClientes = (clientes || []).map((c, idx) => ({
      id: c.id || `CLI-MANUAL-${c.nombre || idx}`,
      nombre: c.nombre || "",
      telefono: c.telefono || "",
      correo: c.correo || ""
    })).filter(c => !state.eliminados.includes(String(c.id)));
    state.clientes.forEach(localCli => {
      if (!remoteClientes.some(rc => rc.id === localCli.id)) remoteClientes.push(localCli);
    });
    state.clientes = remoteClientes;

    // Proveedores
    const remoteProveedores = (proveedores || []).map((p, idx) => ({
      id: p.id || `PROV-MANUAL-${p.nit || p.nombre || idx}`,
      nombre: p.nombre || "",
      nit: p.nit || "",
      contacto: p.contacto || p.telefono || ""
    })).filter(p => !state.eliminados.includes(String(p.id)));
    state.proveedores.forEach(localProv => {
      if (!remoteProveedores.some(rp => rp.id === localProv.id)) remoteProveedores.push(localProv);
    });
    state.proveedores = remoteProveedores;

    // Compras
    state.compras = (compras || []).filter(c => c.id).map(c => ({
      id: c.id,
      fecha: c.fecha || "",
      proveedorId: c.proveedorId || "",
      metodoPago: c.metodoPago || "",
      itemsJson: c.itemsJson || "[]",
      total: parseFloat(c.total) || 0
    }));

    if (!silent) console.log(`✅ Carga completa: ${state.productos.length} productos, ${state.ventas.length} ventas, ${state.categorias.length} categorías`);
    return true;
  } catch (error) {
    console.error("❌ Error cargando datos:", error);
    return false;
  }
}

// ====================================================================
// Sincronización manual — Recargar TODO desde Sheets
// ====================================================================
async function sincronizarDesdeSheets() {
  try {
    showToast("🔄 Sincronizando con Google Sheets...", "info");
    const ok = await loadAllDataFromAPI();
    if (ok) {
      showToast("✅ Datos actualizados desde Google Sheets", "success");
    } else {
      showToast("⚠️ Sin conexión — se usaron datos locales", "warning");
    }
    return ok;
  } catch (e) {
    showToast("❌ Error de sincronización", "error");
    return false;
  }
}

// ====================================================================
// Categorías por defecto para papelería (se usan si Sheets está vacío)
// ====================================================================
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