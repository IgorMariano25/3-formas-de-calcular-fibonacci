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
        pointBorderColor: "#fff",
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
        pointBorderColor: "#fff",
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
        pointBorderColor: "#fff",
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
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#666",
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
          font: {
            size: 14,
            weight: "600",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Execution Time (ms)",
          font: {
            size: 14,
            weight: "600",
          },
        },
        type: "logarithmic",
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
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
