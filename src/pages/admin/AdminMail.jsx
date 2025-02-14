import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import AdminPageNavbar from '../../components/Admin/AdminNavBar';
import { FaInfoCircle } from 'react-icons/fa'; // Import an icon from react-icons


export default function AdminMail() {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
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

  const renderContent = () => {
    switch (activeTab) {
      case "jobs":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black">Jobs</h2>
            {jobs.length > 0 ? (
              <div className="bg-white shadow-md rounded-md">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="shadow-xs hover:shadow-md  transition-transform duration-300 hover:scale-y-105 relative"
                  >
                    <div className="flex justify-between items-center p-4 relative">
                      <div className="flex-1 grid grid-cols-2 ">
                        <span className="font-semibold text-lg">{job.job_data.title}</span>
                        <span className="text-gray-700 ">{job.job_data.company_name}</span>
                      </div>
                      <div className="flex space-x-2 items-center absolute right-4">
                        {job.edited && (
                          <div className="relative group">
  <FaInfoCircle className="text-gray-700 cursor-pointer" />
  <span className="absolute top-1/2 -translate-y-1/2 right-full hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 whitespace-nowrap">
    Edited by {job.edited}
  </span>
</div>

                        )}
                        <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{job.status}</span>
                        <span className={`text-xs px-2 py-1 rounded ${job.is_publish === true ? 'bg-green-200 text-green-800' : job.is_publish === false ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {job.is_publish === true ? 'Approved' : job.is_publish === false ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
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
                {internships.map((internship) => (
                  <motion.div
                    key={internship._id}
                    className="shadow-xs hover:shadow-md overflow-hidden transition-transform duration-300 hover:scale-y-105 relative"
                  >
                    <div className="flex justify-between items-center p-4 relative">
                      <div className="flex-1 grid grid-cols-2">
                        <span className="font-semibold text-lg">{internship.internship_data.title}</span>
                        <span className="text-gray-700 pl-4">{internship.internship_data.company_name}</span>
                      </div>
                      <div className="flex space-x-2 items-center absolute right-4">
                        <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{internship.status}</span>
                        <span className={`text-xs px-2 py-1 rounded ${internship.is_publish === true ? 'bg-green-200 text-green-800' : internship.is_publish === false ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {internship.is_publish === true ? 'Approved' : internship.is_publish === false ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
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
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement._id}
                    className="shadow-xs hover:shadow-md overflow-hidden transition-transform duration-300 hover:scale-y-105 relative"
                  >
                    <div className="flex justify-between items-center p-4 relative">
                      <div className="flex-1 grid grid-cols-2">
                        <span className="font-semibold text-lg">{achievement.name}</span>
                        <span className="text-sm text-gray-600 pl-4">Type: {achievement.achievement_type}</span>
                        <span className="text-sm text-gray-600 pl-4">Company: {achievement.company_name}</span>
                        <span className="text-sm text-gray-600 pl-4">Batch: {achievement.batch}</span>
                      </div>
                      <div className="flex space-x-2 items-center absolute right-4">
                        <span className={`text-xs px-2 py-1 rounded ${achievement.is_publish === true ? 'bg-green-200 text-green-800' : achievement.is_publish === false ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {achievement.is_publish === true ? 'Approved' : achievement.is_publish === false ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
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
                {studyMaterials.map((material) => (
                  <motion.div
                    key={material._id}
                    className="shadow-xs hover:shadow-md overflow-hidden transition-transform duration-300 hover:scale-y-105 relative"
                  >
                    <div className="flex justify-between items-center p-4 relative">
                      <div className="flex-1 grid grid-cols-2">
                        <span className="font-semibold text-lg">{material.study_material_data.title}</span>
                        <span className="text-sm text-gray-600 pl-4">Category: {material.study_material_data.category}</span>
                      </div>
                      <div className="flex space-x-2 items-center absolute right-4">
                        <span className={`text-xs px-2 py-1 rounded ${material.is_publish === true ? 'bg-green-200 text-green-800' : material.is_publish === false ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {material.is_publish === true ? 'Approved' : material.is_publish === false ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No study materials found.</p>
            )}
          </section>
        );

      case "notifications":
        // Sort reviews by timestamp in descending order
        const sortedReviews = [...reviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Notifications</h2>
            {sortedReviews.length > 0 ? (
              <div className="bg-white shadow-md rounded-md">
                {sortedReviews.map((review) => {
                  const reviewDate = new Date(review.timestamp);
                  const today = new Date();
                  const isToday = reviewDate.toDateString() === today.toDateString();

                  const formattedTime = isToday
                    ? reviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : reviewDate.toLocaleDateString();

                  return (
                    <Link
                      to={review.item_type === 'internship' ? `/internship-edit/${review.item_id}` : `/job-edit/${review.item_id}`}
                      key={review.review_id}
                      className="block shadow-xs hover:shadow-md overflow-hidden transition-transform duration-300 hover:scale-y-105 relative"
                    >
                      <div className="flex justify-between items-center p-4 relative">
                        <div className="flex-1 grid grid-cols-3">
                          <span className="font-semibold text-lg">{review.item_name || 'Notification'}</span>
                          <span className="text-gray-700 ">{review.item_type}</span>
                          <span className="text-gray-700 ">Feedback: {review.feedback}</span>
                        </div>
                        <div className="flex space-x-2 items-center absolute right-4">
                          <span className="text-gray-700">{formattedTime}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
