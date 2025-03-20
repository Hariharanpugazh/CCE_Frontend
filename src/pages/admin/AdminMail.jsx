import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import {
  Search,
  X,
} from "lucide-react";
import { LoaderContext } from "../../components/Common/Loader";
import Pagination from "../../components/Admin/pagination";
import { FaEye } from "react-icons/fa";

export default function AdminMail() {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const token = Cookies.get("jwt");
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!token) {
      setError("JWT token not found!");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const fetchReview = async () => {
      try {
        const response = await fetch(
          "https://cce-backend.onrender.com/api/fetch-review/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch review");
        }

        const data = await response.json();
        let reviewsData = data.reviews || [];
        if (Array.isArray(reviewsData)) {
          reviewsData = reviewsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setReviews(reviewsData);
        } else {
          console.error("Unexpected data format:", reviewsData);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchReview();
  }, [token, navigate, setIsLoading]);

  if (isLoading) {
    return <div className="text-center text-gray-500"></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const paginate = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const filteredItems = reviews.filter(
    (item) =>
      item.job_data?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.internship_data?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.study_material_data?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.item_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    let itemsToDisplay = [];

    switch (activeTab) {
      case "notifications":
        itemsToDisplay = reviews;
        break;
      default:
        return null;
    }

    return (
      <section>
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            paginate(filteredItems).map((item) => (
              <motion.div
                key={item._id || item.review_id}
                className="p-2 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 cursor-pointer border border-gray-400"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-semibold text-lg">
                      {item.job_data?.title ||
                        item.internship_data?.title ||
                        item.name ||
                        item.study_material_data?.title ||
                        item.item_name ||
                        "Notification"}
                      {item.item_type && (
                        <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 text-black-400">
                          {item.item_type}
                        </span>
                      )}
                      <span className="ml-2 text-xs px-2 py-1 rounded bg-red-500 text-white">
                        Rejected
                      </span>
                    </span>
                    <p className="text-gray-700">
                      {item.job_data?.company_name ||
                        item.internship_data?.company_name ||
                        item.achievement_description ||
                        item.study_material_data?.description ||
                        `Feedback: ${item.feedback}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {activeTab !== "notifications" && (
                      <>
                        <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                          {item.status}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.is_publish === true
                              ? "bg-green-200 text-green-800"
                              : item.is_publish === false
                              ? "bg-red-200 text-red-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {item.is_publish === true
                            ? "Approved"
                            : item.is_publish === false
                            ? "Rejected"
                            : "Pending"}
                        </span>
                      </>
                    )}
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        className="text-black border px-3 py-2 rounded-lg text-sm flex items-center gap-1"
                        onClick={() => setSelectedItem(item)}
                      >
                        View
                        <FaEye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600">No items found.</p>
          )}
        </div>
      </section>
    );
  };

  const renderPreview = () => {
    if (!selectedItem) return null;

    const {
      job_data,
      internship_data,
      achievement_description,
      study_material_data,
      is_publish,
      item_type,
      item_id,
      feedback,
      timestamp
    } = selectedItem;

    const daysAgo = timestamp ? calculateDaysAgo(timestamp) : "2 days ago";

    let statusDisplay = "CLOSED";
    let statusClass = "text-red-700";
    let statusDotColor = "bg-red-500";
    if (internship_data && internship_data.application_deadline) {
      const deadlineDate = new Date(internship_data.application_deadline);
      const now = new Date();
      if (deadlineDate > now) {
        statusDisplay = "ONGOING";
        statusClass = "text-green-700";
        statusDotColor = "bg-green-500";
      }
    }

    const title = job_data?.title ||
      internship_data?.title ||
      selectedItem.name ||
      study_material_data?.title ||
      selectedItem.item_name ||
      "Data Analyst";

    const companyName = job_data?.company_name ||
      internship_data?.company_name;

    const location = job_data?.job_location ||
      internship_data?.location ;

    const description = job_data?.job_description ||
      internship_data?.job_description ||
      achievement_description ||
      study_material_data?.description ||
      "N/A";

    const status = is_publish === true
      ? "Approved"
      : is_publish === false
        ? "Rejected"
        : "Pending";

    const itemTypeLabel = job_data ? "JOB" :
                       internship_data ? "INTERNSHIP" :
                       study_material_data ? "STUDY MATERIAL" :
                       selectedItem.item_type ? selectedItem.item_type.toUpperCase() : "UNKNOWN";

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white rounded-lg shadow-xl ml-60 z-10 max-w-lg w-full overflow-hidden">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={() => setSelectedItem(null)}
          >
            <X size={25} />
          </button>
          <div className="p-6 ml-5 mr-5">
            <div className="bg-white rounded-lg border border-gray-200 mt-10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{title}</h2>
                  <p className="text-sm text-gray-600">{companyName}</p>
                  <p className="text-sm text-gray-600">{location}</p>
                </div>
                <div className="text-xs px-2 py-1 bg-gray-200 mr-2 rounded-md">{itemTypeLabel}</div>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                {description.length > 100 && (
                  <span className="text-gray-700 hover:underline cursor-pointer">more</span>
                )}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <p>{daysAgo}</p>
              </div>
              <div className="flex items-center mt-1">
                <span className={`w-2 h-2 rounded-full ${statusDotColor} mr-1`}></span>
                <span className={`text-xs font-medium ${statusClass}`}>{statusDisplay}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-800">Feedback: <span className="font-normal">{feedback || "Check the spelling mistake also check the details and upload it again"}</span></p>
            </div>

            {item_type && (
              <div className="mt-4 text-center">
                <Link
                  to={
                    item_type === "internship"
                      ? `/internship-preview/${item_id}`
                      : `/job-preview/${item_id}`
                  }
                  className="bg-yellow-500 mt-20 text-white px-4 py-2 ml-80 rounded-md inline-block"
                >
                  Edit post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const calculateDaysAgo = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminPageNavbar />
      <div className="flex flex-1 p-6 space-x-6 ml-62 mr-9 overflow-hidden">
        <div className="w-3/3 flex flex-col space-y-6">
          <div className="mb-4">
            <div className="relative flex">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 px-4 py-2 border border-gray-400 rounded-md w-3/4 "
              />
            </div>
          </div>
          <div className=" p-6 rounded-lg shadow-lg border border-gray-400">
            {renderContent()}
          </div>
          {filteredItems.length > itemsPerPage && (
            <div className="px-6">
              <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={filteredItems.length} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
        {selectedItem && renderPreview()}
      </div>
    </div>
  );
}
