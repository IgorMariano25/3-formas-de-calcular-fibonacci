const ChartJsImage = require('chart.js-image');
const fs = require('fs');

export function generateChart(data: any) {
    const chart = ChartJsImage().chart({
        type: 'line',
        data: {
            labels: data.recursive.map((d: any) => d.n),
            datasets: [
                {
                    label: 'Recursive',
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    data: data.recursive.map((d: any) => d.time),
                },
                {
                    label: 'Memoization',
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    data: data.memoization.map((d: any) => d.time),
                },
                {
                    label: 'Matrix',
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    data: data.matrix.map((d: any) => d.time),
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: 'Fibonacci Execution Time Comparison',
            },
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'N',
                        },
                    },
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Execution Time (ms)',
                        },
                        type: 'logarithmic',
                    },
                ],
            },
        },
    });

    chart.toFile('fibonacci-chart.png').then(() => {
        console.log('Chart saved to fibonacci-chart.png');
    });
}
