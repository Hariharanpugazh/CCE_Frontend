import { useContext, useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import ApplicationCard from "../../components/Students/ApplicationCard";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Footer from "../../components/Common/Footer";
import Pagination from "../../components/Admin/pagination";
import { FiSearch } from "react-icons/fi";
import { LoaderContext } from "../../components/Common/Loader";
import NoListingImage from "../../assets/images/NoListing.svg"; // Import the image

export default function ExamDashboard() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [savedExams, setSavedExams] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [selectedFilter, setSelectedFilter] = useState("");
  const filters = ["Newest", "Oldest"];

  const { setIsLoading } = useContext(LoaderContext);

  const navigate = useNavigate();

  // Load saved filters and page position from localStorage on component mount
  useEffect(() => {
    const savedFilters = localStorage.getItem("examFilters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setSearchQuery(parsedFilters.searchQuery || "");
      setSelectedFilter(parsedFilters.selectedFilter || "");
    }

    // Restore page position
    const savedPage = localStorage.getItem("examCurrentPage");
    if (savedPage) {
      setCurrentPage(Number.parseInt(savedPage, 10));
    }
  }, []);

  // Fetch published exams
  useEffect(() => {
    const fetchPublishedExams = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://cce-backend-54k0.onrender.com/api/published-exams/"
        );
        const examsWithType = response.data.exams
          .filter(
            (exam, index, self) =>
              index === self.findIndex((e) => e._id === exam._id)
          ) // Remove duplicates based on _id
          .map((exam) => {
            const updatedAt = new Date(exam.updated_at);
            const now = new Date();
            const twoMonthsAgo = new Date(now.setMonth(now.getMonth() - 2));
            const status = updatedAt < twoMonthsAgo ? "CLOSED" : "ON GOING";
            return {
              ...exam,
              type: "exam",
              status: exam.status,
              updated_at: exam.updated_at,
            };
          });
        setExams(examsWithType);
        setFilteredExams(examsWithType);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching published exams:", err);
        setError("Failed to load exams.");
      }
    };
    fetchPublishedExams();
  }, []);

  // Set user role
  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(!payload.student_user ? payload.role : "student");
    }
  }, []);

  const fetchSavedExams = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      const response = await axios.get(
        `https://cce-backend-54k0.onrender.com/api/saved-exams/${userId}/`
      );
      setSavedExams(response.data.exams.map((exam) => exam._id));
    } catch (err) {
      console.error("Error fetching saved exams:", err);
    }
  };

  useEffect(() => {
    if (userRole === "student") {
      fetchSavedExams();
    }
  }, [userRole]);

  // Filter exams based on search query and selected filter
  useEffect(() => {
    if (exams.length === 0) return;

    let filtered = exams;

    if (searchQuery) {
      filtered = filtered.filter(
        (exam) =>
          exam.exam_data.exam_title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          exam.exam_data.about_exam
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          exam.exam_data.eligibility_criteria
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          exam.exam_data.application_process
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter) {
      const now = new Date();
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(now.getDate() - 1);

      if (selectedFilter === "Newest") {
        // Show exams updated within the last day
        filtered = filtered.filter((exam) => {
          const examUpdateDate = new Date(exam.updated_at);
          return examUpdateDate >= oneDayAgo;
        });
      } else if (selectedFilter === "Oldest") {
        // Show exams updated more than one day ago
        filtered = filtered.filter((exam) => {
          const examUpdateDate = new Date(exam.updated_at);
          return examUpdateDate < oneDayAgo;
        });
      }
    }

    setFilteredExams(filtered);

    // Save current filters to localStorage
    const filtersToSave = {
      searchQuery,
      selectedFilter,
    };
    localStorage.setItem("examFilters", JSON.stringify(filtersToSave));
  }, [searchQuery, selectedFilter, exams]);

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("examCurrentPage", currentPage.toString());
  }, [currentPage]);

  // Pagination
  const indexOfLastExam = currentPage * itemsPerPage;
  const indexOfFirstExam = indexOfLastExam - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCardClick = (examId) => {
    // Save current state before navigating
    localStorage.setItem("examCurrentPage", currentPage.toString());

    const filtersToSave = {
      searchQuery,
      selectedFilter,
    };
    localStorage.setItem("examFilters", JSON.stringify(filtersToSave));

    navigate(`/exam-preview/${examId}`);
  };

  return (
    <div className="sm:flex">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1">
        {userRole === "student" && <StudentPageNavbar />}

        <header className="flex flex-col items-center justify-center py-8 px-4 sm:py-14 container mx-auto text-center">
          <p className="text-3xl sm:text-6xl tracking-[0.8px]">Exams</p>
          <p className="text-base sm:text-lg mt-2">
            Explore all the upcoming exams and opportunities <br />
            to advance your career.
          </p>
        </header>

        {/* Search and Filter Bar */}
        <div className="flex flex-col justify-between md:flex-row gap-4 mb-8 mr-12 ml-12">
          <div
            className={`flex flex-1 ${
              userRole === "student" ||
              userRole === "admin" ||
              userRole === "superadmin"
                ? "max-w-full"
                : "max-w-225"
            } relative`}
          >
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 h-10 rounded-md w-full border border-gray-300 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              className="h-10 bg-white border border-gray-300 rounded-md px-4 hover:bg-gray-100 w-70"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">Sort by relevance</option>
              <option value="Newest">Newest (Last 24 hours)</option>
              <option value="Oldest">Oldest (More than 24 hours)</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col sm:flex-row px-4 sm:px-10 space-y-5 sm:space-y-0 sm:space-x-5">
          {/* Exam Cards */}
          <div className="flex-1 flex flex-col space-y-3">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {error ? (
                <p className="text-red-600">{error}</p>
              ) : exams.length === 0 ? (
                <div className="alert alert-danger w-full col-span-full text-center flex flex-col items-center">
                  <img src={NoListingImage} alt="No Listings" className="mb-4" />
                </div>
              ) : currentExams.length === 0 ? (
                <div className="alert alert-danger w-full col-span-full text-center flex flex-col items-center">
                  <img src={NoListingImage} alt="No Listings" className="mb-4" />
              
                </div>
              ) : (
                currentExams.map((exam, index) => (
                  <ApplicationCard
                    key={exam._id || `exam-${index}`} // Fallback key if _id is missing
                    application={{
                      title: exam.exam_data.exam_title,
                      company_name: exam.exam_data.organizing_body,
                      location: exam.exam_data.exam_location,
                      job_description: exam.exam_data.about_exam,
                      updated_at: exam.updated_at,
                      views: exam.views,
                      status: exam.status,
                      type: "exam",
                      _id: exam._id,
                    }}
                    handleCardClick={() => handleCardClick(exam._id)}
                    isSaved={
                      userRole === "superadmin" || userRole === "admin"
                        ? undefined
                        : savedExams.includes(exam._id)
                    }
                  />
                ))
              )}
            </div>

            {filteredExams.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={filteredExams.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
        {/* Footer - Only shown for student role */}
        {userRole === "student" && <Footer />}
      </div>
    </div>
  );
}
