import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import Footer from "../../components/Common/Footer";
import {
  FaBuilding,
  FaBriefcase,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
  FaLaptop,
  FaTrash,
  FaFileAlt,
  FaRegCalendarAlt,
  FaGlobe,
  FaCode,
  FaBookmark,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaCheck,
  FaListOl,
} from "react-icons/fa";
import { MdPunchClock } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { LuFileClock } from "react-icons/lu";
import { PiBuildingOfficeBold } from "react-icons/pi";
// Import a placeholder image directly
import placeholderImage from "../../assets/images/internship.png";
import ApplicationCard from "../../components/Students/ApplicationCard";
import GridLines from "../../assets/images/Grid Lines.png";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const InternshipPreview = () => {
  const location = useLocation();
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [saved, setSaved] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [publishedInternships, setPublishedInternships] = useState([]);
  const [loadingInternships, setLoadingInternships] = useState(true);
  const navigate = useNavigate();

  const handleEditClick = () => {
    sessionStorage.setItem("internshipData", JSON.stringify(internship.internship_data));
    sessionStorage.setItem("internshipId", id);
    // Store the return URL to come back to this preview page
    sessionStorage.setItem("returnToPreview", `/internship-preview/${id}`);
    navigate("/internpost");
  };

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

        if (payload.role === "admin") {
          setUserId(payload.admin_user);
        } else if (payload.role === "superadmin") {
          setUserId(payload.superadmin_user);
        } else if (payload.student_user) {
          setUserId(payload.student_user);
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/internship/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setInternship(data.internship);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching internship:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const fetchPublishedInternships = async () => {
      setLoadingInternships(true);
      try {
        const response = await axios.get(
          "https://cce-backend-54k0.onrender.com/api/published-internship/"
        );

        // Check if response.data is an array or if it has a specific property containing the internships
        const internshipsData = Array.isArray(response.data)
          ? response.data
          : response.data.internships || response.data.data || [];

        // Filter out the current internship from the list
        const currentInternshipId = id;
        const filteredInternships = internshipsData.filter((internship) => {
          const internshipId = internship._id || internship.id;
          return internshipId !== currentInternshipId;
        });

        setPublishedInternships(filteredInternships);
        setLoadingInternships(false);
      } catch (error) {
        console.error("Error fetching published internships:", error);
        setLoadingInternships(false);
      }
    };

    fetchPublishedInternships();
  }, [id]);

  useEffect(() => {
    // Get savedJobs from location.state (if available)
    if (location.state?.savedJobs) {
        setSavedJobs(location.state.savedJobs);
    }
}, [location.state]);

  useEffect(() => {
    if (savedJobs.includes(id)) {
        setSaved(true);  // Mark as saved if ID matches
    } else {
        setSaved(false); // Otherwise, mark as unsaved
    }
}, [id, savedJobs]);

  const handleApplyClick = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post("https://cce-backend-54k0.onrender.com/api/apply-internship/", {
        studentId: userId,
        internshipId: id,
      });
      setShowApplySuccess(true);
      setTimeout(() => {
        setShowApplySuccess(false);
        window.open(
          internship.internship_data.job_link,
          "_blank",
          "noopener noreferrer"
        );
      }, 2000);
    } catch (error) {
      console.error("Error applying for internship:", error);
    }
  };

  const handleSaveInternship = async () => {
    try {
        if (!userId) {
            console.error("User ID is not available");
            return;
        }

        const endpoint = saved
            ? `https://cce-backend-54k0.onrender.com/api/unsave-internship/${id}/`
            : `https://cce-backend-54k0.onrender.com/api/save-internship/${id}/`;

        const response = await axios.post(endpoint, { userId });

        const updatedJobs = saved
            ? savedJobs.filter((jobId) => jobId !== id) 
            : [...savedJobs, id];                     
        setSavedJobs(updatedJobs); 
        setSaved(!saved); 

        setShowSaveSuccess(true);
        setTimeout(() => {
            setShowSaveSuccess(false);
        }, 2000);
    } catch (error) {
        console.error("Error saving/unsaving internship:", error);
        if (error.response) {
            console.error("Server response:", error.response.data);
        }
    }
};

  const handleCardClick = (internshipId) => {
    window.location.href = `/internship-preview/${internshipId}`;
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      fetch(`http://127.0.0.1:8000/api/internship-delete/${id}/`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            // Redirect based on the user role
            if (userRole === "admin" || userRole === "superadmin") {
              navigate('/internships');
            }
          } else {
            console.error("Error deleting internship:", response.statusText);
          }
        })
        .catch(error => console.error("Error deleting internship:", error));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {userRole === "admin" && <AdminPageNavbar />}
        {userRole === "superadmin" && <SuperAdminPageNavbar />}
        {userRole === "student" && <StudentPageNavbar />}
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!internship) {
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
              Internship Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The internship you're looking for could not be found or may have
              been removed.
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

  const { internship_data } = internship;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Conditional navbar based on user role */}
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {userRole === "student" && <StudentPageNavbar />}

      {/* Success notifications */}
      {showApplySuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Application submitted successfully! Redirecting...
        </div>
      )}

      {showSaveSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Internship saved successfully!
        </div>
      )}

      <div
        className={`flex-grow p-4 sm:p-6 w-full ${userRole === "admin" || userRole === "superadmin"
            ? "lg:ml-70 lg:w-[calc(100%-280px)]"
            : "lg:w-full"
          }`}
      >
        

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Content - Internship Details */}
          <div
            className={`space-y-6 w-full ${
              userRole === "student" ? "lg:w-[70%]" : "lg:w-full"
            }`}
          >
            {/* Internship Overview Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 border border-gray-100">
          <div className="flex flex-col">
            {/* Left Column - Company Image */}
            <div
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255, 230, 141, 0.28), rgba(255, 204, 0, 0.25))",
              }}
              className="md: p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 flex items-center justify-center "
            >
              <img
                src={internship.internship_data.image ? `data:image/jpeg;base64,${internship.internship_data.image}` : placeholderImage}
                alt={`${internship_data.company_name} logo`}
                className="max-w-full h-80  rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImage;
                }}
              />
            </div>

            {/* Right Column - Internship Summary */}
            <div className="md: p-6 relative">
              <img
                src={GridLines || "/placeholder.svg"}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ height: "220%" }}
              />

              <div className="relative z-10 flex justify-between items-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {internship_data.title}
                </h1>
              </div>

              <p className="relative z-10 text-lg sm:text-xl text-gray-600 mb-4 flex items-center">
                {internship_data.job_description}
              </p>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <span className=" font-bold text-gray-700">
                   Company Name : </span>
                  <span className="ml-4 text-gray-700">
                    {internship_data.title}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-700">
                   Application Deadline : </span>
                <span className="ml-4 text-gray-700">
                    {internship_data.internship_type}
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap gap-4">
                <div className="relative flex-1">
                  <button
                    onClick={
                      userRole === "student" ? handleApplyClick : undefined
                    }
                    className={`w-full bg-yellow-500 ${
                      userRole === "student"
                        ? "hover:bg-yellow-600"
                        : "opacity-60 cursor-not-allowed"
                    } text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out flex items-center justify-center shadow-md ${
                      userRole === "student" && "hover:shadow-lg"
                    }`}
                    title={
                      userRole !== "student"
                        ? "Only students can apply for internships"
                        : ""
                    }
                  >
                    Apply Now <FaExternalLinkAlt className="ml-2 text-sm" />
                  </button>
                </div>
                <div className="relative flex-1">
                  <button
                    onClick={
                      userRole === "student" ? handleSaveInternship : undefined
                    }
                    className={`w-full ${
                      saved
                        ? "bg-gray-100 text-gray-800"
                        : "border-2 border-gray-300 text-gray-700"
                    } font-semibold py-3 px-8 rounded-lg ${
                      userRole === "student"
                        ? "hover:bg-gray-100"
                        : "opacity-60 cursor-not-allowed"
                    } transition duration-300 ease-in-out flex items-center justify-center`}
                    title={
                      userRole !== "student"
                        ? "Only students can save internships"
                        : ""
                    }
                  >
                    {saved ? (
                      <>
                        Saved <FaBookmark className="ml-2 text-yellow-500" />
                      </>
                    ) : (
                      <>
                        Save Internship <FaBookmark className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
                {(userRole === "admin" || userRole === "superadmin") && (
                  <div className="relative flex-1">
                    <button
                      onClick={handleEditClick}
                      className="text-gray-800 w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out flex items-center justify-center"
                    >
                      Edit Internship <RiEdit2Fill className="ml-2 text-lg" />
                    </button>
                  </div>
                )}
                {userRole === 'admin' || userRole === 'superadmin' ? (
                  <button onClick={handleDelete} className="text-gray-800 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out flex items-center">
                    Delete
                    <FaTrash className="ml-2" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
            {/* Internship Description Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaBriefcase className="text-yellow-600" />
                  </div>
                  Internship Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                  {internship_data.job_description}
                </p>
              </div>
            </div>

            {/* Required Skills Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaCode className="text-yellow-600" />
                  </div>
                  Technical Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(internship_data.required_skills) ? (
                    internship_data.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-yellow-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-100"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-600">No skills specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Education Requirements Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaGraduationCap className="text-yellow-600" />
                  </div>
                  Education Requirements
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {internship_data.education_requirements}
                </p>
              </div>
            </div>

            {/* Internship Details Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaBriefcase className="text-yellow-600" />
                  </div>
                  Internship Details
                </h2>
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className=" flex items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    <MdPunchClock className="inline-block mr-1 text-gray-500" />
                      Type:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {internship_data.internship_type}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaClock className="inline-block mr-1 text-gray-500" />
                      Duration:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {internship_data.duration}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaMoneyBillWave className="inline-block mr-1 text-gray-500" />
                      Stipend:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      ₹ {internship_data.stipend} per month
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2">
                    <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaLaptop className="inline-block mr-1 text-gray-500" />
                      Remote Work:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {internship_data.remote_work_availability || "On-site"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Process Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 py-2 border-b flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <FaFileAlt className="text-yellow-600 text-xl" />
                  </div>
                  Application Process
                </h2>
                <div className="bg-gradient-to-r from-yellow-50 to-white p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                    <FaListOl className="mr-2 text-yellow-600" />
                    How to Apply
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Click the "Apply Now" button to be redirected to the
                    application page. Make sure to prepare your resume and any
                    required documents before applying.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Dates Card */}
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
                      <LuFileClock className="inline-block mr-1 text-gray-500" />
                      Apply By:
                    </div>
                    <div className="text-red-600 font-medium w-full sm:w-2/3 bg-gray-50 p-2 rounded border border-gray-100">
                      {formatDate(internship_data.application_deadline)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information Card */}
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
                    <PiBuildingOfficeBold className=" inline-block mr-1 text-gray-500" />
                      Company:
                    </div>
                    <div className="text-gray-700 font-medium w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {internship_data.company_name}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2">
                    <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <FaGlobe className="inline-block mr-1 text-gray-500" />
                      Website:
                    </div>
                    <div className="w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      <a
                        href={internship_data.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        {internship_data.company_website}
                        <FaExternalLinkAlt className="ml-2 text-xs" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Now Card at the bottom */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 py-2 border-b flex items-center">
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
                          ? "Only students can apply for internships"
                          : ""
                      }
                    >
                      Apply Now <FaExternalLinkAlt className="ml-2 text-sm" />
                    </button>
                  </div>
                  <div className="relative flex-1">
                    <button
                      onClick={
                        userRole === "student"
                          ? handleSaveInternship
                          : undefined
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
                          ? "Only students can save internships"
                          : ""
                      }
                    >
                      {saved ? (
                        <>
                          Saved <FaBookmark className="ml-2 text-yellow-500" />
                        </>
                      ) : (
                        <>
                          Save Internship <FaBookmark className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Similar Internships - Only show for student role */}
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
                  {loadingInternships ? (
                    <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div
                          key={item}
                          className="bg-gray-100 h-32 w-full min-w-[90%] sm:min-w-[300px] lg:min-w-0 rounded-lg flex-shrink-0 lg:flex-shrink"
                        ></div>
                      ))}
                    </div>
                  ) : publishedInternships.length > 0 ? (
                    <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 snap-x snap-mandatory">
                      {publishedInternships.map((internship) => {
                        const internshipId = internship._id || internship.id;
                        const internshipTitle =
                          internship.title ||
                          internship.internship_data?.title ||
                          internship.name ||
                          "Internship Title";
                        const companyName =
                          internship.company_name ||
                          internship.internship_data?.company_name ||
                          internship.company ||
                          "Company";
                        const location =
                          internship.location ||
                          internship.internship_data?.location ||
                          "Location";
                        const description =
                          internship.job_description ||
                          internship.internship_data?.job_description ||
                          internship.description ||
                          "";
                        const updatedAt =
                          internship.updated_at ||
                          internship.internship_data?.application_deadline ||
                          internship.date ||
                          new Date().toISOString();
                        const status = internship.status || "Active";
                        const views =
                          internship.total_views || internship.views || 0;

                        return (
                          <div
                            key={internshipId}
                            className="w-full min-w-[100%] sm:min-w-[300px] lg:min-w-0 flex-shrink-0 lg:flex-shrink snap-start"
                          >
                            <ApplicationCard
                              application={{
                                id: internshipId,
                                title: internshipTitle,
                                company_name: companyName,
                                location: location,
                                job_description: description,
                                updated_at: updatedAt,
                                status: status,
                                total_views: views,
                                type: "internship",
                              }}
                              handleCardClick={() =>
                                handleCardClick(internshipId)
                              }
                              small={true}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No similar internships found. Please check the API
                      response.
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

export default InternshipPreview;
