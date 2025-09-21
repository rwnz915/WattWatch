// login.js
// Handles sign-in logic + auto-login + remember me

// Elements
let loginEmailInput = document.getElementById("exampleInputEmail");
let loginPasswordInput = document.getElementById("exampleInputPassword");
let loginBtn = document.getElementById("loginBtn");
let rememberMeInput = document.getElementById("customCheck"); // checkbox element

// ----------------- AUTO-LOGIN -----------------
window.addEventListener("DOMContentLoaded", () => {
  try {
    const user = getUserInfo();
    if (user && user.page) {
      // Optional: check server is up before redirect
      fetch("https://wattwatch-backend.onrender.com/health/ping")
        .then(resp => {
          if (!resp.ok) throw new Error("server not reachable");
          // If server OK, redirect directly
          window.location.href = user.page;
        })
        .catch(err => {
          console.warn("Auto-login skipped:", err);
        });
    }

    // Pre-fill email from remembered localStorage
    const saved = localStorage.getItem("userInfo");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.email) {
          loginEmailInput.value = u.email;
          if (rememberMeInput) rememberMeInput.checked = true;
        }
      } catch {}
    }
  } catch (err) {
    console.error("Auto-login error:", err);
  }
});

// ----------------- SIGN-IN -----------------
async function signIn() {
  const loginEmail = loginEmailInput.value.trim();
  const loginPassword = loginPasswordInput.value.trim();

  if (!loginEmail || !loginPassword) {
    showMessage("Please fill in all fields");
    return;
  }

  try {
    const response = await fetch("https://wattwatch-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    });

    const data = await response.json();

    if (response.ok) {
      const userData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        page: data.page
      };

      // Store user info depending on Remember Me checkbox
      setUserInfo(userData, rememberMeInput && rememberMeInput.checked);

      // ---------------- LOAD SETTINGS BEFORE NAVIGATION ----------------
      if (typeof loadSettings === "function") {
        try {
          await loadSettings();  // ensures theme is applied from backend
        } catch (err) {
          console.warn("Failed to load settings after login:", err);
        }
      }

      // Navigate to the user page after settings applied
      if (data.page) {
        window.location.href = data.page;
      }

    } else {
      showMessage(data.message || "Incorrect email or password");
    }
  } catch (err) {
    showMessage("Server error. Please try again later.");
    console.error(err);
  }
}

loginBtn.addEventListener("click", signIn);
