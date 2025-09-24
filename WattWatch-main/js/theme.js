(function() {
  const savedTheme = localStorage.getItem("theme") || "System Default";
  applyTheme(savedTheme);
})();

function initThemeSelector() {
  const themeSelect = document.getElementById("themeSelect");
  if (!themeSelect) return; // not on settings page

  // Set current value
  const savedTheme = localStorage.getItem("theme") || "System Default";
  themeSelect.value = savedTheme;

  // Listen for changes
  themeSelect.addEventListener("change", function () {
    const selectedTheme = this.value;
    localStorage.setItem("theme", selectedTheme);
    applyTheme(selectedTheme);
  });
}

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
