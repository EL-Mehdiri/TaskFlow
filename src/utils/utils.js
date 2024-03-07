

// Function to format date
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const fetchProjects = async (setProjects) => {
    try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
    } catch (error) {
        // Handle error
        console.error("Error fetching projects:", error);
    }
};

export const truncateTaskName = (name, maxLength) => {
    return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
};