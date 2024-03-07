import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate, truncateTaskName } from "../utils/utils";
import Spinner from "../components/Spinner";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const userId = useSelector((state) => state.user.currentUser?._id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();

        // Check if projects are available
        if (data.length > 0) {
          const projectsWithData = await Promise.all(
            data.map(async (project) => {
              let ownerName = "";
              let ownerPhoto = "";
              if (project.owner) {
                const ownerRes = await fetch(`/api/user/${project.owner}`);
                const ownerData = await ownerRes.json();
                ownerName = ownerData.username;
                ownerPhoto = ownerData.profilePicture;
              }

              const collaboratorData = await Promise.all(
                (project.collaborators || []).map(async (collaboratorId) => {
                  const collaboratorRes = await fetch(
                    `/api/user/${collaboratorId}`
                  );
                  if (collaboratorRes.ok) {
                    return await collaboratorRes.json();
                  }
                  return null;
                })
              );

              return { ...project, ownerName, collaboratorData, ownerPhoto };
            })
          );

          setProjects(projectsWithData);
        } else {
          // If no projects available, set projects to an empty array
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        // Set loading to false once fetching is completed
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Display loading spinner while projects are being fetched
  if (loading) {
    return (
      <div className="px-8 py-12 ">
        <div className="flex items-center justify-between mb-20 flex-wrap">
          <div className="mb-10">
            <h1 className="font-sans  mb-10 text-6xl">Projects</h1>
            <p className="font-sans text-3xl text-slate-800">
              <span className="text-[#ffAE1A]">Effortlessly</span> manage tasks,
              deadlines, <br />
              and team collaboration.
            </p>
          </div>

          <button className=" w-[200PX]   text-white bg-[#967DFC] py-4  rounded-full hover:translate-x-3 mb-10 ">
            <Link to="/newProject">New Project</Link>
          </button>
        </div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-8 py-12 ">
      <div className="flex items-center justify-between mb-20 flex-wrap">
        <div className="mb-10">
          <h1 className="font-sans  mb-10 text-6xl">Projects</h1>
          <p className="font-sans text-3xl text-slate-800">
            <span className="text-[#ffAE1A]">Effortlessly</span> manage tasks,
            deadlines, <br />
            and team collaboration.
          </p>
        </div>

        <button className=" w-[200PX]   text-white bg-[#967DFC] py-4  rounded-full hover:translate-x-3 mb-10 ">
          <Link to="/newProject">New Project</Link>
        </button>
      </div>

      <section className="container px-4 mx-auto">
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 :border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead className="bg-gray-50 :bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-lg font-normal text-left rtl:text-right text-gray-500 :text-gray-400"
                      >
                        <button className="flex items-center gap-x-3 focus:outline-none">
                          <span>Name</span>
                        </button>
                      </th>

                      <th
                        scope="col"
                        className="px-12 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 :text-gray-400"
                      >
                        Budget
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 :text-gray-400"
                      >
                        Description
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 :text-gray-400"
                      >
                        Collaborators
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 :text-gray-400"
                      >
                        start date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 :text-gray-400"
                      >
                        end date
                      </th>
                    </tr>
                  </thead>
                  {projects.length > 0 ? (
                    <tbody className="bg-white divide-y divide-gray-200 ">
                      {projects
                        .filter(
                          (project) =>
                            project.owner === userId ||
                            (project.collaborators &&
                              project.collaborators.some(
                                (collaborator) => collaborator === userId
                              ))
                        )
                        .map((project) => (
                          <tr key={project._id} className="hover:bg-[#dcd9dc]">
                            <td className="px-4 py-4 text-lg font-medium whitespace-nowrap">
                              <div title={project.name}>
                                <Link to={project._id}>
                                  <h2 className="font-medium text-2xl text-gray-800 :text-white mb-4  ">
                                    {truncateTaskName(project.name, 10)}
                                  </h2>
                                  <p className="text-lg flex gap-3 font-normal text-gray-600 :text-gray-400 ">
                                    <img
                                      className="object-cover w-10 h-10 -mx-1 border-2 border-white rounded-full shrink-0 "
                                      src={project.ownerPhoto}
                                    />
                                    {truncateTaskName(project.ownerName, 10)}
                                  </p>
                                </Link>
                              </div>
                            </td>
                            <td className="px-12 py-4 text-lg font-medium whitespace-nowrap">
                              <div className="inline px-3 py-1 text-lg font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 :bg-gray-800">
                                {truncateTaskName(project.budget, 10)}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-lg whitespace-nowrap">
                              <div>
                                <h4 className="text-gray-700 :text-gray-200">
                                  {truncateTaskName(project.description, 35)}
                                </h4>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-lg whitespace-nowrap">
                              <div className="flex items-center">
                                {/* Collaborators */}
                                {project.collaboratorData && (
                                  <>
                                    {project.collaboratorData
                                      .slice(0, 3)
                                      .map((collaborator) => (
                                        <img
                                          key={collaborator?._id}
                                          className="object-cover w-10 h-10 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                                          src={collaborator?.profilePicture}
                                        />
                                      ))}
                                    {project.collaboratorData.length > 3 && (
                                      <div className=" text-center pt-1  bg-slate-300  w-10 h-10  border-2 border-white rounded-full   ">
                                        <span>
                                          +{project.collaboratorData.length - 3}
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-lg whitespace-nowrap">
                              {/* <div className="w-48 h-1.5 bg-blue-200 overflow-hidden rounded-full">
                                <div className="bg-blue-500 w-2/3 h-1.5"></div>
                              </div> */}
                              <p>{formatDate(project.start_date)}</p>
                            </td>
                            <td className="px-4 py-4 text-lg whitespace-nowrap">
                              <p>{formatDate(project.end_date)}</p>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  ) : (
                    <td className="px-4 py-4 text-lg whitespace-nowrap">
                      <div>
                        <h4 className="text-gray-700 :text-gray-200">
                          No projects available.
                        </h4>
                      </div>
                    </td>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
