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

    // helper (same as before)
    function getEnergyTips(count = 2) {
        const allTips = [];
        for (const category in applianceTips) {
            allTips.push(...applianceTips[category]);
        }
        // shuffle
        for (let i = allTips.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allTips[i], allTips[j]] = [allTips[j], allTips[i]];
        }
        return allTips.slice(0, count);
    }

    // Add alerts (same logic you already have)
    if (percent >= 100) {
        alerts.push({
            date: new Date().toLocaleDateString(),
            message: "You have <strong>exceeded your target bill!</strong>",
            color: "danger",
            icon: "fas fa-exclamation-triangle",
            details: `
                Your current usage is <strong>₱${calcu.totalCostMonth.toFixed(2)}</strong>, 
                compared to your target bill of <strong>₱${goals.targetBill.toFixed(2)}</strong>. 
                Consider unplugging unused appliances or switching to energy-efficient devices.
                <div class="tips-box mt-2 p-2">
                    <strong class="text-danger">Energy Saving Tips:</strong>
                    <ul class="mb-0">
                        ${getEnergyTips(3).map(tip => `<li>${tip}</li>`).join("")}
                    </ul>
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
                You’ve used <strong>${percent.toFixed(1)}%</strong> of your monthly budget 
                (₱${calcu.totalCostMonth.toFixed(2)} out of ₱${goals.targetBill.toFixed(2)}). 
                Try reducing appliance usage during peak hours to save more.
                <div class="tips-box mt-2 p-2">
                    <strong class="text-warning">Energy Saving Tips:</strong>
                    <ul class="mb-0">
                        ${getEnergyTips(2).map(tip => `<li>${tip}</li>`).join("")}
                    </ul>
                </div>
            `
        });
    }

    // Meralco / info alert
    alerts.push({
        date: "Sep 2025",
        message: `Current Meralco rate is <strong>₱13.09 per kWh</strong>.`,
        color: "info",
        icon: "fas fa-bolt",
        details: `
            Meralco’s residential rate for September 2025 is <strong>₱13.09 per kWh</strong>, 
            which is <strong>₱0.50 higher</strong> compared to last month’s ₱12.59/kWh.
            <div class="mt-2">
                <strong>Impact for you:</strong> Your current consumption of <strong>${calcu.totalKwhMonth.toFixed(2)} kWh</strong>
                would change your bill by about <strong>₱${(calcu.totalKwhMonth * 0.50).toFixed(2)}</strong> vs last month.
            </div>
            <div class="tips-box mt-2 p-2">
                <strong class="text-info">Energy-saving tip:</strong>
                <ul class="mb-0">
                    ${getEnergyTips(2).map(tip => `<li>${tip}</li>`).join("")}
                </ul>
            </div>
            <div class="mt-2"><a href="https://company.meralco.com.ph/news-and-advisories/lower-rates-september-2025" target="_blank" rel="noopener noreferrer">Read the advisory</a></div>
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
                    <div class="icon-circle bg-${alert.color} text-white p-2 rounded-circle mr-3 m-2">
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
