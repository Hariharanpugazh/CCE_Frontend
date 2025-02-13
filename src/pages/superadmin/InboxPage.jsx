import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("contactMessages");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5; // Change this as needed
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAchievements = achievements.slice(indexOfFirstItem, indexOfLastItem);
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);
  const currentInternships = internships.slice(indexOfFirstItem, indexOfLastItem);
  const currentStudyMaterials = studyMaterials.slice(indexOfFirstItem, indexOfLastItem);
  const currentStudentAchievements = studentAchievements.slice(indexOfFirstItem, indexOfLastItem);
  const currentMessages = messages.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  useEffect(() => {
    fetchMessages();
    fetchAchievements();
    fetchJobs();
    fetchInternships();
    fetchStudyMaterials();
    fetchStudentAchievements();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get-contact-messages/");
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Failed to fetch messages.");
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_achievements_with_admin/");
      setAchievements(response.data.achievements);
    } catch (err) {
      console.error("Failed to fetch achievements.");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_jobs_with_admin/");
      setJobs(response.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchInternships = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_internships_with_admin/");
      setInternships(response.data.internships);
    } catch (err) {
      console.error("Failed to fetch internships.");
    }
  };

  const fetchStudyMaterials = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_study_materials_with_admin/");
      console.log("Study Materials Response:", response.data);
      setStudyMaterials(response.data.study_materials || []);
    } catch (err) {
      console.error("Failed to fetch study materials:", err);
    }
  };

  const fetchStudentAchievements = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_student_achievements_with_students/");
      setStudentAchievements(response.data.student_achievements);
    } catch (err) {
      console.error("Failed to fetch student achievements.");
    }
  };  
  
  const sendReply = async (messageId) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/reply_to_message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message_id: messageId, reply_message: replyText[messageId] }),
      });

      const data = await response.json();
      if (data.success) {
        fetchMessages(); // Refresh messages after sending reply
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
    setLoading(false);
  };

  const handleReplyChange = (messageId, value) => {
    setReplyText((prev) => ({
      ...prev,
      [messageId]: value,
    }));
  };
  
  const toggleExpand = (index) => {
    setExpandedIndex(prevIndex => prevIndex === index ? null : index);
  };

  const Pagination = ({ totalItems, itemsPerPage, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 mx-1 border rounded ${
              currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };
  
  const renderContent = () => {
    switch (selectedCategory) {
      case "contactMessages":
        return (
          <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
            📩 Contact Messages
          </h2>
          {messages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-bold text-gray-800">{message.name}</h2>
                      <p className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">
                        {message.timestamp !== "Invalid Date"
                          ? new Date(message.timestamp).toLocaleString()
                          : "Invalid Date"}
                      </p>
                    </div>
    
                    {/* Contact Info */}
                    <p className="text-sm text-gray-600 font-medium flex items-center">
                      📞 {message.contact || "No contact available"}
                    </p>
    
                    {/* Expand Message Section */}
                    <button
                      className="mt-3 text-blue-600 font-medium hover:underline focus:outline-none"
                      onClick={() => toggleExpand(index)}
                    >
                      {expandedIndex === index ? "Hide Message" : "View Message"}
                    </button>
    
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          className="mt-4 bg-gray-50 rounded-lg shadow-inner p-4 border border-gray-300"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">💬 Message:</h3>
                          <p className="text-sm text-gray-700">{message.message}</p>
    
                          {/* Display Reply if Available */}
                          {message.reply_message ? (
                            <p className="mt-3 text-green-600 font-medium">✅ {message.reply_message}</p>
                          ) : (
                            <>
                              {/* Reply Input */}
                              <textarea
                                className="w-full mt-3 p-2 border rounded-lg"
                                placeholder="Type your reply..."
                                value={replyText[message._id] || ""}
                                onChange={(e) => handleReplyChange(message._id, e.target.value)}
                              />
                              <button
                                className="mt-3 w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                onClick={() => sendReply(message._id)}
                                disabled={loading}
                              >
                                {loading ? "Sending..." : "✉️ Send Reply"}
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
    
              {/* Pagination Controls */}
              {messages.length > itemsPerPage && (
                <div className="flex justify-center mt-4">
                  {[...Array(Math.ceil(messages.length / itemsPerPage)).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`px-3 py-1 mx-1 border rounded ${
                        currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 italic">No contact messages found.</p>
          )}
        </section>
        );               
        case "achievements":
          return (
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Achievements</h2>
              {achievements.length > 0 ? (
                <div className="bg-white shadow-md rounded-md">
                  {currentAchievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      className="border-b p-4 hover:bg-gray-100 cursor-pointer transition-all duration-300"
                      onClick={() => toggleExpand(index)}
                    >
                      {/* Header Section */}
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-lg text-gray-800">{achievement.admin_name}</span>
                          <p className="text-sm text-gray-500">{achievement.timestamp}</p>
                        </div>
                        <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {achievement.achievement_data.type}
                        </span>
                      </div>

                      {/* Short Description */}
                      <p className="text-gray-700 mt-2 font-medium">{achievement.message}</p>
                      <p className="text-sm text-gray-600 italic">{achievement.achievement_data.description}</p>

                      {/* Expandable Details Section */}
                      <AnimatePresence>
                        {expandedIndex === index && (
                          <motion.div
                            className="mt-4 text-gray-700 bg-gray-50 rounded-lg shadow-inner p-3 border border-gray-200"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3 className="text-base font-medium text-gray-800">Details:</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-semibold">🏆 Type:</span> {achievement.achievement_data.type}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">🏢 Company:</span> {achievement.achievement_data.company}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">📅 Date:</span> {achievement.achievement_data.date}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No achievements found.</p>
              )}

              {/* Pagination Component */}
              {achievements.length > itemsPerPage && (
                <div className="flex justify-center mt-4">
                  {[...Array(Math.ceil(achievements.length / itemsPerPage)).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`px-3 py-1 mx-1 border rounded ${
                        currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
          case "internships":
            return (
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Internships</h2>
                {internships.length > 0 ? (
                  <div className="bg-white shadow-md rounded-md">
                    {currentInternships.map((internship, index) => (
                      <motion.div
                        key={index}
                        className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => toggleExpand(index)}
                      >
                        {/* Header Section */}
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">{internship.admin_name}</span>
                          <span className="text-sm text-gray-500">{new Date(internship.timestamp).toLocaleString()}</span>
                        </div>
          
                        {/* Internship Title & Company */}
                        <h3 className="text-lg font-bold text-gray-800 mt-2">{internship.internship_data.title}</h3>
                        <p className="text-sm text-gray-600 italic">{internship.internship_data.company}</p>
          
                        {/* Expandable Content */}
                        <AnimatePresence>
                          {expandedIndex === index && (
                            <motion.div
                              className="mt-4 text-gray-700 bg-white rounded-lg shadow-inner p-3 border border-gray-200"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {/* Internship Description */}
                              <p className="text-sm text-gray-600">{internship.internship_data.description}</p>
          
                              {/* Internship Details Grid */}
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
                                  <p className="text-gray-600 font-semibold">Deadline:</p>
                                  <p className="text-sm">{new Date(internship.internship_data.deadline).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 font-semibold">Location:</p>
                                  <p className="text-sm">{internship.internship_data.location}</p>
                                </div>
                              </div>
          
                              {/* Responsibilities & Skills */}
                              <div className="mt-3">
                                <h4 className="text-gray-800 font-semibold">Required Skills:</h4>
                                <p className="text-sm text-gray-700">
                                  {internship.internship_data.required_skills && internship.internship_data.required_skills.length > 0
                                    ? internship.internship_data.required_skills.join(", ")
                                    : "Not specified"}
                                </p>
                              </div>
          
                              {/* Contact & Apply */}
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                  <p className="text-gray-600 font-semibold">Contact:</p>
                                  <p className="text-sm">{internship.internship_data.company || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 font-semibold">Website:</p>
                                  <a
                                    href={internship.internship_data.company_website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-sm"
                                  >
                                    {internship.internship_data.company_website}
                                  </a>
                                </div>
                              </div>
          
                              {/* Apply Now Button */}
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
          
                {/* Pagination Component */}
                {internships.length > itemsPerPage && (
                  <div className="flex justify-center mt-4">
                    {[...Array(Math.ceil(internships.length / itemsPerPage)).keys()].map((number) => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`px-3 py-1 mx-1 border rounded ${
                          currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            );                  
            case "studyMaterials":
              return (
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Study Materials</h2>
                  {studyMaterials.length > 0 ? (
                    <div className="bg-white shadow-md rounded-md">
                      {currentStudyMaterials.map((material, index) => (
                        <motion.div
                          key={index}
                          className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                          onClick={() => toggleExpand(index)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{material.admin_name}</span>
                            <span className="text-sm text-gray-500">{material.timestamp}</span>
                          </div>
                          <p className="text-gray-700">{material.message}</p>
                          <p className="text-sm text-gray-600 font-medium">
                            {material.study_material_data?.title || "No Title"}
                          </p>
                          <AnimatePresence>
                            {expandedIndex === index && (
                              <motion.div
                                className="mt-4 text-gray-700 bg-white rounded-lg shadow-inner p-3 border border-gray-200"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <h3 className="text-base font-medium text-gray-800">Details:</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  <strong>Category:</strong> {material.study_material_data?.category || "Uncategorized"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Description:</strong> {material.study_material_data?.description || "No description"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Content:</strong> {material.study_material_data?.text_content || "No content available"}
                                </p>
                                {material.study_material_data?.link && (
                                  <a
                                    href={material.study_material_data.link}
                                    className="text-blue-500 text-sm underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View More
                                  </a>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">No study materials found.</p>
                  )}
            
                  {/* Pagination Controls */}
                  {studyMaterials.length > itemsPerPage && (
                    <div className="flex justify-center mt-4">
                      {[...Array(Math.ceil(studyMaterials.length / itemsPerPage)).keys()].map((number) => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`px-3 py-1 mx-1 border rounded ${
                            currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                          }`}
                        >
                          {number + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              );            
            case "Jobs":
              return (
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Jobs</h2>
                  {jobs.length > 0 ? (
                    <div className="bg-white shadow-md rounded-md">
                      {currentJobs.map((job, index) => (
                        <motion.div
                          key={index}
                          className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                          onClick={() => toggleExpand(index)}
                        >
                          {/* Header Section */}
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">{job.admin_name}</span>
                            <span className="text-sm text-gray-500">{new Date(job.timestamp).toLocaleString()}</span>
                          </div>
            
                          {/* Job Title & Company */}
                          <h3 className="text-lg font-bold text-gray-800 mt-2">{job.job_data.title}</h3>
                          <p className="text-sm text-gray-600 italic">{job.job_data.company_name}</p>
            
                          {/* Expandable Content */}
                          <AnimatePresence>
                            {expandedIndex === index && (
                              <motion.div
                                className="mt-4 text-gray-700 bg-white rounded-lg shadow-inner p-3 border border-gray-200"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {/* Company Overview */}
                                <p className="text-sm text-gray-600">{job.job_data.company_overview}</p>
            
                                {/* Job Details Grid */}
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
                                    <p className="text-gray-600 font-semibold">Work Type:</p>
                                    <p className="text-sm">{job.job_data.selectedWorkType || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600 font-semibold">Location:</p>
                                    <p className="text-sm">{job.job_data.job_location}</p>
                                  </div>
                                </div>
            
                                {/* Responsibilities */}
                                <div className="mt-3">
                                  <h4 className="text-gray-800 font-semibold">Responsibilities:</h4>
                                  <p className="text-sm text-gray-700">{job.job_data.key_responsibilities}</p>
                                </div>
            
                                {/* Deadline & Contact */}
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <p className="text-gray-600 font-semibold">Deadline:</p>
                                    <p className="text-sm">{new Date(job.job_data.application_deadline).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600 font-semibold">Contact:</p>
                                    <p className="text-sm">{job.job_data.contact_email}</p>
                                  </div>
                                </div>
            
                                {/* Apply Now Button */}
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
            
                  {/* Pagination Component */}
                  {jobs.length > itemsPerPage && (
                    <div className="flex justify-center mt-4">
                      {[...Array(Math.ceil(jobs.length / itemsPerPage)).keys()].map((number) => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`px-3 py-1 mx-1 border rounded ${
                            currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                          }`}
                        >
                          {number + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              );                    
              case "studentAchievements":
                return (
                  <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Student Achievements</h2>
                    {studentAchievements.length > 0 ? (
                      <div className="bg-white shadow-md rounded-md">
                        {currentStudentAchievements.map((achievement, index) => (
                          <motion.div
                            key={index}
                            className="border-b p-4 hover:bg-gray-100 cursor-pointer transition-all duration-300"
                            onClick={() => toggleExpand(index)}
                          >
                            {/* Header Section */}
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-semibold text-lg text-gray-800">{achievement.student_name}</span>
                                <p className="text-sm text-gray-500">{new Date(achievement.timestamp).toLocaleString()}</p>
                              </div>
                              <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {achievement.achievement_data.type}
                              </span>
                            </div>

                            {/* Short Description */}
                            <p className="text-gray-700 mt-2 font-medium">{achievement.message}</p>

                            {/* Expandable Details Section */}
                            <AnimatePresence>
                              {expandedIndex === index && (
                                <motion.div
                                  className="mt-4 bg-gray-50 rounded-lg shadow-inner p-4 border border-gray-300"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🎖 Achievement Details</h3>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-semibold">🏆 Type:</span> {achievement.achievement_data.type}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-semibold">🏢 Company:</span> {achievement.achievement_data.company}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-semibold">📅 Date:</span> {achievement.achievement_data.date}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-semibold">🎓 Batch:</span> {achievement.achievement_data.batch}
                                  </p>

                                  {/* Image Preview */}
                                  {achievement.achievement_data.photo ? (
                                    <div className="mt-3">
                                      <img
                                        src={`data:image/jpeg;base64,${achievement.achievement_data.photo}`}
                                        alt="Achievement"
                                        className="w-28 h-28 rounded-lg shadow-md border"
                                      />
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 italic mt-2">No image available</p>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-600">No student achievements found.</p>
                    )}

                    {/* Pagination Controls */}
                    {studentAchievements.length > itemsPerPage && (
                      <div className="flex justify-center mt-4">
                        {[...Array(Math.ceil(studentAchievements.length / itemsPerPage)).keys()].map((number) => (
                          <button
                            key={number + 1}
                            onClick={() => paginate(number + 1)}
                            className={`px-3 py-1 mx-1 border rounded ${
                              currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                          >
                            {number + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                );
        default:
      return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <SuperAdminPageNavbar />
      <div className="flex flex-1">
        <div className="w-1/5 bg-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul>
          <li onClick={() => setSelectedCategory("Jobs")} className="cursor-pointer p-2 hover:bg-gray-300">Jobs</li>
          <li onClick={() => setSelectedCategory("internships")} className="cursor-pointer p-2 hover:bg-gray-300">Internships</li>
          <li onClick={() => setSelectedCategory("achievements")} className="cursor-pointer p-2 hover:bg-gray-300">Achievements</li>
          <li onClick={() => setSelectedCategory("studentAchievements")} className="cursor-pointer p-2 hover:bg-gray-300">Student Achievements</li>
          <li onClick={() => setSelectedCategory("studyMaterials")} className="cursor-pointer p-2 hover:bg-gray-300">Study Materials</li>
          <li onClick={() => setSelectedCategory("contactMessages")} className="cursor-pointer p-2 hover:bg-gray-300">Contact Messages</li>
          </ul>
        </div>
        <div className="w-4/5 p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default InboxPage;
