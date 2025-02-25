import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AchievementPostForm() {
  const [formData, setFormData] = useState({
    name: "",
    achievement_description: "",
    achievement_type: "",
    company_name: "",
    date_of_achievement: "",
    batch: "",
    photo: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const decodedToken = jwtDecode(token);
    if (decodedToken.role !== "superadmin" && decodedToken.role !== "admin") {
      toast.error("You do not have permission to access this page.");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserRole(payload.role);
    if (payload.role === "admin") {
      setUserId(payload.admin_user);
    } else if (payload.role === "superadmin") {
      setUserId(payload.superadmin_user);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setFormData({ ...formData, photo: file });
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast.error("Only JPG and PNG images are allowed.");
        setFormData({ ...formData, photo: null });
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate date
    const selectedDate = new Date(formData.date_of_achievement);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    if (selectedDate > today) {
      toast.error("Date of achievement cannot be in the future.");
      setLoading(false);
      return;
    }

    // Validate batch field format
    const batchPattern = /^[0-9]{4} - [0-9]{4}$/;
    if (!batchPattern.test(formData.batch)) {
      toast.error("Batch should be in the format YYYY - YYYY. (e.g. 2020 - 2024)");
      setLoading(false);
      return;
    }

    // Check if all fields are filled
    if (
      !formData.name ||
      !formData.achievement_description ||
      !formData.achievement_type ||
      !formData.company_name ||
      !formData.date_of_achievement ||
      !formData.batch ||
      !formData.photo
    ) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("jwt");

      if (!token) {
        toast.error("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("achievement_description", formData.achievement_description);
      formDataObj.append("achievement_type", formData.achievement_type);
      formDataObj.append("company_name", formData.company_name);
      formDataObj.append("date_of_achievement", formData.date_of_achievement);
      formDataObj.append("batch", formData.batch);
      formDataObj.append("photo", formData.photo);
      formDataObj.append("userId", userId);
      formDataObj.append("role", userRole);

      const response = await axios.post(
        "https://cce-backend-54k0.onrender.com/api/upload_achievement/",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message, {
        autoClose: 2000,
        onClose: () => {
          if (userRole === "admin") {
            navigate("/admin/home");
          } else if (userRole === "superadmin") {
            navigate("/superadmin-dashboard");
          }
        },
      });

      setFormData({
        name: "",
        achievement_description: "",
        achievement_type: "",
        company_name: "",
        date_of_achievement: "",
        batch: "",
        photo: null,
      });
      setImagePreview(null);
      setLoading(false);
    } catch (err) {
      console.error("Error submitting achievement:", err);
      toast.error(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <div className="flex-1 p-6 max-w-6xl w-full mx-auto bg-white rounded-lg shadow-lg my-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Post an Achievement</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
        <hr className="border border-gray-300 mb-4" />

        <form onSubmit={handleSubmit} className="space-y-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full space-y-2">
              <label className="block text-sm font-semibold text-black">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full mb-3 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                placeholder="Enter the name here"
              />
            </div>

            <div className="w-full space-y-2">
              <label className="block text-sm font-semibold text-black">
                Company/Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                placeholder="Enter the company/organization name here"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full space-y-2">
              <label className="block text-sm font-semibold text-black">
                Achievement Type <span className="text-red-500">*</span>
              </label>
              <select
                name="achievement_type"
                value={formData.achievement_type}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 mb-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Select Achievement Type</option>
                <option value="Job Placement">Job Placement</option>
                <option value="Internship">Internship</option>
                <option value="Certification">Certification</option>
                <option value="Exam Cracked">Exam Cracked</option>
              </select>
            </div>

            <div className="w-full space-y-2">
              <label className="block text-sm font-semibold text-black">
                Date of Achievement <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_achievement"
                value={formData.date_of_achievement}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col md:flex-col md:items-center">
              <div className="w-full space-y-2">
                <label className="block text-sm font-semibold text-black">
                  Batch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder="Enter the batch here (e.g. 2020 - 2024)"
                />
              </div>

              <div className="border-dashed border-2 border-gray-400 rounded-xl pt-4 pb-2 px-2 text-center bg-white mt-4">
                <label
                  htmlFor="photo"
                  className="cursor-pointer text-blue-600 font-semibold text-xl hover:underline"
                >
                  {imagePreview ? "Change Image " : "Upload an Achievement Photo"}
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/jpeg, image/png"
                  onChange={handleImageChange}
                  className="mt-2"
                  required
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      className="max-h-30 mx-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <label className="block text-sm font-semibold text-black">
                Achievement Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="achievement_description"
                value={formData.achievement_description}
                onChange={handleChange}
                required
                className="w-full flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400 overflow-y-auto resize-none"
                rows="5"
                placeholder="Enter the achievement description here"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full md:w-1/3 bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Post Achievement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
