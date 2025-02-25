import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import JobTable from "../../components/SuperAdmin/ManagementTable/JobTable";
import AchievementTable from "../../components/SuperAdmin/ManagementTable/AchievementTable";
import InternshipTable from "../../components/SuperAdmin/ManagementTable/InternshipTable";
import { LoaderContext } from "../../components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";

export default function MailPage() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [selectedInternships, setSelectedInternships] = useState([]);
  const [autoApproval, setAutoApproval] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rejectedItemId, setRejectedItemId] = useState(null);
  const [rejectedItemType, setRejectedItemType] = useState(null);
  const [visibleSection, setVisibleSection] = useState("jobs");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const token = Cookies.get("jwt");
  const { isLoading, setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "superadmin") {
        navigate("/");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/superadmin");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [jobsRes, achievementsRes, internshipsRes] = await Promise.all([
          axios.get("https://cce-backend-54k0.onrender.com/api/jobs", config),
          axios.get("https://cce-backend-54k0.onrender.com/api/achievements/", config),
          axios.get("https://cce-backend-54k0.onrender.com/api/internship/", config),
        ]);

        setJobs(jobsRes.data.jobs);
        setAchievements(achievementsRes.data.achievements);
        setInternships(internshipsRes.data.internships);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, setIsLoading]);

  useEffect(() => {
    const fetchAutoApproval = async () => {
      try {
        const response = await axios.get("https://cce-backend-54k0.onrender.com/api/get-auto-approval-status/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAutoApproval(response.data.is_auto_approval);
      } catch (err) {
        console.error("Error fetching auto-approval status:", err);
      }
    };
    fetchAutoApproval();
  }, [token]);

  const toggleAutoApproval = async () => {
    try {
      await axios.post(
        "https://cce-backend-54k0.onrender.com/api/toggle-auto-approval/",
        { is_auto_approval: !autoApproval },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAutoApproval(!autoApproval);
    } catch (err) {
      console.error("Error updating auto-approval:", err);
    }
  };

  const handleAction = async (id, action, type) => {
    if (action === "reject") {
      setRejectedItemId(id);
      setRejectedItemType(type);
      setShowModal(true);
      return;
    }

    try {
      const endpoint =
        type === "job"
          ? `https://cce-backend-54k0.onrender.com/api/review-job/${id}/`
          : type === "achievement"
            ? `https://cce-backend-54k0.onrender.com/api/review-achievement/${id}/`
            : `https://cce-backend-54k0.onrender.com/api/review-internship/${id}/`;

      const response = await axios.post(
        endpoint,
        { action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);

      if (type === "job") {
        setJobs((prev) =>
          prev.map((job) =>
            job._id === id ? { ...job, is_publish: action === "approve" } : job
          )
        );
      } else if (type === "achievement") {
        setAchievements((prev) =>
          prev.map((achievement) =>
            achievement._id === id
              ? { ...achievement, is_publish: action === "approve" }
              : achievement
          )
        );
      } else {
        setInternships((prev) =>
          prev.map((internship) =>
            internship._id === id
              ? { ...internship, is_publish: action === "approve" }
              : internship
          )
        );
      }
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
      toast.error(`Failed to update ${type} status.`);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const endpoint =
        type === "job"
          ? `https://cce-backend-54k0.onrender.com/api/job-delete/${id}/`
          : type === "achievement"
            ? `https://cce-backend-54k0.onrender.com/api/delete-achievement/${id}/`
            : `https://cce-backend-54k0.onrender.com/api/internship-delete/${id}/`;

      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);

      if (type === "job") {
        setJobs((prev) => prev.filter((job) => job._id !== id));
      } else if (type === "achievement") {
        setAchievements((prev) => prev.filter((achievement) => achievement._id !== id));
      } else {
        setInternships((prev) => prev.filter((internship) => internship._id !== id));
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      toast.error(`Failed to delete ${type}.`);
    }
  };

  const handleView = (id, type) => {
    if (type === "job") {
      navigate(`/job-edit/${id}`);
    } else if (type === "achievement") {
      navigate(`/achievement-edit/${id}`);
    } else {
      navigate(`/internship-edit/${id}`);
    }
  };

  const handleSelectAll = (type) => {
    console.log(`Select all clicked for ${type}`);
    if (type === "job") {
      setSelectedJobs((prev) => {
        const newSelected = prev.length === jobs.length ? [] : jobs.map((job) => job._id);
        console.log(`Selected jobs: ${newSelected}`);
        return newSelected;
      });
    } else if (type === "achievement") {
      setSelectedAchievements((prev) => {
        const newSelected = prev.length === achievements.length ? [] : achievements.map((achievement) => achievement._id);
        console.log(`Selected achievements: ${newSelected}`);
        return newSelected;
      });
    } else {
      setSelectedInternships((prev) => {
        const newSelected = prev.length === internships.length ? [] : internships.map((internship) => internship._id);
        console.log(`Selected internships: ${newSelected}`);
        return newSelected;
      });
    }
  };

  const handleBulkApprove = async (type) => {
    const ids =
      type === "job"
        ? selectedJobs
        : type === "achievement"
          ? selectedAchievements
          : selectedInternships;

    console.log(`Bulk approve clicked for ${type} with IDs:`, ids);

    try {
      const promises = ids.map((id) => handleAction(id, "approve", type));
      await Promise.all(promises);
      toast.success(`All selected ${type}s have been approved.`);
    } catch (err) {
      console.error(`Error bulk approving ${type}s:`, err);
      toast.error(`Failed to bulk approve ${type}s.`);
    }
  };

  const handleBulkDelete = async (type) => {
    const ids =
      type === "job"
        ? selectedJobs
        : type === "achievement"
          ? selectedAchievements
          : selectedInternships;

    console.log(`Bulk delete clicked for ${type} with IDs:`, ids);

    if (window.confirm(`Are you sure you want to delete all selected ${type}s?`)) {
      try {
        const promises = ids.map((id) => handleDelete(id, type));
        await Promise.all(promises);
        toast.success(`All selected ${type}s have been deleted.`);
      } catch (err) {
        console.error(`Error bulk deleting ${type}s:`, err);
        toast.error(`Failed to bulk delete ${type}s.`);
      }
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      const response = await axios.post(
        "https://cce-backend-54k0.onrender.com/api/submit-feedback/",
        {
          item_id: rejectedItemId,
          item_type: rejectedItemType,
          feedback: feedback,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setShowModal(false);
      setFeedback("");
      setRejectedItemId(null);
      setRejectedItemType(null);

      if (rejectedItemType === "job") {
        setJobs((prev) =>
          prev.map((job) =>
            job._id === rejectedItemId ? { ...job, is_publish: false } : job
          )
        );
      } else if (rejectedItemType === "achievement") {
        setAchievements((prev) =>
          prev.map((achievement) =>
            achievement._id === rejectedItemId
              ? { ...achievement, is_publish: false }
              : achievement
          )
        );
      } else {
        setInternships((prev) =>
          prev.map((internship) =>
            internship._id === rejectedItemId
              ? { ...internship, is_publish: false }
              : internship
          )
        );
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast.error("Failed to submit feedback.");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex">
      <SuperAdminPageNavbar />
      <div className="flex flex-col flex-1 p-6">
        <h1 className="text-1xl font-semibold pt-4 text-gray-800 mb-4">
          Manage
          {` ${["jobs", "achievements", "internships"].find((option) => option === visibleSection).replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
          )}`}
        </h1>

        <ToastContainer />

        {visibleSection === "jobs" && (
          <JobTable
            jobs={jobs}
            toggleAutoApproval={toggleAutoApproval}
            autoApproval={autoApproval}
            selectedJobs={selectedJobs}
            setSelectedJobs={setSelectedJobs}
            handleAction={handleAction}
            handleDelete={handleDelete}
            setVisibleSection={setVisibleSection}
            handleView={handleView}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            handleBulkApprove={handleBulkApprove}
            handleBulkDelete={handleBulkDelete}
            handleSelectAll={handleSelectAll}
          />
        )}

        {visibleSection === "achievements" && (
          <AchievementTable
            achievements={achievements}
            selectedAchievements={selectedAchievements}
            setSelectedAchievements={setSelectedAchievements}
            handleAction={handleAction}
            handleDelete={handleDelete}
            handleView={handleView}
            currentPage={currentPage}
            setVisibleSection={setVisibleSection}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            toggleAutoApproval={toggleAutoApproval}
            autoApproval={autoApproval}
            handleBulkApprove={handleBulkApprove}
            handleBulkDelete={handleBulkDelete}
            handleSelectAll={handleSelectAll}
            setAchievements={setAchievements} // Pass setAchievements here
          />
        )}

        {visibleSection === "internships" && (
          <InternshipTable
            internships={internships}
            selectedInternships={selectedInternships}
            setSelectedInternships={setSelectedInternships}
            handleAction={handleAction}
            toggleAutoApproval={toggleAutoApproval}
            autoApproval={autoApproval}
            handleDelete={handleDelete}
            handleView={handleView}
            setVisibleSection={setVisibleSection}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            handleBulkApprove={handleBulkApprove}
            handleBulkDelete={handleBulkDelete}
            handleSelectAll={handleSelectAll}
          />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Provide Feedback</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleFeedbackSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
