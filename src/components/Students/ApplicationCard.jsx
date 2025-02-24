import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookmark, FiMapPin, FiEye, FiClock } from "react-icons/fi";
import Cookies from "js-cookie";

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
  // Ensure count is a valid number, default to 0 if undefined/null
  if (count === undefined || count === null) {
    return "0"; // Default to "0" views if no data is available
  }

  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  }

  return count.toString();
}

export default function ApplicationCard({ application, handleCardClick, isSaved, small }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const Viewscount = formatViewCount(application.total_views);

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

  const handleViewDetails = async (event) => {
    event.stopPropagation();
    navigate(`/${application.type === "internship" ? "internship-preview" : "job-preview"}/${application._id || application.id}`);
  };

  return (
    <div
      className={`flex-1 relative bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-300 flex flex-col justify-between
        ${small ? "p-2 text-[10px]" : "p-5 text-base"}`}
      onClick={handleCardClick}
    >
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className={`font-semibold text-gray-900 mb-0.5 ${small ? "text-sm" : "text-xl"}`}>
              {application.title}
            </h3>
            <div className={`flex items-center space-x-1 ${small ? "text-[9px]" : "text-sm"} text-gray-600`}>
              <span className="flex items-center">
                <i className="bi bi-building mr-1 opacity-75 text-[12px]"></i>
                {application.company_name}
              </span>
              <span className="flex items-center">
                <FiMapPin className="mr-1 opacity-75 text-[12px]" />
                {application.location}
              </span>
            </div>
          </div>
          {isSaved !== undefined && (
            <FiBookmark
              className={`cursor-pointer p-1 hover:bg-gray-100 rounded-md 
                ${small ? "text-lg" : "text-4xl"} 
                ${isSaved ? "text-blue-600 fill-current" : "text-gray-400"}`}
            />
          )}
        </div>

        {/* Description Section */}
        <p className={`text-gray-600 mb-2 line-clamp-2 leading-snug ${small ? "text-[10px]" : "text-sm"}`}>
          {application.job_description}
        </p>
        <div className={`flex items-center space-x-2 text-gray-500 ${small ? "text-[9px]" : "text-sm"}`}>
          <div className="flex items-center">
            <FiClock className="mr-1 opacity-75 text-[12px]" />
            {timeAgo(application.updated_at)}
          </div>
          <div className="flex items-center">
            <FiEye className="mr-1 opacity-75 text-[12px]" />
            {Viewscount} views
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between mt-1 items-start sm:items-center pt-1">
        {/* Status Badge */}
        <span className={`inline-flex items-center rounded-full font-medium 
          ${small ? "text-[9px] py-0.5" : "text-xs py-1"} 
          ${application.status === "Active" ? "text-green-800" : "text-red-800"}`}>
          <span className="mr-1 inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: application.status === "Active" ? "green" : "red" }}></span>
          {application.status === "Active" ? "ON GOING" : "CLOSED"}
        </span>

        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            className={`w-full sm:w-auto border border-gray-300 rounded-md hover:border-gray-400 transition-colors duration-200
              ${small ? "text-[9px] py-1 px-2" : "text-sm py-2.5 px-4"}`}
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}


