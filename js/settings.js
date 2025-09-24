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

  // Save to localStorage so it loads instantly next time
  localStorage.setItem("theme", theme);
}

function initThemeSelector() {
  const themeSelect = document.getElementById("themeSelect");
  if (!themeSelect) return;

  // Load from localStorage first to keep UI in sync
  const savedTheme = localStorage.getItem("theme") || "System Default";
  themeSelect.value = savedTheme;

  themeSelect.addEventListener("change", () => {
    applyTheme(themeSelect.value);
  });
}

// ---------------- LOAD SETTINGS ----------------
async function loadSettings() {
  const userId = getUserId();
  if (!userId) return;

  const container = document.getElementById("settings-container");
  if (container) container.style.opacity = 0; // hide while loading

  try {
    const res = await fetch(`${BASE_URL}/api/settings/${userId}`);
    if (!res.ok) throw new Error("Failed to load settings");

    const data = await res.json();

    const themeSelect = document.getElementById("themeSelect");
    const notifSelect = document.getElementById("notifSelect");

    localStorage.setItem("theme", data.theme);

    if (themeSelect) {
      themeSelect.value = data.theme;
      applyTheme(data.theme); // sync both DOM + localStorage
    }

    if (notifSelect) {
      notifSelect.value = data.notifications ? "Enabled" : "Disabled";
      localStorage.setItem("notif", notifSelect.value);
    }
  } catch (err) {
    console.error("Error loading settings:", err);
  } finally {
    if (container) container.style.opacity = 1; // show after loading
  }
}

// ---------------- SAVE SETTINGS ----------------
async function saveSettings() {
  const userId = getUserId();
  if (!userId) {
    showMessage("You must be logged in to save settings.");
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
      showMessage("Failed to save settings!");
      return;
    }

    const result = await res.json();
    console.log(result.message);

    // Sync both DOM + localStorage
    applyTheme(theme);
    localStorage.setItem("notif", notifEnabled ? "Enabled" : "Disabled");

    showMessage("Settings saved successfully!");
  } catch (err) {
    console.error("Error saving settings:", err);
    showMessage("Failed to save settings!");
  }
}

// ---------------- INIT AFTER PAGE LOAD ----------------
function initSettingsPage() {
  initThemeSelector();
  loadSettings();

  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveSettings);

  // React to system changes only if "System Default" is selected
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if ((localStorage.getItem("theme") || "System Default") === "System Default") {
      applyTheme("System Default");
    }
  });
}
