import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const InternPostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    duration: '',
    stipend: '',
    application_deadline: null,
    skills_required: [],
    job_description: '',
    company_website: '',
    internship_type: '',
    job_link: '',
    education_requirements: '' // Added optional field
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const internshipTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Volunteer',
  ];


  useEffect(() => {
    const token = Cookies.get('jwt');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      setError('Token has expired. Please log in again.');
      return;
    }

    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      setError('You do not have permission to access this page.');
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      internship_type: type,
    });
    setIsTypeOpen(false);
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      application_deadline: date,
    });
  };

  const handleSkillsChange = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const skill = e.target.value.trim();
      if (skill && !formData.skills_required.includes(skill)) {
        setFormData({
          ...formData,
          skills_required: [...formData.skills_required, skill],
        });
        e.target.value = '';
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills_required: formData.skills_required.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const token = Cookies.get('jwt');
      if (!token) {
        setError('No token found. Please log in.');
        setIsSubmitting(false);
        return;
      }

      // Format the application_deadline to YYYY-MM-DD
      const formattedData = {
        ...formData,
        application_deadline: formData.application_deadline.toISOString().split('T')[0],
      };

      const response = await axios.post(
        'http://localhost:8000/api/post-internship/',
        {...formattedData, userId , role : userRole },
        // {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`,
        //   },
        //   withCredentials: true,
        // }
      );
      setMessage(response.data.message);
      setError('');
      window.location.href = `${window.location.origin}/internships`;
    } catch (error) {
      setError(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

    // Fetch user role from JWT token in cookies
    useEffect(() => {
      const token = Cookies.get("jwt");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        setUserRole(payload.role); // Assuming the payload has a 'role' field
      }
    }, []);

  return (
    <motion.div
      className="max-w mx-auto p-8 bg-white shadow-xl rounded-2xl relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Render appropriate navbar based on user role */}
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <h2 className="text-3xl pt-4 font-bold mb-4 text-gray-800 text-center">Post an Internship</h2>

      {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 pr-4 pl-4 gap-6">
        {Object.keys(formData).map((field) => {
          if (field !== 'application_deadline' && field !== 'skills_required' && field !== 'internship_type') {
            return (
              <div key={field} className="col-span-1">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  {field.replace(/_/g, ' ')} {field !== 'job_link' && field !== 'education_requirements' && <span className="text-red-600">*</span>}
                </label>
                <motion.input
                  type={field.includes('email') ? 'email' : field.includes('phone') ? 'tel' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field !== 'job_link' && field !== 'education_requirements'}
                  whileHover={{ backgroundColor: '#e0f2ff' }}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                  placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                />
              </div>
            );
          }
          return null;
        })}

        <div className="col-span-1">
          <label className="block text-sm font-semibold mb-2 capitalize">
            Skills Required <span className="text-red-600">*</span>
          </label>
          <motion.input
            type="text"
            name="skills_required"
            onKeyDown={handleSkillsChange}
            whileHover={{ backgroundColor: '#e0f2ff' }}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
            placeholder="Enter required skills and press Enter"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.skills_required.map((skill, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-2">
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 relative">
          <label className="block text-sm font-semibold mb-2 capitalize">
            Internship Type <span className="text-red-600">*</span>
          </label>
          <motion.div
            className="cursor-pointer w-full border border-gray-300 p-2.5 rounded-lg flex justify-between items-center transition-all duration-300"
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            whileHover={{
              backgroundColor: '#D1E7FF',
              borderColor: '#3B82F6',
            }}
            style={{
              borderColor: isTypeOpen ? '#3B82F6' : '#D1D5DB',
              backgroundColor: isTypeOpen ? '#D1E7FF' : 'white',
            }}
          >
            <span className="text-sm text-gray-700">
              {formData.internship_type || 'Select Internship Type'}
            </span>
            <motion.span
              whileHover={{
                scale: 1.2,
              }}
              className="text-sm text-gray-700"
            >
              {isTypeOpen ? '▲' : '▼'}
            </motion.span>
          </motion.div>

          {isTypeOpen && (
            <div className="absolute z-10 mt-2 space-y-2 p-3 border border-gray-300 rounded-lg w-full bg-white shadow-lg">
              {internshipTypes.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="internship_type"
                    value={type}
                    checked={formData.internship_type === type}
                    onChange={() => handleTypeChange(type)}
                    className="mr-2"
                  />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-semibold mb-2 capitalize">
            Application Deadline <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <DatePicker
              selected={formData.application_deadline}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow pl-10"
              placeholderText="Select a date"
            />
            <FaCalendarAlt
              onClick={(e) => {
                e.target.previousSibling.focus();
              }}
              className="absolute left-3 top-3 text-gray-500 cursor-pointer"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="col-span-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-transform shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? 'Submitting...' : 'Post Internship'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default InternPostForm;
