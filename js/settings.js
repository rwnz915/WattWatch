// ---------------- CONFIG ----------------
const BASE_URL = "https://wattwatch-backend.onrender.com"; // Your backend URL

// ---------------- USER HELPERS ----------------
function getUserId() {
  const user = getUserInfo(); // from login.js
  return user ? user.id : null;
}

// ---------------- THEME ----------------
function applyTheme(theme) {
  document.documentElement.classList.remove("dark-mode");

  if (theme === "Dark") {
    document.documentElement.classList.add("dark-mode");
  } else if (theme === "System Default") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark-mode");
    }
  }
}

function initThemeSelector() {
  const themeSelect = document.getElementById("themeSelect");
  if (!themeSelect) return;

  themeSelect.addEventListener("change", () => {
    applyTheme(themeSelect.value);
  });
}

// ---------------- LOAD SETTINGS ----------------
async function loadSettings() {
  const userId = getUserId();
  if (!userId) return;

  try {
    const res = await fetch(`${BASE_URL}/api/settings/${userId}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!res.ok) {
      console.error("Failed to load settings:", res.status, await res.text());
      return;
    }

    const data = await res.json();

    // Fill form
    const themeSelect = document.getElementById("themeSelect");
    const notifSelect = document.getElementById("notifSelect");
    if (themeSelect) themeSelect.value = data.theme;
    if (notifSelect) notifSelect.value = data.notifications ? "Enabled" : "Disabled";
    localStorage.setItem("theme", data.theme);

    // Apply theme
    applyTheme(data.theme);
  } catch (err) {
    console.error("Error loading settings:", err);
  }
}

// ---------------- SAVE SETTINGS ----------------
async function saveSettings() {
  const userId = getUserId();
  if (!userId) {
    alert("You must be logged in to save settings.");
    return;
  }

  const theme = document.getElementById("themeSelect")?.value || "System Default";
  const notifEnabled = document.getElementById("notifSelect")?.value === "Enabled";

  try {
    const res = await fetch(`${BASE_URL}/api/settings/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, notifications: notifEnabled })
    });

    if (!res.ok) {
      console.error("Failed to save settings:", res.status, await res.text());
      alert("Failed to save settings!");
      return;
    }

    const result = await res.json();
    console.log(result.message);

    applyTheme(theme);
    alert("Settings saved successfully!");
  } catch (err) {
    console.error("Error saving settings:", err);
    alert("Failed to save settings!");
  }
}

// ---------------- INIT AFTER PAGE LOAD ----------------
function initSettingsPage() {
  initThemeSelector();
  loadSettings();

  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveSettings);
}