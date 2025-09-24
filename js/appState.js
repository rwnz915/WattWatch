// appState.js
window.AppState = {
  calculator: { items: [], totalCostMonth: 0, totalKwhMonth: 0 },
  goals: { targetBill: 0, targetUsage: 0, goalDate: "" },

  // ---------------- CALCULATOR ----------------
  addCalculator(applianceData) {
    this.calculator.items.push(applianceData);

    // Recalculate totals
    this.calculator.totalKwhMonth = this.calculator.items.reduce((sum, item) => {
      const dailyKwh = item.wattage / 1000 * item.hours;
      return sum + dailyKwh * 30;
    }, 0);

    this.calculator.totalCostMonth = this.calculator.items.reduce((sum, item) => {
      const dailyKwh = item.wattage / 1000 * item.hours;
      const dailyCost = dailyKwh * item.rate;
      return sum + dailyCost * 30;
    }, 0);

    this.saveCalculator();
  },

  getCalculator() {
    return this.calculator;
  },

  loadCalculator() {
    const saved = JSON.parse(localStorage.getItem("AppState_Calculator"));
    if (saved) this.calculator = saved;
  },

  clearCalculator() {
    this.calculator = { items: [], totalCostMonth: 0, totalKwhMonth: 0 };
    this.saveCalculator();
  },

  saveCalculator() {
    localStorage.setItem("AppState_Calculator", JSON.stringify(this.calculator));
  },

  // ---------------- GOALS ----------------
  setGoals(goals) {
    this.goals = {
      targetBill: parseFloat(goals.targetBill) || 0,
      targetUsage: parseFloat(goals.targetUsage) || 0,
      goalDate: goals.goalDate || ""
    };
    this.saveGoals();
  },

  getGoals() {
    return this.goals;
  },

  loadGoals() {
    const saved = JSON.parse(localStorage.getItem("AppState_Goals"));
    if (saved) this.goals = saved;
  },

  clearGoals() {
    this.goals = { targetBill: 0, targetUsage: 0, goalDate: "" };
    this.saveGoals();
  },

  saveGoals() {
    localStorage.setItem("AppState_Goals", JSON.stringify(this.goals));
  }
};

// ---------------- SERVER SYNC ----------------
async function updateAppStateCalculations(userId) {
  try {
    const res = await fetch(`https://wattwatch-backend.onrender.com/api/calculation/history/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    const data = await res.json();

    // Reset calculator
    AppState.clearCalculator();

    if (data && data.length > 0) {
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
    }

    console.log("AppState totals after login:", AppState.getCalculator());
  } catch (err) {
    console.error("Failed to update AppState calculations:", err);
  }
}

async function updateAppStateGoals(userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/EnergyGoals/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch goals");
    const data = await res.json();

    // Update AppState + save to separate localStorage
    AppState.setGoals({
      targetBill: parseFloat(data.targetBill) || 0,
      targetUsage: parseFloat(data.targetUsage) || 0,
      goalDate: data.goalDate || null
    });

    console.log("AppState goals after update:", AppState.getGoals());
  } catch (err) {
    console.error("Failed to update AppState goals:", err);
  }
}
