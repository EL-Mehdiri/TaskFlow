import svg from "../assets/404.jpg";
import { Link } from "react-router-dom";
import arrow from "../assets/right-arrow.png"
const NotFound = () => {
  return (
    <>
      <div className="p-8">
        <img src={svg} alt="svg" className="w-[700px] mx-auto" />
        <Link to={"/"} className="text-purple-400 flex gap-4 items-center text-xl ">Back to Home 
        <img src={arrow} alt="" className="w-12 hover:translate-x-3 transition-all duration-200 h-12"/>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
