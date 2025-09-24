let loginEmailInput = document.getElementById("exampleInputEmail");
let loginPasswordInput = document.getElementById("exampleInputPassword");
let loginBtn = document.getElementById("loginBtn");
let rememberMeInput = document.getElementById("customCheck"); // checkbox element
let googleLoginBtn = document.getElementById("googleLoginBtn"); // Google button


// ----------------- PASSWORD TOGGLE -----------------
const passwordToggle = document.createElement("span");
passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
passwordToggle.style.cursor = "pointer";
passwordToggle.style.position = "absolute";
passwordToggle.style.right = "20px";
passwordToggle.style.top = "50%";
passwordToggle.style.transform = "translateY(-50%)";
passwordToggle.style.color = "#6c757d";
loginPasswordInput.parentElement.style.position = "relative";
loginPasswordInput.parentElement.appendChild(passwordToggle);

passwordToggle.addEventListener("click", () => {
    if (loginPasswordInput.type === "password") {
        loginPasswordInput.type = "text";
        passwordToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        loginPasswordInput.type = "password";
        passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

// ----------------- AUTO-LOGIN -----------------
window.addEventListener("DOMContentLoaded", () => {
  try {
    const user = getUserInfo();
    if (user && user.page) {
      fetch("https://wattwatch-backend.onrender.com/health/ping")
        .then(resp => {
          if (!resp.ok) throw new Error("server not reachable");
          window.location.href = user.page;
        })
        .catch(err => console.warn("Auto-login skipped:", err));
    }

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

      setUserInfo(userData, rememberMeInput && rememberMeInput.checked);

      if (typeof loadSettings === "function") {
        try { await loadSettings(); } catch (err) { console.warn("Failed to load settings after login:", err); }
      }

      if (typeof updateAppStateGoals === "function") {
          try { await updateAppStateGoals(data.id); } catch (err) { 
              console.warn("Failed to update AppState after login:", err); 
          }
      }

      if (typeof updateAppStateCalculations === "function") {
          try { await updateAppStateCalculations(data.id); } catch (err) { 
              console.warn("Failed to update AppState after login:", err); 
          }
      }

      if (data.page) window.location.href = data.page;

    } else {
      showMessage(data.message || "Incorrect email or password");
    }
  } catch (err) {
    showMessage("Server error. Please try again later.");
    console.error(err);
  }
}

loginBtn.addEventListener("click", signIn);

// Make Enter key trigger login
[loginEmailInput, loginPasswordInput].forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            loginBtn.click();
        }
    });
});

// ----------------- GOOGLE LOGIN -----------------
googleLoginBtn.addEventListener("click", () => {
  const clientId = "988525355387-trr9q5aoejn7l83o822mk6689g85j87m.apps.googleusercontent.com";
  const redirectUri = "https://watt-watch.vercel.app/google-callback.html";
  const scope = "openid profile email";
  const responseType = "code";
  const prompt = "select_account";

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&prompt=${prompt}`;


  window.location.href = oauthUrl;
});
