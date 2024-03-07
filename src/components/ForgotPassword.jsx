/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
const ForgotPassword = ({ setforgotPassword, setHovered, hovered }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.length === 0) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "https://task-manager-copy.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setLoading(false);
        setError("");
      } else {
        setLoading(false);
        setMessage("");

        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("");
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="password max-w-3xl p-16  my-20 rounded-xl shadow-xl ">
      <div className=" text-center p-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 ">Forgot Password?</h1>
        <p className="mt-2  text-gray-900 ">
          Remember your password?{" "}
          <button
            className={`text-white underline  transition text-lg duration-150 ease-in-out hover:text-slute-600 focus:text-blue-600 active:text-blue-700 `}
            onClick={() => setforgotPassword(false)}
          >
            Sign In
          </button>
        </p>
      </div>

      {message && <p className=" pb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className={`bg-white rounded-lg p-3 outline-violet-400 `}
          onChange={handleEmailChange}
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
      <div className="flex gap-2 mt-5">
        <p className="text-lg self-center text-[#313538]">
          Don&apos;t have an account?
        </p>
        <Link to="/sign-up">
          <span className="text-[#ffffff] text-xl">Sign up</span>
        </Link>
      </div>

      <p className="text-red-500 mt-5">
        {error ? error : "Something went wrong!"}
      </p>
    </div>
  );
};

export default ForgotPassword;
