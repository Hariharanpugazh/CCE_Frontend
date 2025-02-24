import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const JobEntrySelection = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [jobData, setJobData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
    }
    sessionStorage.removeItem("jobData"); // Clear session data on component mount
  }, []);

  const handleManualEntry = () => {
    sessionStorage.removeItem("jobData"); // Ensure no conflicts when going back
    navigate("/jobpost");
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setProgress(5);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("https://cce-backend-54k0.onrender.com/api/upload_job_image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      if (response.data && response.data.data) {
        setProgress(100);
        setJobData(response.data.data);
        sessionStorage.setItem("jobData", JSON.stringify(response.data.data));
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to process image. Try again.");
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type. Please upload an image.");
        return;
      }
      setError("");
      setSelectedFile(file);
      handleFileUpload(file);
    }
  }, []);

  const removeFile = () => {
    setSelectedFile(null);
    setJobData(null);
    setUploading(false);
    setProgress(0);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/bmp": [".bmp"],
      "image/webp": [".webp"],
    },
    multiple: false,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <div className="border-2 border-dashed border-gray-500 rounded-lg ml-20 p-10 bg-white shadow-lg flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-center">How do you want to enter job details?</h1>

      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        {/* Hide Manual Entry if uploading or AI processing is done */}
        {!uploading && !jobData && (
          <button
            onClick={handleManualEntry}
            className="w-full bg-[#111933] text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-[#111933] transition-all"
          >
            Manual Entry
          </button>
        )}

        {/* Button to Open Modal */}
        <button
          onClick={openModal}
          className="w-full bg-[#ffcc00] text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-[#ffcc00] transition-all"
        >
          Upload File
        </button>

        {/* Modal for File Upload */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload File</h2>
                <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                  &times;
                </button>
              </div>

              <div
                {...getRootProps()}
                className={`w-full border-2 ${
                  isDragActive ? "border-[#ffcc00] bg-[#fff3cd] shadow-md scale-105" : "border-gray-300"
                } border-dashed rounded-lg p-6 text-center cursor-pointer transition-all hover:border-[#ffcc00] hover:bg-[#fff3cd]`}
              >
                <input {...getInputProps()} />
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <p className="text-gray-700 font-semibold">{selectedFile.name}</p>
                    <button onClick={removeFile} className="text-red-500 mt-2 text-sm hover:underline">
                      Remove File
                    </button>
                  </div>
                ) : isDragActive ? (
                  <p className="text-[#ffcc00] font-semibold">Drop the file here...</p>
                ) : (
                  <p className="text-gray-700">Drag & drop an image here, or click to select a file</p>
                )}
              </div>

              {/* Progress Bar UI */}
              {uploading && (
                <div className="w-full max-w-md mt-8 flex flex-col items-center">
                  <p className="text-lg text-gray-700 font-semibold mb-2">Processing Image...</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-[#ffcc00] to-[#e6b800] h-full transition-all duration-500 ease-in-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{progress}% Completed</p>
                </div>
              )}

              {/* AI Processing Complete Message */}
              {progress === 100 && (
                <div className="text-green-600 text-lg font-semibold text-center mt-4">
                  AI Processing Complete!
                </div>
              )}

              {/* Confirm & Proceed Button (Only Show When Processing is Done) */}
              {jobData && (
                <button
                  onClick={() => navigate("/jobpost")}
                  className="w-full bg-[#ffcc00] text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-[#e6b800] transition-all"
                >
                  Confirm & Proceed
                </button>
              )}

              {/* Error Message */}
              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default JobEntrySelection;
