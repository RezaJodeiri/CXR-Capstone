import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ data }) => {

    const processData = (data) => {
        // Extract disease names and probabilities from JSON
        const labels = data.diseases.map((d) => d.name);
        const probabilities = data.diseases.map((d) => d.probability);

        // Combine labels and probabilities into an array of objects
        const combinedData = labels.map((label, index) => ({
            label,
            probability: probabilities[index],
        }));

        // Sort combined data by probability in descending order
        combinedData.sort((a, b) => b.probability - a.probability);

        // Extract sorted labels and probabilities
        const sortedLabels = combinedData.map((d) => d.label);
        const sortedProbabilities = combinedData.map((d) => d.probability);

        return { sortedLabels, sortedProbabilities };
    };

    const { sortedLabels, sortedProbabilities } = processData(data);

    // Chart.js Data
    const chartData = {
        labels: sortedLabels,
        datasets: [
            {
                label: "Probability",
                data: sortedProbabilities,
                backgroundColor: "rgba(0, 82, 136, 0.6)",
                borderColor: "rgba(0, 82, 136, 0.6)",
                borderWidth: 2,
            },
        ],
    };

    const options = {
        indexAxis: "y", // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false, // Allows dynamic resizing
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 1,
                title: {
                    display: true,
                    text: "Probability", // X-axis title
                    font: { size: 16, weight: "bold" },
                },
            },
            y: {
                ticks: {
                    autoSkip: false, // Ensures all labels are displayed
                    font: { size: 14 }, // Increases font size for readability
                },
                title: {
                    display: true,
                    text: "Diseases", // Y-axis title
                    font: { size: 16, weight: "bold" },
                },
            },
        },
        layout: {
            padding: {
                left: 20, // Adds more space to the left
            },
        },
    };
    
    // Wrap the chart in a div with a fixed size
    return (
        <div style={{
            width: "800px", 
            height: "600px", 
            border: "2px solid black", // Adds a black border
            borderRadius: "8px", // Optional: rounded corners
            padding: "10px", // Adds some space inside the border
            boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)", // Optional: subtle shadow
            backgroundColor: "white" // Ensures a clean background
        }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarChart;


// const convertPredictionsToData = (predictions) => {
//   return {
//     diseases: Object.keys(predictions).map((key) => ({
//       name: key,
//       probability: predictions[key],
//     })),
//   };
// };

// const predictions = {
//   "Nodule": 0.6898199319839478,
//   "Mass": 0.6392844319343567,
//   "Lung Opacity": 0.590739369392395,
//   "Infiltration": 0.531692385673523,
//   "Fracture": 0.5191616415977478,
//   "Fibrosis": 0.5188778638839722,
//   "Emphysema": 0.5011832118034363,
//   "Consolidation": 0.4293331801891327,
//   "Cardiomegaly": 0.364551305770874,
//   "Atelectasis": 0.3279731571674347,
//   "Pneumothorax": 0.2884972393512726,
//   "Effusion": 0.27805617451667786,
//   "Enlarged Cardiomediastinum": 0.27218717336654663,
//   "Pleural_Thickening": 0.2448986917734146,
//   "Pneumonia": 0.1856989562511444,
//   "Edema": 0.02414269745349884,
//   "Lung Lesion": 0.011150693520903587,
//   "Hernia": 0.009938775561749935
// };