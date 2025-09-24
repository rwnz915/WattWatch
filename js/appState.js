// appState.js
window.AppState = {
  calculator: { items: [], totalCostMonth: 0, totalKwhMonth: 0 },
  goals: { targetBill: 0, targetUsage: 0, goalDate: "" },

  // Listeners for changes
  _calculatorListeners: [],
  _goalsListeners: [],

  // ---------------- CALCULATOR ----------------
  addCalculator(applianceData) {
    this.calculator.items.push(applianceData);
    this._recalculateCalculator();
    this._notifyCalculatorChange();
  },

  getCalculator() {
    return this.calculator;
  },

  loadCalculator() {
    const saved = JSON.parse(localStorage.getItem("AppState_Calculator"));
    if (saved) this.calculator = saved;
    this._notifyCalculatorChange();
  },

  clearCalculator() {
    this.calculator = { items: [], totalCostMonth: 0, totalKwhMonth: 0 };
    this.saveCalculator();
    this._notifyCalculatorChange();
  },

  saveCalculator() {
    localStorage.setItem("AppState_Calculator", JSON.stringify(this.calculator));
  },

  _recalculateCalculator() {
    this.calculator.totalKwhMonth = this.calculator.items.reduce((sum, item) => {
      const dailyKwh = (item.wattage / 1000) * item.hours;
      return sum + dailyKwh * 30;
    }, 0);

    this.calculator.totalCostMonth = this.calculator.items.reduce((sum, item) => {
      const dailyKwh = (item.wattage / 1000) * item.hours;
      const dailyCost = dailyKwh * item.rate;
      return sum + dailyCost * 30;
    }, 0);

    this.saveCalculator();
  },

  onCalculatorChange(callback) {
    if (typeof callback === "function") this._calculatorListeners.push(callback);
  },

  _notifyCalculatorChange() {
    this._calculatorListeners.forEach(cb => cb(this.calculator));
  },

  // ---------------- GOALS ----------------
  setGoals(goals) {
    this.goals = {
      targetBill: parseFloat(goals.targetBill) || 0,
      targetUsage: parseFloat(goals.targetUsage) || 0,
      goalDate: goals.goalDate || ""
    };
    this.saveGoals();
    this._notifyGoalsChange();
  },

  getGoals() {
    return this.goals;
  },

  loadGoals() {
    const saved = JSON.parse(localStorage.getItem("AppState_Goals"));
    if (saved) this.goals = saved;
    this._notifyGoalsChange();
  },

  clearGoals() {
    this.goals = { targetBill: 0, targetUsage: 0, goalDate: "" };
    this.saveGoals();
    this._notifyGoalsChange();
  },

  saveGoals() {
    localStorage.setItem("AppState_Goals", JSON.stringify(this.goals));
  },

  onGoalsChange(callback) {
    if (typeof callback === "function") this._goalsListeners.push(callback);
  },

  _notifyGoalsChange() {
    this._goalsListeners.forEach(cb => cb(this.goals));
  }
};

// ---------------- SERVER SYNC ----------------
async function updateAppStateCalculations(userId) {
  try {
    const res = await fetch(`https://wattwatch-backend.onrender.com/api/calculation/history/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    const data = await res.json();

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

    console.log("AppState totals after update:", AppState.getCalculator());
  } catch (err) {
    console.error("Failed to update AppState calculations:", err);
  }
}

async function updateAppStateGoals(userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/EnergyGoals/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch goals");
    const data = await res.json();

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
