/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TaskModel from "../components/TaskModel";
import { useDispatch, useSelector } from "react-redux";
import {
  creatTaskFailure,
  creatTaskStart,
  creatTaskSuccess,
  updateTaskFailure,
  updateTaskStart,
  updateTaskSuccess,
} from "../redux/task/taskSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationToast from "../components/DeleteConfirmationToast";
import TaskItem from "../components/TaskItem";
import Spinner from "../components/Spinner";
import ChartTask from "../components/ChartTask";
// import { formatDate } from "../utils/utils";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [openOption, setOpenOption] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.task);
  const userId = useSelector((state) => state.user.currentUser._id);
  const navigete = useNavigate();
  const [chart, setChart] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(
          `https://task-manager-copy.onrender.com/api/projects/${id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch project");
        }
        const projectData = await res.json();

        // Fetch collaborator details for each collaborator
        if (projectData.collaborators && projectData.collaborators.length > 0) {
          const collaboratorDetails = await Promise.all(
            projectData.collaborators.map(async (collaboratorId) => {
              const collaboratorRes = await fetch(
                `https://task-manager-copy.onrender.com/api/user/${collaboratorId}`
              );
              if (collaboratorRes.ok) {
                return await collaboratorRes.json();
              }
              return null;
            })
          );

          // Add collaborator details to the project data
          projectData.collaboratorsData = collaboratorDetails.filter(Boolean);
        }

        setProject(projectData);

        if (projectData.owner) {
          fetchUserById(projectData.owner);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    const fetchUserById = async (userId) => {
      try {
        const res = await fetch(
          `https://task-manager-copy.onrender.com/api/user/${userId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        setUser(data.username);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `https://task-manager-copy.onrender.com/api/tasks?project_id=${id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await res.json();
        // Iterate over each task to fetch collaborator details
        await Promise.all(
          data.map(async (task) => {
            if (task.collaborator) {
              const collaboratorRes = await fetch(
                `https://task-manager-copy.onrender.com/api/user/${task.collaborator}`
              );
              if (collaboratorRes.ok) {
                const collaboratorData = await collaboratorRes.json();
                task.collaboratorData = collaboratorData; // Add collaborator data to the task
              }
            }
          })
        );
        setTasks(data);
        if (data.collaborator) {
          fetchUserById(data.collaborator);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchProject();
    fetchTasks();
    // fetchUsers();
  }, [id]);
  // deleteProject
  const deleteHandler = async (projectId) => {
    try {
      const res = await fetch(
        `https://task-manager-copy.onrender.com/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      navigete("/project");
      toast.success("Project deleted successfully!");
      console.log(data.message);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleDeleteProject = async (projectId) => {
    toast.custom((t) => (
      <DeleteConfirmationToast
        Id={projectId}
        formName={"project"}
        onDelete={deleteHandler}
      />
    ));
  };

  // Update Task Function
  const updateTask = async (taskId, updatedData) => {
    try {
      dispatch(updateTaskStart());

      const res = await fetch(
        `https://task-manager-copy.onrender.com/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      // If the task has a collaborator, fetch the collaborator's data
      if (updatedData.collaborator) {
        const collaboratorRes = await fetch(
          `https://task-manager-copy.onrender.com/api/user/${updatedData.collaborator}`
        );
        if (collaboratorRes.ok) {
          const collaboratorData = await collaboratorRes.json();
          // Update the task with the new collaborator's data
          data.collaboratorData = collaboratorData;
        }
      }
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? data : task
      );
      setTasks(updatedTasks);
      setFormData({});
      dispatch(updateTaskSuccess(data));
      toast("Task updated successfully!", { type: "success" });
      setOpen(false);
    } catch (error) {
      dispatch(updateTaskFailure(error));
      toast("Task failed!", { type: "error" });
    }
  };
  // Update Task Handler
  const handleUpdate = (taskId, taskData) => {
    setFormData({ ...taskData });
    setOpen(true);
  };

  // 'function to handle task data
  const handleChanage = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData._id) {
      // If _id exists, it means it's an update "taskId"
      updateTask(formData._id, formData);
    } else {
      try {
        dispatch(creatTaskStart());
        formData.project_id = project._id;
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        // Fetch collaborator
        if (formData.collaborator) {
          const collaboratorRes = await fetch(
            `https://task-manager-copy.onrender.com/api/user/${formData.collaborator}`
          );
          if (collaboratorRes.ok) {
            const collaboratorData = await collaboratorRes.json();
            data.collaboratorData = collaboratorData;
          }
        }
        // Update tasks state to include the new task
        setTasks([...tasks, data]);
        // Reset form
        e.target.reset();
        setFormData({});
        dispatch(creatTaskSuccess(data));
        setOpen(false);
        toast("Task created successfully!", { type: "success" });
      } catch (error) {
        dispatch(creatTaskFailure(error));
        toast("task  failed.", { type: "error" });
      }
    }
  };
  const handleDeleteTask = async (taskId) => {
    toast.custom((t) => (
      <DeleteConfirmationToast
        Id={taskId}
        formName={"task"}
        onDelete={handleTaskDelete}
      />
    ));
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const res = await fetch(
        `https://task-manager-copy.onrender.com/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      // Remove the deleted task from the tasks state
      setTasks(tasks.filter((task) => task._id !== taskId));
      console.log(data.message);
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error(error.message);
    }
  };

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter((task) => task.status === "in progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  if (
    project.owner === userId ||
    (project.collaborators &&
      project.collaborators.some((collaborator) => collaborator === userId))
  ) {
    return (
      <div className="p-8">
        <div className="flex justify-between  relative  mb-10  ">
          <div className=" ">
            <h1 className="font-sans mb-8  text-6xl">
              Collaborate seamlessly
              <br /> with your team
            </h1>
            <p className="font-sans text-3xl text-slate-800 mb-16">
              Share tasks, assign responsibilities,
              <br /> and{" "}
              <span className="text-[#ffAE1A]">
                track progress together.
              </span>{" "}
            </p>
          </div>

          <div className=" text-left flex justify-between gap-4 ">
            <button
              className="border border-neutral-300 rounded-lg  py-1.5 px-10 my-2 bg-[#967DFC]  text-white  text-lg hover:translate-x-3  w-fit h-fit "
              onClick={() => setOpen(true)}
            >
              Create Task
            </button>
            {project.owner === userId && (
              <>
                <button
                  className="px-1 py-2 text-gray-500 transition-colors duration-200 rounded-lg :text-gray-300 hover:bg-gray-100 focus:outline-none h-fit"
                  onClick={() => setOpenOption(!openOption)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg>
                </button>
                {openOption && (
                  <div className="absolute z-20 p-4 right-8 top-16  origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      className=" block text-lg text-black hover:bg-[#34ea7d] hover:text-white py-1.5 px-10 my-2 rounded-lg"
                      to={`/updateProject/${project._id}`}
                    >
                      Update Project
                    </Link>
                    <Link
                      className="text-lg block  text-black hover:bg-red-500 hover:text-white py-1.5 px-10 my-2 rounded-lg"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete Project
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex gap-5 p-4 items-center justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setChart(false)}
          >
            Tasks
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setChart(true)}
          >
            Charts
          </button>
        </div>

        {chart ? (
          <ChartTask
            pendingTasks={pendingTasks}
            inProgressTasks={inProgressTasks}
            completedTasks={completedTasks}
            start={project.start_date}
            end={project.end_date}
          />
        ) : (
          <>
            <h1 className="text-3xl font-bold p-3  mb-8">Tasks List :</h1>
            <div className="grid lg:grid-cols-2 2xl:grid-cols-3  gap-10 justify-around mt-8 grid-cols-1 p-3">
              {/* Column for Pending Tasks */}
              <div className="bg-[#f0f3f5] p-2  rounded-lg">
                <h2 className="text-lg font-bold p-4 text-[#495057]">
                  Pending Tasks
                </h2>
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      bg={"bg-gray-400"}
                      handleUpdate={handleUpdate} // Pass handleUpdate function
                      handleDeleteTask={handleDeleteTask}
                    />
                  ))
                ) : (
                  <p className="text-lg font-sans p-4 text-black">
                    No pending tasks
                  </p>
                )}
              </div>

              {/* Column for In Progress Tasks */}
              <div className="bg-[#f0f3f5] p-2 rounded-lg">
                <h2 className="text-lg font-bold p-4 text-[#495057]">
                  In Progress Tasks
                </h2>
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      bg={"bg-gray-400"}
                      handleUpdate={handleUpdate} // Pass handleUpdate function
                      handleDeleteTask={handleDeleteTask}
                    />
                  ))
                ) : (
                  <p className="text-lg font-sans p-4 text-black">
                    No tasks in progress
                  </p>
                )}
              </div>

              {/* Column for Completed Tasks */}
              <div className="bg-[#f0f3f5] p-2 rounded-lg">
                <h2 className="text-lg font-bold p-4 text-[#495057]">
                  Completed Tasks
                </h2>
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      bg={"bg-gray-400"}
                      handleUpdate={handleUpdate} // Pass handleUpdate function
                      handleDeleteTask={handleDeleteTask}
                    />
                  ))
                ) : (
                  <p className="text-lg font-sans p-4 text-black">
                    No completed tasks
                  </p>
                )}
              </div>
            </div>
            <TaskModel
              open={open}
              onClose={() => setOpen(false)}
              error={error}
              formData={formData}
              handleSubmit={handleSubmit}
              handleChanage={handleChanage}
              loading={loading}
              project={project}
              setOpen={setOpen}
            />
          </>
        )}
      </div>
    );
  }
};

export default ProjectDetails;
