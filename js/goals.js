// ------------------- SAVE GOALS -------------------
async function saveGoals(e) {
  e.preventDefault();

  const userId = getUserId();
  if (!userId) {
    showMessage("User not logged in.", "danger");
    return;
  }

  const targetBill = document.getElementById("targetBill").value;
  const targetUsage = document.getElementById("targetUsage").value;
  const goalDate = document.getElementById("goalDate").value;

  if (!targetBill || !targetUsage || !goalDate) {
    showMessage("Please fill in all the fields");
    return;
  }

  const goals = {
    targetBill: parseFloat(targetBill) || 0,
    targetUsage: parseFloat(targetUsage) || 0,
    goalDate: goalDate || null
  };

  try {
    // ---- Save to backend ----
    const response = await fetch(`${BASE_URL}/api/EnergyGoals/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goals)
    });

    const result = await response.json();
    showMessage(result.message, "success");

    // ---- Save to AppState (localStorage) ----
    AppState.setGoals(goals);

  } catch (err) {
    console.error("Failed to save goals:", err);
    showMessage("Error saving goals. Please try again.", "danger");
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

    if (data.targetBill && data.targetUsage && data.goalDate) {
        if (goalsButton) goalsButton.innerHTML = "Update Goals";
    }

    // Sync into AppState
    AppState.setGoals({
      targetBill: parseFloat(data.targetBill) || 0,
      targetUsage: parseFloat(data.targetUsage) || 0,
      goalDate: data.goalDate || null
    });

  } catch (err) {
    console.error("Failed to load goals:", err);
  }
}
