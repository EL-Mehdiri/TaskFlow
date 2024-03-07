import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import victor from "../assets/singup.jpg"

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    // Username validation
    if (!formData.username) {
      errors.username = "Please enter a username";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Exit early if form validation fails
    }

    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      console.log();
      setMsg(data.message);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 mx-auto p-10 ">
  <div className="max-w-2xl ">
    <img src={victor} alt="" className="" />
  </div>
    <div className="image max-w-2xl p-16  my-20 rounded-xl shadow-xl bg-[#rgba(255, 171, 252, 1)]">
      <h1 className="text-3xl font-bold p-3 text-center mb-8">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className={`bg-white rounded-lg p-3 outline-violet-400 ${
            errors.username ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}
        <input
          type="email"
          placeholder="Email"
          id="email"
          className={`bg-white rounded-lg p-3 outline-violet-400 ${
            errors.email ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        <input
          type="password"
          placeholder="Password"
          id="password"
          className={`bg-white rounded-lg p-3 outline-violet-400 ${
            errors.password ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p className="text-lg self-center text-[#313538]">Have an account?</p>
        <Link to="/sign-in">
          <span className="text-[#ffffff] text-xl">Sign In</span>
        </Link>
      </div>
      <p className="text-red-500 mt-5">{error && "Something went wrong!"}</p>
      {msg && <p className="text-[#ffffff] text-xl ">{msg}</p>}
    </div>
    </div>
  );
}
