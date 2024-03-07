/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  creatProjectFailure,
  creatProjectStart,
  creatProjectSuccess,
  updateProjectStart,
  updateProjectSuccess,
  updateProjectFailure,
} from "../redux/project/projectSlice";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/utils";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

const FormProject = ({ project, users, loadingUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
    collaborators: [],
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.project);
  const userId = useSelector((state) => state.user.currentUser._id);
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCollaboratorChange = (userId, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        collaborators: [...formData.collaborators, userId],
      });
    } else {
      setFormData({
        ...formData,
        collaborators: formData.collaborators.filter((id) => id !== userId),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const currentDate = new Date();
    if (formatDate(startDate) < formatDate(currentDate)) {
      setErrors("Start date must be today or a future date.");
      return;
    }

    if (endDate < startDate) {
      setErrors("End date must be greater than or equal to start date.");
      return;
    }

    try {
      if (project) {
        dispatch(updateProjectStart());
        const res = await fetch(
          `https://task-manager-copy.onrender.com/api/projects/${project?._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              collaborators: formData.collaborators,
            }),
          }
        );
        const data = await res.json();
        if (data.success === false) {
          throw new Error(data.message || "Update project failed");
        }
        dispatch(updateProjectSuccess(data));
        navigate(`/project/${project._id}`);
        toast("Project updated successfully!", { type: "success" });
      } else {
        dispatch(creatProjectStart());
        formData.userId = userId;
        const res = await fetch(
          "https://task-manager-copy.onrender.com/api/projects",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const data = await res.json();
        if (data.success === false) {
          throw new Error(data.message || "Create project failed");
        }
        dispatch(creatProjectSuccess(data));
        navigate("/project");
        toast("Project created successfully!", { type: "success" });
      }
    } catch (error) {
      if (project) {
        dispatch(updateProjectFailure(error));
        toast("Error updating project!", { type: "error" });
      } else {
        dispatch(creatProjectFailure(error));
        toast("Error creating project!", { type: "error" });
      }
    }
  };

  return (
    <div className="max-w-2xl p-16 mx-auto my-20 bg-[#e9ecef] rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold p-3 text-center mb-4 ">
        {project ? "Update Project" : "Create Project"}
      </h1>
      <p className="text-2xl text-center mb-16 text-[#343a40]">
        Create and organize your tasks with ease using our intuitive interface.
      </p>
      <form onSubmit={handleSubmit}>
        <label className="text-lg">Project Name : </label>
        <input
          defaultValue={project?.name}
          onChange={handleChange}
          type="text"
          name="name"
          className="w-full mt-2 mb-4 p-2 bg-white rounded-md border shadow-sm outline-violet-400"
        />
        <label className="text-lg">Description About The Project : </label>
        <textarea
          defaultValue={project?.description}
          rows="4"
          cols="50"
          onChange={handleChange}
          name="description"
          className="mt-2 w-full mb-4 bg-white rounded-md border shadow-sm outline-violet-400"
        />
        {project && (
          <>
            <label>Choose collaborators:</label>
            <div className="mt-2">
              {loadingUser ? (
                <Spinner />
              ) : (
                users.map((user) => (
                  <div key={user._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={user._id}
                      value={user._id}
                      checked={formData.collaborators.includes(user._id)}
                      onChange={(e) =>
                        handleCollaboratorChange(user._id, e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label htmlFor={user._id}>
                      {user.email}
                      {project.collaborators.includes(user._id)
                        ? " (Collaborator)"
                        : ""}
                    </label>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <label className="text-lg">Start Date : </label>
        <input
          defaultValue={
            project?.start_date ? project.start_date.substring(0, 10) : ""
          }
          onChange={handleChange}
          type="date"
          name="start_date"
          className="w-full mb-4 mt-2 p-2 bg-white rounded-md border shadow-sm outline-violet-400"
        />
        <label className="text-lg">End Date : </label>
        <input
          defaultValue={
            project?.end_date ? project.end_date.substring(0, 10) : ""
          }
          onChange={handleChange}
          type="date"
          name="end_date"
          className="w-full mb-4 p-2 bg-white rounded-md border shadow-sm outline-violet-400 mt-2"
        />
        <label className="text-lg">Project Budget : </label>
        <input
          defaultValue={project?.budget}
          onChange={handleChange}
          type="number"
          name="budget"
          min={10}
          className="w-full mb-4 p-2 bg-white rounded-md border shadow-sm outline-violet-400 mt-2"
        />
        <button
          disabled={loading}
          type="submit"
          className="w-[200PX] text-white bg-[#7179FF] py-4 rounded-full hover:translate-x-3 mt-8 flex justify-center mx-auto"
        >
          {loading ? "Loading..." : "Save Changes"}
        </button>
      </form>
      <p className="text-red-700 mt-5">
        {error ? error.message || "Something went wrong!" : ""}
      </p>
      <p className="text-red-700 mt-5">{errors && errors}</p>
    </div>
  );
};

export default FormProject;
