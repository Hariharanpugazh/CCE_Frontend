import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function JobPostForm() {
  // Load AI-generated job data from sessionStorage
  const storedJobData = sessionStorage.getItem("jobData");
  const initialJobData = storedJobData ? JSON.parse(storedJobData) : {};

  const [formData, setFormData] = useState({
    title: initialJobData.title || "",
    company_name: initialJobData.company_name || "",
    company_overview: initialJobData.company_overview || "",
    company_website: initialJobData.company_website || "",
    job_description: initialJobData.job_description || "",
    key_responsibilities: initialJobData.key_responsibilities || [],
    required_skills: initialJobData.required_skills || [],
    education_requirements: initialJobData.education_requirements || "",
    experience_level: initialJobData.experience_level || "",
    salary_range: initialJobData.salary_range || "",
    benefits: initialJobData.benefits || [],
    job_location: initialJobData.job_location || "",
    work_type: initialJobData.work_type || "",
    work_schedule: initialJobData.work_schedule || "",
    application_instructions: initialJobData.application_instructions || "",
    application_deadline: initialJobData.application_deadline && !isNaN(Date.parse(initialJobData.application_deadline))
    ? new Date(initialJobData.application_deadline)
    : null,
    contact_email: initialJobData.contact_email || "",
    contact_phone: initialJobData.contact_phone || [],
    job_link: initialJobData.job_link || "",
  });

  const [selectedCategory, setSelectedCategory] = useState(initialJobData.selectedCategory || "");
  const [selectedWorkType, setSelectedWorkType] = useState(initialJobData.selectedWorkType || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isWorkTypeOpen, setIsWorkTypeOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(false);

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

  // Validate URL
  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return true;
  };

  // Validate Application Deadline
  const validateApplicationDeadline = (deadline) => {
    const now = new Date();
    return new Date(deadline) > now;
  };

  const handleChange = (e) => {
    console.log(`Field ${e.target.name} changed to ${e.target.value}`);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleWorkTypeChange = (workType) => {
    setSelectedWorkType(workType);
    setIsWorkTypeOpen(false);
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
        e.target.value = "";
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
    console.log("Form submitted");
    setDisableSubmit(true);
    e.preventDefault();

    // Validate mandatory fields
    if (!formData.title || !formData.company_name || !selectedCategory || !formData.job_link) {
      setError("Please fill in all mandatory fields.");
      setShowWarning(true);
      setDisableSubmit(false);
      return;
    }

    // Validate Company Website URL
    if (formData.company_website && !validateUrl(formData.company_website)) {
      setError("Invalid URL for Company Website.");
      setDisableSubmit(false);
      return;
    }

    // Validate Application Deadline
    if (formData.application_deadline && !validateApplicationDeadline(formData.application_deadline)) {
      setError("Application Deadline must be a future date.");
      setDisableSubmit(false);
      return;
    }

    try {
      const token = Cookies.get("jwt");
      if (!token) {
        setError("No token found. Please log in.");
        setDisableSubmit(false);
        return;
      }
      const response = await axios.post(
        "https://cce-backend-54k0.onrender.com/api/job_post/",
        { ...formData, selectedCategory, selectedWorkType, userId, role: userRole },
      );

      setMessage(response.data.message);
      setError("");
      setDisableSubmit(false);
      setInterval(() => {
        window.location.href = `${window.location.origin}/jobs`;
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
      setDisableSubmit(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
      if (payload.role === "admin") {
        setUserId(payload.admin_user);
      } else if (payload.role === "superadmin") {
        setUserId(payload.superadmin_user);
      }
    }
  }, []);

  const handlePreview = () => {
    console.log("Preview button clicked");
    setIsPreview(true);
  };

  return (
    <motion.div
      className={`max-w mx-auto bg-white shadow-xl rounded-2xl relative ml-55 ${isPreview ? "overflow-hidden" : "overflow-auto"}`}
      // initial={{ opacity: 0, y: 30 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.8 }}
    >
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className={`p-8`}>
        <h2 className="text-3xl pt-4 font-bold mb-4 text-gray-800 text-center">Post a Job</h2>

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
          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-2 capitalize">
              Title <span className="text-red-500">*</span>
            </label>
            <motion.input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              whileHover={{ backgroundColor: "#e0f2ff" }}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              placeholder="Enter title"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-2 capitalize">
              Company Name <span className="text-red-500">*</span>
            </label>
            <motion.input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              whileHover={{ backgroundColor: "#e0f2ff" }}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              placeholder="Enter company name"
            />
          </div>

          <div className="col-span-1 relative">
            <label className="block text-sm font-semibold mb-2">
              Job Categories <span className="text-red-500">*</span>
            </label>
            <motion.div
              className="cursor-pointer w-full border border-gray-300 p-2.5 rounded-lg flex justify-between items-center transition-all duration-300"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              whileHover={{
                backgroundColor: "#D1E7FF",
                borderColor: "#3B82F6",
              }}
              style={{
                borderColor: isCategoryOpen ? "#3B82F6" : "#D1D5DB",
                backgroundColor: isCategoryOpen ? "#D1E7FF" : "white",
              }}
            >
              <span className="text-sm text-gray-700">
                {selectedCategory || "Select Job Category"}
              </span>
              <motion.span
                whileHover={{
                  scale: 1.2,
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

          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-2">
              Job Link <span className="text-red-500">*</span>
            </label>
            <motion.input
              type="url"
              name="job_link"
              value={formData.job_link}
              onChange={handleChange}
              whileHover={{ backgroundColor: "#e0f2ff" }}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              placeholder="Enter job link"
            />
          </div>
        </div>

        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={!disableSubmit ? handleSubmit : undefined} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-2 capitalize">
              Required Skills
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

          <div className="col-span-1 relative">
            <label className="block text-sm font-semibold mb-2">
              Work Type
            </label>
            <motion.div
              className="cursor-pointer w-full border border-gray-300 p-2.5 rounded-lg flex justify-between items-center transition-all duration-300"
              onClick={() => setIsWorkTypeOpen(!isWorkTypeOpen)}
              whileHover={{
                backgroundColor: "#D1E7FF",
                borderColor: "#3B82F6",
              }}
              style={{
                borderColor: isWorkTypeOpen ? "#3B82F6" : "#D1D5DB",
                backgroundColor: isWorkTypeOpen ? "#D1E7FF" : "white",
              }}
            >
              <span className="text-sm text-gray-700">
                {selectedWorkType || "Select Work Type"}
              </span>
              <motion.span
                whileHover={{
                  scale: 1.2,
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

          {Object.keys(formData).map((field) => {
            if (field === "title" || field === "company_name" || field === "job_link" || field === "work_type") {
              return null;
            }
            if (field !== "application_deadline" && field !== "required_skills") {
              return (
                <div key={field} className="col-span-1">
                  <label className="block text-sm font-semibold mb-2 capitalize">
                    {field.replace(/_/g, " ")}
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
                    whileHover={{ backgroundColor: "#e0f2ff" }}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    placeholder={`Enter ${field.replace(/_/g, " ")}`}
                  />
                </div>
              );
            }
            return null;
          })}

          <div className="col-span-1">
            <label className="block text-sm font-semibold mb-2 capitalize">
              Application Deadline
            </label>
            <div className="relative">
              <DatePicker
                selected={formData.application_deadline}
                onChange={(date) => setFormData({ ...formData, application_deadline: date })}
                dateFormat="MM/dd/yyyy"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow pl-10"
                placeholderText="Select a date"
                isClearable
              />
              <FaCalendarAlt
                onClick={(e) => {
                  e.target.previousSibling.focus();
                }}
                className="absolute left-3 top-3 text-gray-500 cursor-pointer"
              />
            </div>
          </div>

          <motion.button
            type="button"
            className="w-1/4 justify-self-center col-span-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-transform shadow-lg"
            whileHover={{ scale: 1.01 }}
            onClick={handlePreview}
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
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
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
              <PreviewField label="Company Website" value={formData.company_website || "N/A"} url /><br />
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
              <PreviewField label="Application Deadline" value={formData.application_deadline ? formData.application_deadline.toLocaleDateString() : "N/A"} /><br />
              <PreviewField label="Contact Email" value={formData.contact_email || "N/A"} email /><br />
              <PreviewField label="Contact Phone" value={formData.contact_phone || "N/A"} phone /><br />
              <PreviewField label="Job Link" value={formData.job_link } url /><br />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

const PreviewField = ({ label, value, multiline = false, url = false, email = false, phone = false }) => {
  let formattedValue = value;

  // Check if the value is a Date object and format it
  if (value instanceof Date) {
    formattedValue = value.toLocaleDateString(); // Format the date as a string
  } else if (url) {
    formattedValue = <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
  } else if (email) {
    formattedValue = <a href={`mailto:${value}`}>{value}</a>;
  } else if (phone) {
    formattedValue = <a href={`tel:${value}`}>{value}</a>;
  }

  // Avoid showing "N/A" for specific fields
  if (!formattedValue && (label === "Title" || label === "Company Name" || label === "Job Categories" || label === "Job Link")) {
    formattedValue = "";
  } else if (!formattedValue) {
    formattedValue = "N/A";
  }

  return (
    <div>
      <strong>{label}:</strong>
      {multiline ? <p>{formattedValue}</p> : <span>{formattedValue}</span>}
    </div>
  );
};
