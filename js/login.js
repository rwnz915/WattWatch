// -------------------- FETCH WRAPPER FOR NPROGRESS --------------------
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

// -------------------- ELEMENTS --------------------
const loginEmailInput = document.getElementById("exampleInputEmail");
const loginPasswordInput = document.getElementById("exampleInputPassword");
const loginBtn = document.getElementById("loginBtn");
const rememberMeInput = document.getElementById("customCheck");
const googleLoginBtn = document.getElementById("googleLoginBtn");

loginPasswordInput.maxLength = 16;

// -------------------- PASSWORD TOGGLE --------------------
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

// -------------------- PAGE CACHE --------------------
const pageCache = {};

async function preloadPages(pages = []) {
  const promises = pages.map(async (page) => {
    try {
      const response = await fetch(page);
      if (!response.ok) throw new Error("Page not found: " + page);
      const html = await response.text();
      pageCache[page] = html;
    } catch (err) {
      console.warn("Failed to preload page:", page, err);
    }
  });
  await Promise.all(promises);
}

// -------------------- APPSTATE INITIALIZATION --------------------
async function initializeAppState(userId) {
  AppState.clearCalculator();
  AppState.clearGoals();
  AppState.setElectricityRate(13.47);

  try { if (typeof ensureMonthRollover === "function") await ensureMonthRollover(); } catch (err) { console.warn(err); }
  try { if (typeof loadCurrentAndHistory === "function") await loadCurrentAndHistory(); } catch (err) { console.warn("⚠ loadCurrentAndHistory failed:", err); }
  try { if (typeof loadSettings === "function") await loadSettings(); } catch (err) { console.warn("⚠ loadSettings failed:", err); }
  try { if (typeof updateAppStateGoals === "function") await updateAppStateGoals(userId); } catch (err) { console.warn("⚠ updateAppStateGoals failed:", err); }
  try { if (typeof updateAppStateCalculations === "function") await updateAppStateCalculations(userId); } catch (err) { console.warn("⚠ updateAppStateCalculations failed:", err); }
}

// -------------------- LOAD DASHBOARD --------------------
async function renderDashboardPage() {
  if (typeof loadPage !== "function") {
    console.warn("loadPage is not defined yet. Delaying dashboard render.");
    return;
  }
  window.location.href ="pages/dashboard.html";
}

// -------------------- AUTO-LOGIN --------------------
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const user = getUserInfo();
    if (user && user.id) {
      try {
        const resp = await fetch("https://wattwatch-backend.onrender.com/health/ping");
        if (!resp.ok) throw new Error("server not reachable");

        // Preload all pages first
        await preloadPages([
          "pages/dashboard.html",
          "pages/calculator.html",
          "pages/goals.html",
          "pages/history.html",
          "pages/profile.html",
          "pages/activity_log.html"
        ]);

        // Load AppState first
        await initializeAppState(user.id);

        // Then render dashboard
        await renderDashboardPage();

        // Navigate to last saved page if different
        if (user.page && user.page !== "pages/dashboard.html") {
          await loadPage(user.page);
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

// -------------------- SIGN-IN --------------------
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

    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      console.error("Failed to parse JSON:", jsonErr, await response.text());
      showMessage("Server returned invalid response.");
      return;
    }

    if (!response.ok) {
      showMessage(data.message || "Incorrect email or password");
      return;
    }

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

    // Preload all pages first
    await preloadPages([
      "pages/dashboard.html",
      "pages/calculator.html",
      "pages/goals.html",
      "pages/history.html",
      "pages/profile.html",
      "pages/activity_log.html"
    ]);

    // Load AppState first
    await initializeAppState(data.id);

    // Render dashboard
    await renderDashboardPage();

    // Navigate to last saved page if different
    if (data.page && data.page !== "pages/dashboard.html") {
      window.location.href = data.page;
    }

  } catch (err) {
    console.error("Login fetch error:", err);
    showMessage("Server error. Please try again later.");
  }
}

loginBtn.addEventListener("click", signIn);

// -------------------- ENTER KEY LOGIN --------------------
[loginEmailInput, loginPasswordInput].forEach(input => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginBtn.click();
    }
  });
});

// -------------------- GOOGLE LOGIN --------------------
googleLoginBtn.addEventListener("click", () => {
  const clientId = "988525355387-trr9q5aoejn7l83o822mk6689g85j87m.apps.googleusercontent.com";
  const redirectUri = "https://watt-watch.vercel.app/google-callback.html";
  const scope = "openid profile email";
  const responseType = "code";
  const prompt = "select_account";

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&prompt=${prompt}`;

  window.location.href = oauthUrl;
});
