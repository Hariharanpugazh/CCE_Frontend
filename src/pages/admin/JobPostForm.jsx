import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation, Form } from 'react-router-dom';
import { m, motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSuitcase, FaClipboardList, FaFileSignature, FaRegFileAlt } from 'react-icons/fa';
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { FormInputField, FormTextAreaField } from '../../components/Common/InputField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";
import { max } from 'date-fns';

const loadingStates = [
  { text: "Gathering job details" },
  { text: "Checking application deadline" },
  { text: "Preparing application process" },
  { text: "Finalizing job posting" },
];

const JobDetails = ({ formData, setFormData }) => {
  const workTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Freelance",
    "Volunteer",
  ];
  const IndustryTypes = [
    "Agriculture, Forestry, and Fishing",
    "Manufacturing",
    "Construction",
    "Transportation and Warehousing",
    "Information Technology (IT)",
    "Finance and Banking",
    "Professional, Scientific, and Technical Services",
    "Education",
    "Healthcare and Social Assistance",   
    "Research and Development",
    "Government and Public Sector",
    "Telecommunications",
  ];

  return (
    <>
      {/* Left Column */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Job Title"
          required={true}
          args={{ placeholder: "Enter the job title here (Eg: Software developer)", value: formData.title, maxLength: 100 }}
          setter={(val) => setFormData(prev => ({ ...prev, title: val }))}
        />
        <FormInputField
          label="Job Level"
          required={true}
          args={{ placeholder: "Enter the job level here (Eg: Entry-level, Mid-level, Senior, Executive)", value: formData.experience_level, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, experience_level: val }))}
        />
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold">Industry Type</label>
          <select
            value={formData.IndustryTypes}
            onChange={(e) => setFormData(prev => ({ ...prev, IndustryTypes: e.target.value }))}
            className="w-full text-sm border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Industry Type</option>
            {IndustryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <FormInputField
          label="Company Name"
          required={true}
          args={{ placeholder: "Enter the company name here (Eg: Infosys)", value: formData.company_name, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, company_name: val }))}
        />
        <FormInputField
          label="Work Location"
          required={true}
          args={{ placeholder: "Enter the work location here (Eg: Chennai, Coimbatore)", value: formData.job_location, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, job_location: val }))}
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-5">
        <FormTextAreaField
          label="Job Description"
          args={{ placeholder: "Enter the job description here (Max length 5000 characters)", value: formData.job_description, maxLength: 5000 }}
          setter={(val) => setFormData(prev => ({ ...prev, job_description: val }))}
        />
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold">Employment Type</label>
          <select
            value={formData.work_type}
            onChange={(e) => setFormData(prev => ({ ...prev, work_type: e.target.value }))}
            className="w-full text-sm border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Employment Type</option>
            {workTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <FormInputField
          label="Company Website"
          args={{ placeholder: "Enter the company website here (Eg: https://www.infosys.com/)", value: formData.company_website, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, company_website: val }))}
        />
        <FormInputField
          label="Salary Range"
          required={true}
          args={{
            placeholder: "Enter the salary range here", value: formData.salary_range, type: "number", // Ensure input is numeric
            min: 0, // Set a minimum value (adjust as needed)
            max: 1000000,
          }}
          setter={(val) => {
            const numValue = val.replace(/\D/g, ""); // Remove non-numeric characters
            if (numValue.length <= 7) { // Limit to 6 digits
              setFormData((prev) => ({ ...prev, salary_range: numValue }));
            }
          }}
        />
      </div>
    </>
  );
};

const TagInput = ({ label, required, value, setter, placeholder, maxLength }) => {
  const [tags, setTags] = useState(Array.isArray(value) ? value : []);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Update internal tags when value changes from outside
    if (Array.isArray(value)) {
      setTags(value.filter(tag => tag.trim() !== ''));
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      const newTags = [...tags, trimmedInput];
      setTags(newTags);
      setter(newTags);
      setInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setter(newTags);
  };

  const handleInputChange = (e) => {
    // If the user types a comma, add the tag
    const value = e.target.value;
    if (value.includes(',')) {
      const parts = value.split(',');
      const newTag = parts[0].trim();
      
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        setter(newTags);
      }
      
      // Keep any text after the last comma in the input
      setInput(parts[parts.length - 1].trim());
    } else {
      setInput(value);
    }
  };

  const handleBlur = () => {
    if (input.trim()) {
      addTag();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-yellow-100 border border-yellow-300 rounded-md px-1 mb-0.5 ml-1 mr-1 py-1 flex items-center"
          >
            <span className="text-sm">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length ? "" : placeholder}
          className="flex-grow outline-none p-1 text-sm resize-none min-h-[24px] overflow-hidden"
          maxLength={maxLength}
          rows={1}
        />
      </div>
      <p className="text-xs text-gray-500">Press comma or Enter to add</p>
    </div>
  );
};

const Requirement = ({ formData, setFormData }) => {
  return (
    <>
      {/* Left Column */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Educational Qualification"
          args={{ placeholder: "Enter the educational qualification here (Eg: Degree, Diploma, Certifications)", value: formData.education_requirements, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, education_requirements: val }))}
        />
        <FormInputField
          label="Professional Certifications"
          args={{ placeholder: "Enter the professional certifications here (Eg: PMP, AWS Certified)", value: formData.professional_certifications, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, professional_certifications: val }))}
        />
        <TagInput
          label="Technical Skills Required"
          required={true}
          value={formData.technical_skills || []}
          placeholder="Enter skills and press comma or Enter (Eg: Java, Python, React)"
          maxLength={50}
          setter={(val) => setFormData(prev => ({ ...prev, technical_skills: val }))}
        />
        <FormInputField
          label="Age Limit"
          args={{ placeholder: "Enter the age limit here", value: formData.age_limit, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, age_limit: val }))}
        />
        <TagInput
          label="Additional Skills"
          value={formData.additional_skills || []}
          placeholder="Enter additional skills and press comma or Enter"
          maxLength={50}
          setter={(val) => setFormData(prev => ({ ...prev, additional_skills: val }))}
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Work Experience Requirement"
          args={{ placeholder: "Enter the required work experience here (Eg: Fresher/Experienced)", value: formData.work_experience_requirement, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, work_experience_requirement: val }))}
        />
        <FormInputField
          label="Minimum Marks Requirement"
          args={{ placeholder: "Enter the required minimum marks here", value: formData.minimum_marks_requirement, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, minimum_marks_requirement: val }))}
        />
        <TagInput
          label="Soft Skills Required"
          value={formData.soft_skills || []}
          placeholder="Enter soft skills and press comma or Enter"
          maxLength={50}
          setter={(val) => setFormData(prev => ({ ...prev, soft_skills: val }))}
        />
        <FormTextAreaField
          label="Documents Required"
          args={{ placeholder: "Enter the required documents here", value: formData.documents_required, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, documents_required: val }))}
        />
      </div>
    </>
  );
};
const ApplicationProcess = ({ formData, setFormData }) => {
  const [error, setError] = useState("");

  const handleDateChange = (val) => {
    const today = new Date().toISOString().split("T")[0];

    if (val < today) {
      setError("Application Deadline cannot be in the past.");
      setFormData(prev => ({ ...prev, application_deadline: "" })); // Reset field
    } else {
      setError("");
      setFormData(prev => ({ ...prev, application_deadline: val }));
    }
  };
  
  // Function to get tomorrow's date in YYYY-MM-DD format
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };
  
  return (
    <>
      {/* Left Column */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Job Posting Date"
          disabled={true}
          args={{ placeholder: "Enter the job posting date here", type: "date", value: formData.job_posting_date, min: new Date().toISOString().split("T")[0], maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, job_posting_date: val }))}
        />
        <FormInputField
          label="Interview Start Date"
          args={{ placeholder: "Enter the interview start date here", type: "date", value: formData.interview_start_date, min: new Date().toISOString().split("T")[0], maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, interview_start_date: val }))}
        />
        <FormInputField
          label="Job Link"
          required={true}
          args={{ placeholder: "Enter the job link here", value: formData.job_link, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, job_link: val }))}
        />
        <FormTextAreaField
          label="Selection Process"
          args={{ placeholder: "Enter the selection process here", value: formData.selection_process, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, selection_process: val }))}
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Application Deadline"
          required={true}
          args={{ 
            placeholder: "Enter the job level here", 
            type: "date", 
            value: formData.application_deadline, 
            min: getTomorrow(), // Set minimum date to tomorrow
            maxLength: 200 
          }}
          setter={handleDateChange} // Use the validation function
      />

      {/* Show Popup Error Message */}
      {error && (
        <div className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          {error}
        </div>
      )}
        <FormInputField
          label="Interview End Date"
          args={{
            placeholder: "Enter the interview end date here",
            type: "date",
            value: formData.interview_end_date,
            min: formData.interview_start_date || new Date().toISOString().split("T")[0], // End date must be after Start Date
            maxLength: 200
          }}
          setter={(val) => setFormData(prev => ({ ...prev, interview_end_date: val }))}
        />
        <FormTextAreaField
          label="Steps to Apply"
          args={{ placeholder: "Enter the steps to apply here", value: formData.steps_to_apply, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, steps_to_apply: val }))}
        />
      </div>
    </>
  );
};

const OtherInstructions = ({ formData, setFormData }) => {
  const [imagePreview, setImagePreview] = useState(formData.imagePreview || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        console.log("Selected file:", file); // Debug log
        
        // Clean up any previous object URL to prevent memory leaks
        if (formData.imagePreview) {
          URL.revokeObjectURL(formData.imagePreview);
        }
        
        const previewUrl = URL.createObjectURL(file);
        setFormData({ ...formData, image: file, imagePreview: previewUrl });
        setImagePreview(previewUrl);
      } else {
        toast.error("Only JPG and PNG images are allowed.");
        setFormData({ ...formData, image: null, imagePreview: null });
        setImagePreview(null);
      }
    }
  };

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && !formData.imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, formData.imagePreview]);

  // Helper function to safely handle key responsibilities
  const formatKeyResponsibilities = () => {
    if (Array.isArray(formData.key_responsibilities)) {
      return formData.key_responsibilities.join(', ');
    }
    return formData.key_responsibilities || '';
  };

  // Helper function to safely process key responsibilities input
  const handleKeyResponsibilitiesChange = (val) => {
    // If empty string, set to empty array instead of trying to split
    const responsibilities = val.trim() === '' ? [] : val.split(',').map(res => res.trim());
    setFormData(prev => ({ ...prev, key_responsibilities: responsibilities }));
  };

  return (
    <>
      {/* Two-column grid for form fields */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Relocation Assistance"
          args={{ placeholder: "Enter the relocation assistance here", value: formData.relocation_assistance, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, relocation_assistance: val }))}
        />
        <FormInputField
          label="Expected Joining Date"
          args={{ placeholder: "Enter the expected joining date here", type: "date", value: formData.expected_joining_date, min: new Date().toISOString().split("T")[0], maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, expected_joining_date: val }))}
        />
        <FormTextAreaField
          label="Key Responsibilities"
          args={{ placeholder: "Enter the key responsibilities here", value: formatKeyResponsibilities(), maxLength: 200 }}
          setter={handleKeyResponsibilitiesChange}
        />
      </div>

      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Remote Work Availability"
          args={{ placeholder: "Enter the remote work availability here", value: formData.remote_work_availability, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, remote_work_availability: val }))}
        />
        <FormInputField
          label="Work Schedule"
          args={{ placeholder: "Enter the work schedule here", value: formData.work_schedule, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, work_schedule: val }))}
        />
        <FormTextAreaField
          label="Preparation Tips"
          args={{ placeholder: "Enter the preparation tips here", value: formData.preparation_tips, maxLength: 200 }}
          setter={(val) => setFormData(prev => ({ ...prev, preparation_tips: val }))}
        />
      </div>
    </>
  );
};

const Summary = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-4">
        <FormInputField
          label="Job Title"
          required={true}
          disabled={true}
          args={{ placeholder: "Enter the job title here", value: formData.title }}
          setter={(val) => setFormData(prev => ({ ...prev, title: val }))}
        />
        <FormTextAreaField
          label="Job Description"
          disabled={true}
          args={{ placeholder: "Enter the job description here", value: formData.job_description }}
          setter={(val) => setFormData(prev => ({ ...prev, job_description: val }))}
        />
        <FormInputField
          label="Work Type"
          disabled={true}
          args={{ placeholder: "Select Work Type", value: formData.work_type }}
          setter={(val) => setFormData(prev => ({ ...prev, work_type: val }))}
        />
        <FormInputField
          label="Company Name"
          disabled={true}
          args={{ placeholder: "Enter the company name here", value: formData.company_name }}
          setter={(val) => setFormData(prev => ({ ...prev, company_name: val }))}
        />

      </div>
      <div className="flex flex-col space-y-4">
        <FormInputField
          label="Company Website"
          disabled={true}
          args={{ placeholder: "Enter the company website here", value: formData.company_website }}
          setter={(val) => setFormData(prev => ({ ...prev, company_website: val }))}
        />
        <FormInputField
          label="Work Location"
          disabled={true}
          args={{ placeholder: "Enter the work location here", value: formData.job_location }}
          setter={(val) => setFormData(prev => ({ ...prev, job_location: val }))}
        />
        <FormInputField
          label="Salary Range"
          disabled={true}
          args={{ placeholder: "Enter salary range here", value: formData.salary_range }}
          setter={(val) => setFormData(prev => ({ ...prev, salary_range: val }))}
        />
        <FormInputField
          label="Job Posting Date"
          disabled={true}
          args={{ placeholder: "Enter the job posting date here", value: formData.job_posting_date }}
          setter={(val) => setFormData(prev => ({ ...prev, job_posting_date: val }))}
        />
        <FormInputField
          label="Application Deadline"
          disabled={true}
          args={{ placeholder: "Enter the application deadline here", value: formData.application_deadline }}
          setter={(val) => setFormData(prev => ({ ...prev, application_deadline: val }))}
        />
        
      </div>
    </>
  );
};

export default function JobPostForm() {
  const storedJobData = sessionStorage.getItem("jobData");
  let initialJobData = {};

  const location = useLocation();
  const jobDataFromLocation = location.state?.job;
  const id = location.state?.id;
  const isEditMode = !!jobDataFromLocation;

  if (isEditMode) {
    initialJobData = jobDataFromLocation.job_data;
  } else if (storedJobData) {
    initialJobData = JSON.parse(storedJobData);
  }

  const [formData, setFormData] = useState({
    // JobDetails Section (9 fields)
    title: initialJobData.title || "",
    job_description: initialJobData.job_description || "",
    experience_level: initialJobData.experience_level || "",
    industry_type: initialJobData.industry_type || "",
    work_type: initialJobData.work_type || "",
    company_name: initialJobData.company_name || "",
    company_website: initialJobData.company_website || "",
    job_location: initialJobData.job_location || "",
    salary_range: initialJobData.salary_range || "",

    // Requirement Section (9 fields)
    education_requirements: initialJobData.education_requirements || "",
    work_experience_requirement: initialJobData.work_experience_requirement || "",
    professional_certifications: initialJobData.professional_certifications || "",
    minimum_marks_requirement: initialJobData.minimum_marks_requirement || "",
    technical_skills: initialJobData.technical_skills || [],
    soft_skills: initialJobData.soft_skills || [],
    age_limit: initialJobData.age_limit || "",
    documents_required: initialJobData.documents_required || "",
    additional_skills: initialJobData.additional_skills || [],

    // ApplicationProcess Section (7 fields)
    job_posting_date: initialJobData.job_posting_date && !isNaN(Date.parse(initialJobData.job_posting_date))
      ? new Date(initialJobData.job_posting_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0], // Default to today if not editing
    application_deadline: !jobDataFromLocation
    ? initialJobData.application_deadline 
    : (jobDataFromLocation.job_data.application_deadline).toString().split("T")[0],
    interview_start_date: initialJobData.interview_start_date && !isNaN(Date.parse(initialJobData.interview_start_date))
      ? new Date(initialJobData.interview_start_date)
      : null,
    interview_end_date: initialJobData.interview_end_date && !isNaN(Date.parse(initialJobData.interview_end_date))
      ? new Date(initialJobData.interview_end_date)
      : null,
    job_link: initialJobData.job_link || "",
    selection_process: initialJobData.selection_process || "",
    steps_to_apply: initialJobData.steps_to_apply || "",

    // OtherInstructions Section (6 fields)
    relocation_assistance: initialJobData.relocation_assistance || "",
    remote_work_availability: initialJobData.remote_work_availability || "",
    expected_joining_date: initialJobData.expected_joining_date && !isNaN(Date.parse(initialJobData.expected_joining_date))
      ? new Date(initialJobData.expected_joining_date)
      : null,
    work_schedule: initialJobData.work_schedule || "",
    key_responsibilities: Array.isArray(initialJobData.key_responsibilities) 
      ? initialJobData.key_responsibilities 
      : (initialJobData.key_responsibilities ? initialJobData.key_responsibilities.split(',').map(item => item.trim()) : []),
    preparation_tips: initialJobData.preparation_tips || "",
    image: initialJobData.image || null, // Initialize as null to avoid empty object
    imagePreview: initialJobData.imagePreview || null, // Add this line to store image preview URL
    originalImage: isEditMode ? jobDataFromLocation.job_data.image : null, // Store the original base64 image
  });

  // Add useEffect to handle image in edit mode
  useEffect(() => {
    if (isEditMode && jobDataFromLocation.job_data.image && typeof jobDataFromLocation.job_data.image === 'string' && jobDataFromLocation.job_data.image.startsWith('/9j')) {
      try {
        // Convert base64 string to blob
        const byteCharacters = atob(jobDataFromLocation.job_data.image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        // Create object URL from blob
        const imageUrl = URL.createObjectURL(blob);
        
        setFormData(prev => ({
          ...prev,
          imagePreview: imageUrl,
          originalImage: jobDataFromLocation.job_data.image // Store original base64 image string
        }));
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  }, [isEditMode, jobDataFromLocation]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const [formSections, setFormSections] = useState({
    "Job Details": { status: "active", icon: <FaSuitcase /> },
    "Job Requirement": { status: "unvisited", icon: <FaClipboardList /> },
    "Application Process": { status: "unvisited", icon: <FaFileSignature /> },
    "Other Instructions": { status: "unvisited", icon: <FaRegFileAlt /> },
    "Summary": { status: "unvisited", icon: <FaRegFileAlt /> },
  });

  const sectionKeys = Object.keys(formSections);
  const activeIndex = sectionKeys.findIndex(key => formSections[key].status === "active");

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const validateApplicationDeadline = (deadline) => {
    const now = new Date();
    return new Date(deadline) > now;
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      setError("Token has expired. Please log in again.");
      return;
    }

    if (decodedToken.role !== "superadmin" && decodedToken.role !== "admin") {
      setError("You do not have permission to access this page.");
    }

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
      if (payload.role === "admin") {
        setUserId(payload.admin_user);
      } else if (payload.role === "superadmin") {
        setUserId(payload.superadmin_user);
      }
    }
  }, [navigate]);

  const handleNavigation = (direction) => {
    const currentSection = sectionKeys[activeIndex];
    let isValid = true;

    if (direction === "next") {
      switch (currentSection) {
        case "Job Details":
          if (!formData.title) {
            toast.error("Please fill in all mandatory fields in Job Details.");
            isValid = false;
          }
          break;
        case "Requirement":
          if (!formData.technical_skills.length) {
            toast.error("Please fill in all mandatory fields in Requirements.");
            isValid = false;
          }
          break;
        case "Application Process":
          if (!formData.application_deadline) {
            toast.error("Please fill in all mandatory fields in Application Process.");
            isValid = false;
          }
          break;
        case "Other Instructions":
          // Remove the validation for key_responsibilities as it's no longer mandatory
          break;
        default:
          break;
      }
    }

    if (!isValid) return;

    setFormSections((prevSections) => {
      const updatedSections = { ...prevSections };
      if (activeIndex !== -1) {
        const currentKey = sectionKeys[activeIndex];
        const nextIndex = direction === "next" ? activeIndex + 1 : activeIndex - 1;

        if (nextIndex >= 0 && nextIndex < sectionKeys.length) {
          const nextKey = sectionKeys[nextIndex];

          if (direction === "next") {
            updatedSections[currentKey] = { ...updatedSections[currentKey], status: "completed" };
          }

          updatedSections[nextKey] = { ...updatedSections[nextKey], status: "active" };

          if (direction === "prev") {
            for (let i = nextIndex + 1; i < sectionKeys.length; i++) {
              updatedSections[sectionKeys[i]] = { ...updatedSections[sectionKeys[i]], status: "unvisited" };
            }
          }
        }
      }
      return updatedSections;
    });
  };


  const handleSubmit = async () => {
    // Validate form data before showing loader
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      // Show all validation errors
      validationErrors.forEach(error => toast.error(error));
      return;
    }
      
    if (isEditMode && JSON.stringify(initialJobData) === JSON.stringify(formData)) {
        toast.error("Please edit the changes before submitting.");
        return;
    }

    // Date validations
    const today = new Date().toISOString().split("T")[0];
    if (formData.expected_joining_date && formData.expected_joining_date < today) {
        toast.error("Expected Joining Date cannot be in the past.");
        return;
    }
    if (formData.interview_start_date && formData.interview_start_date < today) {
        toast.error("Interview Start Date cannot be in the past.");
        return;
    }
    if (formData.interview_end_date && formData.interview_start_date && 
        formData.interview_end_date < formData.interview_start_date) {
        toast.error("Interview End Date must be after Interview Start Date.");
        return;
    }
    if (formData.expected_joining_date && formData.interview_end_date && 
        formData.expected_joining_date < formData.interview_end_date) {
        toast.error("Expected Joining Date must be after Interview End Date.");
        return;
    }

    // Only set loading to true if validation passes
    setLoading(true);
    
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      // Create FormData object for both create and edit operations
      const formDataToSend = new FormData();
      
      // Prepare job data object and format values consistently
      const jobData = {};
      Object.keys(formData).forEach((key) => {
        // Skip imagePreview, originalImage, and image when preparing job data JSON
        if (key === "imagePreview" || key === "originalImage" || key === "image") return;
        
        if (key === "application_deadline" && formData[key] instanceof Date) {
          jobData[key] = formData[key].toISOString().split("T")[0];
        } else if (key === "application_deadline" && typeof formData[key] === "string") {
          const date = new Date(formData[key]);
          jobData[key] = !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : formData[key];
        } else if (key === "interview_start_date" || key === "interview_end_date" || key === "expected_joining_date") {
          // Format date objects properly
          if (formData[key]) {
            if (formData[key] instanceof Date) {
              jobData[key] = formData[key].toISOString().split("T")[0];
            } else if (typeof formData[key] === "string") {
              jobData[key] = formData[key];
            }
          } else {
            jobData[key] = null;
          }
        } else if (key === "key_responsibilities") {
          // Special handling for key_responsibilities
          jobData[key] = Array.isArray(formData[key]) ? formData[key] : [];
        } else if (formData[key] === "" || formData[key] === null || formData[key] === undefined) {
          jobData[key] = "NA";
        } else {
          jobData[key] = formData[key];
        }
      });

      // Handle image separately from the job data
      if (formData.image instanceof File) {
        // If it's a new file upload, append to formData
        formDataToSend.append("image", formData.image);
      } else if (isEditMode && formData.originalImage) {
        // In edit mode with original base64 image, convert to binary
        try {
          // Convert base64 string to binary blob
          const byteCharacters = atob(formData.originalImage);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          
          // Append the blob as a file
          formDataToSend.append("image", blob, "original-image.jpg");
        } catch (error) {
          console.error("Error converting image to binary:", error);
        }
      }

      // Log data for debugging
      console.log("Submitting job data:", jobData);
      
      formDataToSend.append("job_data", JSON.stringify(jobData));
      formDataToSend.append("role", userRole);
      formDataToSend.append("userId", userId);

      // If in edit mode, handle the edit request using the same FormData structure
      if (isEditMode) {
        console.log("Updating job with ID:", id);
        
        const response = await axios.post(
          `http://127.0.0.1:8000/api/job-edit/${id}/`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        console.log("Update response:", response.data);
        toast.success("Job updated successfully!");
        navigate("/jobs");
      } else {
        // Create new job
        const response = await axios.post(
          "http://localhost:8000/api/job_post/",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setMessage(response.data.message);
        window.location.href = `${window.location.origin}/jobs`;
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(`Error: ${error.response?.data?.message || "Something went wrong"}`);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Add a comprehensive validation function
  const validateFormData = () => {
    const errors = [];
    const today = new Date().toISOString().split("T")[0];
    
    // Required fields validation
    if (!formData.title) errors.push("Job Title is required");
    if (!formData.company_name) errors.push("Company Name is required");
    if (!formData.job_location) errors.push("Job Location is required");
    if (!formData.salary_range) errors.push("Salary Range is required");
    if (!formData.job_link) errors.push("Job Link is required");
    if (!formData.application_deadline) errors.push("Application Deadline is required");
    
    // Date validations
    if (formData.expected_joining_date && formData.expected_joining_date < today) {
      errors.push("Expected Joining Date cannot be in the past");
    }
    if (formData.interview_start_date && formData.interview_start_date < today) {
      errors.push("Interview Start Date cannot be in the past");
    }
    if (formData.interview_end_date && formData.interview_start_date && 
        formData.interview_end_date < formData.interview_start_date) {
      errors.push("Interview End Date must be after Interview Start Date");
    }
    if (formData.expected_joining_date && formData.interview_end_date && 
        formData.expected_joining_date < formData.interview_end_date) {
      errors.push("Expected Joining Date must be after Interview End Date");
    }
    
    // URL validation
    if (formData.company_website && !validateUrl(formData.company_website)) {
      errors.push("Invalid URL format for Company Website");
    }
    
    // Application deadline validation
    if (formData.application_deadline && !validateApplicationDeadline(formData.application_deadline)) {
      errors.push("Application Deadline must be a future date");
    }
    
    return errors;
  };

  return (
    <motion.div className="flex bg-gray-100 min-h-screen">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <ToastContainer />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex-1 p-8 bg-white rounded-xl flex flex-col h-full max-w-[1400px] mx-auto shadow-lg">
          <div className="flex justify-between items-center text-2xl pb-4 border-b border-gray-300 mb-4">
            <p className="font-semibold">{isEditMode ? "Edit Job" : "Post a Job"}</p>
            <button
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition-colors"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg z-50">
              {error}
            </div>
          )}

          <div className="flex items-stretch gap-6 flex-1">
            <div className="w-1/4 flex flex-col p-4 bg-gray-50 rounded-xl">
              <div className="border border-gray-200 flex flex-col rounded-lg bg-white shadow-sm mb-6">
                <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
                {Object.entries(formSections).map(([section, prop], key, array) => (
                  <div
                    key={section}
                    className={`border-l-6 flex items-center p-4 border-b border-gray-200
                      ${key === 0 ? "rounded-tl-lg" : ""}
                      ${key === array.length - 1 ? "rounded-bl-lg border-b-transparent" : ""}
                      ${prop.status === "active" 
                        ? "border-l-yellow-400 bg-yellow-50" 
                        : prop.status === "completed" 
                          ? "border-l-[#00B69B] bg-green-50" 
                          : "border-l-gray-300"}`}
                  >
                    <span className="text-gray-900 p-2 inline-block">{prop.icon}</span>
                    <span className="font-medium">{section}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mb-3">
                <button
                  className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                    activeIndex === 0 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                  disabled={activeIndex === 0}
                  onClick={() => handleNavigation("prev")}
                >
                  Previous
                </button>

                {activeIndex === sectionKeys.length - 1 ? (
                  <button
                    className="rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm px-6 py-2 transition-colors"
                    onClick={handleSubmit}
                  >
                    {isEditMode ? "Update" : "Finish"}
                  </button>
                ) : (
                  <button
                    className="rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm px-6 py-2 transition-colors"
                    disabled={activeIndex === sectionKeys.length - 1}
                    onClick={() => handleNavigation("next")}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="grid grid-cols-2 gap-6 items-start h-full">
                {formSections["Job Details"].status === "active" && <JobDetails formData={formData} setFormData={setFormData} />}
                {formSections["Job Requirement"].status === "active" && <Requirement formData={formData} setFormData={setFormData} />}
                {formSections["Application Process"].status === "active" && <ApplicationProcess formData={formData} setFormData={setFormData} />}
                {formSections["Other Instructions"].status === "active" && (
                  <>
                    <OtherInstructions formData={formData} setFormData={setFormData} />
                    
                    {/* Image Upload Section - Outside the grid */}
                    <div className="col-span-2 mt-8">
                      <div className="border-2 border-gray-300 border-dashed rounded-xl px-3 py-2 text-center bg-white w-full hover:border-[#ffcc00] transition-colors">
                        <label
                          htmlFor="image"
                          className="cursor-pointer text-gray-600 text-lg flex flex-col items-center"
                        >
                          <div className="mb-3 text-blue-500">
                            
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#ffcc00">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>

                          </div>
                          <span className="text-lg font-medium">{formData.imagePreview ? "Change Image" : "Upload a job-related photo"}</span>
                          <span className="text-sm text-gray-400 mt-2">JPG or PNG format only</span>
                        </label>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/jpeg, image/png"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.type === "image/jpeg" || file.type === "image/png") {
                                // Clean up any previous object URL to prevent memory leaks
                                if (formData.imagePreview) {
                                  URL.revokeObjectURL(formData.imagePreview);
                                }
                                
                                const previewUrl = URL.createObjectURL(file);
                                setFormData({ ...formData, image: file, imagePreview: previewUrl });
                              } else {
                                toast.error("Only JPG and PNG images are allowed.");
                                setFormData({ ...formData, image: null, imagePreview: null });
                              }
                            }
                          }}
                          className="hidden"
                        />
                        {formData.imagePreview && (
                          <div className="mt-6">
                            <img
                              src={formData.imagePreview}
                              alt="Uploaded"
                              className="mx-auto rounded-lg mb-4 shadow-md max-w-full h-auto"
                              style={{ maxHeight: '250px' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {formSections["Summary"].status === "active" && <Summary formData={formData} setFormData={setFormData} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
