function getAllProducts() { return state.productos; }
function getProductById(id) { return state.productos.find(p => p.id === id); }
function getProductByIndex(index) { return state.productos[index] || null; }
function searchProducts(query) {
  const q = query.toLowerCase();
  return state.productos.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.descripcion.toLowerCase().includes(q)
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
  console.log('🆕 Creando producto:', data);
  const error = validateProduct(data);
  if (error) { showToast(error, "error"); console.error(error); return false; }

  const newProduct = {
    id: `PROD-${Date.now()}`,
    codigo: data.codigo || `P-${Date.now().toString().slice(-4)}`,
    nombre: data.nombre,
    descripcion: data.descripcion || "",
    precio: parseFloat(data.precio),
    costo: parseFloat(data.costo),
    stock: parseInt(data.stock),
    categoria: data.categoria || "Sin categoría",
    imagen: data.imagen || "sin-imagen.jpg",
    seguimientoInventario: true
  };

  console.log('📝 Objeto producto a guardar:', newProduct);
  
  // Siempre agregamos al estado local primero para que la app se sienta instantánea
  state.productos.push(newProduct);
  
  const success = await saveSheetData("productos", newProduct);
  
  if (success) {
    showToast("✅ Producto sincronizado con Google Sheets", "success");
  } else {
    // Si falla la red, ya está en localStorage y en el estado, así que sigue funcionando offline
    showToast("⚠️ Producto guardado localmente (Sin conexión a Sheets)", "warning");
  }
  return true;
}

async function updateProduct(id, data) {
  console.log('✏️ Editando producto:', id, data);
  const error = validateProduct(data);
  if (error) { showToast(error, "error"); console.error(error); return false; }

  const product = getProductById(id);
  if (!product) { showToast("❌ Producto no encontrado", "error"); console.error('Producto no encontrado:', id); return false; }

  product.nombre = data.nombre;
  product.descripcion = data.descripcion || "";
  product.precio = parseFloat(data.precio);
  product.costo = parseFloat(data.costo);
  product.stock = parseInt(data.stock);
  product.categoria = data.categoria || product.categoria;
  product.imagen = data.imagen || product.imagen;

  console.log('📝 Producto actualizado a guardar:', product);
  
  const success = await saveSheetData("productos", product);
  
  if (success) {
    showToast("✅ Producto actualizado en Sheets", "success");
  } else {
    showToast("⚠️ Producto actualizado localmente (Sin conexión a Sheets)", "warning");
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