"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import axios from "axios";
import Cookies from "js-cookie";
import { School, UserCircle, Clock, Mail, Award } from "lucide-react";

const SuperAdminProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const fetchSuperAdminProfile = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).superadmin_user;
        const response = await axios.get(
          `http://localhost:8000/api/get-superadmin/${userId}/`
        );
        const superAdminData = response.data.data;

        setSuperAdmin(superAdminData);
        setEditedName(superAdminData.name);
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
        name: editedName,
      };

      await axios.put(
        `http://localhost:8000/api/update-superadmin/${userId}/`,
        updatedData
      );

      setEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "NA";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const isActive = superAdmin?.status === "active";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-4 px-4 md:ml-40">
      {/* Profile Card */}
      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-lg flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-white">
          <h1 className="text-lg font-bold">Super Admin Profile</h1>
        </div>

        {/* Profile Avatar and Name */}
        <div className="flex flex-col items-center py-6 px-4 relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl text-gray-600 font-medium mb-3 shadow-md border-4 border-white">
            {superAdmin?.name?.charAt(0).toUpperCase() || "N"}
          </div>

          {editMode ? (
            <div className="relative w-full max-w-[200px] mb-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-lg font-semibold text-center w-full border-b-2 border-yellow-400 focus:outline-none py-1 bg-transparent"
                autoFocus
              />
            </div>
          ) : (
            <h2 className="text-lg font-semibold mb-2">
              {superAdmin?.name || "NA"}
            </h2>
          )}

          <div
            className={`px-3 py-1  ${
              isActive ? "" : ""
            }  `}
          >
            {isActive ? "" : ""}
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-6 space-y-4 flex-1 pb-4">
          {/* About Section */}
          <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-semibold mb-2 text-gray-800 flex items-center">
              <span className="bg-yellow-100 p-1 rounded-md mr-2">
                <UserCircle className="w-4 h-4 text-yellow-600" />
              </span>
              About
            </h3>
            <div className="space-y-2 text-sm pl-2">
              <div className="flex items-center">
                <div className="flex items-center min-w-[120px] text-gray-600">
                  <School className="w-4 h-4 mr-2 text-gray-500" />
                  <span>College Name</span>
                </div>
                <span className="font-medium text-gray-800">
                  : {superAdmin?.college_name || "NA"}
                </span>
              </div>

              <div className="flex items-center">
                <div className="flex items-center min-w-[120px] text-gray-600">
                  <Award className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Role</span>
                </div>
                <span className="font-medium text-gray-800">
                  : {superAdmin?.role || "Super Admin"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-semibold mb-2 text-gray-800 flex items-center">
              <span className="bg-yellow-100 p-1 rounded-md mr-2">
                <UserCircle className="w-4 h-4 text-yellow-600" />
              </span>
              Account Details
            </h3>
            <div className="space-y-2 text-sm pl-2">
              <div className="flex items-center">
                <div className="flex items-center min-w-[120px] text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Created on</span>
                </div>
                <span className="font-medium text-gray-800">
                  :{" "}
                  {superAdmin?.created_at
                    ? formatDate(superAdmin.created_at)
                    : "NA"}
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center min-w-[120px] text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Last Login</span>
                </div>
                <span className="font-medium text-gray-800">
                  :{" "}
                  {superAdmin?.last_login
                    ? formatDate(superAdmin.last_login)
                    : "NA"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-semibold mb-2 text-gray-800 flex items-center">
              <span className="bg-yellow-100 p-1 rounded-md mr-2">
                <Mail className="w-4 h-4 text-yellow-600" />
              </span>
              Contact
            </h3>
            <div className="space-y-2 text-sm pl-2">
              <div className="flex items-start">
                <div className="flex items-center min-w-[120px] text-gray-600 mt-0.5">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span>E-mail</span>
                </div>
                <span className="font-medium text-gray-800 break-all">
                  : {superAdmin?.email || "NA"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Button */}
        <div className="p-4 flex justify-center bg-gray-50 border-t border-gray-100">
          <Button
            className="w-[160px] bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-md justify-center shadow-sm transition-all duration-200 hover:shadow"
            onClick={() => {
              if (editMode) {
                handleSaveChanges();
              } else {
                setEditMode(true);
              }
            }}
          >
            {editMode ? "Save Changes" : "Edit Info"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminProfile;