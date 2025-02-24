import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus, FaFilter } from "react-icons/fa";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Pagination from "../../components/Admin/pagination"; // Import Pagination component

const SuperAdminHome = () => {
  const [internships, setInternships] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const [currentInternPage, setCurrentInternPage] = useState(1);
  const itemsPerPage = 3;

  const cardsData = [
    { title: "OverAll", count: jobs.length + internships.length, icon: <FaListAlt /> },
    { title: "Total Job Listings", count: jobs.length, icon: <FaCheck /> },
    { title: "Total Internship Listings", count: internships.length, icon: <FaBook /> },
    { title: "Rejected Approvals",  count: jobs.filter(job => job.is_publish === false).length + internships.filter(internship => internship.is_publish === false).length, icon: <FaTrophy /> },
    { title: "Pending Approvals", count: jobs.filter(job => job.is_publish === null).length, icon: <FaUserPlus /> },
  ];

  useEffect(() => {
    const fetchAllJobsAndInternships = async () => {
      try {
        const response = await axios.get("https://cce-backend-54k0.onrender.com/api/all-jobs-internships/");
        const { jobs, internships } = response.data;

        // Map jobs data to the expected structure
        const mappedJobs = jobs.map((job) => ({
          ...job.job_data,
          id: job._id,
          status: job.status,
          is_publish: job.is_publish,
          type: "job",
          updated_at: job.updated_at,
          total_views: job.total_views // Ensure total_views is included
        }));

        // Map internships data to the expected structure
        const mappedInternships = internships.map((internship) => ({
          ...internship.internship_data,
          id: internship._id,
          status: internship.status,
          is_publish: internship.is_publish,
          type: "internship",
          updated_at: internship.updated_at,
          total_views: internship.total_views // Ensure total_views is included
        }));

        setJobs(mappedJobs);
        setInternships(mappedInternships);
        setFilteredJobs(mappedJobs);
        setFilteredInterns(mappedInternships);
      } catch (err) {
        console.error("Error fetching jobs and internships:", err);
        setError("Failed to load data.");
      }
    };

    fetchAllJobsAndInternships();
  }, []);

  useEffect(() => {
    // Filter jobs and internships based on the selected filter
    if (filter === "All") {
      setFilteredJobs(jobs);
      setFilteredInterns(internships);
    } else if (filter === "Approved") {
      setFilteredJobs(jobs.filter((job) => job.is_publish === true));
      setFilteredInterns(internships.filter((internship) => internship.is_publish === true));
    } else if (filter === "Rejected") {
      setFilteredJobs(jobs.filter((job) => job.is_publish === false));
      setFilteredInterns(internships.filter((internship) => internship.is_publish === false));
    } else if (filter === "Pending Approvals") {
      setFilteredJobs(jobs.filter((job) => job.is_publish === null));
      setFilteredInterns(internships.filter((internship) => internship.is_publish === null));
    } else if (filter === "Active Jobs") {
      setFilteredJobs(jobs.filter((job) => job.status === "Active" ));
      setFilteredInterns(internships.filter((internship) => internship.status === "Active" ));
    } else if (filter === "Expired Jobs") {
      setFilteredJobs(jobs.filter((job) => job.status === "expired"));
      setFilteredInterns(internships.filter((internship) => internship.status === "expired" ));
    }
  }, [filter, jobs, internships]);

  useEffect(() => {
    if (searchPhrase === "") {
      if (filter === "All") {
        setFilteredJobs(jobs);
        setFilteredInterns(internships);
      } else if (filter === "Approved") {
        setFilteredJobs(jobs.filter((job) => job.is_publish === true));
        setFilteredInterns(internships.filter((internship) => internship.is_publish === true));
      } else if (filter === "Rejected") {
        setFilteredJobs(jobs.filter((job) => job.is_publish === false));
        setFilteredInterns(internships.filter((internship) => internship.is_publish === false));
      } else if (filter === "Pending Approvals") {
        setFilteredJobs(jobs.filter((job) => job.is_publish === null));
        setFilteredInterns(internships.filter((internship) => internship.is_publish === null));
      } else if (filter === "Active Jobs") {
        setFilteredJobs(jobs.filter((job) => job.status === "Active"));
      } else if (filter === "Expired Jobs") {
        setFilteredJobs(jobs.filter((job) => job.status === "expired"));
      }
    } else {
      const filteredJobsBySearch = jobs.filter((job) =>
        job.title.toLocaleLowerCase().includes(searchPhrase) ||
        job.company_name.toLocaleLowerCase().includes(searchPhrase) ||
        job.job_description.toLocaleLowerCase().includes(searchPhrase) ||
        job.required_skills.map(skill => skill.toLowerCase()).includes(searchPhrase.toLowerCase()) ||
        job.selectedWorkType.toLocaleLowerCase().includes(searchPhrase)
      );

      const filteredInternsBySearch = internships.filter((internship) =>
        internship.title.toLocaleLowerCase().includes(searchPhrase) ||
        internship.company_name.toLocaleLowerCase().includes(searchPhrase) ||
        internship.job_description.toLocaleLowerCase().includes(searchPhrase) ||
        internship.required_skills.map(skill => skill.toLowerCase()).includes(searchPhrase.toLowerCase())
      );

      if (filter === "All") {
        setFilteredJobs(filteredJobsBySearch);
        setFilteredInterns(filteredInternsBySearch);
      } else if (filter === "Approved") {
        setFilteredJobs(filteredJobsBySearch.filter((job) => job.is_publish === true));
        setFilteredInterns(filteredInternsBySearch.filter((internship) => internship.is_publish === true));
      } else if (filter === "Rejected") {
        setFilteredJobs(filteredJobsBySearch.filter((job) => job.is_publish === false));
        setFilteredInterns(filteredInternsBySearch.filter((internship) => internship.is_publish === false));
      } else if (filter === "Pending Approvals") {
        setFilteredJobs(filteredJobsBySearch.filter((job) => job.is_publish === null));
        setFilteredInterns(filteredInternsBySearch.filter((internship) => internship.is_publish === null));
      } else if (filter === "Active Jobs") {
        setFilteredJobs(filteredJobsBySearch.filter((job) => job.status === "Active"));
      } else if (filter === "Expired Jobs") {
        setFilteredJobs(filteredJobsBySearch.filter((job) => job.status === "expired"));
      }
    }
  }, [searchPhrase, filter, jobs, internships]);

  const handleButtonClick = (status) => {
    setFilter(status);
  };

  const handleFilterClick = (status) => {
    setFilter(status);
    setShowFilterOptions(false); // Close the filter options after selecting
  };

  // Pagination logic for jobs
  const indexOfLastJob = currentJobPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleJobPageChange = (pageNumber) => {
    setCurrentJobPage(pageNumber);
  };

  // Pagination logic for internships
  const indexOfLastIntern = currentInternPage * itemsPerPage;
  const indexOfFirstIntern = indexOfLastIntern - itemsPerPage;
  const currentInterns = filteredInterns.slice(indexOfFirstIntern, indexOfLastIntern);

  const handleInternPageChange = (pageNumber) => {
    setCurrentInternPage(pageNumber);
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-auto bg-[#FFFAFA] ml-30">
      <SuperAdminPageNavbar />

      <header className="flex flex-col items-center justify-center py-14 container self-center">
        <p className="text-6xl tracking-[0.8px]">SuperAdmin Dashboard</p>
        <p className="text-lg mt-2 text-center">
          Explore all the postings in all the existing fields around the globe.
        </p>
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
                <div className="p-2 bg-yellow-400 text-sm text-white rounded flex items-center justify-center shadow-sm">
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
                      onClick={() => handleFilterClick(option)}
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
        <div className="w-full self-center mt-6">
          <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-stretch">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : jobs.length === 0 ? (
              <p className="text-gray-600">No jobs available at the moment.</p>
            ) : currentJobs.length === 0 ? (
              <p className="alert alert-danger w-full col-span-full text-center">!! No Jobs Found !!</p>
            ) : (
              currentJobs.map((job) => (
                <ApplicationCard key={job.id} application={{ ...job, total_views: job.total_views }} />
              ))
            )}
          </div>
          <Pagination
            currentPage={currentJobPage}
            totalItems={filteredJobs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handleJobPageChange}
          />
        </div>

        {/* Render Internship Cards */}
        <div className="w-full self-center mt-6">
          <h2 className="text-2xl font-bold mb-4">Internship Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-stretch">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : internships.length === 0 ? (
              <p className="text-gray-600">No internships available at the moment.</p>
            ) : currentInterns.length === 0 ? (
              <p className="alert alert-danger w-full col-span-full text-center">!! No Internships Found !!</p>
            ) : (
              currentInterns.map((intern) => (
                <ApplicationCard key={intern.id} application={{ ...intern, total_views: intern.total_views }} />
              ))
            )}
          </div>
          <Pagination
            currentPage={currentInternPage}
            totalItems={filteredInterns.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handleInternPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHome;
