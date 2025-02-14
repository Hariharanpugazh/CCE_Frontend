import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import JobTable from "../../components/SuperAdmin/ManagementTable/JobTable";
import AchievementTable from "../../components/SuperAdmin/ManagementTable/AchievementTable";
import InternshipTable from "../../components/SuperAdmin/ManagementTable/InternshipTable";

export default function MailPage() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const token = Cookies.get("jwt"); // Retrieve JWT from cookies

  // Decode JWT to check user role
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect if no token
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      if (payload.role !== "superadmin") {
        navigate("/"); // Redirect if not superadmin
      }
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/superadmin");
    }
  }, [token, navigate]);

  // Fetch jobs, achievements, and internships from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [jobsRes, achievementsRes, internshipsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/jobs", config),
          axios.get("http://localhost:8000/api/achievements/", config),
          axios.get("http://localhost:8000/api/internship/", config),
        ]);

        setJobs(jobsRes.data.jobs);
        setAchievements(achievementsRes.data.achievements);
        setInternships(internshipsRes.data.internships);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, [token]);

  // Fetch auto-approval status
  useEffect(() => {
    const fetchAutoApproval = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-auto-approval-status/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAutoApproval(response.data.is_auto_approval);
      } catch (err) {
        console.error("Error fetching auto-approval status:", err);
      }
    };
    fetchAutoApproval();
  }, [token]);

  // Handle Auto-Approval Toggle
  const toggleAutoApproval = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/toggle-auto-approval/",
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

  // Handle Approve/Reject action for Jobs, Achievements, and Internships
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
          ? `http://localhost:8000/api/review-job/${id}/`
          : type === "achievement"
          ? `http://localhost:8000/api/review-achievement/${id}/`
          : `http://localhost:8000/api/review-internship/${id}/`;

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
      setMessage(response.data.message);

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
      setError(`Failed to update ${type} status.`);
    }
  };

  // Handle Delete action for Jobs, Achievements, and Internships
  const handleDelete = async (id, type) => {
    try {
      const endpoint =
        type === "job"
          ? `http://localhost:8000/api/job-delete/${id}/`
          : type === "achievement"
          ? `http://localhost:8000/api/delete-achievement/${id}/`
          : `http://localhost:8000/api/internship-delete/${id}/`;

      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message);

      if (type === "job") {
        setJobs((prev) => prev.filter((job) => job._id !== id));
      } else if (type === "achievement") {
        setAchievements((prev) => prev.filter((achievement) => achievement._id !== id));
      } else {
        setInternships((prev) => prev.filter((internship) => internship._id !== id));
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      setError(`Failed to delete ${type}.`);
    }
  };

  // Handle View action for Jobs, Achievements, and Internships
  const handleView = (id, type) => {
    if (type === "job") {
      navigate(`/job-edit/${id}`);
    } else if (type === "achievement") {
      navigate(`/achievement-edit/${id}`);
    } else {
      navigate(`/internship-edit/${id}`);
    }
  };

  // Handle Select All action
  const handleSelectAll = (type) => {
    if (type === "job") {
      setSelectedJobs((prev) => (prev.length === jobs.length ? [] : jobs.map((job) => job._id)));
    } else if (type === "achievement") {
      setSelectedAchievements((prev) =>
        prev.length === achievements.length ? [] : achievements.map((achievement) => achievement._id)
      );
    } else {
      setSelectedInternships((prev) =>
        prev.length === internships.length ? [] : internships.map((internship) => internship._id)
      );
    }
  };

  // Handle Bulk Approve action
  const handleBulkApprove = async (type) => {
    const ids =
      type === "job"
        ? selectedJobs
        : type === "achievement"
        ? selectedAchievements
        : selectedInternships;

    try {
      const promises = ids.map((id) => handleAction(id, "approve", type));
      await Promise.all(promises);
      setMessage(`All selected ${type}s have been approved.`);
    } catch (err) {
      console.error(`Error bulk approving ${type}s:`, err);
      setError(`Failed to bulk approve ${type}s.`);
    }
  };

  // Handle Bulk Delete action
  const handleBulkDelete = async (type) => {
    const ids =
      type === "job"
        ? selectedJobs
        : type === "achievement"
        ? selectedAchievements
        : selectedInternships;

    if (window.confirm(`Are you sure you want to delete all selected ${type}s?`)) {
      try {
        const promises = ids.map((id) => handleDelete(id, type));
        await Promise.all(promises);
        setMessage(`All selected ${type}s have been deleted.`);
      } catch (err) {
        console.error(`Error bulk deleting ${type}s:`, err);
        setError(`Failed to bulk delete ${type}s.`);
      }
    }
  };

  // Handle Feedback Submission
  const handleFeedbackSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/submit-feedback/",
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
      setMessage(response.data.message);
      setShowModal(false);
      setFeedback("");
      setRejectedItemId(null);
      setRejectedItemType(null);

      // Update the state to reflect the rejection
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
      setError("Failed to submit feedback.");
    }
  };

  // Pagination handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <SuperAdminPageNavbar />
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Manage Jobs</h1>

      <div className="mb-4 flex items-center space-x-4">
        {/* Navigation Buttons */}
        <button
          className={`px-4 py-2 rounded ${visibleSection === "jobs" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setVisibleSection("jobs")}
        >
          Jobs
        </button>
        <button
          className={`px-4 py-2 rounded ${visibleSection === "achievements" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setVisibleSection("achievements")}
        >
          Achievements
        </button>
        <button
          className={`px-4 py-2 rounded ${visibleSection === "internships" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setVisibleSection("internships")}
        >
          Internships
        </button>

        {/* Auto-Approval Toggle */}
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-gray-700">Auto-Approval</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoApproval}
              onChange={toggleAutoApproval}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
            <span
              className={`absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-transform ${
                autoApproval ? "translate-x-5" : ""
              }`}
            ></span>
          </label>
        </div>
      </div>

      {visibleSection === "jobs" && (
        <JobTable
          jobs={jobs}
          selectedJobs={selectedJobs}
          setSelectedJobs={setSelectedJobs}
          handleAction={handleAction}
          handleDelete={handleDelete}
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
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
          handleBulkApprove={handleBulkApprove}
          handleBulkDelete={handleBulkDelete}
          handleSelectAll={handleSelectAll}
        />
      )}

      {visibleSection === "internships" && (
        <InternshipTable
          internships={internships}
          selectedInternships={selectedInternships}
          setSelectedInternships={setSelectedInternships}
          handleAction={handleAction}
          handleDelete={handleDelete}
          handleView={handleView}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
          handleBulkApprove={handleBulkApprove}
          handleBulkDelete={handleBulkDelete}
          handleSelectAll={handleSelectAll}
        />
      )}

      {/* Feedback Modal */}
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
