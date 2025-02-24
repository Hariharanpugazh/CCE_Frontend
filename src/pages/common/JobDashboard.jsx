import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import ApplicationCard from "../../components/Students/ApplicationCard";
import { AppPages } from "../../utils/constants";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { FaCaretDown, FaCaretUp, FaCircle, FaWindowClose } from "react-icons/fa";
import { FiBookmark, FiCircle, FiSearch, FiX } from "react-icons/fi";

// icon imports
import { useNavigate } from "react-router-dom";
import Filters from "../../components/Common/Filters";
import SidePreview from "../../components/Common/SidePreview";
import Pagination from "../../components/Admin/pagination"; // Import Pagination component

export default function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [selectedJob, setSelectedJob] = useState();

  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isEmployTypeOpen, setIsEmployTypeOpen] = useState(false);
  const [isWorkModeOpen, setIsWorkModeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [savedJobs, setSavedJobs] = useState([]);

  const [salaryRangeIndex, setSalaryRangeIndex] = useState(0);

  const [filters, setFilters] = useState({
    salaryRange: { min: 10000, max: 1000000 },
    experience: { value: 0, category: "under" },
    employmentType: {
      onSite: false,
      remote: false,
      hybrid: false,
    },
    workingMode: {
      online: false,
      offline: false,
      hybrid: false,
    },
    sortBy: "Relevance",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Set filteredJobs to all jobs without any filtering
    setFilteredJobs(jobs);
  }, [jobs]);


  useEffect(() => {
    if (searchPhrase === "") {
      clearFilters();
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job.job_data.title.toLowerCase().includes(searchPhrase) ||
            job.job_data.company_name.toLowerCase().includes(searchPhrase) ||
            job.job_data.job_description.toLowerCase().includes(searchPhrase) ||
            job.job_data.required_skills.some((skill) => skill.toLowerCase().includes(searchPhrase)) ||
            job.job_data.work_type.toLowerCase().includes(searchPhrase)
        )
      );
    }
    
    setCurrentPage(1);
  }, [searchPhrase, jobs]);
  

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Fetch published jobs from the backend
  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        const response = await axios.get("https://cce-backend-54k0.onrender.com/api/published-jobs/");
        const jobsWithType = response.data.jobs.map((job) => ({
          ...job,
          type: "job",
          status: job.status, // Add status field
          updated_at: job.updated_at, // // Add type field
        }));
        setJobs(jobsWithType); // Set jobs with type
        setFilteredJobs(jobsWithType); // Update filtered jobs
      } catch (err) {
        console.error("Error fetching published jobs:", err);
        setError("Failed to load jobs.");
      }
    };

    fetchPublishedJobs();
  }, []);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      console.log("Decoded JWT Payload:", payload); // Debugging line
      setUserRole(!payload.student_user ? payload.role : "student"); // Assuming the payload has a 'role' field
    }
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      const response = await axios.get(`https://cce-backend-54k0.onrender.com/api/saved-jobs/${userId}/`);
      setSavedJobs(response.data.jobs.map((job) => job._id));
      console.log(response.data.jobs.map((job) => job._id));
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const clearFilters = () => {
    setFilters({
      salaryRange: { min: 10000, max: 1000000 },
      experience: { value: 0, category: "under" },
      employmentType: {
        onSite: false,
        remote: false,
        hybrid: false,
      },
      workingMode: {
        online: false,
        offline: false,
        hybrid: false,
      },
      sortBy: "Relevance",
    });
  };

  const filterArgs = {
    searchPhrase,
    clearFilters,
    isSalaryOpen,
    setIsSalaryOpen,
    salaryRangeIndex,
    setSalaryRangeIndex,
    filters,
    setFilters,
    isExperienceOpen,
    setIsExperienceOpen,
    isEmployTypeOpen,
    setIsEmployTypeOpen,
    isWorkModeOpen,
    setIsWorkModeOpen,
    isSortOpen,
    setIsSortOpen,
  };

  const borderColor = "border-gray-300";

  // Corrected Pagination logic
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="flex">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1">
        {userRole === "student" && <StudentPageNavbar />}
        <header className="flex flex-col items-center justify-center py-14 container self-center">
          <p className="text-6xl tracking-[0.8px]">Jobs</p>
          <p className="text-lg mt-2 text-center">
            Explore all the job opportunities in all the existing fields <br />around the globe.
          </p>
        </header>

        {/* search */}
        <div className="sticky ml-10 top-0 z-10 bg-white flex border border-gray-300 mr-11 mb-5">
          <input
            type="text"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value.toLocaleLowerCase())}
            placeholder={`Search Jobs`}
            className={`w-full text-lg p-2 px-4 bg-white hover:border-gray-400 outline-none ${borderColor}`}
          />
          <div className="flex mr-5 justify-center items-center space-x-4">
            <select name="salaryRange" onChange={handleFilterChange} className="p-2 border-l border-gray-300">
              <option value="">Salary</option>
              <option value="10000-50000">10k-50k</option>
              <option value="50000-100000">50k-100k</option>
            </select>
            <select name="experience" onChange={handleFilterChange} className="p-2 border-l border-gray-300">
              <option value="">Experience</option>
              <option value="0year-2year">0-2 years</option>
              <option value="2year-5year">2-5 years</option>
            </select>
            <select name="employmentType" onChange={handleFilterChange} className="p-2 border-l border-gray-300">
              <option value="">Employment Type</option>
              <option value="Full-time">Full-Time</option>
              <option value="Part-time">Part-Time</option>
            </select>
          </div>
          <button className={`px-13 bg-yellow-400 rounded-tr rounded-br ${borderColor} border`}> Search </button>
        </div>

        <div className="flex px-10 space-x-5 items-start">
          {/* filters */}
          {/* <Filters args={filterArgs} /> */}

          {/* Job cards */}
          <div className="flex-1 flex flex-col space-y-3">
            {/* jobs */}
            <div className="w-full self-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {error ? (
                <p className="text-red-600">{error}</p>
              ) : jobs.length === 0 ? (
                <p className="text-gray-600">No jobs available at the moment.</p>
              ) : currentJobs.length === 0 ? (
                <p className="alert alert-danger w-full col-span-full text-center">!! No Jobs Found !!</p>
              ) : (
                currentJobs.map((job) => (
                  <ApplicationCard
                    application={{ ...job, ...job.job_data }}
                    key={job._id}
                    handleCardClick={() => {
                      setSelectedJob(job);
                    }}
                    isSaved={userRole === "superadmin" || userRole === "admin" ? undefined : savedJobs.includes(job._id)}
                  />
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredJobs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>

          {/* job preview */}
          <SidePreview
            selectedItem={selectedJob}
            handleViewItem={() => navigate(`/job-preview/${selectedJob._id}`)}
            setSelectedItem={setSelectedJob}
            isSaved={userRole === "superadmin" || userRole === "admin" ? undefined : savedJobs.includes(selectedJob?._id)}
            fetchSavedJobs={fetchSavedJobs}
          />
        </div>
      </div>
    </div>
  );
}
