import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import Pagination from "../../components/Admin/pagination";
import SchoolPng from "../../assets/icons/ep_school.png";
import DepartmentPng from "../../assets/icons/mingcute_department-fill.png";
import RolePng from "../../assets/icons/eos-icons_role-binding-outlined.png";
import Adminpng from "../../assets/icons/mdi_account-outline.png";
import Loginpng from "../../assets/icons/mdi_recent.png";
import EmailPng from "../../assets/icons/material-symbols_mail-outline.png";
import PhonePng from "../../assets/icons/Vector.png";
import Saved from "../../assets/icons/Not Saved.png";
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Jobs");
  const [selectedOption, setSelectedOption] = useState("Saved");
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedInternships, setSavedInternships] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [savedExams, setSavedExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const handleNavigation = (id) => {
    if (selectedTab === "Jobs") {
        navigate(`/job-preview/${id}`);
    } else if (selectedTab === "Internships") {
        navigate(`/internship-preview/${id}`);
    } else if (selectedTab === "Exams") {
        navigate(`/exam-preview/${id}`);
    }
}

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;

        const profileResponse = await axios.get(`https://cce-backend.onrender.com/api/profile/${userId}/`);
        const studentData = profileResponse.data.data;
        setStudent(studentData);

        const jobsResponse = await axios.get(`https://cce-backend.onrender.com/api/saved-jobs/${userId}/`);
        if (jobsResponse.data && jobsResponse.data.jobs) {
          setSavedJobs(jobsResponse.data.jobs);
        }

        const internshipsResponse = await axios.get(`https://cce-backend.onrender.com/api/saved-internships/${userId}/`);
        if (internshipsResponse.data && internshipsResponse.data.internships) {
          setSavedInternships(internshipsResponse.data.internships);
        } 

        const appliedInternshipsResponse = await axios.get(`https://cce-backend.onrender.com/api/applied-internships/${userId}/`);
        if (appliedInternshipsResponse.data && appliedInternshipsResponse.data.internships) {
          setAppliedInternships(appliedInternshipsResponse.data.internships);
        }

        const examsResponse = await axios.get(`https://cce-backend.onrender.com/api/saved-exams/${userId}/`);
        if (examsResponse.data && examsResponse.data.exams) {
          setSavedExams(examsResponse.data.exams);
        }

        const appliedJobsResponse = await axios.get(`https://cce-backend.onrender.com/api/applied-jobs/${userId}/`);
        if (appliedJobsResponse.data && appliedJobsResponse.data.jobs) {
          setAppliedJobs(appliedJobsResponse.data.jobs);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  const renderTable = (tab) => {
    const data = {
      Jobs: selectedOption === "Saved" ? savedJobs : appliedJobs,
      Internships: selectedOption === "Saved" ? savedInternships : appliedInternships,
      Exams: selectedOption === "Saved" ? savedExams : [],
    };

    if (!data[tab] || data[tab].length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-4">
          <img 
            src={Saved} 
            alt="No items" 
            className="w-48 h-28 mb-4 opacity-70 mb-3"
          />
          <div className="text-center text-xl font-bold text-gray-800 mb-30 ml-3">
            Nothing {selectedOption} Yet
          </div>
          <div className="text-center text-gray-500 text-sm mb-25 ml-10">
            You can save and apply jobs, internships, exams across the portal and access them here.
          </div>
        </div>
      );
    }

    const currentItems = data[tab];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPageItems = currentItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
      <>
      <div className="overflow-x-auto  border border-gray-200 rounded-lg">
        <table className="min-w-full  text-sm">
          <thead>
            <tr>
              <th className="py-3 border-b border-gray-200">Title</th>
              {selectedTab !== "Exams" && (
              <th className="py-3 border-b border-gray-200">Company</th>
              )}
              {selectedTab !== "Exams" && (
                <th className="py-3 border-b border-gray-200">Posting Date</th>
              )}
              <th className="py-3 border-b border-gray-200">Views</th>
              <th className="py-3 border-b border-gray-200">Status</th>
              <th className="py-3 border-b border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.map((item, index) => {
              const itemData = tab === "Exams" ? item.exam_data : tab === "Internships" ? item.internship_data : item.job_data;
              
              return (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="text-center py-3">{itemData?.title || itemData?.exam_title || "N/A"}</td>
                  {selectedTab !== "Exams" && (
                  <td className="text-center py-3">{itemData?.company_name || "N/A"}</td>
                  )}
                  {selectedTab !== "Exams" && (
                  <td className="text-center py-3">
                    {itemData?.job_posting_date
                      ? new Date(itemData.job_posting_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  )}
                  <td className="text-center py-3">{item.views?.length || "N/A"}</td>
                  <td className="text-center py-3 font-semibold">
                    <span className={`px-1 py-0.5 rounded-full text-xs ${
                      item.status === "Active" ? "text-green-800" : 
                      item.status === "Expired" ? "text-red-800" : 
                      "text-yellow-800"
                    }`}>
                      {item.status || "N/A"}
                    </span>
                  </td>
                  <td className="text-center py-3">
                    <a className="text-black font-semibold cursor-pointer hover:text-gray-700"
                     onClick={() => handleNavigation(item._id)}>View Details</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {currentItems.length > itemsPerPage && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalItems={currentItems.length}
            itemsPerPage={itemsPerPage}
            onPageChange={paginate}
          />
        </div>
      )}
    </>
    );
  };

  const isActive = student?.status?.toLowerCase() === "active";

  return (
    <div
      className="inset-0 md:flex  items-center justify-center"
      style={{
        background: `
          linear-gradient(to bottom, transparent 40%, #FFFFFF 40%),
          repeating-linear-gradient(0deg, #E5B200 0px, #E5B200 1px, transparent 1px, transparent 50px),
          repeating-linear-gradient(90deg, #E5B200 0px, #E5B200 1px, transparent 1px, transparent 50px),
          #FFC800
        `,
      }}
    >
      <div className="flex-1 p-6 flex items-center justify-center">
        <motion.div
          className="max-w-xl w-full md:w-[420px] h-160 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="p-6 text-center">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#D9D9D9] flex items-center justify-center text-4xl font-bold text-gray-600 mb-3">
                {student ? student.name.charAt(0).toUpperCase() : "N/A"}
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{student ? student.name : "N/A"}</h1>
              <p
                className={`mt-1 px-3 py-1 text-xs font-bold uppercase rounded-md bg-[#E0E0E0] ${
                  isActive ? "text-[#2ECC71]" : "text-[#EF4444]"
                }`}
              >
                {isActive ? "ACTIVE" : "INACTIVE"}
              </p>
            </div>

            <div className="text-left space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3">About</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <img src={SchoolPng} alt="School" className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium w-1/3">College Name:</span>
                    <span className="ml-4 text-sm flex-1">{student ? student.college_name : "N/A"}</span>
                  </li>
                  <li className="flex items-center">
                    <img src={DepartmentPng} alt="Department" className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium w-1/3">Department:</span>
                    <span className="ml-4 text-sm flex-1">{student ? student.department : "N/A"}</span>
                  </li>
                  <li className="flex items-center">
                    <img src={RolePng} alt="Role" className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium w-1/3">Role:</span>
                    <span className="ml-4 text-sm flex-1">{student ? student.role : "N/A"}</span>
                  </li>
                </ul>
              </div>
              <hr className="border-t border-gray-300" />
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3">Account Details</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <img src={Adminpng} alt="Created" className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium w-1/3">Created on:</span>
                    <span className="ml-4 text-sm flex-1">{student ? new Date(student.created_at).toLocaleString() : "N/A"}</span>
                  </li>
                  <li className="flex items-center">
                    <img src={Loginpng} alt="Last Login" className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium w-1/3">Last Login:</span>
                    <span className="ml-4 text-sm flex-1">{student ? new Date(student.last_login).toLocaleString() : "N/A"}</span>
                  </li>
                </ul>
              </div>
              <hr className="border-t border-gray-300" />
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3">Contact</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <img src={EmailPng} alt="Email" className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium w-1/3">E-mail:</span>
                    <span className="ml-4 text-sm flex-1">{student ? student.email : "N/A"}</span>
                  </li>
                  <li className="flex items-center">
                    <img src={PhonePng} alt="Phone" className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium w-1/3">Contact Number:</span>
                    <span className="ml-4 text-sm flex-1">{student?.contact_number || "N/A"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full h-160 md:w-[1200px] p-6 bg-white rounded-3xl shadow-2xl overflow-hidden mr-6">
        <div className="relative mb-4">
          <div className="flex space-x-6 mb-2">
            <button
              className={`text-xl font-semibold uppercase ${
                selectedOption === "Saved" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => setSelectedOption("Saved")}
            >
              Saved
            </button>
            <button
              className={`text-xl font-semibold uppercase ${
                selectedOption === "Applied" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => setSelectedOption("Applied")}
            >
              Applied
            </button>
          </div>
          <div className="relative">
            <hr className="border-2 border-gray-300" />
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 h-1 bg-[#FFC800] transition-transform duration-300 ${
                selectedOption === "Saved"
                  ? "left-0 w-[60px] translate-x-0"
                  : "left-0 w-[60px] translate-x-[90px]"
              } rounded-full`}
            ></div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {["Jobs", "Internships", ...(selectedOption === "Saved" ? ["Exams"] : [])].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedTab === tab
                    ? "bg-white text-yellow-700 border-1 border-yellow-400 rounded-lg"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => {
                  setSelectedTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {renderTable(selectedTab)}
      </div>
    </div>
  );
};

export default StudentProfile;