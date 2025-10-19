async function loadPage(page, pushState = true) {
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

      // Re-run scripts (external or inline)
      const scripts = tempDiv.querySelectorAll("script");
      for (const oldScript of scripts) {
        await new Promise((resolve) => {
          const newScript = document.createElement("script");
          if (oldScript.src) {
            newScript.src = oldScript.src;
            newScript.onload = resolve;
          } else {
            newScript.textContent = oldScript.textContent;
            resolve();
          }
          document.body.appendChild(newScript);
        });
      }

      if (page.includes("calculator.html") && typeof initCalculatorPage === "function") {
          initCalculatorPage();
      }

      if (page.includes("dashboard_admin.html") && typeof initDashboardPage === "function") {
          initAdminDashboardPage();
      }

      // Init page-specific scripts
      if (typeof initThemeSelector === "function") initThemeSelector();
      if (typeof initSettingsPage === "function") initSettingsPage();

      const saveBtn = document.getElementById("saveBtn");
      if (saveBtn) saveBtn.addEventListener("click", saveSettings);

      // Save current page
      localStorage.setItem("currentPage_Admin", page);

      /*if (pushState) {
        const cleanUrl = "/" + page.replace("pages/", "").replace(".html", "");
        history.pushState({ page }, "", cleanUrl);
      }*/

      // Fade back in
      content.classList.remove("fade-out");

    } catch (error) {
      content.innerHTML = "<div class='p-3 text-danger'>⚠ " + error.message + "</div>";
      content.classList.remove("fade-out");
    }
  }, 100);
}

/*
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.page) {
    loadPage(event.state.page, false);
  }
});*/

document.addEventListener("DOMContentLoaded", function () {
  const savedPage = localStorage.getItem("currentPage_Admin") || "pages/admin/dashboard_admin.html";
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
