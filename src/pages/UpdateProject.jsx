import { useEffect, useState } from "react";
import FormProject from "../components/FormProject";
import { useParams } from "react-router-dom";

const UpdateProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [users, setUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) {
        console.log("Failed to fetch project");
      }
      const data = await res.json();
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/user`);
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      const verifiedUsers = data.filter((user) => user.emailVerified === true);

      setUsers(verifiedUsers);
      setLoadingUser(false);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, [id]);

  return (
    <FormProject project={project} users={users} loadingUser={loadingUser} />
  );
};

export default UpdateProject;
