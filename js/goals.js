// ------------------- SAVE GOALS -------------------
async function saveGoals(e) {
  e.preventDefault();

  const userId = getUserId();
  if (!userId) {
    showMessage("User not logged in.", "danger");
    return;
  }

  const targetBill = parseFloat(document.getElementById("targetBill").value) || 0;
  const goalDate = document.getElementById("goalDate").value;

  if (!targetBill || !goalDate) {
    showMessage("Please fill in all fields", "danger");
    return;
  }

  // Auto-calculate usage from bill
  const targetUsage = (targetBill / AppState.getElectricityRate()).toFixed(2);

  const goals = { targetBill, targetUsage, goalDate };

  try {
    const response = await fetch(`${BASE_URL}/api/EnergyGoals/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goals)
    });

    const result = await response.json();
    showMessage(result.message, "success");

    // Update AppState immediately
    AppState.setGoals(goals);

    // Update UI
    await loadCurrentGoals();
    initUserPage();

  } catch (err) {
    console.error("Failed to save goals:", err);
    showMessage("Error saving goals. Please try again.", "danger");
  }
}

// ------------------- LOAD CURRENT GOALS -------------------
async function loadCurrentGoals() {
  const userId = getUserId();
  if (!userId) return;

  try {
    const response = await fetch(`${BASE_URL}/api/EnergyGoals/${userId}`);
    const data = await response.json();

    const list = document.getElementById("currentGoals");
    list.innerHTML = "";

    if (data.targetBill && data.goalDate) {
      const targetUsage = (data.targetBill / AppState.getElectricityRate()).toFixed(2);

      list.innerHTML = `
        <li class="list-group-item"><strong>Target Bill:</strong> ₱${data.targetBill}</li>
        <li class="list-group-item"><strong>Target Usage:</strong> ${targetUsage} kWh</li>
        <li class="list-group-item"><strong>Deadline:</strong> ${new Date(data.goalDate).toLocaleDateString()}</li>
      `;
      document.getElementById("saveGoals").innerHTML = "Update Goals";
    } else {
      list.innerHTML = `<li class="list-group-item text-muted">No current goals</li>`;
      document.getElementById("saveGoals").innerHTML = "Save Goal";
    }

  } catch (err) {
    console.error("Failed to load goals:", err);
  }
}

// ------------------- CLEAR GOALS -------------------
async function clearGoals(e) {
  e.preventDefault();
  const userId = getUserId();
  if (!userId) return;

  const confirmed = await showConfirm("Are you sure you want to clear your goals?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${BASE_URL}/api/EnergyGoals/clear/${userId}`, {
      method: "DELETE"
    });
    const result = await response.json();

    showMessage(result.message, "info");

    // Update AppState immediately
    AppState.clearGoals();

    // Update UI
    await loadCurrentGoals();
    initUserPage();

  } catch (err) {
    console.error("Failed to clear goals:", err);
    showMessage("Error clearing goals. Please try again.", "danger");
  }
}

// ------------------- INIT GOALS PAGE -------------------
async function initGoalsPage() {
  const userId = getUserId();
  if (!userId) return;

  try {
    const response = await fetch(`${BASE_URL}/api/EnergyGoals/${userId}`);
    const data = await response.json();

    let goalsButton = document.getElementById("saveGoals");

    if (data.targetBill && data.goalDate) {
        if (goalsButton) goalsButton.innerHTML = "Update Goals";
    }

    AppState.setGoals({
      targetBill: parseFloat(data.targetBill) || 0,
      targetUsage: data.targetUsage 
        ? parseFloat(data.targetUsage) 
        : (data.targetBill ? (data.targetBill / AppState.getElectricityRate()).toFixed(2) : 0),
      goalDate: data.goalDate || null
    });

  } catch (err) {
    console.error("Failed to load goals:", err);
  }

  console.log(AppState.getElectricityRate());
}
