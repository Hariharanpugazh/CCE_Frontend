import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import {
  Mail,
  Bell,
  Briefcase,
  GraduationCap,
  BookOpen,
  Trophy,
  Search,
  X,
  Send,
} from "lucide-react";
import { LoaderContext } from "../../components/Common/Loader"; // Import Loader Context
import Pagination from "../../components/Admin/pagination"; // Import Pagination Component

export default function AdminMail() {
  const [jobs, setJobs] = useState([]);
  const [exams, setExams] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Set items per page to 5
  const token = Cookies.get("jwt");
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoaderContext); // Use Loader Context

  useEffect(() => {
    if (!token) {
      setError("JWT token not found!");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true); // Show loader when fetching data
      try {
        const response = await fetch("http://localhost:8000/api/mailjobs/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            console.error("Authentication Error: Invalid or expired token");
            setError("Authentication failed. Please log in again.");
            navigate("/login");
            return;
          }
          console.error("API Error Response:", errorData);
          throw new Error(errorData.error || "Failed to fetch data");
        }

        const data = await response.json();
        console.log("API Response:", data); // Log the full API response
        console.log("Exams in API Response:", data.exams); // Log exams specifically
        setJobs(data.jobs || []);
        setExams(data.exam || []);
        setInternships(data.internships || []);
        setAchievements(data.achievements || []);
        setStudyMaterials(data.study_materials || []);
      } catch (error) {
        console.error("Fetch Error:", error.message); // Log fetch error
        setError(error.message);
      } finally {
        setIsLoading(false); // Hide loader after data fetch
      }
    };

    const fetchReview = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/fetch-review/",
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
          // Sort reviews by timestamp in descending order
          reviewsData = reviewsData.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setReviews(reviewsData);
        } else {
          console.error("Unexpected data format:", reviewsData);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
    fetchReview();
  }, [token, navigate, setIsLoading]);

  // Log exams state whenever it changes
  useEffect(() => {
    console.log("Exams state updated:", exams);
  }, [exams]);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const renderContent = () => {
    let itemsToDisplay = [];

    switch (activeTab) {
      case "jobs":
        itemsToDisplay = jobs || [];
        break;
      case "internships":
        itemsToDisplay = internships || [];
        break;
      case "exams":
        itemsToDisplay = exams || [];
        break;
      case "achievements":
        itemsToDisplay = achievements || [];
        break;
      case "study_materials":
        itemsToDisplay = studyMaterials || [];
        break;
      case "notifications":
        itemsToDisplay = reviews || [];
        break;
      default:
        return null;
    }

    console.log(`Items to display for ${activeTab}:`, itemsToDisplay);

    if (!Array.isArray(itemsToDisplay)) {
      console.error(`itemsToDisplay is not an array for ${activeTab}:`, itemsToDisplay);
      return (
        <p className="text-center text-red-500">
          Error: Unable to display items. Please try again later.
        </p>
      );
    }

    if (itemsToDisplay.length === 0) {
      return (
        <p className="text-center text-gray-600">
          No {activeTab} available at the moment.
        </p>
      );
    }

    const filteredItems = itemsToDisplay.filter(
      (item) =>
        item.job_data?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.internship_data?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.exam_data?.exam_title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.study_material_data?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.item_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <section>
        {currentItems.length > 0 ? (
          <div className="space-y-4">
            {currentItems.map((item) => (
              <motion.div
                key={item._id || item.review_id}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {item.job_data?.title ||
                      item.internship_data?.title ||
                      item.exam_data?.exam_title ||
                      item.name ||
                      item.study_material_data?.title ||
                      item.item_name ||
                      "Notification"}
                  </span>
                  {item.study_material_data ? null : (
                    <div className="flex space-x-2">
                      {activeTab !== "notifications" && (
                        <>
                          <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                            {item.status}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${item.is_publish === true
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
                    </div>
                  )}
                </div>
                <p className="text-gray-700 mt-2">
                  {item.job_data?.company_name ||
                    item.internship_data?.company_name ||
                    item.exam_data?.about_exam ||
                    item.achievement_description ||
                    item.study_material_data?.description ||
                    `Type: ${item.item_type}, Feedback: ${item.feedback}`}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No items found.</p>
        )}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </section>
    );
  };

  const handleActiveTab = (tab) => {
    setActiveTab(tab)
    setSelectedItem(null)
  }

  const renderPreview = () => {
    if (!selectedItem) return null;

    const {
      job_data,
      internship_data,
      exam_data,
      achievement_description,
      study_material_data,
      is_publish,
      item_type,
      item_id,
      feedback,
    } = selectedItem;

    return (
      <div className="flex-1 relative p-4 bg-gray-100 rounded-lg shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-700 text-lg">
              {selectedItem.name ? selectedItem.name[0] : "A"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {job_data?.title ||
                  internship_data?.title ||
                  exam_data?.exam_title ||
                  selectedItem.name ||
                  study_material_data?.title ||
                  selectedItem.item_name ||
                  "Notification"}
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                {activeTab !== "notifications" && (
                  <>
                    <span>
                      {job_data?.company_name ||
                        internship_data?.company_name ||
                        "Company Name"}
                    </span>
                    <span>
                      {is_publish === true
                        ? "Approved"
                        : is_publish === false
                          ? "Rejected"
                          : "Pending"}
                    </span>
                  </>
                )}
              </div>
              {feedback && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-2 rounded">
                  <strong>Feedback:</strong> {feedback}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t my-4" />
        <div className="whitespace-pre-wrap text-sm text-gray-700">
          {job_data?.job_description ||
            internship_data?.job_description ||
            exam_data?.about_exam ||
            achievement_description ||
            study_material_data?.description}
        </div>
        {job_data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600 font-semibold">Experience:</p>
              <p className="text-sm">{job_data.experience_level}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Salary:</p>
              <p className="text-sm">{job_data.salary_range}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Location:</p>
              <p className="text-sm">{job_data.job_location}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Work Type:</p>
              <p className="text-sm">{job_data.selectedWorkType}</p>
            </div>
          </div>
        )}
        {internship_data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600 font-semibold">Duration:</p>
              <p className="text-sm">{internship_data.duration}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Stipend:</p>
              <p className="text-sm">{internship_data.stipend}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Location:</p>
              <p className="text-sm">{internship_data.location}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Type:</p>
              <p className="text-sm">{internship_data.internship_type}</p>
            </div>
          </div>
        )}
        {exam_data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600 font-semibold">Eligibility:</p>
              <p className="text-sm">{exam_data.eligibility_criteria}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Application Process:</p>
              <p className="text-sm">{exam_data.application_process}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Important Dates:</p>
              <p className="text-sm">{exam_data.important_dates}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Exam Centers:</p>
              <p className="text-sm">{exam_data.exam_centers}</p>
            </div>
          </div>
        )}
        {study_material_data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600 font-semibold">Category:</p>
              <p className="text-sm">{study_material_data.category}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Content:</p>
              <p className="text-sm">{study_material_data.text_content}</p>
            </div>
          </div>
        )}
        {item_type && (
          <div className="mt-4 text-center">
            <Link
              to={
                item_type === "internship"
                  ? `/internship-edit/${item_id}`
                  : item_type === "exam"
                    ? `/exam-edit/${item_id}`
                    : `/job-edit/${item_id}`
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-block"
            >
              Edit
            </Link>
          </div>
        )}
        {!item_type && (
          <div className="mt-4">
            <a
              href={job_data?.job_link || internship_data?.job_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center inline-block"
            >
              {job_data
                ? "Apply Now"
                : internship_data
                  ? "Apply Now"
                  : "View More"}
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminPageNavbar />
      <div className="flex flex-1 p-4 space-x-4 mr-12 ml-10">
        {/* Sidebar */}
        <div className="w-1/4 max-w-[20%] space-y-4 shadow-md rounded-lg p-4 bg-white ml-55">
          <div className="flex items-center gap-2 mb-8">
            <Mail className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Mail</h1>
          </div>

          <nav className="space-y-2">
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${activeTab === "jobs"
                  ? "bg-yellow-50 text-yellow-600"
                  : "hover:bg-gray-200"
                }`}
              onClick={() => handleActiveTab("jobs")}
            >
              <Briefcase className="h-4 w-4" />
              Jobs
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${activeTab === "internships"
                  ? "bg-yellow-50 text-yellow-600"
                  : "hover:bg-gray-200"
                }`}
              onClick={() => handleActiveTab("internships")
              }
            >
              <GraduationCap className="h-4 w-4" />
              Internships
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${activeTab === "exams"
                  ? "bg-yellow-50 text-yellow-600"
                  : "hover:bg-gray-200"
                }`}
              onClick={() => handleActiveTab("exams")}
            >
              <Briefcase className="h-4 w-4" />
              Exams
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${activeTab === "study_materials"
                  ? "bg-yellow-50 text-yellow-600"
                  : "hover:bg-gray-200"
                }`}
              onClick={() => handleActiveTab("study_materials")}
            >
              <BookOpen className="h-4 w-4" />
              Study Materials
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${activeTab === "achievements"
                  ? "bg-yellow-50 text-yellow-600"
                  : "hover:bg-gray-200"
                }`}
              onClick={() => handleActiveTab("achievements")}
            >
              <Trophy className="h-4 w-4" />
              Achievements
            </button>
          </nav>

          <div className="mt-4" />
        </div>

        {/* Email List */}
        <div className="w-3/4 flex flex-col">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 px-4 py-2 border rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto space-y-4">
            {renderContent()}
          </div>
        </div>

        {/* Email Preview */}
        {selectedItem && (
          <div className="flex justify-center items-start mt-14 w-2/3">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
}