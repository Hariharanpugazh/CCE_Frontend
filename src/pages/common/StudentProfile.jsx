import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from "../../components/ui/Card";
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge'; // Adjust path if needed
import axios from 'axios';
import Cookies from 'js-cookie';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [student, setStudent] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedName, setEditedName] = useState(""); // Editable name field

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(`https://cce-backend-54k0.onrender.com/api/profile/${userId}/`);
        const studentData = response.data.data;

        setStudent(studentData);
        setEditedName(studentData.name); // Set editable name field
        // Fetch details for each saved job
        const jobDetailsPromises = studentData.saved_jobs.map(jobId =>
          axios.get(`https://cce-backend-54k0.onrender.com/api/job/${jobId}/`)
        );

        const jobDetails = await Promise.all(jobDetailsPromises);
        const jobTitles = jobDetails.map(job => job.data.job.job_data.title);
        setSavedJobs(jobTitles);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setError("Failed to load student profile.");
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [editMode]); // Ensure the latest data is fetched when the profile is edited

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;

      const updatedData = {
        name: editedName, // Save the edited name
      };

      await axios.put(`https://cce-backend-54k0.onrender.com/api/update-profile/${userId}/`, updatedData);
      
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="flex items-center justify-center p-6">
        <motion.div
          className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="p-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-center rounded-t-3xl">
            <div className="flex flex-col items-center relative">
            <div className="w-32 h-32 rounded-full border-4 border-white mb-4 shadow-lg flex items-center justify-center bg-white text-7xl font-bold text-yellow-500">
            {student.name.charAt(0).toUpperCase()}
              </div>

              {/* Editable Name Field */}
              {editMode ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mt-2 p-2 text-black bg-white rounded-lg border border-gray-300"
                />
              ) : (
                <h1 className="text-3xl font-bold tracking-wide">{student.name}</h1>
              )}
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="font-semibold text-xl mb-4">Student Information</h2>
                <ul className="space-y-2 text-gray-800">
                  <li><strong className="font-medium">Department:</strong> {student.department}</li>
                  <li><strong className="font-medium">Year:</strong> {student.year}</li>
                  <li><strong className="font-medium">Email:</strong> {student.email}</li>
                  <li><strong className="font-medium">Last Login:</strong> {new Date(student.last_login).toLocaleString()}</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="font-semibold text-xl mb-4">Saved Jobs</h2>
                <ul className="space-y-3">
                  {savedJobs.map((jobTitle, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Badge className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Job</Badge>
                      <span className="text-gray-800 font-medium">{jobTitle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>

          <div className="p-6 bg-gray-100 text-center rounded-b-3xl">
            <Button
              className="bg-yellow-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md mr-4"
              onClick={() => {
                if (editMode) {
                  handleSaveChanges();
                }
                setEditMode(!editMode);
              }}
            >
              {editMode ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;
