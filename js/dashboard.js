const applianceTips = {
    "Air Conditioner": [
        "Set aircon to 25°C for efficiency.",
        "Clean filters regularly for better airflow.",
        "Use a split-type AC if possible for lower energy consumption.",
        "Close windows and doors when running the AC."
    ],
    "Electric Fan": [
        "Use fans instead of AC for short-term cooling.",
        "Choose a tower or energy-efficient model to reduce power usage."
    ],
    "Refrigerator": [
        "Set fridge temperature to 3–5°C, freezer to -18°C.",
        "Do not overload your fridge to allow proper cooling.",
        "Consider a double-door or side-by-side model for efficiency."
    ],
    "Television": [
        "Turn off TV when not in use.",
        "Use energy-saving mode if available.",
        "Smart TVs consume more energy; unplug if idle."
    ],
    "Washing Machine": [
        "Wash full loads only to save water and energy.",
        "Use cold water cycles when possible.",
        "Front-load machines are more energy-efficient than top-load."
    ],
    "Microwave Oven": [
        "Use microwave instead of oven for small meals to save energy.",
        "Avoid overcooking; it wastes power."
    ],
    "Rice Cooker": [
        "Cook only needed portions to save electricity.",
        "Use multi-cookers with energy-saving modes if available."
    ],
    "Laptop": [
        "Use power-saving mode when working on battery.",
        "Shut down instead of sleep for long breaks."
    ],
    "Desktop Computer": [
        "Turn off when not in use.",
        "Use energy-efficient power supplies."
    ],
    "Water Heater": [
        "Set water heater to 50–55°C.",
        "Use tankless heaters for on-demand heating."
    ],
    "Lights": [
        "Replace incandescent or CFL bulbs with LED for energy saving.",
        "Turn off lights when not needed."
    ]
};

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

let appliancePieChart;

function renderAppliancePieChart() {
    const calcu = AppState.getCalculator();
    const container = document.getElementById("applianceLegend");

    if (!calcu.items || calcu.items.length === 0) {
        if (appliancePieChart) appliancePieChart.destroy();
        container.innerHTML = "<p class='text-muted'>No appliances added</p>";
        return;
    }

    const sorted = [...calcu.items].sort((a, b) => b.wattage - a.wattage);

    const labels = sorted.map(a => a.appliance);
    const data = sorted.map(a => Math.round((a.wattage / 1000) * a.hours * 30 * a.rate));
    const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b", "#858796"];

    // Create legend
    container.innerHTML = labels.map((label, i) => `
        <span class="mr-2">
            <i class="fas fa-circle" style="color:${colors[i % colors.length]}"></i> ${label}
        </span>
    `).join(" ");

    if (appliancePieChart) appliancePieChart.destroy();

    const ctx = document.getElementById("appliancePieChart").getContext("2d");
    appliancePieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                hoverBackgroundColor: labels.map((_, i) => colors[i % colors.length]),
                hoverBorderColor: "rgba(234, 236, 244, 1)"
            }]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        const kwh = data.datasets[0].data[tooltipItem.index];
                        return `${data.labels[tooltipItem.index]}: ₱${kwh.toLocaleString()}`;
                    }
                }
            },
            legend: { display: false }
        }
    });
}

function renderTopAppliances() {
    const container = document.getElementById("topAppliancesContainer");
    container.innerHTML = "";

    const calcu = AppState.getCalculator();
    if (!calcu.items || calcu.items.length === 0) {
        container.innerHTML = "<p class='text-muted'>No appliances added</p>";
        return;
    }

    // Sort items by wattage descending
    const sorted = [...calcu.items].sort((a, b) => b.wattage - a.wattage);

    // Total wattage for percentage calculation
    const totalWattage = calcu.items.reduce((sum, i) => sum + i.wattage, 0);

    sorted.forEach((item, index) => {
        const percent = totalWattage > 0 ? Math.round((item.wattage / totalWattage) * 100) : 0;

        const monthlyKwh = ((item.wattage / 1000) * item.hours * 30).toFixed(2);

        const colors = ["info", "success", "warning", "danger"];
        const color = colors[Math.min(index, colors.length - 1)];

        container.innerHTML += `
            <h4 class="small font-weight-bold">
                ${item.appliance} (${monthlyKwh} kWh) <span class="float-right">${percent}%</span>
            </h4>
            <div class="progress mb-4">
                <div class="progress-bar bg-${color}" style="width: ${percent}%"></div>
            </div>
        `;
    });
}

function renderEnergyTips() {
    const tipsContainer = document.getElementById("energyTipsList");
    const calcu = AppState.getCalculator();
    const goals = AppState.getGoals();

    // Base tips (always neutral)
    const baseTips = [
        "Turn off lights when not in use.",
        "Unplug appliances when idle.",
        "Switch off lights and electrical appliances when not using them",
        "Use natural light whenever possible.",
        "Regularly maintain appliances to keep them efficient.",
        "Close doors and windows when using air conditioning.",
    ];

    if (!calcu.items || calcu.items.length === 0) {
        // No appliances: only base tips
        tipsContainer.innerHTML = baseTips.map(tip => `<li>${tip}</li>`).join("");
        return;
    }

    // Sort appliances by energy usage (wattage * hours)
    const sorted = [...calcu.items].sort((a, b) => b.wattage * b.hours - a.wattage * a.hours);

    // Determine progress percentage
    let percent = 0;
    if (goals.targetBill > 0) {
        percent = (calcu.totalCostMonth / goals.targetBill) * 100;
        percent = Math.min(percent, 150); // allow some overshoot
    }

    let colorClass = "text-info";
    if (percent >= 80 && percent < 100) colorClass = "text-warning";
    if (percent >= 100) colorClass = "text-danger";

    let tipsHtml = "";

    if (percent >= 80) {
        // Yellow or Red: show top 3 appliances
        const top3 = sorted.slice(0, 3);
        top3.forEach(appl => {
            const applTips = applianceTips[appl.appliance] || [];
            let numTips = applTips.length;

            // If yellow, only show 1-2 tips per appliance
            if (percent < 100) numTips = Math.min(2, applTips.length);

            for (let i = 0; i < numTips; i++) {
                tipsHtml += `<li class="${colorClass}">${appl.appliance}: ${applTips[i]}</li>`;
            }
        });
    }

    // Always show base tips after appliance tips
    tipsHtml += baseTips.map(tip => `<li>${tip}</li>`).join("");

    tipsContainer.innerHTML = tipsHtml;
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

    //AppState.onCalculatorChange(() => {
        renderTopAppliances();
        renderAppliancePieChart();
        renderUsageChart();
        renderEnergyTips();
    //});
    
    //console.log(AppState.getElectricityRate());
}

