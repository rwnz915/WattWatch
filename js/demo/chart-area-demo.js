// Helper function to format numbers with commas
function number_format(number, decimals = 0, dec_point = '.', thousands_sep = ',') {
    const n = isFinite(+number) ? +number : 0;
    const prec = Math.abs(decimals);
    let s = (prec ? n.toFixed(prec) : '' + Math.round(n)).split('.');
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands_sep);
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec_point);
}

// Months array starting from January
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Global variable to store chart instance
let myLineChart = null;

function renderUsageChart() {
    const ctx = document.getElementById("myAreaChart");
    if (!ctx) return;

    // Destroy previous chart if exists
    if (myLineChart) myLineChart.destroy();

    const calcu = AppState.getCalculator();
    const monthlyUsageData = Array(12).fill(0);

    // Set total kWh to the current month only
    const currentMonthIndex = new Date().getMonth(); // 0 = Jan
    if (calcu.totalKwhMonth) {
        monthlyUsageData[currentMonthIndex] = calcu.totalKwhMonth;
    }

    myLineChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: "Usages",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: monthlyUsageData,
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: { padding: { left: 10, right: 25, top: 25, bottom: 0 } },
            scales: {
                xAxes: [{
                    gridLines: { display: false, drawBorder: false },
                    ticks: { maxTicksLimit: 12 }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10,
                        callback: value => 'kWh ' + number_format(value)
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }]
            },
            legend: { display: false },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: (tooltipItem, chart) => {
                        return chart.datasets[tooltipItem.datasetIndex].label + ': kWh ' + number_format(tooltipItem.yLabel);
                    }
                }
            }
        }
    });
}
