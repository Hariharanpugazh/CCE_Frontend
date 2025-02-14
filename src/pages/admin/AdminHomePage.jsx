import React, { act, useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus, FaFilter } from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Cookies from 'js-cookie';
import ApplicationCard from "../../components/Students/ApplicationCard";
import InternCard from "../../components/Admin/InternCard"; // Import InternCard
import { AppPages, Departments } from "../../utils/constants";
import { FiSearch } from "react-icons/fi";

const AdminHome = () => {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [filter, setFilter] = useState("All");
  const [deptFilter, setdeptFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([])
  const [filteredInterns, setFilteredInterns] = useState([])
  const approvedCount = jobs.filter((job) => job.is_publish === true).length;
  const rejectedCount = jobs.filter((job) => job.is_publish === false).length;
  const pendingCount = jobs.filter((job) => job.is_publish === null).length;


  const cardsData = [
    { title: "Overall", count: jobs.length + internships.length, icon: <FaListAlt /> },
    { title: "Total Job Listings", count: jobs.length, icon: <FaCheck /> },
    { title: "Total Internship Listings", count: internships.length, icon: <FaBook /> },
    { title: "Rejected Jobs", count: rejectedCount, icon: <FaTrophy /> },
    { title: "Pending Approvals", count: pendingCount, icon: <FaUserPlus /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('jwt');
        if (!token) {
          setError("JWT token missing.");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/get-jobs/", {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });

        // Separate jobs and internships based on the 'type' field
        const jobsData = response.data.jobs.filter(item => item.type === "job");
        const internshipsData = response.data.jobs.filter(item => item.type === "internship");

        setJobs(jobsData);
        setInternships(internshipsData);
        setFilteredJobs(jobsData);
        setFilteredInterns(internshipsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = jobs;
  
    if (filter === "Approved") {
      filtered = jobs.filter((job) => job.is_publish === true);
    } else if (filter === "Rejected") {
      filtered = jobs.filter((job) => job.is_publish === false);
    } else if (filter === "Pending Approvals") {
      filtered = jobs.filter((job) => job.is_publish === null);
    }
  
    setFilteredJobs(filtered);
  }, [filter, jobs]);

  
  useEffect(() => {
    if (searchPhrase === "") {
      setFilteredJobs(jobs)
    } else {
      setFilteredJobs(jobs.filter((job) => job.job_data.title.toLocaleLowerCase().includes(searchPhrase)
        ||
        job.job_data.company_name.toLocaleLowerCase().includes(searchPhrase)
        ||
        job.job_data.job_description.toLocaleLowerCase().includes(searchPhrase)
        ||
        job.job_data.required_skills.map(skill => skill.toLowerCase()).includes(searchPhrase.toLowerCase())
        ||
        job.job_data.work_type.toLocaleLowerCase().includes(searchPhrase)
      ))

      setFilteredInterns(internships.filter((interns) => interns.internship_data.title.toLocaleLowerCase().includes(searchPhrase)
        ||
        interns.internship_data.company_name.toLocaleLowerCase().includes(searchPhrase)
        ||
        interns.internship_data.job_description.toLocaleLowerCase().includes(searchPhrase)
        ||
        interns.internship_data.required_skills.map(skill => skill.toLowerCase()).includes(searchPhrase.toLowerCase())
      ))
    }
  }, [searchPhrase, jobs, internships])


  useEffect(() => {
    function dateDiff(deadline) {
      const deadDate = new Date(deadline);
      const today = Date.now();

      const timeDifference = deadDate.getTime() - today;
      console.log(Math.floor(timeDifference / (1000 * 3600 * 24)))
      return Math.floor(timeDifference / (1000 * 3600 * 24)); // Returns whole days difference
    }

    console.log(activeButton)

    if (activeButton === "Active Postings") {
      setFilteredJobs(jobs.filter((job) => dateDiff(job.job_data.application_deadline) >= 0))
      setFilteredInterns(internships.filter((intern) => dateDiff(intern.internship_data.application_deadline) >= 0))
    }

    if (activeButton === "Expired Postings") {
      setFilteredJobs(jobs.filter((job) => dateDiff(job.job_data.application_deadline) < 0))
      setFilteredInterns(internships.filter((intern) => dateDiff(intern.internship_data.application_deadline) < 0))
    }
  }, [activeButton])

  useEffect(() => {
    if (deptFilter === "All") {
      setFilteredJobs(jobs)
    }
    setFilteredJobs(jobs.filter((job) => job.job_data.selectedCategory === deptFilter))
  }, [deptFilter])

  const handleButtonClick = (status) => {
    setActiveButton(status);
    setFilter(status === "All" ? "All" : status);
    setShowFilterOptions(false)
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-auto bg-gray-0">

      <AdminPageNavbar />

      <header className="flex flex-col items-center justify-center py-14 container self-center">
        <p className="text-6xl tracking-[0.8px]">
          Admin Dashboard
        </p>
        <p className="text-lg mt-2 text-center">
          Explore all the{" "}
          Postings
          in all the existing fields <br />around the globe.
        </p>

        <div className="relative flex items-stretch w-[70%]">
          <input type="text" value={searchPhrase} onChange={(e) => setSearchPhrase(e.target.value.toLocaleLowerCase())} placeholder={`Search postings`} className="w-full text-lg my-5 p-2 px-5 rounded-full bg-gray-100 border-transparent border-2 hover:bg-white hover:border-blue-200 outline-blue-400" />
          <div className="absolute right-2 h-full flex items-center">
            <FiSearch className="bi bi-search bg-blue-400 rounded-full text-white" style={{ color: "white", width: "35", height: "35", padding: "8px" }} />
          </div>
        </div>

        <div className="flex space-x-2 flex-wrap w-[50%] justify-center">
          {["All", ...Object.values(Departments)].map((department, key) => (
            <p
              key={key}
              className={`${deptFilter === department
                ? "bg-[#000000] text-white"
                : ""
                } border-gray-700 border-[1px] py-1 px-[10px] rounded-full text-xs my-1 cursor-pointer`}
              onClick={() => setdeptFilter(department)}
            >
              {department}
            </p>
          ))}
        </div>
      </header>

      <div className="w-[80%] mx-auto">

        {/* Stats Cards Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {cardsData.map((card, index) => (
            <div key={index} className=" bg-white rounded-lg shadow-sm">
              <div className="p-4 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-normal text-sm text-[#a0aec0] font-sans">{card.title}</span>
                  <span className="text-md text-[#2d3748] font-sans text-4xl">{card.count}</span>
                </div>
                <div className="p-2 bg-[#FFC800] text-sm text-white rounded flex items-center justify-center shadow-sm">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="flex justify-between items-center my-14">
        <div className="flex text-sm gap-4">
            {["All", "Approved", "Rejected", "Pending Approvals"].map((status) => (
              <button
                key={status}
                className={`px-4 rounded-[10000px] py-1 ${
                  filter === status ? "text-blue-400 underline" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setFilter(status)}
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
                  {['Active Postings', 'Expired Postings'].map((option) => (
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
        <div className="w-full self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
          {filteredJobs.map((job) => (
            <ApplicationCard application={{ ...job, ...job.job_data }} key={job._id} handleCardClick={() => { setSelectedJob(job); }} isSaved={ undefined } />
          ))}
        </div>

        {/* Render Internship Cards */}
        <div className="w-full self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
          {filteredInterns.map((internship) => (
            <ApplicationCard application={{ ...internship}} key={internship._id} handleCardClick={() => { setSelectedJob(internship); }} isSaved={ undefined } />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;