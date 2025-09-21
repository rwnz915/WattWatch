async function loadPage(page) {
  const content = document.getElementById("main-content");

  // Show fade out
  content.classList.add("fade-out");

  setTimeout(async () => {
    try {
      const response = await fetch(page);
      if (!response.ok) throw new Error("Page not found: " + page);
      const html = await response.text();

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // Inject content
      content.innerHTML = html;

      // Update page title
      const pageTitle = tempDiv.querySelector("title");
      if (pageTitle) document.title = pageTitle.textContent;

      // Re-run scripts
      const scripts = tempDiv.querySelectorAll("script");
      scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        if (oldScript.src) newScript.src = oldScript.src;
        else newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
      });

      // Init page-specific scripts
      if (typeof initThemeSelector === "function") initThemeSelector();
      if (typeof initSettingsPage === "function") initSettingsPage();

      const saveBtn = document.getElementById("saveBtn");
      if (saveBtn) saveBtn.addEventListener("click", saveSettings);

      // Save current page
      localStorage.setItem("currentPage_Admin", page);

      // Fade back in
      content.classList.remove("fade-out");

    } catch (error) {
      content.innerHTML = "<div class='p-3 text-danger'>⚠ " + error.message + "</div>";
      content.classList.remove("fade-out");
    }
  }, 100);
}


document.addEventListener("DOMContentLoaded", function () {
  const savedPage = localStorage.getItem("currentPage_Admin") || "pages/dashboard_admin.html";
  loadPage(savedPage);

  // Active nav highlight
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  document.querySelector(`.load-page[data-page="${savedPage}"]`)
    ?.closest(".nav-item")
    .classList.add("active");

  document.querySelectorAll(".load-page").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.getAttribute("data-page");
      loadPage(page);

      document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
      this.closest(".nav-item").classList.add("active");
    });
  });
});
