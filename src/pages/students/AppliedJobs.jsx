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
  const [searchPhrase, setSearchPhrase] = useState("");
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

  useEffect(() => {
    console.log("Filtering jobs with search phrase:", searchPhrase);
    const filtered = appliedJobs.filter(job => {
      const jobTitle = job.title || job.job_data?.title; // Check both job and job_data for title
      console.log("Checking job:", jobTitle);
      return jobTitle?.toLowerCase().includes(searchPhrase.toLowerCase());
    });
    console.log("Filtered Jobs:", filtered); // Log filtered jobs for debugging
    setFilteredJobs(filtered);
  }, [searchPhrase, appliedJobs]);

  return (
    <div className="flex flex-col">
      {userRole === "student" && <StudentPageNavbar />}

      <header className="flex flex-col items-center justify-center py-14 container self-center">
        <p className="text-6xl tracking-[0.8px]">Applied Jobs</p>
        <p className="text-lg mt-2 text-center">
          Explore all the job opportunities in all the existing fields <br />around the globe.
        </p>
      </header>

      {/* Search */}
      <div className="flex items-stretch w-[90%] self-center mb-4">
        <input
          type="text"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
          placeholder="Search Jobs"
          className="w-full text-lg p-2 px-4 rounded-tl rounded-bl bg-white border border-r-[0px] hover:border-gray-400 outline-none"
        />
        <button className="px-5 bg-yellow-400 rounded-tr rounded-br border">
          {" "}Search{" "}
        </button>
      </div>

      {/* Status-based filters */}
      <div className="flex text-sm gap-2 w-[90%] self-center mb-1 px-1">
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
      <div className="w-[90%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
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
