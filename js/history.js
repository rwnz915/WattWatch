const API_BASE = "https://wattwatch-backend.onrender.com/api/billing";

function monthKeyFromDate(d = new Date()) {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}
function monthLabelFromDate(d = new Date()) {
    return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

// ✅ Ensure correct loading sequence
async function initBillingPage() {
    await syncCurrentMonthToBackend();
    await ensureMonthRollover();
    await loadCurrentAndHistory();
}

// ✅ Save or Update ACTIVE month
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

// ✅ Handle rollover if month changed
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

// ✅ Load both active & closed month history
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
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No billing history</td></tr>`;
            return;
        }

        hist.forEach(h => {
            const id = h.id;
            const monthLabel = h.monthLabel || h.month_label;
            const kwh = h.kwhUsed || h.kwh_used || h.totalKwh || 0;
            const total = h.totalAmount || h.total_amount || h.totalCost || 0;


            tbody.innerHTML += `
                <tr>
                    <td>${monthLabel}</td>
                    <td>${Number(kwh).toFixed(2)} kWh</td>
                    <td>₱${Number(total).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewHistoryDetails(${id})">View</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteHistory(${id})">Delete</button>
                    </td>
                </tr>`;
        });

    } catch (err) {
        console.error("loadCurrentAndHistory error:", err);
    }
}

// ✅ View bill modal
async function viewHistoryDetails(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    const bill = await res.json();

    const monthLabel = bill.monthLabel || bill.month_label;
    const kwh = bill.kwhUsed || bill.kwh_used || bill.totalKwh || 0;
    const total = bill.totalAmount || bill.total_amount || bill.totalCost || 0;

    document.getElementById("modalContent").innerHTML = `
        <p><strong>${monthLabel}</strong></p>
        <p>KWh: ${Number(kwh).toFixed(2)}</p>
        <p>Total: ₱${Number(total).toFixed(2)}</p>
    `;

    $("#detailsModal").modal("show");
}

// ✅ Delete single record
async function deleteHistory(id) {
    if (!confirm("Delete this bill?")) return;
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    await loadCurrentAndHistory();
}

// ✅ Clear all (if button exists)
document.addEventListener("click", async e => {
    if (e.target.id === "clearHistoryBtn") {
        if (!confirm("Clear ALL billing history?")) return;

        const user = getUserInfo();
        await fetch(`${API_BASE}/history/${user.id}`, { method: "DELETE" });

        await loadCurrentAndHistory();
    }
});
