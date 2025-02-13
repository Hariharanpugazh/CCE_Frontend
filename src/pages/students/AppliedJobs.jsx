import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import ApplicationCard from "../../components/Students/ApplicationCard";
import { AppPages } from "../../utils/constants";
import Cookies from "js-cookie";

export default function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(
          `http://localhost:8000/api/applied-jobs/${userId}/`
        );

        // Access the job details within the response data
        const jobDetails = response.data.jobs;

        // Filter jobs where confirmed is true
        const confirmedJobs = jobDetails.filter(job => job.confirmed);

        // Fetch additional job details if necessary
        const jobIds = confirmedJobs.map(job => job.job_id);
        const jobDetailsPromises = jobIds.map(jobId =>
          axios.get(`http://localhost:8000/api/job/${jobId}/`)
        );

        const jobResponses = await Promise.all(jobDetailsPromises);
        const jobsWithDetails = jobResponses.map(job => job.data.job);

        // Combine job details with confirmation status
        const jobsWithType = jobsWithDetails.map((job, index) => ({
          ...job,
          ...confirmedJobs[index], // Include the confirmed status
          type: "job", // Add type field
        }));

        // Log the jobs to inspect their structure
        console.log("Applied Jobs:", jobsWithType);

        if (Array.isArray(jobsWithType)) {
          setAppliedJobs(jobsWithType);
          setFilteredJobs(jobsWithType);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
        setError("Unable to load applied jobs. Please try again later.");
      }
    };

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
          setSavedJobs(jobs);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
        setError("Unable to load job applications. Please try again later.");
      }
    };

    fetchAppliedJobs();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(!payload.student_user ? payload.role : "student");
    }
  }, []);

  const handleStatusFilterChange = (status) => {
    setFilter(status);
  };

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
        {["All"].map((status) => (
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
        ) : appliedJobs.length === 0 ? (
          <p className="text-gray-600">You haven&apos;t applied for any jobs yet.</p>
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
