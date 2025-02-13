import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

export default function StudentAchievementPostForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    achievement_type: "",
    company_name: "",
    achievement_description: "",
    batch:"",
    date_of_achievement: "",
    file: null, // Certificate/file
  });

  const [filePreview, setFilePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.student_user) {
        // Auto-fill name and email if available in the token
        setFormData((prevData) => ({
          ...prevData,
          name: decodedToken.name || "",
          email: decodedToken.email || "",
        }));
      } else {
        setError("You do not have permission to access this page.");
        // Optionally, you can redirect the user to a different page
        // navigate("/unauthorized");
      }
    } catch (err) {
      setError("Invalid token.");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file });
      setFilePreview(URL.createObjectURL(file));
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
      formDataObj.append("email", formData.email);
      formDataObj.append("phone_number", formData.phone_number);
      formDataObj.append("achievement_type", formData.achievement_type);
      formDataObj.append("company_name", formData.company_name);
      formDataObj.append("achievement_description", formData.achievement_description);
      formDataObj.append("date_of_achievement", formData.date_of_achievement);
      formDataObj.append("batch", formData.batch);
      if (formData.file) {
        formDataObj.append("photo", formData.file);
      }

      const response = await axios.post(
        "http://localhost:8000/api/studentachievement/",
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
    <div className="max-w-1xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <StudentPageNavbar />
      <h2 className="text-3xl pt-2 font-bold mb-6 text-center">Submit Your Achievement</h2>

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

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
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

        <div>
          <label className="block font-medium">Batch</label>
          <textarea
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="border-dashed border-2 border-gray-400 rounded-lg p-6 text-center">
          <label
            htmlFor="file"
            className="cursor-pointer text-blue-600 font-semibold hover:underline"
          >
            {filePreview ? "Change File" : "Upload Certificate/File"}
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {filePreview && (
            <div className="mt-4">
              <img
                src={filePreview}
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
