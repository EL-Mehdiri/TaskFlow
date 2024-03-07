import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { formatDate, truncateTaskName } from "../utils/utils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Calendar() {
  const [projects, setProjects] = useState([]);
  const userId = useSelector((state) => state.user.currentUser._id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/projects`);
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await res.json();

        const filteredProjects = data.filter(
          (project) =>
            project.owner === userId ||
            (project.collaborators &&
              project.collaborators.some(
                (collaborator) => collaborator === userId
              ))
        );
        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleEventClick = (clickInfo) => {
    // Prevent default behavior
    clickInfo.jsEvent.preventDefault();
    if (clickInfo.event.url) {
      // Navigate to the specified URL
      navigate(clickInfo.event.url);
    }
  };

  const events = projects.map((project, index) => ({
    id: project._id,
    title: truncateTaskName(project.name, 16),
    start: formatDate(project.start_date),
    end: formatDate(project.end_date),
    resourceId: `p${project._id}`,
    color: getRandomColor(index),
    url: `/project/${project._id}`,
  }));

  function getRandomColor(index) {
    const colors = [
      "#9b5de5",
      "#f15bb5",
      "#fee440",
      "#00bbf9",
      "#00f5d4",
      "#21CFA9",
    ];
    return colors[index % colors.length];
  }

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        height={"90vh"}
      />
    </div>
  );
}

export default Calendar;
