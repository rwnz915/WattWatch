const API_BASE = "https://wattwatch-backend.onrender.com/api/billing";

function monthKeyFromDate(d = new Date()) {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}
function monthLabelFromDate(d = new Date()) {
    return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

//  Ensure correct loading sequence
async function initBillingPage() {
    await syncCurrentMonthToBackend();
    await ensureMonthRollover();
    await loadCurrentAndHistory();
}

//  Save or Update ACTIVE month
async function syncCurrentMonthToBackend() {
    const user = getUserInfo();
    if (!user?.id) return;

    const calcu = AppState.getCalculator();
    const payload = {
        userId: user.id,
        monthYear: monthKeyFromDate(),
        monthLabel: monthLabelFromDate(),
        kwhUsed: Number(calcu.totalKwhMonth || 0),
        totalAmount: Number(calcu.totalCostMonth || 0)
    };

    try {
        await fetch(`${API_BASE}/current/upsert`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.warn("syncCurrentMonthToBackend failed:", err);
    }
}

// Handle rollover if month changed
async function ensureMonthRollover() {
    const user = getUserInfo();
    if (!user?.id) return;

    try {
        const res = await fetch(`${API_BASE}/current/${user.id}`);
        const current = await res.json();

        const nowMonth = monthKeyFromDate();
        if (!current) {
            await syncCurrentMonthToBackend();
            return;
        }

        if (current.monthYear !== nowMonth) {
            await fetch(`${API_BASE}/current/rollover`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    oldMonthYear: current.monthYear,
                    newMonthYear: nowMonth,
                    newMonthLabel: monthLabelFromDate()
                })
            });
        }
    } catch (err) {
        console.warn("ensureMonthRollover failed:", err);
    }
}

// Load both active & closed month history
async function loadCurrentAndHistory() {
    const user = getUserInfo();
    if (!user?.id) return;

    try {
        // Load active month
        const resCurrent = await fetch(`${API_BASE}/current/${user.id}`);
        const current = await resCurrent.json();

        if (current) {
            animateValue(
                document.getElementById("ToPay"),
                0,
                Number(current.totalAmount || 0),
                800,
                "₱"
            );
            animateValue(
                document.getElementById("totalKwh"),
                0,
                Number(current.kwhUsed || 0),
                800,
                "kWh "
            );
        }

        // Load closed history list
        const resHist = await fetch(`${API_BASE}/history/${user.id}`);
        const hist = await resHist.json();

        const tbody = document.getElementById("historyBody");
        tbody.innerHTML = "";

        if (!hist?.length) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No history</td></tr>`;
            return;
        }

        hist.forEach(h => {
            const id = h.id;
            const monthLabel = h.monthLabel || h.month_label || "";
            let [monthName, year] = monthLabel.split(" ");
            const kwh = h.kwhUsed || h.kwh_used || h.totalKwh || 0;
            const total = h.totalAmount || h.total_amount || h.totalCost || 0;


            tbody.innerHTML += `
                <tr>
                    <td>${year}</td>
                    <td>${monthName}</td>
                    <td>${Number(kwh).toFixed(2)} kWh</td>
                    <td>₱${Number(total).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary mb-2 mt-1" onclick="viewHistoryDetails(${id})">View</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteHistory(${id})">Delete</button>
                    </td>
                </tr>`;
        });

    } catch (err) {
        console.error("loadCurrentAndHistory error:", err);
    }
}

// View bill modal
async function viewHistoryDetails(id) {
    try {
        // Fetch bill summary
        const res = await fetch(`${API_BASE}/${id}`);
        const bill = await res.json();

        const monthLabel = bill.monthLabel || bill.month_label;
        const kwh = bill.kwhUsed || bill.kwh_used || bill.totalKwh || 0;
        const total = bill.totalAmount || bill.total_amount || bill.totalCost || 0;

        // Fetch appliances used for this month
        const user = getUserInfo();
        const resApp = await fetch(`https://wattwatch-backend.onrender.com/api/calculation/history/${user.id}`);
        const appliances = await resApp.json();

        // Get user goals from AppState
        const goals = AppState.getGoals();

        // Build appliance list HTML
        let applianceHTML = "";
        if (appliances.length === 0) {
            applianceHTML = `<p class="text-muted">No appliances recorded.</p>`;
        } else {
            applianceHTML = `
                <ul class="list-group">
                    ${appliances.map(a => `
                        <li class="list-group-item small">
                            <strong>${a.appliance}</strong><br>
                            <span>Wattage: ${a.wattage}W</span><br>
                            <span>Hours/day: ${a.hours}</span><br>
                            <span>Type: ${a.type || "N/A"}</span>
                        </li>
                    `).join("")}
                </ul>
            `;
        }

        // Inject into modal
        document.getElementById("modalContent").innerHTML = `
            <p><strong>${monthLabel}</strong></p>
            <p>KWh: ${Number(kwh).toFixed(2)}</p>
            <p>Total: ₱${Number(total).toFixed(2)}</p>

            <hr>
            <h6 class="font-weight-bold">User Goals</h6>
            <p>Target Usage: ${Number(goals.targetUsage).toFixed(2)} kWh</p>
            <p>Target Bill: ₱${Number(goals.targetBill).toFixed(2)}</p>

            <hr>
            <h6 class="font-weight-bold">Appliances Used</h6>
            ${applianceHTML}
        `;

        // Show modal
        $("#detailsModal").modal("show");

    } catch (err) {
        console.error("viewHistoryDetails error:", err);
    }
}

// Delete single record
async function deleteHistory(id) {
    if (!showConfirm("Delete this history?")) return;
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    await loadCurrentAndHistory();
}

// Clear all (if button exists)
document.addEventListener("click", async e => {
    if (e.target.id === "clearHistoryBtn") {
        if (!showConfirm("Clear ALL history?")) return;

        const user = getUserInfo();
        await fetch(`${API_BASE}/history/${user.id}`, { method: "DELETE" });

        await loadCurrentAndHistory();
    }
});

document.addEventListener("click", e => {
    if (e.target.id === "exportExcelBtn") {
        exportHistoryToExcel();
    }
});

async function exportHistoryToExcel() {
    const user = getUserInfo();
    if (!user?.id) return;

    try {
        // --- GET BILL HISTORY ---
        const resHist = await fetch(`${API_BASE}/history/${user.id}`);
        const hist = await resHist.json();

        if (!hist || hist.length === 0) {
            alert("No history to export.");
            return;
        }

        // --- GET ALL APPLIANCES ---
        const resApp = await fetch(`https://wattwatch-backend.onrender.com/api/calculation/history/${user.id}`);
        const appliances = await resApp.json();

        const rows = [];

        hist.forEach(h => {
            const monthLabel = h.monthLabel || h.month_label || "";
            const [month, year] = monthLabel.split(" ");
            const kwh = Number(h.kwhUsed || h.kwh_used || h.totalKwh || 0).toFixed(2);
            const total = Number(h.totalAmount || h.total_amount || h.totalCost || 0).toFixed(2);

            if (appliances.length === 0) {
                rows.push({
                    Year: year || "",
                    Month: month || "",
                    "KWh Used": kwh,
                    "Total Amount (₱)": total,
                    Appliance: "",
                    Wattage: "",
                    "Hours/Day": ""
                });
            } else {
                appliances.forEach(app => {
                    rows.push({
                        Year: year || "",
                        Month: month || "",
                        "KWh Used": kwh,
                        "Total Amount (₱)": total,
                        Appliance: app.appliance || "",
                        Wattage: app.wattage || "",
                        "Hours/Day": app.hours || ""
                    });
                });
            }
        });

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Billing History");
        XLSX.writeFile(workbook, "Billing_History_With_Appliances.xlsx");

    } catch (err) {
        console.error("Export error:", err);
    }
}
