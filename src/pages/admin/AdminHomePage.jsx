import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus, FaUsers, FaArrowRight, FaCircle, FaUser, FaUserAlt } from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Cookies from "js-cookie";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Pagination from "../../components/Admin/pagination"; // Import Pagination
import { Link } from "react-router-dom";
import { LoaderContext } from "../../components/Common/Loader";
import yellowBg from "../../assets/images/Yellowbg.png"; // Import the background image

const AdminHome = () => {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);

  const { setIsLoading } = useContext(LoaderContext)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const approvedJobs = jobs.filter((job) => job.is_publish === true);
  const rejectedJobs = [...jobs, ...internships].filter((item) => item.is_publish === false);
  const pendingJobs = [...jobs, ...internships].filter((item) => { return item.is_publish === null });

  const approvedInternships = internships.filter((internship) => internship.is_publish === true);
  const rejectedInternships = internships.filter((internship) => internship.is_publish === false);
  const pendingInternships = internships.filter((internship) => internship.is_publish === null);

  const approvedCount = approvedJobs.length;
  const rejectedCount = rejectedJobs.length;
  const pendingCount = pendingJobs.length;
  const studentCount = students.length;

  const cardsData = [
    { title: "Total Job Listings", count: jobs.length, icon: <FaCheck />, Link: "/jobs" },
    { title: "Total Internship Listings", count: internships.length, icon: <FaBook />, Link: "/internships" },
    { title: "Rejected Approvals", count: rejectedCount, icon: <FaTrophy />, Link: "/admin/mail" },
    { title: "Pending Approvals", count: pendingCount, icon: <FaUserPlus />, Link: "/manage-jobs  " },
  ];

  const [activeListing, setActiveListing] = useState("Jobs")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const token = Cookies.get("jwt");
        if (!token) {
          setError("JWT token missing.");
          return;
        }

        const response = await axios.get("https://cce-backend.onrender.com/api/get-jobs/", {
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
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setIsLoading(false)
      }
    };

    fetchData();
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get paginated data for approval requests
  const getPaginatedApprovalRequests = (data) => {
    const indexOfLastItem = currentPage * 7;
    const indexOfFirstItem = indexOfLastItem - 7;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden"> {/* Prevents overflow */}
      <AdminPageNavbar />

      <div className="flex flex-col space-y-4 p-4 flex-1 h-full">
        {/* h-full to prevent double height issues */}

        {/* Counts Container */}
        <div className="bg-white rounded-xl p-4 mb-2 ml-2 relative overflow-hidden mr-2">
        <div className="flex justify-between items-center mb-4 relative z-10">             
        <p className="text-3xl text-white"><strong> Center For Competitive Exams </strong></p>           
          </div>  
          <div className="grid grid-cols-4 gap-4 relative z-10">
            {cardsData.map((category, key) => (
              <div key={key} className="bg-gray-100 rounded-xl p-4 flex flex-col justify-between space-y-2 relative">
                <div className="flex space-x-2 items-center relative z-10">
                  <div className="p-2 border rounded"> {category.icon} </div>
                  <p> {category.title} </p>
                </div>
                <p className="text-5xl pb-4 border-b border-gray-300 relative z-10"> {category.count} </p>
                <button className="flex items-center text-yellow-400 text-xs space-x-1 relative z-10"
                  onClick={() => window.location.href = category.Link}>
                  <p className="text-sm"> View All </p> <FaArrowRight />
                </button>
              </div>
            ))}
          </div>
          <img src={yellowBg} alt="Background" className="absolute inset-0 w-full h-full object-cover brightness-100 z-0" />
        </div>

        {/* New Container */}
        <div className="flex flex-col rounded-lg bg-white flex-1 mt-1"> {/* Added margin-top */}
          <div className="flex justify-between p-3 py-2">
            <p className="font-semibold">Recent Approval Requests</p>
            <p className="text-yellow-400 cursor-pointer" onClick={() => window.location.href = "/manage-jobs"}>View All</p>
          </div>

          {/* Scrollable Table */}
            <table className="w-full rounded-lg">
              <thead>
                <tr className="text-left border border-gray-400">
                  <th className="px-3 py-2 font-normal text-sm">Title</th>
                  <th className="px-3 py-2 font-normal text-sm">Company</th>
                  <th className="px-3 py-2 font-normal text-sm">Staff Name</th>
                  <th className="px-3 py-2 font-normal text-sm">Job / Internship</th>
                </tr>
              </thead>
              <tbody>
                  {getPaginatedApprovalRequests(pendingJobs).map((item, index) => (
                    <tr
                      key={index}
                      className="text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 capitalize"
                      onClick={() =>
                        item.internship_data
                          ? navigate(`/internship-preview/${item._id}`)
                          : navigate(`/job-preview/${item._id}`)
                      }
                    >
                      <td className="px-3 py-3 font-normal text-sm">
                        {item.internship_data?.title ?? item.job_data?.title}
                      </td>
                      <td className="px-3 py-3 font-normal text-sm">
                        {item.internship_data?.company_name ?? item.job_data?.company_name}
                      </td>
                      <td className="px-3 py-3 font-normal text-sm">
                        {item.internship_data?.internship_type ?? item.job_data?.work_type}
                      </td>
                      <td className="px-3 py-3 font-normal text-sm">
                        {item.internship_data ? "Internship" : item.job_data ? "Job" : "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;