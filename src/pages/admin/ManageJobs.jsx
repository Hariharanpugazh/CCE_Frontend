import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Jobs"); // Sidebar selection
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle state
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Change this as needed

  useEffect(() => {
    const fetchData = async (endpoint, setState, key) => {
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get(`http://localhost:8000/api/${endpoint}/`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data && Array.isArray(response.data[key])) {
          setState(response.data[key]);
        } else {
          console.warn(`Invalid data received for ${key}:`, response.data);
          setState([]); // Prevent issues
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        setState([]); // Prevent undefined errors
      }
    };

    fetchData("manage-jobs", setJobs, "jobs");
    fetchData("manage-study-materials", setStudyMaterials, "study_materials");
    fetchData("manage-internships", setInternships, "internships");
    fetchData("manage-achievements", setAchievements, "achievements");
  }, []);

  // Pagination Logic
  const paginate = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleEditClick = (id, type) => {
    navigate(
      type === "job" ? `/job-edit/${id}` :
      type === "study" ? `/study-edit/${id}` :
      type === "internship" ? `/internship-edit/${id}` :
      `/achievement-edit/${id}`
    );
  };

  const renderCard = (item, type) => {
    if (!item) return null;

    let title, company, description;
    if (type === "job") {
      title = item.job_data?.title || "No Title";
      company = item.job_data?.company_name || "Unknown Company";
    } else if (type === "study") {
      title = item.study_material_data?.title || "No Title";
      company = item.study_material_data?.category || "Unknown Category";
    } else if (type === "internship") {
      title = item.internship_data?.title || "No Title";
      company = item.internship_data?.company_name || "Unknown Company";
    } else {
      title = item.name || "No Title";
      company = item.company_name || "No Company";
      description = item.achievement_description || "No Description";
    }

    return (
      <div key={item._id} className="border rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            <span className={`px-2 py-1 text-sm font-semibold rounded 
              ${item.is_publish === true ? 'bg-green-100 text-green-800' : 
                item.is_publish === false ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {item.is_publish === true ? "Published" : item.is_publish === false ? "Rejected" : "Pending"}
            </span>
          </div>
          <p className="text-gray-600"><strong>{type === "study" ? "Category:" : "Company:"}</strong> {company}</p>
          {type === "achievement" && (
            <>
              <p className="text-gray-600"><strong>Type:</strong> {item.achievement_type}</p>
              <p className="text-gray-600"><strong>Description:</strong> {description}</p>
              <p className="text-gray-600"><strong>Date:</strong> {item.date_of_achievement}</p>
            </>
          )}
        </div>
        <button
          onClick={() => handleEditClick(item._id, type)}
          className="text-blue-500 mt-4 self-start border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 hover:text-white transition"
        >
          Edit
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-100 p-4 transition-all ${sidebarOpen ? "w-1/5" : "w-16"} overflow-hidden`}>
        <button
          className="mb-4 text-blue-500"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "◀ Hide" : "▶ Show"}
        </button>
        {sidebarOpen && (
          <>
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              {["Jobs", "Internships", "Study Materials", "Achievements", "Notifications"].map((category) => (
                <li 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer p-2 rounded-lg ${
                    selectedCategory === category ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  {category}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <AdminPageNavbar />
        <h1 className="text-3xl pt-5 text-center font-bold mb-4">Manage {selectedCategory}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedCategory === "Jobs" && paginate(jobs).map((job) => renderCard(job, "job"))}
          {selectedCategory === "Internships" && paginate(internships).map((internship) => renderCard(internship, "internship"))}
          {selectedCategory === "Study Materials" && paginate(studyMaterials).map((study) => renderCard(study, "study"))}
          {selectedCategory === "Achievements" && paginate(achievements).map((achievement) => renderCard(achievement, "achievement"))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button 
            className={`px-4 py-2 rounded border ${currentPage > 1 ? "bg-blue-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {currentPage}</span>
          <button 
            className={`px-4 py-2 rounded border ${currentPage * itemsPerPage < jobs.length ? "bg-blue-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * itemsPerPage >= jobs.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
