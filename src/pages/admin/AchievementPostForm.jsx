import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function AchievementPostForm() {
  const [formData, setFormData] = useState({
    name: "",
    achievement_description: "",
    achievement_type: "",
    company_name: "",
    date_of_achievement: "",
    batch: "", // Added batch field
    photo: null, // Image file
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
      // Optionally, you can redirect the user to a different page
      // navigate("/unauthorized");
    }
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
      setFormData({ ...formData, photo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      formDataObj.append("batch", formData.batch); // Added batch field
      if (formData.photo) {
        formDataObj.append("photo", formData.photo);
      }
      formDataObj.append("userId",userId);
      formDataObj.append("role",userRole);

      

      // const response = await axios.post(
      //   "http://localhost:8000/api/upload_achievement/",
      //   formDataObj,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );


        const response = await axios.post(
        "http://localhost:8000/api/upload_achievement/",
        formDataObj,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

    

      setMessage(response.data.message);
      setError("");
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Post an Achievement</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Achievement Description */}
        <div>
          <label className="block font-medium">Achievement Description</label>
          <textarea
            name="achievement_description"
            value={formData.achievement_description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          ></textarea>
        </div>

        {/* Achievement Type */}
        <div>
          <label className="block font-medium">Achievement Type</label>
          <select
            name="achievement_type"
            value={formData.achievement_type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Achievement Type</option>
            <option value="Job Placement">Job Placement</option>
            <option value="Internship">Internship</option>
            <option value="Certification">Certification</option>
            <option value="Exam Cracked">Exam Cracked</option>
          </select>
        </div>

        {/* Company Name */}
        <div>
          <label className="block font-medium">Company/Organization Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Date of Achievement */}
        <div>
          <label className="block font-medium">Date of Achievement</label>
          <input
            type="date"
            name="date_of_achievement"
            value={formData.date_of_achievement}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Batch */}
        <div>
          <label className="block font-medium">Batch</label>
          <input
            type="text"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Drag & Drop Image Upload */}
        <div className="border-dashed border-2 border-gray-400 rounded-lg p-6 text-center">
          <label
            htmlFor="photo"
            className="cursor-pointer text-blue-600 font-semibold hover:underline"
          >
            {imagePreview ? "Change Image" : "Upload an Achievement Photo"}
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="max-h-40 mx-auto rounded-md shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Achievement"}
        </button>
      </form>
    </div>
  );
}
