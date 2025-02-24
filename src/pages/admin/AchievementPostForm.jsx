import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const decodedToken = jwtDecode(token);
    if (decodedToken.role !== "superadmin" && decodedToken.role !== "admin") {
      setError("You do not have permission to access this page.");
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
        setError(""); // Clear any previous errors
      } else {
        setError("Only JPG and PNG images are allowed.");
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
      setError("Date of achievement cannot be in the future.");
      setLoading(false);
      return;
    }

    // Validate batch field for special characters
    const batchPattern = /^[a-zA-Z0-9\s]+$/;
    if (!batchPattern.test(formData.batch)) {
      setError("Batch should not contain special characters.");
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
      setError("All fields are required.");
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

      setMessage(response.data.message);
      setError("");
      setLoading(false);

      if (userRole === "admin") {
        navigate("/admin/home");
      } else if (userRole === "superadmin") {
        navigate("/superadmin-dashboard");
      }
    } catch (err) {
      console.error("Error submitting achievement:", err);
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Post an Achievement
      </h2>

      {error && (
        <p className="text-red-600 mb-6 text-center font-semibold">{error}</p>
      )}
      {message && (
        <p className="text-green-600 mb-6 text-center font-semibold">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievement Type
            </label>
            <select
              name="achievement_type"
              value={formData.achievement_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Achievement Type</option>
              <option value="Job Placement">Job Placement</option>
              <option value="Internship">Internship</option>
              <option value="Certification">Certification</option>
              <option value="Exam Cracked">Exam Cracked</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Achievement Description
          </label>
          <textarea
            name="achievement_description"
            value={formData.achievement_description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company/Organization Name
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Achievement
            </label>
            <input
              type="date"
              name="date_of_achievement"
              value={formData.date_of_achievement}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch
          </label>
          <input
            type="text"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="border-dashed border-2 border-gray-400 rounded-xl p-6 py-15 text-center bg-white">
          <label
            htmlFor="photo"
            className="cursor-pointer text-blue-600 font-semibold text-xl hover:underline"
          >
            {imagePreview ? "Change Image" : "Upload an Achievement Photo"}
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
                className="max-h-48 mx-auto rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Achievement"}
        </button>
      </form>
    </div>
  );
}
