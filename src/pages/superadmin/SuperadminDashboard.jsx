import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus, FaFilter } from "react-icons/fa";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import ApplicationCard from "../../components/Students/ApplicationCard";
import { FiSearch } from "react-icons/fi";
import { AppPages, Departments } from "../../utils/constants";

const SuperAdminHome = () => {
  const [internships, setInternships] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);

  const cardsData = [
    { title: "OverAll", count: jobs.length + internships.length, icon: <FaListAlt /> },
    { title: "Total Job Listings", count: jobs.length, icon: <FaCheck /> },
    { title: "Total Internship Listings", count: internships.length, icon: <FaBook /> },
    { title: "Rejected Jobs", count: 2, icon: <FaTrophy /> },
    { title: "Pending Approvals", count: 0, icon: <FaUserPlus /> },
  ];

  useEffect(() => {
    const fetchPublishedInternships = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/published-internship/");
        const internshipsWithType = response.data.internships.map((internship) => ({
          ...internship.internship_data, // Extract internship_data
          id: internship._id, // Add id field
          status: internship.status, // Add status field
          type: "internship", // Add type field
          updated_at: internship.updated_at // Add type field
        }));
        setInternships(internshipsWithType); // Set internships with type
        setFilteredInterns(internshipsWithType); // Update filtered internships
      } catch (err) {
        console.error("Error fetching published internships:", err);
        setError("Failed to load internships.");
      }
    };

    const fetchPublishedJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/published-jobs/");
        const jobsWithType = response.data.jobs.map((job) => ({
          ...job.job_data, // Extract job_data
          id: job._id, // Add id field
          status: job.status, // Add status field
          type: "job", // Add type field
          updated_at: job.updated_at // Add updated_at field// Add type field
        }));
        setJobs(jobsWithType); // Set jobs with type
        setFilteredJobs(jobsWithType); // Update filtered jobs
      } catch (err) {
        console.error("Error fetching published jobs:", err);
        setError("Failed to load jobs.");
      }
    };

    fetchPublishedInternships();
    fetchPublishedJobs();
  }, []);

  useEffect(() => {
    if (searchPhrase === "") {
      setFilteredJobs(jobs);
      setFilteredInterns(internships);
    } else {
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job.title.includes(searchPhrase) ||
            job.company_name.includes(searchPhrase) ||
            job.job_description.includes(searchPhrase) ||
            job.required_skills.includes(searchPhrase) ||
            job.work_type.includes(searchPhrase)
        )
      );

      setFilteredInterns(
        internships.filter(
          (intern) =>
            intern.title.includes(searchPhrase) ||
            intern.company_name.includes(searchPhrase) ||
            intern.job_description.includes(searchPhrase) ||
            intern.required_skills.includes(searchPhrase) ||
            intern.internship_type.includes(searchPhrase)
        )
      );
    }
  }, [searchPhrase, jobs, internships]);

  const handleButtonClick = (status) => {
    setFilter(status === "All" ? "All" : status);
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-auto bg-[#FFFAFA]">
      <SuperAdminPageNavbar />

      <header className="flex flex-col items-center justify-center py-14 container self-center">
        <p className="text-6xl tracking-[0.8px]">SuperAdmin Dashboard</p>
        <p className="text-lg mt-2 text-center">
          Explore all the postings in all the existing fields around the globe.
        </p>

        <div className="relative flex items-stretch w-[70%]">
          <input
            type="text"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
            placeholder="Search postings"
            className="w-full text-lg my-5 p-2 px-5 rounded-full bg-gray-100 border-transparent border-2 hover:bg-white hover:border-blue-200 outline-blue-400"
          />
          <div className="absolute right-2 h-full flex items-center">
            <FiSearch className="text-blue-400 rounded-full text-white" style={{ color: "white", width: "35", height: "35", padding: "8px" }} />
          </div>
        </div>

        <div className="flex space-x-2 flex-wrap w-[50%] justify-center">
          {["All", ...Object.values(Departments)].map((department, key) => (
            <p
              key={key}
              className={`${deptFilter === department ? "bg-[#000000] text-white" : ""} border-gray-700 border-[1px] py-1 px-[10px] rounded-full text-xs my-1 cursor-pointer`}
              onClick={() => setDeptFilter(department)}
            >
              {department}
            </p>
          ))}
        </div>
      </header>

      <div className="max-w-[80%] mx-auto">
        {/* Stats Cards Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 bg-[#FFFAFA] lg:grid-cols-5 gap-4 mb-8">
          {cardsData.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm">
              <div className="p-4 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-normal text-sm text-[#a0aec0] font-sans">{card.title}</span>
                  <span className="text-md text-[#2d3748] font-sans text-4xl">{card.count}</span>
                </div>
                <div className="p-2 bg-gray-800 text-sm text-white rounded flex items-center justify-center shadow-sm">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="flex justify-between items-center mb-14">
          <div className="flex text-sm gap-4">
            {['All', 'Approved', 'Rejected', 'Pending Approvals'].map((status) => (
              <button
                key={status}
                className={`px-4 rounded-[10000px] py-1 ${filter === status ? "text-blue-400 underline" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleButtonClick(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search and Filter Icon */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaFilter
                size={24}
                className="cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={() => setShowFilterOptions(!showFilterOptions)}
              />
              {showFilterOptions && (
                <div className="absolute top-8 right-0 bg-white shadow-md rounded-md w-40 p-2 space-y-2">
                  {['Active Jobs', 'Expired Jobs'].map((option) => (
                    <button
                      key={option}
                      className={`w-full px-4 py-2 cursor-pointer hover:bg-gray-100 ${filter === option ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
                      onClick={() => handleButtonClick(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Render Job Cards */}
        <div className="w-full self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-stretch">
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600">No jobs available at the moment.</p>
          ) : filteredJobs.length === 0 ? (
            <p className="alert alert-danger w-full col-span-full text-center">!! No Jobs Found !!</p>
          ) : (
            filteredJobs.map((job) => (
              <ApplicationCard key={job.id} application={{ ...job }} />
            ))
          )}
        </div>

        {/* Render Internship Cards */}
        <div className="w-full self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-stretch">
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : internships.length === 0 ? (
            <p className="text-gray-600">No internships available at the moment.</p>
          ) : filteredInterns.length === 0 ? (
            <p className="alert alert-danger w-full col-span-full text-center">!! No Internships Found !!</p>
          ) : (
            filteredInterns.map((intern) => (
              <ApplicationCard key={intern.id} application={{ ...intern }} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHome;