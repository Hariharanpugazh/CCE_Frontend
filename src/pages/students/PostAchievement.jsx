// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

// export default function StudentAchievementPostForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     achievement_type: "",
//     company_name: "",
//     achievement_description: "",
//     batch: "",
//     date_of_achievement: "",
//     file: null, // Certificate/file
//   });

//   const [filePreview, setFilePreview] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = Cookies.get("jwt");
//     if (!token) {
//       toast.error("No token found. Please log in.");
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode(token);
//       if (decodedToken.student_user) {
//         // Auto-fill name and email if available in the token
//         setFormData((prevData) => ({
//           ...prevData,
//           name: decodedToken.name || "",
//           email: decodedToken.email || "",
//         }));
//       } else {
//         toast.error("You do not have permission to access this page.");
//       }
//     } catch (err) {
//       toast.error("Invalid token.");
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, file: file });
//       setFilePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validation
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phonePattern = /^\d{10}$/;
//     const batchPattern = /^[a-zA-Z0-9\s]+$/;
//     const currentDate = new Date();
//     const selectedDate = new Date(formData.date_of_achievement);

//     if (!formData.name || !formData.email || !formData.phone_number || !formData.achievement_type || !formData.achievement_description || !formData.batch || !formData.date_of_achievement) {
//       toast.error("All fields are required.");
//       setLoading(false);
//       return;
//     }

//     if (!emailPattern.test(formData.email) || !formData.email.includes("@sns")) {
//       toast.error("Please enter a valid SNS domain email address.");
//       setLoading(false);
//       return;
//     }

//     if (!phonePattern.test(formData.phone_number)) {
//       toast.error("Phone number must be 10 digits.");
//       setLoading(false);
//       return;
//     }

//     if (!batchPattern.test(formData.batch)) {
//       toast.error("Batch should not contain special characters.");
//       setLoading(false);
//       return;
//     }

//     if (selectedDate > currentDate) {
//       toast.error("Date of achievement cannot be in the future.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = Cookies.get("jwt");

//       if (!token) {
//         toast.error("No token found. Please log in.");
//         setLoading(false);
//         return;
//       }

//       const formDataObj = new FormData();
//       formDataObj.append("name", formData.name);
//       formDataObj.append("email", formData.email);
//       formDataObj.append("phone_number", formData.phone_number);
//       formDataObj.append("achievement_type", formData.achievement_type);
//       formDataObj.append("company_name", formData.company_name);
//       formDataObj.append("achievement_description", formData.achievement_description);
//       formDataObj.append("date_of_achievement", formData.date_of_achievement);
//       formDataObj.append("batch", formData.batch);
//       if (formData.file) {
//         formDataObj.append("photo", formData.file);
//       }

//       const response = await axios.post(
//         "http://localhost:8000/api/studentachievement/",
//         formDataObj,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       toast.success(response.data.message);
//       setLoading(false);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Something went wrong");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-1xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <StudentPageNavbar />
//       <h2 className="text-3xl pt-2 font-bold mb-6 text-center">Submit Your Achievement</h2>

//       {message && <p className="text-green-600 mb-4">{message}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Name */}
//         <div>
//           <label className="block font-medium">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>

//         {/* Phone Number */}
//         <div>
//           <label className="block font-medium">Phone Number</label>
//           <input
//             type="tel"
//             name="phone_number"
//             value={formData.phone_number}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>

//         {/* Achievement Type */}
//         <div>
//           <label className="block font-medium">Achievement Type</label>
//           <select
//             name="achievement_type"
//             value={formData.achievement_type}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           >
//             <option value="">Select Achievement Type</option>
//             <option value="Job Placement">Job Placement</option>
//             <option value="Internship">Internship</option>
//             <option value="Certification">Certification</option>
//             <option value="Exam Cracked">Exam Cracked</option>
//           </select>
//         </div>

//         {/* Company Name */}
//         <div>
//           <label className="block font-medium">Company/Organization Name</label>
//           <input
//             type="text"
//             name="company_name"
//             value={formData.company_name}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         {/* Achievement Description */}
//         <div>
//           <label className="block font-medium">Achievement Description</label>
//           <textarea
//             name="achievement_description"
//             value={formData.achievement_description}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           ></textarea>
//         </div>

//         {/* Date of Achievement */}
//         <div>
//           <label className="block font-medium">Date of Achievement</label>
//           <input
//             type="date"
//             name="date_of_achievement"
//             value={formData.date_of_achievement}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Batch</label>
//           <textarea
//             name="batch"
//             value={formData.batch}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           ></textarea>
//         </div>

//         {/* File Upload */}
//         <div className="border-dashed border-2 border-gray-400 rounded-lg p-6 text-center">
//           <label
//             htmlFor="file"
//             className="cursor-pointer text-blue-600 font-semibold hover:underline"
//           >
//             {filePreview ? "Change File" : "Upload Certificate/File"}
//           </label>
//           <input
//             type="file"
//             id="file"
//             name="file"
//             accept=".pdf,image/*"
//             onChange={handleFileChange}
//             className="hidden"
//           />
//           {filePreview && (
//             <div className="mt-4">
//               <img
//                 src={filePreview}
//                 alt="Uploaded"
//                 className="max-h-40 mx-auto rounded-md shadow-lg"
//               />
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Submit Achievement"}
//         </button>
//       </form>

//       {/* Toast Container */}
//       <ToastContainer />
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

export default function StudentAchievementPostForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    achievement_type: "",
    company_name: "",
    achievement_description: "",
    batch: "",
    date_of_achievement: "",
    file: null, // Certificate/file
  });

  const [filePreview, setFilePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      toast.error("No token found. Please log in.");
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
        toast.error("You do not have permission to access this page.");
      }
    } catch (err) {
      toast.error("Invalid token.");
    }
  }, []); // Removed navigate from dependencies

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

    // Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const batchPattern = /^[a-zA-Z0-9\s]+$/;
    const currentDate = new Date();
    const selectedDate = new Date(formData.date_of_achievement);

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.achievement_type ||
      !formData.achievement_description ||
      !formData.batch ||
      !formData.date_of_achievement
    ) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (
      !emailPattern.test(formData.email) ||
      !formData.email.includes("@sns")
    ) {
      toast.error("Please enter a valid SNS domain email address.");
      setLoading(false);
      return;
    }

    if (!phonePattern.test(formData.phone_number)) {
      toast.error("Phone number must be 10 digits.");
      setLoading(false);
      return;
    }

    if (!batchPattern.test(formData.batch)) {
      toast.error("Batch should not contain special characters.");
      setLoading(false);
      return;
    }

    if (selectedDate > currentDate) {
      toast.error("Date of achievement cannot be in the future.");
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
      formDataObj.append("email", formData.email);
      formDataObj.append("phone_number", formData.phone_number);
      formDataObj.append("achievement_type", formData.achievement_type);
      formDataObj.append("company_name", formData.company_name);
      formDataObj.append(
        "achievement_description",
        formData.achievement_description
      );
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

      toast.success(response.data.message);
      setLoading(false);
      navigate(-1); //Added navigate here to redirect after successful submission.
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <StudentPageNavbar />

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm mt-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Post an Achievement
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter the job title here"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              {/* Company/Organization Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Enter the job title here"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              {/* Achievement Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Achievement type
                </label>
                <select
                  name="achievement_type"
                  value={formData.achievement_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                >
                  <option value="">Enter the job level here</option>
                  <option value="Job Placement">Job Placement</option>
                  <option value="Internship">Internship</option>
                  <option value="Certification">Certification</option>
                  <option value="Exam Cracked">Exam Cracked</option>
                </select>
              </div>

              {/* Date of Achievement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Achievement
                </label>
                <input
                  type="date"
                  name="date_of_achievement"
                  value={formData.date_of_achievement}
                  onChange={handleChange}
                  placeholder="Enter the industry type here"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              {/* Batch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch
                </label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="Enter the industry type here"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>
            </div>

            {/* Achievement Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achievement Description
              </label>
              <textarea
                name="achievement_description"
                value={formData.achievement_description}
                onChange={handleChange}
                placeholder="Enter the job description here"
                rows={4}
                className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                required
              ></textarea>
            </div>

            {/* File Upload */}
            <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
              <label
                htmlFor="file"
                className="cursor-pointer text-gray-500 font-medium"
              >
                {filePreview
                  ? "Change file"
                  : "Upload an achievement's or an achiever's photo"}
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
                    src={filePreview || "/placeholder.svg"}
                    alt="Uploaded"
                    className="max-h-40 mx-auto rounded-md shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Achievement"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
