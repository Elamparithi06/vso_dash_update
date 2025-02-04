import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ reportData }) => {
  if (!reportData || reportData.length === 0) {
    return <p>No data available for the chart.</p>;
  }

  // Extract labels and values for the bar chart
  const labels = reportData.map((row) => row.vso); // Using VSO as labels
  const totalRemarksData = reportData.map((row) => row.totalRemarks);
  const criticalData = reportData.map((row) => row.critical);
  
  // Calculate NC% (total NC remarks / 18 * 100)
  const totalNC = reportData.reduce((count, row) => count + (row.remark === "NC" ? 1 : 0), 0);
  const ncPercentage = ((totalNC / 18) * 100).toFixed(2);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Total Remarks",
        data: totalRemarksData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Critical Issues",
        data: criticalData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "NC%",
        data: Array(labels.length).fill(ncPercentage), // Show NC% as a constant value for all VSOs
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Audit Report Summary" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
