// appState.js
const baseTips = [
        "Turn off lights when not in use.",
        "Unplug appliances when idle.",
        "Switch off lights and electrical appliances when not using them",
        "Use natural light whenever possible.",
        "Regularly maintain appliances to keep them efficient.",
        "Close doors and windows when using air conditioning.",
    ];

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

window.AppState = {
  calculator: { items: [], totalCostMonth: 0, totalKwhMonth: 0 },
  goals: { targetBill: 0, targetUsage: 0, goalDate: "" },
  electricityRate: 0,

  // Listeners for changes
  _calculatorListeners: [],
  _goalsListeners: [],

  // ---------------- CALCULATOR ----------------
  addCalculator(applianceData) {
    this.calculator.items.push(applianceData);
    this._recalculateCalculator();
    //this._notifyCalculatorChange();
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
    localStorage.removeItem("AppState_Calculator");
    //this.saveCalculator();
    //this._notifyCalculatorChange();
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
      const dailyCost = dailyKwh * (item.rate || this.electricityRate);
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
  },

  // ---------------- ELECTRICITY RATE ----------------
  setElectricityRate(rate) {
    this.electricityRate = rate;
    localStorage.setItem("electricityRate", rate);
  },

  getElectricityRate() {
    return this.electricityRate || parseFloat(localStorage.getItem("electricityRate")) || 0;
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
