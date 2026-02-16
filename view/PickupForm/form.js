const userId = localStorage.getItem("userId");
const region_Id = localStorage.getItem("region_Id");
const imageInput = document.querySelector("input[name='image']");
const editData = localStorage.getItem("editPickup");
const editingPickupId = localStorage.getItem("editingPickupId");

if (!userId || !region_Id) {
  alert("User not logged in properly");
  window.location.href = "../register/register.html";
}

const heading = document.getElementById("formHeading");
const backBtn = document.getElementById("backBtn");

if (editingPickupId) {
  // Update mode
  heading.textContent = "Update Pickup Request";

  backBtn.disabled = true;
  backBtn.style.opacity = "0.5";
  backBtn.style.cursor = "not-allowed";
  backBtn.onclick = null; // disable navigation
   imageInput.required = false;

}
else{
  imageInput.required = true;//for create mode
}


// 🔁 Pre-fill form if editing
if (editData) {
  const pickup = JSON.parse(editData);

  document.querySelector("[name='phone']").value = pickup.phone;
  document.querySelector("[name='waste_type']").value = pickup.waste_type;
  document.querySelector("[name='estimated_weight']").value = pickup.estimated_weight;
  document.querySelector("[name='pickup_address']").value = pickup.pickup_address;
  document.querySelector("[name='preferred_date']").value =
    pickup.preferred_date.split("T")[0];
}

// 🔁 Decide URL + METHOD
const url = editingPickupId
  ? `http://localhost:5000/pickup/update/${editingPickupId}`
  : "http://localhost:5000/pickup/create";


const method = editingPickupId ? "PUT" : "POST";

document.getElementById("pickupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  formData.append("userId", userId);
  formData.append("region_Id", region_Id);

  try {
    const res = await fetch(url, {
      method,
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    alert(data.message);

    localStorage.removeItem("editPickup");
    localStorage.removeItem("editingPickupId");
    e.target.reset();
    window.location.href = "../PickupHistory/pH.html";

  } catch (err) {
    console.error(err);
    alert("Server not reachable");
  }
});
