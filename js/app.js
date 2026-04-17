document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Iniciando aplicación...");

  const usuarioGuardado = localStorage.getItem("usuarioActual");
  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    state.usuarioActual = usuario;
    state.rolActual = usuario.rol;
    state.logueado = true;
    initializeApp();
  } else {
    mostrarPantallaLogin();
  }
});

// ====================================================================
// PERMISOS POR ROL
// ====================================================================
window.PERMISOS = {
  admin:  ["home","pos","history","missing","clientes","products","categorias","compras","proveedores","reports","users"],
  cajero: ["home","pos","history","missing","clientes"]
};

function aplicarPermisosPorRol() {
  const rol = state.rolActual || "cajero";
  let permitidos = window.PERMISOS[rol] || window.PERMISOS.cajero;
  
  if (state.usuarioActual && state.usuarioActual.permisos && Array.isArray(state.usuarioActual.permisos)) {
    permitidos = state.usuarioActual.permisos;
  }

  document.querySelectorAll(".nav-link[data-view]").forEach(link => {
    const vista = link.dataset.view;
    link.style.display = permitidos.includes(vista) ? "" : "none";
  });

  if (rol !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
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
    const isLight = localStorage.getItem("lightMode") === "true";
    if (isLight) { document.body.classList.add("light-mode"); themeBtn.textContent = "☀️"; }
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const isNowLight = document.body.classList.contains("light-mode");
      localStorage.setItem("lightMode", isNowLight);
      themeBtn.textContent = isNowLight ? "☀️" : "🌙";
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
  localStorage.removeItem("usuarioActual");
  state.usuarioActual = null;
  state.rolActual = null;
  state.logueado = false;
  location.reload();
}

// ====================================================================
// INICIALIZACIÓN PRINCIPAL
// ====================================================================
async function initializeApp() {
  try {
    showToast("Cargando datos...", "info");
    const success = await loadAllDataFromAPI();
    if (success) showToast("Bienvenido " + state.usuarioActual.nombre, "success");
    else showToast("⚠️ Usando datos locales", "warning");
  } catch (error) {
    console.error("Error en inicialización:", error);
    showToast("Error iniciando aplicación", "error");
  }

  // Mostrar la app
  const sidebar = document.getElementById("sidebar");
  const header  = document.getElementById("header");
  const views   = document.getElementById("views-container");
  if (sidebar) sidebar.style.display = "flex";
  if (header)  header.style.display  = "flex";
  if (views)   views.style.display   = "block";

  // Restaurar estado del sidebar colapsado
  if (localStorage.getItem("sidebarCollapsed") === "true") {
    document.body.classList.add("sidebar-collapsed");
    const btn = document.getElementById("sidebar-toggle");
    if (btn) btn.querySelector(".toggle-icon").textContent = "▶";
  }

  inicializarEventos();
  aplicarPermisosPorRol();
  navigateTo("home");

  // Iniciar auto-sincronización en segundo plano (cada 12 segundos)
  iniciarAutoSync();
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
            // Omitimos view-pos a propósito para no borrarle el carrito al cajero
          }
        }
      }
    } catch (e) {
      console.warn("Auto-sync falló en este ciclo (Posible falta de internet)");
    }
  }, 4500); // 4.5 segundos para cumplir con el requerimiento de tiempo real (< 5s)
}