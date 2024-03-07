/* eslint-disable react/prop-types */
import toast from "react-hot-toast";

const DeleteConfirmationToast = ({ Id, onDelete, formName }) => {
  const handleConfirm = () => {
    onDelete(Id);
    toast.dismiss(); // Dismiss the toast after action is taken
  };

  const handleCancel = () => {
    toast.dismiss();
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <p className="text-gray-800">
        Are you sure you want to delete this {formName}?
      </p>
      <div className="flex gap-5 items-center mt-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300 focus:outline-none"
          onClick={handleConfirm}
        >
          Yes
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors duration-300 focus:outline-none"
          onClick={handleCancel}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationToast;
