import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { Mail, Briefcase, GraduationCap, BookOpen, Trophy, Search, X } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FaCheckDouble, FaCheck } from "react-icons/fa";

const InboxPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Jobs");
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState({
    contactMessages: 1,
    achievements: 1,
    internships: 1,
    studyMaterials: 1,
    Jobs: 1,
    studentAchievements: 1,
  });
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const itemsPerPage = 6;

  const paginate = (category, pageNumber) => {
    setCurrentPage((prev) => ({
      ...prev,
      [category]: pageNumber,
    }));
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setAdminId(decodedToken.superadmin_user); // Extract SuperAdmin ID
    } catch (error) {
      console.error("Invalid token format.");
    }

    fetchAllStudents();
    fetchMessages(selectedStudent);
    fetchAchievements();
    fetchJobs();
    fetchInternships();
    fetchStudyMaterials();
    fetchStudentAchievements();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    // Reset selectedItem when the category changes
    setSelectedItem(null);
  }, [selectedCategory]);

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get("https://cce-backend-54k0.onrender.com/api/get_all_student_chats/", {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });
      setStudents(response.data.chats || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchMessages = async (student_id) => {
    setSelectedStudent(student_id);
    try {
      const response = await axios.get(`https://cce-backend-54k0.onrender.com/api/get_student_messages/${student_id}/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markMessagesAsSeen = async (student_id) => {
    try {
      const response = await axios.post(`https://cce-backend-54k0.onrender.com/api/mark_messages_as_seen/${student_id}/`, {}, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });
      if (response.status === 200) {
        fetchMessages(student_id); // Refresh messages to reflect the status change
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  const sendReply = async () => {
    if (!selectedStudent) {
      console.error("No student selected.");
      return;
    }

    const replyData = {
      student_id: selectedStudent,
      content: reply,
    };

    try {
      const response = await axios.post("https://cce-backend-54k0.onrender.com/api/admin_reply_message/", replyData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });
      if (response.status === 200) {
        setReply(""); // Clear input field
        fetchMessages(selectedStudent); // Refresh chat
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await axios.get("https://cce-backend-54k0.onrender.com/api/get_achievements_with_admin/");
      setAchievements(response.data.achievements || []);
    } catch (err) {
      console.error("Failed to fetch achievements.");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("https://cce-backend-54k0.onrender.com/api/get_jobs_with_admin/");
      let jobsData = response.data.jobs || [];
      if (Array.isArray(jobsData)) {
        jobsData = jobsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setJobs(jobsData);
      } else {
        console.error("Unexpected data format:", jobsData);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchInternships = async () => {
    try {
      const response = await axios.get("https://cce-backend-54k0.onrender.com/api/get_internships_with_admin/");
      let internshipsData = response.data.internships || [];
      if (Array.isArray(internshipsData)) {
        internshipsData = internshipsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setInternships(internshipsData);
      } else {
        console.error("Unexpected data format:", internshipsData);
      }
    } catch (err) {
      console.error("Failed to fetch internships.", err);
    }
  };

  const fetchStudyMaterials = async () => {
    try {
      const response = await axios.get("https://cce-backend-54k0.onrender.com/api/get_study_materials_with_admin/");
      setStudyMaterials(response.data.study_materials || []);
    } catch (err) {
      console.error("Failed to fetch study materials:", err);
    }
  };

  const fetchStudentAchievements = async () => {
    try {
      const response = await axios.get("https://cce-backend-54k0.onrender.com/api/get_student_achievements_with_students/");
      setStudentAchievements(response.data.student_achievements || []);
    } catch (err) {
      console.error("Failed to fetch student achievements.");
    }
  };

  const handleReplyChange = (messageId, value) => {
    setReplyText((prev) => ({
      ...prev,
      [messageId]: value,
    }));
  };

  const renderContent = () => {
    let itemsToDisplay = [];
    const currentPageNumber = currentPage[selectedCategory];

    switch (selectedCategory) {
      case "contactMessages":
        itemsToDisplay = students.slice((currentPageNumber - 1) * itemsPerPage, currentPageNumber * itemsPerPage);
        break;
      case "achievements":
        itemsToDisplay = achievements.slice((currentPageNumber - 1) * itemsPerPage, currentPageNumber * itemsPerPage);
        break;
      case "internships":
        itemsToDisplay = internships.slice((currentPageNumber - 1) * itemsPerPage, currentPageNumber * itemsPerPage);
        break;
      case "studyMaterials":
        itemsToDisplay = studyMaterials.slice((currentPageNumber - 1) * itemsPerPage, currentPageNumber * itemsPerPage);
        break;
      case "Jobs":
        itemsToDisplay = jobs.slice((currentPageNumber - 1) * itemsPerPage, currentPageNumber * itemsPerPage);
        break;
      case "studentAchievements":
        itemsToDisplay = studentAchievements.slice((currentPageNumber - 1) * itemsPerPage, currentPageNumber * itemsPerPage);
        break;
      default:
        return null;
    }

    const filteredItems = itemsToDisplay.filter(item =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.admin_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <section>
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200"
                onClick={async () => {
                  if (selectedCategory === "contactMessages") {
                    setSelectedStudent(item.student_id);
                    await markMessagesAsSeen(item.student_id);
                    await fetchMessages(item.student_id);
                    const response = await axios.get(`https://cce-backend-54k0.onrender.com/api/profile/${item.student_id}/`);
                    const data = response.data;
                    item.name = data.data.name;
                    setIsChatOpen(true);
                  } else {
                    setSelectedItem(item);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {item.name || item.student_email || item.title || item.company_name || item.admin_name || item.student_name}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">
                  {selectedCategory === "contactMessages"
                    ? "View messages"
                    : item.message || item.description || item.job_description || "No Description"}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No items found.</p>
        )}
        {filteredItems.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            {[...Array(Math.ceil(filteredItems.length / itemsPerPage)).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(selectedCategory, number + 1)}
                className={`px-3 py-1 mx-1 border rounded ${
                  currentPage[selectedCategory] === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderChatInterface = () => {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setIsChatOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold ml-2">Chat with {selectedStudent && students.find(student => student.student_id === selectedStudent)?.name}</h2>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] p-4 bg-gray-100 rounded-lg shadow-inner">
          {messages.length > 0 ? (
            messages.map((message, index) => {
              const dateLabel = formatDate(message.timestamp);
              const shouldShowDate =
                index === 0 || formatDate(messages[index - 1].timestamp) !== dateLabel;

              return (
                <React.Fragment key={index}>
                  {shouldShowDate && (
                    <div className="text-center text-gray-500 mb-2">
                      {dateLabel}
                    </div>
                  )}
                  <div className="flex items-start mb-4">
                    <div
                      className={`flex flex-col ${
                        message.sender === "admin" ? "items-end ml-auto" : "items-start mr-auto"
                      }`}
                    >
                      <div
                        className={`flex items-start ${
                          message.sender === "admin" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.sender !== "admin" && (
                          <div
                            className={`w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg mr-2`}
                          >
                            S
                          </div>
                        )}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg w-xs ${
                            message.sender === "admin" ? "bg-gray-200" : "bg-blue-500 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex justify-end items-center mt-1 text-xs">
                            {message.sender === "admin" && (
                              <>
                                <span className="mr-1 text-gray-500">
                                  {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {message.status === "seen" ? <FaCheckDouble /> : <FaCheck />}
                              </>
                            )}
                            {message.sender !== "admin" && (
                              <span className="text-white">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        </motion.div>
                        {message.sender === "admin" && (
                          <div
                            className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg text-gray-700 ml-2`}
                          >
                            A
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <p className="text-center text-gray-500 italic">No messages found.</p>
          )}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            onClick={sendReply}
            className="ml-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-sm"
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    if (!selectedItem) return null;

    const { job_data, internship_data, study_material_data, item_type, item_id } = selectedItem;

    if (selectedCategory === "studentAchievements" || selectedCategory === "achievements") {
      const { student_name, achievement_data } = selectedItem;
      return (
        <div className="flex-1 relative p-4 bg-gray-100 rounded-lg shadow-xl mt-10">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
            onClick={() => setSelectedItem(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-700 text-lg">
                {student_name ? student_name[0] : 'A'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{student_name}</h2>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{achievement_data?.company}</span>
                </div>
              </div>
            </div>
            <div className="border-t my-4" />
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              <p><strong>Description:</strong> {achievement_data?.description}</p>
              <p><strong>Type:</strong> {achievement_data?.type}</p>
              <p><strong>Date:</strong> {new Date(achievement_data?.date).toLocaleDateString()}</p>
              <p><strong>Batch:</strong> {achievement_data?.batch}</p>
              <p><strong>Approval Status:</strong> {achievement_data?.is_approved ? "Approved" : "Not Approved"}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 relative p-4 bg-gray-100 rounded-lg shadow-xl mt-10">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-700 text-lg">
              {selectedItem.name ? selectedItem.name[0] : 'A'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {job_data?.title || internship_data?.title || selectedItem.name || study_material_data?.title || 'Notification'}
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{job_data?.company_name || internship_data?.company_name || 'Company Name'}</span>
              </div>
            </div>
          </div>
          <div className="border-t my-4" />
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {job_data?.job_description || internship_data?.job_description || study_material_data?.description || `Feedback: ${selectedItem.feedback}`}
          </div>
          {job_data && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-600 font-semibold">Experience:</p>
                <p className="text-sm">{job_data.experience_level}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Salary:</p>
                <p className="text-sm">{job_data.salary_range}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Location:</p>
                <p className="text-sm">{job_data.job_location}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Work Type:</p>
                <p className="text-sm">{job_data.selectedWorkType}</p>
              </div>
            </div>
          )}
          {internship_data && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-600 font-semibold">Duration:</p>
                <p className="text-sm">{internship_data.duration}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Stipend:</p>
                <p className="text-sm">{internship_data.stipend}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Deadline:</p>
                <p className="text-sm">{new Date(internship_data.deadline).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Location:</p>
                <p className="text-sm">{internship_data.location}</p>
              </div>
            </div>
          )}
          {study_material_data && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-600 font-semibold">Category:</p>
                <p className="text-sm">{study_material_data.category}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Content:</p>
                <p className="text-sm">{study_material_data.text_content}</p>
              </div>
            </div>
          )}
          {item_type && (
            <div className="mt-4 text-center">
              <a
                href={item_type === 'internship' ? `/internship-edit/${item_id}` : `/job-edit/${item_id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-block"
              >
                Edit
              </a>
            </div>
          )}
          {!item_type && (
            <div className="mt-4">
              <a
                href={job_data?.job_link || internship_data?.job_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center inline-block"
              >
                {job_data ? 'Apply Now' : internship_data ? 'Apply Now' : 'View More'}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    const diff = today.getDate() - messageDate.getDate();

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return messageDate.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-screen ml-55">
      <SuperAdminPageNavbar />
      <div className="flex flex-1 p-4 space-x-4">
        <div className="w-1/4 max-w-[20%] space-y-4 shadow-md rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-8">
            <Mail className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Inbox</h1>
          </div>
          <nav className="space-y-2">
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'Jobs' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("Jobs")}
            >
              <Briefcase className="h-4 w-4" />
              Jobs
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'internships' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("internships")}
            >
              <GraduationCap className="h-4 w-4" />
              Internships
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'studyMaterials' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("studyMaterials")}
            >
              <BookOpen className="h-4 w-4" />
              Study Materials
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'achievements' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("achievements")}
            >
              <Trophy className="h-4 w-4" />
              Achievements
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'studentAchievements' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("studentAchievements")}
            >
              <Trophy className="h-4 w-4" />
              Student Achievements
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'contactMessages' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("contactMessages")}
            >
              <Mail className="h-4 w-4" />
              Contact Messages
            </button>
          </nav>
        </div>
        <div className="w-3/4 flex flex-col">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 px-4 py-2 border rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto space-y-4">
            {isChatOpen ? renderChatInterface() : renderContent()}
          </div>
        </div>
        {selectedItem && selectedCategory !== "contactMessages" && (
          <div className="w-2/3 p-4">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
}

export default InboxPage;
