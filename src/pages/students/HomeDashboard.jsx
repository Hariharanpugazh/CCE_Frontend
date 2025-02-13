import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import StudentPageSearchBar from "../../components/Students/StudentPageSearchBar";
import PageHeader from "../../components/Common/StudentPageHeader";
import Cookies from "js-cookie";

export default function HomeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [unconfirmedJob, setUnconfirmedJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, achievementsRes, internshipsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/published-jobs/"),
          axios.get("http://localhost:8000/api/published-achievement/"),
          axios.get("http://localhost:8000/api/published-internship/")
        ]);

        setJobs(jobsRes.data.jobs);
        setAchievements(achievementsRes.data.achievements);
        setInternships(internshipsRes.data.internships);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(`http://localhost:8000/api/applied-jobs/${userId}/`);
        const appliedJobs = response.data.jobs;

        const unconfirmed = appliedJobs.find(job => !job.confirmed);
        if (unconfirmed) {
          // Fetch job details using the job ID
          const jobResponse = await axios.get(`http://localhost:8000/api/job/${unconfirmed.job_id}/`);
          const jobDetails = jobResponse.data.job;
          setUnconfirmedJob({ ...unconfirmed, job_data: jobDetails.job_data });
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    checkApplicationStatus();
  }, []);

  const handleConfirm = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post('http://localhost:8000/api/confirm-job/', {
        studentId: userId,
        jobId: unconfirmedJob.job_id
      });
      setShowPopup(false);
    } catch (error) {
      console.error("Error confirming job application:", error);
      alert("Unable to track application. Please try again later.");
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col">
      <StudentPageNavbar />
      <PageHeader page="Home Dashboard" />

      <div className="w-[80%] self-center">
        <StudentPageSearchBar />
      </div>

      {/* Jobs Section */}
      <section className="w-[80%] self-center mt-6">
        <h2 className="text-2xl font-bold mb-4">Job Opportunities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? <p>No jobs available at the moment.</p> :
            jobs.map((job) => (
              <div key={job._id} className="p-4 border rounded-lg shadow-md bg-white">
                <h3 className="text-xl font-bold">{job.job_data.title}</h3>
                <p>{job.job_data.company_name}</p>
                <p>{job.job_data.job_location}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="w-[80%] self-center mt-6">
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.length === 0 ? <p>No achievements available at the moment.</p> :
            achievements.map((achievement) => (
              <div key={achievement._id} className="p-4 border rounded-lg shadow-md bg-white flex flex-col items-center">
                <img src={`data:image/jpeg;base64,${achievement.photo}`} alt="Achievement" className="w-full h-48 object-cover rounded-md" />
                <h3 className="text-xl font-bold mt-2">{achievement.name}</h3>
                <p>{achievement.department}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Internships Section */}
      <section className="w-[80%] self-center mt-6">
        <h2 className="text-2xl font-bold mb-4">Internship Opportunities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.length === 0 ? <p>No internships available at the moment.</p> :
            internships.map((internship) => (
              <div key={internship._id} className="p-4 border rounded-lg shadow-md bg-white">
                <h3 className="text-xl font-bold">{internship.title}</h3>
                <p>{internship.company_name}</p>
                <p>{internship.location}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Job Application</h2>
            <p className="mb-4">Did you complete your job application for "{unconfirmedJob?.job_data?.title}"?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
              >
                Yes, Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
