import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSuitcase,
  FaClipboardList,
  FaFileSignature,
  FaRegFileAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { FormInputField, FormTextAreaField } from "../../components/Common/InputField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";
import { max } from "date-fns";

const loadingStates = [
  { text: "Gathering exam details" },
  { text: "Checking Application Deadline" },
  { text: "Preparing application process" },
  { text: "Validating application Details" },
  { text: "Finalizing exam posting" },
];

// Helper Component for Key-Value Pair Inputs
const KeyValueInput = ({ label, items, onChange, maxItems }) => {
  const handleAdd = () => {
    if (!maxItems || items.length < maxItems) {
      onChange([...items, { key: "", value: "" }]);
    }
  };
  const handleRemove = (index) => onChange(items.filter((_, i) => i !== index));
  
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const safeItems = Array.isArray(items) && items.length > 0 ? items : [{ key: "", value: "" }];
  const limitReached = maxItems && safeItems.length >= maxItems;

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold mb-1">{label}</label>
      {safeItems.map((item, index) => (
        <div key={index} className="flex space-x-2 items-center">
          <input
            type="text"
            maxLength={30}
            placeholder="Key (e.g., Name)"
            value={item.key || ""}
            onChange={(e) => handleChange(index, "key", e.target.value)}
            className="w-1/2 text-sm border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            maxLength={30}
            placeholder="Value (e.g., Common Admission Test)"
            value={item.value || ""}
            onChange={(e) => handleChange(index, "value", e.target.value)}
            className="w-1/2 text-sm border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button type="button" onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700">
            <FaTrash />
          </button>
        </div>
      ))}
      <div className="flex items-center">
        <button 
          type="button" 
          onClick={handleAdd} 
          disabled={limitReached}
          className={`flex items-center ${limitReached ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'}`}
        >
          <FaPlus className="mr-1" /> Add {label}
        </button>
        {limitReached && <span className="ml-2 text-sm text-[#ffcc00]">Maximum limit reached ({maxItems})</span>}
      </div>
    </div>
  );
};

// Component Definitions (Updated to use formData.exam_data)
const ExamBasicDetails = ({ formData, setFormData }) => {
  const examData = formData.exam_data;
  return (
    <>
      <div className="flex flex-col space-y-2">
        <FormInputField
          label="Exam Title"
          required={true}
          args={{ placeholder: "Enter the exam title here", value: examData.exam_title, maxLength: 50 }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, exam_title: val } }))}
        />
        <FormInputField
          label="Exam Link"
          required={true}
          args={{
            placeholder: "Enter the official exam link here",
            value: examData.exam_link,
            type: "url", // Ensures the input type only accepts URLs
          }}
          setter={(val) =>
            setFormData((prev) => ({
              ...prev,
              exam_data: { ...prev.exam_data, exam_link: val }
            }))
          }
        />
        <FormTextAreaField
          label="Eligibility Criteria"
          args={{ placeholder: "Enter the eligibility criteria here", value: examData.eligibility_criteria, maxLength: 200 }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, eligibility_criteria: val } }))}
        />
        <FormTextAreaField
          label="Application Process"
          required={true}
          args={{ placeholder: "Enter the application process here", value: examData.application_process, maxLength: 200 }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, application_process: val } }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="About Exam"
          args={{ placeholder: "Enter details about the exam here", value: examData.about_exam,maxLength: 200 }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, about_exam: val } }))}
        />
        <KeyValueInput
          label="Exam Highlights"
          items={examData.exam_highlights || []}
          maxItems={5}
          onChange={(newHighlights) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, exam_highlights: newHighlights } }))}
        />
      </div>
    </>
  );
};

const ExamRequirements = ({ formData, setFormData }) => {
  const examData = formData.exam_data;
  const [imagePreview, setImagePreview] = useState(examData.image ? examData.image : null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, image: file } }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast.error("Only JPG and PNG images are allowed.");
        setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, image: null } }));
        setImagePreview(null);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Documents Required"
          args={{ placeholder: "Enter required documents here", value: examData.documents_required }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, documents_required: val } }))}
        />
        <FormInputField
          label="Exam Centers"
          args={{ placeholder: "Enter the exam centers here", value: examData.exam_centers }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, exam_centers: val } }))}
        />
        <FormTextAreaField
          label="Exam Pattern"
          args={{ placeholder: "Enter the exam pattern here", value: examData.exam_pattern }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, exam_pattern: val } }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Mock Test"
          args={{ placeholder: "Enter the mock test details here", value: examData.mock_test }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, mock_test: val } }))}
        />
        <FormTextAreaField
          label="Admit Card"
          args={{ placeholder: "Enter admit card details here", value: examData.admit_card }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, admit_card: val } }))}
        />
      </div>

      {/* Image Upload Section */}
      <div className="border-2 border-gray-300 border-dashed rounded-xl p-4 text-center bg-white mt-1 w-full">
        <label htmlFor="image" className="cursor-pointer text-gray-500 text-sm">
          {imagePreview ? "Change Image" : "Upload a job-related photo (Accepted formats: JPG, PNG)"}
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
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Uploaded"
              className="mx-auto rounded-lg shadow-md max-w-full h-auto"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

const ExamContentDetails = ({ formData, setFormData }) => {
  const examData = formData.exam_data;
  return (
    <>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Preparation Tips"
          args={{ placeholder: "Enter preparation tips here", value: examData.preparation_tips }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, preparation_tips: val } }))}
        />
        <FormTextAreaField
          label="Result"
          args={{ placeholder: "Enter result details here", value: examData.result }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, result: val } }))}
        />
        <FormTextAreaField
          label="Answer Key"
          args={{ placeholder: "Enter answer key details here", value: examData.answer_key }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, answer_key: val } }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Exam Analysis"
          args={{ placeholder: "Enter exam analysis here", value: examData.exam_analysis }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, exam_analysis: val } }))}
        />
        <KeyValueInput
          label="Cutoff"
          items={examData.cutoff || []}
          maxItems={3}
          onChange={(newCutoff) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, cutoff: newCutoff } }))}
        />
      </div>
    </>
  );
};

const ExamAdditionalInfo = ({ formData, setFormData }) => {
  const examData = formData.exam_data;
  
  // Convert application_deadline to proper format for display
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    
    try {
      // If it's already a Date object
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split("T")[0];
      }
      
      // If it's a string that can be parsed as a date
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split("T")[0];
      }
    } catch (err) {
      console.error("Date parsing error:", err);
    }
    
    // Return empty string if date is invalid
    return "";
  };
  
  return (
    <>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Selection Process"
          args={{ placeholder: "Enter selection process here", value: examData.selection_process }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, selection_process: val } }))}
        />
        <FormTextAreaField
          label="Question Paper"
          args={{ placeholder: "Enter question paper details here", value: examData.question_paper }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, question_paper: val } }))}
        />
        <FormTextAreaField
          label="Frequently Asked Questions (FAQ)"
          args={{ placeholder: "Enter FAQ here", value: examData.faq }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, faq: val } }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormInputField
          label="Application Deadline"
          required={true}
          disabled={false}
          args={{
            placeholder: "Select a date",
            type: "date",
            value: formatDateForInput(examData.application_deadline),
            min: new Date().toISOString().split("T")[0], // Prevent past dates
          }}
          setter={(val) => setFormData((prev) => ({ 
            ...prev, 
            exam_data: { 
              ...prev.exam_data, 
              application_deadline: val // Store as string, will convert when needed
            } 
          }))}
        />
        <FormTextAreaField
          label="Syllabus"
          args={{ placeholder: "Enter the syllabus here", value: examData.syllabus }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, syllabus: val } }))}
        />
        <FormTextAreaField
          label="Participating Institutes"
          args={{ placeholder: "Enter participating institutes here", value: examData.participating_institutes }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, participating_institutes: val } }))}
        />
      </div>
    </>
  );
};

const Summary = ({ formData, setFormData }) => {
  const examData = formData.exam_data;
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col space-y-2">
        <FormInputField
          label="Exam Title"
          required={true}
          disabled={true}
          args={{ placeholder: "Enter the exam title here", value: examData.exam_title }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, exam_title: val } }))}
        />
        <FormInputField
          label="Eligibility Criteria"
          disabled={true}
          args={{ placeholder: "Enter the eligibility criteria here", value: examData.eligibility_criteria }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, eligibility_criteria: val } }))}
        />
        <FormInputField
          label="Application Deadline"
          disabled={true}
          args={{ placeholder: "Enter Application Deadline here", value: examData.application_deadline}}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, application_deadline: val } }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="About Exam"
          disabled={true}
          args={{ placeholder: "Enter details about the exam here", value: examData.about_exam }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, about_exam: val } }))}
        />
        <FormInputField
          label="Application Process"
          disabled={true}
          args={{ placeholder: "Enter the application process here", value: examData.application_process }}
          setter={(val) => setFormData((prev) => ({ ...prev, exam_data: { ...prev.exam_data, application_process: val } }))}
        />
      </div>
    </div>
  );
};

export default function ExamPostForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId: urlExamId } = useParams();

  const examDataFromLocation = location.state?.exam;
  const id = location.state?.id;
  const isEditMode = !!examDataFromLocation;
  const isCreateMode = location.state?.isCreateMode;


  // Define empty form data template
  const emptyFormData = {
    exam_data: {
      exam_title: "",
      exam_link: "",
      about_exam: "",
      exam_highlights: [{ key: "", value: "" }],
      eligibility_criteria: "",
      application_process: "",
      documents_required: "",
      exam_centers: "",
      exam_pattern: "",
      mock_test: "",
      admit_card: "",
      preparation_tips: "",
      result: "",
      answer_key: "",
      exam_analysis: "",
      cutoff: [{ key: "", value: "" }],
      selection_process: "",
      question_paper: "",
      faq: "",
      application_deadline: "",
      syllabus: "",
      participating_institutes: "",
      image: null,
    },
  };

  let initialExamData = {};
  if (isEditMode) {
    initialExamData = examDataFromLocation?.exam_data || {};
  }

  const convertObjectToKeyValueArray = (obj) => {
    // Handle undefined, null, or non-object inputs
    if (!obj) {
      console.log("convertObjectToKeyValueArray: Input is null/undefined, returning default", obj);
      return [{ key: "", value: "" }];
    }

    // If obj is an array (expected backend format: [{"key1": "value1"}, ...])
    if (Array.isArray(obj)) {
      const result = obj.map(item => {
        if (item && typeof item === "object" && Object.keys(item).length > 0) {
          const [key, value] = Object.entries(item)[0] || ["", ""];
          return { key, value };
        }
        return { key: "", value: "" };
      });
      console.log("convertObjectToKeyValueArray: Processed array", result);
      return result;
    }

    // If obj is a plain object (e.g., {"key1": "value1", "key2": "value2"})
    if (typeof obj === "object" && !Array.isArray(obj)) {
      const result = Object.entries(obj).map(([key, value]) => ({ key, value }));
      console.log("convertObjectToKeyValueArray: Processed plain object", result);
      return result;
    }

    // Fallback for unexpected formats
    console.log("convertObjectToKeyValueArray: Unexpected format, returning default", obj);
    return [{ key: "", value: "" }];
  };

  const [formData, setFormData] = useState(isCreateMode ? emptyFormData : {
    exam_data: {
      exam_title: initialExamData.exam_title || "",
      exam_link: initialExamData.exam_link || "",
      about_exam: initialExamData.about_exam || "",
      exam_highlights: convertObjectToKeyValueArray(initialExamData.exam_highlights),
      eligibility_criteria: initialExamData.eligibility_criteria || "",
      application_process: initialExamData.application_process || "",
      documents_required: initialExamData.documents_required || "",
      exam_centers: initialExamData.exam_centers || "",
      exam_pattern: initialExamData.exam_pattern || "",
      mock_test: initialExamData.mock_test || "",
      admit_card: initialExamData.admit_card || "",
      preparation_tips: initialExamData.preparation_tips || "",
      result: initialExamData.result || "",
      answer_key: initialExamData.answer_key || "",
      exam_analysis: initialExamData.exam_analysis || "",
      cutoff: convertObjectToKeyValueArray(initialExamData.cutoff),
      selection_process: initialExamData.selection_process || "",
      question_paper: initialExamData.question_paper || "",
      faq: initialExamData.faq || "",
      application_deadline: initialExamData.application_deadline || "",
      syllabus: initialExamData.syllabus || "",
      participating_institutes: initialExamData.participating_institutes || "",
      image: initialExamData.image || null,
    },
  });

  // Reset form data when transitioning to create mode
  useEffect(() => {
    if (isCreateMode) {
      console.log("Create mode detected - resetting form data");
      setFormData(emptyFormData);
      
      // Reset form sections to initial state
      setFormSections({
        "Exam Basic Details": { status: "active", icon: <FaSuitcase /> },
        "Exam Requirements": { status: "unvisited", icon: <FaClipboardList /> },
        "Exam Content Details": { status: "unvisited", icon: <FaFileSignature /> },
        "Exam Additional Info": { status: "unvisited", icon: <FaRegFileAlt /> },
        "Summary": { status: "unvisited", icon: <FaRegFileAlt /> },
      });
    }
  }, [isCreateMode]);

  // Log the final formData to confirm initialization
  console.log("formData.exam_data after initialization:", formData.exam_data);
  console.log("formData.exam_data.exam_highlights:", formData.exam_data.exam_highlights);
  console.log("formData.exam_data.cutoff:", formData.exam_data.cutoff);
  

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const [formSections, setFormSections] = useState({
    "Exam Basic Details": { status: "active", icon: <FaSuitcase /> },
    "Exam Requirements": { status: "unvisited", icon: <FaClipboardList /> },
    "Exam Content Details": { status: "unvisited", icon: <FaFileSignature /> },
    "Exam Additional Info": { status: "unvisited", icon: <FaRegFileAlt /> },
    "Summary": { status: "unvisited", icon: <FaRegFileAlt /> },
  });

  const sectionKeys = Object.keys(formSections);
  const activeIndex = sectionKeys.findIndex((key) => formSections[key].status === "active");

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

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
        case "Exam Basic Details":
          if (!formData.exam_data.exam_title || !formData.exam_data.application_process) {
            toast.error("Please fill in all mandatory fields in Exam Basic Details.");
            isValid = false;
          }
          break;
        case "Exam Additional Info":
          if (!formData.exam_data.application_deadline) {
            toast.error("Please fill in all mandatory fields in Exam Additional Info.");
            isValid = false;
          }
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

  const validateKeyValuePairs = (items, label) => {
    for (const item of items) {
      if (item.key.trim() !== "" && item.value.trim() === "") {
        toast.error(`Please enter a value for the key "${item.key}" in ${label}.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);

    setTimeout(async () => {
      const examData = formData.exam_data;

      // Validate required fields
      if (!examData.exam_title || !examData.application_process || !examData.application_deadline) {
        toast.error("Please fill in all mandatory fields.");
        setLoading(false);
        return;
      }

      if (!validateKeyValuePairs(examData.exam_highlights, "Exam Highlights")) {
        setLoading(false);
        return;
      }
  
      if (!validateKeyValuePairs(examData.cutoff, "Cutoff")) {
        setLoading(false);
        return;
      }

      try {
        const token = Cookies.get("jwt");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        // Convert key-value array to array of single-key objects
        const convertKeyValueArrayToSingleKeyObjects = (array) =>
          array
            .filter((item) => item.key.trim() && item.value.trim()) // Filter out invalid pairs
            .map((item) => ({ [item.key.trim()]: item.value.trim() }));

        // Prepare exam_data with proper formatting
        const formatDeadline = (deadline) => {
          if (!deadline) return "NA";
          
          try {
            // If it's a string that can be parsed as a valid date
            if (typeof deadline === "string") {
              const parsedDate = new Date(deadline);
              if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString().split("T")[0];
              }
            }
            
            // If it's already a Date object
            if (deadline instanceof Date && !isNaN(deadline.getTime())) {
              return deadline.toISOString().split("T")[0];
            }
          } catch (err) {
            console.error("Error formatting deadline:", err);
          }
          
          return String(deadline) || "NA";
        };

        const formattedExamData = {
          exam_title: examData.exam_title || "NA",
          exam_link: examData.exam_link || "NA",
          about_exam: examData.about_exam || "NA",
          exam_highlights: convertKeyValueArrayToSingleKeyObjects(examData.exam_highlights),
          eligibility_criteria: examData.eligibility_criteria || "NA",
          application_process: examData.application_process || "NA",
          documents_required: examData.documents_required || "NA",
          exam_centers: examData.exam_centers || "NA",
          exam_pattern: examData.exam_pattern || "NA",
          mock_test: examData.mock_test || "NA",
          admit_card: examData.admit_card || "NA",
          preparation_tips: examData.preparation_tips || "NA",
          result: examData.result || "NA",
          answer_key: examData.answer_key || "NA",
          exam_analysis: examData.exam_analysis || "NA",
          cutoff: convertKeyValueArrayToSingleKeyObjects(examData.cutoff),
          selection_process: examData.selection_process || "NA",
          question_paper: examData.question_paper || "NA",
          faq: examData.faq || "NA",
          application_deadline: formatDeadline(examData.application_deadline),
          syllabus: examData.syllabus || "NA",
          participating_institutes: examData.participating_institutes || "NA",
          image: examData.image instanceof File ? null : examData.image || null,
        };
        const formDataToSend = new FormData();
        formDataToSend.append("exam_data", JSON.stringify(formattedExamData));
        formDataToSend.append("role", userRole);
        formDataToSend.append("userId", userId);
        if (examData.image instanceof File) {
          formDataToSend.append("image", examData.image);
        }

        const headers = { Authorization: `Bearer ${token}` };

        if (isEditMode) {
          const response = await fetch(`http://127.0.0.1:8000/api/exam-edit/${id || urlExamId}/`, {
            method: "POST",  // Change the method to POST
            headers,
            body: formDataToSend,
          });
          
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to update exam");
          }
          navigate("/exams");
        } else {
          const response = await axios.post("https://cce-backend-54k0.onrender.com/api/exam_post/", formDataToSend, { headers });
          setMessage(response.data.message);
          navigate("/exams");
        }
      } catch (error) {
        toast.error(`Error: ${error.response?.data?.error || error.message || "Something went wrong"}`);
      } finally {
        setIsSubmitting(false);
        setLoading(false);
      }
    }, 10000);
  };

  return (
    <motion.div className="flex bg-gray-100 min-h-screen">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <ToastContainer />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex-1 p-8 bg-white rounded-xl flex flex-col h-[80%]">
          <div className="flex justify-between items-center text-2xl pb-4 border-b border-gray-300">
            <p>{isEditMode ? "Edit Exam" : "Post an Exam"}</p>
            <button className="px-3 p-1.5 border rounded-lg text-sm" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
          {error && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded shadow">{error}</div>
          )}
          <div className="flex items-stretch">
            <div className="w-1/4 border-r border-gray-300 flex flex-col p-4">
              <div className="border-y border-r border-gray-300 flex flex-col rounded-lg">
                <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
                {Object.entries(formSections).map(([section, prop], key, array) => (
                  <div
                    key={section}
                    className={`border-l-6 flex items-center p-2 border-b border-gray-300
                      ${key === 0 ? "rounded-tl-lg" : ""}
                      ${key === array.length - 1 ? "rounded-bl-lg border-b-transparent" : ""}
                      ${prop.status === "active" ? "border-l-yellow-400" : prop.status === "completed" ? "border-l-[#00B69B]" : "border-l-gray-300"}`}
                  >
                    <p className="text-gray-900 p-2 inline-block">{prop.icon}</p>
                    <p>{section}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="px-3 p-1 border rounded text-sm cursor-pointer"
                  disabled={activeIndex === 0}
                  onClick={() => handleNavigation("prev")}
                >
                  Previous
                </button>
                {activeIndex === sectionKeys.length - 1 ? (
                  <button
                    className="rounded bg-green-500 text-sm px-5 p-1 cursor-pointer"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isEditMode ? "Update" : "Finish"}
                  </button>
                ) : (
                  <button
                    className="rounded bg-yellow-400 text-sm px-5 p-1 cursor-pointer"
                    disabled={activeIndex === sectionKeys.length - 1}
                    onClick={() => handleNavigation("next")}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 p-4 grid grid-cols-2 gap-4 items-stretch h-full">
              {formSections["Exam Basic Details"].status === "active" && <ExamBasicDetails formData={formData} setFormData={setFormData} />}
              {formSections["Exam Requirements"].status === "active" && <ExamRequirements formData={formData} setFormData={setFormData} />}
              {formSections["Exam Content Details"].status === "active" && <ExamContentDetails formData={formData} setFormData={setFormData} />}
              {formSections["Exam Additional Info"].status === "active" && <ExamAdditionalInfo formData={formData} setFormData={setFormData} />}
              {formSections["Summary"].status === "active" && <Summary formData={formData} setFormData={setFormData} />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}