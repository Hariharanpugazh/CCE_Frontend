import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUpload, FaDownload, FaExclamationTriangle } from 'react-icons/fa';

const StudentRegister = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState('');
  const [uploadResults, setUploadResults] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cce-backend.onrender.com';

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setFileUploadError('');
    setUploadResults(null);
    setError('');
    setSuccess('');

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setFileUploadError(`File type not supported: ${fileExtension}. Please upload a CSV or Excel file.`);
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bulk-student-signup/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResults(response.data);

      if (response.data.success_count > 0) {
        setSuccess(`Successfully registered ${response.data.success_count} students.`);
      }

      if (response.data.error_count > 0) {
        setFileUploadError(`${response.data.error_count} students failed to register.`);
      }

    } catch (error) {
      console.error('File upload error:', error);

      if (error.response && error.response.status === 400) {
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          setUploadResults(error.response.data);
          setFileUploadError(`Failed to register ${error.response.data.error_count} students.`);
        } else if (error.response.data.error) {
          setFileUploadError(error.response.data.error);
        } else {
          setFileUploadError('Error in file upload. Please check your file format.');
        }
      } else if (error.response && error.response.data && error.response.data.error) {
        setFileUploadError(error.response.data.error);
      } else if (error.message) {
        setFileUploadError(`Upload error: ${error.message}`);
      } else {
        setFileUploadError('Something went wrong during file upload.');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const csvData = `name,email,password,departmer,college_na,regno,year,mobileNumber
John Doe,john@sns.,StrongPass,CSE,SNS Colleg,21001,II,9876543210
Jane Smith,jane@sns.,SecurePas:,ECE,SNS Colleg,21002,I,9876543211
Bob Willia,bob@sns.,MyPass78!,MECH,SNS Colleg,21003,IV,9876543212`;

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'student_registration_template.csv';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Bulk Student Registration</h1>

        {error && (
          <div className="mb-4 text-red-600 text-center p-3 bg-red-50 rounded-md border border-red-200 flex items-center justify-center">
            <FaExclamationTriangle className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 text-green-600 text-center p-3 bg-green-50 rounded-md border border-green-200">
            {success}
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Upload a CSV or Excel file with student details.
          <button
            onClick={downloadTemplate}
            className="ml-2 text-yellow-600 hover:text-yellow-700 inline-flex items-center"
          >
            <FaDownload className="mr-1" /> Download Template
          </button>
        </p>

        {fileUploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            <div className="flex items-center mb-1">
              <FaExclamationTriangle className="mr-2" />
              <strong>Error:</strong>
            </div>
            <div>{fileUploadError}</div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center bg-gray-50 py-5 rounded-lg border-2 border-dashed border-gray-300 mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv, .xlsx, .xls"
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <FaUpload className="text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload file</p>
              <p className="text-xs text-gray-400">(CSV or Excel)</p>
            </div>
          </label>
          {isUploading && (
            <div className="mt-3 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-600 mr-2"></div>
              <span className="text-sm text-yellow-600">Uploading... Please wait.</span>
            </div>
          )}
        </div>

        {uploadResults && uploadResults.errors && uploadResults.errors.length > 0 && (
          <div className="mt-4 mb-4">
            <h3 className="font-semibold text-red-600 mb-2 flex items-center">
              <FaExclamationTriangle className="mr-1" /> Issues Found:
            </h3>

            <div className="max-h-60 overflow-y-auto border border-red-200 rounded-md">
              {uploadResults.errors.map((error, index) => (
                <div
                  key={index}
                  className={`p-3 border-b border-red-100 ${index % 2 === 0 ? 'bg-red-50' : 'bg-white'}`}
                >
                  <div className="font-medium text-gray-700">Row {error.row}</div>
                  <div className="text-red-600">{error.error}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadResults && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-md border ${uploadResults.success_count > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-sm text-gray-500">Successful:</div>
              <div className={`text-xl font-bold ${uploadResults.success_count > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                {uploadResults.success_count}
              </div>
            </div>
            <div className={`p-3 rounded-md border ${uploadResults.error_count > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-sm text-gray-500">Errors:</div>
              <div className={`text-xl font-bold ${uploadResults.error_count > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {uploadResults.error_count}
              </div>
            </div>
          </div>
        )}

        {/* <div className="mt-6 text-sm text-gray-600 text-center">
          Already Registered? <Link to="/StudentLogin" className="text-yellow-600 hover:text-yellow-700">Login..</Link>
        </div> */}
      </div>
    </div>
  );
};

export default StudentRegister;
