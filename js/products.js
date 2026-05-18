function getAllProducts() { return state.productos; }
function getProductById(id) { return state.productos.find(p => p.id === id); }
function getProductByIndex(index) { return state.productos[index] || null; }

function normalizeStr(str) {
  return (str || "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function searchProducts(query) {
  const q = normalizeStr(query);
  return state.productos.filter(p =>
    normalizeStr(p.nombre).includes(q) ||
    normalizeStr(p.descripcion).includes(q) ||
    normalizeStr(p.codigo).includes(q)
  );
}

function validateProduct(data) {
  if (!data.nombre || data.nombre.trim() === "") return "El nombre es requerido";
  if (isNaN(data.precio) || data.precio < 0) return "Precio debe ser un número positivo";
  if (isNaN(data.costo) || data.costo < 0) return "Costo debe ser un número positivo";
  if (isNaN(data.stock) || data.stock < 0) return "Stock debe ser un número positivo";
  return null;
}

async function createProduct(data) {
  const error = validateProduct(data);
  if (error) { showToast(error, "error"); return false; }

  const newProduct = {
    codigo: data.codigo || `P-${Date.now().toString().slice(-4)}`,
    nombre: data.nombre,
    descripcion: data.descripcion || "",
    precio: parseFloat(data.precio),
    costo: parseFloat(data.costo),
    stock: parseInt(data.stock),
    categoriaId: data.categoriaId || null,
    categoria: data.categoria || "Sin categoría",
    imagen: data.imagen || null,
    seguimientoInventario: true
  };

  // Siempre agregamos al estado local primero para que la app se sienta instantánea
  const savedProduct = await saveSheetData("productos", newProduct);
  state.productos.push(savedProduct && savedProduct !== true ? savedProduct : { ...newProduct, id: `LOCAL-${Date.now()}` });
  
  if (savedProduct) {
    showToast("Producto guardado correctamente", "success");
  } else {
    // Si falla la red, ya está en localStorage y en el estado, así que sigue funcionando offline
    showToast("Producto guardado localmente", "warning");
  }
  return savedProduct && savedProduct !== true ? savedProduct : true;
}

async function updateProduct(id, data) {
  const error = validateProduct(data);
  if (error) { showToast(error, "error"); return false; }

  const product = getProductById(id);
  if (!product) { showToast("Producto no encontrado", "error"); return false; }

  product.nombre = data.nombre;
  product.descripcion = data.descripcion || "";
  product.precio = parseFloat(data.precio);
  product.costo = parseFloat(data.costo);
  product.stock = parseInt(data.stock);
  product.categoriaId = data.categoriaId !== undefined ? data.categoriaId : product.categoriaId;
  product.categoria = data.categoria || product.categoria;
  product.imagen = data.imagen !== undefined ? data.imagen : product.imagen;

  const savedProduct = await saveSheetData("productos", product);
  if (savedProduct && savedProduct !== true) Object.assign(product, savedProduct);
  
  if (savedProduct) {
    showToast("Producto actualizado", "success");
  } else {
    showToast("Producto actualizado localmente", "warning");
  }
  return true;
}

async function deleteProduct(id) {
  const product = getProductById(id);
  if (!product) { showToast("Producto no encontrado", "error"); return false; }
  const index = state.productos.indexOf(product);
  if (index > -1) {
    state.productos.splice(index, 1);
    if (!state.eliminados) state.eliminados = [];
    state.eliminados.push(String(id));
    deleteSheetData("productos", id); // Sincroniza el borrado con el backend
    showToast("Producto eliminado", "success");
    return true;
  }
  return false;
}
