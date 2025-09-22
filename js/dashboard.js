function initDashboardPage() {
    AppState.loadCalculator();
    const calcu = AppState.getCalculator();
    if (!calcu) return;

    let toPay = document.getElementById("ToPay");
    let totalKwh = document.getElementById("totalKwh");

    toPay.innerHTML = `₱${calcu.totalCostMonth.toFixed(2)}`;
    totalKwh.innerHTML = `kWh ${calcu.totalKwhMonth.toFixed(2)}`;

    //console.log(`Total Monthly Cost: ₱${calcu.totalCostMonth.toFixed(2)}`);
    //console.log(`Total Monthly kWh: ${calcu.totalKwhMonth.toFixed(2)} kWh`);
}

