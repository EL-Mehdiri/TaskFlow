/* eslint-disable react/prop-types */
const TaskModel = ({
  open,
  formData,
  handleSubmit,
  handleChanage,
  project,
  loading,
  setOpen,
  error,
}) => {
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center 
      transition-colors ${open ? "visible bg-black/20" : "invisible"}`}
    >
      <div
        className={`max-w-xl p-16  mx-auto my-20 bg-white  rounded-xl shadow-xl transition-all 
          ${
            open
              ? "scale-100 opacity-100 bg-[#e9ecef] "
              : "scale-110 opacitiy-0"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <h1 className="font-sans  mb-10 text-3xl text-center">
            {formData._id ? "Update Task" : "Create Task"}
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              value={formData.name || ""}
              onChange={handleChanage}
              type="text"
              placeholder="Name"
              name="name"
              className="w-full mb-4 p-2 bg-slate-200 rounded-md border shadow-sm"
            />
            <textarea
              value={formData.description || ""}
              onChange={handleChanage}
              type="text"
              placeholder="Description"
              name="description"
              className="w-full mb-4 p-2 bg-slate-200 rounded-md border shadow-sm"
            />
            <select
              value={formData.status || ""}
              onChange={handleChanage}
              name="status"
              className="w-full mb-4 p-2 bg-slate-200 rounded-md border shadow-sm"
            >
              <option value="">Choose Status</option>
              <option value="pending">pending</option>
              <option value="in progress">in progress</option>
              <option value="completed">completed</option>
            </select>
            <select
              value={formData.priority || ""}
              onChange={handleChanage}
              name="priority"
              className="w-full mb-4 p-2 bg-slate-200 rounded-md border shadow-sm"
            >
              <option value="">Choose Priority</option>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <select
              // value={formData.collaborator || ""}
              onChange={handleChanage}
              name="collaborator"
              className="w-full mb-4 p-2 bg-slate-200 rounded-md border shadow-sm"
            >
              <option value="">Choose Collaborator</option>
              {project.collaboratorsData &&
                project.collaboratorsData.map((collaborator) => (
                  <option
                    className="taxt-black"
                    key={collaborator._id}
                    value={collaborator._id}
                  >
                    {collaborator.email}
                  </option>
                ))}
            </select>
            <input
              value={
                formData.due_date ? formData.due_date.substring(0, 10) : ""
              }
              onChange={handleChanage}
              type="date"
              placeholder="due_date"
              name="due_date"
              className="w-full mb-4 p-2 bg-slate-200 rounded-md border shadow-sm"
            />

            <hr className="border-t-solid border-1 border-grey" />
            <div className="flex flex-row justify-center gap-4 mt-8">
              <button
                disabled={loading}
                type="submit"
                className="border border-neutral-300 rounded-lg py-1.5 px-6
                  bg-[#967DFC]  text-white"
              >
                {loading ? "Loading..." : "Save Changes"}
              </button>
              <button
                type=""
                className="border border-neutral-300 rounded-lg py-1.5 px-10
               bg-red-500  text-white"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </form>
          <p className="text-red-700 mt-5">
            {error ? error.message || "Something went wrong!" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskModel;
