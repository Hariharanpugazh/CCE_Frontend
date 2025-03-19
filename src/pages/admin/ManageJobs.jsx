import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Pagination from "../../components/Admin/pagination";
import backIcon from "../../assets/icons/back-icon.svg";
import nextIcon from "../../assets/icons/next-icon.svg";
import approvedIcon from "../../assets/icons/Approved 1.png";
import rejectedIcon from "../../assets/icons/Rejected 1.png";
import pendingIcon from "../../assets/icons/Pending 1.png"; // Corrected import for pending icon
import NoListing from "../../assets/images/NoListing.svg";

import {
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { FaClock, FaEye, FaMinus } from "react-icons/fa";
import { IoMdCheckboxOutline } from "react-icons/io";
import { LoaderContext } from "../../components/Common/Loader";

const ItemCard = ({ item, type }) => {
  const navigate = useNavigate();
  const itemId = item._id;

  let title, company, description, jobLocation, selectedCategory, status, previewPath;
  if (type === "jobs") {
    title = item.job_data?.title || "No Title";
    company = item.job_data?.company_name || "Unknown Company";
    jobLocation = item.job_data?.job_location || "Not Specified";
    status = item.is_publish;
    console.log(item);
    selectedCategory = item.job_data ? "Job" : "No Category required";
    previewPath = `/job-preview/${itemId}`;

  } else if (type === "study materials") {
    title = item?.title || "No Title";
    selectedCategory = item?.category || "Unknown Category";
    status = item.is_publish;
    previewPath = `/student-study-detail/${itemId}`;

  } else if (type === "internships") {
    title = item.internship_data?.title || "No Title";
    company = item.internship_data?.company_name || "Unknown Company";
    status = item.is_publish;
    jobLocation = item.internship_data?.location || "Not Specified";
    selectedCategory = item.internship_data?.selectedCategory || "Internship";
    previewPath = `/internship-preview/${itemId}`;

  } else if (type === "exams") {
    title = item.exam_data?.exam_title || "No Title";
    // company = item.exam_data?.category || "Unknown Category";
    status = item.is_publish;
    previewPath = `/exam-preview/${itemId}`;

  } else {
    title = item.name || "No Title";
    company = item.company_name || "No Company";
    description = item.achievement_description || "No Skills required";
    previewPath = `/achievement-preview/${itemId}`;
  }

  return (
    <div className="border border-gray-300 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between bg-white flex-wrap mb-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg md:text-xl mb-0.5">{title}</h3>
        <p className="text-sm text-gray-700 flex space-x-3 flex-wrap">
        {(type === "jobs" || type === "internships" || type === "achievements") && (
            <span className="font-semibold">
              Company: <span className="font-normal"> {company} &nbsp; </span>
            </span>
          )}
          {(type === "jobs" || type === "internships") && (
            <span className="font-semibold">
              Location: <span className="font-normal"> {jobLocation} &nbsp; </span>
            </span>
          )}
          {(type === "jobs" || type === "internships" || type === "study materials") && (
            <span className="font-semibold">
              Category: <span className="font-normal"> {selectedCategory} &nbsp; </span>
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2 items-left mt-4 md:mt-0">
        {(status === true) && (
          <span className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm flex items-center">
            Approved <img src={approvedIcon} alt="Approved" className="ml-1 text-xs" width={20} height={10} />
          </span>
        )}
        {(status === false) && (
          <span className="bg-red-500 text-white px-4 py-2  rounded-lg text-sm flex items-center">
            Rejected  <img src={rejectedIcon} alt="Rejected" className="ml-1 text-xs mr-1" width={20} height={10} />  
          </span>
        )}
        {(status === null) && (
          <span className="bg-yellow-500 text-black px-5 py-2 ml-1 rounded-lg text-sm flex items-center">
            Pending <img src={pendingIcon} alt="Pending" className="ml-1 text-xs" width={20} height={10} /> 
          </span>
        )}
        <button
          onClick={() => {
            if (itemId) {
              navigate(previewPath);
            } else {
              alert("Error: Invalid ObjectId. Please check backend response.");
            }
          }}
          className="text-black border px-3 py-2 rounded-lg text-sm flex items-center gap-1"
        >
          View
          <FaEye size={14} />
        </button>
      </div>
    </div>
  );
};

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [exams, setExams] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Jobs");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const { setIsLoading } = useContext(LoaderContext)

  useEffect(() => {
    const fetchData = async (endpoint, setState, key) => {
      try {
        setIsLoading(true);
        const token = Cookies.get("jwt");
        const response = await axios.get(
          `http://localhost:8000/api/${endpoint}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.data && Array.isArray(response.data[key])) {
          setState(response.data[key]);
        } else {
          setState([]);
        }
        setIsLoading(false);
      } catch (error) {
        setState([]);
        setIsLoading(false);
      }
    };

    fetchData("manage-jobs", setJobs, "jobs");
    fetchData("manage-study-materials", setStudyMaterials, "study_materials");
    fetchData("manage-internships", setInternships, "internships");
    fetchData("manage-achievements", setAchievements, "achievements");
    fetchData("manage-exams", setExams, "exams");
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

  const itemsToDisplay = paginate({ Jobs: jobs, Internships: internships, Exams: exams, Achievements: achievements, 'Study Materials': studyMaterials }[selectedCategory]);

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row pt-5">
      <AdminPageNavbar />
      <div className="flex-1 flex flex-col items-stretch">
        <section className="flex flex-col">
          <div className="flex rounded-lg border border-gray-300 items-center my-10 mx-6 max-w-full md:max-w-55">
            <button
              className={`p-2 border-r border-gray-300 rounded-l-lg ${selectedCategory === "Jobs" ? "opacity-50" : "cursor-pointer"}`}
              onClick={() => {
                switch (selectedCategory) {
                  case "Jobs": {
                    return;
                  }
                  case "Internships": {
                    setSelectedCategory("Jobs");
                    return;
                  }
                  case "Exams": {
                    setSelectedCategory("Internships");
                    return;
                  }
                  case "Achievements": {
                    setSelectedCategory("Exams");
                    return;
                  }
                  case "Study Materials": {
                    setSelectedCategory("Achievements");
                    return;
                  }
                  default: {
                    return;
                  }
                }
              }}
            >
              <img src={backIcon} alt="Back" className="w-5" />
            </button>
            <p className="px-3 flex-1 text-center">{selectedCategory}</p>
            <button
              className={`p-2 border-l border-gray-300 hover:bg-gray-50 rounded-r-lg ${selectedCategory === "Study Materials" ? "opacity-50" : "cursor-pointer"}`}
              onClick={() => {
                switch (selectedCategory) {
                  case "Jobs": {
                    setSelectedCategory("Internships");
                    return;
                  }
                  case "Internships": {
                    setSelectedCategory("Exams");
                    return;
                  }
                  case "Exams": {
                    setSelectedCategory("Achievements");
                    return;
                  }
                  case "Achievements": {
                    setSelectedCategory("Study Materials");
                    return;
                  }
                  case "Study Materials": {
                    return;
                  }
                  default: {
                    return;
                  }
                }
              }}
            >
              <img src={nextIcon} alt="Next" className="w-5" />
            </button>
          </div>

          <div className="flex-1 px-6 flex flex-col space-y-3">
            {itemsToDisplay.length > 0 ? (
              <div className="border border-gray-300 rounded-lg p-5 shadow-sm bg-white">
                {itemsToDisplay.map((achievement, key) => (
                  <ItemCard item={{ ...achievement }} type={selectedCategory.toLowerCase()} key={key} />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <img src={NoListing} alt="No Listings" className="max-w-full max-h-full mt-40" />
              </div>
            )}
          </div>
        </section>
        {itemsPerPage.length > 0 && (
          <div className="px-6">
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={{ Jobs: jobs.length, Internships: internships.length, Exams: exams.length, Achievements: achievements.length, StudyMaterials: studyMaterials.length }[selectedCategory]}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
