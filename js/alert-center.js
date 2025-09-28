function initAlertCenterPage() {
    AppState.loadGoals();
    AppState.loadCalculator();
    const calcu = AppState.getCalculator();
    const goals = AppState.getGoals();

    const alertsList = document.getElementById("alertsCenterList");
    if (!alertsList || !calcu || !goals) return;

    alertsList.innerHTML = ""; // clear previous alerts
    const alerts = [];

    // Compute percent of goal used
    let percent = 0;
    if (goals.targetBill > 0) {
        percent = (calcu.totalCostMonth / goals.targetBill) * 100;
        percent = Math.min(percent, 150); // allow overshoot
    }

    // Add goal-related alerts
    if (percent >= 100) {
        alerts.push({
            date: new Date().toLocaleDateString(),
            message: "You have <strong>exceeded your target bill!</strong>",
            color: "danger",
            icon: "fas fa-exclamation-triangle"
        });
    } else if (percent >= 80) {
        alerts.push({
            date: new Date().toLocaleDateString(),
            message: "You're almost at your <strong>target bill.</strong>",
            color: "warning",
            icon: "fas fa-exclamation-circle"
        });
    }

    // Always show current electricity rate
    alerts.push({
        date: "Sep 2025",
        message: `Current Meralco rate is <strong>₱13.09 per kWh</strong>. 
                  <a href="https://company.meralco.com.ph/news-and-advisories/lower-rates-september-2025" target="_blank" rel="noopener noreferrer">Source</a>`,
        color: "info",
        icon: "fas fa-bolt"
    });

    // Render alerts
    if (alerts.length === 0) {
        alertsList.innerHTML = `<li class="list-group-item text-center text-gray-500">No recent notifications</li>`;
    } else {
        alerts.forEach(alert => {
            const li = document.createElement("li");
            li.className = `list-group-item d-flex align-items-center border-${alert.color}`;
            li.innerHTML = `
                <div class="mr-3">
                    <div class="icon-circle bg-${alert.color} text-white p-2 rounded-circle">
                        <i class="${alert.icon}"></i>
                    </div>
                </div>
                <div>
                    <div class="small text-gray-500">${alert.date}</div>
                    ${alert.message}
                </div>
            `;
            alertsList.appendChild(li);
        });
    }
}
