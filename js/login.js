const originalFetch = window.fetch;
window.fetch = async function (...args) {
  NProgress.start();
  try {
    const res = await originalFetch(...args);
    return res;
  } finally {
    NProgress.done();
  }
};

let loginEmailInput = document.getElementById("exampleInputEmail");
let loginPasswordInput = document.getElementById("exampleInputPassword");
let loginBtn = document.getElementById("loginBtn");
let rememberMeInput = document.getElementById("customCheck"); // checkbox element
let googleLoginBtn = document.getElementById("googleLoginBtn"); // Google button

loginPasswordInput.maxLength = 16;


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

async function initializeUpdate(userId) {
    //console.log("Initializing...");
    AppState.setElectricityRate(13.32);

    try {
        if (typeof ensureMonthRollover === "function") {
            await ensureMonthRollover();
        }
    } catch (err) {
        console.warn("⚠️ ensureMonthRollover failed:", err);
    }

    try {
        if (typeof loadCurrentAndHistory === "function") {
            await loadCurrentAndHistory();
        }
    } catch (err) {
        console.warn("⚠️ loadCurrentAndHistory failed:", err);
    }

    try {
        if (typeof loadSettings === "function") {
            await loadSettings();
        }
    } catch (err) {
        console.warn("⚠️ loadSettings failed:", err);
    }

    try {
        if (typeof updateAppStateGoals === "function") {
            await updateAppStateGoals(userId);
        }
    } catch (err) {
        console.warn("⚠️ updateAppStateGoals failed:", err);
    }

    try {
        if (typeof updateAppStateCalculations === "function") {
            await updateAppStateCalculations(userId);
        }
    } catch (err) {
        console.warn("⚠️ updateAppStateCalculations failed:", err);
    }

    //console.log("initialization complete.");
}

// ----------------- AUTO-LOGIN -----------------
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const user = getUserInfo();
    if (user && user.id) {
      try {
        const resp = await fetch("https://wattwatch-backend.onrender.com/health/ping");
        if (!resp.ok) throw new Error("server not reachable");

        initializeUpdate(user.id);

        if (user.page) {
          window.location.href = user.page;
        }

      } catch (err) {
        console.warn("Auto-login skipped (server offline):", err);
      }
    }

    // Autofill email from remember me
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
        page: data.page,
        isGoogleUser: data.isGoogleUser ?? false,
        createdAt: data.createdAt ?? null,
        profileImage: data.profileImage ?? "img/undraw_profile.svg"
      };

      setUserInfo(userData, rememberMeInput && rememberMeInput.checked);

      initializeUpdate(data.id);

      if (data.page) window.location.href = data.page;

    } else {
      showMessage(/*data.message ||*/ "Incorrect email or password");
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
