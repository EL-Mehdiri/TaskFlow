/* eslint-disable react/prop-types */

import { Doughnut, Line, Bar } from "react-chartjs-2";

const ChartTask = ({
  pendingTasks,
  inProgressTasks,
  completedTasks,
  start,
  end,
}) => {
  // Generate labels for the date range
  const startDate = new Date(start);
  const endDate = new Date(end);
  const labels = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    labels.push(currentDate.toISOString().slice(0, 10)); // Format date as 'YYYY-MM-DD'
    currentDate.setDate(currentDate.getDate() + 1); // Increment date by one day
  }

  // Calculate data for Doughnut chart
  const doughnutData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Task Status",
        data: [
          pendingTasks.length,
          inProgressTasks.length,
          completedTasks.length,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calculate data for Line chart
  const lineData = {
    labels: labels,
    datasets: [
      {
        label: "Pending Tasks",
        data: labels.map(
          (date) =>
            pendingTasks.filter((task) => task.createdAt.slice(0, 10) === date)
              .length
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "In Progress Tasks",
        data: labels.map(
          (date) =>
            inProgressTasks.filter(
              (task) =>
                task.createdAt.slice(0, 10) <= date &&
                task.due_date.slice(0, 10) >= date
            ).length
        ),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Completed Tasks",
        data: labels.map(
          (date) =>
            completedTasks.filter(
              (task) =>
                task.createdAt.slice(0, 10) <= date &&
                task.due_date.slice(0, 10) >= date
            ).length
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Calculate data for Bar chart based on priority
  const priorityData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Priority",
        data: [
          // completedTasks.filter((task) => task.priority === "low").length,
          // completedTasks.filter((task) => task.priority === "medium").length,
          // completedTasks.filter((task) => task.priority === "high").length,
          10, 20, 30,
        ],
        backgroundColor: [
          "rgba(255, 206, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="max-w-lg">
          <h2>Task Status</h2>
          {/* <Doughnut data={doughnutData} /> */}
        </div>
        <div>
          <h2>Tasks by Priority</h2>
          {/* <Bar data={priorityData} /> */}
        </div>
      </div>
      <div>
        <h2>Tasks Over Time</h2>
        {/* <Line data={lineData} /> */}
      </div>
    </>
  );
};

export default ChartTask;
