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
    //});
    
    //console.log(AppState.getElectricityRate());
}

