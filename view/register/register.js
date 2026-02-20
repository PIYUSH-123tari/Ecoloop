
// ✅ LOAD REGIONS FROM BACKEND
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:5000/users/regions");
    const regions = await response.json();

    const regionSelect = document.getElementById("region_Id");

    regions.forEach(region => {
      const option = document.createElement("option");
      option.value = region._id; // ✅ STORE OBJECTID
      option.textContent = region.region_name;
      regionSelect.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading regions:", error);
  }
});

// Regex Validations
const emailRegex = /^[a-zA-Z0-9._%-]+@gmail\.com$/;
const phoneRegex = /^[6-9]\d{9}$/;
// ✅ Strong Password Validation (NEW CODE)
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

// Toggle between Login and Sign Up forms
function toggleForm(formType) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  document.getElementById("loginTab")?.classList.toggle("active", formType === "login");
document.getElementById("signupTab")?.classList.toggle("active", formType === "signup");


  if (formType === "login") {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  } else {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  }
}


  function togglePassword(inputId, eye) {
    const input = document.getElementById(inputId);

    if (input.type === "password") {
      input.type = "text";
      eye.textContent = "🙈";
    } else {
      input.type = "password";
      eye.textContent = "👁";
    }
  }



// Handle Login
document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Validate email
  if (!emailRegex.test(email)) {
    showToast("Email must end with @gmail.com", "error");
    return;
  }

  const authData = { email, password };

  try {
    const response = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(authData)
    });

    const data = await response.json();

    if (response.ok) {
      showToast("Login Successful!", "success");

      localStorage.setItem("userId", data.user.userId);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userPhone", data.user.phone); // ✅ NEW
    localStorage.setItem("region_Id", data.user.region_Id);
localStorage.setItem("region_name", data.user.region_name); // ✅ NEW

      setTimeout(() => {
        window.location.href = "../Homepage/hp.html";
      }, 2000);

    } else {
      showToast(data.message, "error");
    }

  } catch (error) {
    showToast("Error logging in: " + error.message, "error");
  }
});



// Handle Sign Up
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const phone = document.getElementById("phoneNo").value;
  const password = document.getElementById("registerPassword").value;
   const region_Id = document.getElementById("region_Id").value;

  // Validate email
  if (!emailRegex.test(email)) {
   showToast("Email must end with @gmail.com", "error");
    return;
  }

  // Validate phone number
  if (!phoneRegex.test(phone)) {
  showToast("Enter valid Indian mobile number (10 digits starting with 6-9)", "error");
  return;
}

// Prevent all same digits
if (/^(\d)\1{9}$/.test(phone)) {
  showToast("Invalid phone number", "error");
  return;
}

// Prevent too many repeating digits
if (/(\d)\1{5,}/.test(phone)) {
  showToast("Phone number looks invalid", "error");
  return;
}


  

if (!strongPasswordRegex.test(password)) {
  showToast("Password is not strong enough!", "error");

  return;
}


  const userData = {
    name: name,
    email: email,
    phone: phone,
    password: password,
    region_Id: region_Id
  };
try {
  const response = await fetch("http://localhost:5000/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

 if (response.ok) {
  showToast("Account Created Successfully! Please Login.", "success");

  // Clear form
  document.getElementById("signupForm").reset();

  // Switch to login form
  setTimeout(() => {
    toggleForm("login");
  }, 2000);
} else {
    showToast(data.message, "error");
  }
}
catch(error){
 showToast("Error registering user: " + error.message, "error");
}
});

/* ===== LIVE PASSWORD VALIDATION ===== */

const passwordInput = document.getElementById("registerPassword");

passwordInput.addEventListener("input", function () {
  const value = passwordInput.value;

  const lengthRule = document.getElementById("lengthRule");
  const upperRule = document.getElementById("upperRule");
  const lowerRule = document.getElementById("lowerRule");
  const numberRule = document.getElementById("numberRule");
  const specialRule = document.getElementById("specialRule");

  // Minimum 8 characters
  if (value.length >= 8) {
    lengthRule.classList.add("valid");
    lengthRule.innerHTML = "✔ At least 8 characters";
  } else {
    lengthRule.classList.remove("valid");
    lengthRule.innerHTML = "❌ At least 8 characters";
  }

  // Uppercase letter
  if (/[A-Z]/.test(value)) {
    upperRule.classList.add("valid");
    upperRule.innerHTML = "✔ At least 1 uppercase letter";
  } else {
    upperRule.classList.remove("valid");
    upperRule.innerHTML = "❌ At least 1 uppercase letter";
  }

  // Lowercase letter
  if (/[a-z]/.test(value)) {
    lowerRule.classList.add("valid");
    lowerRule.innerHTML = "✔ At least 1 lowercase letter";
  } else {
    lowerRule.classList.remove("valid");
    lowerRule.innerHTML = "❌ At least 1 lowercase letter";
  }

  // Number
  if (/[0-9]/.test(value)) {
    numberRule.classList.add("valid");
    numberRule.innerHTML = "✔ At least 1 number";
  } else {
    numberRule.classList.remove("valid");
    numberRule.innerHTML = "❌ At least 1 number";
  }

  // Special character
  if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    specialRule.classList.add("valid");
    specialRule.innerHTML = "✔ At least 1 special character";
  } else {
    specialRule.classList.remove("valid");
    specialRule.innerHTML = "❌ At least 1 special character";
  }
});


function showToast(message, type) {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}

