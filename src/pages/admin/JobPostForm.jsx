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

const JobPostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    company_overview: '',
    company_website: '',
    job_description: '',
    key_responsibilities: '',
    required_skills: '',
    education_requirements: '',
    experience_level: '',
    salary_range: '',
    benefits: '',
    job_location: '',
    work_type: '',
    work_schedule: '',
    application_instructions: '',
    application_deadline: null,
    contact_email: '',
    contact_phone: '',
    job_link: '',
    selectedCategory: '',
    selectedWorkType: '',
    image: null,
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

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
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
      if (payload.role === "admin") {
        setUserId(payload.admin_user);
      } else if (payload.role === "superadmin") {
        setUserId(payload.superadmin_user);
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

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      application_deadline: date,
    });
    validateDeadline(date);
  };

  const validateDeadline = (date) => {
    const currentDate = new Date();
    if (date < currentDate) {
      setDeadlineError('Application deadline must be a future date.');
      return false;
    } else {
      setDeadlineError('');
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDeadline(formData.application_deadline)) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const token = Cookies.get('jwt');
      if (!token) {
        setError('No token found. Please log in.');
        setIsSubmitting(false);
        return;
      }

      const formattedData = new FormData();
      formattedData.append('data', JSON.stringify({
        ...formData,
        application_deadline: formData.application_deadline.toISOString().split('T')[0],
        userId,
        role: userRole,
      }));
      if (formData.image) {
        formattedData.append('image', formData.image);
      }

      const response = await axios.post(
        'https://cce-backend-54k0.onrender.com/api/job_post/',
        formattedData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMessage(response.data.message);
      setError('');
      window.location.href = `${window.location.origin}/jobs`;
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

  return (
    <motion.div
      className="max-w mx-auto p-8 bg-white shadow-xl rounded-2xl relative ml-0"
    >
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <h2 className="text-3xl pt-4 font-bold mb-4 text-gray-800 text-center">Post a Job</h2>

      {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 pr-4 pl-4 gap-6">
        {Object.keys(formData).map((field) => {
          if (field !== 'application_deadline' && field !== 'image') {
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
          {deadlineError && (
            <p className="text-red-600 text-sm mt-1">{deadlineError}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-semibold mb-2 capitalize">
            Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="col-span-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-transform shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? 'Submitting...' : 'Post Job'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default JobPostForm;
