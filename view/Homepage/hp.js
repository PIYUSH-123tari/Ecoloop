const btn = document.getElementById("btn");

btn.addEventListener("click", async function (e) {
  e.preventDefault();

  // 🔥 CLEAR localStorage
  localStorage.clear();

  const response = await fetch("http://localhost:5000/users/logout", {
    method: "GET"
  });

  const data = await response.json();
  alert(data.message);
  
  if (response.ok) {
    window.location.href = "../register/register.html";
  }
});
