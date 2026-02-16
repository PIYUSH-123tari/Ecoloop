

// Regex Validations
const emailRegex = /^[a-zA-Z0-9._%-]+@gmail\.com$/;
const phoneRegex = /^\d{10}$/;

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
document.getElementById("loginForm").addEventListener("submit",async function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Validate email
  if (!emailRegex.test(email)) {
    alert("Email must end with @gmail.com");
    return;
  }
  const authData={
    email:email,
    password:password
  }
try {
  const response = await fetch("http://localhost:5000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(authData)
  });

  const data = await response.json();
  alert(data.message);
  if(response.ok){
    // ✅ STORE userId on login
  localStorage.setItem("userId", data.user.userId);
  localStorage.setItem("userName", data.user.name);
  localStorage.setItem("region_Id", data.user.region_Id);
    window.location.href="../Homepage/hp.html";
  }
}catch(error){
  alert("Error logging in: " + error.message);
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
    alert("Email must end with @gmail.com");
    return;
  }

  // Validate phone number
  if (!phoneRegex.test(phone)) {
    alert("Phone number must be exactly 10 digits");
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
 alert(data.message);
  if (response.ok) {
    // ✅ STORE userId
  localStorage.setItem("userId", data.user.userId);

  // optional: store name/email
  localStorage.setItem("userName", data.user.name);
  localStorage.setItem("region_Id",data.user.region_Id);
    window.location.href = "../Homepage/hp.html";
  } else {
    alert(data.message);
  }
}
catch(error){
  alert("Error registering user: " + error.message);
}
});

