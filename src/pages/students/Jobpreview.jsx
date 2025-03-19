"use client";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Footer from "../../components/Common/Footer";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaClock,
  FaLaptop,
  FaTruckMoving,
  FaFileAlt,
  FaClipboardList,
  FaRegCalendarAlt,
  FaLightbulb,
  FaGlobe,
  FaCode,
  FaTrash,
  FaPlus,
  FaSmile,
  FaBookmark,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaCheck,
  FaListOl,
} from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { FaUserGraduate } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdWorkOutline } from "react-icons/md";
import { GrCertificate } from "react-icons/gr";
import { GrUserManager } from "react-icons/gr";
import { MdPunchClock } from "react-icons/md";
import { FaUserClock } from "react-icons/fa";
import { TbCalendarClock } from "react-icons/tb";
import { LuFileClock } from "react-icons/lu";
// Import a placeholder image directly
import placeholderImage from "../../assets/images/Null.png";
import ApplicationCard from "../../components/Students/ApplicationCard";
import GridLines from "../../assets/images/Grid Lines.png";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const JobPreview = () => {
  const location = useLocation();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [saved, setSaved] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  console.log(savedJobs);
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [publishedJobs, setPublishedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.student_user) {
          setUserId(payload.student_user);
        }
        if (payload.role) {
          setUserRole(payload.role);
        } else {
          setUserRole("student");
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/job/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setJob(data.job);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const fetchPublishedJobs = async () => {
      setLoadingJobs(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/published-jobs/"
        );
        const jobsData = Array.isArray(response.data)
          ? response.data
          : response.data.jobs || response.data.data || [];
        const currentJobId = id;
        const filteredJobs = jobsData.filter((job) => {
          const jobId = job._id || job.id;
          return jobId !== currentJobId;
        });
        setPublishedJobs(filteredJobs);
        setLoadingJobs(false);
      } catch (error) {
        console.error("Error fetching published jobs:", error);
        setLoadingJobs(false);
      }
    };
    fetchPublishedJobs();
  }, [id]);

  useEffect(() => {
    if (location.state?.savedJobs) {
        setSavedJobs(location.state.savedJobs);
    }
}, [location.state]);

  useEffect(() => {
    if (savedJobs.includes(id)) {
        setSaved(true);   // Job is saved
    } else {
        setSaved(false);  // Job is not saved
    }
  }, [id, savedJobs]);

  const handleApplyClick = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post("http://localhost:8000/api/apply-job/", {
        studentId: userId,
        jobId: id,
      });
      setShowApplySuccess(true);
      setTimeout(() => {
        setShowApplySuccess(false);
        window.open(job.job_data.job_link, "_blank", "noopener noreferrer");
      }, 2000);
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  const handleSaveJob = async () => {

    try {
        if (!userId) {
            console.error("User ID is not available");
            return;
        }

        // Check if the job is already saved
        const isJobSaved = savedJobs.includes(id);

        const endpoint = isJobSaved
            ? `http://localhost:8000/api/unsave-job/${id}/`
            : `http://localhost:8000/api/save-job/${id}/`;

        const response = await axios.post(endpoint, { userId });

        if (response.status === 200) {
            // Update savedJobs array in state
            const updatedJobs = isJobSaved
                ? savedJobs.filter((jobId) => jobId !== id) // Remove if unsaved
                : [...savedJobs, id];                       // Add if saved
            
            setSavedJobs(updatedJobs); // Update state
            setSaved(!isJobSaved);     // Toggle saved state
            setShowSaveSuccess(true);  // Show success message

            setTimeout(() => {
                setShowSaveSuccess(false);
            }, 2000);
        }
    } catch (error) {
        console.error("Error saving/unsaving job:", error);
        if (error.response) {
            console.error("Server response:", error.response.data);
        }
    }
};


  const handleCardClick = (jobId) => {
    window.location.href = `/job-preview/${jobId}`;
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      fetch(`http://127.0.0.1:8000/api/job-delete/${id}/`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Redirect based on the user role
            if (userRole === "admin") {
              navigate("/jobs");
            } else if (userRole === "superadmin") {
              navigate("/jobs");
            }
          } else {
            console.error("Error deleting job:", response.statusText);
          }
        })
        .catch((error) => console.error("Error deleting job:", error));
    }
  };

  const handleEditJob = () => {
    navigate("/jobpost", { state: { job, id } }); // Navigate to job post page with job details
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {userRole === "admin" && <AdminPageNavbar />}
        {userRole === "superadmin" && <SuperAdminPageNavbar />}
        {userRole === "student" && <StudentPageNavbar />}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {userRole === "admin" && <AdminPageNavbar />}
        {userRole === "superadmin" && <SuperAdminPageNavbar />}
        {userRole === "student" && <StudentPageNavbar />}
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <FaInfoCircle className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Job Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The job you're looking for could not be found or may have been
              removed.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {userRole === "student" && <StudentPageNavbar />}

      {showApplySuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Application submitted successfully! Redirecting...
        </div>
      )}

      {showSaveSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Job saved successfully!
        </div>
      )}

      <div
        className={`flex-grow p-4 sm:p-6 max-w-8xl mx-auto w-full ${
          userRole === "admin" || userRole === "superadmin"
            ? "lg:ml-70 lg:max-w-6xl"
            : ""
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          <div
            className={`space-y-6 w-full ${
              userRole === "student" ? "lg:w-[70%]" : "lg:w-full"
            }`}
          >
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 border border-gray-100">
              <div className="flex flex-col">
                <div
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255, 230, 141, 0.28), rgba(255, 204, 0, 0.25))",
                  }}
                  className="p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 flex items-center justify-center"
                >
                  <img
                    src={
                      job.job_data.image
                        ? `data:image/jpeg;base64,${job.job_data.image}`
                        : placeholderImage
                    }
                    alt={`${job.job_data.company_name} logo`}
                    className="max-w-full max-h-80 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                  />
                </div>
                <div className="p-6 relative">
                  <img
                    src={GridLines}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ height: "210%" }}
                  />
                  <div className="relative z-10 flex justify-between items-start">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 capitalize">
                      {job.job_data.title}
                    </h1>
                  </div>
                  {/* <p className="relative z-10 text-lg sm:text-xl text-gray-600 mb-4 flex items-center">
                    <FaBuilding className="mr-2 text-gray-500" />
                    {job.job_data.company_name}
                  </p> */}
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="font-bold text-gray-800 mr-5">
                        {/* <FaMapMarkerAlt className="text-gray-600" /> */}
                        Company Name :
                      </div>
                      <span className="text-gray-700 capitalize">
                        {job.job_data.job_location}
                      </span>
                    </div>
                    {/* <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <FaBriefcase className="text-gray-600" />
                      </div>
                      <span className="text-gray-700">
                        {job.job_data.work_type}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <FaGraduationCap className="text-gray-600" />
                      </div>
                      <span className="text-gray-700">
                        {job.job_data.education_requirements}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <FaUserTie className="text-gray-600" />
                      </div>
                      <span className="text-gray-700">
                        {job.job_data.experience_level}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <FaMoneyBillWave className="text-gray-600" />
                      </div>
                      <span className="text-gray-700">
                        ₹ {job.job_data.salary_range} per annum
                      </span>
                    </div> */}
                    <div className="flex items-center">
                      <div className="font-bold text-gray-800 mr-3">
                        {/* <FaCalendarAlt className="text-gray-600" /> */}
                        Application Deadline :
                      </div>
                      <span className="text-gray-700">
                        {formatDate(job.job_data.application_deadline)}
                      </span>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center flex-wrap gap-4">
                    <button
                      onClick={
                        userRole === "student" ? handleApplyClick : undefined
                      }
                      className={`bg-yellow-500 ${
                        userRole === "student"
                          ? "hover:bg-yellow-600"
                          : "opacity-60 cursor-not-allowed"
                      } 
                                text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out 
                                flex items-center shadow-md ${
                                  userRole === "student" && "hover:shadow-lg"
                                }`}
                      title={
                        userRole !== "student"
                          ? "Only students can apply for jobs"
                          : ""
                      }
                    >
                      Apply Now <FaExternalLinkAlt className="ml-2 text-sm" />
                    </button>
                    <button
                        onClick={userRole === "student" ? handleSaveJob : undefined}
                        className={`${
                            saved
                                ? "bg-gray-100 text-gray-800"
                                : "border-2 border-gray-300 text-gray-700"
                        } 
                        font-semibold py-3 px-8 rounded-lg 
                        ${userRole === "student" ? "hover:bg-gray-100" : "opacity-60 cursor-not-allowed"}
                        transition duration-300 ease-in-out flex items-center justify-center`}
                        title={userRole !== "student" ? "Only students can save jobs" : ""}
                    >
                        {saved ? (
                            <>
                                Saved <FaBookmark className="ml-2 text-yellow-500" />
                            </>
                        ) : (
                            <>
                                Save Job <FaBookmark className="ml-2" />
                            </>
                        )}
                    </button>

                    {(userRole === "admin" || userRole === "superadmin") && (
                      <button
                        onClick={handleEditJob}
                        className="text-gray-800 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out flex items-center"
                      >
                        <RiEdit2Fill className="mr-2" />
                        Edit job
                      </button>
                    )}
                    {userRole === "admin" || userRole === "superadmin" ? (
                      <button
                        onClick={handleDelete}
                        className="text-gray-800 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out flex items-center"
                      >
                        Delete
                        <FaTrash className="ml-2" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaBriefcase className="text-yellow-600" />
                  </div>
                  Job Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify ">
                  {job.job_data.job_description}
                </p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaClipboardList className="text-yellow-600" />
                  </div>
                  Key Responsibilities
                </h2>
                <ul className="space-y-3 text-gray-700 text-justify">
                  {job.job_data.key_responsibilities.map(
                    (responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-yellow-100 text-yellow-800 w-6 h-6 rounded-full mr-3 flex-shrink-0 text-sm text-justify">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">
                          {responsibility}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaCode className="text-yellow-600" />
                  </div>
                  Technical Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.job_data.technical_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-yellow-50 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaPlus className="text-yellow-600" />
                  </div>
                  Additional Skills
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                  {job.job_data.additional_skills.map((skill, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaSmile className="text-yellow-600" />
                  </div>
                  Soft Skills
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                  {job.job_data.soft_skills.map((skill, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaGraduationCap className="text-yellow-600" />
                  </div>
                  Education and Experience
                </h2>
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className=" flex  items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaUserGraduate className="inline-block mr-1 text-gray-500" />
                      Education:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {job.job_data.education_requirements}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className=" flex  items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <IoIosCheckmarkCircleOutline className="inline-block mr-1 text-gray-500" />
                      Minimum Marks:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {job.job_data.minimum_marks_requirement}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="flex  items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <MdWorkOutline className="inline-block mr-1 text-gray-500" />
                      Experience:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {job.job_data.work_experience_requirement}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="flex  items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <GrUserManager className="inline-block mr-1 text-gray-500" />
                      Age Limit:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {job.job_data.age_limit}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2">
                    <div className=" flex  items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <GrCertificate className="inline-block mr-1 text-gray-500" />
                      Certifications:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {job.job_data.professional_certifications}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaBriefcase className="text-yellow-600" />
                  </div>
                  Job Details
                </h2>
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="flex  items-center  font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <PiBuildingOfficeBold className=" inline-block mr-1 text-gray-500" />
                      Industry:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {job.job_data.industry_type}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="flex  items-center  font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaClock className="inline-block mr-1 text-gray-500" />
                      Work Hours:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {job.job_data.work_schedule} hours
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="flex  items-center  font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaLaptop className="inline-block mr-1 text-gray-500" />
                      Remote Work:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded text-justify">
                      {job.job_data.remote_work_availability}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2">
                    <div className="flex  items-center  font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaTruckMoving className="inline-block mr-1 text-gray-500" />
                      Relocation:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded text-justify">
                      {job.job_data.relocation_assistance}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaClipboardList className="text-yellow-600" />
                  </div>
                  Selection Process
                </h2>
                <div className="mt-4 space-y-4">
                  {job.job_data.selection_process
                    .split("\n")
                    .filter((step) => step.trim())
                    .map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center border border-yellow-200 mr-3 mt-0.5">
                          <span className="text-yellow-700 font-medium text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{step}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <FaFileAlt className="text-yellow-600 text-xl" />
                  </div>
                  Application Process
                </h2>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-white p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                      <FaListOl className="mr-2 text-yellow-600" />
                      Steps to Apply
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      {job.job_data.steps_to_apply
                        .split("\n")
                        .map((step, index) => (
                          <li key={index} className="pl-2">
                            {step.trim()}
                          </li>
                        ))}
                    </ol>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-white p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                      <FaFileAlt className="mr-2 text-blue-600" />
                      Documents Required
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {job.job_data.documents_required
                        .split(",")
                        .map((doc, index) => (
                          <li key={index} className="pl-2">
                            {doc.trim()}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaRegCalendarAlt className="text-yellow-600" />
                  </div>
                  Important Dates
                </h2>
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className=" flex items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <MdPunchClock className="inline-block mr-1 text-gray-500" />
                      Posted On:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {formatDate(job.job_data.job_posting_date)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="flex items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <LuFileClock className="inline-block mr-1 text-gray-500" />
                      Apply By:
                    </div>
                    <div className="text-red-600 font-medium w-full sm:w-2/3  p-2 rounded bg-gray-50  border border-gray-100">
                      {formatDate(job.job_data.application_deadline)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="flex items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <TbCalendarClock className="inline-block mr-1 text-gray-500" />
                      Interviews:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {formatDate(job.job_data.interview_start_date)} to{" "}
                      {formatDate(job.job_data.interview_end_date)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2">
                    <div className=" flex items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaUserClock className="inline-block mr-1 text-gray-500" />
                      Joining Date:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {formatDate(job.job_data.expected_joining_date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaLightbulb className="text-yellow-600" />
                  </div>
                  Preparation Tips
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-justify">
                  {job.job_data.preparation_tips}
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaBuilding className="text-yellow-600" />
                  </div>
                  Company Information
                </h2>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="flex items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <PiBuildingOfficeBold className="inline-block mr-1 text-gray-500" />
                      Company:
                    </div>
                    <div className="text-gray-700 font-medium w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {job.job_data.company_name}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2">
                    <div className="flex items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaGlobe className="inline-block mr-1 text-gray-500" />
                      Website:
                    </div>
                    <div className="w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      <a
                        href={job.job_data.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        {job.job_data.company_website}
                        <FaExternalLinkAlt className="ml-2 text-xs" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaFileAlt className="text-yellow-600" />
                  </div>
                  Ready to Apply?
                </h2>
                <p className="text-gray-600 mb-4">
                  Don't miss this opportunity! Apply before the deadline.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="relative flex-1">
                    <button
                      onClick={
                        userRole === "student" ? handleApplyClick : undefined
                      }
                      className={`w-full bg-yellow-500 ${
                        userRole === "student"
                          ? "hover:bg-yellow-600"
                          : "opacity-60 cursor-not-allowed"
                      } text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center shadow-md ${
                        userRole === "student" && "hover:shadow-lg"
                      }`}
                      title={
                        userRole !== "student"
                          ? "Only students can apply for Jobs"
                          : ""
                      }
                    >
                      Apply Now <FaExternalLinkAlt className="ml-2 text-sm" />
                    </button>
                  </div>
                  <div className="relative flex-1">
                    <button
                      onClick={
                        userRole === "student" ? handleSaveJob : undefined
                      }
                      className={`w-full ${
                        saved
                          ? "bg-gray-100 text-gray-800"
                          : "border-2 border-gray-300 text-gray-700"
                      } font-semibold py-3 px-6 rounded-lg ${
                        userRole === "student"
                          ? "hover:bg-gray-100"
                          : "opacity-60 cursor-not-allowed"
                      } transition duration-300 ease-in-out flex items-center justify-center`}
                      title={
                        userRole !== "student"
                          ? "Only students can save jobs"
                          : ""
                      }
                    >
                      {saved ? (
                        <>
                          Saved <FaBookmark className="ml-2 text-yellow-500" />
                        </>
                      ) : (
                        <>
                          Save Job <FaBookmark className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {userRole === "student" && (
            <div className="w-full lg:w-[35%] space-y-4">
              <div className="bg-transparent rounded-lg overflow-hidden border border-gray-100 lg:sticky lg:top-20">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-full mr-2">
                      <FaBriefcase className="text-yellow-600" />
                    </div>
                    You might also like
                  </h2>
                </div>
                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto lg:space-y-4">
                  {loadingJobs ? (
                    <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div
                          key={item}
                          className="bg-gray-100 h-32 w-full min-w-[90%] sm:min-w-[300px] lg:min-w-0 rounded-lg flex-shrink-0 lg:flex-shrink"
                        ></div>
                      ))}
                    </div>
                  ) : publishedJobs.length > 0 ? (
                    <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 snap-x snap-mandatory">
                      {publishedJobs.map((job) => {
                        const jobId = job._id || job.id;
                        const jobTitle =
                          job.title ||
                          job.job_data?.title ||
                          job.name ||
                          "Job Title";
                        const companyName =
                          job.company_name ||
                          job.job_data?.company_name ||
                          job.company ||
                          "Company";
                        const location =
                          job.job_location ||
                          job.job_data?.location ||
                          job.location ||
                          "Location";
                        const description =
                          job.job_description ||
                          job.job_data?.job_description ||
                          job.description ||
                          "";
                        const updatedAt =
                          job.updated_at ||
                          job.job_data?.job_posting_date ||
                          job.date ||
                          new Date().toISOString();
                        const status = job.status || "Active";
                        const views = job.total_views || job.views || 0;
                        return (
                          <div
                            key={jobId}
                            className="w-full min-w-[100%] sm:min-w-[300px] lg:min-w-0 flex-shrink-0 lg:flex-shrink snap-start"
                          >
                            <ApplicationCard
                              application={{
                                id: jobId,
                                title: jobTitle,
                                company_name: companyName,
                                location: location,
                                job_description: description,
                                updated_at: updatedAt,
                                status: status,
                                total_views: views,
                              }}
                              handleCardClick={() => handleCardClick(jobId)}
                              small={true}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No similar jobs found. Please check the API response.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {userRole === "student" && <Footer />}
    </div>
  );
};

export default JobPreview;
