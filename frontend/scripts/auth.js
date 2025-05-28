const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
  document.querySelector(".toggle-left").style.display = "none";
  document.querySelector(".toggle-right").style.display = "flex";
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
  document.querySelector(".toggle-left").style.display = "flex";
  document.querySelector(".toggle-right").style.display = "none";
});

const BASE_URL = "http://localhost:5000/api";

// Register user
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = registerForm.querySelector(
    "input[type='text'][placeholder='Username']"
  ).value;
  const email = registerForm.querySelector("input[type='email']").value;
  const password = registerForm.querySelector("input[type='password']").value;

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
    } else {
      alert(data.msg || "Registration failed");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Registration failed");
  }
});

// Login user
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector("input[type='email']").value;
  const password = loginForm.querySelector("input[type='password']").value;

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
    } else {
      alert(data.msg || "Login failed");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Login failed");
  }
});
