document.addEventListener("DOMContentLoaded", async () => {
  const backBtn = document.getElementById("backBtn");

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in");
    return;
  }

  const nameInput = document.querySelector("input[type='text']");
  const emailInput = document.querySelector("input[type='email']");
  const phoneInput = document.querySelector("input[type='tel']");
  const regionText = document.getElementById("regionText");
  const regionSelect = document.getElementById("regionSelect");
  const rewardBalanceInput = document.getElementById("rewardBalanceInput"); // ✅ NEW

  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");

  const uploadBtn = document.getElementById("uploadBtn");
  const photoInput = document.getElementById("photoInput");

  // FETCH USER
  const response = await fetch(`http://localhost:5000/userProfile/${userId}`);
  const user = await response.json();

  nameInput.value = user.name || "";
  emailInput.value = user.email || "";
  phoneInput.value = user.phone || "";
  regionText.value = user.region_name || "";
  regionSelect.value = user.region_Id || "";

  // ✅ NEW: Display reward balance (always read-only)
  rewardBalanceInput.value = `₹${(user.reward_balance || 0).toFixed(2)}`;

  // FETCH ALL REGIONS
  const regionRes = await fetch("http://localhost:5000/users/regions");
  const regions = await regionRes.json();

  regionSelect.innerHTML = "";
  regions.forEach(region => {
    const option = document.createElement("option");
    option.value = region._id;
    option.textContent = region.region_name;
    regionSelect.appendChild(option);
  });

  // Set selected region AFTER options created
  regionSelect.value = user.region_Id || "";

  if (user.photo) {
    document.querySelector(".avatar").src =
      `http://localhost:5000/uploads/${user.photo}`;
  }

  // SET READONLY INITIALLY
  setReadOnly(true);

  function setReadOnly(state) {
    nameInput.readOnly = state;
    emailInput.readOnly = state;
    phoneInput.readOnly = state;
    regionText.readOnly = true;
    rewardBalanceInput.readOnly = true; // ✅ ALWAYS read-only, never changes

    if (state) {
      regionSelect.style.display = "none";
      regionText.style.display = "block";
      uploadBtn.style.display = "none";
      saveBtn.style.display = "none";
      editBtn.style.display = "inline-block";
      backBtn.style.display = "inline-block";
    } else {
      regionSelect.style.display = "block";
      regionText.style.display = "none";
      uploadBtn.style.display = "inline-block";
      saveBtn.style.display = "inline-block";
      editBtn.style.display = "none";
      backBtn.style.display = "none";
    }
  }

  // EDIT CLICK
  editBtn.addEventListener("click", () => {
    setReadOnly(false);
  });

  // Upload Button
  uploadBtn.addEventListener("click", () => {
    photoInput.click();
  });

  // SAVE CLICK
  saveBtn.addEventListener("click", async () => {

    const formData = new FormData();
    formData.append("name", nameInput.value);
    formData.append("email", emailInput.value);
    formData.append("phone", phoneInput.value);
    formData.append("region_Id", regionSelect.value);

    if (photoInput.files[0]) {
      formData.append("photo", photoInput.files[0]);
    }

    const res = await fetch(`http://localhost:5000/userProfile/${userId}`, {
      method: "PUT",
      body: formData
    });

    if (res.ok) {
      const updated = await res.json();

      localStorage.setItem("region_Id", updated.user.region_Id);
      localStorage.setItem("region_name", updated.user.region_name);

      // ✅ NEW: Refresh reward balance after save too
      rewardBalanceInput.value = `₹${(updated.user.reward_balance || 0).toFixed(2)}`;

      alert("Profile Updated Successfully");
      location.reload();

    } else {
      alert("Update Failed");
    }
  });

});

backBtn.addEventListener("click", () => {
  window.location.href = "../Homepage/hp.html";
});