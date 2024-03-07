import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo copy.png";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    // console.log(token);
    const fetchVerifyEmail = async () => {
      try {
        const res = await fetch(
          `https://task-manager-copy.onrender.com/api/auth/verify-email?token=${token}`
        );

        if (res.ok) {
          setMessage("Email verified successfully!");
          // console.log(res);
          // Redirect to the home page after successful verification
          setTimeout(() => {
            navigate("/sign-in");
          }, 2000);
        } else {
          setMessage("Email verification failed.");
        }
      } catch (error) {
        setMessage("An error occurred during email verification.");
        console.log(error.message);
      }
    };
    if (token) {
      fetchVerifyEmail();
    }
  }, [location.search, navigate]);

  return (
    <div className="relative flex  flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
      <div className="max-w-xl px-5 text-center">
        <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
          <img src={logo} alt="task flow logo" className="w-72" />
          Email Verification
        </h2>
        <p className="mb-2 text-lg text-zinc-500">
          We are glad, that you’re with us <br />
          <span className="font-medium text-indigo-500">{message}</span>.
        </p>
        <a
          href="https://task-flow-ua9v.onrender.com"
          className="mt-3 inline-block w-96 rounded bg-indigo-600 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
        >
          Open the App →
        </a>
      </div>
    </div>
  );
};

export default VerifyEmail;
