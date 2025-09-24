function animateValue(el, start, end, duration, prefix = "", suffix = "") {
    const range = end - start;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * range + start);
        el.textContent =
            prefix +
            value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }) +
            suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function initDashboardPage() {
    AppState.loadGoals();
    AppState.loadCalculator();
    const calcu = AppState.getCalculator();
    const goals = AppState.getGoals();
    if (!calcu) return;

    let toPay = document.getElementById("ToPay");
    let totalKwh = document.getElementById("totalKwh");
    let goalsdata = document.getElementById("Goals");
    let progressBar = document.getElementById("goalProgress");

    let goalCard = document.getElementById("goalCard");
    let goalTitle = document.getElementById("goalTitle");

    animateValue(toPay, 0, calcu.totalCostMonth, 1000, "₱");
    animateValue(totalKwh, 0, calcu.totalKwhMonth, 1000, "kWh ");
    animateValue(goalsdata, 0, goals.targetBill, 1000, "₱");

    let percent = 0;
    if (goals.targetBill > 0) {
        percent = (calcu.totalCostMonth / goals.targetBill) * 100;
        percent = Math.min(percent, 100);
    }

    // Update progress bar
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", percent.toFixed(0));
    progressBar.textContent = `${percent.toFixed(0)}%`;

    // Reset classes
    progressBar.classList.remove("bg-info", "bg-warning", "bg-danger");
    goalCard.classList.remove("border-left-info", "border-left-warning", "border-left-danger");
    goalTitle.classList.remove("text-info", "text-warning", "text-danger");

    // Change colors based on percent
    if (percent < 80) {
        progressBar.classList.add("bg-info");
        goalCard.classList.add("border-left-info");
        goalTitle.classList.add("text-info");
    } else if (percent >= 80 && percent < 100) {
        progressBar.classList.add("bg-warning");
        goalCard.classList.add("border-left-warning");
        goalTitle.classList.add("text-warning");
    } else {
        progressBar.classList.add("bg-danger");
        goalCard.classList.add("border-left-danger");
        goalTitle.classList.add("text-danger");
    }
}

