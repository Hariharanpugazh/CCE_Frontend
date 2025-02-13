import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Cookies from "js-cookie";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const JobPreview = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/job/${id}/`)
      .then(response => response.json())
      .then(data => setJob(data.job))
      .catch(error => console.error("Error fetching job:", error));
  }, [id]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role) {
          setUserRole(payload.role);
        } else if (payload.student_user) {
          setUserRole("student");
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
      }
    }
  }, []);

  const handleApplyClick = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post('http://localhost:8000/api/apply-job/', {
        studentId: userId,
        jobId: id
      });
      // alert("Job application recorded successfully!");
      window.open(job.job_data.company_website, "_blank", "noopener noreferrer");
    } catch (error) {
      console.error("Error applying for job:", error);
      // alert("Unable to apply for the job. Please try again later.");
    }
  };

  if (!job) return <p className="text-center text-lg font-semibold">Loading...</p>;


  return (
    <div>
      {/* Render navbar dynamically based on user role */}
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {userRole === "student" && <StudentPageNavbar />}
      <div className="w-4/5 mx-auto bg-white shadow-lg rounded-lg p-8 my-10 border border-gray-200">
        {/* Job Title & Company */}
        <div className="border-b pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{job.job_data.title}</h2>
          <p className="text-lg text-gray-700 mt-2">{job.job_data.company_name}</p>
          <a
            href={job.job_data.company_website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Visit Company Website
          </a>
        </div>

        {/* Job Overview */}
        <div className="border-b pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Job Overview</h3>
          <p className="text-gray-700"><strong>Location:</strong> {job.job_data.job_location}</p>
          <p className="text-gray-700"><strong>Work Type:</strong> {job.job_data.work_type}</p>
          <p className="text-gray-700"><strong>Schedule:</strong> {job.job_data.work_schedule}</p>
          <p className="text-gray-700"><strong>Salary:</strong> {job.job_data.salary_range}</p>
          <p className="text-gray-700"><strong>Experience Level:</strong> {job.job_data.experience_level}</p>
        </div>

        {/* Job Description */}
        <div className="border-b pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h3>
          <p className="text-gray-700">{job.job_data.job_description}</p>
        </div>

        {/* Key Responsibilities */}
        <div className="border-b pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Key Responsibilities</h3>
          <p className="text-gray-700">{job.job_data.key_responsibilities}</p>
        </div>

        {/* Skills & Education */}
        <div className="border-b pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Required Skills & Qualifications</h3>
          <div className="text-gray-700 mb-2">
            <strong>Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.job_data.required_skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700"><strong>Education:</strong> {job.job_data.education_requirements}</p>
        </div>

        {/* Benefits */}
        <div className="border-b pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Benefits</h3>
          <p className="text-gray-700">{job.job_data.benefits}</p>
        </div>

        {/* Application Details */}
        <div className="border-b pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Application Process</h3>
          <p className="text-gray-700"><strong>Deadline:</strong> {job.job_data.application_deadline}</p>
          <p className="text-gray-700"><strong>Instructions:</strong> {job.job_data.application_instructions}</p>
        </div>

        {/* Contact Info */}
        <div className="border-b pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Information</h3>
          <p className="text-gray-700"><strong>Email:</strong> {job.job_data.contact_email}</p>
          <p className="text-gray-700"><strong>Phone:</strong> {job.job_data.contact_phone}</p>
        </div>

        {/* Apply Button */}
        
          <button
          onClick={handleApplyClick}
            
            className="text-center mt-8 bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md cursor-pointer"
          >
              Apply Now
          </button>
        

      </div>


    </div>

  );
};

export default JobPreview;
