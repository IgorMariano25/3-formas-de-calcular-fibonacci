const chartCanvas = document.getElementById("fibonacciChart");
const ctx = chartCanvas.getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Recursive",
        borderColor: "#ff6b6b",
        backgroundColor: "rgba(255, 107, 107, 0.1)",
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ff6b6b",
        pointBorderColor: "#2d3748",
        pointBorderWidth: 2,
        tension: 0.4,
        data: [],
      },
      {
        label: "Memoization",
        borderColor: "#4ecdc4",
        backgroundColor: "rgba(78, 205, 196, 0.1)",
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#4ecdc4",
        pointBorderColor: "#2d3748",
        pointBorderWidth: 2,
        tension: 0.4,
        data: [],
      },
      {
        label: "Matrix",
        borderColor: "#45b7d1",
        backgroundColor: "rgba(69, 183, 209, 0.1)",
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#45b7d1",
        pointBorderColor: "#2d3748",
        pointBorderWidth: 2,
        tension: 0.4,
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          color: "#e2e8f0",
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(26, 32, 44, 0.95)",
        titleColor: "#f7fafc",
        bodyColor: "#e2e8f0",
        borderColor: "#4fd1c7",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(
              3
            )} ms`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Fibonacci Number (N)",
          color: "#e2e8f0",
          font: {
            size: 14,
            weight: "600",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#cbd5e0",
          font: {
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Execution Time (ms)",
          color: "#e2e8f0",
          font: {
            size: 14,
            weight: "600",
          },
        },
        type: "logarithmic",
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#cbd5e0",
          font: {
            size: 12,
          },
          callback: function (value) {
            return value.toFixed(3) + " ms";
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  },
});

const ws = new WebSocket("ws://localhost:3000");

// Update status elements
const statusElement = document.getElementById("status");
const currentNElement = document.getElementById("currentN");
const fastestMethodElement = document.getElementById("fastestMethod");

ws.onopen = () => {
  statusElement.textContent = "Connected";
  statusElement.style.background = "linear-gradient(135deg, #48bb78, #38a169)";
  statusElement.style.color = "white";
};

ws.onclose = () => {
  statusElement.textContent = "Disconnected";
  statusElement.style.background = "linear-gradient(135deg, #f56565, #e53e3e)";
  statusElement.style.color = "white";
};

ws.onerror = () => {
  statusElement.textContent = "Error";
  statusElement.style.background = "linear-gradient(135deg, #ed8936, #dd6b20)";
  statusElement.style.color = "white";
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.n !== undefined) {
    // Update current N
    currentNElement.textContent = data.n;

    if (!chart.data.labels.includes(data.n)) {
      chart.data.labels.push(data.n);
      chart.data.labels.sort((a, b) => a - b);
    }

    const dataset = chart.data.datasets.find(
      (d) => d.label.toLowerCase() === data.method
    );
    if (dataset) {
      const index = chart.data.labels.indexOf(data.n);
      dataset.data[index] = data.time;
    }

    // Find fastest method for current N
    updateFastestMethod(data.n);

    chart.update("none"); // Smooth update without animation
  }
};

function updateFastestMethod(n) {
  const times = {};
  chart.data.datasets.forEach((dataset) => {
    const index = chart.data.labels.indexOf(n);
    if (index !== -1 && dataset.data[index] !== undefined) {
      times[dataset.label] = dataset.data[index];
    }
  });

  if (Object.keys(times).length > 0) {
    const fastest = Object.entries(times).reduce((a, b) =>
      times[a[0]] < times[b[0]] ? a : b
    );
    fastestMethodElement.textContent = fastest[0];

    // Color code based on method
    if (fastest[0] === "Recursive") {
      fastestMethodElement.style.background =
        "linear-gradient(135deg, #ff6b6b, #ee5a52)";
    } else if (fastest[0] === "Memoization") {
      fastestMethodElement.style.background =
        "linear-gradient(135deg, #4ecdc4, #44b3ab)";
    } else {
      fastestMethodElement.style.background =
        "linear-gradient(135deg, #45b7d1, #3a9bc1)";
    }
    fastestMethodElement.style.color = "white";
  }
}

// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const body = document.body;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem("theme") || "dark";
if (currentTheme === "light") {
  body.classList.add("light-mode");
  themeIcon.textContent = "☀️";
}

// Theme toggle event listener
themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  const isLightMode = body.classList.contains("light-mode");

  // Update icon
  themeIcon.textContent = isLightMode ? "☀️" : "🌙";

  // Save preference
  localStorage.setItem("theme", isLightMode ? "light" : "dark");

  // Update chart colors
  updateChartTheme(isLightMode);
});

// Function to update chart theme
function updateChartTheme(isLightMode) {
  const colors = isLightMode
    ? {
        legend: "#2d3748",
        title: "#2d3748",
        ticks: "#4a5568",
        grid: "rgba(0, 0, 0, 0.1)",
        tooltip: {
          background: "rgba(255, 255, 255, 0.95)",
          title: "#2d3748",
          body: "#4a5568",
          border: "#e2e8f0",
        },
        pointBorder: "#fff",
      }
    : {
        legend: "#e2e8f0",
        title: "#e2e8f0",
        ticks: "#cbd5e0",
        grid: "rgba(255, 255, 255, 0.1)",
        tooltip: {
          background: "rgba(26, 32, 44, 0.95)",
          title: "#f7fafc",
          body: "#e2e8f0",
          border: "#4fd1c7",
        },
        pointBorder: "#2d3748",
      };

  // Update chart options
  chart.options.plugins.legend.labels.color = colors.legend;
  chart.options.plugins.tooltip.backgroundColor = colors.tooltip.background;
  chart.options.plugins.tooltip.titleColor = colors.tooltip.title;
  chart.options.plugins.tooltip.bodyColor = colors.tooltip.body;
  chart.options.plugins.tooltip.borderColor = colors.tooltip.border;

  chart.options.scales.x.title.color = colors.title;
  chart.options.scales.x.ticks.color = colors.ticks;
  chart.options.scales.x.grid.color = colors.grid;

  chart.options.scales.y.title.color = colors.title;
  chart.options.scales.y.ticks.color = colors.ticks;
  chart.options.scales.y.grid.color = colors.grid;

  // Update dataset point borders
  chart.data.datasets.forEach((dataset) => {
    dataset.pointBorderColor = colors.pointBorder;
  });

  chart.update();
}

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const isLightMode = body.classList.contains("light-mode");
  updateChartTheme(isLightMode);
});
