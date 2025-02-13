import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function StudyMaterialForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    text_content: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/post-study-material/ ",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      setError("");
      setFormData({ title: "", description: "", category: "", text_content: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
    }
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
    }
  }, []);

  return (
    <motion.div
      className="max-w mx-auto bg-white shadow-xl rounded-2xl p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <h2 className="text-3xl font-bold pt-2 text-center mb-4">Post Study Material</h2>

      {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg focus:ring-2"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Text Content</label>
          <textarea
            name="text_content"
            value={formData.text_content}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg focus:ring-2"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold">Attach Your Drive Link</label>
          <textarea
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg focus:ring-2"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
        >
          Submit Study Material
        </button>
      </form>
    </motion.div>
  );
}
