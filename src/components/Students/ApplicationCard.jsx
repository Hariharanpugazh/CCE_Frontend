import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookmark, FiMapPin, FiEye, FiClock } from "react-icons/fi";
import Cookies from "js-cookie";
import axios from "axios";

function timeAgo(dateString) {
  const givenDate = new Date(dateString);
  const now = new Date();
  const secondsDiff = Math.floor((now - givenDate) / 1000);

  const years = Math.floor(secondsDiff / 31536000);
  if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;

  const months = Math.floor(secondsDiff / 2592000);
  if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;

  const days = Math.floor(secondsDiff / 86400);
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;

  const hours = Math.floor(secondsDiff / 3600);
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const minutes = Math.floor(secondsDiff / 60);
  if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return "Just now";
}

function formatViewCount(count) {
  if (count === undefined || count === null) {
    return "0";
  }

  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  }

  return count.toString();
}

export default function ApplicationCard({
  application,
  handleCardClick,
  isSaved: initialIsSaved,
  small,
  onSaveToggle,
  setIsSavedJobsOpen,
  savedJobs,        
  isSavedJobsOpen,
}) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [viewCount, setViewCount] = useState(formatViewCount(application.views ? application.views : 0));
  console.log(application);  

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "admin") {
          setUserId(payload.admin_user);
        } else if (payload.role === "superadmin") {
          setUserId(payload.superadmin_user);
        } else if (payload.student_user) {
          setUserId(payload.student_user);
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
      }
    }
  }, []);

  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const handleViewDetails = async (event) => {
    event.stopPropagation();

    try {
      const jobId = application._id || application.id;
      await axios.post(`https://cce-backend-54k0.onrender.com/api/increment-view-count/${jobId}/`, {
        student_id: userId, // Include the student's ObjectId in the request payload
      });

      // Update the view count locally
      setViewCount((prevCount) => formatViewCount(parseInt(prevCount) + 1));

      navigate(
        `/${application.type === "internship" ? "internship-preview" : application.type === "exam" ? "exam-preview" : "job-preview"}/${jobId}`,
        { state: { savedJobs } }
      );
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleToggleSave = async (event) => {
    event.stopPropagation();

    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      const jobId = application._id || application.id;
      let endpoint;

      if (application.type === "exam") {
        endpoint = isSaved
          ? `https://cce-backend-54k0.onrender.com/api/unsave-exam/${jobId}/`
          : `https://cce-backend-54k0.onrender.com/api/save-exam/${jobId}/`;
      } else if (application.type === "internship") {
        endpoint = isSaved
          ? `https://cce-backend-54k0.onrender.com/api/unsave-internship/${jobId}/`
          : `https://cce-backend-54k0.onrender.com/api/save-internship/${jobId}/`;
      } else {
        endpoint = isSaved
          ? `https://cce-backend-54k0.onrender.com/api/unsave-job/${jobId}/`
          : `https://cce-backend-54k0.onrender.com/api/save-job/${jobId}/`;
      }

      const response = await axios.post(endpoint, {
        userId: userId,
      });

      setIsSaved(!isSaved);
      setShowSaveSuccess(true);
      setIsSavedJobsOpen(!isSavedJobsOpen);
      
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 2000);

      if (onSaveToggle) {
        onSaveToggle(jobId, !isSaved);
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-col justify-between
        ${small ? "p-2 text-[10px]" : "p-3 sm:p-4 md:p-5 text-sm sm:text-base"}`}
      onClick={handleCardClick}
    >
      {showSaveSuccess && (
        <div className="absolute top-0 right-2 z-50 bg-green-100 border border-green-200 text-green-800 px-2 py-0 rounded-lg shadow-lg flex items-center text-xs">
          {isSaved ? `${application.type} saved!` : ` ${application.type} removed!`}
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3
              className={`font-semibold text-gray-900 mb-1 line-clamp-2
                ${small ? "text-sm" : "text-base sm:text-lg md:text-xl"}`}
            >
              {application.title}
            </h3>
            {application.company_name && application.location ? (
              <div
                className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600
                  ${small ? "text-[13px]" : "text-xs sm:text-sm"}`}
              >
                <span className="flex items-center">
                  <i className="bi bi-building mr-1 opacity-75 text-[12px] sm:text-[14px]"></i>
                  {application.company_name}
                </span>
                <span className="flex items-center">
                  <FiMapPin className="mr-1 opacity-75 text-[12px] sm:text-[14px]" />
                  {application.location}
                </span>
              </div>
            ) : null}
          </div>
          {isSaved !== undefined && (
            <FiBookmark
              className={`cursor-pointer p-1 hover:bg-gray-100 rounded-md
                ${small ? "text-base" : "text-xl sm:text-2xl md:text-3xl"}
                ${isSaved ? "text-blue-600 fill-current" : "text-gray-400"}`}
              onClick={handleToggleSave}
              aria-label={isSaved ? "Unsave job" : "Save job"}
            />
          )}
        </div>

        <p
          className={`text-gray-600 mb-2 line-clamp-2 leading-snug
            ${small ? "text-[13px]" : "text-xs sm:text-sm"}`}
        >
          {application.job_description}
        </p>
        <div
          className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500
            ${small ? "text-[13px]" : "text-xs sm:text-sm"}`}
        >
          <div className="flex items-center">
            <FiClock className="mr-1 opacity-75 text-[12px] sm:text-[14px]" />
            {timeAgo(application.updated_at)}
          </div>
          <div className="flex items-center">
            <FiEye className="mr-1 opacity-75 text-[12px] sm:text-[15px]" />
            {viewCount} views
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-2 border-t border-gray-100">
        <span
          className={`inline-flex items-center rounded-full font-medium
            ${small ? "text-[10px] py-0.5 px-1" : "text-[10px] sm:text-xs py-1 px-2"}
            ${application.status === "Active" ? "text-green-800" : "text-red-800"}`}
        >
          <span
            className="mr-1 inline-block w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: application.status === "Active" ? "green" : "red",
            }}
          ></span>
          {application.status === "Active" ? "ON GOING" : "CLOSED"}
        </span>

        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <button
            className={`w-full sm:w-auto  bg-yellow-400 hover:bg-yellow-500 text-black rounded-sm
              ${small ? "text-[11px] py-1 px-2" : "text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4"}`}
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
