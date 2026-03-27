const navLinks = document.getElementById("navLinks");
const heroButtons = document.getElementById("heroButtons");
const hamburgerBtn = document.getElementById("hamburgerBtn");

// Hamburger menu toggle
hamburgerBtn.addEventListener("click", () => {
  navLinks.classList.toggle("nav-open");
  hamburgerBtn.classList.toggle("active");
});

const userId = sessionStorage.getItem("userId");

if (userId) {

  // ✅ LOGOUT ON BACK BUTTON
  // Push a dummy state so the back button fires a popstate event, instead of actually leaving.
  history.pushState(null, null, window.location.href);

  window.addEventListener('popstate', async function(event) {
    // If popstate fires, the user clicked "Back". We log them out entirely.
    const token = sessionStorage.getItem("token");
    sessionStorage.clear();

    try {
      if (token) {
        await fetch("http://localhost:5000/users/logout", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        });
      }
    } catch (e) {
      console.warn("Logout request failed during back navigation", e);
    }

    // Redirect to login page
    window.location.replace("../register/register.html");
  });

  // =========================
  // ✅ AFTER LOGIN
  // =========================

  navLinks.innerHTML = `
    <a href="../PickupForm/form.html">Request Pickup</a>
    <a href="../PickupHistory/pH.html">View Pickup History</a>
    <a href="../userProfile/userProfile.html">User Profile</a>
    <a href="#" id="logoutBtn" class="nav-btn">Logout</a>
  `;

  heroButtons.innerHTML = `
    <a href="../PickupForm/form.html" class="btn-primary">
      Request E-Waste Pickup <i class="fa-solid fa-arrow-right"></i>
    </a>
  `;

  // Logout logic
  document.getElementById("logoutBtn").addEventListener("click", async function (e) {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    sessionStorage.clear();

    const response = await fetch("http://localhost:5000/users/logout", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (response.ok) {
      // Use replace so home page is removed from history (no forward button back)
      window.location.replace("../register/register.html");
    }
  });

} else {

  // =========================
  // ❌ BEFORE LOGIN
  // =========================

  navLinks.innerHTML = `
    <a href="../register/register.html" class="nav-btn">Register</a>
  `;

  heroButtons.innerHTML = `
    <a href="../register/register.html" class="btn-primary">
      Request E-Waste Pickup <i class="fa-solid fa-arrow-right"></i>
    </a>

    <a href="../register/register.html" class="btn-secondary">
      Register
    </a>
  `;
}
