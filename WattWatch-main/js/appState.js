// appState.js
window.AppState = {
  calculator: { items: [], totalCostMonth: 0, totalKwhMonth: 0 },

  addCalculator(applianceData) {
    // Add new appliance to items
    this.calculator.items.push(applianceData);

    // Recalculate totals
    this.calculator.totalKwhMonth = this.calculator.items.reduce((sum, item) => {
      const dailyKwh = item.wattage / 1000 * item.hours;
      return sum + dailyKwh * 30; // monthly kWh
    }, 0);

    this.calculator.totalCostMonth = this.calculator.items.reduce((sum, item) => {
      const dailyKwh = item.wattage / 1000 * item.hours;
      const dailyCost = dailyKwh * item.rate;
      return sum + dailyCost * 30; // monthly cost
    }, 0);

    // Save to localStorage
    localStorage.setItem("AppState", JSON.stringify(this.calculator));
  },

  getCalculator() {
    return this.calculator;
  },

  loadCalculator() {
    const saved = localStorage.getItem("AppState");
    if (saved) this.calculator = JSON.parse(saved);
  },

  clearCalculator() {
    this.calculator = { items: [], totalCostMonth: 0, totalKwhMonth: 0 };
    localStorage.removeItem("AppState");
  }
};

async function updateAppStateCalculations(userId) {
  try {
    const res = await fetch(`https://wattwatch-backend.onrender.com/api/calculation/history/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    const data = await res.json();

    // Clear previous items first
    AppState.clearCalculator();

    if (!data || data.length === 0) return;

    // Add each appliance to AppState
    data.forEach(item => {
      AppState.addCalculator({
        appliance: item.appliance,
        type: item.type,
        model: item.model,
        wattage: item.wattage,
        hours: item.hours,
        rate: item.rate
      });
    });

    // Log updated totals
    const calcu = AppState.getCalculator();
    console.log("AppState totals after login:");
    console.log("Total Monthly kWh:", calcu.totalKwhMonth);
    console.log("Total Monthly Cost:", calcu.totalCostMonth);

  } catch (err) {
    console.error("Failed to update AppState calculations:", err);
  }
}
