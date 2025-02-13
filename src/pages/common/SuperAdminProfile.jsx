import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from "../../components/ui/Card";
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import axios from 'axios';
import Cookies from 'js-cookie';

const SuperAdminProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState("default.png"); // Default Image
  const [superAdmin, setSuperAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedName, setEditedName] = useState(""); // Editable name field

  // List of predefined images
  const availableImages = ["boy-1.png", "boy-2.png", "boy-3.png", "boy-4.png", "boy-5.png", "boy-6.png", "Girl-1.png", "Girl-2.png", "Girl-3.png", "Girl-4.png", "Girl-5.png",];

  useEffect(() => {
    const fetchSuperAdminProfile = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).superadmin_user;
        const response = await axios.get(`http://localhost:8000/api/get-superadmin/${userId}/`);
        const superAdminData = response.data.data;

        setSuperAdmin(superAdminData);
        setEditedName(superAdminData.name); // Set editable name field
        if (superAdminData.profile_image) {
          setSelectedImage(superAdminData.profile_image);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching super admin profile:", err);
        setError("Failed to load super admin profile.");
        setLoading(false);
      }
    };

    fetchSuperAdminProfile();
  }, [editMode]);

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).superadmin_user;

      const updatedData = {
        name: editedName, // Save the edited name
        profile_image: selectedImage, // Send image filename only
      };

      await axios.put(`http://localhost:8000/api/update-superadmin/${userId}/`, updatedData);
      
      setEditMode(false);
      alert("Profile updated successfully!");
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
          <div className="p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center rounded-t-3xl">
            <div className="flex flex-col items-center relative">
              <img
                src={`../../src/assets/animoji/${selectedImage}`} // Corrected image path
                alt="Super Admin Profile"
                className="w-32 h-32 rounded-full border-4 border-white mb-4 shadow-lg"
              />
              {editMode && (
                <select 
                  value={selectedImage} 
                  onChange={(e) => setSelectedImage(e.target.value)}
                  className="mt-3 p-2 rounded-lg text-gray-800 bg-white"
                >
                  {availableImages.map((img, index) => (
                    <option key={index} value={img}>
                      {img}
                    </option>
                  ))}
                </select>
              )}

              {/* Editable Name Field */}
              {editMode ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mt-2 p-2 text-black bg-white rounded-lg border border-gray-300"
                />
              ) : (
                <h1 className="text-3xl font-bold tracking-wide">{superAdmin.name}</h1>
              )}
            </div>
          </div>

          <CardContent className="p-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h2 className="font-semibold text-xl mb-4">Super Admin Information</h2>
              <ul className="space-y-2 text-gray-800">
                <li><strong>Email:</strong> {superAdmin.email}</li>
                <li><strong>Status:</strong> {superAdmin.status}</li>
                <li><strong>College Name:</strong> {superAdmin.college_name}</li>
                <li><strong>Department:</strong> {superAdmin.department}</li>
                <li><strong>Role:</strong> {superAdmin.role}</li>
                <li><strong>Created At:</strong> {superAdmin.created_at}</li>
                <li><strong>Last Login:</strong> {superAdmin.last_login}</li>
              </ul>
            </div>
          </CardContent>

          <div className="p-6 bg-gray-100 text-center rounded-b-3xl">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md mr-4"
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

export default SuperAdminProfile;
