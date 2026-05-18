// ========== PANTALLA DE LOGIN ==========

function mostrarPantallaLogin() {
  // Orbs de fondo para la pantalla de login
  document.body.innerHTML = `
    <div class="orb-1"></div>
    <div class="orb-2"></div>
    <div class="orb-3"></div>

    <div style="
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Outfit', sans-serif;
      padding: 2rem;
      position: relative;
    ">
      <div id="login-card" style="
        background: rgba(12, 12, 30, 0.88);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(59,130,246,0.1);
        padding: 3rem;
        width: 100%;
        max-width: 440px;
        position: relative;
        overflow: hidden;
      ">
        <!-- Acento superior de color -->
        <div style="
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4);
        "></div>

        <!-- Encabezado -->
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <div style="
            font-size: 3rem; margin-bottom: 0.5rem;
            filter: drop-shadow(0 0 16px rgba(139,92,246,0.6));
            animation: loginLogoGlow 3s ease-in-out infinite alternate;
          ">🌙</div>
          <h1 style="
            font-size: 2rem;
            margin: 0 0 0.3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #3B82F6, #8B5CF6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.03em;
          ">Papel &amp; Luna</h1>
          <p style="
            color: #8892AA;
            margin: 0;
            font-size: 0.9rem;
            font-weight: 500;
          ">Sistema POS · Iniciar Sesión</p>
        </div>

        <form id="login-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div>
            <label style="
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 600;
              font-size: 0.78rem;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #8892AA;
            ">Usuario</label>
            <input type="text" id="login-usuario" placeholder="ej: admin" autocomplete="username" style="
              width: 100%;
              padding: 0.85rem 1rem;
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 10px;
              font-size: 0.95rem;
              box-sizing: border-box;
              background: rgba(255,255,255,0.05);
              color: #F0F4FF;
              font-family: 'Outfit', sans-serif;
              transition: all 0.25s ease;
              outline: none;
            " autofocus required>
          </div>

          <div>
            <label style="
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 600;
              font-size: 0.78rem;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #8892AA;
            ">Contraseña</label>
            <div style="position: relative; display: flex; align-items: center;">
              <input type="password" id="login-password" placeholder="••••••••" autocomplete="current-password" style="
                width: 100%;
                padding: 0.85rem 1rem;
                padding-right: 2.5rem;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                font-size: 0.95rem;
                box-sizing: border-box;
                background: rgba(255,255,255,0.05);
                color: #F0F4FF;
                font-family: 'Outfit', sans-serif;
                transition: all 0.25s ease;
                outline: none;
              " required>
              <button type="button" class="toggle-password-login" id="toggle-password-login" style="
                position: absolute;
                right: 10px;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                color: #8892AA;
                opacity: 0.6;
                transition: opacity 0.2s;
              ">👁️</button>
            </div>
          </div>

          <button type="submit" id="login-btn" style="
            width: 100%;
            padding: 0.9rem;
            background: linear-gradient(135deg, #3B82F6, #8B5CF6);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.25s ease;
            font-family: 'Outfit', sans-serif;
            letter-spacing: 0.01em;
            box-shadow: 0 4px 20px rgba(59,130,246,0.35);
            margin-top: 0.25rem;
          ">
            Iniciar Sesión →
          </button>
        </form>

        <!-- Credenciales de prueba -->
        <div id="credenciales-caja" style="
          display: none;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          font-size: 0.82rem;
          color: #8892AA;
        ">
          <p style="margin: 0 0 0.75rem 0; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">
            🔑 Credenciales de prueba
          </p>
          <div style="
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.07);
            padding: 1rem;
            border-radius: 10px;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          ">
            <div style="padding: 0.6rem; background: rgba(59,130,246,0.08); border-radius: 8px; border: 1px solid rgba(59,130,246,0.15);">
              <div style="color: #3B82F6; font-weight: 700; margin-bottom: 0.3rem; font-size: 0.75rem;">ADMIN</div>
              <div style="color: #8892AA; font-size: 0.75rem;">usuario: admin</div>
              <div style="color: #8892AA; font-size: 0.75rem;">pass: admin123</div>
            </div>
            <div style="padding: 0.6rem; background: rgba(16,185,129,0.08); border-radius: 8px; border: 1px solid rgba(16,185,129,0.15);">
              <div style="color: #10B981; font-weight: 700; margin-bottom: 0.3rem; font-size: 0.75rem;">CAJERO</div>
              <div style="color: #8892AA; font-size: 0.75rem;">usuario: cajero</div>
              <div style="color: #8892AA; font-size: 0.75rem;">pass: cajero123</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes loginLogoGlow {
        from { filter: drop-shadow(0 0 8px rgba(59,130,246,0.5)); }
        to   { filter: drop-shadow(0 0 20px rgba(139,92,246,0.9)); }
      }
    </style>
  `;

  // Focus glow en inputs
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", function() {
      this.style.borderColor = "rgba(59,130,246,0.7)";
      this.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
      this.style.background = "rgba(59,130,246,0.08)";
    });
    input.addEventListener("blur", function() {
      this.style.borderColor = "rgba(255,255,255,0.1)";
      this.style.boxShadow = "none";
      this.style.background = "rgba(255,255,255,0.05)";
    });
  });

  // Hover en botón submit
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("mouseover", () => {
      loginBtn.style.transform = "translateY(-2px)";
      loginBtn.style.boxShadow = "0 8px 30px rgba(59,130,246,0.5)";
    });
    loginBtn.addEventListener("mouseout", () => {
      loginBtn.style.transform = "translateY(0)";
      loginBtn.style.boxShadow = "0 4px 20px rgba(59,130,246,0.35)";
    });
  }

  // Atajo de teclado oculto: Ctrl + Shift + Q
  document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === "q" || e.key === "Q")) {
      const caja = document.getElementById("credenciales-caja");
      if (caja) {
        caja.style.display = caja.style.display === "none" ? "block" : "none";
      }
    }
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
  const card = document.getElementById("login-card");
  const existing = document.getElementById("login-error");
  if (existing) existing.remove();

  const errorDiv = document.createElement("div");
  errorDiv.id = "login-error";
  errorDiv.style.cssText = `
    background: rgba(239,68,68,0.12);
    color: #EF4444;
    border: 1px solid rgba(239,68,68,0.3);
    padding: 0.75rem 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    font-weight: 600;
    text-align: center;
    animation: shake 0.4s ease;
    font-size: 0.875rem;
  `;
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
      <td style="font-weight:600; color:var(--text-main);">${item.nombre} <button style="background:none; border:none; cursor:pointer; font-size:12px; margin-left:4px;" onclick="editarProductoEnCaliente('${item.productoId}')" title="Editar precio">✏️</button></td>
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
}

function mostrarComprobante(venta) {
  const metodosLabel = { efectivo: "Efectivo", nequi: "Nequi", debe: "Debe (cuenta por cobrar)" };
  const items = Array.isArray(venta.items) ? venta.items : [];

  let filasItems = items.map(function(item) {
    return "<tr style='border-bottom:1px solid #eee;'>"
      + "<td style='padding:4px 8px;'>" + item.nombre + "</td>"
      + "<td style='padding:4px 8px; text-align:center;'>" + item.cantidad + "</td>"
      + "<td style='padding:4px 8px; text-align:right;'>$" + parseFloat(item.precio).toFixed(2) + "</td>"
      + "<td style='padding:4px 8px; text-align:right;'>$" + parseFloat(item.subtotal).toFixed(2) + "</td>"
      + "</tr>";
  }).join("");

  const descuentoHtml = venta.descuento > 0
    ? "<tr><td colspan='3' style='text-align:right; padding:4px 8px;'>Descuento:</td><td style='text-align:right; padding:4px 8px; color:#DC2626;'>-$" + parseFloat(venta.descuento).toFixed(2) + "</td></tr>"
    : "";

  const cambioHtml = venta.metodoPago === "efectivo" && venta.cambio > 0
    ? "<p style='margin:0.25rem 0;'><strong>Cambio:</strong> $" + parseFloat(venta.cambio).toFixed(2) + "</p>"
    : "";

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <div style="font-family: monospace; max-width: 400px; margin: 0 auto;">
      <div style="text-align:center; border-bottom:2px solid #333; padding-bottom:1rem; margin-bottom:1rem;">
        <h2 style="margin:0; font-size:1.4rem;">🌙 Papel & Luna</h2>
        <p style="margin:0.25rem 0; font-size:0.85rem; color:#666;">NIT: 900.123.456-7</p>
        <p style="margin:0.25rem 0; font-size:0.85rem; color:#666;">Cali, Colombia | Tel: (300) 123-4567</p>
        <p style="margin:0.5rem 0; font-size:0.85rem;"><strong>COMPROBANTE DE VENTA</strong></p>
        <p style="margin:0; font-size:0.8rem; color:#666;">ID: ${venta.id} | ${venta.fecha}</p>
      </div>

      <table style="width:100%; font-size:0.85rem; border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid #333;">
            <th style="text-align:left; padding:4px 8px;">Producto</th>
            <th style="text-align:center; padding:4px 8px;">Cant.</th>
            <th style="text-align:right; padding:4px 8px;">Precio</th>
            <th style="text-align:right; padding:4px 8px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${filasItems}</tbody>
        <tfoot style="border-top:1px solid #333;">
          <tr><td colspan="3" style="text-align:right; padding:4px 8px;">Subtotal:</td><td style="text-align:right; padding:4px 8px;">$${parseFloat(venta.subtotal).toFixed(2)}</td></tr>
          ${descuentoHtml}
          <tr><td colspan="3" style="text-align:right; padding:4px 8px;">IVA (19%):</td><td style="text-align:right; padding:4px 8px;">$${parseFloat(venta.impuesto).toFixed(2)}</td></tr>
          <tr style="font-weight:bold; border-top:2px solid #333;">
            <td colspan="3" style="text-align:right; padding:6px 8px;">TOTAL:</td>
            <td style="text-align:right; padding:6px 8px; color:#059669;">$${parseFloat(venta.total).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="border-top:1px solid #ddd; margin-top:1rem; padding-top:0.75rem; font-size:0.85rem;">
        <p style="margin:0.25rem 0;"><strong>Método de pago:</strong> ${metodosLabel[venta.metodoPago] || venta.metodoPago}</p>
        ${cambioHtml}
      </div>

      <div style="text-align:center; border-top:1px solid #ddd; margin-top:1rem; padding-top:0.75rem; font-size:0.8rem; color:#888;">
        <p style="margin:0;">¡Gracias por su compra!</p>
      </div>

      <div style="display:flex; gap:0.75rem; margin-top:1.5rem;">
        <button class="btn btn-primary" style="flex:1;" onclick="closeModal(); startSale(); navigateTo('pos');">🛒 Nueva Venta</button>
        <button class="btn btn-secondary" onclick="closeModal(); navigateTo('history');">📊 Ver Historial</button>
      </div>
    </div>`;
  openModal();
}

function renderProductList() {
  const view = document.getElementById("view-products");
  const products = getAllProducts();
  view.innerHTML = `<div class="container"><div class="section-header"><h2>Gestión de Productos</h2><button class="btn btn-primary" onclick="mostrarFormularioProducto()">+ Nuevo Producto</button></div><div class="table-container"><table class="data-table"><thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Costo</th><th>Stock</th><th>Acción</th></tr></thead><tbody>${products.map((p, idx) => `<tr><td><strong>${String(idx + 1).padStart(4, '0')}</strong></td><td>${p.nombre}</td><td>$${p.precio.toFixed(2)}</td><td>$${p.costo.toFixed(2)}</td><td><span class="badge badge-success">${p.stock}</span></td><td><button class="btn btn-small product-edit" data-id="${p.id}" style="border: 1px solid var(--border);">✏️ Editar</button><button class="btn btn-small btn-danger product-delete" data-id="${p.id}">🗑️ Eliminar</button></td></tr>`).join("")}</tbody></table></div></div>`;
  
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
  view.innerHTML = `<div class="container"><div class="section-header"><h2>Categorías</h2><button class="btn btn-primary" onclick="mostrarFormularioCategoria()">+ Nueva Categoría</button></div><div class="cards-grid">${categorias.map(c => `<div class="card"><h4>${c.nombre}</h4><p>${c.descripcion || ""}</p><div class="card-actions"><button class="btn-small categoria-edit" data-id="${c.id}" style="border: 1px solid var(--border);">✏️ Editar</button><button class="btn-small btn-danger categoria-delete" data-id="${c.id}">🗑️ Eliminar</button></div></div>`).join("")}</div></div>`;
  
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

  const modalContent = document.getElementById("modal-content");
  
  let html = `
    <div id="factura-print-area" style="padding: 1.5rem; background: #fff; color: #000; font-family: monospace;">
      <h2 style="text-align: center; margin-bottom: 0.5rem; border-bottom: 1px dashed #000; padding-bottom: 0.5rem; color: #000;">Ticket de Venta</h2>
      <p style="text-align: center; margin-bottom: 0.5rem; font-size: 0.95rem; color: #000;"><strong>PAPEL & LUNA</strong><br>NIT: 901.234.567-8</p>
      <p style="text-align: center; margin-bottom: 1.5rem; font-size: 0.95rem; color: #000;">ID: ${venta.id}<br>Fecha: ${venta.fecha}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.95rem; color: #000;">
        <thead style="color: #000;">
          <tr style="border-bottom: 1px dashed #000;">
            <th style="text-align: left; padding: 0.3rem 0; color: #000;">Descripción</th>
            <th style="text-align: right; padding: 0.3rem 0; color: #000;">Cant</th>
            <th style="text-align: right; padding: 0.3rem 0; color: #000;">SubT</th>
          </tr>
        </thead>
        <tbody>
          ${(venta.items || []).map(item => `
            <tr>
              <td style="text-align: left; padding: 0.3rem 0; color: #000;">${item.nombre}</td>
              <td style="text-align: right; padding: 0.3rem 0; color: #000;">${item.cantidad}</td>
              <td style="text-align: right; padding: 0.3rem 0; color: #000;">$${parseFloat(item.subtotal || (item.precio * item.cantidad)).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="border-top: 1px dashed #000; padding-top: 0.5rem; text-align: right; font-size: 0.95rem; color: #000;">
        <p style="color: #000;"><strong>Subtotal:</strong> $${parseFloat(venta.subtotal).toFixed(2)}</p>
        <p style="color: #000;"><strong>Impuesto:</strong> $${parseFloat(venta.impuesto).toFixed(2)}</p>
        <p style="font-size: 1.2em; margin-top: 0.5rem; color: #000;"><strong>Total:</strong> $${parseFloat(venta.total).toFixed(2)}</p>
      </div>
        <p style="color: #000;"><strong>Método:</strong> ${venta.metodoPago || '-'}</p>
        <p style="color: #000;"><strong>Cambio entregado:</strong> $${parseFloat(venta.cambio || 0).toFixed(2)}</p>
      </div>
      ${venta.historialCorrecciones && venta.historialCorrecciones.length > 0 ? `
      <div style="margin-top: 1rem; padding: 0.5rem; background: #fff1f2; border: 1px dashed #e11d48; font-size: 0.85rem; color: #e11d48; text-align: left;">
        <strong>Historial de Correcciones:</strong>
        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem;">
          ${venta.historialCorrecciones.map(c => `<li>${c.fecha} - ${c.usuario}: ${c.motivo}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      <p style="text-align: center; margin-top: 2rem; font-size: 0.85rem; padding-top: 1rem; border-top: 1px dashed #000; color: #000;">¡Gracias por su compra!</p>
    </div>
    
    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: space-between; align-items: center;" class="no-print">
      <div style="display: flex; gap: 0.5rem;">
        ${state.rolActual === 'admin' ? `
        <button class="btn btn-small" style="background:var(--warning);" onclick="corregirVenta('${venta.id}')">🧰 Corregir</button>
        <button class="btn btn-small" style="background:var(--info);" onclick="reembolsarVenta('${venta.id}')">🔄 Reembolso</button>
        <button class="btn btn-small btn-danger" onclick="anularVenta('${venta.id}')">🗑️ Anular</button>
        ` : ''}
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir / Descargar PDF</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
      </div>
    </div>
  `;
  
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
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Método Pago</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${compras.map(c => {
                  const prov = state.proveedores.find(p => p.id === c.proveedorId);
                  let items = [];
                  try { items = typeof c.itemsJson === 'string' ? JSON.parse(c.itemsJson) : (c.itemsJson || []); } catch(e) {}
                  return `<tr>
                    <td><span class="badge badge-info" style="font-family:'JetBrains Mono',monospace;">${c.id}</span></td>
                    <td>${c.fecha || '—'}</td>
                    <td><strong>${prov ? prov.nombre : (c.proveedorId || '—')}</strong></td>
                    <td><span class="badge badge-warning">${c.metodoPago || '—'}</span></td>
                    <td>${items.length} items</td>
                    <td><strong style="color:var(--neon-green,#10B981);">$${parseFloat(c.total||0).toFixed(2)}</strong></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>`}
    </div>`;
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
  
  view.innerHTML = `<div class="container">
    <div class="section-header">
      <h2>📊 Reportes</h2>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
      <div class="card" style="border-left: 5px solid var(--primary);">
        <h3 style="color: var(--primary); margin-top: 0;">📈 Reporte de Ventas</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Análisis detallado de ventas por período</p>
        <button class="btn btn-primary" style="width: 100%;" onclick="mostrarFormularioReportVentas()">Generar Reporte</button>
      </div>
      
      <div class="card" style="border-left: 5px solid var(--success);">
        <h3 style="color: var(--success); margin-top: 0;">📦 Reporte de Inventario</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Estado actual del inventario y productos con bajo stock</p>
        <button class="btn btn-success" style="width: 100%;" onclick="generarYMostrarReporteInventario()">Generar Reporte</button>
      </div>
      
      <div class="card" style="border-left: 5px solid var(--info);">
        <h3 style="color: var(--info); margin-top: 0;">👥 Reporte de Clientes</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Información sobre clientes activos e inactivos</p>
        <button class="btn btn-info" style="width: 100%;" onclick="generarYMostrarReporteClientes()">Generar Reporte</button>
      </div>
      
      <div class="card" style="border-left: 5px solid var(--warning);">
        <h3 style="color: var(--warning); margin-top: 0;">🛒 Reporte de Compras</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Análisis de compras a proveedores</p>
        <button class="btn btn-warning" style="width: 100%; color: white;" onclick="mostrarFormularioReportCompras()">Generar Reporte</button>
      </div>
    </div>
    
    <div class="table-container">
      <h3>Reportes Generados</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Período/Fecha</th>
            <th>Fecha Generación</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          ${state.reportes.length === 0 ? 
            '<tr><td colspan="4" style="text-align: center; padding: 2rem;">No hay reportes generados</td></tr>' : 
            state.reportes.map(r => `
              <tr>
                <td><strong>${r.tipo}</strong></td>
                <td>${r.periodo || r.fecha}</td>
                <td>${r.fecha}</td>
                <td><button class="btn-small btn-primary" onclick="mostrarDetallesReporte('${JSON.stringify(r).replace(/"/g, '&quot;')}')">Ver Detalles</button></td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    </div>
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
    const reporte = typeof reporteStr === 'string' ? JSON.parse(reporteStr) : reporteStr;
    const modalContent = document.getElementById("modal-content");
    
    let html = `<h3>${reporte.tipo}</h3>`;
    
    if (reporte.periodo) html += `<p><strong>Período:</strong> ${reporte.periodo}</p>`;
    html += `<p><strong>Fecha de Generación:</strong> ${reporte.fecha}</p>`;
    
    const dicc = {
      totalVentas: "Total de Ventas",
      totalDescuentos: "Total de Descuentos",
      totalImpuestos: "Total de Impuestos (IVA)",
      totalArticulos: "Total de Artículos Vendidos",
      cantidadTransacciones: "Cantidad de Transacciones",
      ticketPromedio: "Ticket Promedio",
      totalProductos: "Total de Productos",
      productosAgotados: "Productos Agotados",
      productosConBajoStock: "Productos con Bajo Stock",
      valorTotalInventario: "Valor Total del Inventario",
      costoTotalInventario: "Costo Total del Inventario",
      gananciaPotencial: "Ganancia Potencial",
      totalClientes: "Total de Clientes",
      clientesActivos: "Clientes Activos",
      totalClientesInactivos: "Clientes Inactivos",
      totalCompras: "Total de Compras"
    };

    html += `<div style="margin-top: 1rem; border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius); background: var(--bg-panel);">`;

    Object.keys(reporte).forEach(key => {
      if (!['tipo', 'periodo', 'fecha'].includes(key)) {
        const valor = reporte[key];
        const label = dicc[key] || key;
        
        if (Array.isArray(valor)) {
          html += `<h4 style="margin-top:1rem;">${label}:</h4>`;
          if (valor.length === 0) {
            html += `<p style="color:var(--text-muted);">No hay registros.</p>`;
          } else {
            html += `<ul style="padding-left:1.5rem;">`;
            valor.forEach(v => {
              if (v.nombre && v.stock !== undefined) {
                html += `<li><strong>${v.nombre}</strong> - Stock: <span style="color:var(--danger);">${v.stock}</span></li>`;
              } else {
                html += `<li>${JSON.stringify(v)}</li>`;
              }
            });
            html += `</ul>`;
          }
        } else {
          const isMoney = ['totalVentas', 'totalDescuentos', 'totalImpuestos', 'ticketPromedio', 'valorTotalInventario', 'costoTotalInventario', 'gananciaPotencial', 'totalCompras'].includes(key);
          const displayVal = isMoney ? `$${parseFloat(valor).toFixed(2)}` : valor;
          html += `<div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; border-bottom:1px solid var(--border); padding-bottom:0.25rem;">
                     <span><strong>${label}</strong></span>
                     <span>${displayVal}</span>
                   </div>`;
        }
      }
    });
    
    html += `</div>`;
    
    // Gráfico interactivo si es reporte de ventas o inventario
    if (['Reporte de Ventas', 'Reporte de Inventario'].includes(reporte.tipo)) {
      html += `<div style="margin-top: 2rem; background: #fff; padding: 1rem; border-radius: 12px; height: 300px;">
                 <canvas id="reportChart"></canvas>
               </div>`;
    }

    html += `<div style="margin-top: 1.5rem; text-align: right;">
               <button class="btn btn-secondary" onclick="window.print()" style="margin-right: 0.5rem;" class="no-print">🖨️ Imprimir</button>
               <button class="btn btn-primary" onclick="closeModal()">Cerrar</button>
             </div>`;
    
    modalContent.innerHTML = html;
    openModal();

    // Inicializar gráfico
    if (['Reporte de Ventas', 'Reporte de Inventario'].includes(reporte.tipo)) {
      const ctx = document.getElementById('reportChart').getContext('2d');
      const isVentas = reporte.tipo === 'Reporte de Ventas';
      
      new Chart(ctx, {
        type: isVentas ? 'bar' : 'pie',
        data: {
          labels: isVentas ? ['Subtotal', 'IVA', 'Total'] : ['Ventas', 'Descuentos', 'Impuestos'],
          datasets: [{
            label: 'Valores ($)',
            data: isVentas ? [reporte.totalVentas, reporte.totalImpuestos, reporte.totalVentas] : [reporte.totalVentas, reporte.totalDescuentos, reporte.totalImpuestos],
            backgroundColor: [
              'rgba(59, 130, 246, 0.6)',
              'rgba(16, 185, 129, 0.6)',
              'rgba(139, 92, 246, 0.6)'
            ],
            borderColor: [
              '#3b82f6',
              '#10b981',
              '#8b5cf6'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
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
  if (usuariosList.length === 0) return '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No hay usuarios</td></tr>';
  
  return usuariosList.map(u => `
    <tr>
      <td>
        <strong>${u.nombre}</strong><br>
        <span style="font-size:0.85rem; color:var(--text-muted);">@${u.usuario}</span>
      </td>
      <td><span class="badge" style="background: ${u.rol === 'admin' ? 'var(--danger)' : 'var(--primary)'}; color: #000; font-weight: bold;">${u.rol.toUpperCase()}</span></td>
      <td>${u.fechaCreacion}</td>
      <td>
        <button class="btn-small ${u.activo ? 'btn-success' : 'btn-danger'}" onclick="toggleUserStatus('${u.id}')" title="Alternar Estado" style="min-width:90px">
          ${u.activo ? '✅ Activo' : '🚫 Inactivo'}
        </button>
      </td>
      <td>
        <button class="btn-small" style="background:var(--accent); color:white; margin-right:5px; border:none;" onclick="mostrarModalCambioPassword('${u.id}')">🔑 Pass</button>
        <button class="btn-small btn-danger" style="margin-right:5px;" onclick="mostrarFormularioUsuario('${u.id}')">✏️ Editar</button>
        <button class="btn-small" style="background:var(--danger); color:white; border:none;" onclick="deleteUsuario('${u.id}')">🗑️ Borrar</button>
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

function mostrarFormularioUsuario(userId = null) {
  const modalContent = document.getElementById("modal-content");
  let user = userId ? state.usuarios.find(u => u.id === userId) : null;

  modalContent.innerHTML = `
    <h3>${user ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
    <form id="user-form" class="form">
      <label>Nombre completo:</label>
      <input type="text" class="form-input" id="user-nombre" value="${user ? user.nombre : ''}" placeholder="Ej: Juan Pérez" required>

      <label>Nombre de usuario (para iniciar sesión):</label>
      <input type="text" class="form-input" id="user-usuario" value="${user ? user.usuario : ''}" placeholder="Ej: jperez" required autocomplete="off">

      <label>Rol:</label>
      <select class="form-input" id="user-rol" required>
        <option value="cajero" ${user && user.rol === 'cajero' ? 'selected' : ''}>Cajero</option>
        <option value="admin" ${user && user.rol === 'admin' ? 'selected' : ''}>Administrador</option>
      </select>

      ${!user ? `
      <label>Contraseña:</label>
      <input type="password" class="form-input" id="user-password" placeholder="Contraseña" required autocomplete="new-password">

      <label>Confirmar Contraseña:</label>
      <input type="password" class="form-input" id="user-password-confirm" placeholder="Confirmar contraseña" required>
      ` : ''}
        
        <label style="margin-top: 1rem; display: block;">Permisos de Módulos (Vistas permitidas):</label>
        <div id="user-permissions" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.5rem; margin-bottom: 1.5rem; background: var(--bg-body); padding: 1rem; border-radius: 0.5rem;">
          ${(window.PERMISOS ? window.PERMISOS.admin : ["home","pos","history","missing","clientes","products","categorias","compras","proveedores","reports","users"]).map(permiso => {
            let tienePermiso = user && user.permisos ? user.permisos.includes(permiso) : (user ? (window.PERMISOS && window.PERMISOS[user.rol] ? window.PERMISOS[user.rol].includes(permiso) : false) : false);
            if (!user) tienePermiso = (window.PERMISOS && window.PERMISOS["cajero"] ? window.PERMISOS["cajero"].includes(permiso) : false);
            const nombresPermisos = { home:'Inicio', pos:'TPV', history:'Historial', missing:'Faltantes', clientes:'Clientes', products:'Productos', categorias:'Categorías', compras:'Compras', proveedores:'Proveedores', descuentos:'Descuentos', reports:'Reportes', users:'Usuarios' };
            return `<label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal; font-size: 0.9rem; cursor: pointer;">
              <input type="checkbox" class="permiso-checkbox" value="${permiso}" ${tienePermiso ? 'checked' : ''}>
              ${nombresPermisos[permiso] || permiso}
            </label>`;
          }).join('')}
        </div>
  
        <button type="submit" class="btn btn-success">${user ? 'Guardar Cambios' : 'Crear Usuario'}</button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
      </form>
    `;
    openModal();

    // Actualizar checkboxes de permisos según el rol seleccionado (para nuevos usuarios)
    document.getElementById("user-rol").addEventListener("change", function() {
      if (user) return; // No cambiar automáticamente si estamos editando
      const nuevoRol = this.value;
      const permitidosDefault = window.PERMISOS ? (window.PERMISOS[nuevoRol] || []) : [];
      document.querySelectorAll(".permiso-checkbox").forEach(cb => {
        cb.checked = permitidosDefault.includes(cb.value);
      });
    });
  
    document.getElementById("user-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("user-nombre").value.trim();
      const usuarioLogin = document.getElementById("user-usuario").value.trim();
      const rol = document.getElementById("user-rol").value;
      
      const checkboxes = document.querySelectorAll(".permiso-checkbox");
      const permisosSeleccionados = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

      if (!user) {
        const p1 = document.getElementById("user-password").value;
        const p2 = document.getElementById("user-password-confirm").value;
  
        if (p1 !== p2) {
          showToast("Las contraseñas no coinciden", "error");
          return;
        }
        
        const roleMatch = state.usuarios.find(u => u.rol === rol);
        const roleId = roleMatch ? roleMatch.roleId : null;

        const nuevoUser = {
          nombre,
          usuario: usuarioLogin,
          fullName: nombre,
          username: usuarioLogin,
          password: p1,
          roleId: roleId,
          rol,
          permisos: permisosSeleccionados,
          activo: true
        };
        
        if (typeof saveSheetData === 'function') {
          const saved = await saveSheetData("usuarios", nuevoUser);
          if (saved && saved !== true) state.usuarios.push(saved);
        } else {
          nuevoUser.id = 'USER-' + rol.toUpperCase() + '-' + Date.now();
          state.usuarios.push(nuevoUser);
          saveToLocalStorage("usuarios", state.usuarios);
        }
      } else {
        const roleMatch = state.usuarios.find(u => u.rol === rol);
        const roleId = roleMatch ? roleMatch.roleId : user.roleId;

        const updatedUser = {
          ...user,
          nombre,
          usuario: usuarioLogin,
          fullName: nombre,
          username: usuarioLogin,
          roleId: roleId,
          rol,
          permisos: permisosSeleccionados
        };

        if (typeof saveSheetData === 'function') {
          const saved = await saveSheetData("usuarios", updatedUser);
          if (saved && saved !== true) Object.assign(user, saved);
        } else {
          Object.assign(user, updatedUser);
          saveToLocalStorage("usuarios", state.usuarios);
        }
      }

    closeModal();
    showToast(user ? "Usuario actualizado" : "Usuario creado exitosamente", "success");
    
    // Si editamos nuestro propio perfil, refrescar permisos de la barra lateral
    if (user && state.usuarioActual && user.id === state.usuarioActual.id) {
      if (typeof aplicarPermisosPorRol === 'function') aplicarPermisosPorRol();
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
  if (userId === "USER-ADMIN-001" || userId === state.usuarioActual?.id) {
    showToast("No puedes desactivarte a ti mismo ni a la cuenta maestra.", "error");
    return;
  }
  const u = state.usuarios.find(x => x.id === userId);
  if (!u) return;

  const nuevoEstado = !u.activo;
  u.activo = nuevoEstado;

  if (typeof saveSheetData === "function") {
    const saved = await saveSheetData("usuarios", u);
    if (!saved) {
      u.activo = !nuevoEstado; // revertir si falló
      showToast("Error actualizando estado del usuario", "error");
      renderUserManagement();
      return;
    }
  } else {
    saveToLocalStorage("usuarios", state.usuarios);
  }

  showToast(nuevoEstado ? "Usuario activado" : "Usuario desactivado", nuevoEstado ? "success" : "warning");
  renderUserManagement();
}

async function mostrarModalCambioPassword(userId) {
  const user = state.usuarios.find(u => u.id === userId);
  if (!user) return;
  
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <h3>🔑 Cambiar contraseña de ${user.nombre}</h3>
    <form id="change-pass-form" class="form">
      <label>Nueva Contraseña:</label>
      <input type="password" class="form-input" id="new-password" required minlength="6">
      <label>Confirmar Nueva Contraseña:</label>
      <input type="password" class="form-input" id="new-password-confirm" required minlength="6">
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
    
    if (typeof apiRequest === 'function' && localStorage.getItem("modoLocal") !== "true") {
      try {
        await apiRequest(`/users/${userId}/password`, {
          method: "PATCH",
          body: JSON.stringify({ password: p1 })
        });
      } catch (e) {
        showToast("Error al actualizar la contraseña en el servidor", "error");
        return;
      }
    } else {
      user.contraseña = p1;
      saveToLocalStorage('usuarios', state.usuarios);
    }
    showToast("Contraseña actualizada con éxito", "success");
    closeModal();
  });
}

function deleteUsuario(userId) {
  if (userId === "USER-ADMIN-001" || userId === state.usuarioActual.id) {
    showToast("No puedes eliminar al administrador principal.", "error");
    return;
  }
  
  customConfirm("¿Seguro que deseas eliminar este usuario de forma permanente?").then(async confirm => {
    if (confirm) {
      state.usuarios = state.usuarios.filter(u => u.id !== userId);
      if (typeof deleteSheetData === 'function') {
        await deleteSheetData('usuarios', userId);
      } else {
        saveToLocalStorage('usuarios', state.usuarios);
      }
      showToast('Usuario eliminado', 'success');
      renderUserManagement();
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
                  <span class="badge" style="background:${d.tipo === 'porcentaje' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)'}; color:${d.tipo === 'porcentaje' ? '#818cf8' : '#34d399'}; padding:0.2rem 0.6rem; border-radius:99px; font-size:0.8rem;">
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
