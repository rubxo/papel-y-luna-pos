document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Iniciando aplicación...");

  if (typeof loadAllDataFromAPI !== "function") {
    console.error("No se cargó js/api.js. Revisa que Live Server esté abierto en la carpeta raíz del proyecto.");
    mostrarErrorCargaAPI();
    return;
  }

  const usuarioGuardado = localStorage.getItem("usuarioActual");
  const token = localStorage.getItem("accessToken");
  if (usuarioGuardado && token) {
    try {
      const usuario = await validateSession();
      state.usuarioActual = usuario;
      state.rolActual = usuario.rol;
      state.logueado = true;
      initializeApp();
    } catch (error) {
      clearAuthSession();
      mostrarPantallaLogin();
    }
  } else {
    mostrarPantallaLogin();
  }
});

function mostrarErrorCargaAPI() {
  document.body.innerHTML = `
    <main style="min-height:100vh; display:grid; place-items:center; padding:2rem; font-family:Arial, sans-serif; background:#111827; color:white;">
      <section style="max-width:560px; background:#1f2937; border:1px solid #374151; border-radius:12px; padding:1.5rem;">
        <h1 style="margin-top:0;">No se pudo cargar la aplicación</h1>
        <p>Falta el archivo <strong>js/api.js</strong> o Live Server está abierto desde una carpeta equivocada.</p>
        <p>Abre como carpeta raíz: <strong>Tarea 23</strong>, luego recarga con Ctrl + F5.</p>
      </section>
    </main>
  `;
}

// ====================================================================
// PERMISOS POR ROL
// ====================================================================
window.PERMISOS = {
  admin:  ["home","pos","history","missing","clientes","products","categorias","compras","proveedores","descuentos","reports","users"],
  cajero: ["home","pos","history","missing","clientes"]
};

window.hasPermission = function(viewName) {
  const rol = state.rolActual || "cajero";
  let permitidos = window.PERMISOS[rol] || window.PERMISOS.cajero;
  
  if (state.usuarioActual && state.usuarioActual.permisos && Array.isArray(state.usuarioActual.permisos) && state.usuarioActual.permisos.length > 0) {
    permitidos = state.usuarioActual.permisos;
  }
  
  return permitidos.includes(viewName);
};

function aplicarPermisosPorRol() {
  const rol = state.rolActual || "cajero";

  document.querySelectorAll(".nav-link[data-view]").forEach(link => {
    const vista = link.dataset.view;
    link.style.display = hasPermission(vista) ? "" : "none";
  });


  if (rol !== "admin") {
    // Ocultar etiquetas de sección admin-only, pero mostrarlas si algún link hermano es visible.
    document.querySelectorAll(".admin-only:not(.nav-link)").forEach(sectionLabel => {
      let nextEl = sectionLabel.nextElementSibling;
      let hasVisibleLink = false;
      while (nextEl && nextEl.classList.contains("nav-link")) {
        if (nextEl.style.display !== "none") { hasVisibleLink = true; break; }
        nextEl = nextEl.nextElementSibling;
      }
      sectionLabel.style.display = hasVisibleLink ? "" : "none";
    });
  }

  // Info de usuario en header
  const userInfo = document.getElementById("user-info");
  if (userInfo && state.usuarioActual) {
    const isAdmin = rol === "admin";
    const badgeBg     = isAdmin ? "rgba(239,68,68,0.15)"  : "rgba(59,130,246,0.15)";
    const badgeColor  = isAdmin ? "#EF4444"                : "#3B82F6";
    const badgeBorder = isAdmin ? "rgba(239,68,68,0.35)"  : "rgba(59,130,246,0.35)";
    userInfo.innerHTML = `
      <span class="user-name">${state.usuarioActual.nombre}</span>
      <span class="user-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${rol}</span>
      <button class="btn-salir" onclick="logoutUser()">Salir</button>
    `;
  }
}

// ====================================================================
// EVENTOS — SIDEBAR TOGGLE
// ====================================================================
function inicializarEventos() {
  // ---- Nav links ----
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navigateTo(link.dataset.view);
      // En móvil, cerrar sidebar después de navegar
      if (window.innerWidth <= 768) {
        closeMobileSidebar();
      }
    });
  });

  // ---- Botón toggle del header ----
  const toggleBtn = document.getElementById("sidebar-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        // Mobile: drawer
        toggleMobileSidebar();
      } else {
        // Desktop: colapso
        toggleDesktopSidebar();
      }
    });
  }

  // ---- Overlay mobile ----
  const overlay = document.getElementById("sidebar-overlay");
  if (overlay) {
    overlay.addEventListener("click", closeMobileSidebar);
  }

  // ---- Modal ----
  const modalOverlay = document.querySelector(".modal-overlay");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });
    const modalClose = modalOverlay.querySelector(".modal-close");
    if (modalClose) modalClose.addEventListener("click", closeModal);
  }

  // ---- Tema ----
  const themeBtn = document.getElementById("theme-btn") || document.querySelector(".dark-mode-btn");
  if (themeBtn) {
    // Detectar preferencia: localStorage > prefers-color-scheme
    const savedDark = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedDark !== null ? savedDark === "true" : prefersDark;
    if (isDark) { document.body.classList.add("dark-mode"); themeBtn.textContent = "☀️"; }
    else { themeBtn.textContent = "🌙"; }
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isNowDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isNowDark);
      themeBtn.textContent = isNowDark ? "☀️" : "🌙";
    });
  }
}

function toggleDesktopSidebar() {
  document.body.classList.toggle("sidebar-collapsed");
  const isCollapsed = document.body.classList.contains("sidebar-collapsed");
  localStorage.setItem("sidebarCollapsed", isCollapsed);
  // Cambiar icono del toggle
  const btn = document.getElementById("sidebar-toggle");
  if (btn) btn.querySelector(".toggle-icon").textContent = isCollapsed ? "▶" : "☰";
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

// ====================================================================
// LOGOUT
// ====================================================================
function logoutUser() {
  clearAuthSession();
  state.usuarioActual = null;
  state.rolActual = null;
  state.logueado = false;
  location.reload();
}

// ====================================================================
// INICIALIZACIÓN PRINCIPAL
// ====================================================================
async function initializeApp() {
  // Mostrar la interfaz inmediatamente
  const sidebar = document.getElementById("sidebar");
  const header  = document.getElementById("header");
  const views   = document.getElementById("views-container");
  if (sidebar) sidebar.style.display = "flex";
  if (header)  header.style.display  = "flex";
  if (views)   views.style.display   = "block";

  try {
    showToast("Cargando datos...", "info");
    const success = await loadAllDataFromAPI();
    if (success) showToast("Bienvenido " + (state.usuarioActual?.nombre || "Usuario"), "success");
    else showToast("⚠️ Usando datos locales", "warning");
  } catch (error) {
    console.error("Error en inicialización:", error);
    showToast("Error iniciando aplicación", "error");
  }

  // Cargar ventas pausadas guardadas en localStorage
  cargarVentasAbiertas();


  // Restaurar estado del sidebar colapsado
  if (localStorage.getItem("sidebarCollapsed") === "true") {
    document.body.classList.add("sidebar-collapsed");
    const btn = document.getElementById("sidebar-toggle");
    if (btn) btn.querySelector(".toggle-icon").textContent = "▶";
  }

  inicializarEventos();
  aplicarPermisosPorRol();
  inicializarEventosLocalesTiempoReal();
  inicializarTiempoReal();
  navigateTo("home");

  // Iniciar auto-sincronización en segundo plano (cada 12 segundos)
  iniciarAutoSync();
}

function inicializarEventosLocalesTiempoReal() {
  if (window._localRealtimeInicializado) return;
  window._localRealtimeInicializado = true;
  window.addEventListener("pos:data-changed", () => {
    refrescarVistaActiva();
  });
}

function inicializarTiempoReal() {
  if (window._socketInicializado) return;
  window._socketInicializado = true;

  const backendUrl = CONFIG.API_URL.replace(/\/api\/?$/, "");
  const script = document.createElement("script");
  script.src = `${backendUrl}/socket.io/socket.io.js`;
  script.onload = () => {
    if (typeof io !== "function") return;
    const socket = io(backendUrl, { transports: ["websocket", "polling"] });
    window.posSocket = socket;

    ["product:created", "product:updated", "product:deleted", "inventory:changed", "sale:created", "sale:refunded", "sale:cancelled", "purchase:created"].forEach(eventName => {
      socket.on(eventName, async () => {
        await loadAllDataFromAPI(true);
        refrescarVistaActiva();
      });
    });
  };
  script.onerror = () => console.warn("No se pudo cargar Socket.IO. La app seguirá usando sincronización periódica.");
  document.head.appendChild(script);
}

function refrescarVistaActiva() {
  const vistaActiva = document.querySelector(".view.view--active");
  if (!vistaActiva) return;
  switch (vistaActiva.id) {
    case "view-products": renderProductList(); break;
    case "view-categorias": renderCategoriasList(); break;
    case "view-clientes": renderClientesList(); break;
    case "view-proveedores": renderProveedoresList(); break;
    case "view-compras": renderCompras(); break;
    case "view-history": renderSalesHistory(); break;
    case "view-users": renderUserManagement(); break;
    case "view-home": renderHome(); break;
    case "view-descuentos": renderDescuentosList(); break;
  }
}

// ====================================================================
// AUTO-SYNC EN TIEMPO REAL (FOND)
// ====================================================================
function iniciarAutoSync() {
  // Sincroniza cada 12 segundos sin recargar la página entera
  setInterval(async () => {
    // Si hay un pop-up/modal abierto (editando o creando algo), pausamos el sync para no interrumpir
    if (document.querySelector(".modal-overlay.active") || document.getElementById("modal-content").innerHTML !== "") {
      return;
    }

    try {
      console.log("⏱️ Auto-sincronizando (Background)...");
      const success = await loadAllDataFromAPI(true); // true = modo silencioso (no muestra logs fuertes)
      
      if (success) {
        // Encontramos qué pantalla está viendo el usuario actualmente
        const vistaActiva = document.querySelector(".view.view--active");
        if (vistaActiva) {
          // Re-dibujamos la pantalla sutilmente para mostrar los datos nuevos
          switch (vistaActiva.id) {
            case "view-products": renderProductList(); break;
            case "view-categorias": renderCategoriasList(); break;
            case "view-clientes": renderClientesList(); break;
            case "view-proveedores": renderProveedoresList(); break;
            case "view-compras": renderCompras(); break;
            case "view-history": renderSalesHistory(); break;
            case "view-users": renderUserManagement(); break;
            case "view-home": renderHome(); break;
            case "view-descuentos": renderDescuentosList(); break;
            // Omitimos view-pos a propósito para no borrarle el carrito al cajero
          }
        }
      }
    } catch (e) {
      console.warn("Auto-sync falló en este ciclo (Posible falta de internet)");
    }
  }, 4500); // 4.5 segundos para cumplir con el requerimiento de tiempo real (< 5s)
}
