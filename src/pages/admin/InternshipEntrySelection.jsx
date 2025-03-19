import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const InternshipEntrySelection = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [internshipData, setInternshipData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
    }
    sessionStorage.removeItem("internshipData"); // Clear session data on component mount
  }, []);

  const handleManualEntry = () => {
    sessionStorage.removeItem("internshipData"); // Ensure no conflicts when going back
    navigate("/internpost");
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setProgress(5);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload-internship-image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });
      if (response.data && response.data.data) {
        setProgress(100);
        setInternshipData(response.data.data);
        sessionStorage.setItem("internshipData", JSON.stringify(response.data.data));
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to process image. Try again.");
    } finally {
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
    setInternshipData(null);
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
  return (
    <div className="min-h-screen flex bg-gray-100">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex-1 flex justify-center items-center">
        <div className="border-gray-700 rounded-lg p-10 bg-white shadow-lg flex flex-col items-center space-y-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Select your internship uploading option
          </h1>
          <p className="text-center mb-4">
            Choose your Preferred method to add the internship Details
          </p>
          {/* Dropzone for file upload */}
          {!selectedFile && (
            <div
              {...getRootProps()}
              className={`w-full border-2 border rounded-lg p-6 text-center cursor-pointer transition-all ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
                }`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-700">
                Drag & Drop an Image here, or Click to select a File accepted formats: JPG, PNG
              </p>
              <br />
            <p className="text-gray-700">(Accepted formats: JPG, PNG)</p>
            </div>
          )}
          {/* Display uploaded file details */}
          {selectedFile && (
            <div className="w-full border-2 border-dashed rounded-lg p-6 text-center">
              <p className="text-gray-700 font-semibold">{selectedFile.name}</p>
              <button onClick={removeFile} className="text-red-500 mt-2 text-sm hover:underline">
                Remove File
              </button>
            </div>
          )}
          {/* Separator Line */}
          {!uploading && !selectedFile && (
            <p className="text-gray-600">────────────── OR ──────────────</p>
          )}
          {/* Manual Entry Button - Conditionally rendered */}
          {!uploading && !selectedFile && (
            <button
              onClick={handleManualEntry}
              className="w-full bg-yellow-500 text-black text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-all mt-4"
            >
              Manual Entry
            </button>
          )}
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {/* Conditional rendering for upload progress */}
          {uploading && (
            <div className="w-full max-w-md mt-8 flex flex-col items-center">
              <p className="text-lg text-gray-700 font-semibold mb-2">Processing Image...</p>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-yellow-700 h-full transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{progress}% Completed</p>
            </div>
          )}
          {/* Conditional rendering for internship data */}
          {progress === 100 && (
            <div className="text-green-600 text-lg font-semibold text-center mt-4">
              AI Processing Completed!
            </div>
          )}
          {/* Confirm & Proceed Button */}
          {internshipData && (
            <button
              onClick={() => navigate("/internpost")}
              className="w-full bg-yellow-500 text-black text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-all mt-4"
            >
              Confirm & Proceed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default InternshipEntrySelection;