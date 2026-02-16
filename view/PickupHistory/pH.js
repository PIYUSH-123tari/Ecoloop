const pickupContainer = document.getElementById("pickupContainer");

// 1️⃣ Get userId
const userId = localStorage.getItem("userId");

if (!userId) {
  alert("Please login first");
  window.location.href = "../register/register.html";
}

// 2️⃣ Fetch pickup history
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

      card.innerHTML = `
        ${pickup.image ? `<img src="http://localhost:5000${pickup.image}" class="pickup-img" />` : ""}

        <p><b>Phone:</b> ${pickup.phone}</p>
        <p><b>Waste Type:</b> ${pickup.waste_type}</p>
        <p><b>Estimated Weight:</b> ${pickup.estimated_weight} kg</p>
        <p><b>Pickup Address:</b> ${pickup.pickup_address}</p>
        <p><b>Preferred Date:</b> ${new Date(pickup.preferred_date).toDateString()}</p>
        <p><b>Status:</b> <span class="status">${pickup.status}</span></p>

        <div class="btn-group">
          <button class="edit-btn" onclick='editPickup(${JSON.stringify(pickup)})'>
            ✏ Edit
          </button>

          <button class="delete-btn" onclick="deletePickup('${pickup.pickupRequest_id}')">
            🗑 Delete
          </button>
        </div>
      `;

      pickupContainer.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    pickupContainer.innerHTML = "<p>Error loading pickup requests.</p>";
  });


// ✏ EDIT PICKUP
function editPickup(pickup) {
  // store complete pickup object
  localStorage.setItem("editPickup", JSON.stringify(pickup));
  localStorage.setItem("editingPickupId", pickup.pickupRequest_id);

  // redirect to form
  window.location.href = "../PickupForm/form.html";
}


// 🗑 DELETE PICKUP
function deletePickup(pickupId) {
  if (!confirm("Are you sure you want to delete this pickup request?")) return;

  fetch(`http://localhost:5000/pickup/delete/${pickupId}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload(); // refresh list
    })
    .catch(err => {
      alert("Delete failed");
      console.error(err);
    });
}
