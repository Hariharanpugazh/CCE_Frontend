import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import AdminPageNavbar from '../../components/Admin/AdminNavBar';

export default function AdminMail() {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const token = Cookies.get("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("JWT token not found!");
      setLoading(false);
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/mailjobs/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }

        const data = await response.json();
        setJobs(data.jobs);
        setInternships(data.internships);
        setAchievements(data.achievements);
        setStudyMaterials(data.study_materials);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReview = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/fetch-review/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch review');
        }

        const data = await response.json();
        setReviews(data.reviews);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
    fetchReview();
  }, [token, navigate]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const toggleExpand = (index) => {
    setExpandedIndex(prevIndex => prevIndex === index ? null : index);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "jobs":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Jobs</h2>
            {jobs.length > 0 ? (
              <div className="bg-white shadow-md rounded-md">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{job.job_data.title}</span>
                      <div className="flex space-x-2">
                        <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{job.status}</span>
                        <span className={`text-xs px-2 py-1 rounded ${job.is_publish === true ? 'bg-green-200 text-green-800' : job.is_publish === false ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {job.is_publish === true ? 'Approved' : job.is_publish === false ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{job.job_data.company_name}</p>
                    <p className="text-gray-700">Edited by: {job.edited || "null"}</p>
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          className="mt-4 text-gray-700 bg-gray-50 rounded-lg shadow-inner p-4 border border-gray-300"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-sm text-gray-600">{job.job_data.job_description}</p>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-gray-600 font-semibold">Experience:</p>
                              <p className="text-sm">{job.job_data.experience_level}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-semibold">Salary:</p>
                              <p className="text-sm">{job.job_data.salary_range}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-semibold">Location:</p>
                              <p className="text-sm">{job.job_data.job_location}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-semibold">Work Type:</p>
                              <p className="text-sm">{job.job_data.selectedWorkType}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <a
                              href={job.job_data.job_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center inline-block"
                            >
                              Apply Now
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No job posts found.</p>
            )}
          </section>
        );

      case "internships":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Internships</h2>
            {internships.length > 0 ? (
              <div className="bg-white shadow-md rounded-md">
                {internships.map((internship, index) => (
                  <motion.div
                    key={internship._id}
                    className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{internship.internship_data.title}</span>
                      <div className="flex space-x-2">
                        <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{internship.status}</span>
                        <span className={`text-xs px-2 py-1 rounded ${internship.is_publish === true ? 'bg-green-200 text-green-800' : internship.is_publish === false ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {internship.is_publish === true ? 'Approved' : internship.is_publish === false ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{internship.internship_data.company_name}</p>
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          className="mt-4 text-gray-700 bg-gray-50 rounded-lg shadow-inner p-4 border border-gray-300"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-sm text-gray-600">{internship.internship_data.job_description}</p>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-gray-600 font-semibold">Duration:</p>
                              <p className="text-sm">{internship.internship_data.duration}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-semibold">Stipend:</p>
                              <p className="text-sm">{internship.internship_data.stipend}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-semibold">Location:</p>
                              <p className="text-sm">{internship.internship_data.location}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-semibold">Type:</p>
                              <p className="text-sm">{internship.internship_data.internship_type}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <a
                              href={internship.internship_data.job_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-center inline-block"
                            >
                              Apply Now
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No internships found.</p>
            )}
          </section>
        );

      case "achievements":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Achievements</h2>
            {achievements.length > 0 ? (
              <div className="bg-white shadow-md rounded-md">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement._id}
                    className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{achievement.name}</span>
                      <div className="flex space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${achievement.is_publish === true ? 'bg-green-200 text-green-800' : achievement.is_publish === false ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {achievement.is_publish === true ? 'Approved' : achievement.is_publish === false ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{achievement.achievement_description}</p>
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          className="mt-4 text-gray-700 bg-gray-50 rounded-lg shadow-inner p-4 border border-gray-300"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-sm text-gray-600">Type: {achievement.achievement_type}</p>
                          <p className="text-sm text-gray-600">Company: {achievement.company_name}</p>
                          <p className="text-sm text-gray-600">Batch: {achievement.batch}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No achievements found.</p>
            )}
          </section>
        );

      case "study_materials":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Study Materials</h2>
            {studyMaterials.length > 0 ? (
              <div className="bg-white shadow-md rounded-md">
                {studyMaterials.map((material, index) => (
                  <motion.div
                    key={material._id}
                    className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{material.study_material_data.title}</span>
                      <div className="flex space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${material.is_publish === true ? 'bg-green-200 text-green-800' : material.is_publish === false ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {material.is_publish === true ? 'Approved' : material.is_publish === false ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{material.study_material_data.description}</p>
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          className="mt-4 text-gray-700 bg-gray-50 rounded-lg shadow-inner p-4 border border-gray-300"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-sm text-gray-600">Category: {material.study_material_data.category}</p>
                          <p className="text-sm text-gray-600">Content: {material.study_material_data.text_content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No study materials found.</p>
            )}
          </section>
        );

      case "notifications":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Notifications</h2>
            {reviews.length > 0 ? (
              <div className="bg-white shadow-md rounded-md">
                {reviews.map((review, index) => (
                  <Link
                    to={review.item_type === 'internship' ? `/internship-edit/${review.item_id}` : `/job-edit/${review.item_id}`}
                    key={review.review_id}
                    className="block border-b p-4 hover:bg-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{review.item_name || 'Notification'}</span>
                      <span className="text-sm text-gray-500">{new Date(review.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700">Type: {review.item_type}</p>
                    <p className="text-gray-700">Feedback: {review.feedback}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No notifications found.</p>
            )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminPageNavbar />
      <div className="flex flex-1">
        <div className="w-1/5 bg-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul>
            <li onClick={() => setActiveTab("jobs")} className="cursor-pointer p-2 hover:bg-gray-300">Jobs</li>
            <li onClick={() => setActiveTab("internships")} className="cursor-pointer p-2 hover:bg-gray-300">Internships</li>
            <li onClick={() => setActiveTab("achievements")} className="cursor-pointer p-2 hover:bg-gray-300">Achievements</li>
            <li onClick={() => setActiveTab("study_materials")} className="cursor-pointer p-2 hover:bg-gray-300">Study Materials</li>
            <li onClick={() => setActiveTab("notifications")} className="cursor-pointer p-2 hover:bg-gray-300">Notifications</li>
          </ul>
        </div>
        <div className="w-4/5 p-4">{renderContent()}</div>
      </div>
    </div>
  );
}
