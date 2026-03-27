// ============================================
// AUTH GUARD — Protects all routes
// Include this script BEFORE the page's own JS
// ============================================
function checkAuth() {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const isLoginPage = window.location.pathname.includes("/register/");
  const isHomePage = window.location.pathname.includes("/hp.html");

  if (!userId || !token) {
    if (!isLoginPage && !isHomePage) {
      // Clear any stale data
      sessionStorage.clear();
      // Redirect to login page
      const depth = window.location.pathname.split("/view/")[1];
      const parts = depth ? depth.split("/").filter(Boolean) : [];
      const prefix = parts.length > 1 ? "../".repeat(parts.length - 1) : "../";
      window.location.replace(prefix + "register/register.html");
    }
  } else {
    // User IS logged in. If they try to go back to the login page via back button,
    // force them back to the homepage.
    if (isLoginPage) {
      window.location.replace("../Homepage/hp.html");
    }
  }
}

// Run immediately on normal load
checkAuth();

// Run when the page is restored from Back/Forward Cache (BFCache)
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    checkAuth();
  }
});

// --- Idle Timeout Logic ---
const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes
let idleTimeout;

function resetIdleTimeout() {
  clearTimeout(idleTimeout);
  if (sessionStorage.getItem("userId") && sessionStorage.getItem("token")) {
    idleTimeout = setTimeout(handleIdleTimeout, IDLE_TIMEOUT_MS);
  }
}

async function handleIdleTimeout() {
  // Check if the current page has defined an auto-save hook
  if (typeof window.onIdleAutoSave === "function") {
    try {
      await window.onIdleAutoSave();
    } catch (err) {
      console.error("Auto-save function threw an error:", err);
    }
  }
  
  // Clear session and redirect to login
  sessionStorage.clear();
  
  alert("Your session expired. Please log in.");

  const isLoginPage = window.location.pathname.includes("/register/");
  const isHomePage = window.location.pathname.includes("/hp.html");
  
  if (!isLoginPage && !isHomePage) {
    const depth = window.location.pathname.split("/view/")[1];
    const parts = depth ? depth.split("/").filter(Boolean) : [];
    const prefix = parts.length > 1 ? "../".repeat(parts.length - 1) : "../";
    window.location.replace(prefix + "register/register.html");
  }
}

// Reset timer on user interaction
["mousemove", "keydown", "scroll", "touchstart", "click"].forEach(event => {
  window.addEventListener(event, resetIdleTimeout);
});

// Initialize timer
resetIdleTimeout();
