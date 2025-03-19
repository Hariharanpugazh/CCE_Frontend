import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Cookies from "js-cookie";
import { FiSearch } from "react-icons/fi";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedInterns, setSavedInterns] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filter, setFilter] = useState("Still Open");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [currentSelected, setCurrentSelected] = useState("jobs");

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(
          `http://localhost:8000/api/saved-jobs/${userId}/`
        );

        // Access the jobs array within the response data
        const jobs = response.data.jobs;

        // Log the jobs to inspect their structure
        console.log("Saved Jobs:", jobs);

        if (Array.isArray(jobs)) {
          const jobsWithType = jobs.map((job) => ({
            ...job,
            type: "job", // Add type field
          }));
          setSavedJobs(jobsWithType);
          setFilteredJobs(jobsWithType);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
        setError("Unable to load job applications. Please try again later.");
      }
    };

    const fetchSavedInterns = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(
          `http://localhost:8000/api/saved-internships/${userId}/`
        );

        // Access the jobs array within the response data
        const interns = response.data.internships;

        // Log the jobs to inspect their structure
        console.log("Saved Jobs:", interns);

        if (Array.isArray(interns)) {
          const internsWithType = interns.map((job) => ({
            ...job,
            type: "internship", // Add type field
          }));
          setSavedInterns(internsWithType);
          setFilteredInterns(internsWithType);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (err) {
        console.error("Error fetching saved interns:", err);
        setError("Unable to load intern applications. Please try again later.");
      }
    };

    fetchSavedJobs();
    fetchSavedInterns();
  }, []);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(!payload.student_user ? payload.role : "student");
    }
  }, []);

  useEffect(() => {
    function dateDiff(deadline) {
      const deadDate = new Date(deadline);
      const today = Date.now();
      return Math.floor((deadDate.getTime() - today) / (1000 * 3600 * 24));
    }

    if (filter === "Still Open") {
      setFilteredJobs(
        savedJobs.filter(
          (job) => dateDiff(job.job_data.application_deadline) >= 0
        )
      );
    } else if (filter === "Closed") {
      setFilteredJobs(
        savedJobs.filter(
          (job) => dateDiff(job.job_data.application_deadline) < 0
        )
      );
    }
  }, [filter, savedJobs]);

  useEffect(() => {
    if (searchPhrase === "") {
      setFilteredJobs(savedJobs)
      setFilteredInterns(savedInterns)
    } else {
      setFilter("")
      setFilteredJobs(savedJobs.filter((job) => job.job_data.title.toLowerCase().includes(searchPhrase)
        ||
        job.job_data.company_name.toLowerCase().includes(searchPhrase)
        ||
        job.job_data.job_description.toLowerCase().includes(searchPhrase)
        ||
        job.job_data.required_skills.filter((skill) => skill.toLowerCase().includes(searchPhrase)).length > 0
        ||
        job.job_data.work_type.toLowerCase().includes(searchPhrase)
      ))

      setFilteredInterns(
        savedInterns.filter(
          (intern) =>
            intern.internship_data.title.toLowerCase().includes(searchPhrase) ||
            intern.internship_data.company_name.toLowerCase().includes(searchPhrase) ||
            intern.internship_data.job_description.toLowerCase().includes(searchPhrase) ||
            intern.internship_data.required_skills.includes(searchPhrase) ||
            intern.internship_data.internship_type.toLowerCase().includes(searchPhrase)
        )
      );
    }
  }, [searchPhrase])

  useEffect(() => {
    function dateDiff(deadline) {
      const deadDate = new Date(deadline);
      const today = Date.now();
      return Math.floor((deadDate.getTime() - today) / (1000 * 3600 * 24));
    }

    if (filter === "Still Open") {
      setFilteredJobs(
        savedJobs.filter(
          (job) => dateDiff(job.job_data.application_deadline) >= 0
        )
      );

      setFilteredInterns(
        savedInterns.filter(
          (intern) => dateDiff(intern.internship_data.application_deadline) >= 0
        )
      );

    } else if (filter === "Closed") {
      setFilteredJobs(
        savedJobs.filter(
          (job) => dateDiff(job.job_data.application_deadline) < 0
        )
      );

      setFilteredInterns(
        savedInterns.filter(
          (intern) => dateDiff(intern.internship_data.application_deadline) < 0
        )
      );
    }
  }, [filter, savedJobs, currentSelected]);

  const handleStatusFilterChange = (status) => {
    setFilter(status);
  };
  console.log("Saved Jobs ID:", savedJobs.map(j => j._id));

  return (
    <div className="flex flex-col">
      {userRole === "student" && <StudentPageNavbar />}
      <header className="flex flex-col items-center justify-center py-14 container self-center">
        <div className="flex items-center space-x-12">
          <FaCaretLeft className={`cursor-pointer text-3xl ${currentSelected === "jobs" && "hidden"}`} onClick={() => setCurrentSelected("jobs")} />

          <div className="flex flex-col items-center">
            <p className="text-6xl tracking-[0.8px]">
              Saved {currentSelected === "jobs" ? "Jobs" : "Internships"}
            </p>
            <p className="text-lg mt-2 text-center">
              Explore all the {currentSelected === "jobs" ? "jobs" : "internships"} opportunities
              you have saved
            </p>
          </div>

          <FaCaretRight className={`cursor-pointer text-3xl ${currentSelected === "internships" && "hidden"}`} onClick={() => setCurrentSelected("internships")} />
        </div>

        <div className="relative flex items-stretch w-[70%]">
          <input type="text" value={searchPhrase} onChange={(e) => setSearchPhrase(e.target.value)} placeholder={`Search saved ${currentSelected}`} className="w-full text-lg my-5 p-2 px-5 rounded-full bg-gray-100 border-transparent border-2 hover:bg-white hover:border-blue-200 outline-blue-400" />
          <div className="absolute right-2 h-full flex items-center">
            <FiSearch className="bi bi-search bg-blue-400 rounded-full text-white" style={{ color: "white", width: "35", height: "35", padding: "8px" }} />
          </div>
        </div>
      </header>

      {/* Status-based filters */}
      <div className="flex text-sm gap-4 w-[80%] self-center mb-2 px-1">
        {["Still Open", "Closed"].map((status) => (
          <button
            key={status}
            className={`rounded-[10000px] p-1 ${filter === status
              ? "text-blue-400 underline"
              : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={() => handleStatusFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Job cards */}
      {currentSelected === "jobs" && <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : savedJobs.length === 0 ? (
          <p className="text-gray-600">You haven&apos;t saved any jobs yet.</p>
        ) : filteredJobs.length === 0 ? (
          <p className="alert alert-danger w-full col-span-full text-center">
            !! No Jobs Found !!
          </p>
        ) : (
          filteredJobs.map((job) => (
            <ApplicationCard
              application={{ ...job, ...job.job_data }}
              key={job._id}
              savedJobs={savedJobs.map(j => j._id)} // Pass saved job IDs as a prop

            />
          ))
        )}
      </div>}

      {currentSelected === "internships" && <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : savedInterns.length === 0 ? (
          <p className="text-gray-600">You haven&apos;t saved any jobs yet.</p>
        ) : filteredInterns.length === 0 ? (
          <p className="alert alert-danger w-full col-span-full text-center">
            !! No Internships Found !!
          </p>
        ) : (
          filteredInterns.map((intern) => (
            <ApplicationCard
              application={{ ...intern, ...intern.internship_data }}
              key={intern.id}
              savedJobs={savedInterns.map(i => i.id)} // Pass saved job IDs as a prop

            />
          ))
        )}
      </div>}
    </div>
  );
}
