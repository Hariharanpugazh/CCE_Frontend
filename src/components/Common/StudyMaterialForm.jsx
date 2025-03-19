import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoChecklist } from "react-icons/go"; // Exam icon
import { RiBookLine } from "react-icons/ri"; // Subject icon
import { MdOutlineTopic } from "react-icons/md"; // Topic icon

const typeIcons = {
  Exam: GoChecklist,
  Subject: RiBookLine,
  Topic: MdOutlineTopic,
};

const CategoryInput = ({ value, onChange, selectedType, onSelect }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token && inputValue && !isSuggestionSelected) {
      axios
        .get(
          `http://localhost:8000/api/get-categories/?type=${selectedType}&query=${inputValue}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setSuggestions(response.data.categories);
        })
        .catch((err) => {
          console.error("Failed to fetch categories:", err);
        });
    } else {
      setSuggestions([]);
    }
  }, [inputValue, selectedType, isSuggestionSelected]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    setIsSuggestionSelected(false); // Reset the flag when the input value changes
  };

  const handleSelect = (category) => {
    setInputValue(category);
    onChange(category);
    onSelect(true); // Mark category as valid when selected from suggestions
    setSuggestions([]); // Hide suggestions when a category is selected
    setIsSuggestionSelected(true); // Prevent suggestions from showing again until input changes
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
        placeholder="Type to search categories"
        maxLength={20}
      />
      {!isSuggestionSelected && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
          {suggestions.map((category, index) => (
            <li
              key={index}
              onClick={() => handleSelect(category)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black"
            >
              {category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const LinkTypeOptions = {
  Google: "Google",      // For website links
  YouTube: "YouTube",    // For YouTube videos
  Drive: "Drive",       // For Google Drive files
  TextContent: "TextContent", // For text/docs content
  Others: "Others"      // For other types of links
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const isValidLink = (link, type) => {
  if (!link) return false;
  if (type === "TextContent" || type === "Others") return true;
  
  try {
    const urlObj = new URL(link);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    switch (type) {
      case "YouTube": {
        // YouTube URL patterns
        const youtubePatterns = {
          'youtube.com': [
            '/watch',
            '/embed/',
            '/shorts/',
            '/playlist',
            '/live/'
          ],
          'youtu.be': ['']  // Short URLs
        };

        return Object.entries(youtubePatterns).some(([domain, paths]) => 
          hostname.includes(domain) && 
          (paths.length === 0 || paths.some(path => pathname.includes(path)))
        );
      }

      case "Drive": {
        // Google Workspace patterns
        const googlePatterns = {
          'drive.google.com': [
            '/file/d/',
            '/folders/',
            '/uc'
          ],
          'docs.google.com': ['/document/d/'],
          'sheets.google.com': ['/spreadsheets/d/'],
          'forms.google.com': ['/forms/d/'],
          'slides.google.com': ['/presentation/d/']
        };

        return Object.entries(googlePatterns).some(([domain, paths]) => 
          hostname.includes(domain) && 
          paths.some(path => pathname.includes(path))
        );
      }

      case "Google": {
        // Exclude Google Workspace domains
        const excludedDomains = [
          'youtube.com',
          'youtu.be',
          'drive.google.com',
          'docs.google.com',
          'sheets.google.com',
          'forms.google.com',
          'slides.google.com'
        ];

        return !excludedDomains.some(domain => hostname.includes(domain));
      }

      default:
        return false;
    }
  } catch (error) {
    return false;
  }
};

const handleFileUpload = async (index, file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const token = Cookies.get("jwt");
    const response = await axios.post(
      "http://localhost:8000/api/upload-drive-file/", // Backend endpoint for Drive upload
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const newLinks = [...formData.links];
    newLinks[index].link = response.data.driveLink; // Use the uploaded Drive link
    setFormData((prevData) => ({
      ...prevData,
      links: newLinks,
    }));

    toast.success("File uploaded successfully!");
  } catch (err) {
    toast.error("Failed to upload file.");
  }
};

export default function StudyMaterialForm() {
  const [formData, setFormData] = useState({
    type: "Exam", // Default to "Exam"
    title: "",
    description: "",
    category: "",
    links: [{ type: "", link: "", topic: "", textContent: "" }],
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("Exam");
  const [userRole, setUserRole] = useState(null);
  const [isCategoryValid, setIsCategoryValid] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData((prevData) => ({
      ...prevData,
      type: type,
    }));
  };

  const handleLinkChange = (index, e) => {
    const { name, value } = e.target;
    const newLinks = [...formData.links];
    newLinks[index][name] = value;

    // Validate URL when type and link are both present
    if (name === "link" && newLinks[index].type && value) {
      if (newLinks[index].type !== "TextContent" && !isValidLink(value, newLinks[index].type)) {
        toast.warning(`Please enter a valid ${newLinks[index].type} link. Ensure it matches the selected platform.`);
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      links: newLinks,
    }));
  };

  const addLinkField = () => {
    const lastLink = formData.links[formData.links.length - 1];
    
    if (lastLink.type && lastLink.link) {
      if (lastLink.type !== "TextContent" && !isValidLink(lastLink.link, lastLink.type)) {
        toast.error(`Please fix the invalid ${lastLink.type} link before adding a new one`);
        return;
      }
    }
  
    setFormData((prevData) => ({
      ...prevData,
      links: [...prevData.links, { type: "", link: "", topic: "", textContent: "" }],
    }));
  };

  const removeLinkField = (index) => {
    const newLinks = [...formData.links];
    newLinks.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      links: newLinks,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      // Check if the category is valid or if it's a new category
      if (!isCategoryValid) {
        const confirmNewCategory = window.confirm("The category is not in the suggestions. Do you want to add it as a new category?");
        if (!confirmNewCategory) {
          toast.error("Please select a category from the suggestions or confirm adding a new category.");
          return;
        }
      }

      // Validate all links before submission
      for (const link of formData.links) {
        if (!link.type || !link.topic) {
          toast.error("Please fill in all required fields");
          return;
        }
        
        if (link.type !== LinkTypeOptions.TextContent && !isValidLink(link.link, link.type)) {
          toast.error(`Invalid ${link.type} link format. Please check the URL format.`);
          return;
        }
      }

      const response = await axios.post(
        "http://localhost:8000/api/post-study-material/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message, {
        autoClose: 2000,
      });

      // After successful submission, redirect to the study material page
      setTimeout(() => {
        navigate('/study-material');
      }, 2000);

    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
    }
  }, []);

  const options = [
    { type: "exam", title: "Exam", description: "Select this for exam-related materials.", icon: "📚" },
    { type: "Subject", title: "Subject", description: "Select this for subject-related materials.", icon: "📓" },
    { type: "topic", title: "Topic", description: "Select this for topic-specific materials.", icon: "📂" },
  ];

  const handleClose = () => {
    setSelectedType(null);
    setFormData({
      type: "",
      title: "",
      description: "",
      category: "",
      links: [{ type: "", link: "", topic: "" }],
    });
    navigate(-1); 
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <ToastContainer />
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-1 p-6">
            <h2 className="text-2xl font-bold text-black">Post a Study Material</h2>
            <button
              onClick={handleClose}
              className="px-4 py-2 border-1 bg-gray-200/50 text-black rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
          <hr className="border border-gray-300" />

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Left Column - Type, Subject, Topic */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 h-fit ">
                {["Exam", "Subject", "Topic"].map((type) => (
                  <div
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className={`relative border p-4 bg-white shadow-sm cursor-pointer transition-colors${
                      selectedType === type
                      ? "border-l border-yellow-500 "
                      : "border-l-8 border-gray-300"
                    } ${
                      type === "Exam"
                        ? "rounded-tl-lg rounded-tr-lg "
                        : type === "Topic"
                          ? "rounded-br-lg rounded-bl-lg"
                          : ""
                      }`}
                  >
                    <div
                      className={`absolute top-0 left-0 h-full ${
                        selectedType === type
                        ? "w-1 bg-yellow-500 opacity-100"
                        : "w-1 bg-gray-500 opacity-100"
                      }${
                        type === "Exam"
                          ? "rounded-tl-lg rounded-tr-lg "
                          : type === "Topic"
                            ? "rounded-br-lg rounded-bl-lg"
                            : ""
                        } transition-opacity`}
                    ></div>
                    <div className="flex items-center">
                      <div className="mr-2 text-2xl text-gray-500">
                        {React.createElement(typeIcons[type])}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-500">{type}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column - Form Fields */}
              <div className="md:col-span-3 space-y-6 p-4 bg-white shadow-sm border border-gray-300 rounded-lg">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex flex-col flex-1">
                    <div className="w-full">
                      <label className="block text-sm font-semibold text-black mb-2">Material Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={50}
                        className="w-full mb-4 border border-gray-300 px-4 py-4 rounded-lg focus:ring-1 outline-none focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                        placeholder="Enter the material title here"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-semibold text-black mb-2">Category <span className="text-red-500">*</span></label>
                      <CategoryInput
                        value={formData.category}
                        onChange={(value) => setFormData((prevData) => ({ ...prevData, category: value }))}
                        selectedType={formData.type || "Exam"} // Default to "Exam"
                        onSelect={setIsCategoryValid} // Pass the setter for category validity
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-semibold text-black mb-2">Material Description <span className="text-red-500">*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      maxLength="200"
                      className="w-full border border-gray-300 px-4 py-5.5 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400 overflow-y-auto resize-none outline-none"
                      rows="4"
                      placeholder="Enter the material description here (max 200 characters)"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Source Link <span className="text-red-500">*</span></label>
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <select
                        name="type"
                        value={link.type}
                        onChange={(e) => handleLinkChange(index, e)}
                        required
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="">Select Link Type</option>
                        <option value="Google">Website Link</option>
                        <option value="YouTube">YouTube Video</option>
                        <option value="Drive">Google Drive</option>
                        <option value="TextContent">Text Content</option>
                        <option value="Others">Others</option>
                      </select>
                      <input
                        type="text"
                        name="topic"
                        value={link.topic}
                        onChange={(e) => handleLinkChange(index, e)}
                        required
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter topic"
                        maxLength={100}
                      />
                      <input
                        type="text"
                        name="link"
                        value={link.link}
                        onChange={(e) => handleLinkChange(index, e)}
                        required
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter link"
                      />
                      {formData.links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLinkField(index)}
                          className="text-red-600"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLinkField}
                    className="text-yellow-600 font-semibold hover:text-yellow-700"
                  >
                    + Add Link
                  </button>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    type="submit"
                    className="w-full md:w-1/3 bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Post Study Material
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
