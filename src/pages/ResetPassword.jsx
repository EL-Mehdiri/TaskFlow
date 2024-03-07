import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import image from "../assets/password.jpg";

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  if (token.length < 20) {
    return;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://task-manager-copy.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError("");
        navigate("/");
      } else {
        setMessage("");
        setLoading(false);
        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("");
      setLoading(false);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 mx-auto p-10 ">
      <div className="max-w-2xl ">
        <img src={image} alt="" className="" />
      </div>

      <div className="image max-w-3xl p-16  my-20 rounded-xl shadow-xl ">
        <h1 className="text-3xl font-bold p-3 text-center mb-8">
          Reset Password
        </h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            placeholder="New Password"
            onChange={handlePasswordChange}
            className={`bg-white rounded-lg p-3 outline-violet-400`}
          />

          <label>Confirm New Password:</label>
          <input
            type="password"
            placeholder="Confirm  Password"
            id="password"
            className={`bg-white rounded-lg p-3 outline-violet-400`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />

          <button
            disabled={loading}
            className="relative bg-[#967DFC] text-white text-lg p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <span
              className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-transparent to-white w-0 transition-all duration-300"
              style={{ width: hovered ? "100%" : "0%" }}
            ></span>
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </form>

        <p className="text-red-500 mt-5">
          {error ? error || "Something went wrong!" : ""}
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
