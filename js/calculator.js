// ---------- Data for cascading dropdown ----------
const applianceData = {
  "Air Conditioner": {
    "Window Type": ["Carrier Optima", "Panasonic CW-XN620JPH", "Condura WCON09"],
    "Split Type": ["LG DualCool", "Samsung WindFree", "Kolins Inverter Split"],
    "Portable": ["Midea 1HP Portable", "Imarflex IAC-1200S"]
  },
  "Electric Fan": {
    "Stand Fan": ["Asahi SF-20", "Hanabishi HS-16", "Union UGSF-161"],
    "Desk Fan": ["3D DF-602", "Union UDF-131", "Imarflex IF-612"],
    "Tower Fan": ["KDK Tower 40", "Hanabishi HTF-600"]
  },
  "Refrigerator": {
    "Single Door": ["Fujidenzo RDD-60", "Condura CPR90T"],
    "Double Door": ["LG GR-B202SQBB", "Whirlpool WDE205", "Samsung RT20FARVDSA"],
    "Side by Side": ["Samsung RS62R5001", "Panasonic NR-BS60"]
  },
  "Television": {
    "LED": ["Samsung UA32T", "Sony Bravia KDL32", "TCL 32S65A"],
    "Smart": ["LG 43UN", "TCL 55P725", "Hisense 43A4GS"],
    "OLED": ["LG OLED55", "Sony A80J"]
  },
  "Washing Machine": {
    "Top Load": ["LG T2108", "Samsung WA75H4200", "Sharp ES-JN06"],
    "Front Load": ["Whirlpool FWG710", "Electrolux EWF8025"]
  },
  "Microwave Oven": {
    "Solo": ["Panasonic NN-ST34", "Sharp R-20A"],
    "Grill": ["LG MH6535", "Samsung MG23", "Imarflex IMX-2000"]
  },
  "Rice Cooker": {
    "Standard": ["Hanabishi HRC15", "Imarflex IRC18", "3D RC-600"],
    "Multi-Cooker": ["Instant Pot Duo", "Philips HD4515", "Tefal RK8121"]
  },
  "Laptop": {
    "Ultrabook": ["MacBook Air M2", "Dell XPS 13", "Asus Zenbook 14"],
    "Gaming": ["Asus ROG Strix", "MSI GF63", "Acer Nitro 5"]
  },
  "Desktop Computer": {
    "Basic": ["HP Slimline", "Acer Aspire"],
    "Gaming": ["NZXT Player", "Lenovo Legion", "Asus TUF Gaming"]
  },
  "Water Heater": {
    "Tankless": ["Stiebel Eltron DHC", "Panasonic DH-3"],
    "Tank": ["Ariston Pro1", "Rheem Prestige"]
  },
  "Lights": {
    "LED Bulb": ["Philips 9W LED", "Firefly LED 9W", "Omni LED 7W"],
    "Fluorescent": ["GE T8 18W", "Panasonic T8 20W"],
    "CFL": ["Firefly CFL 15W", "Philips Tornado 15W"]
  }
};

// ---------- Default values for appliances ----------
const applianceDefaults = {
  // Aircon
  "Carrier Optima": { wattage: 1200, hours: 8, rate: 12 },
  "Panasonic CW-XN620JPH": { wattage: 1500, hours: 6, rate: 12 },
  "Condura WCON09": { wattage: 1000, hours: 8, rate: 12 },
  "LG DualCool": { wattage: 1000, hours: 7, rate: 12 },
  "Samsung WindFree": { wattage: 1100, hours: 6, rate: 12 },
  "Kolins Inverter Split": { wattage: 950, hours: 7, rate: 12 },
  "Midea 1HP Portable": { wattage: 900, hours: 5, rate: 12 },
  "Imarflex IAC-1200S": { wattage: 1000, hours: 5, rate: 12 },

  // Fans
  "Asahi SF-20": { wattage: 75, hours: 6, rate: 12 },
  "Hanabishi HS-16": { wattage: 65, hours: 6, rate: 12 },
  "Union UGSF-161": { wattage: 70, hours: 6, rate: 12 },
  "3D DF-602": { wattage: 50, hours: 5, rate: 12 },
  "Union UDF-131": { wattage: 55, hours: 5, rate: 12 },
  "Imarflex IF-612": { wattage: 60, hours: 5, rate: 12 },
  "KDK Tower 40": { wattage: 70, hours: 7, rate: 12 },
  "Hanabishi HTF-600": { wattage: 80, hours: 7, rate: 12 },

  // Ref
  "Fujidenzo RDD-60": { wattage: 150, hours: 24, rate: 12 },
  "Condura CPR90T": { wattage: 160, hours: 24, rate: 12 },
  "LG GR-B202SQBB": { wattage: 250, hours: 24, rate: 12 },
  "Whirlpool WDE205": { wattage: 230, hours: 24, rate: 12 },
  "Samsung RT20FARVDSA": { wattage: 240, hours: 24, rate: 12 },
  "Samsung RS62R5001": { wattage: 400, hours: 24, rate: 12 },
  "Panasonic NR-BS60": { wattage: 380, hours: 24, rate: 12 },

  // TV
  "Samsung UA32T": { wattage: 50, hours: 6, rate: 12 },
  "Sony Bravia KDL32": { wattage: 55, hours: 6, rate: 12 },
  "TCL 32S65A": { wattage: 45, hours: 6, rate: 12 },
  "LG 43UN": { wattage: 70, hours: 6, rate: 12 },
  "TCL 55P725": { wattage: 80, hours: 6, rate: 12 },
  "Hisense 43A4GS": { wattage: 65, hours: 6, rate: 12 },
  "LG OLED55": { wattage: 120, hours: 6, rate: 12 },
  "Sony A80J": { wattage: 130, hours: 6, rate: 12 },

  // Washing Machine
  "LG T2108": { wattage: 500, hours: 1, rate: 12 },
  "Samsung WA75H4200": { wattage: 450, hours: 1, rate: 12 },
  "Sharp ES-JN06": { wattage: 400, hours: 1, rate: 12 },
  "Whirlpool FWG710": { wattage: 600, hours: 1, rate: 12 },
  "Electrolux EWF8025": { wattage: 550, hours: 1, rate: 12 },

  // Microwave
  "Panasonic NN-ST34": { wattage: 1000, hours: 0.5, rate: 12 },
  "Sharp R-20A": { wattage: 900, hours: 0.5, rate: 12 },
  "LG MH6535": { wattage: 1200, hours: 0.5, rate: 12 },
  "Samsung MG23": { wattage: 1100, hours: 0.5, rate: 12 },
  "Imarflex IMX-2000": { wattage: 1000, hours: 0.5, rate: 12 },

  // Rice Cooker
  "Hanabishi HRC15": { wattage: 400, hours: 1, rate: 12 },
  "Imarflex IRC18": { wattage: 350, hours: 1, rate: 12 },
  "3D RC-600": { wattage: 300, hours: 1, rate: 12 },
  "Instant Pot Duo": { wattage: 1000, hours: 1, rate: 12 },
  "Philips HD4515": { wattage: 950, hours: 1, rate: 12 },
  "Tefal RK8121": { wattage: 900, hours: 1, rate: 12 },

  // Laptop
  "MacBook Air M2": { wattage: 30, hours: 8, rate: 12 },
  "Dell XPS 13": { wattage: 35, hours: 8, rate: 12 },
  "Asus Zenbook 14": { wattage: 40, hours: 8, rate: 12 },
  "Asus ROG Strix": { wattage: 150, hours: 8, rate: 12 },
  "MSI GF63": { wattage: 140, hours: 8, rate: 12 },
  "Acer Nitro 5": { wattage: 160, hours: 8, rate: 12 },

  // Desktop
  "HP Slimline": { wattage: 200, hours: 8, rate: 12 },
  "Acer Aspire": { wattage: 180, hours: 8, rate: 12 },
  "NZXT Player": { wattage: 400, hours: 8, rate: 12 },
  "Lenovo Legion": { wattage: 420, hours: 8, rate: 12 },
  "Asus TUF Gaming": { wattage: 380, hours: 8, rate: 12 },

  // Water Heater
  "Stiebel Eltron DHC": { wattage: 3500, hours: 1, rate: 12 },
  "Panasonic DH-3": { wattage: 3000, hours: 1, rate: 12 },
  "Ariston Pro1": { wattage: 1500, hours: 2, rate: 12 },
  "Rheem Prestige": { wattage: 2000, hours: 2, rate: 12 },

  // Lights
  "Philips 9W LED": { wattage: 9, hours: 6, rate: 12 },
  "Firefly LED 9W": { wattage: 9, hours: 6, rate: 12 },
  "Omni LED 7W": { wattage: 7, hours: 6, rate: 12 },
  "GE T8 18W": { wattage: 18, hours: 6, rate: 12 },
  "Panasonic T8 20W": { wattage: 20, hours: 6, rate: 12 },
  "Firefly CFL 15W": { wattage: 15, hours: 6, rate: 12 },
  "Philips Tornado 15W": { wattage: 15, hours: 6, rate: 12 }
};

// ---------- LocalStorage-based State Management (replaces AppState) ----------
class LocalState {
  constructor(key) {
    this.key = key;
  }

  add(item) {
    let items = this.get();
    items.push(item);
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  get() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  clear() {
    localStorage.removeItem(this.key);
  }

  getTotalMonthlyCost() {
    const items = this.get();
    return items.reduce((total, item) => {
      const dailyKWh = (item.wattage / 1000) * item.hours;
      const dailyCost = dailyKWh * item.rate;
      return total + (dailyCost * 30);
    }, 0);
  }
}

const calcState = new LocalState('wattwatch_calcs');

// ---------- DOM elements ----------
const applianceSelect = document.getElementById("appliance");
const typeSelect = document.getElementById("type");
const modelSelect = document.getElementById("model");
const form = document.getElementById("calcForm");
const historyList = document.getElementById("history");
const monthlyTotal = document.getElementById("monthlyTotal");
const result = document.getElementById("result");
const clearForm = document.getElementById("clearForm");

// ---------- Prevent invalid number inputs ----------
document.querySelectorAll(".only-numbers").forEach((input) => {
  input.addEventListener("keydown", (e) => {
    // Prevent scientific notation and negative signs for positive numbers
    if (["e", "E", "+", "-"].includes(e.key) && e.key !== "+") {
      e.preventDefault();
    }
  });
  // Also handle paste events for numbers only
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const numbersOnly = paste.replace(/[^0-9.]/g, '');
    e.target.value = numbersOnly;
  });
});

// ---------- Cascading dropdowns (non-duplicated, efficient) ----------
function setupDropdowns() {
  applianceSelect.addEventListener("change", updateTypes);
  typeSelect.addEventListener("change", updateModels);
  modelSelect.addEventListener("change", loadDefaults);
}

function updateTypes() {
  const selectedAppliance = applianceSelect.value;
  typeSelect.innerHTML = '<option value="">-- Select Type --</option>';
  modelSelect.innerHTML = '<option value="">-- Select Brand / Model --</option>';
  modelSelect.disabled = true;
  typeSelect.disabled = true;

  if (selectedAppliance && applianceData[selectedAppliance]) {
    Object.keys(applianceData[selectedAppliance]).forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      typeSelect.appendChild(option);
    });
    typeSelect.disabled = false;
  }
}

function updateModels() {
  const selectedAppliance = applianceSelect.value;
  const selectedType = typeSelect.value;
  modelSelect.innerHTML = '<option value="">-- Select Brand / Model --</option>';
  modelSelect.disabled = true;

  if (selectedAppliance && selectedType && applianceData[selectedAppliance][selectedType]) {
    applianceData[selectedAppliance][selectedType].forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
    modelSelect.disabled = false;
  }
}

function loadDefaults() {
  const selectedModel = modelSelect.value;
  const defaults = applianceDefaults[selectedModel];
  if (defaults) {
    document.getElementById("wattage").value = defaults.wattage;
    document.getElementById("hours").value = defaults.hours;
    document.getElementById("rate").value = defaults.rate;
  }
}

// ---------- Load history from LocalStorage ----------
function loadHistory() {
  const items = calcState.get();
  historyList.innerHTML = "";
  let total = calcState.getTotalMonthlyCost();

  if (items.length === 0) {
    historyList.innerHTML = '<li class="list-group-item text-muted">No recent calculations</li>';
  } else {
    items.forEach((item) => {
      const dailyKWh = (item.wattage / 1000) * item.hours;
      const dailyCost = dailyKWh * item.rate;
      const monthlyCost = dailyCost * 30;
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `${item.appliance} ${item.model || item.type} - ₱${monthlyCost.toFixed(2)}/month`;
      historyList.appendChild(li);
    });
  }

  monthlyTotal.textContent = `₱${total.toFixed(2)}`;
}

// ---------- Form submission handler ----------
function setupForm() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const appliance = applianceSelect.value;
    const type = typeSelect.value;
    const model = modelSelect.value;
    const wattage = parseFloat(document.getElementById("wattage").value);
    const hours = parseFloat(document.getElementById("hours").value);
    const rate = parseFloat(document.getElementById("rate").value);

    if (!appliance || !type || isNaN(wattage) || isNaN(hours) || isNaN(rate)) {
      alert("Please complete all required fields with valid numbers.");
      return;
    }

    // Calculate costs
    const dailyKWh = (wattage / 1000) * hours;
    const dailyCost = dailyKWh * rate;
    const monthlyCost = dailyCost * 30;

    // Save to local state
    calcState.add({
      appliance,
      type,
      model,
      wattage,
      hours,
      rate
    });

    // Display result
    result.textContent = `Daily Usage: ${dailyKWh.toFixed(2)} kWh | Daily Cost: ₱${dailyCost.toFixed(2)} | Monthly Cost: ₱${monthlyCost.toFixed(2)}`;

    // Reset form
    form.reset();
    typeSelect.disabled = true;
    modelSelect.disabled = true;

    // Reload history and total
    loadHistory();
  });
}

// ---------- Clear history handler ----------
function setupClear() {
  clearForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to clear all calculations?")) {
      calcState.clear();
      loadHistory();
      result.textContent = "";
    }
  });
}

// ---------- Initialization ----------
function init() {
  setupDropdowns();
  setupForm();
  setupClear();
  loadHistory(); // Load initial history
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
