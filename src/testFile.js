if (showGraph && chartRef && chartRef.current) {
    const prepareChartData = () => {
        const labels = ["A", "B", "C", "D", "F"];
        const data = [0, 0, 0, 0, 0];

        Object.values(rawGrades).forEach(grade => {
            const numericGrade = parseFloat(grade.grade);
            if (numericGrade >= 90) {
                data[0]++;
            } else if (numericGrade >= 80 && numericGrade < 90) {
                data[1]++;
            } else if (numericGrade >= 70 && numericGrade < 80) {
                data[2]++;
            } else if (numericGrade >= 60 && numericGrade < 70) {
                data[3]++;
            } else {
                data[4]++;
            }
        });

        return { labels, data };
    };

    if (chartRef && chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        const { labels, data } = prepareChartData();
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Average Grade",
                    data: data,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 0.9,
                    color: "red"
                }]
            },
            options: {
                indexAxis: "y",
                scales: {
                    x: {
                        beginAtZero: true,
                        fontColor: "red",
                        title: {
                            display: true,
                            text: "Grades"
                        }
                    },
                    y: {
                        fontColor: "red",
                        title: {
                            display: true,
                            text: "Students"
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: "Grade Distribution"
                    }
                },
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}
