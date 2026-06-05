document.addEventListener("DOMContentLoaded", function () {
  initializeRiskDistribution();
  initializeHeatmap();
  initializeTrendChart();
  initializeRadarChart();
});

/* -------------------------------- */
/* RISK DISTRIBUTION (DONUT CHART) */
/* -------------------------------- */

function initializeRiskDistribution() {
  const canvas = document.getElementById("riskChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "doughnut",

    data: {
      labels: ["Critical", "High", "Medium", "Low"],

      datasets: [
        {
          data: [12, 45, 120, 165],

          backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e"],

          borderWidth: 0,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
      },

      cutout: "65%",
    },
  });
}

/* ------------------------------- */
/* EXECUTIVE RISK HEATMAP */
/* ------------------------------- */

function initializeHeatmap() {
  const canvas = document.getElementById("heatmapChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",

    data: {
      labels: ["Tier 1 Vendors", "Tier 2 Vendors", "Tier 3 Vendors"],

      datasets: [
        {
          label: "Critical",
          data: [2, 1, 0],
          backgroundColor: "#dc2626",
        },

        {
          label: "High",
          data: [3, 2, 1],
          backgroundColor: "#f97316",
        },

        {
          label: "Medium",
          data: [4, 5, 2],
          backgroundColor: "#eab308",
        },

        {
          label: "Low",
          data: [6, 4, 3],
          backgroundColor: "#22c55e",
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          position: "bottom",
        },
      },

      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
        },
      },
    },
  });
}

/* ------------------------------- */
/* VENDOR RISK TREND */
/* ------------------------------- */

function initializeTrendChart() {
  const canvas = document.getElementById("trendChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "line",

    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],

      datasets: [
        {
          label: "Vendor Risk Score",

          data: [85, 86, 84, 80, 72, 65, 58, 42],

          borderColor: "#ef4444",

          backgroundColor: "rgba(239,68,68,0.1)",

          fill: true,

          tension: 0.4,

          pointRadius: 4,
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },

      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

/* ------------------------------- */
/* SECURITY CATEGORY RADAR */
/* ------------------------------- */

function initializeRadarChart() {
  const canvas = document.getElementById("radarChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "radar",

    data: {
      labels: [
        "Cyber & Infrastructure",
        "Identity & Leaks",
        "Financial Health",
        "Compliance",
      ],

      datasets: [
        {
          label: "Security Score",

          data: [45, 85, 92, 60],

          backgroundColor: "rgba(59,130,246,0.2)",

          borderColor: "#2563eb",

          pointBackgroundColor: "#2563eb",
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },

      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });
}
