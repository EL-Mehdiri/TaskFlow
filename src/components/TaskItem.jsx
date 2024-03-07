/* eslint-disable react/prop-types */
import { truncateTaskName } from "../utils/utils";

const TaskItem = ({ task, handleUpdate, handleDeleteTask }) => {
  return (
    <div
      className={`bg-white cursor-pointer rounded-lg shadow-md p-4 mb-4 flex items-center justify-between`}
    >
      <div onClick={() => handleUpdate(task._id, task)}>
        <p className="text-xl font-semibold">
          {truncateTaskName(task.name, 10)}
        </p>
        {task.collaboratorData && (
          <p className="text-sm text-black">
            Collaborator: {truncateTaskName(task.collaboratorData.username, 10)}
          </p>
        )}
      </div>
      <div className="flex items-center">
        <span
          className={`px-2 py-1 rounded-md text-sm font-semibold mr-2 ${
            task.priority === "low"
              ? "bg-blue-100 text-blue-600"
              : task.priority === "high"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {task.priority}
        </span>
        <button
          type="button"
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none"
          onClick={() => handleDeleteTask(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
