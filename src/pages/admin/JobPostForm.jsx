import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function JobPostForm() {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    company_overview: "",
    company_website: "",
    job_description: "",
    key_responsibilities: "",
    required_skills: [],
    education_requirements: "",
    experience_level: "",
    salary_range: "",
    benefits: "",
    job_location: "",
    work_type: "",
    work_schedule: "",
    application_instructions: "",
    application_deadline: "",
    contact_email: "",
    contact_phone: "",
    job_link: "", // Added job link to the form data
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isWorkTypeOpen, setIsWorkTypeOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false); // State to show the warning popup
  const [isPreview, setIsPreview] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(false)

  const categories = [
    "TNPC",
    "Army and Defence",
    "IT & Development",
    "Civil",
    "Banking",
    "UPSC",
    "Biomedical",
    "TNPSC",
    "Army and Defence Systems",
  ];

  const workTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Volunteer",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false); // Close dropdown after selection
  };

  const handleWorkTypeChange = (workType) => {
    setSelectedWorkType(workType);
    setIsWorkTypeOpen(false); // Close dropdown after selection
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      application_deadline: date,
    });
  };

  const handleRequiredSkillsChange = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = e.target.value.trim();
      if (skill && !formData.required_skills.includes(skill)) {
        setFormData({
          ...formData,
          required_skills: [...formData.required_skills, skill],
        });
        e.target.value = ""; // Clear input after adding the tag
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    setDisableSubmit(true)
    e.preventDefault();

    // Check if the Job Link field is empty
    if (!formData.job_link) {
      setShowWarning(true); // Show warning if job link is not provided
      setDisableSubmit(false)
      return; // Stop form submission
    }

    try {
      const token = Cookies.get("jwt");
      if (!token) {
        setError("No token found. Please log in.");
        setDisableSubmit(false)
        return;
      }
      const response = await axios.post(
        "http://localhost:8000/api/job_post/",
        { ...formData, selectedCategory, selectedWorkType, userId , role : userRole },
      );

      setInterval(() => {
        window.location.href = `${window.location.origin}/jobs`;
      }, 2000);
      window.location.href = "#"
      setMessage(response.data.message);
      setError("");
      setDisableSubmit(false)
    } catch (err) {
      window.location.href = "#"
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
      setDisableSubmit(false)
    }
  };

  // Fetch user role from JWT token in cookies
  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      console.log("Decoded JWT Payload:", payload); // Debugging line
      setUserRole(payload.role); // Assuming the payload has a 'role' field
      if (payload.role === "admin") 
        {
          setUserId(payload.admin_user); // Assuming the payload has an 'id' field
        }
      else if (payload.role === "superadmin")
        {
          setUserId(payload.superadmin_user); // Assuming the payload has an 'id' field
        }

    }
  }, []);

  const PreviewField = ({ label, value, multiline = false, url = false, email = false, phone = false }) => {
    if (!value) return null;

    let content = value;
    if (url) content = <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a>;
    if (email) content = <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
    if (phone) content = <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>;
    if (label === "Application Deadline" && value) {
      content = format(new Date(value), "MMMM dd, yyyy");
    }

    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-1">{label}</h4>
        {multiline ? (
          <p className="text-gray-800 whitespace-pre-line">{content}</p>
        ) : (
          <p className="text-gray-800">{content}</p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className={`max-w mx-auto bg-white shadow-xl rounded-2xl relative ${isPreview ? "overflow-hidden" : "overflow-auto"}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Render appropriate navbar based on user role */}
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className={`p-8`}>
        <h2 className="text-3xl pt-4 font-bold mb-4 text-gray-800 text-center">Post a Job</h2>

        {/* Display warning popup if Job Link is not filled */}
        {showWarning && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-semibold text-red-600">Warning</h3>
              <p className="text-sm text-gray-700">The Job Link field is required. Please enter a valid URL.</p>
              <button
                onClick={() => setShowWarning(false)}
                className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {Object.keys({ title: formData.title, company_name: formData.company_name }).map((field) => <div key={field} className="col-span-1">
            <label className="block text-sm font-semibold mb-2 capitalize">
              {field.replace(/_/g, " ")} <span className="text-red-600">*</span>
            </label>
            <motion.input
              type={field.includes("email")
                ? "email"
                : field.includes("phone")
                  ? "tel"
                  : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              whileHover={{ backgroundColor: "#e0f2ff" }}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              placeholder={`Enter ${field.replace(/_/g, " ")}`}
            />
          </div>)}

          {/* Job Categories Dropdown */}
          <div className="col-span-1 relative">
            <label className="block text-sm font-semibold mb-2">
              Job Categories <span className="text-red-600">*</span>
            </label>
            <motion.div
              className="cursor-pointer w-full border border-gray-300 p-2.5 rounded-lg flex justify-between items-center transition-all duration-300"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              whileHover={{
                backgroundColor: "#D1E7FF", // Light blue glow effect
                borderColor: "#3B82F6", // Blue border on hover
              }}
              style={{
                borderColor: isCategoryOpen ? "#3B82F6" : "#D1D5DB", // Default border color
                backgroundColor: isCategoryOpen ? "#D1E7FF" : "white", // Light blue background when open
              }}
            >
              <span className="text-sm text-gray-700">
                {selectedCategory || "Select Job Category"}
              </span>
              <motion.span
                whileHover={{
                  scale: 1.2, // Slightly increase arrow size on hover
                }}
                className="text-sm text-gray-700"
              >
                {isCategoryOpen ? "▲" : "▼"}
              </motion.span>
            </motion.div>

            {isCategoryOpen && (
              <div className="absolute z-10 mt-2 space-y-2 p-3 border border-gray-300 rounded-lg w-full bg-white shadow-lg">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="job_category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-2"
                    />
                    <span>{category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Link */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-2">
              Job Link <span className="text-red-600">*</span>
            </label>
            <motion.input
              type="url"
              name="job_link"
              value={formData.job_link}
              onChange={handleChange}
              required
              whileHover={{ backgroundColor: "#e0f2ff" }}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              placeholder="Enter job link"
            />
          </div>
        </div>

        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={!disableSubmit ? handleSubmit : undefined} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Required Skills */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-2 capitalize">
              Required Skills <span className="text-red-600">*</span>
            </label>
            <motion.input
              type="text"
              name="required_skills"
              onKeyDown={handleRequiredSkillsChange}
              whileHover={{ backgroundColor: "#e0f2ff" }}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              placeholder="Enter required skills and press Enter"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.required_skills.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Work Type - Overlay Dropdown */}
          <div className="col-span-1 relative">
            <label className="block text-sm font-semibold mb-2">
              Work Type <span className="text-red-600">*</span>
            </label>
            <motion.div
              className="cursor-pointer w-full border border-gray-300 p-2.5 rounded-lg flex justify-between items-center transition-all duration-300"
              onClick={() => setIsWorkTypeOpen(!isWorkTypeOpen)}
              whileHover={{
                backgroundColor: "#D1E7FF", // Light blue glow effect
                borderColor: "#3B82F6", // Blue border on hover
              }}
              style={{
                borderColor: isWorkTypeOpen ? "#3B82F6" : "#D1D5DB", // Default border color
                backgroundColor: isWorkTypeOpen ? "#D1E7FF" : "white", // Light blue background when open
              }}
            >
              <span className="text-sm text-gray-700">
                {selectedWorkType || "Select Work Type"}
              </span>
              <motion.span
                whileHover={{
                  scale: 1.2, // Slightly increase arrow size on hover
                }}
                className="text-sm text-gray-700"
              >
                {isWorkTypeOpen ? "▲" : "▼"}
              </motion.span>
            </motion.div>

            {isWorkTypeOpen && (
              <div className="absolute z-20 mt-2 space-y-2 p-3 border border-gray-300 rounded-lg w-full bg-white shadow-lg">
                {workTypes.map((workType) => (
                  <div key={workType} className="flex items-center">
                    <input
                      type="radio"
                      name="work_type"
                      value={workType}
                      checked={selectedWorkType === workType}
                      onChange={() => handleWorkTypeChange(workType)}
                      className="mr-2"
                    />
                    <span>{workType}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Fields */}
          {Object.keys(formData).map((field) => {
            if (field === "title" || field === "company_name") {
              return
            }
            if (field !== "application_deadline" && field !== "required_skills" && field !== "job_link" && field !== "work_type") {
              return (
                <div key={field} className="col-span-1">
                  <label className="block text-sm font-semibold mb-2 capitalize">
                    {field.replace(/_/g, " ")} <span className="text-red-600">*</span>
                  </label>
                  <motion.input
                    type={field.includes("email")
                      ? "email"
                      : field.includes("phone")
                        ? "tel"
                        : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    whileHover={{ backgroundColor: "#e0f2ff" }}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    placeholder={`Enter ${field.replace(/_/g, " ")}`}
                  />
                </div>
              );
            }
            return null;
          })}

          {/* Application Deadline */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-2 capitalize">
              Application Deadline <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <DatePicker
                required={true}
                selected={formData.application_deadline}
                onChange={handleDateChange}
                dateFormat="MM/dd/yyyy"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow pl-10" // Added padding for icon inside
                placeholderText="Select a date"
              />
              <FaCalendarAlt
                onClick={(e) => {
                  e.target.previousSibling.focus();
                }}
                className="absolute left-3 top-3 text-gray-500 cursor-pointer" // Positioned icon inside the input field
              />
            </div>
          </div>

          <motion.button
            type="button"
            className="w-1/4 justify-self-center col-span-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-transform shadow-lg"
            whileHover={{ scale: 1.01 }}
            onClick={() => setIsPreview(true)}
          >
            Preview Job
          </motion.button>

          <motion.button
            type="submit"
            className={` ${disableSubmit ? "cursor-disabled bg-blue-300" : "cursor-pointer bg-blue-600"} w-1/4 justify-self-center col-span-2 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-transform shadow-lg`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Job
          </motion.button>
        </form>

        {/* Preview Modal */}
        {isPreview && (
          <motion.div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={() => setIsPreview(false)}
                className="fixed text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Job Preview</h2>
              <PreviewField label="Title" value={formData.title} /><br />
              <PreviewField label="Company Name" value={formData.company_name} /><br />
              <PreviewField label="Company Overview" value={formData.company_overview} multiline /><br />
              <PreviewField label="Company Website" value={formData.company_website} url /><br />
              <PreviewField label="Job Description" value={formData.job_description} multiline /><br />
              <PreviewField label="Key Responsibilities" value={formData.key_responsibilities} multiline /><br />
              <PreviewField
                label="Required Skills"
                value={formData.required_skills.join(", ")}
              /><br />
              <PreviewField label="Education Requirements" value={formData.education_requirements} /><br />
              <PreviewField label="Experience Level" value={formData.experience_level} /><br />
              <PreviewField label="Salary Range" value={formData.salary_range} /><br />
              <PreviewField label="Benefits" value={formData.benefits} multiline /><br />
              <PreviewField label="Job Location" value={formData.job_location} /><br />
              <PreviewField label="Work Type" value={selectedWorkType} /><br />
              <PreviewField label="Work Schedule" value={formData.work_schedule} /><br />
              <PreviewField label="Application Instructions" value={formData.application_instructions} multiline /><br />
              <PreviewField label="Application Deadline" value={formData.application_deadline} /><br />
              <PreviewField label="Contact Email" value={formData.contact_email} email /><br />
              <PreviewField label="Contact Phone" value={formData.contact_phone} phone /><br />
              <PreviewField label="Job Link" value={formData.job_link} url /><br />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}