// ========== PANTALLA DE LOGIN ==========

function mostrarPantallaLogin() {
  document.body.innerHTML = `
    <div class="login-wrapper">
      <div id="login-card" class="login-card">

        <div class="login-header">
          <span class="login-logo">🌙</span>
          <h1>Papel &amp; Luna</h1>
          <p>Sistema POS · Iniciar Sesión</p>
        </div>

        <form id="login-form" class="login-form">
          <div>
            <label class="login-label" for="login-usuario">Usuario</label>
            <input type="text" id="login-usuario" class="login-input"
              placeholder="ej: admin" autocomplete="username" autofocus required>
          </div>

          <div>
            <label class="login-label" for="login-password">Contraseña</label>
            <div class="login-input-wrap">
              <input type="password" id="login-password" class="login-input"
                placeholder="••••••••" autocomplete="current-password" required>
              <button type="button" id="toggle-password-login" class="login-toggle-pass">👁️</button>
            </div>
          </div>

          <button type="submit" id="login-btn" class="login-btn">
            Iniciar Sesión →
          </button>
        </form>

        <!-- Credenciales de prueba — visible solo con Ctrl+Shift+Q -->
        <div id="credenciales-caja" class="login-creds">
          <p class="login-creds-title">Credenciales de prueba</p>
          <div class="login-creds-grid">
            <div class="login-creds-admin">
              <div class="login-creds-role admin">ADMIN</div>
              <span class="login-creds-line">usuario: admin</span>
              <span class="login-creds-line">pass: admin123</span>
            </div>
            <div class="login-creds-cajero">
              <div class="login-creds-role cajero">CAJERO</div>
              <span class="login-creds-line">usuario: cajero</span>
              <span class="login-creds-line">pass: cajero123</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;


  // Atajo Ctrl+Shift+Q — muestra credenciales de prueba para sustentación
  document.addEventListener("keydown", function handler(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === "q" || e.key === "Q")) {
      const caja = document.getElementById("credenciales-caja");
      if (caja) caja.style.display = caja.style.display === "none" ? "block" : "none";
    }
    // Limpiar el listener cuando se desmonte la pantalla de login
    if (!document.getElementById("login-form")) document.removeEventListener("keydown", handler);
  });

  // Toggle password visibility
  const togglePasswordBtn = document.getElementById("toggle-password-login");
  const passwordInput = document.getElementById("login-password");
  let isPasswordVisible = false;
  
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", (e) => {
      e.preventDefault();
      isPasswordVisible = !isPasswordVisible;
      passwordInput.type = isPasswordVisible ? "text" : "password";
      togglePasswordBtn.textContent = isPasswordVisible ? "🙈" : "👁️";
      togglePasswordBtn.style.opacity = isPasswordVisible ? "1" : "0.6";
    });
  }

  // Submit del formulario
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = document.getElementById("login-usuario").value;
    const password = document.getElementById("login-password").value;
    const submitBtn = document.getElementById("login-btn");
    
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "Cargando...";
      submitBtn.disabled = true;
    }

    try {
      const user = await loginToAPI(usuario, password);
      if (user) {
        state.usuarioActual = user;
        state.rolActual = user.rol;
        state.logueado = true;
        location.reload();
      }
    } catch (error) {
      mostrarError(error.message || "Usuario o contraseña incorrectos");
    } finally {
      if (submitBtn) {
        submitBtn.innerHTML = submitBtn.dataset.originalText || "Iniciar Sesión →";
        submitBtn.disabled = false;
      }
    }
  });
}

function mostrarError(mensaje) {
  const existing = document.getElementById("login-error");
  if (existing) existing.remove();

  const errorDiv = document.createElement("div");
  errorDiv.id = "login-error";
  errorDiv.className = "login-error";
  errorDiv.textContent = "❌ " + mensaje;
  const form = document.getElementById("login-form");
  form.insertBefore(errorDiv, form.firstChild);
  setTimeout(() => errorDiv.remove(), 3000);
}


// ========== VISTAS PRINCIPALES ==========

function navigateTo(viewName) {
  const rol = state.rolActual || "cajero";
  let permitidos = window.PERMISOS ? (window.PERMISOS[rol] || window.PERMISOS.cajero) : [];
  if (state.usuarioActual && state.usuarioActual.permisos && Array.isArray(state.usuarioActual.permisos) && state.usuarioActual.permisos.length > 0) {
    permitidos = state.usuarioActual.permisos;
  }
  if (!permitidos.includes(viewName) && viewName !== "login") {
    console.warn("Acceso denegado a " + viewName);
    return;
  }

  const allViews = document.querySelectorAll(".view");
  allViews.forEach(view => {
    view.classList.remove("view--active");
    view.innerHTML = "";
  });
  
  const targetView = document.getElementById(`view-${viewName}`);
  if (!targetView) { console.error(`Vista no encontrada: ${viewName}`); return; }
  
  switch (viewName) {
    case "home":        renderHome(); break;
    case "pos":         if (!state.ventaActual) startSale(); renderPOS(); break;
    case "history":     renderSalesHistory(); break;
    case "missing":     renderMissingItems(); break;
    case "clientes":    renderClientesList(); break;
    case "products":    renderProductList(); break;
    case "categorias":  renderCategoriasList(); break;
    case "compras":     renderCompras(); break;
    case "proveedores": renderProveedoresList(); break;
    case "reports":     renderReports(); break;
    case "users":       renderUserManagement(); break;
    case "descuentos":  renderDescuentosList(); break;
    default: console.warn("Vista no reconocida:", viewName); return;
  }
  
  targetView.classList.add("view--active");
}

function renderHome() {
  const view = document.getElementById("view-home");
  const totalProductos = state.productos.filter(p => p.activo !== false).length;
  const ventasActivas = state.ventas.filter(v => v.estado !== "anulada");
  const totalVentas = ventasActivas.length;
  const totalClientes = state.clientes ? state.clientes.length : 0;
  const totalIngresos = ventasActivas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
  const esAdmin = state.rolActual === "admin";

  const quickCardsAdmin = `
    <div class="quick-card" onclick="navigateTo('products')">
      <span class="qc-icon">📦</span>
      <div class="qc-text"><strong>Productos</strong><span>Gestionar inventario</span></div>
    </div>
    <div class="quick-card" onclick="navigateTo('compras')">
      <span class="qc-icon">🛒</span>
      <div class="qc-text"><strong>Compras</strong><span>Registrar compras</span></div>
    </div>
    <div class="quick-card" onclick="navigateTo('reports')">
      <span class="qc-icon">📊</span>
      <div class="qc-text"><strong>Reportes</strong><span>Ver estadísticas</span></div>
    </div>
    <div class="quick-card" onclick="navigateTo('users')">
      <span class="qc-icon">👤</span>
      <div class="qc-text"><strong>Usuarios</strong><span>Gestionar accesos</span></div>
    </div>`;

  const quickCardsCajero = `
    <div class="quick-card" onclick="navigateTo('missing')">
      <span class="qc-icon">⚠️</span>
      <div class="qc-text"><strong>Faltantes</strong><span>Reportar productos</span></div>
    </div>`;

  view.innerHTML = `
    <div class="container">
      <div class="home-welcome">
        <div>
          <h1>Bienvenido, ${state.usuarioActual ? state.usuarioActual.nombre : "Usuario"}</h1>
          <p>Sistema de Punto de Venta — Papel &amp; Luna</p>
        </div>
        <button class="btn-ir-pos" onclick="navigateTo('pos')">Ir al POS →</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">📦</span>
          <h3>${totalProductos}</h3>
          <p>Productos en inventario</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🧾</span>
          <h3>${totalVentas}</h3>
          <p>Ventas registradas</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">💰</span>
          <h3>$${totalIngresos.toLocaleString("es-CO", { maximumFractionDigits: 0 })}</h3>
          <p>Ingresos totales</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">👥</span>
          <h3>${totalClientes}</h3>
          <p>Clientes registrados</p>
        </div>
      </div>

      <h2 style="margin: 2rem 0 1rem; font-size: 1.1rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Acceso rápido</h2>
      <div class="quick-access-grid">
        ${hasPermission('pos') ? `
        <div class="quick-card" onclick="navigateTo('pos')">
          <span class="qc-icon">💳</span>
          <div class="qc-text"><strong>Punto de Venta</strong><span>Nueva venta</span></div>
        </div>` : ''}
        
        ${hasPermission('history') ? `
        <div class="quick-card" onclick="navigateTo('history')">
          <span class="qc-icon">🕑</span>
          <div class="qc-text"><strong>Historial</strong><span>Ver ventas anteriores</span></div>
        </div>` : ''}
        
        ${hasPermission('clientes') ? `
        <div class="quick-card" onclick="navigateTo('clientes')">
          <span class="qc-icon">👥</span>
          <div class="qc-text"><strong>Clientes</strong><span>Base de clientes</span></div>
        </div>` : ''}
        
        ${hasPermission('products') ? `
        <div class="quick-card" onclick="navigateTo('products')">
          <span class="qc-icon">📦</span>
          <div class="qc-text"><strong>Productos</strong><span>Gestionar inventario</span></div>
        </div>` : ''}
        
        ${hasPermission('categorias') ? `
        <div class="quick-card" onclick="navigateTo('categorias')">
          <span class="qc-icon">🏷️</span>
          <div class="qc-text"><strong>Categorías</strong><span>Agrupar productos</span></div>
        </div>` : ''}
        
        ${hasPermission('compras') ? `
        <div class="quick-card" onclick="navigateTo('compras')">
          <span class="qc-icon">🛒</span>
          <div class="qc-text"><strong>Compras</strong><span>Registrar compras</span></div>
        </div>` : ''}
        
        ${hasPermission('reports') ? `
        <div class="quick-card" onclick="navigateTo('reports')">
          <span class="qc-icon">📊</span>
          <div class="qc-text"><strong>Reportes</strong><span>Ver estadísticas</span></div>
        </div>` : ''}
        
        ${hasPermission('users') ? `
        <div class="quick-card" onclick="navigateTo('users')">
          <span class="qc-icon">👤</span>
          <div class="qc-text"><strong>Usuarios</strong><span>Gestionar accesos</span></div>
        </div>` : ''}

        ${hasPermission('missing') ? `
        <div class="quick-card" onclick="navigateTo('missing')">
          <span class="qc-icon">⚠️</span>
          <div class="qc-text"><strong>Faltantes</strong><span>Reportar productos</span></div>
        </div>` : ''}
      </div>
    </div>`;
}

function renderPOS() {
  const view = document.getElementById("view-pos");
  view.innerHTML = `
    <div class="pos-container">
      <!-- Columna izquierda: búsqueda de productos -->
      <div class="pos-search">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin:0;">🔍 Buscar Producto</h3>
          <span id="pos-venta-id" style="font-size:0.75rem; color:var(--text-muted); font-family:'JetBrains Mono',monospace;"></span>
        </div>
        <input type="text" id="pos-search" placeholder="Nombre del producto..." class="search-input" autocomplete="off">
        <div id="pos-results" class="pos-results"></div>

        <!-- Ventas pausadas -->
        <div id="ventas-abiertas-section"></div>
      </div>

      <!-- Columna derecha: carrito -->
      <div class="pos-cart">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid var(--glass-border);">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin:0;">🛒 Carrito</h3>
          <span id="pos-items-count" style="background:var(--neon-blue,#3B82F6); color:white; font-size:0.72rem; font-weight:700; padding:2px 10px; border-radius:20px;">0 items</span>
        </div>

        <div style="flex:1; overflow-y:auto; min-height:0;">
          <table id="pos-cart-table" class="cart-table">
            <thead>
              <tr>
                <th style="width:28%;">Producto</th>
                <th style="width:20%;">Precio</th>
                <th style="width:16%;">Cant.</th>
                <th style="width:20%;">Total</th>
                <th style="width:16%;"></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>

        <!-- Descuento -->
        <div style="margin-top:0.75rem; padding:0.75rem; background:var(--glass-light); border-radius:8px; border:1px solid var(--glass-border);">
          <div style="font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.5rem;">Descuento</div>
          ${(state.descuentos || []).filter(d => d.activo !== false).length > 0 ? `
          <select id="discount-preset" onchange="seleccionarDescuentoPredefinido()"
            style="width:100%; margin-bottom:0.5rem; padding:0.5rem; border:1px solid var(--glass-border); border-radius:6px; background:var(--bg-input); color:var(--text-main); font-family:inherit; font-size:0.875rem;">
            <option value="">— Seleccionar descuento predefinido —</option>
            ${(state.descuentos || []).filter(d => d.activo !== false).map(d =>
              `<option value="${d.id}" data-tipo="${d.tipo}" data-valor="${d.valor}">${d.nombre} (${d.tipo === 'porcentaje' ? d.valor + '%' : '$' + Number(d.valor).toFixed(2)})</option>`
            ).join('')}
          </select>
          ` : ''}
          <div style="display:flex; gap:0.5rem;">
            <input type="number" id="discount-input" placeholder="Valor" min="0" step="0.01"
              style="flex:2; padding:0.5rem 0.75rem; border:1px solid var(--glass-border); border-radius:6px; background:var(--bg-input); color:var(--text-main); font-family:inherit; font-size:0.875rem;">
            <select id="discount-type"
              style="flex:1; padding:0.5rem; border:1px solid var(--glass-border); border-radius:6px; background:var(--bg-input); color:var(--text-main); font-family:inherit; font-size:0.875rem;">
              <option value="porcentaje">%</option>
              <option value="monto">$</option>
            </select>
            <button class="btn btn-small btn-info" onclick="aplicarDescuentoCarrito()">OK</button>
          </div>
        </div>

        <!-- Resumen de totales -->
        <div class="cart-summary" style="margin-top:0.75rem;">
          <div class="summary-row"><span>Subtotal</span><span id="pos-subtotal">$0.00</span></div>
          <div class="summary-row" id="discount-row" style="display:none; color:var(--neon-green,#10B981);">
            <span>Descuento</span><span id="pos-discount">-$0.00</span>
          </div>
          <div class="summary-row"><span>IVA (19%)</span><span id="pos-tax">$0.00</span></div>
          <div class="summary-row total"><span>TOTAL</span><span id="pos-total" style="color:var(--neon-green,#10B981);">$0.00</span></div>
        </div>

        <!-- Botones de acción -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin-top:0.75rem;">
          <button class="btn btn-warning" onclick="pausarVentaActual()" style="font-size:0.85rem;">⏸ Pausar</button>
          <button class="btn btn-danger"  onclick="cancelarVenta()"      style="font-size:0.85rem;">✕ Cancelar</button>
          <button class="btn btn-success" onclick="mostrarModalPago()"   style="grid-column:span 2; padding:1rem; font-size:1rem; letter-spacing:0.02em;">
            💳 Cobrar Venta
          </button>
        </div>
      </div>
    </div>
  `;

  // Eventos
  document.getElementById("pos-search").addEventListener("input", e => mostrarResultadosBusqueda(e.target.value));
  mostrarVentasAbiertas();
  actualizarCartaPOS();
}


function mostrarResultadosBusqueda(query) {
  const resultsDiv = document.getElementById("pos-results");
  if (!query) { resultsDiv.innerHTML = ""; return; }
  const results = searchProducts(query);
  if (results.length === 0) { resultsDiv.innerHTML = "<p>No hay productos que coincidan</p>"; return; }
  resultsDiv.innerHTML = results.map(p => `<div class="product-result"><div class="product-info"><strong>${p.nombre}</strong><br><small>Stock: ${p.stock}</small><br><small>$${p.precio.toFixed(2)}</small></div><button class="btn-small" onclick="agregarAlPOS('${p.id}')">Agregar</button></div>`).join("");
}

function agregarAlPOS(productoId) {
  addItemToSale(productoId);
  actualizarCartaPOS();
  document.getElementById("pos-search").value = "";
  document.getElementById("pos-results").innerHTML = "";
}

function actualizarCartaPOS() {
  if (!state.ventaActual) return;
  const tbody = document.querySelector("#pos-cart-table tbody");
  const items = state.ventaActual.items;

  // Actualizar badge de items
  const countBadge = document.getElementById("pos-items-count");
  if (countBadge) countBadge.textContent = items.length + " item" + (items.length !== 1 ? "s" : "");

  // Actualizar ID de venta en header
  const ventaId = document.getElementById("pos-venta-id");
  if (ventaId) ventaId.textContent = state.ventaActual.id || "";

  tbody.innerHTML = items.map(item => `
    <tr>
      <td style="font-weight:600; color:var(--text-main);">${item.nombre} <button style="background:none; border:none; cursor:pointer; font-size:12px; margin-left:4px;" onclick="editarProductoPOS('${item.id}')" title="Editar precio">✏️</button></td>
      <td style="color:var(--text-muted);">$${item.precio.toFixed(2)}</td>
      <td><input type="number" value="${item.cantidad}" min="1"
        style="width:100%; max-width:55px; padding:0.35rem 0.2rem; border:1px solid var(--glass-border); border-radius:6px; background:var(--bg-input); color:var(--text-main); font-family:inherit; text-align:center;"
        onchange="changeItemQuantity('${item.id}', parseInt(this.value)); actualizarCartaPOS();"></td>
      <td style="font-weight:700; color:var(--text-main);">$${item.subtotal.toFixed(2)}</td>
      <td>
        <button class="btn-small btn-danger" style="padding:0.2rem 0.5rem;" onclick="removeItemFromSale('${item.id}'); actualizarCartaPOS();">✕</button>
      </td>
    </tr>
  `).join("");

  document.getElementById("pos-subtotal").textContent = `$${state.ventaActual.subtotal.toFixed(2)}`;

  const discountRow = document.getElementById("discount-row");
  if (state.ventaActual.descuento > 0) {
    discountRow.style.display = "flex";
    document.getElementById("pos-discount").textContent = `-$${state.ventaActual.descuento.toFixed(2)}`;
  } else {
    discountRow.style.display = "none";
  }

  document.getElementById("pos-tax").textContent   = `$${state.ventaActual.impuesto.toFixed(2)}`;
  document.getElementById("pos-total").textContent  = `$${state.ventaActual.total.toFixed(2)}`;
}


function aplicarDescuentoCarrito() {
  if (!state.ventaActual) {
    showToast("No hay venta activa", "error");
    return;
  }
  
  const discountInput = document.getElementById("discount-input");
  const discountType = document.getElementById("discount-type").value;
  const discountValue = parseFloat(discountInput.value);
  
  if (isNaN(discountValue) || discountValue < 0) {
    showToast("Ingrese un valor válido", "error");
    return;
  }
  
  applyDiscountToSale(discountValue, discountType);
  actualizarCartaPOS();
  discountInput.value = "";
}

function seleccionarDescuentoPredefinido() {
  const select = document.getElementById("discount-preset");
  if (!select || !select.value) return;
  const opt = select.options[select.selectedIndex];
  const input = document.getElementById("discount-input");
  const typeSelect = document.getElementById("discount-type");
  if (input) input.value = opt.dataset.valor;
  if (typeSelect) typeSelect.value = opt.dataset.tipo;
}

async function editarProductoPOS(productoId) {
  const product = getProductById(productoId);
  if (!product) return;
  const newPrice = await customPrompt("Nuevo precio:", product.precio);
  if (newPrice !== null && !isNaN(newPrice)) {
    product.precio = parseFloat(newPrice);
    const item = state.ventaActual.items.find(i => i.id === productoId);
    if (item) { item.precio = parseFloat(newPrice); item.subtotal = item.precio * item.cantidad; calculateSaleTotals(); actualizarCartaPOS(); showToast("Precio actualizado", "success"); }
  }
}

function mostrarVentasAbiertas() {
  const section = document.getElementById("ventas-abiertas-section");
  if (state.ventasAbiertas.length === 0) { section.innerHTML = ""; return; }
  section.innerHTML = `<div class="open-sales-section"><h4>Ventas Pausadas (${state.ventasAbiertas.length})</h4><div class="open-sales-list">${state.ventasAbiertas.map(v => `<div class="open-sale-card"><div class="sale-info"><strong>${v.id}</strong> - $${v.total.toFixed(2)}</div><button class="btn-small btn-primary" onclick="retomarVenta('${v.id}'); navigateTo('pos');">Retomar</button></div>`).join("")}</div></div>`;
}

async function cancelarVenta() {
  const confirmed = await customConfirm("¿Cancelar la venta actual?");
  if (confirmed) { state.ventaActual = null; showToast("Venta cancelada", "warning"); navigateTo("home"); }
}

async function mostrarModalPago() {
  if (!state.ventaActual || state.ventaActual.items.length === 0) { showToast("No hay items en la venta", "warning"); return; }
  const total = state.ventaActual.total;
  const opcionesClientes = state.clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <h3>💳 Procesar Pago</h3>
    <div class="payment-form">
      <p style="font-size:1.2rem; margin-bottom:1rem;">Total a pagar: <strong style="color:var(--success);">$${total.toFixed(2)}</strong></p>

      <label>Método de pago:</label>
      <select id="payment-method" class="form-input" onchange="actualizarCampoPago()">
        <option value="efectivo">Efectivo</option>
        <option value="nequi">Nequi</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
        <option value="debe">Debe (cuenta por cobrar)</option>
      </select>

      <div id="campo-efectivo">
        <label>Valor recibido:</label>
        <input type="number" id="payment-amount" class="form-input" placeholder="0.00" min="0" step="0.01">
        <div id="payment-change" style="margin-top:0.5rem;"></div>
      </div>

      <div id="campo-debe" style="display:none;">
        <label>Asociar a cliente:</label>
        <select id="payment-cliente" class="form-input">
          <option value="">Sin cliente</option>
          ${opcionesClientes}
        </select>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.5rem;">El saldo quedará pendiente de cobro para el cliente seleccionado.</p>
      </div>

      <div style="display:flex; gap:0.75rem; margin-top:1.5rem;">
        <button class="btn btn-success" style="flex:1;" onclick="procesarPago()">✅ Confirmar Pago</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      </div>
    </div>`;

  // Calcular cambio en tiempo real para efectivo
  document.getElementById("payment-amount").addEventListener("input", function() {
    const amount = parseFloat(this.value) || 0;
    const change = amount - total;
    const changeDiv = document.getElementById("payment-change");
    if (amount === 0) { changeDiv.innerHTML = ""; return; }
    if (change >= 0) changeDiv.innerHTML = `<p style="color:var(--success); font-weight:600;">Cambio: $${change.toFixed(2)}</p>`;
    else changeDiv.innerHTML = `<p style="color:var(--danger); font-weight:600;">Falta: $${Math.abs(change).toFixed(2)}</p>`;
  });

  openModal();
}

function actualizarCampoPago() {
  const method = document.getElementById("payment-method").value;
  document.getElementById("campo-efectivo").style.display = method === "efectivo" ? "" : "none";
  document.getElementById("campo-debe").style.display = method === "debe" ? "" : "none";
}

async function procesarPago() {
  const method = document.getElementById("payment-method").value;
  let amount;

  if (method === "efectivo") {
    amount = parseFloat(document.getElementById("payment-amount").value) || 0;
    if (amount < state.ventaActual.total) { showToast("El valor recibido es insuficiente", "error"); return; }
  } else if (method === "nequi" || method === "tarjeta" || method === "transferencia") {
    amount = state.ventaActual.total;
  } else if (method === "debe") {
    amount = state.ventaActual.total;
    const clienteId = document.getElementById("payment-cliente").value;
    if (!clienteId) {
      showToast("El método 'Debe' requiere seleccionar un cliente", "error");
      return;
    }
    state.ventaActual.clienteId = clienteId;
  }

  const confirmBtn = document.querySelector("#modal-content .btn-success");
  setButtonLoading(confirmBtn, true);

  try {
    const ventaParaMostrar = {
      id: state.ventaActual.id,
      fecha: state.ventaActual.fecha,
      items: [...state.ventaActual.items],
      subtotal: state.ventaActual.subtotal,
      descuento: state.ventaActual.descuento,
      impuesto: state.ventaActual.impuesto,
      total: state.ventaActual.total,
      metodoPago: method,
      cambio: method === "efectivo" ? amount - state.ventaActual.total : 0
    };

    const success = await closeSale(method, amount);
    if (success) {
      closeModal();
      mostrarComprobante(ventaParaMostrar);
    }
  } finally {
    setButtonLoading(confirmBtn, false);
  }
}

function mostrarComprobante(venta) {
  const metodosLabel = {
    efectivo: "Efectivo", nequi: "Nequi", tarjeta: "Tarjeta",
    transferencia: "Transferencia", debe: "Debe (cuenta por cobrar)"
  };
  const items = Array.isArray(venta.items) ? venta.items : [];
  const fmt = n => parseFloat(n || 0).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const filasItems = items.map(item =>
    `<tr>
      <td style="padding:6px 8px; border-bottom:1px solid #e5e7eb;">${item.nombre}</td>
      <td style="padding:6px 8px; text-align:center; border-bottom:1px solid #e5e7eb; color:#6b7280;">${item.cantidad}</td>
      <td style="padding:6px 8px; text-align:right; border-bottom:1px solid #e5e7eb; color:#6b7280;">$${fmt(item.precio)}</td>
      <td style="padding:6px 8px; text-align:right; border-bottom:1px solid #e5e7eb; font-weight:600;">$${fmt(item.subtotal)}</td>
    </tr>`
  ).join("");

  const baseImponible = parseFloat(venta.subtotal || 0) - parseFloat(venta.descuento || 0);
  const basesinIVA = baseImponible / 1.19;
  const ivaReal = baseImponible - basesinIVA;

  const descuentoHtml = venta.descuento > 0
    ? `<tr><td colspan="3" style="text-align:right; padding:4px 8px; color:#6b7280;">Descuento:</td><td style="text-align:right; padding:4px 8px; color:#dc2626; font-weight:600;">-$${fmt(venta.descuento)}</td></tr>`
    : "";

  const cambioHtml = venta.metodoPago === "efectivo" && venta.cambio > 0
    ? `<div style="display:flex; justify-content:space-between; padding:4px 0;"><span style="color:#6b7280;">Cambio entregado:</span><span style="font-weight:600; color:#059669;">$${fmt(venta.cambio)}</span></div>`
    : "";

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <div id="factura-print-area" style="font-family:'Inter',system-ui,sans-serif; max-width:440px; margin:0 auto; background:#fff; color:#111827; padding:0;">

      <!-- Encabezado -->
      <div style="background:linear-gradient(135deg,#3D6B9E,#2a5080); color:#fff; padding:1.5rem; border-radius:10px 10px 0 0; text-align:center;">
        <div style="font-size:2rem; margin-bottom:0.25rem;">🌙</div>
        <h2 style="margin:0; font-size:1.4rem; font-weight:700; letter-spacing:0.05em;">PAPEL & LUNA</h2>
        <p style="margin:0.25rem 0 0; font-size:0.8rem; opacity:0.85;">NIT: 900.123.456-7 · Cali, Colombia</p>
      </div>

      <!-- Info comprobante -->
      <div style="background:#f9fafb; padding:0.85rem 1.25rem; border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; font-size:0.82rem; color:#374151;">
        <div><span style="color:#6b7280;">Comprobante</span><br><strong style="font-family:monospace;">#${venta.numero || venta.id?.slice(-8).toUpperCase()}</strong></div>
        <div style="text-align:right;"><span style="color:#6b7280;">Fecha</span><br><strong>${venta.fecha || new Date().toLocaleDateString("es-CO")}</strong></div>
      </div>

      <!-- Tabla de items -->
      <div style="padding:0 1.25rem;">
        <table style="width:100%; font-size:0.87rem; border-collapse:collapse; margin-top:1rem;">
          <thead>
            <tr style="border-bottom:2px solid #e5e7eb;">
              <th style="text-align:left; padding:6px 8px; color:#6b7280; font-weight:600; font-size:0.78rem; text-transform:uppercase;">Descripción</th>
              <th style="text-align:center; padding:6px 8px; color:#6b7280; font-weight:600; font-size:0.78rem; text-transform:uppercase;">Cant.</th>
              <th style="text-align:right; padding:6px 8px; color:#6b7280; font-weight:600; font-size:0.78rem; text-transform:uppercase;">P.Unit.</th>
              <th style="text-align:right; padding:6px 8px; color:#6b7280; font-weight:600; font-size:0.78rem; text-transform:uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>${filasItems}</tbody>
          <tfoot>
            <tr><td colspan="3" style="text-align:right; padding:6px 8px; color:#6b7280;">Subtotal:</td><td style="text-align:right; padding:6px 8px;">$${fmt(venta.subtotal)}</td></tr>
            ${descuentoHtml}
            <tr><td colspan="3" style="text-align:right; padding:4px 8px; color:#6b7280;">Base (sin IVA):</td><td style="text-align:right; padding:4px 8px; color:#6b7280;">$${fmt(basesinIVA)}</td></tr>
            <tr><td colspan="3" style="text-align:right; padding:4px 8px; color:#6b7280;">IVA (19%):</td><td style="text-align:right; padding:4px 8px; color:#6b7280;">$${fmt(ivaReal)}</td></tr>
            <tr style="border-top:2px solid #111827;">
              <td colspan="3" style="text-align:right; padding:8px 8px; font-weight:700; font-size:1rem;">TOTAL:</td>
              <td style="text-align:right; padding:8px 8px; font-weight:800; font-size:1.1rem; color:#059669;">$${fmt(venta.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Pago -->
      <div style="margin:1rem 1.25rem; padding:0.85rem 1rem; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb; font-size:0.87rem;">
        <div style="display:flex; justify-content:space-between; padding:3px 0;">
          <span style="color:#6b7280;">Método de pago:</span>
          <span style="font-weight:600;">${metodosLabel[venta.metodoPago] || venta.metodoPago || "—"}</span>
        </div>
        ${cambioHtml}
      </div>

      <!-- Pie -->
      <div style="text-align:center; padding:1rem; border-top:1px dashed #d1d5db; color:#9ca3af; font-size:0.78rem;">
        <p style="margin:0 0 0.25rem; font-weight:600; color:#6b7280;">¡Gracias por su compra!</p>
        <p style="margin:0;">Este documento es un comprobante de transacción comercial.</p>
      </div>

      <!-- Botones (no imprimen) -->
      <div class="no-print" style="display:flex; gap:0.75rem; padding:1rem 1.25rem 0;">
        <button class="btn btn-primary" style="flex:1;" onclick="window.print()">🖨️ Imprimir / PDF</button>
        <button class="btn btn-secondary" onclick="closeModal(); startSale(); navigateTo('pos');">🛒 Nueva Venta</button>
        <button class="btn btn-secondary" onclick="closeModal(); navigateTo('history');">📊 Historial</button>
      </div>
    </div>`;
  openModal();
}

function renderProductList() {
  const view = document.getElementById("view-products");
  const products = getAllProducts();
  view.innerHTML = `<div class="container"><div class="section-header"><h2>Gestión de Productos</h2><button class="btn btn-primary" onclick="mostrarFormularioProducto()">+ Nuevo Producto</button></div><div class="table-container"><table class="data-table"><thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Costo</th><th>Stock</th><th>Acción</th></tr></thead><tbody>${products.map((p, idx) => `<tr><td><strong>${String(idx + 1).padStart(4, '0')}</strong></td><td>${p.nombre}</td><td>$${p.precio.toFixed(2)}</td><td>$${p.costo.toFixed(2)}</td><td><span class="badge badge-success">${p.stock}</span></td><td><button class="btn btn-small btn-secondary product-edit" data-id="${p.id}">✏️ Editar</button> <button class="btn btn-small btn-danger product-delete" data-id="${p.id}">🗑️ Eliminar</button></td></tr>`).join("")}</tbody></table></div></div>`;
  
  // Event listeners para editar y eliminar
  document.querySelectorAll('.product-edit').forEach(btn => {
    btn.addEventListener('click', () => mostrarFormularioProducto(btn.dataset.id));
  });
  document.querySelectorAll('.product-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const confirmed = await customConfirm('¿Está seguro que desea eliminar este producto?');
      if(confirmed) {
        deleteProduct(btn.dataset.id);
        renderProductList();
      }
    });
  });
}

function mostrarFormularioProducto(productId = null) {
  const product = productId ? state.productos.find(p => String(p.id) === String(productId)) : null;
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `<h3>${product ? "Editar Producto" : "Nuevo Producto"}</h3><form id="product-form" class="form"><input type="hidden" id="product-id" value="${product?.id || ""}"><label>Nombre:</label><input type="text" class="form-input" id="product-nombre" value="${product?.nombre || ""}" required><label>Descripcion:</label><textarea class="form-input" id="product-descripcion">${product?.descripcion || ""}</textarea><label>Precio de Venta:</label><input type="number" class="form-input" id="product-precio" value="${product?.precio || ""}" step="0.01" min="0" required><label>Costo:</label><input type="number" class="form-input" id="product-costo" value="${product?.costo || ""}" step="0.01" min="0" required><label>Stock:</label><input type="number" class="form-input" id="product-stock" value="${product?.stock ?? ""}" min="0" required><label>Categoria:</label><select class="form-input" id="product-categoria"><option value="">Sin categoría</option>${state.categorias.map(c => `<option value="${c.id}" ${product?.categoriaId === c.id ? "selected" : ""}>${c.nombre}</option>`).join("")}</select><button type="submit" class="btn btn-success">Guardar</button><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button></form>`;
  document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const catId = document.getElementById("product-categoria").value;
    const catObj = state.categorias.find(c => c.id === catId);
    const data = {
      nombre: document.getElementById("product-nombre").value,
      descripcion: document.getElementById("product-descripcion").value,
      precio: document.getElementById("product-precio").value,
      costo: document.getElementById("product-costo").value,
      stock: document.getElementById("product-stock").value,
      categoriaId: catId || null,
      categoria: catObj ? catObj.nombre : "Sin categoría"
    };
    if (productId) await updateProduct(productId, data);
    else await createProduct(data);
    closeModal();
    renderProductList();
  });
  openModal();
}

function renderCategoriasList() {
  const view = document.getElementById("view-categorias");
  const categorias = state.categorias;
  view.innerHTML = `<div class="container"><div class="section-header"><h2>Categorías</h2><button class="btn btn-primary" onclick="mostrarFormularioCategoria()">+ Nueva Categoría</button></div><div class="cards-grid">${categorias.map(c => `<div class="card"><h4>${c.nombre}</h4><p>${c.descripcion || ""}</p><div class="card-actions"><button class="btn btn-small btn-secondary categoria-edit" data-id="${c.id}">✏️ Editar</button><button class="btn btn-small btn-danger categoria-delete" data-id="${c.id}">🗑️ Eliminar</button></div></div>`).join("")}</div></div>`;
  
  // Event listeners para editar y eliminar
  document.querySelectorAll('.categoria-edit').forEach(btn => {
    btn.addEventListener('click', () => mostrarFormularioCategoria(btn.dataset.id));
  });
  document.querySelectorAll('.categoria-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const confirmed = await customConfirm('¿Está seguro que desea eliminar esta categoría?');
      if(confirmed) {
        deleteCategoria(btn.dataset.id);
        renderCategoriasList();
      }
    });
  });
}

function mostrarFormularioCategoria(categoriaId = null) {
  const categoria = categoriaId ? state.categorias.find(c => String(c.id) === String(categoriaId)) : null;
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `<h3>${categoria ? "Editar Categoria" : "Nueva Categoria"}</h3><form id="categoria-form" class="form"><label>Nombre:</label><input type="text" class="form-input" id="categoria-nombre" value="${categoria?.nombre || ""}" required><label>Descripcion:</label><textarea class="form-input" id="categoria-descripcion">${categoria?.descripcion || ""}</textarea><button type="submit" class="btn btn-success">Guardar</button><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button></form>`;
  document.getElementById("categoria-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("categoria-nombre").value;
    const descripcion = document.getElementById("categoria-descripcion").value;
    let categoryData;
    if (categoriaId) {
      const cat = state.categorias.find(c => String(c.id) === String(categoriaId));
      if (cat) {
        cat.nombre = nombre;
        cat.descripcion = descripcion;
        categoryData = cat;
        const saved = await saveSheetData("categorias", categoryData).catch(e => { console.warn(e); return null; });
        if (saved && saved !== true && saved !== false) Object.assign(cat, saved);
      }
    } else {
      categoryData = { nombre, descripcion };
      const saved = await saveSheetData("categorias", categoryData).catch(e => { console.warn(e); return null; });
      const finalCategory = (saved && saved !== true && saved !== false) ? saved : { id: `CAT-${Date.now()}`, nombre, descripcion };
      state.categorias.push(finalCategory);
    }

    showToast("Categoría guardada", "success");
    closeModal();
    renderCategoriasList();
  });
  openModal();
}

function deleteCategoria(categoriaId) {
  const index = state.categorias.findIndex(c => String(c.id) === String(categoriaId));
  if (index > -1) { 
    state.categorias.splice(index, 1); 
    saveToLocalStorage("categorias", state.categorias);
    // Añadir a lista negra local
    if (!state.eliminados) state.eliminados = [];
    state.eliminados.push(String(categoriaId));
    // Eliminar también en la nube
    deleteSheetData("categorias", categoriaId);
    showToast("Categoría eliminada", "success"); 
  }
}

function contarItemsVenta(v) {
  if (Array.isArray(v.items) && v.items.length > 0) return v.items.length;
  if (v.itemsJson) {
    try { return JSON.parse(v.itemsJson).length; } catch (e) { return 0; }
  }
  return 0;
}

function renderFilasHistorial(ventas) {
  // Ocultar ventas corregidas o anuladas por defecto para evitar confusión de duplicados
  const estadoFiltro = document.getElementById("filter-estado")?.value;
  const ventasFiltradas = (estadoFiltro === "" || !estadoFiltro) 
    ? ventas.filter(v => v.estado !== 'corregida' && v.estado !== 'anulada')
    : ventas;

  if (ventasFiltradas.length === 0) {
    return '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No hay ventas registradas</td></tr>';
  }

  return ventasFiltradas.map(function(v) {
    var n = contarItemsVenta(v);
    return '<tr>'
      + '<td><span class="badge badge-info">' + v.id + '</span></td>'
      + '<td>' + v.fecha + '</td>'
      + '<td><span class="badge">' + n + ' items</span></td>'
      + '<td>$' + parseFloat(v.subtotal).toFixed(2) + '</td>'
      + '<td>$' + parseFloat(v.impuesto).toFixed(2) + '</td>'
      + '<td><strong style="color: var(--success);">$' + parseFloat(v.total).toFixed(2) + '</strong></td>'
      + '<td><span class="badge badge-warning">' + (v.metodoPago || '-') + '</span></td>'
      + '<td>$' + parseFloat(v.cambio || 0).toFixed(2) + '</td>'
      + '<td><button class="btn btn-small" style="background:var(--primary); color:white; border:none;" onclick="mostrarFactura(\'' + v.id + '\')">📄 Ver</button></td>'
      + '</tr>';
  }).join('');
}

function renderSalesHistory() {
  const view = document.getElementById("view-history");
  const ventas = getSalesHistory();
  view.innerHTML = `<div class="container">
    <div class="section-header">
      <h2>📊 Historial de Ventas</h2>
    </div>
    
    <div style="background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; margin-bottom: 2rem;">
      <h3 style="margin-top: 0;">🔍 Filtros Avanzados</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div>
          <label>Buscar:</label>
          <input type="text" id="filter-buscar" class="form-input" placeholder="ID, Producto, Número..." oninput="aplicarFiltrosHistorial()">
        </div>
        <div>
          <label>Estado:</label>
          <select id="filter-estado" class="form-input" onchange="aplicarFiltrosHistorial()">
            <option value="">Todos</option>
            <option value="cerrada">Cerrada</option>
            <option value="corregida">Corregida</option>
            <option value="anulada">Anulada</option>
          </select>
        </div>
        <div>
          <label>Método de Pago:</label>
          <select id="filter-method" class="form-input" onchange="aplicarFiltrosHistorial()">
            <option value="">Todos</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div>
          <label>Desde:</label>
          <input type="date" id="filter-desde" class="form-input" onchange="aplicarFiltrosHistorial()">
        </div>
        <div>
          <label>Hasta:</label>
          <input type="date" id="filter-hasta" class="form-input" onchange="aplicarFiltrosHistorial()">
        </div>
        <div>
          <label>Monto Mínimo:</label>
          <input type="number" id="filter-minimo" class="form-input" step="0.01" placeholder="0.00" onchange="aplicarFiltrosHistorial()">
        </div>
        <div>
          <label>Monto Máximo:</label>
          <input type="number" id="filter-maximo" class="form-input" step="0.01" placeholder="0.00" onchange="aplicarFiltrosHistorial()">
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
          <button class="btn btn-primary" onclick="aplicarFiltrosHistorial()" style="flex:1;">🔍 Buscar</button>
          <button class="btn btn-secondary" onclick="limpiarFiltrosHistorial()" style="flex:1;">Limpiar</button>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Items</th>
            <th>Subtotal</th>
            <th>Impuesto</th>
            <th>Total</th>
            <th>Método Pago</th>
            <th>Cambio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="history-tbody">
          ${renderFilasHistorial(ventas)}
        </tbody>
      </table>
    </div>
  </div>`;
}

function mostrarFactura(id) {
  const ventas = getSalesHistory();
  const venta = ventas.find(v => v.id === id);
  if (!venta) return showToast("Venta no encontrada", "error");

  const metodosLabel = {
    efectivo: "Efectivo", nequi: "Nequi", tarjeta: "Tarjeta",
    transferencia: "Transferencia", debe: "Debe (cuenta por cobrar)"
  };
  const fmt = n => parseFloat(n || 0).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const estadoBadge = { cerrada: "badge-success", anulada: "badge-danger", pendiente: "badge-warning" };

  const baseImponible = parseFloat(venta.subtotal || 0) - parseFloat(venta.descuento || 0);
  const basesinIVA = baseImponible / 1.19;
  const ivaReal = baseImponible - basesinIVA;

  const modalContent = document.getElementById("modal-content");
  const html = `
    <div id="factura-print-area" style="font-family:'Inter',system-ui,sans-serif; max-width:520px; margin:0 auto; background:#fff; color:#111827;">

      <!-- Encabezado empresa -->
      <div style="background:linear-gradient(135deg,#3D6B9E,#2a5080); color:#fff; padding:1.5rem 2rem; border-radius:10px 10px 0 0; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:1.6rem; font-weight:800; letter-spacing:0.02em;">🌙 Papel &amp; Luna</div>
          <div style="font-size:0.8rem; opacity:0.85; margin-top:0.2rem;">NIT: 900.123.456-7 · Cali, Colombia</div>
          <div style="font-size:0.8rem; opacity:0.8;">Tel: (300) 123-4567</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem; opacity:0.8; text-transform:uppercase; letter-spacing:0.08em;">Factura</div>
          <div style="font-size:1.1rem; font-weight:700; font-family:monospace;">#${venta.numero || venta.id?.slice(-8).toUpperCase()}</div>
          <span class="badge ${estadoBadge[venta.estado] || 'badge-info'}" style="margin-top:0.25rem;">${(venta.estado || "cerrada").toUpperCase()}</span>
        </div>
      </div>

      <!-- Metadatos -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0; border-bottom:1px solid #e5e7eb;">
        <div style="padding:0.85rem 1.5rem; border-right:1px solid #e5e7eb;">
          <div style="font-size:0.72rem; color:#9ca3af; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.25rem;">Fecha de emisión</div>
          <div style="font-weight:600; font-size:0.9rem;">${venta.fecha || "—"}</div>
        </div>
        <div style="padding:0.85rem 1.5rem;">
          <div style="font-size:0.72rem; color:#9ca3af; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.25rem;">Método de pago</div>
          <div style="font-weight:600; font-size:0.9rem;">${metodosLabel[venta.metodoPago] || venta.metodoPago || "—"}</div>
        </div>
      </div>

      <!-- Items -->
      <div style="padding:1rem 1.5rem;">
        <table style="width:100%; border-collapse:collapse; font-size:0.87rem;">
          <thead>
            <tr style="border-bottom:2px solid #e5e7eb;">
              <th style="text-align:left; padding:6px 4px; color:#6b7280; font-size:0.75rem; text-transform:uppercase; font-weight:600;">Descripción</th>
              <th style="text-align:center; padding:6px 4px; color:#6b7280; font-size:0.75rem; text-transform:uppercase; font-weight:600;">Cant.</th>
              <th style="text-align:right; padding:6px 4px; color:#6b7280; font-size:0.75rem; text-transform:uppercase; font-weight:600;">P.Unit.</th>
              <th style="text-align:right; padding:6px 4px; color:#6b7280; font-size:0.75rem; text-transform:uppercase; font-weight:600;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${(venta.items || []).map(item => `
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:8px 4px; font-weight:500;">${item.nombre}</td>
                <td style="padding:8px 4px; text-align:center; color:#6b7280;">${item.cantidad}</td>
                <td style="padding:8px 4px; text-align:right; color:#6b7280;">$${fmt(item.precio)}</td>
                <td style="padding:8px 4px; text-align:right; font-weight:600;">$${fmt(item.subtotal || (item.precio * item.cantidad))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- Totales -->
      <div style="margin:0 1.5rem 1rem; padding:1rem; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;">
        <div style="display:flex; justify-content:space-between; padding:3px 0; font-size:0.87rem;">
          <span style="color:#6b7280;">Subtotal bruto:</span><span>$${fmt(venta.subtotal)}</span>
        </div>
        ${venta.descuento > 0 ? `<div style="display:flex; justify-content:space-between; padding:3px 0; font-size:0.87rem;">
          <span style="color:#6b7280;">Descuento:</span><span style="color:#dc2626; font-weight:600;">-$${fmt(venta.descuento)}</span>
        </div>` : ""}
        <div style="display:flex; justify-content:space-between; padding:3px 0; font-size:0.87rem;">
          <span style="color:#6b7280;">Base gravable (sin IVA):</span><span style="color:#6b7280;">$${fmt(basesinIVA)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:3px 0; font-size:0.87rem;">
          <span style="color:#6b7280;">IVA (19%):</span><span style="color:#6b7280;">$${fmt(ivaReal)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:8px 0 3px; border-top:2px solid #d1d5db; margin-top:6px; font-size:1rem; font-weight:800;">
          <span>TOTAL:</span><span style="color:#059669;">$${fmt(venta.total)}</span>
        </div>
        ${venta.metodoPago === "efectivo" && venta.cambio > 0 ? `
        <div style="display:flex; justify-content:space-between; padding:3px 0; font-size:0.87rem; margin-top:4px;">
          <span style="color:#6b7280;">Cambio entregado:</span><span style="color:#059669; font-weight:600;">$${fmt(venta.cambio)}</span>
        </div>` : ""}
      </div>

      ${venta.historialCorrecciones && venta.historialCorrecciones.length > 0 ? `
      <div style="margin:0 1.5rem 1rem; padding:0.75rem 1rem; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; font-size:0.82rem; color:#92400e;">
        <strong style="display:block; margin-bottom:0.5rem;">⚠️ Historial de Correcciones</strong>
        <ul style="margin:0; padding-left:1.2rem;">
          ${venta.historialCorrecciones.map(c => `<li>${c.fecha} — ${c.usuario}: ${c.motivo}</li>`).join("")}
        </ul>
      </div>` : ""}

      <!-- Pie de factura -->
      <div style="text-align:center; padding:1rem 1.5rem; border-top:1px dashed #d1d5db; color:#9ca3af; font-size:0.78rem;">
        <p style="margin:0 0 0.2rem; font-weight:600; color:#6b7280;">¡Gracias por su compra!</p>
        <p style="margin:0;">Este documento es un comprobante de transacción comercial.</p>
      </div>

      <!-- Acciones -->
      <div class="no-print" style="padding:1rem 1.5rem; border-top:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center; gap:0.75rem; flex-wrap:wrap;">
        <div style="display:flex; gap:0.5rem;">
          ${state.rolActual === "admin" ? `
          <button class="btn btn-small" style="background:var(--clr-warning); color:#fff;" onclick="corregirVenta('${venta.id}')">🧰 Corregir</button>
          <button class="btn btn-small" style="background:var(--clr-info); color:#fff;" onclick="reembolsarVenta('${venta.id}')">🔄 Reembolso</button>
          <button class="btn btn-small btn-danger" onclick="anularVenta('${venta.id}')">🗑 Anular</button>
          ` : ""}
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir / PDF</button>
          <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
        </div>
      </div>
    </div>`;

  modalContent.innerHTML = html;
  openModal();
}

function aplicarFiltrosHistorial() {
  const metodoPago = document.getElementById("filter-method").value;
  const estado = document.getElementById("filter-estado").value;
  const buscar = document.getElementById("filter-buscar").value;
  const desde = document.getElementById("filter-desde").value;
  const hasta = document.getElementById("filter-hasta").value;
  const minimo = parseFloat(document.getElementById("filter-minimo").value) || null;
  const maximo = parseFloat(document.getElementById("filter-maximo").value) || null;
  
  const criteria = {
    metodoPago: metodoPago || undefined,
    estado: estado || undefined,
    buscar: buscar || undefined,
    desde: desde || undefined,
    hasta: hasta || undefined,
    minimo: minimo,
    maximo: maximo
  };
  
  const ventasFiltradas = filterSalesBy(criteria);
  const tbody = document.getElementById("history-tbody");
  
  tbody.innerHTML = ventasFiltradas.length === 0
    ? '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No se encontraron ventas con los criterios especificados</td></tr>'
    : renderFilasHistorial(ventasFiltradas);
}

function limpiarFiltrosHistorial() {
  document.getElementById("filter-buscar").value = "";
  document.getElementById("filter-estado").value = "";
  document.getElementById("filter-method").value = "";
  document.getElementById("filter-desde").value = "";
  document.getElementById("filter-hasta").value = "";
  document.getElementById("filter-minimo").value = "";
  document.getElementById("filter-maximo").value = "";
  aplicarFiltrosHistorial();
}

function openModal() { document.querySelector(".modal-overlay").classList.add("active"); }
function closeModal() { document.querySelector(".modal-overlay").classList.remove("active"); document.getElementById("modal-content").innerHTML = ""; }

function customPrompt(message, defaultValue, inputType = 'number') {
  return new Promise(resolve => {
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `
      <h2 style="margin-bottom: 1rem">${message}</h2>
      <div class="form-group" style="margin-bottom: 1.5rem">
        <input type="${inputType}" id="prompt-input" value="${defaultValue}" class="form-input" style="font-size: 1.25rem; font-weight: bold; text-align: center" autofocus>
      </div>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="btn btn-secondary" id="prompt-cancel">Cancelar</button>
        <button class="btn btn-primary" id="prompt-ok">Aceptar</button>
      </div>
    `;
    openModal();
    const input = document.getElementById("prompt-input");
    setTimeout(() => { input.focus(); input.select(); }, 50); // timeout for transition
    
    const cleanup = (val) => { closeModal(); resolve(val); };
    document.getElementById("prompt-cancel").onclick = () => cleanup(null);
    document.getElementById("prompt-ok").onclick = () => cleanup(input.value);
    input.onkeyup = (e) => { if (e.key === "Enter") cleanup(input.value); if (e.key === "Escape") cleanup(null); };
  });
}

function customConfirm(message) {
  return new Promise(resolve => {
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `
      <h2 style="color: var(--danger)">Confirmación</h2>
      <p style="margin-bottom: 1.5rem; font-size: 1.1rem">${message}</p>
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="btn btn-secondary" id="confirm-cancel">Cancelar</button>
        <button class="btn btn-danger" id="confirm-ok">Sí, continuar</button>
      </div>
    `;
    openModal();
    
    const cleanup = (val) => { closeModal(); resolve(val); };
    document.getElementById("confirm-cancel").onclick = () => cleanup(false);
    document.getElementById("confirm-ok").onclick = () => cleanup(true);
    
    const okBtn = document.getElementById("confirm-ok");
    setTimeout(() => okBtn.focus(), 50);
  });
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = "⏳ Cargando...";
    btn.disabled = true;
    btn.style.opacity = "0.75";
  } else {
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
    btn.disabled = false;
    btn.style.opacity = "";
  }
}

// ===== NEW VIEWS FOR MVP 2 =====

// ================================================================
// CLIENTES
// ================================================================
function renderClientesList() {
  const view = document.getElementById("view-clientes");
  const clientes = state.clientes || [];

  view.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>👥 Clientes</h2>
        <button class="btn btn-primary" onclick="mostrarFormularioCliente()">+ Nuevo Cliente</button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="clientes-tbody">
            ${clientes.length === 0
              ? '<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">No hay clientes registrados</td></tr>'
              : clientes.map(c => `
                <tr>
                  <td><strong>${c.nombre}</strong></td>
                  <td>${c.telefono || '—'}</td>
                  <td>${c.correo || '—'}</td>
                  <td style="display:flex; gap:0.4rem;">
                    <button class="btn btn-small btn-secondary cliente-edit" data-id="${c.id}">✏️ Editar</button>
                    <button class="btn btn-small btn-danger cliente-delete" data-id="${c.id}">🗑️</button>
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  document.querySelectorAll('.cliente-edit').forEach(btn =>
    btn.addEventListener('click', () => mostrarFormularioCliente(btn.dataset.id)));
  document.querySelectorAll('.cliente-delete').forEach(btn =>
    btn.addEventListener('click', async () => {
      if (await customConfirm('¿Eliminar este cliente?')) {
        const idToDel = btn.dataset.id;
        state.clientes = state.clientes.filter(c => c.id !== idToDel);
        if (!state.eliminados) state.eliminados = [];
        state.eliminados.push(String(idToDel));
        deleteSheetData("clientes", idToDel);
        showToast('Cliente eliminado', 'success');
        renderClientesList();
      }
    }));
}

function mostrarFormularioCliente(clienteId = null) {
  const cliente = clienteId ? state.clientes.find(c => String(c.id) === String(clienteId)) : null;
  const modal = document.getElementById("modal-content");
  modal.innerHTML = `
    <h2>${cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
    <form id="cliente-form" class="form">
      <div class="form-group">
        <label>Nombre</label>
        <input type="text" class="form-input" id="cli-nombre" value="${cliente?.nombre || ''}" required>
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input type="text" class="form-input" id="cli-telefono" value="${cliente?.telefono || ''}">
      </div>
      <div class="form-group">
        <label>Correo</label>
        <input type="email" class="form-input" id="cli-correo" value="${cliente?.correo || ''}">
      </div>
      <div style="display:flex; gap:0.75rem; margin-top:0.5rem;">
        <button type="submit" class="btn btn-success" style="flex:1;">Guardar</button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      </div>
    </form>`;
  openModal();

  document.getElementById("cliente-form").addEventListener("submit", async e => {
    e.preventDefault();
    const data = {
      id: cliente?.id,
      nombre: document.getElementById("cli-nombre").value.trim(),
      telefono: document.getElementById("cli-telefono").value.trim(),
      correo: document.getElementById("cli-correo").value.trim()
    };
    try {
      const saved = await saveSheetData("clientes", data);
      const final = (saved && saved !== true && saved !== false) ? saved : data;
      if (cliente) {
        const idx = state.clientes.findIndex(c => String(c.id) === String(clienteId));
        if (idx > -1) state.clientes[idx] = final;
      } else {
        state.clientes.push(final);
      }
    } catch(e) { console.warn(e); }
    showToast(cliente ? 'Cliente actualizado' : 'Cliente creado', 'success');
    closeModal();
    renderClientesList();
  });
}

// ================================================================
// PROVEEDORES
// ================================================================
function renderProveedoresList() {
  const view = document.getElementById("view-proveedores");
  const proveedores = state.proveedores || [];

  view.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>🏢 Proveedores</h2>
        <button class="btn btn-primary" onclick="mostrarFormularioProveedor()">+ Nuevo Proveedor</button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>NIT</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${proveedores.length === 0
              ? '<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">No hay proveedores registrados</td></tr>'
              : proveedores.map(p => `
                <tr>
                  <td><strong>${p.nombre}</strong></td>
                  <td><span style="font-family:'JetBrains Mono',monospace; font-size:0.85rem;">${p.nit || '—'}</span></td>
                  <td>${p.contacto || p.telefono || '—'}</td>
                  <td style="display:flex; gap:0.4rem;">
                    <button class="btn btn-small btn-secondary prov-edit" data-id="${p.id}">✏️ Editar</button>
                    <button class="btn btn-small btn-danger prov-delete" data-id="${p.id}">🗑️</button>
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  document.querySelectorAll('.prov-edit').forEach(btn =>
    btn.addEventListener('click', () => mostrarFormularioProveedor(btn.dataset.id)));
  document.querySelectorAll('.prov-delete').forEach(btn =>
    btn.addEventListener('click', async () => {
      if (await customConfirm('¿Eliminar este proveedor?')) {
        const idToDel = btn.dataset.id;
        state.proveedores = state.proveedores.filter(p => p.id !== idToDel);
        if (!state.eliminados) state.eliminados = [];
        state.eliminados.push(String(idToDel));
        deleteSheetData("proveedores", idToDel);
        showToast('Proveedor eliminado', 'success');
        renderProveedoresList();
      }
    }));
}

function mostrarFormularioProveedor(proveedorId = null) {
  const proveedor = proveedorId ? state.proveedores.find(p => String(p.id) === String(proveedorId)) : null;
  const modal = document.getElementById("modal-content");
  modal.innerHTML = `
    <h2>${proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
    <form id="prov-form" class="form">
      <div class="form-group">
        <label>Nombre</label>
        <input type="text" class="form-input" id="prov-nombre" value="${proveedor?.nombre || ''}" required>
      </div>
      <div class="form-group">
        <label>NIT</label>
        <input type="text" class="form-input" id="prov-nit" value="${proveedor?.nit || ''}">
      </div>
      <div class="form-group">
        <label>Teléfono / Contacto</label>
        <input type="text" class="form-input" id="prov-contacto" value="${proveedor?.contacto || proveedor?.telefono || ''}">
      </div>
      <div style="display:flex; gap:0.75rem; margin-top:0.5rem;">
        <button type="submit" class="btn btn-success" style="flex:1;">Guardar</button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      </div>
    </form>`;
  openModal();

  document.getElementById("prov-form").addEventListener("submit", async e => {
    e.preventDefault();
    const data = {
      id: proveedor?.id,
      nombre: document.getElementById("prov-nombre").value.trim(),
      nit: document.getElementById("prov-nit").value.trim(),
      contacto: document.getElementById("prov-contacto").value.trim()
    };
    try {
      const saved = await saveSheetData("proveedores", data);
      const final = (saved && saved !== true && saved !== false) ? saved : data;
      if (proveedor) {
        const idx = state.proveedores.findIndex(p => String(p.id) === String(proveedorId));
        if (idx > -1) state.proveedores[idx] = final;
      } else {
        state.proveedores.push(final);
      }
    } catch(e) { console.warn(e); }
    showToast(proveedor ? 'Proveedor actualizado' : 'Proveedor creado', 'success');
    closeModal();
    renderProveedoresList();
  });
}

// ================================================================
// COMPRAS
// ================================================================
function renderCompras() {
  const view = document.getElementById("view-compras");
  const compras = window.comprasFiltradas || state.compras || [];

  view.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>🚚 Compras</h2>
        <button class="btn btn-primary" onclick="mostrarFormularioCompra()">+ Nueva Compra</button>
      </div>

      <div style="background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="margin-top: 0; font-size: 1rem;">🔍 Filtros de Compras</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <input type="text" id="filtro-compra-prov" placeholder="Proveedor..." class="form-input" style="flex:1;">
          <input type="date" id="filtro-compra-fecha" class="form-input" style="flex:1;">
          <select id="filtro-compra-pago" class="form-input" style="flex:1;">
            <option value="">Filtro Pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Nequi">Nequi</option>
            <option value="En Consignación">En Consignación</option>
          </select>
          <button class="btn btn-secondary" onclick="aplicarFiltroCompras()">Filtrar</button>
          <button class="btn btn-secondary" onclick="window.comprasFiltradas=null; renderCompras();">Limpiar</button>
        </div>
      </div>

      ${compras.length === 0
        ? `<div class="card" style="text-align:center; padding:3rem;">
             <div style="font-size:3rem; margin-bottom:1rem;">📦</div>
             <h3 style="color:var(--text-muted); font-weight:500;">No hay compras registradas</h3>
             <p style="color:var(--text-dim); margin-top:0.5rem;">Registra una compra a proveedor para verla aquí o ajusta los filtros.</p>
           </div>`
        : `<div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Método Pago</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${compras.map((c, idx) => {
                  const prov = state.proveedores.find(p => p.id === c.proveedorId);
                  let items = [];
                  try { items = typeof c.itemsJson === 'string' ? JSON.parse(c.itemsJson) : (c.itemsJson || []); } catch(e) {}
                  return `<tr>
                    <td><span class="badge badge-info" style="font-family:'JetBrains Mono',monospace;">${c.numero || String(idx+1).padStart(4,'0')}</span></td>
                    <td>${c.fecha || '—'}</td>
                    <td><strong>${prov ? prov.nombre : (c.proveedorId || '—')}</strong></td>
                    <td><span class="badge badge-warning">${c.metodoPago || '—'}</span></td>
                    <td>${items.length} item${items.length !== 1 ? 's' : ''}</td>
                    <td><strong style="color:var(--clr-success);">$${parseFloat(c.total||0).toLocaleString('es-CO')}</strong></td>
                    <td>
                      <button class="btn btn-small btn-secondary" onclick="verDetalleCompra('${c.id}')">👁 Ver</button>
                      ${state.rolActual === 'admin' ? `<button class="btn btn-small btn-danger" onclick="eliminarCompra('${c.id}')">🗑</button>` : ''}
                    </td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>`}
    </div>`;
}

function verDetalleCompra(id) {
  const compra = state.compras.find(c => c.id === id);
  if (!compra) return showToast("Compra no encontrada", "error");
  const prov = state.proveedores.find(p => p.id === compra.proveedorId);
  let items = [];
  try { items = typeof compra.itemsJson === "string" ? JSON.parse(compra.itemsJson) : (compra.itemsJson || []); } catch(e) {}

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <div style="max-width:520px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;">
        <div>
          <h3 style="margin:0 0 0.25rem; font-size:1.2rem;">Detalle de Compra</h3>
          <span class="badge badge-info" style="font-family:'JetBrains Mono',monospace;">${compra.numero || compra.id}</span>
        </div>
        <div style="text-align:right; color:var(--text-muted); font-size:0.85rem;">
          <div>${compra.fecha || "—"}</div>
          <span class="badge badge-warning">${compra.metodoPago || "—"}</span>
        </div>
      </div>

      <div class="form-row" style="margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--border);">
        <strong>Proveedor:</strong> ${prov ? prov.nombre : (compra.proveedorId || "—")}
      </div>

      <table class="data-table" style="margin-bottom:1rem;">
        <thead><tr><th>Producto</th><th>Cant.</th><th>Costo unit.</th><th>Subtotal</th></tr></thead>
        <tbody>
          ${items.map(item => {
            const prod = state.productos.find(p => p.id === (item.id || item.productId));
            return `<tr>
              <td>${prod ? prod.nombre : (item.id || item.productId || "—")}</td>
              <td style="text-align:center;">${item.cantidad || item.quantity || 0}</td>
              <td>$${parseFloat(item.costo || item.unitCost || 0).toLocaleString("es-CO")}</td>
              <td><strong>$${parseFloat(item.subtotal || 0).toLocaleString("es-CO")}</strong></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>

      <div style="text-align:right; font-size:1.1rem; font-weight:700; color:var(--clr-success);">
        TOTAL: $${parseFloat(compra.total || 0).toLocaleString("es-CO")}
      </div>

      <div style="margin-top:1.5rem; display:flex; gap:0.75rem; justify-content:flex-end;">
        ${state.rolActual === "admin" ? `<button class="btn btn-danger" onclick="closeModal(); eliminarCompra('${compra.id}')">🗑 Eliminar</button>` : ""}
        <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
      </div>
    </div>`;
  openModal();
}

async function eliminarCompra(id) {
  const confirmed = await customConfirm("¿Eliminar esta compra? Esta acción no se puede deshacer.");
  if (!confirmed) return;

  try {
    await apiRequest(`/purchases/${id}`, { method: "DELETE" });
    state.compras = state.compras.filter(c => c.id !== id);
    showToast("Compra eliminada", "success");
    renderCompras();
  } catch (error) {
    if (error.status === 404 || localStorage.getItem("modoLocal") === "true") {
      state.compras = state.compras.filter(c => c.id !== id);
      showToast("Compra eliminada localmente", "warning");
      renderCompras();
    } else {
      showToast(error.message || "Error eliminando compra", "error");
    }
  }
}

function aplicarFiltroCompras() {
  const prov = document.getElementById("filtro-compra-prov")?.value.toLowerCase();
  const fecha = document.getElementById("filtro-compra-fecha")?.value;
  const pago = document.getElementById("filtro-compra-pago")?.value;
  
  if(!prov && !fecha && !pago) {
    window.comprasFiltradas = null;
    renderCompras();
    return;
  }
  
  window.comprasFiltradas = (state.compras || []).filter(c => {
    let match = true;
    if(prov) {
      const proveedor = state.proveedores.find(p => p.id === c.proveedorId);
      const nombreProv = proveedor ? proveedor.nombre.toLowerCase() : (c.proveedorId || "").toLowerCase();
      if (!nombreProv.includes(prov)) match = false;
    }
    if (fecha) {
      const parts = c.fecha.split('/');
      let strFecha = c.fecha;
      if (parts.length === 3) strFecha=`${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
      if (!strFecha.startsWith(fecha)) match = false;
    }
    if(pago && c.metodoPago !== pago) match = false;
    return match;
  });
  renderCompras();
}

function mostrarFormularioCompra() {
  if (!window._compraItems) window._compraItems = [];
  window._compraItems = [];

  const opcionesProveedores = (state.proveedores || [])
    .map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
  const opcionesProductos = (state.productos || [])
    .map(p => `<option value="${p.id}" data-costo="${p.costo}">${p.nombre}</option>`).join('');

  const modal = document.getElementById("modal-content");
  modal.innerHTML = `
    <h2>🚚 Nueva Compra</h2>
    <div class="form">
      <div class="form-group">
        <label>Proveedor</label>
        <select class="form-input" id="compra-prov">
          <option value="">Seleccionar proveedor...</option>
          ${opcionesProveedores}
        </select>
      </div>
      <div class="form-group">
        <label>Método de Pago</label>
        <select class="form-input" id="compra-metodo">
          <option value="efectivo">Efectivo</option>
          <option value="nequi">Nequi</option>
          <option value="consignacion">En Consignación</option>
        </select>
      </div>

      <div style="background:var(--glass-light); border:1px solid var(--glass-border); border-radius:10px; padding:1rem;">
        <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:0.75rem;">Agregar Productos</div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <select class="form-input" id="compra-prod-select" style="flex:2; min-width:140px;">
            <option value="">Producto...</option>
            ${opcionesProductos}
          </select>
          <button type="button" class="btn btn-small btn-info" onclick="crearProductoRapidoCompras()">+ Nuevo</button>
          <input type="number" id="compra-cant" placeholder="Cant." min="1" value="1"
            style="flex:1; min-width:60px; padding:0.6rem; border:1px solid var(--glass-border); border-radius:8px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
          <input type="number" id="compra-costo" placeholder="Costo" min="0" step="0.01"
            style="flex:1; min-width:70px; padding:0.6rem; border:1px solid var(--glass-border); border-radius:8px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
          <button class="btn btn-small btn-info" onclick="agregarItemCompra()">+ Agregar</button>
        </div>
        <div id="compra-items-list" style="margin-top:0.75rem;"></div>
        <div style="text-align:right; font-size:0.875rem; color:var(--text-muted); margin-top:0.5rem;">
          Total: <strong id="compra-total-display" style="color:var(--neon-green,#10B981); font-size:1rem;">$0.00</strong>
        </div>
      </div>

      <div style="display:flex; gap:0.75rem; margin-top:0.5rem;">
        <button class="btn btn-success" onclick="finalizarCompra()" style="flex:1;">✅ Registrar Compra</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      </div>
    </div>`;

  // Auto-fill costo del producto seleccionado
  window.crearProductoRapidoCompras = async function() {
    const nombre = await customPrompt("Nombre del nuevo producto:", "", "text");
    if (!nombre) return;
    const costo = await customPrompt("Costo unitario:", "0", "number");
    const precio = await customPrompt("Precio de venta sugerido:", "0", "number");
    
    const nuevoProd = {
      id: `PROD-${Date.now()}`,
      nombre,
      costo: parseFloat(costo) || 0,
      precio: parseFloat(precio) || 0,
      stock: 0,
      categoria: "General",
      activo: true
    };
    
    state.productos.push(nuevoProd);
    if (typeof saveSheetData === 'function') await saveSheetData("productos", nuevoProd);
    else saveToLocalStorage("productos", state.productos);
    
    showToast("Producto creado y añadido a la lista", "success");
    mostrarFormularioCompra(); // Refresh to show in select
  };

  document.getElementById("compra-prod-select").addEventListener("change", function() {
    const opt = this.options[this.selectedIndex];
    const costo = opt.dataset.costo;
    if (costo) document.getElementById("compra-costo").value = costo;
  });

  window.actualizarItemsCompra = function() {
    const list = document.getElementById("compra-items-list");
    if (!list) return;
    if (window._compraItems.length === 0) { list.innerHTML = ''; document.getElementById("compra-total-display").textContent = '$0.00'; return; }
    const total = window._compraItems.reduce((s, i) => s + i.subtotal, 0);
    list.innerHTML = window._compraItems.map((item, idx) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem; background:var(--glass-light); border-radius:6px; margin-top:0.4rem;">
        <span style="font-size:0.875rem; color:var(--text-main);">${item.nombre} × ${item.cantidad}</span>
        <span style="font-size:0.875rem; color:var(--text-muted);">$${item.subtotal.toFixed(2)}</span>
        <button class="btn btn-small btn-danger" style="padding:0.15rem 0.4rem;" onclick="eliminarItemCompra(${idx})">✕</button>
      </div>`).join('');
    document.getElementById("compra-total-display").textContent = `$${total.toFixed(2)}`;
  };

  window.agregarItemCompra = function() {
    const sel = document.getElementById("compra-prod-select");
    const cant = parseInt(document.getElementById("compra-cant").value) || 1;
    const costo = parseFloat(document.getElementById("compra-costo").value) || 0;
    if (!sel.value) { showToast("Selecciona un producto", "warning"); return; }
    const prod = state.productos.find(p => p.id === sel.value);
    if (!prod) return;
    window._compraItems.push({ id: prod.id, nombre: prod.nombre, cantidad: cant, costo, subtotal: cant * costo });
    window.actualizarItemsCompra();
  };

  window.eliminarItemCompra = function(idx) {
    window._compraItems.splice(idx, 1);
    window.actualizarItemsCompra();
  };

  window.finalizarCompra = async function() {
    const proveedorId = document.getElementById("compra-prov").value;
    const metodoPago = document.getElementById("compra-metodo").value;
    if (!proveedorId) { showToast("Selecciona un proveedor", "warning"); return; }
    if (window._compraItems.length === 0) { showToast("Agrega al menos un producto", "warning"); return; }
    const total = window._compraItems.reduce((s, i) => s + i.subtotal, 0);
    const compra = {
      id: generatePurchaseId(),
      fecha: new Date().toLocaleString("es-CO"),
      proveedorId,
      metodoPago,
      itemsJson: JSON.stringify(window._compraItems),
      total
    };

    if (localStorage.getItem("modoLocal") === "true") {
      // En modo local, actualizar stock manualmente
      state.compras.push(compra);
      window._compraItems.forEach(item => {
        const prod = state.productos.find(p => p.id === item.id);
        if (prod && prod.seguimientoInventario) prod.stock = (parseInt(prod.stock) || 0) + item.cantidad;
      });
      saveToLocalStorage("compras", state.compras);
      saveToLocalStorage("productos", state.productos);
      showToast("Compra registrada (modo local)", "success");
      window._compraItems = [];
      closeModal();
      renderCompras();
      return;
    }

    try {
      const payload = {
        supplierId: proveedorId || null,
        paymentMethod: metodoPago || "efectivo",
        items: window._compraItems.map(item => ({
          productId: item.id,
          quantity: Number(item.cantidad),
          unitCost: Number(item.costo)
        })).filter(i => i.productId && i.quantity > 0)
      };
      await apiRequest("/purchases", { method: "POST", body: JSON.stringify(payload) });
      await loadAllDataFromAPI(true);
      showToast("Compra registrada exitosamente", "success");
      window._compraItems = [];
      closeModal();
      renderCompras();
    } catch (error) {
      showToast(error.message || "Error registrando compra", "error");
    }
  };

  openModal();
}

// ================================================================
// FALTANTES
// ================================================================
function renderMissingItems() {
  const view = document.getElementById("view-missing");
  const faltantes = state.faltantes || [];

  view.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>📋 Faltantes</h2>
        <button class="btn btn-primary" onclick="mostrarFormularioFaltante()">+ Registrar Faltante</button>
      </div>

      ${faltantes.length === 0
        ? `<div class="card" style="text-align:center; padding:3rem;">
            <div style="font-size:3rem; margin-bottom:1rem;">✅</div>
            <h3 style="color:var(--text-muted); font-weight:500;">Sin faltantes registrados</h3>
            <p style="color:var(--text-dim); margin-top:0.5rem;">Registra productos que los clientes solicitan y no están disponibles.</p>
           </div>`
        : `<div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Producto Solicitado</th>
                  <th>Fecha</th>
                  <th>Estado Producto</th>
                  <th>Cantidad</th>
                  <th>Gestión</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${faltantes.map(f => `
                  <tr>
                    <td><strong>${f.nombre}</strong>${f.observacion ? `<br><small style="color:var(--text-dim);">${f.observacion}</small>` : ''}</td>
                    <td style="font-size:0.82rem;">${f.fecha || '—'}</td>
                    <td><span class="badge ${f.estadoProducto === 'agotado' ? 'badge-warning' : 'badge-danger'}">${f.estadoProducto || 'no registrado'}</span></td>
                    <td>${f.cantidad || '—'}</td>
                    <td><span class="badge ${f.estado === 'resuelto' ? 'badge-success' : f.estado === 'descartado' ? 'badge-danger' : 'badge-warning'}">${f.estado || 'pendiente'}</span></td>
                    <td style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                      ${f.estado !== 'resuelto' ? `<button class="btn btn-small btn-success falt-resolve" data-id="${f.id}" title="Marcar resuelto">✅</button>` : ''}
                      <button class="btn btn-small btn-danger falt-delete" data-id="${f.id}">🗑️</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`}
    </div>`;

  document.querySelectorAll('.falt-resolve').forEach(btn =>
    btn.addEventListener('click', async () => {
      const fId = btn.dataset.id;
      if (localStorage.getItem("modoLocal") === "true") {
        const f = state.faltantes.find(x => x.id === fId);
        if (f) { f.estado = 'resuelto'; renderMissingItems(); }
        return;
      }
      try {
        await apiRequest(`/missing-requests/${fId}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "resuelto" })
        });
        const f = state.faltantes.find(x => x.id === fId);
        if (f) f.estado = 'resuelto';
        showToast('Faltante marcado como resuelto', 'success');
        renderMissingItems();
      } catch (error) {
        showToast(error.message || 'Error al actualizar faltante', 'error');
      }
    }));
  document.querySelectorAll('.falt-delete').forEach(btn =>
    btn.addEventListener('click', async () => {
      if (!await customConfirm('¿Eliminar este faltante?')) return;
      const fId = btn.dataset.id;
      if (localStorage.getItem("modoLocal") === "true") {
        state.faltantes = state.faltantes.filter(f => f.id !== fId);
        showToast('Faltante eliminado', 'success');
        renderMissingItems();
        return;
      }
      try {
        await apiRequest(`/missing-requests/${fId}`, { method: "DELETE" });
        state.faltantes = state.faltantes.filter(f => f.id !== fId);
        showToast('Faltante eliminado', 'success');
        renderMissingItems();
      } catch (error) {
        showToast(error.message || 'Error al eliminar faltante', 'error');
      }
    }));
}

function mostrarFormularioFaltante() {
  const modal = document.getElementById("modal-content");
  modal.innerHTML = `
    <h2>📋 Registrar Faltante</h2>
    <form id="faltante-form" class="form">
      <div class="form-group">
        <label>Nombre del Producto Solicitado</label>
        <input type="text" class="form-input" id="falt-nombre" placeholder="ej: Resma de papel carta" required>
      </div>
      <div class="form-group">
        <label>Estado del Producto</label>
        <select class="form-input" id="falt-estado-prod">
          <option value="agotado">Agotado (existe en catálogo)</option>
          <option value="no registrado">No Registrado (no existe)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Cantidad Solicitada (opcional)</label>
        <input type="number" class="form-input" id="falt-cantidad" min="1" placeholder="ej: 5">
      </div>
      <div class="form-group">
        <label>Observación (opcional)</label>
        <textarea class="form-input" id="falt-obs" rows="2" placeholder="Notas adicionales..."></textarea>
      </div>
      <div style="display:flex; gap:0.75rem; margin-top:0.5rem;">
        <button type="submit" class="btn btn-success" style="flex:1;">Registrar</button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      </div>
    </form>`;
  openModal();

  document.getElementById("faltante-form").addEventListener("submit", async e => {
    e.preventDefault();
    const faltante = {
      id: generateMissingItemId(),
      nombre: document.getElementById("falt-nombre").value.trim(),
      estadoProducto: document.getElementById("falt-estado-prod").value,
      cantidad: document.getElementById("falt-cantidad").value || null,
      observacion: document.getElementById("falt-obs").value.trim() || null,
      fecha: new Date().toLocaleString("es-CO"),
      estado: "pendiente"
    };
    const ok = await saveMissingItem(faltante);
    if (ok) {
      closeModal();
      renderMissingItems();
    }
  });
}

function renderReports() {

  const view = document.getElementById("view-reports");
  if (!view) {
    console.error("View reports no encontrada");
    return;
  }

  // KPIs rápidos desde el estado actual
  const ventasHoy = state.ventas.filter(v => {
    const hoy = new Date().toLocaleDateString("es-CO");
    return v.fecha && String(v.fecha).startsWith(hoy.split("/")[2]) && v.estado !== "anulada";
  });
  const totalHoy = ventasHoy.reduce((s, v) => s + parseFloat(v.total || 0), 0);
  const ventasTotal = state.ventas.filter(v => v.estado !== "anulada").length;
  const productosBajoStock = state.productos.filter(p => p.seguimientoInventario !== false && p.stock < 10).length;
  const productosAgotados = state.productos.filter(p => p.stock === 0).length;
  const fmt = n => parseFloat(n || 0).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  view.innerHTML = `<div class="container">
    <div class="section-header">
      <h2>📊 Reportes y Estadísticas</h2>
    </div>

    <!-- KPIs de resumen -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1rem; margin-bottom:2rem;">
      <div class="card" style="padding:1.25rem; border-left:4px solid var(--clr-primary); background:var(--bg-panel);">
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Ventas hoy</div>
        <div style="font-size:1.6rem; font-weight:800; color:var(--clr-primary);">$${fmt(totalHoy)}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">${ventasHoy.length} transacciones</div>
      </div>
      <div class="card" style="padding:1.25rem; border-left:4px solid var(--clr-success); background:var(--bg-panel);">
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Ventas totales</div>
        <div style="font-size:1.6rem; font-weight:800; color:var(--clr-success);">${ventasTotal}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">${state.ventas.filter(v => v.estado === "anulada").length} anuladas</div>
      </div>
      <div class="card" style="padding:1.25rem; border-left:4px solid var(--clr-warning); background:var(--bg-panel);">
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Stock bajo</div>
        <div style="font-size:1.6rem; font-weight:800; color:var(--clr-warning);">${productosBajoStock}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">${productosAgotados} agotados</div>
      </div>
      <div class="card" style="padding:1.25rem; border-left:4px solid var(--clr-info); background:var(--bg-panel);">
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Clientes</div>
        <div style="font-size:1.6rem; font-weight:800; color:var(--clr-info);">${state.clientes.filter(c => c.activo !== false).length}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">${state.clientes.length} en total</div>
      </div>
    </div>

    <!-- Generadores de reportes -->
    <h3 style="font-size:1rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin:0 0 1rem;">Generar reporte</h3>
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; margin-bottom:2.5rem;">
      <div class="card" style="padding:1.25rem; border-top:3px solid var(--clr-primary);">
        <div style="font-size:1.5rem; margin-bottom:0.5rem;">📈</div>
        <h4 style="margin:0 0 0.4rem; font-size:1rem; color:var(--text-main);">Ventas por período</h4>
        <p style="font-size:0.82rem; color:var(--text-muted); margin:0 0 1rem;">Ingresos, IVA y descuentos en un rango de fechas.</p>
        <button class="btn btn-primary" style="width:100%;" onclick="mostrarFormularioReportVentas()">Generar</button>
      </div>
      <div class="card" style="padding:1.25rem; border-top:3px solid var(--clr-success);">
        <div style="font-size:1.5rem; margin-bottom:0.5rem;">📦</div>
        <h4 style="margin:0 0 0.4rem; font-size:1rem; color:var(--text-main);">Estado del inventario</h4>
        <p style="font-size:0.82rem; color:var(--text-muted); margin:0 0 1rem;">Valor, costo y margen por producto.</p>
        <button class="btn btn-success" style="width:100%;" onclick="generarYMostrarReporteInventario()">Generar</button>
      </div>
      <div class="card" style="padding:1.25rem; border-top:3px solid var(--clr-info);">
        <div style="font-size:1.5rem; margin-bottom:0.5rem;">👥</div>
        <h4 style="margin:0 0 0.4rem; font-size:1rem; color:var(--text-main);">Clientes</h4>
        <p style="font-size:0.82rem; color:var(--text-muted); margin:0 0 1rem;">Clientes activos e inactivos registrados.</p>
        <button class="btn btn-info" style="width:100%;" onclick="generarYMostrarReporteClientes()">Generar</button>
      </div>
      <div class="card" style="padding:1.25rem; border-top:3px solid var(--clr-warning);">
        <div style="font-size:1.5rem; margin-bottom:0.5rem;">🛒</div>
        <h4 style="margin:0 0 0.4rem; font-size:1rem; color:var(--text-main);">Compras a proveedores</h4>
        <p style="font-size:0.82rem; color:var(--text-muted); margin:0 0 1rem;">Historial de compras en un rango de fechas.</p>
        <button class="btn btn-warning" style="width:100%; color:#fff;" onclick="mostrarFormularioReportCompras()">Generar</button>
      </div>
    </div>

    <!-- Historial de reportes generados -->
    ${state.reportes.length > 0 ? `
    <h3 style="font-size:1rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin:0 0 1rem;">Reportes recientes</h3>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Período</th>
            <th>Generado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${state.reportes.slice().reverse().map(r => `
            <tr>
              <td><strong>${r.tipo}</strong></td>
              <td>${r.periodo || "—"}</td>
              <td style="color:var(--text-muted); font-size:0.85rem;">${r.fecha}</td>
              <td><button class="btn btn-small btn-primary" onclick="mostrarDetallesReporte('${JSON.stringify(r).replace(/"/g, "&quot;")}')">Ver detalles</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>` : ""}
  </div>`;
}

function mostrarFormularioReportVentas() {
  const modalContent = document.getElementById("modal-content");
  
  modalContent.innerHTML = `
    <h3>Reporte de Ventas</h3>
    <form id="report-ventas-form" class="form">
      <label>Desde:</label>
      <input type="date" class="form-input" id="report-desde" required>
      
      <label>Hasta:</label>
      <input type="date" class="form-input" id="report-hasta" required>
      
      <button type="submit" class="btn btn-success">Generar Reporte</button>
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    </form>
  `;
  
  document.getElementById("report-ventas-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const desde = document.getElementById("report-desde").value;
    const hasta = document.getElementById("report-hasta").value;
    
    const reporte = generateSalesReport(desde, hasta);
    const success = await saveReport(reporte);
    if (success) {
      closeModal();
      renderReports();
      mostrarDetallesReporte(JSON.stringify(reporte));
    }
  });
  
  openModal();
}

function mostrarFormularioReportCompras() {
  const modalContent = document.getElementById("modal-content");
  
  modalContent.innerHTML = `
    <h3>Reporte de Compras</h3>
    <form id="report-compras-form" class="form">
      <label>Desde:</label>
      <input type="date" class="form-input" id="report-compras-desde" required>
      
      <label>Hasta:</label>
      <input type="date" class="form-input" id="report-compras-hasta" required>
      
      <button type="submit" class="btn btn-success">Generar Reporte</button>
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    </form>
  `;
  
  document.getElementById("report-compras-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const desde = document.getElementById("report-compras-desde").value;
    const hasta = document.getElementById("report-compras-hasta").value;
    
    const reporte = generatePurchaseReport(desde, hasta);
    const success = await saveReport(reporte);
    if (success) {
      closeModal();
      renderReports();
      mostrarDetallesReporte(JSON.stringify(reporte));
    }
  });
  
  openModal();
}

function generarYMostrarReporteInventario() {
  const reporte = generateInventoryReport();
  saveReport(reporte);
  mostrarDetallesReporte(JSON.stringify(reporte));
}

function generarYMostrarReporteClientes() {
  const reporte = generateClientReport();
  saveReport(reporte);
  mostrarDetallesReporte(JSON.stringify(reporte));
}

function mostrarDetallesReporte(reporteStr) {
  try {
    const reporte = typeof reporteStr === "string" ? JSON.parse(reporteStr) : reporteStr;
    const modalContent = document.getElementById("modal-content");
    const fmt = n => parseFloat(n || 0).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const fmtMoney = n => "$" + fmt(n);

    const moneyKeys = new Set(["totalVentas","totalDescuentos","totalImpuestos","ticketPromedio","valorTotalInventario","costoTotalInventario","gananciaPotencial","totalCompras"]);
    const labels = {
      totalVentas: "Ventas totales",
      totalDescuentos: "Descuentos aplicados",
      totalImpuestos: "IVA recaudado (19%)",
      totalArticulos: "Artículos vendidos",
      cantidadTransacciones: "N° transacciones",
      ticketPromedio: "Ticket promedio",
      totalProductos: "Productos en catálogo",
      productosAgotados: "Productos agotados",
      productosConBajoStock: "Productos con stock bajo (<10)",
      valorTotalInventario: "Valor del inventario (venta)",
      costoTotalInventario: "Costo total del inventario",
      gananciaPotencial: "Margen potencial",
      totalClientes: "Clientes totales",
      clientesActivos: "Clientes activos",
      totalClientesInactivos: "Clientes inactivos",
      totalCompras: "Total invertido en compras"
    };

    const accentColors = {
      "Reporte de Ventas": "var(--clr-primary)",
      "Reporte de Inventario": "var(--clr-success)",
      "Reporte de Clientes": "var(--clr-info)",
      "Reporte de Compras": "var(--clr-warning)"
    };
    const accent = accentColors[reporte.tipo] || "var(--clr-primary)";

    // Separar datos en escalares y arrays
    const scalarRows = [];
    const arrayBlocks = [];
    Object.entries(reporte).forEach(([key, val]) => {
      if (["tipo","periodo","fecha"].includes(key)) return;
      if (Array.isArray(val)) arrayBlocks.push({ key, val, label: labels[key] || key });
      else scalarRows.push({ key, val, label: labels[key] || key, isMoney: moneyKeys.has(key) });
    });

    let html = `
      <div style="max-width:540px; margin:0 auto; font-family:'Inter',system-ui,sans-serif;">
        <!-- Header -->
        <div style="border-left:5px solid ${accent}; padding:0.75rem 1rem 0.75rem 1.25rem; margin-bottom:1.5rem; background:var(--bg-panel); border-radius:0 8px 8px 0;">
          <h3 style="margin:0 0 0.25rem; font-size:1.15rem; color:var(--text-main);">${reporte.tipo}</h3>
          <div style="font-size:0.82rem; color:var(--text-muted);">
            ${reporte.periodo ? `<span>Período: <strong>${reporte.periodo}</strong> · </span>` : ""}
            Generado: <strong>${reporte.fecha}</strong>
          </div>
        </div>

        <!-- KPIs escalares -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; margin-bottom:1.5rem;">
          ${scalarRows.map(r => `
            <div style="background:var(--bg-panel); border:1px solid var(--border); border-radius:10px; padding:1rem 1.25rem;">
              <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.35rem;">${r.label}</div>
              <div style="font-size:1.4rem; font-weight:800; color:${r.isMoney ? accent : "var(--text-main)"};">${r.isMoney ? fmtMoney(r.val) : r.val}</div>
            </div>
          `).join("")}
        </div>

        <!-- Listas de arrays (ej. bajo stock) -->
        ${arrayBlocks.map(b => `
          <div style="margin-bottom:1.25rem;">
            <h4 style="margin:0 0 0.75rem; font-size:0.9rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">${b.label}</h4>
            ${b.val.length === 0
              ? `<p style="color:var(--text-muted); font-size:0.87rem;">Sin registros.</p>`
              : `<div class="table-container" style="max-height:220px; overflow-y:auto;">
                  <table class="data-table" style="font-size:0.85rem;">
                    <thead><tr><th>Producto</th><th>Stock</th><th>Precio</th></tr></thead>
                    <tbody>
                      ${b.val.map(v => `
                        <tr>
                          <td>${v.nombre || v.name || "—"}</td>
                          <td><span class="badge badge-danger">${v.stock ?? "—"}</span></td>
                          <td>${v.precio !== undefined ? fmtMoney(v.precio) : "—"}</td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>`
            }
          </div>
        `).join("")}

        <!-- Acciones -->
        <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border);" class="no-print">
          <button class="btn btn-secondary" onclick="window.print()">🖨️ Imprimir</button>
          <button class="btn btn-primary" onclick="closeModal()">Cerrar</button>
        </div>
      </div>`;

    modalContent.innerHTML = html;
    openModal();
  } catch (e) {
    console.error(e);
    showToast("Error mostrando reporte", "error");
  }
}

function renderUserManagement() {
  const view = document.getElementById("view-users");
  if (!view) return;
  
  view.innerHTML = `<div class="container">
    <div class="section-header">
      <h2>👤 Gestión de Usuarios</h2>
      <button class="btn btn-primary" onclick="mostrarFormularioUsuario()">+ Nuevo Usuario</button>
    </div>
    
    <div class="tabs" style="margin-bottom: 2rem;">
      <button class="tab-btn active" onclick="filtrarUsuarios('todos', this)">Todos</button>
      <button class="tab-btn" onclick="filtrarUsuarios('admin', this)">Admins</button>
      <button class="tab-btn" onclick="filtrarUsuarios('cajero', this)">Cajeros</button>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nombre y Usuario</th>
            <th>Rol</th>
            <th>Fecha Creación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="users-tbody">
          ${_renderUserRows(state.usuarios)}
        </tbody>
      </table>
    </div>
  </div>`;
}



function _renderUserRows(usuariosList) {
  if (usuariosList.length === 0) return `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No hay usuarios registrados</td></tr>`;

  return usuariosList.map(u => `
    <tr>
      <td>
        <strong>${u.nombre}</strong><br>
        <span style="font-size:0.82rem; color:var(--text-muted);">@${u.usuario}</span>
        ${u.email ? `<br><span style="font-size:0.78rem; color:var(--text-dim);">${u.email}</span>` : ''}
      </td>
      <td>
        <span class="badge ${u.rol === 'admin' ? 'badge-danger' : 'badge-info'}">${u.rol.toUpperCase()}</span>
      </td>
      <td style="font-size:0.82rem;">${u.fechaCreacion || '—'}</td>
      <td>
        <span class="badge ${u.activo ? 'badge-success' : 'badge-warning'}">
          ${u.activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
          <button class="btn btn-small btn-secondary" onclick="toggleUserStatus('${u.id}')" title="${u.activo ? 'Desactivar' : 'Activar'}">
            ${u.activo ? '🔒 Desactivar' : '✅ Activar'}
          </button>
          <button class="btn btn-small btn-primary" onclick="mostrarFormularioUsuario('${u.id}')">✏️ Editar</button>
          <button class="btn btn-small btn-info" onclick="mostrarModalCambioPassword('${u.id}')">🔑 Pass</button>
          <button class="btn btn-small btn-danger" onclick="deleteUsuario('${u.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}







function mostrarLoginModal() {
  const modalContent = document.getElementById("modal-content");
  
  modalContent.innerHTML = `
    <h3>Iniciar Sesión</h3>
    <form id="login-form" class="form">
      <label>Usuario:</label>
      <input type="text" class="form-input" id="login-user" placeholder="Nombre de usuario" required autofocus>
      
      <label>Contraseña:</label>
      <div style="position: relative; display: flex; align-items: center;">
        <input type="password" class="form-input" id="login-password" placeholder="Contraseña" required style="padding-right: 40px;">
        <button type="button" class="toggle-password-btn" id="toggle-password" style="position: absolute; right: 10px; background: none; border: none; cursor: pointer; font-size: 18px; padding: 0; color: var(--text); opacity: 0.6; transition: opacity 0.2s;">👁️</button>
      </div>
      
      <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    </form>
  `;
  
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("login-user").value;
    const password = document.getElementById("login-password").value;
    
    if (loginUser(nombre, password)) {
      closeModal();
      renderUserManagement();
    }
  });

  // Toggle visibility del password
  const toggleBtn = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("login-password");
  let isPasswordVisible = false;
  
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? "text" : "password";
    toggleBtn.textContent = isPasswordVisible ? "🙈" : "👁️";
    toggleBtn.style.opacity = isPasswordVisible ? "1" : "0.6";
  });
  
  openModal();
}

async function mostrarFormularioUsuario(userId = null) {
  const modalContent = document.getElementById("modal-content");
  const user = userId ? state.usuarios.find(u => u.id === userId) : null;

  const MODULOS = [
    { key: "home",        label: "Inicio" },
    { key: "pos",         label: "Punto de venta" },
    { key: "history",     label: "Historial ventas" },
    { key: "missing",     label: "Faltantes" },
    { key: "clientes",    label: "Clientes" },
    { key: "products",    label: "Productos" },
    { key: "categorias",  label: "Categorías" },
    { key: "compras",     label: "Compras" },
    { key: "proveedores", label: "Proveedores" },
    { key: "descuentos",  label: "Descuentos" },
    { key: "reports",     label: "Reportes" },
    { key: "users",       label: "Usuarios" }
  ];

  const permisosActuales = user?.permisos || (window.PERMISOS?.cajero || []);

  modalContent.innerHTML = `
    <h3>${user ? "Editar Usuario" : "Nuevo Usuario"}</h3>
    <form id="user-form" class="form">
      <label>Nombre completo *</label>
      <input type="text" class="form-input" id="user-nombre" value="${user ? user.nombre : ""}" placeholder="Ej: Juan Pérez" required>

      <label>Usuario (para iniciar sesión) *</label>
      <input type="text" class="form-input" id="user-usuario" value="${user ? user.usuario : ""}" placeholder="Ej: jperez" required autocomplete="off">

      <label>Correo electrónico</label>
      <input type="email" class="form-input" id="user-email" value="${user?.email || ""}" placeholder="correo@ejemplo.com">

      <label>Rol *</label>
      <select class="form-input" id="user-rol" required>
        <option value="cajero" ${user?.rol === "cajero" ? "selected" : ""}>Cajero</option>
        <option value="admin" ${user?.rol === "admin" ? "selected" : ""}>Administrador</option>
      </select>

      ${!user ? `
        <label>Contraseña * (mínimo 8 caracteres)</label>
        <input type="password" class="form-input" id="user-password" placeholder="Contraseña" required minlength="8" autocomplete="new-password">
        <label>Confirmar Contraseña *</label>
        <input type="password" class="form-input" id="user-password-confirm" placeholder="Repetir contraseña" required minlength="8" autocomplete="new-password">
      ` : ""}

      <label style="margin-top: 1rem; display: block;">Módulos permitidos</label>
      <div id="user-permissions" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 0.5rem; margin-bottom: 1.5rem; background: var(--bg-body); padding: 1rem; border-radius: 0.5rem;">
        ${MODULOS.map(m => `
          <label style="display:flex; align-items:center; gap:0.5rem; font-weight:normal; font-size:0.9rem; cursor:pointer;">
            <input type="checkbox" class="permiso-checkbox" value="${m.key}" ${permisosActuales.includes(m.key) ? "checked" : ""}>
            ${m.label}
          </label>
        `).join("")}
      </div>

      <button type="submit" class="btn btn-success">${user ? "Guardar Cambios" : "Crear Usuario"}</button>
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    </form>
  `;
  openModal();

  // Al cambiar rol, actualizar checkboxes con permisos por defecto del rol
  document.getElementById("user-rol").addEventListener("change", function () {
    if (user) return;
    const nuevoRol = this.value;
    const defaults = window.PERMISOS?.[nuevoRol] || [];
    document.querySelectorAll(".permiso-checkbox").forEach(cb => {
      cb.checked = defaults.includes(cb.value);
    });
  });

  document.getElementById("user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("user-nombre").value.trim();
    const usuarioLogin = document.getElementById("user-usuario").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const rol = document.getElementById("user-rol").value;
    const permisosSeleccionados = Array.from(document.querySelectorAll(".permiso-checkbox:checked")).map(cb => cb.value);

    if (!user) {
      const p1 = document.getElementById("user-password").value;
      const p2 = document.getElementById("user-password-confirm").value;
      if (p1 !== p2) { showToast("Las contraseñas no coinciden", "error"); return; }
      if (p1.length < 8) { showToast("La contraseña debe tener al menos 8 caracteres", "error"); return; }

      if (localStorage.getItem("modoLocal") === "true") {
        const nuevoUser = {
          id: "USER-" + Date.now(),
          nombre, usuario: usuarioLogin, email, rol, permisos: permisosSeleccionados, activo: true,
          fechaCreacion: new Date().toLocaleDateString()
        };
        state.usuarios.push(nuevoUser);
        saveToLocalStorage("usuarios", state.usuarios);
      } else {
        try {
          const result = await apiRequest("/users", {
            method: "POST",
            body: JSON.stringify({ fullName: nombre, username: usuarioLogin, email: email || null, rol, password: p1, permissions: permisosSeleccionados })
          });
          if (result.data) state.usuarios.push(mapUserFromAPI(result.data));
        } catch (err) { showToast(err.message || "Error creando usuario", "error"); return; }
      }
    } else {
      if (localStorage.getItem("modoLocal") === "true") {
        Object.assign(user, { nombre, usuario: usuarioLogin, email, rol, permisos: permisosSeleccionados });
        saveToLocalStorage("usuarios", state.usuarios);
      } else {
        try {
          const result = await apiRequest(`/users/${user.id}`, {
            method: "PATCH",
            body: JSON.stringify({ fullName: nombre, username: usuarioLogin, email: email || null, rol, permissions: permisosSeleccionados })
          });
          if (result.data) Object.assign(user, mapUserFromAPI(result.data));
        } catch (err) { showToast(err.message || "Error actualizando usuario", "error"); return; }
      }
    }

    closeModal();
    showToast(user ? "Usuario actualizado" : "Usuario creado exitosamente", "success");

    if (user && state.usuarioActual && user.id === state.usuarioActual.id) {
      state.usuarioActual = { ...state.usuarioActual, permisos: permisosSeleccionados };
      localStorage.setItem("usuarioActual", JSON.stringify(state.usuarioActual));
      if (typeof aplicarPermisosPorRol === "function") aplicarPermisosPorRol();
    }

    renderUserManagement();
  });
}

function filtrarUsuarios(tipo, btn = null) {
  if (btn) {
    document.querySelectorAll('#view-users .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const tbody = document.getElementById("users-tbody");
  if (!tbody) return;
  
  let filtrados = state.usuarios;
  if (tipo !== 'todos') {
    filtrados = state.usuarios.filter(u => u.rol === tipo);
  }
  
  tbody.innerHTML = _renderUserRows(filtrados);
}

async function toggleUserStatus(userId) {
  if (userId === state.usuarioActual?.id) {
    showToast("No puedes desactivarte a ti mismo.", "error");
    return;
  }
  const u = state.usuarios.find(x => x.id === userId);
  if (!u) return;

  const nuevoEstado = !u.activo;

  if (localStorage.getItem("modoLocal") === "true") {
    u.activo = nuevoEstado;
    saveToLocalStorage("usuarios", state.usuarios);
    showToast(nuevoEstado ? "Usuario activado (local)" : "Usuario desactivado (local)", "warning");
    renderUserManagement();
    return;
  }

  try {
    const result = await apiRequest(`/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ active: nuevoEstado })
    });
    u.activo = result.data?.active ?? nuevoEstado;
    showToast(u.activo ? "Usuario activado" : "Usuario desactivado", u.activo ? "success" : "warning");
  } catch (error) {
    showToast(error.message || "Error actualizando estado del usuario", "error");
  }
  renderUserManagement();
}

async function mostrarModalCambioPassword(userId) {
  const user = state.usuarios.find(u => u.id === userId);
  if (!user) return;
  
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <h3>🔑 Cambiar contraseña de ${user.nombre}</h3>
    <form id="change-pass-form" class="form">
      <label>Nueva Contraseña (mínimo 8 caracteres):</label>
      <input type="password" class="form-input" id="new-password" required minlength="8" autocomplete="new-password">
      <label>Confirmar Nueva Contraseña:</label>
      <input type="password" class="form-input" id="new-password-confirm" required minlength="8" autocomplete="new-password">
      <button type="submit" class="btn btn-success">Guardar</button>
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    </form>
  `;
  openModal();
  
  document.getElementById("change-pass-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const p1 = document.getElementById("new-password").value;
    const p2 = document.getElementById("new-password-confirm").value;
    if (p1 !== p2) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }
    if (p1.length < 8) {
      showToast("La contraseña debe tener al menos 8 caracteres", "error");
      return;
    }

    if (localStorage.getItem("modoLocal") !== "true") {
      try {
        await apiRequest(`/users/${userId}/password`, {
          method: "PATCH",
          body: JSON.stringify({ password: p1 })
        });
      } catch (err) {
        showToast(err.message || "Error al actualizar la contraseña", "error");
        return;
      }
    }
    showToast("Contraseña actualizada con éxito", "success");
    closeModal();
  });
}

function deleteUsuario(userId) {
  if (userId === state.usuarioActual?.id) {
    showToast("No puedes eliminar tu propia cuenta.", "error");
    return;
  }

  customConfirm("¿Seguro que deseas desactivar este usuario permanentemente? No podrá iniciar sesión.").then(async confirmed => {
    if (!confirmed) return;

    if (localStorage.getItem("modoLocal") === "true") {
      const u = state.usuarios.find(x => x.id === userId);
      if (u) { u.activo = false; saveToLocalStorage("usuarios", state.usuarios); }
      showToast("Usuario desactivado (local)", "warning");
      renderUserManagement();
      return;
    }

    try {
      await apiRequest(`/users/${userId}`, { method: "DELETE" });
      const u = state.usuarios.find(x => x.id === userId);
      if (u) u.activo = false;
      showToast("Usuario desactivado permanentemente", "warning");
      renderUserManagement();
    } catch (error) {
      showToast(error.message || "Error al desactivar el usuario", "error");
    }
  });
}

async function anularVenta(id) {
  const motivo = await customPrompt('Motivo de anulación (requerido):', 'Error en venta', 'text');
  if (!motivo || !motivo.trim()) return;
  if (await customConfirm('¿Seguro que deseas anular esta venta? Se devolverá el stock.')) {
    if (localStorage.getItem("modoLocal") === "true") {
      const venta = state.ventas.find(v => v.id === id);
      if (!venta) return;
      venta.estado = 'anulada';
      for (const item of (venta.items || [])) {
        const prod = state.productos.find(p => p.id === (item.productoId || item.id));
        if (prod && prod.seguimientoInventario) prod.stock += item.cantidad;
      }
      saveToLocalStorage('ventas', state.ventas);
      saveToLocalStorage('productos', state.productos);
      showToast('Venta anulada (modo local)', 'success');
      mostrarFactura(id);
      renderSalesHistory();
      return;
    }
    try {
      await apiRequest(`/sales/${id}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason: motivo.trim() })
      });
      await loadAllDataFromAPI(true);
      showToast('Venta anulada correctamente', 'success');
      closeModal();
      renderSalesHistory();
    } catch (error) {
      showToast(error.message || 'Error al anular la venta', 'error');
    }
  }
}

async function corregirVenta(id) {
  const venta = state.ventas.find(v => v.id === id);
  if (!venta) return;
  mostrarModalCorreccion(venta);
}

function mostrarModalCorreccion(venta) {
  const modal = document.getElementById("modal-content");
  const productosDisponibles = (state.productos || []).filter(p => p.activo !== false);
  const clientesDisponibles = (state.clientes || []).filter(c => c.activo !== false);

  const corrItems = JSON.parse(JSON.stringify(venta.items || []));

  function renderCorrItems() {
    return corrItems.map((item, idx) => `
      <tr>
        <td>${item.nombre}</td>
        <td style="text-align:center;">
          <input type="number" class="form-input corr-qty" data-idx="${idx}"
            value="${item.cantidad}" min="1"
            style="width:70px; text-align:center; padding:0.3rem;">
        </td>
        <td style="text-align:center;">
          <button class="btn btn-small btn-danger corr-remove" data-idx="${idx}">✕</button>
        </td>
      </tr>`).join('');
  }

  function renderAddProduct() {
    return `<select id="corr-add-select" class="form-input" style="flex:1;">
      <option value="">— Agregar producto —</option>
      ${productosDisponibles.map(p => `<option value="${p.id}">${p.nombre} (stock: ${p.stock})</option>`).join('')}
    </select>`;
  }

  function buildModal() {
    modal.innerHTML = `
      <h2>🧰 Corregir Venta <span style="font-size:0.85rem;color:var(--text-dim);font-weight:400;">${venta.numero || venta.id}</span></h2>
      <p style="color:var(--text-dim); margin-bottom:0.75rem; font-size:0.9rem;">
        Ajusta ítems, cliente y método de pago. El inventario se recalculará automáticamente.
      </p>

      <table class="data-table" id="corr-table" style="margin-bottom:0.75rem;">
        <thead><tr><th>Producto</th><th>Cantidad</th><th></th></tr></thead>
        <tbody id="corr-tbody">${renderCorrItems()}</tbody>
      </table>

      <div style="display:flex; gap:0.5rem; margin-bottom:1rem; align-items:center;">
        ${renderAddProduct()}
        <button class="btn btn-secondary" id="corr-add-btn">+ Agregar</button>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
        <div class="form-group" style="margin:0;">
          <label>Cliente (opcional)</label>
          <select class="form-input" id="corr-cliente">
            <option value="">Sin cliente</option>
            ${clientesDisponibles.map(c => `<option value="${c.id}" ${venta.clienteId === c.id ? 'selected' : ''}>${c.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="margin:0;">
          <label>Método de pago</label>
          <select class="form-input" id="corr-metodo">
            <option value="efectivo"      ${(venta.metodoPago||'efectivo')==='efectivo'      ?'selected':''}>Efectivo</option>
            <option value="nequi"         ${(venta.metodoPago||'')==='nequi'                 ?'selected':''}>Nequi</option>
            <option value="tarjeta"       ${(venta.metodoPago||'')==='tarjeta'               ?'selected':''}>Tarjeta</option>
            <option value="transferencia" ${(venta.metodoPago||'')==='transferencia'         ?'selected':''}>Transferencia</option>
            <option value="debe"          ${(venta.metodoPago||'')==='debe'                  ?'selected':''}>Debe</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Motivo de la corrección <span style="color:var(--danger)">*</span></label>
        <input type="text" class="form-input" id="corr-reason" placeholder="ej: Error en cantidad ingresada" required>
      </div>

      <div style="display:flex; gap:0.75rem; margin-top:1rem;">
        <button class="btn btn-success" id="btn-confirm-corr" style="flex:1;">💾 Guardar Corrección</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      </div>`;

    document.querySelectorAll(".corr-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        corrItems.splice(Number(btn.dataset.idx), 1);
        document.getElementById("corr-tbody").innerHTML = renderCorrItems();
        rebindCorrEvents();
      });
    });

    document.getElementById("corr-add-btn").addEventListener("click", () => {
      const sel = document.getElementById("corr-add-select");
      const prodId = sel.value;
      if (!prodId) return;
      const prod = productosDisponibles.find(p => p.id === prodId);
      if (!prod) return;
      const existing = corrItems.find(i => i.id === prodId);
      if (existing) { existing.cantidad++; }
      else { corrItems.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 }); }
      document.getElementById("corr-tbody").innerHTML = renderCorrItems();
      rebindCorrEvents();
    });

    document.getElementById("btn-confirm-corr").addEventListener("click", submitCorreccion);
  }

  function rebindCorrEvents() {
    document.querySelectorAll(".corr-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        corrItems.splice(Number(btn.dataset.idx), 1);
        document.getElementById("corr-tbody").innerHTML = renderCorrItems();
        rebindCorrEvents();
      });
    });
  }

  async function submitCorreccion() {
    document.querySelectorAll(".corr-qty").forEach(input => {
      const idx = Number(input.dataset.idx);
      corrItems[idx].cantidad = parseInt(input.value || 1);
    });

    const reason = document.getElementById("corr-reason").value.trim();
    const metodoPago = document.getElementById("corr-metodo").value || venta.metodoPago || "efectivo";
    const clienteId = document.getElementById("corr-cliente").value || null;

    if (!reason) { showToast("Ingresa el motivo de la corrección", "warning"); return; }
    if (corrItems.length === 0) { showToast("La corrección debe tener al menos un ítem", "warning"); return; }
    if (metodoPago === "debe" && !clienteId) {
      showToast("El método 'Debe' requiere seleccionar un cliente", "warning");
      return;
    }

    if (localStorage.getItem("modoLocal") === "true") {
      venta.estado = "corregida";
      venta.items = JSON.parse(JSON.stringify(corrItems));
      venta.metodoPago = metodoPago;
      if (clienteId) venta.clienteId = clienteId;
      saveToLocalStorage("ventas", state.ventas);
      showToast("Corrección guardada (modo local)", "success");
      closeModal();
      renderSalesHistory();
      return;
    }

    try {
      await apiRequest(`/sales/${venta.id}/correct`, {
        method: "POST",
        body: JSON.stringify({
          reason,
          paymentMethod: metodoPago,
          customerId: clienteId,
          items: corrItems.map(i => ({ productId: i.id, quantity: i.cantidad }))
        })
      });
      await loadAllDataFromAPI(true);
      showToast("Corrección guardada con trazabilidad completa", "success");
      closeModal();
      renderSalesHistory();
    } catch (error) {
      showToast(error.message || "Error al corregir la venta", "error");
    }
  }

  buildModal();
  openModal();
}

async function reembolsarVenta(id) {
  const venta = state.ventas.find(v => v.id === id);
  if (!venta) return;
  mostrarModalReembolso(venta);
}

function mostrarModalReembolso(venta) {
  const modal = document.getElementById("modal-content");
  const itemsHtml = (venta.items || []).map((item, idx) => `
    <tr>
      <td>${item.nombre}</td>
      <td style="text-align:center;">${item.cantidad}</td>
      <td style="text-align:center;">
        <input type="number" class="form-input refund-qty" data-idx="${idx}"
          data-saleid="${item.saleItemId || ''}" data-max="${item.cantidad}"
          value="${item.cantidad}" min="0" max="${item.cantidad}"
          style="width:70px; text-align:center; padding:0.3rem;">
      </td>
    </tr>`).join('');

  modal.innerHTML = `
    <h2>🔄 Reembolso <span style="font-size:0.85rem;color:var(--text-dim);font-weight:400;">${venta.numero || venta.id}</span></h2>
    <p style="color:var(--text-dim); margin-bottom:1rem; font-size:0.9rem;">
      Ajusta la cantidad a reembolsar por ítem (0 para excluir ese ítem del reembolso).
    </p>
    <table class="data-table" style="margin-bottom:1rem;">
      <thead><tr><th>Producto</th><th>Vendido</th><th>Reembolsar</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div class="form-group">
      <label>Motivo del reembolso <span style="color:var(--danger)">*</span></label>
      <input type="text" class="form-input" id="refund-reason" placeholder="ej: Producto defectuoso, cambio de opinión..." required>
    </div>
    <div class="form-group" style="margin-top:0.5rem;">
      <label style="display:flex; align-items:center; gap:0.6rem; cursor:pointer; font-size:0.95rem;">
        <input type="checkbox" id="refund-restock" checked style="width:16px;height:16px;">
        <span>Retornar productos al inventario</span>
      </label>
      <small style="color:var(--text-dim); font-size:0.8rem; margin-top:0.25rem; display:block; padding-left:1.6rem;">
        Marca esta opción si los productos regresan al stock disponible para venta.
      </small>
    </div>
    <div style="display:flex; gap:0.75rem; margin-top:1rem;">
      <button class="btn btn-success" id="btn-confirm-refund" style="flex:1;">✅ Procesar Reembolso</button>
      <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    </div>`;
  openModal();

  document.getElementById("btn-confirm-refund").addEventListener("click", async () => {
    const reason = document.getElementById("refund-reason").value.trim();
    const restock = document.getElementById("refund-restock").checked;

    if (!reason) { showToast("Ingresa un motivo para el reembolso", "warning"); return; }

    const refundItems = [];
    document.querySelectorAll(".refund-qty").forEach(input => {
      const qty = parseInt(input.value || 0);
      const saleItemId = input.dataset.saleid;
      if (qty > 0 && saleItemId) refundItems.push({ saleItemId, quantity: qty });
    });

    if (refundItems.length === 0) { showToast("Selecciona al menos un ítem para reembolsar", "warning"); return; }

    if (localStorage.getItem("modoLocal") === "true") {
      venta.estado = "anulada";
      if (restock) {
        for (const item of (venta.items || [])) {
          const prod = state.productos.find(p => p.id === (item.productoId || item.id));
          if (prod && prod.seguimientoInventario) prod.stock += item.cantidad;
        }
        saveToLocalStorage("productos", state.productos);
      }
      saveToLocalStorage("ventas", state.ventas);
      showToast(`Reembolso procesado (modo local)${restock ? ", stock restaurado" : ""}`, "success");
      closeModal();
      renderSalesHistory();
      return;
    }

    try {
      await apiRequest(`/sales/${venta.id}/refunds`, {
        method: "POST",
        body: JSON.stringify({ type: "parcial", reason, restock, items: refundItems })
      });
      await loadAllDataFromAPI(true);
      showToast(`Reembolso procesado${restock ? " — stock restaurado" : " — sin retorno al inventario"}`, "success");
      closeModal();
      renderSalesHistory();
    } catch (error) {
      showToast(error.message || "Error procesando reembolso", "error");
    }
  });
}

window.editarProductoEnCaliente = async function(productoId) {
  const prod = state.productos.find(p => p.id === productoId);
  if(!prod) return;
  const nuevoPrecioStr = await customPrompt('Editando producto: '+prod.nombre+'\n\nNuevo precio de venta:', prod.precio, 'number');
  if(nuevoPrecioStr !== null) {
      const p = parseFloat(nuevoPrecioStr);
      if(!isNaN(p) && p>=0) {
          prod.precio = p;
          if (typeof saveSheetData === 'function') await saveSheetData('productos', prod);
          else saveToLocalStorage('productos', state.productos);

          if(state.ventaActual) {
             const cartItem = state.ventaActual.items.find(i=>i.id===productoId);
             if(cartItem) {
                 cartItem.precio = p;
                 cartItem.subtotal = p * cartItem.cantidad;
                 calculateSaleTotals();
             }
          }
          actualizarCartaPOS();
          showToast('Precio actualizado exitosamente', 'success');
      } else {
          showToast('Precio inválido', 'error');
      }
  }

// =====================================================================
// MÓDULO DE DESCUENTOS
// =====================================================================

function renderDescuentosList() {
  const view = document.getElementById("view-descuentos");
  if (!view) return;

  const descuentos = (state.descuentos || []);

  view.innerHTML = `
    <div class="view-header">
      <h2>🏷️ Descuentos</h2>
      <button class="btn btn-primary" onclick="mostrarFormDescuento(null)">+ Nuevo Descuento</button>
    </div>

    <div class="card" style="margin-bottom:1.5rem; padding:1rem;">
      <p style="color:var(--text-dim); font-size:0.9rem; margin:0;">
        Los descuentos predefinidos se pueden aplicar rápidamente en el Punto de Venta.
        Soporte para porcentaje (%) y monto fijo ($).
      </p>
    </div>

    ${descuentos.length === 0 ? `
      <div class="card" style="text-align:center; padding:3rem; color:var(--text-dim);">
        <div style="font-size:3rem; margin-bottom:1rem;">🏷️</div>
        <p>No hay descuentos creados.</p>
        <button class="btn btn-primary" onclick="mostrarFormDescuento(null)" style="margin-top:0.5rem;">
          Crear primer descuento
        </button>
      </div>
    ` : `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${descuentos.map(d => `
              <tr>
                <td><strong>${d.nombre}</strong></td>
                <td>
                  <span class="badge ${d.tipo === 'porcentaje' ? 'badge-info' : 'badge-success'}">
                    ${d.tipo === 'porcentaje' ? '% Porcentaje' : '$ Monto fijo'}
                  </span>
                </td>
                <td><strong>${d.tipo === 'porcentaje' ? d.valor + '%' : '$' + Number(d.valor).toFixed(2)}</strong></td>
                <td style="color:var(--text-dim); font-size:0.9rem;">${d.descripcion || '—'}</td>
                <td>
                  <span style="color:${d.activo !== false ? 'var(--success)' : 'var(--danger)'}; font-size:0.85rem;">
                    ${d.activo !== false ? '● Activo' : '○ Inactivo'}
                  </span>
                </td>
                <td>
                  <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-small" style="background:var(--primary);color:white;border:none;"
                      onclick="mostrarFormDescuento('${d.id}')">✏️ Editar</button>
                    <button class="btn btn-small btn-danger"
                      onclick="eliminarDescuento('${d.id}')">🗑️ Eliminar</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

function mostrarFormDescuento(id) {
  const descuento = id ? (state.descuentos || []).find(d => d.id === id) : null;
  const titulo = descuento ? 'Editar Descuento' : 'Nuevo Descuento';
  const modal = document.getElementById("modal-content");

  modal.innerHTML = `
    <h2>🏷️ ${titulo}</h2>
    <form id="form-descuento" onsubmit="return false;" style="display:flex;flex-direction:column;gap:1rem;">

      <div class="form-group">
        <label>Nombre del descuento <span style="color:var(--danger)">*</span></label>
        <input type="text" class="form-input" id="desc-nombre"
          placeholder="ej: Descuento estudiante, Promo fin de semana..."
          value="${descuento ? descuento.nombre : ''}" required>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label>Tipo <span style="color:var(--danger)">*</span></label>
          <select class="form-input" id="desc-tipo" onchange="actualizarPlaceholderDescuento()">
            <option value="porcentaje" ${!descuento || descuento.tipo === 'porcentaje' ? 'selected' : ''}>% Porcentaje</option>
            <option value="monto" ${descuento && descuento.tipo === 'monto' ? 'selected' : ''}>$ Monto fijo</option>
          </select>
        </div>
        <div class="form-group">
          <label>Valor <span style="color:var(--danger)">*</span></label>
          <input type="number" class="form-input" id="desc-valor"
            placeholder="ej: 10"
            value="${descuento ? descuento.valor : ''}"
            min="0" step="0.01" required>
          <small id="desc-valor-hint" style="color:var(--text-dim);font-size:0.8rem;">
            ${!descuento || descuento.tipo === 'porcentaje' ? 'Ingresa un valor entre 0 y 100' : 'Ingresa el valor en pesos'}
          </small>
        </div>
      </div>

      <div class="form-group">
        <label>Descripción (opcional)</label>
        <input type="text" class="form-input" id="desc-descripcion"
          placeholder="ej: Aplica para estudiantes con carné"
          value="${descuento ? (descuento.descripcion || '') : ''}">
      </div>

      <div class="form-group">
        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;">
          <input type="checkbox" id="desc-activo" ${!descuento || descuento.activo !== false ? 'checked' : ''}>
          Descuento activo
        </label>
      </div>

      <div style="display:flex;gap:0.75rem;margin-top:0.5rem;">
        <button class="btn btn-success" style="flex:1;" onclick="guardarDescuento('${id || ''}')">
          ${descuento ? '💾 Guardar cambios' : '✅ Crear descuento'}
        </button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      </div>
    </form>
  `;

  openModal();
}

function actualizarPlaceholderDescuento() {
  const tipo = document.getElementById("desc-tipo")?.value;
  const hint = document.getElementById("desc-valor-hint");
  if (hint) hint.textContent = tipo === 'porcentaje' ? 'Ingresa un valor entre 0 y 100' : 'Ingresa el valor en pesos';
}

async function guardarDescuento(id) {
  const nombre = document.getElementById("desc-nombre")?.value.trim();
  const tipo = document.getElementById("desc-tipo")?.value;
  const valorRaw = parseFloat(document.getElementById("desc-valor")?.value || "0");
  const descripcion = document.getElementById("desc-descripcion")?.value.trim() || "";
  const activo = document.getElementById("desc-activo")?.checked !== false;

  if (!nombre) { showToast("El nombre del descuento es obligatorio", "error"); return; }
  if (isNaN(valorRaw) || valorRaw < 0) { showToast("El valor debe ser mayor o igual a 0", "error"); return; }
  if (tipo === "porcentaje" && valorRaw > 100) { showToast("El porcentaje no puede superar 100%", "error"); return; }

  const payload = { nombre, tipo, valor: valorRaw, descripcion, activo };
  const saveBtn = document.querySelector("#form-descuento .btn-success");
  setButtonLoading(saveBtn, true);

  if (localStorage.getItem("modoLocal") === "true") {
    if (id) {
      const idx = state.descuentos.findIndex(d => d.id === id);
      if (idx > -1) state.descuentos[idx] = { ...state.descuentos[idx], ...payload };
    } else {
      state.descuentos.unshift({ id: generateDiscountId(), ...payload });
    }
    showToast(id ? "Descuento actualizado (modo local)" : "Descuento creado (modo local)", "success");
    closeModal();
    renderDescuentosList();
    return;
  }

  try {
    const isExistingUuid = id && /^[0-9a-f-]{36}$/i.test(id);
    const result = await apiRequest(isExistingUuid ? `/discounts/${id}` : "/discounts", {
      method: isExistingUuid ? "PATCH" : "POST",
      body: JSON.stringify(mapToAPI("descuentos", payload))
    });
    const saved = mapFromAPI("descuentos", result.data);
    if (isExistingUuid) {
      const idx = state.descuentos.findIndex(d => d.id === id);
      if (idx > -1) state.descuentos[idx] = saved;
    } else {
      state.descuentos.unshift(saved);
    }
    showToast(isExistingUuid ? "Descuento actualizado" : "Descuento creado exitosamente", "success");
    closeModal();
    renderDescuentosList();
  } catch (error) {
    showToast(error.message || "Error guardando descuento", "error");
    setButtonLoading(saveBtn, false);
  }
}

async function eliminarDescuento(id) {
  const descuento = (state.descuentos || []).find(d => d.id === id);
  if (!descuento) return;
  if (!await customConfirm(`¿Eliminar el descuento "${descuento.nombre}"?`)) return;

  if (localStorage.getItem("modoLocal") === "true") {
    state.descuentos = state.descuentos.filter(d => d.id !== id);
    showToast("Descuento eliminado (modo local)", "success");
    renderDescuentosList();
    return;
  }

  try {
    await apiRequest(`/discounts/${encodeURIComponent(id)}`, { method: "DELETE" });
    state.descuentos = state.descuentos.filter(d => d.id !== id);
    showToast("Descuento eliminado", "success");
    renderDescuentosList();
  } catch (error) {
    showToast(error.message || "Error eliminando descuento", "error");
  }
}
};
