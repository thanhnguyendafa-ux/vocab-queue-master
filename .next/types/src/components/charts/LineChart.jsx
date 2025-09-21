import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export function LineChart(_a) {
    var data = _a.data, xField = _a.xField, yField = _a.yField;
    var chartData = {
        labels: data.map(function (item) { return item[xField]; }),
        datasets: [{
                label: 'Accuracy %',
                data: data.map(function (item) { return item[yField]; }),
                borderColor: 'rgba(16, 185, 129, 0.8)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.3
            }]
    };
    return (<Line data={chartData} options={{
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }}/>);
}
//# sourceMappingURL=LineChart.jsx.map