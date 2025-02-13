import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import ApplicationCard from "../../components/Students/ApplicationCard";
import { AppPages } from "../../utils/constants";
import Cookies from "js-cookie";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filter, setFilter] = useState("Still Open");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

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

    fetchSavedJobs();
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
  
  const handleStatusFilterChange = (status) => {
    setFilter(status);
  };
  console.log("Saved Jobs ID:", savedJobs.map(j => j._id));
  
  return (
    <div className="flex flex-col">
      {userRole === "student" && <StudentPageNavbar />}
      <PageHeader
        page={AppPages.jobDashboard}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Status-based filters */}
      <div className="flex text-sm gap-4 w-[80%] self-center mb-2 px-1">
        {["Still Open", "Closed"].map((status) => (
          <button
            key={status}
            className={`rounded-[10000px] p-1 ${
              filter === status
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
      <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
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
      </div>
    </div>
  );
}
