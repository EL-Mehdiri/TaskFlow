import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import vector from "../assets/signin.jpg";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import ForgotPassword from "../components/ForgotPassword";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [hovered, setHovered] = useState(false);
  const [forgotPassword, setforgotPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  useEffect(() => {
    const project = async () => {
      const res = await fetch(
        "https://task-manager-copy.onrender.com/api/projects"
      );
      const data = await res.json();
      console.log(data);
    };
    project();
  }, []);

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

    setErrors(errors);
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  const fillCredentials = () => {
    setFormData({
      email: "task.flow.no@gmail.com",
      password: "test1234",
    });
  };

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 mx-auto p-10 ">
      <div className="max-w-2xl ">
        <img src={vector} alt="" className="" />
      </div>
      {forgotPassword ? (
        <ForgotPassword
          hovered={hovered}
          setHovered={setHovered}
          setforgotPassword={setforgotPassword}
        />
      ) : (
        <div className="image max-w-3xl p-16  my-20 rounded-xl shadow-xl ">
          <h1 className="text-3xl font-bold p-3 text-center mb-8">Sign In</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              id="email"
              className={`bg-white rounded-lg p-3 outline-violet-400 ${
                errors.email ? "border-red-500" : ""
              }`}
              onChange={handleChange}
              value={formData.email || ""}
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
              value={formData.password || ""}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
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
              {loading ? "Loading..." : "Sign In"}
            </button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5">
            <p className="text-lg self-center text-[#313538]">
              Don&apos;t have an account?
            </p>
            <Link to="/sign-up">
              <span className="text-[#ffffff] text-xl">Sign up</span>
            </Link>
          </div>
          <button
            className={`text-white underline  transition text-lg duration-150 ease-in-out hover:text-slute-600 focus:text-blue-600 active:text-blue-700`}
            onClick={() => setforgotPassword(true)}
          >
            forgot Password ?
          </button>

          <p className="text-red-500 mt-5">
            {error ? error.message || "Something went wrong!" : ""}
          </p>
          <div className=" ">
            <details className="group">
              <summary className="flex opacity-70 justify-between items-center font-medium cursor-pointer list-none">
                <h4 className="text-lg font-semibold mb-2">
                  For testing purposes:
                </h4>

                <span className="transition group-open:rotate-180">
                  <svg
                    fill="none"
                    height="24"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <button
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={fillCredentials}
              >
                Fill Credentials
              </button>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
