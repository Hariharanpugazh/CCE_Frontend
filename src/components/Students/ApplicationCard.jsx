import { FiBookmark, FiCircle, FiMapPin, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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

export default function ApplicationCard({ application, handleCardClick, isSaved }) {
  const navigate = useNavigate();

  const handleViewDetails = (event) => {
    event.stopPropagation();
    const previewPage = application.type === "internship" ? "internship-preview" : "job-preview";
    navigate(`/${previewPage}/${application._id || application.id}`);
  };

  return (
    <div
      className="flex flex-col p-3 border border-gray-200 rounded-lg hover:scale-[1.03] cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Title Section */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-xl font-semibold">{application.title}</p>
          <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
            <p className="flex items-center">
              <i className="bi bi-building w-[15px] mr-[5px]"></i> {application.company_name}
            </p>
            <FiCircle className="w-1 h-1 text-gray-600" />
            <p className="flex items-center">
              <FiMapPin className="w-4 h-4 mr-1" /> {application.job_location}
            </p>
          </div>
        </div>
        {isSaved !== undefined && (
          <FiBookmark className={`text-2xl cursor-pointer ${isSaved ? "text-blue-500 fill-current" : ""}`} />
        )}
      </div>

      {/* Description Section */}
      <p className="text-xs text-gray-700 my-4">{application.job_description}</p>

      {/* Tags Section */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-800">
        {application.selectedWorkType && <span className="bg-gray-200 px-2 py-1 rounded-full">{application.selectedWorkType}</span>}
        {application.work_type && <span className="bg-gray-200 px-2 py-1 rounded-full">{application.work_type}</span>}
        {application.experience_level && <span className="bg-gray-200 px-2 py-1 rounded-full">{application.experience_level}</span>}
      </div>

      {/* Meta Info Section */}
      <div className="flex items-center text-gray-500 text-xs mt-3 space-x-2">
        <span>{timeAgo(application.updated_at)}</span>
        <span>|</span>
        <span className="flex items-center">
          <FiEye className="mr-1" /> {application.views ?? 0} views
        </span>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center mt-4">
        <span className={`text-sm font-bold ${application.status === "active" ? "text-green-500" : "text-red-500"}`}>
          {application.status === "active" ? "ON GOING" : "EXPIRED"}
        </span>
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded font-medium text-sm hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
          onClick={handleViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
