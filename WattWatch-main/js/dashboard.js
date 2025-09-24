function animateValue(el, start, end, duration, prefix = "", suffix = "") {
    const range = end - start;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * range + start);
        el.textContent = prefix + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function initDashboardPage() {
    AppState.loadCalculator();
    const calcu = AppState.getCalculator();
    if (!calcu) return;

    let toPay = document.getElementById("ToPay");
    let totalKwh = document.getElementById("totalKwh");

    animateValue(toPay, 0, calcu.totalCostMonth, 1000, "₱");
    animateValue(totalKwh, 0, calcu.totalKwhMonth, 1000, "kWh ");

    //console.log(`Total Monthly Cost: ₱${calcu.totalCostMonth.toFixed(2)}`);
    //console.log(`Total Monthly kWh: ${calcu.totalKwhMonth.toFixed(2)} kWh`);
}

