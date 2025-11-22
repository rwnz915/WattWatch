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

    // Helper: generate up to 3 appliance-specific tips or fallback
function getEnergyTips(calcu, percent, maxTips = 3) {
    if (!calcu.items || calcu.items.length === 0) {
        // No appliances → fallback to base tips
        return baseTips.slice(0, maxTips);
    }

    // Sort appliances by monthly kWh usage (highest first)
    const sorted = [...calcu.items].sort((a, b) => b.kwhMonth - a.kwhMonth);

    const tips = [];

    for (let appl of sorted.slice(0, 3)) {
        const applTips = applianceTips[appl.appliance] || [];
        let numTips = applTips.length;

        // If yellow (80–99%), only show 1–2 tips per appliance
        if (percent < 100) numTips = Math.min(2, applTips.length);

        for (let i = 0; i < numTips && tips.length < maxTips; i++) {
            tips.push(`${appl.appliance}: ${applTips[i]}`);
        }

        if (tips.length >= maxTips) break; // stop at max
    }

    return tips.length > 0 ? tips : baseTips.slice(0, maxTips);
}

// ---------------- Alerts ----------------
if (percent >= 100) {
    alerts.push({
        date: new Date().toLocaleDateString(),
        message: "You have <strong>exceeded your target bill!</strong>",
        color: "danger",
        icon: "fas fa-exclamation-triangle",
        details: `
        <div class="m-3">
            Your current usage is <strong>₱${calcu.totalCostMonth.toFixed(2)}</strong>, 
            compared to your target bill of <strong>₱${goals.targetBill.toFixed(2)}</strong>. 
            Consider unplugging unused appliances or switching to energy-efficient devices.
            <div class="mt-2 p-2 border-left border-danger">
                <b class="text-danger">Energy Saving Tips:</b>
                <ul class="mb-0">
                    ${getEnergyTips(calcu, percent, 3).map(tip => `<li>${tip}</li>`).join("")}
                </ul>
            </div>
        </div>
        `
    });
} else if (percent >= 80) {
    alerts.push({
        date: new Date().toLocaleDateString(),
        message: "You're almost at your <strong>target bill.</strong>",
        color: "warning",
        icon: "fas fa-exclamation-circle",
        details: `
        <div class="m-3">
            You’ve used <strong>${percent.toFixed(1)}%</strong> of your monthly budget 
            (₱${calcu.totalCostMonth.toFixed(2)} out of ₱${goals.targetBill.toFixed(2)}). 
            Try reducing appliance usage during peak hours to save more.
            <div class="mt-2 p-2 border-left border-warning">
                <b class="text-warning">Energy Saving Tips:</b>
                <ul class="mb-0">
                    ${getEnergyTips(calcu, percent, 2).map(tip => `<li>${tip}</li>`).join("")}
                </ul>
            </div>
        </div>
        `
    });
}

// Meralco / info alert
alerts.push({
    date: "Nov 2025",
    message: `Meralco rate increased to <strong>₱13.47 per kWh</strong>.`,
    color: "info",
    icon: "fas fa-bolt",
    details: `
    <div class="m-3">
        Meralco announced a <strong>₱0.15 per kWh</strong> increase for November 2025, 
        bringing the rate to <strong>₱13.47 per kWh</strong>.<br>
        The rise was mainly due to higher <strong>generation charges</strong> from 
        Independent Power Producers and Power Supply Agreements.  
        <div class="mt-2">
            <a href="https://company.meralco.com.ph/news-and-advisories/higher-rates-november-2025#:~:text=MANILA%2C%20PHILIPPINES%2C%2010%20NOVEMBER%202025,3182%20per%20kWh%20in%20October."
               target="_blank" rel="noopener noreferrer">Read full advisory</a>
        </div>
    </div>
    `
});

    // render
    if (alerts.length === 0) {
        alertsList.innerHTML = `<li class="list-group-item text-center text-gray-500">No recent notifications</li>`;
        return;
    }

    alerts.forEach((alert, index) => {
        const li = document.createElement("li");
        li.className = `list-group-item p-2`;

        // note: alert-main-icon & arrow-icon are distinct
        li.innerHTML = `
            <div class="d-flex align-items-center justify-content-between toggle-alert" 
                 style="cursor:pointer;" data-target="alert-${index}" role="button" aria-expanded="false">
                <div class="d-flex align-items-center">
                    <div class="icon-circle bg-${alert.color} text-white rounded-circle mr-3 m-2">
                        <i class="alert-main-icon ${alert.icon}" aria-hidden="true"></i>
                    </div>
                    <div>
                        <div class="small text-gray-500">${alert.date}</div>
                        ${alert.message}
                    </div>
                </div>
                <!-- arrow-icon is separate and only this will be toggled -->
                <i class="fas fa-chevron-down arrow-icon text-gray-500 m-3" aria-hidden="true"></i>
            </div>

            <div id="alert-${index}" class="alert-details mt-2 text-sm text-gray-700" aria-hidden="true" style="display:none;">
                ${alert.details}
            </div>
        `;
        alertsList.appendChild(li);
    });

    // use event delegation so dynamically added items work fine
    alertsList.addEventListener("click", (e) => {
        const toggle = e.target.closest(".toggle-alert");
        if (!toggle) return;

        const targetId = toggle.getAttribute("data-target");
        const details = document.getElementById(targetId);
        const arrow = toggle.querySelector(".arrow-icon"); // ONLY the arrow
        const isHidden = details.style.display === "none" || details.style.display === "";

        if (isHidden) {
            details.style.display = "block";
            details.setAttribute("aria-hidden", "false");
            toggle.setAttribute("aria-expanded", "true");
            if (arrow) {
                arrow.classList.remove("fa-chevron-down");
                arrow.classList.add("fa-chevron-up");
            }
        } else {
            details.style.display = "none";
            details.setAttribute("aria-hidden", "true");
            toggle.setAttribute("aria-expanded", "false");
            if (arrow) {
                arrow.classList.remove("fa-chevron-up");
                arrow.classList.add("fa-chevron-down");
            }
        }
    });
}
