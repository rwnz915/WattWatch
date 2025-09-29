// ---------- Data for cascading dropdown ----------
const applianceData = {
  "Air Conditioner": {
    "Window Type": ["Carrier Optima", "Panasonic CW-XN620JPH", "Condura WCON09"],
    "Split Type": ["LG DualCool", "Samsung WindFree", "Kolins Inverter Split"],
    "Portable": ["Midea 1HP Portable", "Imarflex IAC-1200S"]
  },
  "Electric Fan": {
    "Stand Fan": ["Asahi SF-20", "Hanabishi HS-16", "Union UGSF-161"],
    "Desk Fan": ["3D DF-602", "Union UDF-131", "Imarflex IF-612", "SYCAT FC-180"],
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
  "Carrier Optima": { wattage: 1200, hours: 8, rate: AppState.getElectricityRate() },
  "Panasonic CW-XN620JPH": { wattage: 1500, hours: 6, rate: AppState.getElectricityRate() },
  "Condura WCON09": { wattage: 1000, hours: 8, rate: AppState.getElectricityRate() },
  "LG DualCool": { wattage: 1000, hours: 7, rate: AppState.getElectricityRate() },
  "Samsung WindFree": { wattage: 1100, hours: 6, rate: AppState.getElectricityRate() },
  "Kolins Inverter Split": { wattage: 950, hours: 7, rate: AppState.getElectricityRate() },
  "Midea 1HP Portable": { wattage: 900, hours: 5, rate: AppState.getElectricityRate() },
  "Imarflex IAC-1200S": { wattage: 1000, hours: 5, rate: AppState.getElectricityRate() },

  // Fans
  "Asahi SF-20": { wattage: 75, hours: 6, rate: AppState.getElectricityRate() },
  "Hanabishi HS-16": { wattage: 65, hours: 6, rate: AppState.getElectricityRate() },
  "Union UGSF-161": { wattage: 70, hours: 6, rate: AppState.getElectricityRate() },
  "3D DF-602": { wattage: 50, hours: 5, rate: AppState.getElectricityRate() },
  "Union UDF-131": { wattage: 55, hours: 5, rate: AppState.getElectricityRate() },
  "Imarflex IF-612": { wattage: 60, hours: 5, rate: AppState.getElectricityRate() },
  "SYCAT FC-180": { wattage: 40, hours: 4, rate: AppState.getElectricityRate() },
  "KDK Tower 40": { wattage: 70, hours: 7, rate: AppState.getElectricityRate() },
  "Hanabishi HTF-600": { wattage: 80, hours: 7, rate: AppState.getElectricityRate() },

  // Ref
  "Fujidenzo RDD-60": { wattage: 150, hours: 24, rate: AppState.getElectricityRate() },
  "Condura CPR90T": { wattage: 160, hours: 24, rate: AppState.getElectricityRate() },
  "LG GR-B202SQBB": { wattage: 250, hours: 24, rate: AppState.getElectricityRate() },
  "Whirlpool WDE205": { wattage: 230, hours: 24, rate: AppState.getElectricityRate() },
  "Samsung RT20FARVDSA": { wattage: 240, hours: 24, rate: AppState.getElectricityRate() },
  "Samsung RS62R5001": { wattage: 400, hours: 24, rate: AppState.getElectricityRate() },
  "Panasonic NR-BS60": { wattage: 380, hours: 24, rate: AppState.getElectricityRate() },

  // TV
  "Samsung UA32T": { wattage: 50, hours: 6, rate: AppState.getElectricityRate() },
  "Sony Bravia KDL32": { wattage: 55, hours: 6, rate: AppState.getElectricityRate() },
  "TCL 32S65A": { wattage: 45, hours: 6, rate: AppState.getElectricityRate() },
  "LG 43UN": { wattage: 70, hours: 6, rate: AppState.getElectricityRate() },
  "TCL 55P725": { wattage: 80, hours: 6, rate: AppState.getElectricityRate() },
  "Hisense 43A4GS": { wattage: 65, hours: 6, rate: AppState.getElectricityRate() },
  "LG OLED55": { wattage: 120, hours: 6, rate: AppState.getElectricityRate() },
  "Sony A80J": { wattage: 130, hours: 6, rate: AppState.getElectricityRate() },

  // Washing Machine
  "LG T2108": { wattage: 500, hours: 1, rate: AppState.getElectricityRate() },
  "Samsung WA75H4200": { wattage: 450, hours: 1, rate: AppState.getElectricityRate() },
  "Sharp ES-JN06": { wattage: 400, hours: 1, rate: AppState.getElectricityRate() },
  "Whirlpool FWG710": { wattage: 600, hours: 1, rate: AppState.getElectricityRate() },
  "Electrolux EWF8025": { wattage: 550, hours: 1, rate: AppState.getElectricityRate() },

  // Microwave
  "Panasonic NN-ST34": { wattage: 1000, hours: 0.5, rate: AppState.getElectricityRate() },
  "Sharp R-20A": { wattage: 900, hours: 0.5, rate: AppState.getElectricityRate() },
  "LG MH6535": { wattage: 1200, hours: 0.5, rate: AppState.getElectricityRate() },
  "Samsung MG23": { wattage: 1100, hours: 0.5, rate: AppState.getElectricityRate() },
  "Imarflex IMX-2000": { wattage: 1000, hours: 0.5, rate: AppState.getElectricityRate() },

  // Rice Cooker
  "Hanabishi HRC15": { wattage: 400, hours: 1, rate: AppState.getElectricityRate() },
  "Imarflex IRC18": { wattage: 350, hours: 1, rate: AppState.getElectricityRate() },
  "3D RC-600": { wattage: 300, hours: 1, rate: AppState.getElectricityRate() },
  "Instant Pot Duo": { wattage: 1000, hours: 1, rate: AppState.getElectricityRate() },
  "Philips HD4515": { wattage: 950, hours: 1, rate: AppState.getElectricityRate() },
  "Tefal RK8121": { wattage: 900, hours: 1, rate: AppState.getElectricityRate() },

  // Laptop
  "MacBook Air M2": { wattage: 30, hours: 8, rate: AppState.getElectricityRate() },
  "Dell XPS 13": { wattage: 35, hours: 8, rate: AppState.getElectricityRate() },
  "Asus Zenbook 14": { wattage: 40, hours: 8, rate: AppState.getElectricityRate() },
  "Asus ROG Strix": { wattage: 150, hours: 8, rate: AppState.getElectricityRate() },
  "MSI GF63": { wattage: 140, hours: 8, rate: AppState.getElectricityRate() },
  "Acer Nitro 5": { wattage: 160, hours: 8, rate: AppState.getElectricityRate() },

  // Desktop
  "HP Slimline": { wattage: 200, hours: 8, rate: AppState.getElectricityRate() },
  "Acer Aspire": { wattage: 180, hours: 8, rate: AppState.getElectricityRate() },
  "NZXT Player": { wattage: 400, hours: 8, rate: AppState.getElectricityRate() },
  "Lenovo Legion": { wattage: 420, hours: 8, rate: AppState.getElectricityRate() },
  "Asus TUF Gaming": { wattage: 380, hours: 8, rate: AppState.getElectricityRate() },

  // Water Heater
  "Stiebel Eltron DHC": { wattage: 3500, hours: 1, rate: AppState.getElectricityRate() },
  "Panasonic DH-3": { wattage: 3000, hours: 1, rate: AppState.getElectricityRate() },
  "Ariston Pro1": { wattage: 1500, hours: 2, rate: AppState.getElectricityRate() },
  "Rheem Prestige": { wattage: 2000, hours: 2, rate: AppState.getElectricityRate() },

  // Lights
  "Philips 9W LED": { wattage: 9, hours: 6, rate: AppState.getElectricityRate() },
  "Firefly LED 9W": { wattage: 9, hours: 6, rate: AppState.getElectricityRate() },
  "Omni LED 7W": { wattage: 7, hours: 6, rate: AppState.getElectricityRate() },
  "GE T8 18W": { wattage: 18, hours: 6, rate: AppState.getElectricityRate() },
  "Panasonic T8 20W": { wattage: 20, hours: 6, rate: AppState.getElectricityRate() },
  "Firefly CFL 15W": { wattage: 15, hours: 6, rate: AppState.getElectricityRate() },
  "Philips Tornado 15W": { wattage: 15, hours: 6, rate: AppState.getElectricityRate() }
};

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
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  });
});

// Cascading dropdowns with visibility toggle
function setupCascadingDropdowns() {
  const applianceSelect = document.getElementById("appliance");
  const typeSelect = document.getElementById("type");
  const modelSelect = document.getElementById("model");

  const typeGroup = document.getElementById("type-group");
  const modelGroup = document.getElementById("model-group");

  applianceSelect.addEventListener("change", () => {
    const selectedAppliance = applianceSelect.value;
    typeSelect.innerHTML = '<option value="">-- Select Type --</option>';
    modelSelect.innerHTML = '<option value="">-- Select Brand / Model --</option>';
    typeSelect.disabled = true;
    modelSelect.disabled = true;
    modelGroup.style.display = "none";

    if (selectedAppliance && applianceData[selectedAppliance]) {
      Object.keys(applianceData[selectedAppliance]).forEach(type => {
        const opt = document.createElement("option");
        opt.value = type;
        opt.textContent = type;
        typeSelect.appendChild(opt);
      });
      typeSelect.disabled = false;
      typeGroup.style.display = "block";
    } else {
      typeGroup.style.display = "none";
    }
  });

  typeSelect.addEventListener("change", () => {
    const selectedAppliance = applianceSelect.value;
    const selectedType = typeSelect.value;
    modelSelect.innerHTML = '<option value="">-- Select Brand / Model --</option>';
    modelSelect.disabled = true;

    if (selectedAppliance && selectedType && applianceData[selectedAppliance][selectedType]) {
      applianceData[selectedAppliance][selectedType].forEach(model => {
        const opt = document.createElement("option");
        opt.value = model;
        opt.textContent = model;
        modelSelect.appendChild(opt);
      });
      modelSelect.disabled = false;
      modelGroup.style.display = "block";
    } else {
      modelGroup.style.display = "none";
    }
  });

  modelSelect.addEventListener("change", () => {
    const selectedModel = modelSelect.value;
    if (applianceDefaults[selectedModel]) {
      document.getElementById("wattage").value = applianceDefaults[selectedModel].wattage;
      document.getElementById("hours").value = applianceDefaults[selectedModel].hours;
      document.getElementById("rate").value = applianceDefaults[selectedModel].rate;
    }
  });
}

// ---------- Calculator ----------
let total = 0;
let historyItems = [];

async function saveCalculation(userId, appliance, type, model, wattage, hours, rate) {
  try {
    await fetch("https://wattwatch-backend.onrender.com/api/calculation/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, appliance, type, model, wattage, hours, rate })
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadCalculationHistory(userId) {
  try {
    const res = await fetch(`https://wattwatch-backend.onrender.com/api/calculation/history/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    const data = await res.json();

    const historyList = document.getElementById("history");
    const monthlyTotal = document.getElementById("monthlyTotal");
    historyList.innerHTML = "";
    let total = 0;
    //let khwtotal = 0;

    if (data && data.length > 0) {
       AppState.clearCalculator();

      data.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${item.appliance} ${item.model} - ₱${parseFloat(item.costMonth).toFixed(2)}/month`;
        historyList.appendChild(li);
        total += parseFloat(item.costMonth);
        //let kwhDay = (item.wattage / 1000) * item.hours;
        //khwtotal = kwhDay * 30;
        AppState.addCalculator({
          appliance: item.appliance,
          type: item.type,
          model: item.model,
          wattage: item.wattage,
          hours: item.hours,
          rate: item.rate
        });

        initUserPage();

        //const allCalculations = AppState.getCalculator();
        //console.log("All calculations: ", allCalculations);
      });
    } else {
      historyList.innerHTML = '<li class="list-group-item text-muted">No recent calculations</li>';
    }
    monthlyTotal.textContent = `₱${total.toFixed(2)}`;
  } catch (err) {
    console.error(err);
  }
}

// ---------- Render history ----------
function renderHistory() {
  historyList.innerHTML = "";
  if (historyItems.length === 0) {
    historyList.innerHTML = '<li class="list-group-item text-muted">No recent calculations</li>';
    return;
  }
  historyItems.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = item;
    historyList.appendChild(li);
  });
}

// ---------- Init Calculator Page ----------
async function initCalculatorPage() {
  setupCascadingDropdowns();
  preventInvalidNumberInput();
  const applianceSelect = document.getElementById("appliance");
  const typeSelect = document.getElementById("type");
  const modelSelect = document.getElementById("model");
  const form = document.getElementById("calcForm");
  const result = document.getElementById("result");
  const historyList = document.getElementById("history");
  const monthlyTotal = document.getElementById("monthlyTotal");
  const clearForm = document.getElementById("clearForm");

  if (!form) return;

  const user = getUserInfo();
  if (!user || !user.id) return;

  // --- Load backend history ---
  AppState.clearCalculator();
  await loadCalculationHistory(user.id);

  // --- Cascading dropdowns ---
  applianceSelect.addEventListener("change", () => {
    const selected = applianceSelect.value;
    typeSelect.innerHTML = '<option value="">-- Select Type --</option>';
    modelSelect.innerHTML = '<option value="">-- Select Brand / Model --</option>';
    modelSelect.disabled = true;

    if (selected && applianceData[selected]) {
      Object.keys(applianceData[selected]).forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        typeSelect.appendChild(opt);
      });
      typeSelect.disabled = false;
    } else typeSelect.disabled = true;
  });

  typeSelect.addEventListener("change", () => {
    const appliance = applianceSelect.value;
    const type = typeSelect.value;
    modelSelect.innerHTML = '<option value="">-- Select Brand / Model --</option>';

    if (appliance && type && applianceData[appliance][type]) {
      applianceData[appliance][type].forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        modelSelect.appendChild(opt);
      });
      modelSelect.disabled = false;
    } else modelSelect.disabled = true;
  });

  modelSelect.addEventListener("change", () => {
    const selectedModel = modelSelect.value;
    if (applianceDefaults[selectedModel]) {
      document.getElementById("wattage").value = applianceDefaults[selectedModel].wattage;
      document.getElementById("hours").value = applianceDefaults[selectedModel].hours;
      document.getElementById("rate").value = applianceDefaults[selectedModel].rate;
    }
  });

  // --- Form submit ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const appliance = applianceSelect.value;
    const type = typeSelect.value;
    const model = modelSelect.value;
    const wattage = parseFloat(document.getElementById("wattage").value);
    const hours = parseFloat(document.getElementById("hours").value);
    const rate = parseFloat(document.getElementById("rate").value);

    if (!appliance || !type || !model || isNaN(wattage) || isNaN(hours) || isNaN(rate)) {
      alert("Complete all fields correctly.");
      return;
    }

    AppState.clearCalculator();
    await saveCalculation(user.id, appliance, type, model, wattage, hours, rate);
    await loadCalculationHistory(user.id);

    const dailyKWh = (wattage / 1000) * hours;
    const dailyCost = dailyKWh * rate;
    const weeklyCost = dailyCost * 7;
    const monthlyCost = dailyCost * 30;
    result.innerHTML = `${appliance} - ${type} - ${model}:<br>` +
    `Cost/day = ₱${dailyCost.toFixed(2)}<br>` +
    `Cost/week = ₱${weeklyCost.toFixed(2)}<br>` +
    `Cost/month = ₱${monthlyCost.toFixed(2)}`;

    /*result.textContent =
    `${appliance} - ${type} - ${model}:<br>` +
    `Cost/day = ₱${trim(dailyCost.toFixed(2))}<br>` +
    `Cost/week = ₱${trim(weeklyCost)}<br>` +
    `Cost/month = ₱${trim(monthlyCost)}`;*/

    // ✅ Reset form fields
    form.reset();

    // ✅ Hide Type and Model groups again
    document.getElementById("type-group").style.display = "none";
    document.getElementById("model-group").style.display = "none";

    // ✅ Disable Type and Model dropdowns
    typeSelect.disabled = true;
    modelSelect.disabled = true;

    // Reset dropdown options
    typeSelect.innerHTML = '<option value="">-- Select Type --</option>';
    modelSelect.innerHTML = '<option value="">-- Select Brand / Model --</option>';
  });


  // --- Clear button ---
  clearForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const confirmed = await showConfirm("Are you sure you want to clear your calculations?");
    if (!confirmed) return;

    await fetch(`https://wattwatch-backend.onrender.com/api/calculation/clear/${user.id}`, { method: "DELETE" });
    await loadCalculationHistory(user.id);
    result.textContent = "";
    AppState.clearCalculator();
    initUserPage();
  });
}

function preventInvalidNumberInput() {
  document.querySelectorAll(".only-numbers").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      const invalidKeys = ["e", "E", "+", "-"];
      if (invalidKeys.includes(e.key)) {
        e.preventDefault();
      }

      // ❌ Prevent "." as first character
      if (e.key === "." && input.value.length === 0) {
        e.preventDefault();
      }

      // ❌ Prevent multiple decimals
      if (e.key === "." && input.value.includes(".")) {
        e.preventDefault();
      }
    });

    input.addEventListener("input", () => {
      const cursorPos = input.selectionStart;
      let value = input.value;

      // Remove invalid characters (works on desktop + mobile)
      let cleaned = value.replace(/[eE\+\-]/g, "");

      // ❌ Block if first char is "."
      if (cleaned.startsWith(".")) {
        cleaned = ""; // clear input
      }

      if (cleaned !== value) {
        input.value = cleaned;
        input.setSelectionRange(cleaned.length, cleaned.length);
      } else {
        input.setSelectionRange(cursorPos, cursorPos);
      }
    });

    // 📱 Mobile-friendly attributes
    input.setAttribute("inputmode", "decimal"); // shows numeric keypad w/ dot
    input.setAttribute("pattern", "[0-9]*[.]?[0-9]*");
    input.setAttribute("step", "any");
    input.setAttribute("autocomplete", "off");
  });
}
