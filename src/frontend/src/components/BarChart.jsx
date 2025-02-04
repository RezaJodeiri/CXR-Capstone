import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ data }) => {
  // Extract disease names and probabilities from JSON
  const labels = data.diseases.map((d) => d.name);
  const probabilities = data.diseases.map((d) => d.probability);

  // Chart.js Data
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Probability",
        data: probabilities,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart.js Options
  const options = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { beginAtZero: true, max: 1 }, // Probabilities range from 0 to 1
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
