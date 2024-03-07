import Calendar from "../components/Calendar";
import vector from "../assets/vector.jpg";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="px-4 py-12 ">
      <h1 className="text-4xl text-center font-bold  mb-16 text-[#967DFC]">
        Welcome to your Dashboard!
      </h1>
      <div className="flex  mb-32  items-center justify-between p-9 flex-wrap-reverse">
        <div className="">
          <h1 className=" font-sans  mb-10 text-6xl">
            <strong>Manage Your Tasks </strong>
          </h1>
          <p className="font-sans text-2xl text-slate-800 mb-16">
            <span className="text-[#ffAE1A]"> Stay organized </span>and boost
            productivity
            <br /> with our intuitive task manager dashboard.
          </p>
          <button className=" w-[200PX] items-center  text-white bg-[#967DFC] py-4  rounded-full hover:translate-x-3">
            <Link to="/newProject">New Project</Link>
          </button>
        </div>
        <div>
          <img src={vector} alt="" className="w-[500PX] h-auto mb-10" />
        </div>
      </div>
      <Calendar />
    </div>
  );
}
