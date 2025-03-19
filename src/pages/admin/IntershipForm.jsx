import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaClipboardList,
  FaFileSignature,
  FaRegFileAlt,
  FaSuitcase,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import {
  FormInputField,
  FormTextAreaField,
} from "../../components/Common/InputField";
import { ToastContainer, toast } from "react-toastify";
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";

const loadingStates = [
  {
    text: "Gathering internship details",
  },
  {
    text: "Checking application deadline",
  },
  {
    text: "Preparing application process",
  },
  {
    text: "Validating internship details",
  },
  {
    text: "Finalizing internship posting",
  },
];

const InternshipDetails = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label="Internship Title"
          required
          args={{
            placeholder: "Enter Internship Title",
            value: formData.title,
            maxLength: 100,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^A-Za-z ]/g, ""); // Remove numbers and special characters
            setFormData((prev) => ({ ...prev, title: filteredValue }));
          }}
        />
        <FormInputField
          label="Internship Location"
          required
          args={{
            placeholder: "Enter Internship Location",
            value: formData.location,
            maxLength: 100,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^A-Za-z ,]/g, ""); // Allow letters, spaces & commas
            setFormData((prev) => ({ ...prev, location: filteredValue }));
          }}
        />
        <FormInputField
          label={"Industry Type"}
          args={{
            placeholder: "Enter Industry Type",
            value: formData.industry_type,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, industry_type: val }))
          }
        />
        <FormInputField
          label="Internship Type"
          args={{
            placeholder: "Enter Internship Type",
            value: formData.internship_type,
            maxLength: 100,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^A-Za-z ]/g, ""); // Allow only letters & spaces
            setFormData((prev) => ({ ...prev, internship_type: filteredValue }));
          }}
        />
        <FormInputField
          label="Company Name"
          args={{
            placeholder: "Enter Company Name",
            value: formData.company_name,
            maxLength: 100,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^A-Za-z0-9 &]/g, ""); // Allow letters, numbers, & spaces
            setFormData((prev) => ({ ...prev, company_name: filteredValue }));
          }}
        />
      </div>

      <div className="flex flex-col space-y-4 w-full">
        <FormTextAreaField
          label={"Internship Description"}
          args={{
            placeholder: "Enter a brief description of the internship",
            value: formData.job_description,
            maxLength: 5000,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, job_description: val }))
          }
        />
        <FormInputField
          label={"Company Website"}
          args={{
            placeholder: "Enter Company Website URL",
            value: formData.company_website,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, company_website: val }))
          }
        />
        <FormInputField
          label="Duration"
          required
          args={{
            placeholder: "Enter Duration (e.g., 3 months)",
            value: formData.duration,
            maxLength: 50,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^0-9A-Za-z ]/g, ""); // Allow numbers, letters & spaces
            setFormData((prev) => ({ ...prev, duration: filteredValue }));
          }}
        />
        <FormInputField
          label="Stipend Range"
          args={{
            placeholder: "Enter Stipend Range (e.g., 500 - 1000)",
            value: formData.stipend,
            maxLength: 10,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^0-9-]/g, ""); // Allow only numbers & hyphen
            setFormData((prev) => ({ ...prev, stipend: filteredValue }));
          }}
          type="text"
        />
      </div>
    </>
  );
};

const InternshipRequirements = ({ formData, setFormData }) => {
  // Add this to your state declarations
  const [imagePreview, setImagePreview] = useState(() => {
    // Check if there's a saved image in localStorage
    const savedImage = localStorage.getItem("jobImagePreview");
    return savedImage || null;
  });

  // Modified handle image change function
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        console.log("Selected file:", file); // Debug log
        setFormData({ ...formData, image: file });

        // Create object URL and save to state
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);

        // Save to localStorage for persistence
        localStorage.setItem("jobImagePreview", imageUrl);

        // Also save file info in localStorage if needed
        const fileInfo = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        };
        localStorage.setItem("jobImageFile", JSON.stringify(fileInfo));
      } else {
        toast.error("Only JPG and PNG images are allowed.");
        setFormData({ ...formData, image: null });
        setImagePreview(null);
        localStorage.removeItem("jobImagePreview");
        localStorage.removeItem("jobImageFile");
      }
    }
  };

  // Add this new function for image deletion
  const handleImageDelete = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: null });

    // Remove from localStorage
    localStorage.removeItem("jobImagePreview");
    localStorage.removeItem("jobImageFile");

    // Revoke object URL to free memory
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };
  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label={"Technical Skills Required"}
          args={{
            placeholder: "Enter Technical Skills (comma-separated)",
            value: formData.technical_skills.join(","),
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({
              ...prev,
              technical_skills: val.split(","),
            }))
          }
        />
        <FormInputField
          label={"Soft Skills Required"}
          args={{
            placeholder: "Enter Soft Skills (comma-separated)",
            value: formData.soft_skills.join(","),
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, soft_skills: val.split(",") }))
          }
        />
        <FormInputField
          label={"Educational Requirement"}
          args={{
            placeholder:
              "Enter Educational Requirement (e.g., Bachelor's Degree)",
            value: formData.education_requirements,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, education_requirements: val }))
          }
        />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        <FormTextAreaField
          label={"Documents Required"}
          args={{
            placeholder: "List required documents (e.g., Resume, Cover Letter)",
            value: formData.documents_required,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, documents_required: val }))
          }
        />
        <FormInputField
          label={"Additional Skills"}
          args={{
            placeholder: "Enter Additional Skills (comma-separated)",
            value: formData.additional_skills.join(","),
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({
              ...prev,
              additional_skills: val.split(","),
            }))
          }
        />
      </div>
      {/* Image Upload Section */}
      <div className="border-2 border-gray-300 border-dashed rounded-xl p-4 text-center bg-white mt-8 w-full">
        <label htmlFor="image" className="cursor-pointer text-gray-500 text-sm">
          {imagePreview
            ? "Change Image"
            : "Upload a job-related photo (Accepted formats: JPG, PNG)"}
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/jpeg, image/png"
          onChange={handleImageChange}
          className="hidden"
        />
        {imagePreview && (
          <div className="mt-4 relative">
            <img
              src={imagePreview}
              alt="Uploaded"
              className="mx-auto rounded-lg shadow-md max-w-full h-auto"
              style={{ maxHeight: "200px" }}
            />
            <button
              type="button"
              onClick={handleImageDelete}
              className="absolute top-0 right-2 bg-white text-pink-500  p-1 hover:bg-gray-100  border-pink-500"
              aria-label="Delete image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const ApplicationProcess = ({ formData, setFormData }) => {

  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label={"Internship Posting Date"}
          args={{
            placeholder: "Posting Date",
            type: "date",
            value: new Date().toISOString().split("T")[0], // Set today's date
            readOnly: true, // Make it read-only
          }}
          setter={() => { }} // Prevent changes
          type="date"
        />
        <FormInputField
          label={"Application Deadline"}
          required={true}
          args={{
            placeholder: "Enter Application Deadline (YYYY-MM-DD)",
            type: "date",
            value: formData.application_deadline,
            min: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Set min to tomorrow
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, application_deadline: val }))
          }
          type="date"
        />
        <FormInputField
          label={"Interview Start Date (If Applicable)"}
          args={{
            placeholder: "Enter Interview Start Date (YYYY-MM-DD)",
            type: "date",
            value: formData.interview_start_date,
            min: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Set min to tomorrow
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, interview_start_date: val }))
          }
          type="date"
        />
        <FormTextAreaField
          label={"Steps to Apply"}
          args={{
            placeholder: "Describe the steps candidates need to take to apply",
            value: formData.steps_to_apply,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, steps_to_apply: val }))
          }
        />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label={"Interview End Date (If Applicable)"}
          args={{
            placeholder: "Enter Interview End Date (YYYY-MM-DD)",
            type: "date",
            value: formData.interview_end_date,
            min: formData.interview_start_date
              ? new Date(new Date(formData.interview_start_date).getTime() + 86400000).toISOString().split("T")[0]
              : new Date(Date.now() + 86400000).toISOString().split("T")[0], // Must be after Interview Start Date
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, interview_end_date: val }))
          }
          type="date"
        />
        <FormInputField
          label={"Internship Link"}
          required={true}
          args={{
            placeholder: "Enter the application link",
            value: formData.internship_link,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_link: val }))
          }
        />
        <FormTextAreaField
          label={"Selection Process"}
          args={{
            placeholder: "Describe the selection process for applicants",
            value: formData.selection_process,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, selection_process: val }))
          }
        />
      </div>
    </>
  );
};

const InternshipPreview = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label={"Internship Title"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Internship Title",
            value: formData.title,
            maxLength: 300,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, title: val }))}
        />
        <FormInputField
          label={"Internship Location"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Internship Location",
            value: formData.location,
            maxLength: 300,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, location: val }))}
        />
        <FormInputField
          label={"Application Deadline"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Application Deadline (YYYY-MM-DD)",
            type: "date",
            value: formData.application_deadline,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, application_deadline: val }))
          }
        />
        <FormInputField
          label={"Internship Type"}
          disabled={true}
          args={{
            placeholder: "Enter Internship Type",
            value: formData.internship_type,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_type: val }))
          }
        />
        <FormInputField
          label={"Company Name"}
          disabled={true}
          args={{
            placeholder: "Enter Company Name",
            value: formData.company_name,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, company_name: val }))
          }
        />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        <FormTextAreaField
          label={"Internship Description"}
          disabled={true}
          args={{
            placeholder: "Enter a brief description of the internship",
            value: formData.job_description,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, job_description: val }))
          }
        />
        <FormInputField
          label={"Internship Link"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter the application link",
            value: formData.internship_link,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_link: val }))
          }
        />
        <FormInputField
          label={"Duration"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Duration (e.g., 3 months)",
            value: formData.duration,
            maxLength: 300,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, duration: val }))}
        />
        <FormInputField
          label={"Stipend Range"}
          disabled={true}
          args={{
            placeholder: "Enter Stipend Range (e.g., $500 - $1000)",
            value: formData.stipend,
            maxLength: 300,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, stipend: val }))}
        />
      </div>
    </>
  );
};

const InternPostForm = () => {
  const storedInternshipData = sessionStorage.getItem("internshipData");
  const initialInternshipData = storedInternshipData
    ? JSON.parse(storedInternshipData)
    : {};

  const [formData, setFormData] = useState({
    title: initialInternshipData.title || "",
    company_name: initialInternshipData.company_name || "",
    location: initialInternshipData.location || "",
    industry_type: initialInternshipData.industry_type || "",
    internship_type: initialInternshipData.internship_type || "",
    duration: initialInternshipData.duration || "",
    stipend: initialInternshipData.stipend || "",
    application_deadline:
      initialInternshipData.application_deadline &&
        !isNaN(Date.parse(initialInternshipData.application_deadline))
        ? initialInternshipData.application_deadline // Keep it as a string
        : null,
    skills_required: initialInternshipData.required_skills || [],
    job_description: initialInternshipData.job_description || "",
    company_website: initialInternshipData.company_website || "",
    job_link: initialInternshipData.job_link || "",
    education_requirements: initialInternshipData.education_requirements || "",
    technical_skills: initialInternshipData.technical_skills || [],
    soft_skills: initialInternshipData.soft_skills || [],
    documents_required: initialInternshipData.documents_required || "",
    additional_skills: initialInternshipData.additional_skills || [],
    internship_posting_date:
      initialInternshipData.internship_posting_date &&
        !isNaN(Date.parse(initialInternshipData.internship_posting_date))
        ? initialInternshipData.internship_posting_date.split("T")[0] // "2025-03-12"
        : null,
    interview_start_date:
      initialInternshipData.interview_start_date &&
        !isNaN(Date.parse(initialInternshipData.interview_start_date))
        ? initialInternshipData.interview_start_date.split("T")[0] // "2025-03-13"
        : null,
    interview_end_date:
      initialInternshipData.interview_end_date &&
        !isNaN(Date.parse(initialInternshipData.interview_end_date))
        ? initialInternshipData.interview_end_date.split("T")[0] // "2025-03-14"
        : null,
    internship_link: initialInternshipData.internship_link || "",
    selection_process: initialInternshipData.selection_process || "",
    steps_to_apply: initialInternshipData.steps_to_apply || "",
    image: initialInternshipData.image || null,
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if screen is mobile on initial load
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10000 milliseconds = 10 seconds

      // Cleanup function to clear the timer if the component unmounts or loading changes
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const [categories, setCategories] = useState({
    "Internship Details": { status: "active", icon: <FaSuitcase /> },
    "Internship Requirements": {
      status: "unvisited",
      icon: <FaClipboardList />,
    },
    "Application Process": { status: "unvisited", icon: <FaFileSignature /> },
    Summary: { status: "unvisited", icon: <FaRegFileAlt /> },
  });

  const internshipTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Volunteer",
  ];

  const validateUrl = (url) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const validateDeadline = (date) => {
    const currentDate = new Date();
    if (date < currentDate) {
      setDeadlineError("Application deadline must be a future date.");
      return false;
    } else {
      setDeadlineError("");
      return true;
    }
  };

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
  }, []); // Removed navigate from dependencies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "company_website") {
      if (value && !validateUrl(value)) {
        setUrlError("Invalid URL");
      } else {
        setUrlError("");
      }
    }
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      internship_type: type,
    });
    setIsTypeOpen(false);
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      application_deadline: date,
    });
    validateDeadline(date);
  };

  const handleSkillsChange = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = e.target.value.trim();
      if (skill && !formData.skills_required.includes(skill)) {
        setFormData({
          ...formData,
          skills_required: [...formData.skills_required, skill],
        });
        e.target.value = "";
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills_required: formData.skills_required.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleSubmit = async () => {

    const today = new Date().toISOString().split("T")[0];
    if (formData.application_deadline < today) {
      setToastMessage("Application deadline must be a future date.");
      return;
    }
    if (formData.company_website && !validateUrl(formData.company_website)) {
      toast.error("Invalid URL");
      setLoading(false); // Stop the loader if validation fails
      return;
    }
    if (!validateDeadline(formData.application_deadline)) {
      toast.error("please check the deadline");
      setLoading(false); // Stop the loader if validation fails
      return;
    }
    setLoading(true);
    // Start the loader

    setTimeout(async () => {
      if (formData.company_website && !validateUrl(formData.company_website)) {
        toast.error("Invalid URL");
        setLoading(false); // Stop the loader if validation fails
        return;
      }

      // Validate Deadline
      if (!validateDeadline(formData.application_deadline)) {
        toast.error("please check the deadline");
        setLoading(false); // Stop the loader if validation fails
        return;
      }


      setIsSubmitting(true);
      setMessage("");
      setError("");

      try {
        const token = Cookies.get("jwt");
        if (!token) {
          setError("No token found. Please log in.");
          setIsSubmitting(false);
          setLoading(false); // Stop the loader if no token is found
          return;
        }

        // Prepare internship data object and format values
        const formDataToSend = new FormData();
        const internshipData = {
          ...formData,
          required_skills: formData.technical_skills,
        };

        // Only append image if it's a File object
        if (internshipData.image instanceof File) {
          formDataToSend.append("image", internshipData.image);
        } else {
          delete internshipData.image; // Exclude image from update if not a file
        }

        // Format dates and handle empty fields
        Object.keys(internshipData).forEach((key) => {
          if (
            key === "application_deadline" &&
            internshipData[key] instanceof Date
          ) {
            internshipData[key] = internshipData[key]
              .toISOString()
              .split("T")[0];
          } else if (
            key === "application_deadline" &&
            typeof internshipData[key] === "string"
          ) {
            const date = new Date(internshipData[key]);
            internshipData[key] = !isNaN(date.getTime())
              ? date.toISOString().split("T")[0]
              : internshipData[key];
          } else if (
            internshipData[key] === "" ||
            internshipData[key] === null ||
            internshipData[key] === undefined
          ) {
            internshipData[key] = "NA";
          }
        });

        formDataToSend.append("data", JSON.stringify(internshipData));
        formDataToSend.append("role", userRole);
        formDataToSend.append("userId", userId);

        console.log("Sending data to API:", internshipData); // Debugging

        const internshipId = sessionStorage.getItem("internshipId");
        const url = internshipId
          ? `https://cce-backend-54k0.onrender.com/api/internship-edit/${internshipId}/`
          : "https://cce-backend-54k0.onrender.com/api/post-internship/";
        const method = internshipId ? axios.put : axios.post;

        const response = await method(url, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("API Response:", response.data);

        setMessage(response.data.message);

        // Get the stored return URL
        const returnUrl = sessionStorage.getItem("returnToPreview");

        // Clean up session storage
        sessionStorage.removeItem("internshipData");
        sessionStorage.removeItem("internshipId");
        navigate("/internships");
        sessionStorage.removeItem("returnToPreview");

        // Navigate to return URL if it exists, otherwise go to internships list
        if (returnUrl) {
          navigate(returnUrl);
        } else {
          navigate('/internships');
        }
      } catch (error) {
        console.error("API Error:", error); // Debugging
        setError(
          `Error: ${error.response?.data?.error || "Something went wrong"}`
        );
        setToastMessage(
          `Error: ${error.response?.data?.error || "Something went wrong"}`
        );
      } finally {
        setIsSubmitting(false);
        setLoading(false); // Stop the loader after API call
      }
    }, 10000); // Adjust the duration to match your loader duration
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  const categoryKeys = Object.keys(categories);
  const activeIndex = categoryKeys.findIndex(
    (key) => categories[key].status === "active"
  );

  const handleNavigation = (direction) => {
    setCategories((prevCategories) => {
      const updatedCategories = { ...prevCategories };

      if (activeIndex !== -1) {
        const currentKey = categoryKeys[activeIndex];
        const nextIndex =
          direction === "next" ? activeIndex + 1 : activeIndex - 1;

        if (nextIndex >= 0 && nextIndex < categoryKeys.length) {
          const nextKey = categoryKeys[nextIndex];

          if (direction === "next") {
            updatedCategories[currentKey] = {
              ...updatedCategories[currentKey],
              status: "completed",
            };
          }

          updatedCategories[nextKey] = {
            ...updatedCategories[nextKey],
            status: "active",
          };

          if (direction === "prev") {
            for (let i = nextIndex + 1; i < categoryKeys.length; i++) {
              updatedCategories[categoryKeys[i]] = {
                ...updatedCategories[categoryKeys[i]],
                status: "unvisited",
              };
            }
          }
        }
      }

      return updatedCategories;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <motion.div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <ToastContainer />

      <div className="flex-1 flex flex-col md:items-center md:justify-center p-3 md:p-6">
        <div className="w-full max-w-6xl p-4 md:p-8 bg-white rounded-xl flex flex-col shadow-md">
          <div className="flex justify-between items-center text-xl md:text-2xl pb-4 border-b border-gray-300">
            <p className="font-semibold">Post an Internship</p>
            <button
              className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition-colors"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>

          {toastMessage && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded shadow z-50">
              {toastMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row mt-4">
            {/* Mobile toggle button */}
            <button
              className="md:hidden flex items-center justify-center p-2 mb-4 bg-gray-200 rounded-md"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? "Hide Steps" : "Show Steps"}
            </button>

            {/* Sidebar */}
            {isSidebarOpen && (
              <div className="w-full md:w-1/4 md:border-r border-gray-300 flex flex-col p-2 md:p-4 mb-4 md:mb-0">
                <div className="border-y border-r border-gray-300 flex flex-col rounded-lg mb-4">
                  <Loader
                    loadingStates={loadingStates}
                    loading={loading}
                    duration={2000}
                  />
                  {Object.entries(categories).map(
                    ([category, prop], key, array) => (
                      <div
                        key={category}
                        className={`border-l-4 flex items-center p-2 border-b border-gray-300
                          ${key === 0 ? "rounded-tl-lg" : ""}
                          ${key === array.length - 1
                            ? "rounded-bl-lg border-b-transparent"
                            : ""
                          }
                          ${prop.status === "active"
                            ? "border-l-yellow-400 bg-yellow-50"
                            : prop.status === "completed"
                              ? "border-l-[#00B69B] bg-green-50"
                              : "border-l-gray-300"
                          }`}
                      >
                        <span className="text-gray-900 p-2 inline-block">
                          {prop.icon}
                        </span>
                        <span className="text-sm md:text-base">{category}</span>
                      </div>
                    )
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    className={`px-3 py-1.5 border rounded text-sm ${activeIndex === 0
                        ? "bg-gray-100 cursor-not-allowed"
                        : "hover:bg-gray-100 cursor-pointer"
                      }`}
                    disabled={activeIndex === 0}
                    onClick={() => handleNavigation("prev")}
                  >
                    <span className="flex items-center">
                      <FaChevronLeft className="mr-1" /> Previous
                    </span>
                  </button>

                  {activeIndex === categoryKeys.length - 1 ? (
                    <button
                      className="rounded bg-green-500 hover:bg-green-600 text-white text-sm px-5 py-1.5 cursor-pointer transition-colors"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Finish"}
                    </button>
                  ) : (
                    <button
                      className="rounded bg-yellow-400 hover:bg-yellow-500 text-sm px-5 py-1.5 cursor-pointer transition-colors"
                      disabled={activeIndex === categoryKeys.length - 1}
                      onClick={() => handleNavigation("next")}
                    >
                      <span className="flex items-center">
                        Next <FaChevronRight className="ml-1" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Form content */}
            <div className="flex-1 p-2 md:p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
              {
                {
                  "Internship Details": (
                    <InternshipDetails
                      formData={formData}
                      setFormData={setFormData}
                    />
                  ),
                  "Internship Requirements": (
                    <InternshipRequirements
                      formData={formData}
                      setFormData={setFormData}
                    />
                  ),
                  "Application Process": (
                    <ApplicationProcess
                      formData={formData}
                      setFormData={setFormData}
                    />
                  ),
                  Summary: (
                    <InternshipPreview
                      formData={formData}
                      setFormData={setFormData}
                    />
                  ),
                }[
                Object.entries(categories).find(
                  ([_, prop]) => prop.status === "active"
                )?.[0]
                ]
              }
            </div>
          </div>

          {/* Mobile navigation buttons */}
          <div className="flex justify-between mt-6 md:hidden">
            <button
              className={`px-3 py-1.5 border rounded text-sm ${activeIndex === 0
                  ? "bg-gray-100 cursor-not-allowed"
                  : "hover:bg-gray-100 cursor-pointer"
                }`}
              disabled={activeIndex === 0}
              onClick={() => handleNavigation("prev")}
            >
              <span className="flex items-center">
                <FaChevronLeft className="mr-1" /> Previous
              </span>
            </button>

            {activeIndex === categoryKeys.length - 1 ? (
              <button
                className="rounded bg-green-500 hover:bg-green-600 text-white text-sm px-5 py-1.5 cursor-pointer transition-colors"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Finish"}
              </button>
            ) : (
              <button
                className="rounded bg-yellow-400 hover:bg-yellow-500 text-sm px-5 py-1.5 cursor-pointer transition-colors"
                disabled={activeIndex === categoryKeys.length - 1}
                onClick={() => handleNavigation("next")}
              >
                <span className="flex items-center">
                  Next <FaChevronRight className="ml-1" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InternPostForm;
