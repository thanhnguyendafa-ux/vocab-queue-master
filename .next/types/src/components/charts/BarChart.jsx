import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export function BarChart(_a) {
    var data = _a.data, xField = _a.xField, yField = _a.yField;
    var chartData = {
        labels: data.map(function (item) { return item[xField]; }),
        datasets: [{
                label: 'Mastery %',
                data: data.map(function (item) { return item[yField]; }),
                backgroundColor: 'rgba(59, 130, 246, 0.6)'
            }]
    };
    return (<Bar data={chartData} options={{
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }}/>);
}
//# sourceMappingURL=BarChart.jsx.map