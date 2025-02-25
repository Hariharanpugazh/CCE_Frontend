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

const CategoryInput = ({ value, onChange, selectedType }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token && inputValue) {
      axios
        .get(
          `https://cce-backend-54k0.onrender.com/api/get-categories/?type=${selectedType}&query=${inputValue}`,
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
  }, [inputValue, selectedType]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const handleSelect = (category) => {
    setInputValue(category);
    onChange(category);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        placeholder="Type to search categories"
      />
      {suggestions.length > 0 && (
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
    setFormData((prevData) => ({
      ...prevData,
      links: newLinks,
    }));
  };

  const addLinkField = () => {
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

      const isValidLink = (link) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)(\/.+)?$/;
        const driveRegex = /^https:\/\/drive\.google\.com\/file\/d\/[-\w]+\/view\?usp=sharing$/;
        return youtubeRegex.test(link) || driveRegex.test(link);
      };

      for (const link of formData.links) {
        if (link.type === "YouTube" && !isValidLink(link.link)) {
          toast.error("Invalid YouTube link.");
          return;
        }
        if (link.type === "Drive" && !isValidLink(link.link)) {
          toast.error("Invalid Google Drive link.");
          return;
        }
      }

      const response = await axios.post(
        "https://cce-backend-54k0.onrender.com/api/post-study-material/",
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
        onClose: () => window.location.reload(),
      });

      setFormData({
        type: "Exam", // Reset to default "Exam"
        title: "",
        description: "",
        category: "",
        links: [{ type: "", link: "", topic: "", textContent: "" }],
      });
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

  const handleClose = () => {
    setFormData({
      type: "Exam",
      title: "",
      description: "",
      category: "",
      links: [{ type: "", link: "", topic: "", textContent: "" }],
    });
    navigate('/superadmin-dashboard'); // Navigate to the previous page
  };

  const typeIcons = {
    Exam: GoChecklist,
    Subject: RiBookLine,
    Topic: MdOutlineTopic,
  };

  return (
    <div className="flex items-stretch min-h-screen">
      <ToastContainer />
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <div className="flex-1 flex items-center p-4">
      <div className="flex-1 px-6 py-14   bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Post a Study Material</h2>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
        <hr className="border border-gray-300 mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Left Column - Type, Subject, Topic */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-4">
              {["Exam", "Subject", "Topic"].map((type) => (
                <div
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`relative border border-gray-300 rounded-lg p-4 bg-white shadow-sm cursor-pointer transition-colors ${selectedType === type ? "border-l-4 border-yellow-500" : "border-l-8 border-gray-500"
                    }`}
                >
                  <div
                    className={`absolute top-0 left-0 h-full w-1 bg-yellow-500 rounded-l-lg ${selectedType === type ? "opacity-100" : "opacity-0"
                      } transition-opacity`}
                  ></div>
                  <div className="flex items-center">
                    <div className={`mr-2 text-2xl  ${selectedType === type ? "text-black-500" : "text-gray-500"
                      }`}>
                      {React.createElement(typeIcons[type])}
                    </div>
                    <h3 className={`text-lg font-semibold  ${selectedType === type ? "text-black" : "text-gray-500"
                      }`}>{type}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Form Fields */}
            <div className="md:col-span-3 space-y-6 rounded-lg p-4 bg-white shadow-sm border border-gray-300">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex flex-col flex-1">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-black">Material Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full mb-3 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                      placeholder="Enter the material title here"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-black">Category</label>
                    <CategoryInput
                      value={formData.category}
                      onChange={(value) =>
                        setFormData((prevData) => ({ ...prevData, category: value }))
                      }
                      selectedType={formData.type || "Exam"} // Default to "Exam"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-semibold text-black">Material Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400  overflow-y-auto resize-none"
                    rows="4"
                    placeholder="Enter the material description here"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black">Source Link</label>
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4">
                    <select
                      name="type"
                      value={link.type}
                      onChange={(e) => handleLinkChange(index, e)}
                      required
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="">Select Link Type</option>
                      <option value="Drive">Drive</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Website">Website</option>
                      <option value="TextContent">Text Content</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      name="topic"
                      value={link.topic}
                      onChange={(e) => handleLinkChange(index, e)}
                      required
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Enter topic"
                    />
                    {link.type === "TextContent" ? (
                      <textarea
                        name="textContent"
                        value={link.textContent}
                        onChange={(e) => handleLinkChange(index, e)}
                        required
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter text content"
                      ></textarea>
                    ) : (
                      <input
                        type="text"
                        name="link"
                        value={link.link}
                        onChange={(e) => handleLinkChange(index, e)}
                        required
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter link"
                      />
                    )}
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
