import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "../../components/ui/button";
import Pagination from "../../components/Admin/pagination";
import SchoolPng from "../../assets/icons/ep_school.png";
import DepartmentPng from "../../assets/icons/mingcute_department-fill.png";
import RolePng from "../../assets/icons/eos-icons_role-binding-outlined.png";
import Adminpng from "../../assets/icons/mdi_account-outline.png";
import Loginpng from "../../assets/icons/mdi_recent.png";
import EmailPng from "../../assets/icons/material-symbols_mail-outline.png";
import PhonePng from "../../assets/icons/Vector.png";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [admin, setAdmin] = useState(null);
  console.log(admin);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editableAdmin, setEditableAdmin] = useState({});
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("jobs");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAdminPopup, setShowAdminPopup] = useState(false); // State for admin pop-up visibility

  // Format date to match the design
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format date for table display (e.g., "2 Days ago", "Jan 9, 2025")
  const formatTableDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 10) {
      return `${diffDays} Days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = Cookies.get("jwt");
        if (!token) {
          navigate("/login");
          return;
        }

        const userId = JSON.parse(atob(token.split(".")[1])).admin_user;
        const response = await axios.get(`https://cce-backend-54k0.onrender.com/api/get-admin/${userId}/`);
        const adminData = response.data.data;

        setAdmin(adminData);
        setEditedName(adminData.name);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        setError("Failed to load admin profile.");
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const token = Cookies.get("jwt");
        if (!token) return;

        // Fetch jobs and internships
        const jobsResponse = await axios.get("https://cce-backend-54k0.onrender.com/api/get-jobs/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Process jobs data - filter items with type "job" or without type
        if (jobsResponse.data.jobs) {
          const jobsData = jobsResponse.data.jobs
            .filter((item) => !item.type || item.type === "job")
            .map((job) => ({
              id: job._id,
              title: job.job_data?.title || "N/A",
              company: job.job_data?.company_name || "N/A",
              posted_date: formatTableDate(job.updated_at),
              views: job.views || 0,
              status: job.status === "Active" ? "Ongoing" : "Closed",
              admin_id: job.admin_id,
            }));

          setJobs(jobsData);
        }

        // Process internships data - filter items with type "internship"
        if (jobsResponse.data.jobs) {
          const internshipsData = jobsResponse.data.jobs
            .filter((item) => item.type === "internship")
            .map((internship) => ({
              id: internship._id,
              title: internship.internship_data?.title || "N/A",
              company: internship.internship_data?.company_name || "N/A",
              posted_date: formatTableDate(internship.updated_at),
              views: internship.views || 0,
              status: internship.status === "Active" ? "Ongoing" : "Closed",
              admin_id: internship.admin_id,
            }));

          setInternships(internshipsData);
        }

        // Process achievements data
        if (jobsResponse.data.achievements) {
          setAchievements(
            jobsResponse.data.achievements.map((achievement) => ({
              id: achievement._id,
              name: achievement.name || "N/A",
              title: achievement.achievement_type || "N/A",
              company: achievement.company_name || "N/A",
              posted_date: formatTableDate(achievement.updated_at),
              views: 0, // Achievements typically don't track views
              status: achievement.is_publish ? "Ongoing" : "Closed",
              description: achievement.achievement_description,
            }))
          );
        }

        // Process study materials data
        if (jobsResponse.data.studymaterials) {
          setStudyMaterials(
            jobsResponse.data.studymaterials.map((material) => ({
              id: material._id,
              title: material.title || "N/A",
              company: material.category || "N/A", // Using category as company for display
              posted_date: formatTableDate(material.updated_at),
              views: 0, // Study materials typically don't track views
              status: material.is_publish ? "Ongoing" : "Closed",
              description: material.description,
              links: material.links || [],
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAdminProfile();
    fetchData();

    // Check screen size on mount and add resize listener
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [navigate]);

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        navigate("/login");
        return;
      }

      const userId = JSON.parse(atob(token.split(".")[1])).admin_user;

      const updatedData = {
        name: editableAdmin.name,
        college_name: editableAdmin.college_name,
        department: editableAdmin.department,
      };

      await axios.put(`https://cce-backend-54k0.onrender.com/api/update-admin/${userId}/`, updatedData);

      setEditMode(false);
      setShowAdminPopup(false); // Hide pop-up after saving
      // Refresh admin data
      const response = await axios.get(`https://cce-backend-54k0.onrender.com/api/get-admin/${userId}/`);
      setAdmin(response.data.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  // Get current items based on active tab
  const getCurrentItems = () => {
    switch (activeTab) {
      case "jobs":
        return jobs;
      case "internships":
        return internships;
      case "achievements":
        return achievements;
      case "study material":
        return studyMaterials;
      default:
        return [];
    }
  };

  const handleEditProfile = () => {
    setEditableAdmin({ ...admin });
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableAdmin((prev) => ({ ...prev, [name]: value }));
  };

  // Pagination logic
  const currentItems = getCurrentItems();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageItems = currentItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadCSV = () => {
    // Determine which data to download based on active tab
    let dataToDownload = [];
    let filename = "";
    let headers = [];

    switch (activeTab) {
      case "jobs":
        dataToDownload = jobs;
        filename = "jobs.csv";
        headers = ["Title", "Company", "Posted", "Views", "Status"];
        break;
      case "internships":
        dataToDownload = internships;
        filename = "internships.csv";
        headers = ["Title", "Company", "Posted", "Views", "Status"];
        break;
      case "achievements":
        dataToDownload = achievements;
        filename = "achievements.csv";
        headers = ["Name", "Title", "Company", "Posted", "Status"];
        break;
      case "study material":
        dataToDownload = studyMaterials;
        filename = "study_materials.csv";
        headers = ["Title", "Category", "Posted", "Status"];
        break;
      default:
        return;
    }

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...dataToDownload.map((item) => {
        if (activeTab === "achievements") {
          return [item.name, item.title, item.company, item.posted_date, item.status].join(",");
        } else if (activeTab === "study material") {
          return [
            item.title,
            item.company, // This is actually the category
            item.posted_date,
            item.status,
          ].join(",");
        } else {
          return [item.title, item.company, item.posted_date, `${item.views} Views`, item.status].join(",");
        }
      }),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">{error}</div>;
  }

  // Check if admin status is active
  const isActive = admin?.status === "Active";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 ml-0 md:ml-65">
      {/* Toggle Sidebar Button (Mobile Only) */}

      {/* Left Sidebar */}
      <div
        className={`md:block w-full shadow rounded- md:w-[350px] border-r border-[#aaaaaa] bg-white flex flex-col overflow-y-auto max-h-screen`}
      >
        <div className="p-4 border-b border-[#aaaaaa] flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Details</h1>
        </div>

        <div className="flex flex-col items-center py-4 md:py-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#E5E7EB] flex items-center justify-center text-3xl sm:text-4xl md:text-5xl text-gray-500 font-medium mb-3">
            {admin?.name?.charAt(0).toUpperCase() || "N"}
          </div>
          {editMode ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-lg md:text-xl font-semibold text-center border-b border-gray-300 focus:outline-none focus:border-yellow-400"
            />
          ) : (
            <h2 className="text-lg md:text-xl font-semibold">{admin?.name || "NA"}</h2>
          )}
          <div
            className={`mt-1 px-3 py-0.5 text-xs font-medium ${
              isActive ? "bg-green-500" : "bg-red-500"
            } text-white rounded-full`}
          >
            {isActive ? "ACTIVE" : "INACTIVE"}
          </div>
        </div>

        <div className="px-4 space-y-4 md:space-y-5 flex-1 overflow-y-auto">
          <div>
            <h3 className="text-base font-medium mb-2 md:mb-3">About</h3>
            <div className="space-y-2 md:space-y-3 text-sm">
              <div className="flex items-start md:items-center flex-wrap">
                <div className="flex items-center min-w-[120px]">
                  <img src={SchoolPng || "/placeholder.svg"} alt="" className="w-4 h-4 mr-2" />
                  <span className="text-gray-500">College Name</span>
                </div>
                <span className="font-medium pl-6 md:pl-0">: {admin?.college_name || "NA"} </span>
              </div>
              <div className="flex items-start md:items-center flex-wrap">
                <div className="flex items-center min-w-[120px]">
                  <img src={DepartmentPng || "/placeholder.svg"} alt="" className="w-4 h-4 mr-2" />
                  <span className="text-gray-500">Department</span>
                </div>
                <span className="font-medium pl-6 md:pl-0"> : {admin?.department || "NA"}</span>
              </div>
              <div className="flex items-start md:items-center flex-wrap">
                <div className="flex items-center min-w-[120px]">
                  <img src={RolePng || "/placeholder.svg"} alt="" className="w-4 h-4 mr-2" />
                  <span className="text-gray-500">Role</span>
                </div>
                <span className="font-medium pl-6 md:pl-0">: {admin?.role || "Admin"}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#aaaaaa] pt-4">
            <h3 className="text-base font-medium mb-2 md:mb-3">Account Details</h3>
            <div className="space-y-2 md:space-y-3 text-sm">
              <div className="flex items-start md:items-center flex-wrap">
                <div className="flex items-center min-w-[120px]">
                  <img src={Adminpng || "/placeholder.svg"} alt="" className="w-4 h-4 mr-2" />
                  <span className="text-gray-500">Created on</span>
                </div>
                <span className="font-medium pl-6 md:pl-0">
                  : {admin?.created_at ? formatDate(admin.created_at) : "NA"}
                </span>
              </div>
              <div className="flex items-start md:items-center flex-wrap">
                <div className="flex items-center min-w-[120px]">
                  <img src={Loginpng || "/placeholder.svg"} alt="" className="w-4 h-4 mr-2" />
                  <span className="text-gray-500">Last Login</span>
                </div>
                <span className="font-medium pl-6 md:pl-0">
                  : {admin?.last_login ? formatDate(admin.last_login) : "NA"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#aaaaaa] pt-4">
            <h3 className="text-base font-medium mb-2 md:mb-3">Contact</h3>
            <div className="space-y-2 md:space-y-3 text-sm">
              <div className="flex items-start md:items-center flex-wrap">
                <div className="flex items-center min-w-[120px]">
                  <img src={EmailPng || "/placeholder.svg"} alt="" className="w-4 h-4 mr-2" />
                  <span className="text-gray-500">E-mail</span>
                </div>
                <span className="font-medium break-all pl-6 md:pl-0"> : {admin?.email || "NA"}</span>
              </div>
              <div className="flex items-start md:items-center flex-wrap">
                <div className="flex items-center min-w-[120px]">
                  <img src={PhonePng || "/placeholder.svg"} alt="" className="w-4 h-4 mr-2" />
                  <span className="text-gray-500">Contact Number</span>
                </div>
                <span className="font-medium pl-6 md:pl-0"> : {admin?.contact_number || "NA"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 flex justify-center">
          <Button
            className="w-full sm:w-[150px] bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-1.5 rounded-md justify-center"
            onClick={() => {
                setShowAdminPopup(true);
                setEditMode(true); 
                handleEditProfile();
            }}
          >
           Edit Info
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Tabs */}
        <div className="mb-4 md:mb-6 mt-4 md:mt-10">
          <div className="flex flex-wrap gap-2 md:space-x-1 overflow-x-auto">
            {["Jobs", "Internships", "Achievements", "Study Material"].map((tab) => (
              <button
                key={tab}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    activeTab === tab.toLowerCase()
                      ? "bg-yellow-50 text-yellow-700 border-1 border-yellow-400 rounded-lg"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                onClick={() => {
                  setActiveTab(tab.toLowerCase());
                  setCurrentPage(1); // Reset to first page when changing tabs
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="min-w-full overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {activeTab === "achievements" && (
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Company
                    </th>
                    <th
                      scope="col"
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Posted
                    </th>
                    {activeTab !== "achievements" && (
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Views
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPageItems.length > 0 ? (
                    currentPageItems.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50">
                        {activeTab === "achievements" && (
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                        )}
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          {item.company}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          {item.posted_date}
                        </td>
                        {activeTab !== "achievements" && (
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            {item.views} Views
                          </td>
                        )}
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.status === "Ongoing" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm">
                          <a
                            href={
                              activeTab === "jobs"
                                ? `/job-preview/${item.id}`
                                : activeTab === "internships"
                                ? `/internship-preview/${item.id}`
                                : activeTab === "study material"
                                ? `/student-study-detail/${item.id}`
                                : "#"
                            }
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            View Details
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={activeTab === "achievements" ? 7 : 6}
                        className="px-3 md:px-6 py-4 text-center text-xs md:text-sm text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination and Download Button */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 items-center w-full">
            <div className="col-span-1 hidden md:block"></div>
            <div className="col-span-1 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalItems={currentItems.length}
                itemsPerPage={itemsPerPage}
                onPageChange={paginate}
              />
            </div>
            <div className="col-span-1 flex justify-center md:justify-end">
              {currentItems.length > 0 && (
                <Button
                  onClick={downloadCSV}
                  variant="outline"
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs md:text-sm"
                >
                  Download CSV
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showAdminPopup && admin && (
      <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-xl relative">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 p-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => {
              setShowAdminPopup(false);
              setEditMode(false);
            }}
          >
            ✕
          </button>
          <div className="flex items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{admin.name.toUpperCase()}</h2>
              <div className="flex items-center gap-2">
                <span
                  className={`p-1 bg-gray-200 rounded-sm text-sm font-semibold ${
                    admin.status === "active" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {admin.status.toUpperCase()}
                </span>
                <span className="p-1 text-sm bg-gray-200 rounded-sm text-gray-500">
                  CREATED ON : {new Date(admin.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">College Name:</span>
                <span>{editMode ? (
                  <input
                    type="text"
                    name="college_name"
                    value={editableAdmin.college_name || ""}
                    onChange={handleInputChange}
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  admin.college_name
                )}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Department:</span>
                <span>{editMode ? (
                  <input
                    type="text"
                    name="department"
                    value={editableAdmin.department || ""}
                    onChange={handleInputChange}
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  admin.department
                )}</span>
              </div>
            </div>
          </div>
          {/* Contact Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">E-mail:</span>
                <span>{admin.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Contact Number:</span>
                <span>{admin.mobile_number || "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              className="mr-2 bg-white border border-red-500 text-red-500 font-medium py-1.5 rounded-md"
              onClick={() => {
                setShowAdminPopup(false);
                setEditMode(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-1.5 rounded-md"
              onClick={() => {
                handleSaveChanges();
                setShowAdminPopup(false);
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default AdminProfile;
