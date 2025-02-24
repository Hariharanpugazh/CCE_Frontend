import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus, FaUsers } from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Cookies from "js-cookie";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Pagination from "../../components/Admin/pagination"; // Import Pagination

const AdminHome = () => {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const approvedJobs = jobs.filter((job) => job.is_publish === true);
  const rejectedJobs = jobs.filter((job) => job.is_publish === false);
  const pendingJobs = jobs.filter((job) => job.is_publish === null);

  const approvedInternships = internships.filter((internship) => internship.is_publish === true);
  const rejectedInternships = internships.filter((internship) => internship.is_publish === false);
  const pendingInternships = internships.filter((internship) => internship.is_publish === null);

  const approvedCount = approvedJobs.length;
  const rejectedCount = rejectedJobs.length;
  const pendingCount = pendingJobs.length + pendingInternships.length;
  const studentCount = students.length;

  const cardsData = [
    { title: "Overall", count: jobs.length + internships.length, icon: <FaListAlt /> },
    { title: "Total Job Listings", count: jobs.length, icon: <FaCheck /> },
    { title: "Total Internship Listings", count: internships.length, icon: <FaBook /> },
    { title: "Approved Jobs", count: approvedCount, icon: <FaCheck /> },
    { title: "Rejected Jobs", count: rejectedCount, icon: <FaTrophy /> },
    { title: "Pending Approvals", count: pendingCount, icon: <FaUserPlus /> },
    { title: "Total Students", count: studentCount, icon: <FaUsers /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("jwt");
        if (!token) {
          setError("JWT token missing.");
          return;
        }

        const response = await axios.get("https://cce-backend-54k0.onrender.com/api/get-jobs/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const jobsData = response.data.jobs.filter((item) => item.type === "job").map((job) => ({
          ...job,
          total_views: job.total_views, // Ensure total_views is included
        }));

        const internshipsData = response.data.jobs.filter((item) => item.type === "internship").map((internship) => ({
          ...internship,
          total_views: internship.total_views, // Ensure total_views is included
        }));

        setJobs(jobsData);
        setInternships(internshipsData);
        setFilteredJobs(jobsData);
        setFilteredInterns(internshipsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get("https://cce-backend-54k0.onrender.com/api/students/");
        setStudents(response.data.students);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data.");
      }
    };

    fetchData();
    fetchStudents();
  }, []);

  useEffect(() => {
    let filteredJobsData = jobs;
    let filteredInternsData = internships;

    if (filter === "Approved") {
      filteredJobsData = approvedJobs;
      filteredInternsData = approvedInternships;
    } else if (filter === "Rejected") {
      filteredJobsData = rejectedJobs;
      filteredInternsData = rejectedInternships;
    } else if (filter === "Pending Approvals") {
      filteredJobsData = pendingJobs;
      filteredInternsData = pendingInternships;
    }

    if (filter === "Jobs") {
      filteredInternsData = [];
    } else if (filter === "Internships") {
      filteredJobsData = [];
    }

    setFilteredJobs(filteredJobsData);
    setFilteredInterns(filteredInternsData);
  }, [filter, jobs, internships]);

  useEffect(() => {
    if (searchPhrase === "") {
      setFilteredJobs(jobs);
      setFilteredInterns(internships);
    } else {
      setFilteredJobs(
        jobs.filter((job) =>
          job.job_data.title.toLowerCase().includes(searchPhrase) ||
          job.job_data.company_name.toLowerCase().includes(searchPhrase) ||
          job.job_data.job_description.toLowerCase().includes(searchPhrase) ||
          job.job_data.required_skills.some((skill) =>
            skill.toLowerCase().includes(searchPhrase)
          ) ||
          job.job_data.work_type.toLowerCase().includes(searchPhrase)
        )
      );

      setFilteredInterns(
        internships.filter((internship) =>
          internship.internship_data.title.toLowerCase().includes(searchPhrase) ||
          internship.internship_data.company_name.toLowerCase().includes(searchPhrase) ||
          internship.internship_data.job_description.toLowerCase().includes(searchPhrase) ||
          internship.internship_data.required_skills.some((skill) =>
            skill.toLowerCase().includes(searchPhrase)
          )
        )
      );
    }
  }, [searchPhrase, jobs, internships]);

  // Get paginated data
  const getPaginatedData = (data) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-auto bg-gray-100 ml-26">
      <AdminPageNavbar />
      <header className="flex flex-col items-center justify-center py-6 container self-center">
        <p className="text-4xl font-bold tracking-[0.8px]">Admin Dashboard</p>
        <p className="text-lg mt-2 text-center text-gray-600">
          Explore all the Postings in all the existing fields around the globe.
        </p>
      </header>
      <div className="w-[80%] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {cardsData.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-normal text-sm text-gray-500">{card.title}</span>
                  <span className="text-2xl font-semibold text-gray-800">{card.count}</span>
                </div>
                <div className="p-2 bg-yellow-500 text-white rounded flex items-center justify-center shadow-sm">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section with Yellow Navigation */}
        <div className="flex justify-between items-center my-6">
          <div className="flex text-sm gap-4">
            {["All", "Approved", "Rejected", "Pending Approvals", "Jobs", "Internships"].map((status) => (
              <button
                key={status}
                className={`px-4 rounded-full py-1 ${
                  filter === status ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Displaying the Cards */}
        <div className="w-full self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
          {getPaginatedData(filteredJobs).map((job) => (
            <ApplicationCard
              key={job._id}
              application={{ ...job, ...job.job_data, total_views: job.total_views }}
              handleCardClick={() => {}}
              isSaved={undefined}
            />
          ))}
        </div>
        <div className="w-full self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
          {getPaginatedData(filteredInterns).map((internship) => (
            <ApplicationCard
              key={internship._id}
              application={{ ...internship, ...internship.internship_data, total_views: internship.total_views }}
              handleCardClick={() => {}}
              isSaved={undefined}
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredJobs.length + filteredInterns.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminHome;
