import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Pagination from "../../components/Admin/pagination";
import Sidebar from "../../components/Admin/Sidebar";
import {
  Briefcase,
  GraduationCap,
  BookOpen,
  Trophy,
  Bell,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Folder,
  Calendar,
} from "lucide-react";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Jobs");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

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
          setState([]);
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        setState([]);
      }
    };

    fetchData("manage-jobs", setJobs, "jobs");
    fetchData("manage-study-materials", setStudyMaterials, "study_materials");
    fetchData("manage-internships", setInternships, "internships");
    fetchData("manage-achievements", setAchievements, "achievements");
  }, []);

  const paginate = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleEditClick = (id, type) => {
    navigate(
      type === "job"
        ? `/job-edit/${id}`
        : type === "study"
        ? `/study-edit/${id}`
        : type === "internship"
        ? `/internship-edit/${id}`
        : `/achievement-edit/${id}`
    );
  };

  const getStatusStyle = (isPublish) => {
    if (isPublish === true) {
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        icon: CheckCircle2,
        label: "Published",
      };
    } else if (isPublish === false) {
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: XCircle,
        label: "Rejected",
      };
    }
    return {
      bg: "bg-amber-100",
      text: "text-amber-800",
      icon: Clock,
      label: "Pending",
    };
  };

  const sidebarCategories = [
    { name: "Jobs", icon: Briefcase },
    { name: "Internships", icon: GraduationCap },
    { name: "Study Materials", icon: BookOpen },
    { name: "Achievements", icon: Trophy },
    // { name: "Notifications", icon: Bell },
  ];

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

    const status = getStatusStyle(item.is_publish);
    const StatusIcon = status.icon;

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{title}</h2>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
              <StatusIcon className="h-4 w-4" />
              {status.label}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              {type === "study" ? <Folder className="h-4 w-4 mr-2" /> : <Building2 className="h-4 w-4 mr-2" />}
              <span className="font-medium">{type === "study" ? "Category:" : "Company:"}</span>
              <span className="text-gray-700 ml-1">{company}</span>
            </div>
            {type === "achievement" && (
              <>
                <div className="flex items-center text-gray-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span className="font-medium">Type:</span>
                  <span className="text-gray-700 ml-1">{item.achievement_type}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-700 ml-1">{item.date_of_achievement}</span>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => handleEditClick(item._id, type)}
            className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminPageNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}

          categories={sidebarCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-50 mr-12 p-6">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Manage {selectedCategory}
              </h1>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCategory === "Jobs" && paginate(jobs).map((job) => renderCard(job, "job"))}
              {selectedCategory === "Internships" &&
                paginate(internships).map((internship) => renderCard(internship, "internship"))}
              {selectedCategory === "Study Materials" &&
                paginate(studyMaterials).map((study) => renderCard(study, "study"))}
              {selectedCategory === "Achievements" &&
                paginate(achievements).map((achievement) => renderCard(achievement, "achievement"))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={
                selectedCategory === "Jobs"
                  ? jobs.length
                  : selectedCategory === "Internships"
                  ? internships.length
                  : selectedCategory === "Study Materials"
                  ? studyMaterials.length
                  : achievements.length
              }
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageJobs;
