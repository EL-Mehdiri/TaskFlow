import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
// import {
//   Dashboard,
//   NewProject,
//   NotFound,
//   Profile,
//   ProjectDetails,
//   Projects,
//   UpdateProject,
// } from "./pages";
import Dashboard from "./pages/Dashboard.jsx";
import NewProject from "./pages/NewProject.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup.jsx";
import Projects from "./pages/Projects.jsx";
import UpdateProject from "./pages/UpdateProject.jsx";
import { useSelector } from "react-redux";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

export default function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <main
        className={`grid ${
          currentUser ? "lg:grid-cols-4" : "lg:grid-cols-1"
        }   grid-cols-1 w-full h-full`}
      >
        <div className="col-span-1">
          <Header />
        </div>
        <div className="col-span-3 p-4">
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route element={<PrivateRoute />}>
              <Route path="/project" element={<Projects />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/project/:id" element={<ProjectDetails />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/newProject" element={<NewProject />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/updateProject/:id" element={<UpdateProject />} />
            </Route>
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}
