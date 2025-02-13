import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

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
    console.log("Toggle clicked! Current state:", autoApproval); // Debugging log
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

  return (
    <div className="container mx-auto p-4">
      <SuperAdminPageNavbar />
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Mail Inbox</h1>
      <div className="flex items-center space-x-4">
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
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Job Approvals Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Job Approvals</h2>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => handleBulkApprove("job")}
            >
              Approve all
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => handleBulkDelete("job")}
            >
              Delete all
            </button>
            <input
              type="checkbox"
              checked={selectedJobs.length === jobs.length}
              onChange={() => handleSelectAll("job")}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Select All</span>
          </div>
        </div>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Select</th>
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Company</th>
                  <th className="border border-gray-300 px-4 py-2">Staff Name</th>
                  <th className="border border-gray-300 px-4 py-2">Location</th>
                  <th className="border border-gray-300 px-4 py-2">Salary</th>
                  <th className="border border-gray-300 px-4 py-2">Deadline</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job._id)}
                        onChange={() =>
                          setSelectedJobs((prev) =>
                            prev.includes(job._id)
                              ? prev.filter((id) => id !== job._id)
                              : [...prev, job._id]
                          )
                        }
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.company_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.admin_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.job_location}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.salary_range}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.application_deadline}</td>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      {job.is_publish === true ? (
                        <span className="text-green-600">✔ Approved</span>
                      ) : job.is_publish === false ? (
                        <span className="text-red-600">✖ Rejected</span>
                      ) : (
                        <span className="text-yellow-600">⏳ Waiting for Approval</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex space-x-2">
                        {job.is_publish === null && ( // Show buttons only for pending jobs
                          <>
                            <IoMdCheckmark
                              className="text-green-500 cursor-pointer"
                              size={20}
                              onClick={() => handleAction(job._id, "approve", "job")}
                            />
                            <FaXmark
                              className="text-red-500 cursor-pointer"
                              size={20}
                              onClick={() => handleAction(job._id, "reject", "job")}
                            />
                          </>
                        )}
                        <FaEye
                          className="text-blue-500 cursor-pointer"
                          size={20}
                          onClick={() => handleView(job._id, "job")}
                        />
                        <FaTrashAlt
                          className="text-red-500 cursor-pointer"
                          size={20}
                          onClick={() => handleDelete(job._id, "job")}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Achievement Approvals Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Achievement Approvals</h2>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => handleBulkApprove("achievement")}
            >
              Approve all
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => handleBulkDelete("achievement")}
            >
              Delete all
            </button>
            <input
              type="checkbox"
              checked={selectedAchievements.length === achievements.length}
              onChange={() => handleSelectAll("achievement")}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Select All</span>
          </div>
        </div>

        {achievements.length === 0 ? (
          <p className="text-gray-600">No achievements to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Select</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Description</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">Company</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Batch</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((achievement) => (
                  <tr key={achievement._id}>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedAchievements.includes(achievement._id)}
                        onChange={() =>
                          setSelectedAchievements((prev) =>
                            prev.includes(achievement._id)
                              ? prev.filter((id) => id !== achievement._id)
                              : [...prev, achievement._id]
                          )
                        }
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.achievement_description}</td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.achievement_type}</td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.company_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.date_of_achievement}</td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.batch}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {achievement.is_publish ? "Published" : "Pending"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex space-x-2">
                        {!achievement.is_publish && (
                          <>
                            <IoMdCheckmark
                              className="text-green-500 cursor-pointer"
                              size={20}
                              onClick={() => handleAction(achievement._id, "approve", "achievement")}
                            />
                            <FaXmark
                              className="text-red-500 cursor-pointer"
                              size={20}
                              onClick={() => handleAction(achievement._id, "reject", "achievement")}
                            />
                          </>
                        )}
                        <FaEye
                          className="text-blue-500 cursor-pointer"
                          size={20}
                          onClick={() => handleView(achievement._id, "achievement")}
                        />
                        <FaTrashAlt
                          className="text-red-500 cursor-pointer"
                          size={20}
                          onClick={() => handleDelete(achievement._id, "achievement")}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Internship Approvals Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Internship Approvals</h2>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => handleBulkApprove("internship")}
            >
              Approve all
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => handleBulkDelete("internship")}
            >
              Delete all
            </button>
            <input
              type="checkbox"
              checked={selectedInternships.length === internships.length}
              onChange={() => handleSelectAll("internship")}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Select All </span>
          </div>
        </div>
        {internships.length === 0 ? (
          <p className="text-gray-600">No internships to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Select</th>
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Company</th>
                  <th className="border border-gray-300 px-4 py-2">Staff Name</th>
                  <th className="border border-gray-300 px-4 py-2">Location</th>
                  <th className="border border-gray-300 px-4 py-2">Stipend</th>
                  <th className="border border-gray-300 px-4 py-2">Duration</th>
                  <th className="border border-gray-300 px-4 py-2">Deadline</th>
                  <th className="border border-gray-300 px-4 py-2">Required Skills</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((internship) => {
                  const data = internship.internship_data || {};
                  return (
                    <tr key={internship._id}>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedInternships.includes(internship._id)}
                          onChange={() =>
                            setSelectedInternships((prev) =>
                              prev.includes(internship._id)
                                ? prev.filter((id) => id !== internship._id)
                                : [...prev, internship._id]
                            )
                          }
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{data.title || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{data.company_name || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{internship.admin_name || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{data.location || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{data.stipend || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{data.duration || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{data.application_deadline || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{data.required_skills ? data.required_skills.join(", ") : "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{data.internship_type || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        {internship.is_publish === true ? (
                          <span className="text-green-600">✔ Approved</span>
                        ) : internship.is_publish === false ? (
                          <span className="text-red-600">✖ Rejected</span>
                        ) : (
                          <span className="text-yellow-600">⏳ Waiting for Approval</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex space-x-2">
                          {internship.is_publish === null && (
                            <>
                              <IoMdCheckmark
                                className="text-green-500 cursor-pointer"
                                size={20}
                                onClick={() => handleAction(internship._id, "approve", "internship")}
                              />
                              <FaXmark
                                className="text-red-500 cursor-pointer"
                                size={20}
                                onClick={() => handleAction(internship._id, "reject", "internship")}
                              />
                            </>
                          )}
                          <FaEye
                            className="text-blue-500 cursor-pointer"
                            size={20}
                            onClick={() => handleView(internship._id, "internship")}
                          />
                          <FaTrashAlt
                            className="text-red-500 cursor-pointer"
                            size={20}
                            onClick={() => handleDelete(internship._id, "internship")}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
