import { FiBookmark, FiMapPin } from "react-icons/fi";
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

  return "Recently";
}

export default function HorizontalApplicationCard({ application, handleCardClick, isSaved }) {
  const navigate = useNavigate();
  const data = application.job_data || application.internship_data || application;
  const isInternship = !!application.internship_data;

  const handleViewDetails = (event) => {
    event.stopPropagation();
    const previewPage = isInternship ? "internship-preview" : "job-preview";
    navigate(`/${previewPage}/${application._id || application.id}`);
  };

  return (
    <div
      className="flex items-center justify-between p-2 border border-gray-200 rounded-md hover:scale-[1.02] hover:shadow-md hover:border-transparent cursor-pointer bg-white text-sm"
      onClick={handleCardClick}
    >
      {/* Logo Section */}
      <div className="flex items-center space-x-2 w-2/5">
        <img src={data.company_logo || "default_logo.png"} alt="Company Logo" className="w-8 h-8 rounded-full" />
        <div>
          <p className="text-md font-medium">{data.title}</p>
          <div className="flex items-center text-xs text-gray-600 space-x-2">
            <span className="flex items-center">
              <FiMapPin className="w-3 h-3 mr-1" /> {data.location}
            </span>
            {data.selectedWorkType && (
              <span className="bg-gray-200 px-2 py-0.5 rounded-full text-xs">{data.selectedWorkType}</span>
            )}
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="text-xs text-gray-500 w-1/5">{timeAgo(application.updated_at)}</div>

      {/* Salary or Stipend */}
      <div className="text-md font-semibold text-gray-800 w-1/5">
        {isInternship ? `₹ ${data.stipend} / mo` : `₹ ${data.salary_range} / mo`}
      </div>

      {/* Save & Apply */}
      <div className="flex items-center justify-end space-x-2 w-1/5">
        {isSaved !== undefined && (
          <FiBookmark className={`text-lg cursor-pointer ${isSaved ? "text-blue-500 fill-current" : ""}`} />
        )}
        <button
          className="px-5 py-1 rounded-md text-xs bg-[#FFC800] transition-all duration-300"
          onClick={handleViewDetails}
        >
          APPLY
        </button>
      </div>
    </div>
  );
}
