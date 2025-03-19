"use client";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import Footer from "../../components/Common/Footer";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Admin/pagination";
import { LoaderContext } from "../../components/Common/Loader";
import NoListingImage from "../../assets/images/NoListing.svg"; // Import the image

export default function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [userRole, setUserRole] = useState(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // setUserRole(!payload.student_user ? payload.role : "student");
      return !payload.student_user ? payload.role : "student";
    }
  });
  const [selectedJob, setSelectedJob] = useState();
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isEmployTypeOpen, setIsEmployTypeOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isWorkModeOpen, setIsWorkModeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [salaryRangeIndex, setSalaryRangeIndex] = useState(0);
  const [filters, setFilters] = useState(() => {
    // Try to get saved filters from localStorage
    const savedFilters = localStorage.getItem("jobFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
        salaryRange: { min: 10000, max: 1000000 },
        experience: { value: 0, category: "under" },
        employmentType: { onSite: false, remote: false, hybrid: false },
        workingMode: { online: false, offline: false, hybrid: false },
        sortBy: "Relevance",
      };
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isSavedJobsOpen, setIsSavedJobsOpen] = useState(false);
  const itemsPerPage = 12;

  const { setIsLoading } = useContext(LoaderContext);

  const navigate = useNavigate();

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    let filtered = jobs;

    if (searchPhrase !== "") {
      filtered = filtered.filter((job) => {
        const skills = job.job_data.required_skills;
        const isArray = Array.isArray(skills);

        return (
          job.job_data.title.toLowerCase().includes(searchPhrase) ||
          job.job_data.company_name.toLowerCase().includes(searchPhrase) ||
          job.job_data.job_description.toLowerCase().includes(searchPhrase) ||
          (isArray &&
            skills.some((skill) =>
              skill.toLowerCase().includes(searchPhrase)
            )) ||
          job.job_data.work_type.toLowerCase().includes(searchPhrase)
        );
      });
    }

    // Apply time-based filtering
    if (filters.sortBy === "Newest" || filters.sortBy === "Oldest") {
      const now = new Date();
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(now.getDate() - 1);

      if (filters.sortBy === "Newest") {
        // Show jobs updated within the last 24 hours
        filtered = filtered.filter((job) => {
          const jobUpdateDate = new Date(job.updated_at);
          return jobUpdateDate >= oneDayAgo;
        });
      } else if (filters.sortBy === "Oldest") {
        // Show jobs updated more than 24 hours ago
        filtered = filtered.filter((job) => {
          const jobUpdateDate = new Date(job.updated_at);
          return jobUpdateDate < oneDayAgo;
        });
      }
    }

    // Apply salary filter
    if (
      filters.salaryRange &&
      typeof filters.salaryRange === "string" &&
      filters.salaryRange !== ""
    ) {
      const [min, max] = filters.salaryRange.split("-").map(Number);
      filtered = filtered.filter((job) => {
        const salary = job.job_data.salary || 0;
        return salary >= min && salary <= max;
      });
    }

    // Apply experience filter
    if (
      filters.experience &&
      typeof filters.experience === "string" &&
      filters.experience !== ""
    ) {
      const [minExp, maxExp] = filters.experience
        .split("year-")
        .map((val) => Number.parseInt(val));
      filtered = filtered.filter((job) => {
        const experience = job.job_data.experience || 0;
        return experience >= minExp && experience <= maxExp;
      });
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [searchPhrase, jobs, filters]);

  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/published-jobs/"
        );
        const jobsWithType = response.data.jobs.map((job) => ({
          ...job,
          type: "job",
          status: job.status,
          updated_at: job.updated_at,
        }));
        setJobs(jobsWithType);
        setFilteredJobs(jobsWithType);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching published jobs:", err);
        setError("Failed to load jobs.");
      }
    };
    fetchPublishedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      const response = await axios.get(
        `http://localhost:8000/api/saved-jobs/${userId}/`
      );
      setSavedJobs(response.data.jobs.map((job) => job._id));
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  };

  useEffect(() => {
    console.log(userRole);
    if (userRole !== "admin" && userRole !== "superadmin") {
      fetchSavedJobs();
    }
  }, [isSavedJobsOpen, userRole]);

  const clearFilters = () => {
    const defaultFilters = {
      salaryRange: { min: 10000, max: 1000000 },
      experience: { value: 0, category: "under" },
      employmentType: { onSite: false, remote: false, hybrid: false },
      workingMode: { online: false, offline: false, hybrid: false },
      sortBy: "Relevance",
    };
    setFilters(defaultFilters);
    localStorage.setItem("jobFilters", JSON.stringify(defaultFilters));
  };

  const borderColor = "border-gray-300";

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(updatedFilters);

    // Save filters to localStorage
    localStorage.setItem("jobFilters", JSON.stringify(updatedFilters));
  };

  const handleJobSelection = (job) => {
    // Save current page to localStorage before navigating
    localStorage.setItem("jobCurrentPage", currentPage.toString());
    setSelectedJob(job);
    // Navigate to job details page
    navigate(`/job-preview/${job._id}`, { state: { savedJobs } });
  };

  useEffect(() => {
    const savedPage = localStorage.getItem("jobCurrentPage");
    if (savedPage) {
      setCurrentPage(Number.parseInt(savedPage, 10));
    }
  }, []);

  return (
    <div className="sm:flex">
      {/* Navbar */}
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1">
        {userRole === "student" && <StudentPageNavbar />}

        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex flex-col items-center justify-center py-8 px-4 sm:py-14 container mx-auto text-center">
            <p className="text-3xl sm:text-6xl tracking-[0.8px]">Jobs</p>
            <p className="text-base sm:text-lg mt-2">
              Explore all the job opportunities in all the existing fields{" "}
              <br />
              around the globe.
            </p>
          </header>

          {/* Search Bar */}
          <div className="top-0 z-10 bg-white px-4 sm:px-10 mb-5">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex items-center w-full">
                <FiSearch className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 h-10 rounded-md w-full border border-gray-300 focus:outline-none"
                  value={searchPhrase}
                  onChange={(e) => setSearchPhrase(e.target.value.toLowerCase())}
                />
              </div>

              <div>
                <select
                  className="h-10 bg-white border border-gray-300 rounded-md px-4 hover:bg-gray-100 w-70"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="Relevance">Sort by relevance</option>
                  <option value="Newest">Newest (Last 24 hours)</option>
                  <option value="Oldest">Oldest (More than 24 hours)</option>
                </select>
              </div>

              <button
                className="sm:hidden h-10 border border-gray-300 rounded-md px-4 flex items-center gap-2"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              >
                Filters {isMobileFiltersOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col sm:flex-row px-4 sm:px-10 space-y-5 sm:space-y-0 sm:space-x-5">
            {/* Job Cards */}
            <div className="flex-1 flex flex-col space-y-3">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {error ? (
                  <p className="text-red-600">{error}</p>
                ) : jobs.length === 0 ? (
                  <div className="alert alert-danger w-full col-span-full text-center flex flex-col items-center">
                    <img src={NoListingImage} alt="No Listings" className="mb-4" />
                  </div>
                ) : currentJobs.length === 0 ? (
                  <div className="alert alert-danger w-full col-span-full text-center flex flex-col items-center">
                    <img src={NoListingImage} alt="No Listings" className="mb-4" />
                  </div>
                ) : (
                  currentJobs.map((job) => (
                    <ApplicationCard
                      application={{ ...job, ...job.job_data }}
                      key={job._id}
                      handleCardClick={() => handleJobSelection(job)}
                      isSaved={
                        userRole === "superadmin" || userRole === "admin"
                          ? undefined
                          : savedJobs.includes(job._id)
                      }
                      savedJobs={savedJobs}
                      isSavedJobsOpen={isSavedJobsOpen}
                      setSavedJobs={setSavedJobs}
                      setIsSavedJobsOpen={setIsSavedJobsOpen}
                    />
                  ))
                )}
              </div>

              {/* Maintain Pagination but hide when "!! No Jobs Found !!" is displayed */}
              {jobs.length > 0 && currentJobs.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredJobs.length}
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
    </div>
  );
}
