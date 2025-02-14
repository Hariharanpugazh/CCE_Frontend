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

export default function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([])
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [selectedJob, setSelectedJob] = useState()

  const [isSalaryOpen, setIsSalaryOpen] = useState(false)
  const [isExperienceOpen, setIsExperienceOpen] = useState(false)
  const [isEmployTypeOpen, setIsEmployTypeOpen] = useState(false)
  const [isWorkModeOpen, setIsWorkModeOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const [savedJobs, setSavedJobs] = useState([])

  const [salaryRangeIndex, setSalaryRangeIndex] = useState(0)

  const [filters, setFilters] = useState({
    salaryRange: { min: 10000, max: 1000000 },
    experience: { value: 0, category: "under" },
    employmentType: {
      onSite: false,
      remote: false,
      hybrid: false
    },
    workingMode: {
      online: false,
      offline: false,
      hybrid: false
    },
    sortBy: "Relevance",
  });

  useEffect(() => {
    let filtered = jobs;

    // Filter by salary range
    filtered = filtered.filter((job) => {
      const salary = parseInt(job.job_data.salary_range.replace(/,/g, ""), 10); // Convert "50,000" → 50000
      return salary >= filters.salaryRange.min && salary <= filters.salaryRange.max;
    });

    // Filter by experience level
    if (filters.experience.value !== 0) {
      filtered = filtered.filter((job) => {
        const jobExperience = parseInt(job.job_data.experience_level, 10);
        if (filters.experience.category === "under") {
          return jobExperience < filters.experience.value;
        } else {
          return jobExperience >= filters.experience.value;
        }
      });
    }

    // Filter by employment type
    const { onSite, remote, hybrid } = filters.employmentType;
    if (onSite || remote || hybrid) {
      filtered = filtered.filter((job) => {
        const workType = job.job_data.selectedWorkType.toLowerCase();
        return (
          (onSite && workType.includes("on-site")) ||
          (remote && workType.includes("remote")) ||
          (hybrid && workType.includes("hybrid"))
        );
      });
    }

    // Filter by working mode
    const { online, offline, } = filters.workingMode;
    if (online || offline) {
      filtered = filtered.filter((job) => {
        const workMode = job.job_data.work_type.toLowerCase();
        return (
          (online && workMode.includes("online")) ||
          (offline && workMode.includes("offline"))
        );
      });
    }

    // Sorting logic
    if (filters.sortBy === "Experience") {
      filtered.sort((a, b) => parseInt(a.job_data.experience_level, 10) - parseInt(b.job_data.experience_level, 10));
    } else if (filters.sortBy === "Salary") {
      filtered.sort((a, b) => parseInt(a.job_data.salary_range.replace(/,/g, ""), 10) - parseInt(b.job_data.salary_range.replace(/,/g, ""), 10));
    } else if (filters.sortBy === "Latest") {
      filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }

    setFilteredJobs(filtered);
  }, [filters]);

  useEffect(() => {
    if (searchPhrase === "") {
      clearFilters()
      setFilteredJobs(jobs)
    } else {
      setFilteredJobs(jobs.filter((job) => job.job_data.title.toLowerCase().includes(searchPhrase)
        ||
        job.job_data.company_name.toLowerCase().includes(searchPhrase)
        ||
        job.job_data.job_description.toLowerCase().includes(searchPhrase)
        ||
        job.job_data.required_skills.filter((skill) => skill.toLowerCase().includes(searchPhrase)).length > 0
        ||
        job.job_data.work_type.toLowerCase().includes(searchPhrase)
      ))
    }
  }, [searchPhrase, jobs]);

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Fetch published jobs from the backend
  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/published-jobs/");
        const jobsWithType = response.data.jobs.map((job) => ({
          ...job,
          type: "job",
          status: job.status, // Add status field
          updated_at: job.updated_at // // Add type field
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
      const response = await axios.get(`http://localhost:8000/api/saved-jobs/${userId}/`);
      setSavedJobs(response.data.jobs.map(job => job._id));
      console.log(response.data.jobs.map(job => job._id))
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
        hybrid: false
      },
      workingMode: {
        online: false,
        offline: false,
        hybrid: false
      },
      sortBy: "Relevance",
    })
  }

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
  }

  const borderColor = "border-gray-300"

  return (
    <div className="flex flex-col">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {userRole === "student" && <StudentPageNavbar />}
      <header className="flex flex-col items-center justify-center py-14 container self-center">
        <p className="text-6xl tracking-[0.8px]">
          Jobs
        </p>
        <p className="text-lg mt-2 text-center">
          Explore all the job opportunities
          in all the existing fields <br />around the globe.
        </p>
      </header>

      <div className="flex px-10 space-x-5 items-start">
        {/* filters */}
        <Filters args={filterArgs} />

        {/* Job cards */}
        <div className="flex-1 max-w-[80%] flex flex-col space-y-3">
          {/* search */}
          <div className="flex items-stretch">
            <input type="text" value={searchPhrase} onChange={(e) => setSearchPhrase(e.target.value.toLocaleLowerCase())} placeholder={`Search Jobs`} className={`w-full text-lg p-2 px-4 rounded-tl rounded-bl bg-white border border-r-[0px] hover:border-gray-400 outline-none ${borderColor}`} />
            <button className={`px-5 bg-yellow-400 rounded-tr rounded-br ${borderColor} border`}> Search </button>
          </div>

          {/* jobs */}
          <div className="w-full self-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            {error ?
              <p className="text-red-600">{error}</p>
              : jobs.length === 0 ?
                <p className="text-gray-600">No jobs available at the moment.</p>
                :
                filteredJobs.length === 0 ? <p className="alert alert-danger w-full col-span-full text-center">
                  !! No Jobs Found !!
                </p>
                  :
                  filteredJobs.map((job) => (
                    <ApplicationCard application={{ ...job, ...job.job_data }} key={job._id} handleCardClick={() => { setSelectedJob(job); }} isSaved={userRole === "superadmin" || userRole === "admin" ? undefined : savedJobs.includes(job._id)} />
                  ))
            }
          </div>
        </div>

        {/* job preview */}
        <SidePreview selectedItem={selectedJob}
          handleViewItem={() => navigate(`/job-preview/${selectedJob._id}`)}
          setSelectedItem={setSelectedJob}
          isSaved={userRole === "superadmin" || userRole === "admin" ? undefined : savedJobs.includes(selectedJob?._id)}
          fetchSavedJobs={fetchSavedJobs}
        />
      </div>
    </div>
  );
}
