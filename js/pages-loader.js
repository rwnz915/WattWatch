function loadPage(page) {
  const content = document.getElementById("main-content");

  // Start fade out
  content.classList.add("fade-out");

  // Wait for fade-out transition before loading
  setTimeout(() => {
    fetch(page)
      .then(response => {
        if (!response.ok) throw new Error("Page not found: " + page);
        return response.text();
      })
      .then(html => {
        content.innerHTML = html;

        // Save current page
        localStorage.setItem("currentPage", page);

        // <title>
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const pageTitle = tempDiv.querySelector("title");
        if (pageTitle) document.title = pageTitle.textContent;

        // Re-run <script> tags inside loaded page
        const scripts = tempDiv.querySelectorAll("script");
        scripts.forEach(oldScript => {
          const newScript = document.createElement("script");
          if (oldScript.src) {
            newScript.src = oldScript.src;
          } else {
            newScript.textContent = oldScript.textContent;
          }
          document.body.appendChild(newScript);
        });

        initThemeSelector();

        // Fade back in
        content.classList.remove("fade-out");
      })
      .catch(error => {
        content.innerHTML = "<div class='p-3 text-danger'>⚠ " + error.message + "</div>";
        content.classList.remove("fade-out");
      });
  }, 100);
}


document.addEventListener("DOMContentLoaded", function () {
  const savedPage = localStorage.getItem("currentPage") || "pages/dashboard.html";
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
