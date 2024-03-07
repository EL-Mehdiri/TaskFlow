import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import menu from "../assets/settings.png";
import close from "../assets/cross.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [openSideBar, setOpenSideBar] = useState(false);

  useEffect(() => {
    //  scrolling actions
    if (openSideBar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openSideBar]);

  const links = [
    { href: "/", name: "Dashboard" },
    { href: "/project", name: "Projects" },
  ];

  return (
    <>
      <span
        onClick={() => setOpenSideBar(true)}
        className={`absolute ${
          openSideBar && "hidden"
        }   top-5 left-4 cursor-pointer ${
          currentUser ? "lg:block " : "lg:hidden"
        }`}
      >
        <img src={menu} alt="menu" className="w-auto h-14" />
      </span>
      <div
        className={`h-screen lg:w-1/4 w-screen fixed bg-[#0D0F2F] shadow-3xl 
        ${openSideBar ? "block" : "hidden"}
         ${currentUser ? "lg:block " : "lg:hidden"}`}
      >
        <span
          onClick={() => setOpenSideBar(false)}
          className={`absolute text-white text-4xl lg:hidden top-5 right-4 cursor-pointer`}
        >
          <img src={close} alt="menu" className="w-auto h-10" />
        </span>
        <div className="flex h-full justify-between flex-col items-center max-w-6xl p-3">
          <Link to="/" onClick={() => setOpenSideBar(false)}>
            <img src={logo} alt="Logo" className="w-auto h-40" />
          </Link>
          <div className="flex flex-col gap-12">
            {links?.map((link) => (
              <Link
                to={link.href}
                key={link.name}
                onClick={() => setOpenSideBar(false)}
              >
                <button className="w-full items-center text-white bg-[#7179FF] py-4 px-10 rounded-full hover:translate-x-3 transition-all duration-300">
                  {link.name}
                </button>
              </Link>
            ))}
          </div>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-20 w-20 rounded-full object-cover"
                onClick={() => setOpenSideBar(false)}
              />
            ) : (
              <button
                onClick={() => setOpenSideBar(false)}
                className="w-[200px] items-center text-white bg-[#7179FF] py-4 rounded-full hover:translate-x-3"
              >
                Sign In
              </button>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
