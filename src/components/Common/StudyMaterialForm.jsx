import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function StudyMaterialForm() {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    category: "",
    links: [{ type: "", link: "" }],
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
      links: [...prevData.links, { type: "", link: "" }],
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
        setError("No token found. Please log in.");
        return;
      }

      // Basic validation for YouTube and Drive links
      const isValidLink = (link) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com(\/.*)?|youtu\.be(\/.*)?)$/;
        const driveRegex = /^https:\/\/(drive\.google\.com\/file\/d\/[-\w]+\/view\?usp=sharing|docs\.google\.com\/document\/d\/[-\w]+\/edit\?usp=drive_link)$/;
        return youtubeRegex.test(link) || driveRegex.test(link);
      };
      
      for (const link of formData.links) {
        if (link.type === "YouTube" && !isValidLink(link.link)) {
          setError("Invalid YouTube link.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
          return;
        }
        if (link.type === "Drive" && !isValidLink(link.link)) {
          setError("Invalid Google Drive link.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
          return;
        }
      }

      const response = await axios.post(
        "https://cce-backend-54k0.onrender.com/api/post-study-material/",
        { ...formData, category: isOtherCategory ? newCategory : formData.category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      setError("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
      setFormData({
        type: "",
        title: "",
        description: "",
        category: "",
        links: [{ type: "", link: "" }],
      });
      setSelectedType(null);
      setShowModal(true);
      setIsOtherCategory(false);
      setNewCategory("");

    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
    }
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token && selectedType) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
  
      // Fetch categories from backend based on selected material type
      axios.get(`https://cce-backend-54k0.onrender.com/api/get-categories/?type=${selectedType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setCategories(response.data.categories);
      }).catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
    }
  }, [selectedType]);
  

  const handleTypeSelect = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      type: type,
    }));
    setSelectedType(type);
    setShowModal(false);
    setShowToast(false); // Hide toast when selecting a new type
  };

  const options = [
    { type: "Exam", title: "Exam", description: "Select this for exam-related materials.", icon: "📚" },
    { type: "Subject", title: "Subject", description: "Select this for subject-related materials.", icon: "📓" },
    { type: "Topic", title: "Topic", description: "Select this for topic-specific materials.", icon: "📂" },
  ];

  const handleClose = () => {
    if (userRole === "admin") navigate("/admin-dashboard");
    if (userRole === "superadmin") navigate("/superadmin-dashboard");
  };

  return (
    <div className="flex justify-stretch">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      {showToast && (
        <div className={`fixed top-4 right-4 bg-${error ? 'red' : 'green'}-600 text-white p-4 rounded-lg shadow-lg transition-opacity ${showToast ? 'opacity-100' : 'opacity-0'}`}>
          {error ? error : message}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[9999]">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    onClick={handleClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold leading-6 text-gray-900">
                    Select Material Type
                  </h3>
                </div>

                <div className="mt-5 grid gap-4">
                  {options.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleTypeSelect(option.type)}
                      className="group relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="flex-shrink-0 text-2xl">{option.icon}</div>
                      <div className="min-w-0 flex-1 text-left">
                        <h3 className="font-medium text-gray-900">{option.title}</h3>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                      <span className="pointer-events-none absolute right-4 text-gray-300 group-hover:text-gray-400">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showModal && selectedType && (
        <div className="flex-1 px-6 py-14">
          <h2 className="text-3xl font-bold mb-4 text-center">Post Study Material</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
            </div>
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-semibold">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value === "Other") {
                    setIsOtherCategory(true);
                  } else {
                    setIsOtherCategory(false);
                  }
                }}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              {isOtherCategory && (
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Type the new category"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold">Source Links</label>
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <select
                    name="type"
                    value={link.type}
                    onChange={(e) => handleLinkChange(index, e)}
                    required
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Link Type</option>
                    <option value="Drive">Drive</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="link"
                    value={link.link}
                    onChange={(e) => handleLinkChange(index, e)}
                    required
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter link"
                  />
                  {formData.links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLinkField(index)}
                      className="text-red-600"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLinkField}
                className="text-blue-600 font-semibold"
              >
                + Add Link
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
            >
              Submit Study Material
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
