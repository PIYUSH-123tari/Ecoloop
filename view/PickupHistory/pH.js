const pickupContainer = document.getElementById("pickupContainer");

// ── Toast Notification ────────────────────────────────────────────────────────
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  const colors = {
    success: "#2e7d32",
    error: "#c62828",
    info: "#01579b",
    warning: "#e65100"
  };

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: ${colors[type] || colors.info};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-size: 14px;
    min-width: 220px;
    max-width: 320px;
    opacity: 0;
    transform: translateX(40px);
    transition: all 0.3s ease;
    cursor: pointer;
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });

  const remove = () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    setTimeout(() => toast.remove(), 300);
  };

  toast.addEventListener("click", remove);
  setTimeout(remove, 4000);
}

// ── Auth Check ────────────────────────────────────────────────────────────────
const userId = localStorage.getItem("userId");

if (!userId) {
  showToast("Please login first", "warning");
  setTimeout(() => {
    window.location.href = "../register/register.html";
  }, 1500);
}

// ── Fetch Pickup History ──────────────────────────────────────────────────────
fetch(`http://localhost:5000/pickupHistory/user/${userId}`)
  .then(res => res.json())
  .then(data => {
    if (!data.length) {
      pickupContainer.innerHTML = "<p>No pickup requests found.</p>";
      return;
    }

    pickupContainer.innerHTML = "";

    data.forEach(pickup => {
      const card = document.createElement("div");
      card.className = "pickup-card";

      const isCollected = pickup.status === "collected";

      card.innerHTML = `
        <div class="card-clickable">
          ${pickup.image ? `<img src="http://localhost:5000${pickup.image}" />` : ""}

          <p><b>Created At:</b> ${new Date(pickup.createdAt).toLocaleString()}</p>
          <p><b>User Phone:</b> ${pickup.userPhone}</p>
          <p><b>Additional Phone:</b> ${pickup.additional_phone_no ? pickup.additional_phone_no : "-"}</p>
          <p><b>Category:</b> ${pickup.category ? pickup.category.category_name : "-"}</p>
          <p><b>Waste Description:</b> ${pickup.waste_description}</p>
          <p><b>Estimated Weight:</b> ${pickup.estimated_weight} kg</p>
          <p><b>Pickup Address:</b> ${pickup.pickup_address}</p>
          <p><b>Preferred Date:</b> ${new Date(pickup.preferred_date).toDateString()}</p>
          <p><b>Status:</b> <span class="status">${pickup.status}</span></p>
        </div>

        <div class="btn-group">
          <button class="edit-btn"
            ${isCollected ? "disabled title='Cannot edit a collected request'" : ""}
            onclick='${isCollected ? "" : `editPickup(${JSON.stringify(pickup)})`}'>
            ✏ Edit
          </button>
          <button class="delete-btn"
            ${isCollected ? "disabled title='Cannot delete a collected request'" : ""}
            onclick="${isCollected ? "" : `deletePickup('${pickup.pickupRequest_id}')`}">
            🗑 Delete
          </button>
        </div>
      `;

      // Click on the card body (not buttons) → open detail page
      const clickable = card.querySelector(".card-clickable");
      clickable.style.cursor = "pointer";
      clickable.addEventListener("click", () => {
        localStorage.setItem("viewPickup", JSON.stringify(pickup));
        window.location.href = "pickupDetail.html";
      });

      pickupContainer.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    pickupContainer.innerHTML = "<p>Error loading pickup requests.</p>";
  });


// ── Edit Pickup ───────────────────────────────────────────────────────────────
function editPickup(pickup) {
  localStorage.setItem("editPickup", JSON.stringify(pickup));
  localStorage.setItem("editingPickupId", pickup.pickupRequest_id);
  window.location.href = "../PickupForm/form.html";
}


// ── Delete Pickup ─────────────────────────────────────────────────────────────
function deletePickup(pickupId) {
  if (!confirm("Are you sure you want to delete this pickup request?")) return;

  fetch(`http://localhost:5000/pickup/delete/${pickupId}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      showToast(data.message, "success");
      setTimeout(() => location.reload(), 1500);
    })
    .catch(err => {
      showToast("Delete failed. Please try again.", "error");
      console.error(err);
    });
}