let loginEmailInput = document.getElementById("exampleInputEmail");
let loginPasswordInput = document.getElementById("exampleInputPassword");
let loginBtn = document.getElementById("loginBtn");
let rememberMeInput = document.getElementById("customCheck"); // checkbox element
let googleLoginBtn = document.getElementById("googleLoginBtn"); // Google button

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

// ----------------- GOOGLE LOGIN -----------------
googleLoginBtn.addEventListener("click", () => {
  google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
    callback: handleGoogleCredentialResponse
  });
  google.accounts.id.prompt(); // triggers Google One Tap / popup
});

async function handleGoogleCredentialResponse(response) {
  try {
    const res = await fetch("https://wattwatch-backend.onrender.com/api/auth/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential })
    });
    const data = await res.json();

    if (data.success) {
      const userData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        page: data.page
      };
      setUserInfo(userData, true); // always remember Google login

      if (typeof loadSettings === "function") {
        try { await loadSettings(); } catch (err) { console.warn("Failed to load settings after Google login:", err); }
      }

      if (data.page) window.location.href = data.page;
    } else {
      showMessage(data.message || "Google login failed");
    }
  } catch (err) {
    showMessage("Google login failed. Please try again later.");
    console.error(err);
  }
}

