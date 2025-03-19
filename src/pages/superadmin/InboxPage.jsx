import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Pagination from "../../components/Admin/pagination";
import {
  Mail,
  Briefcase,
  GraduationCap,
  BookOpen,
  Trophy,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FaCheckDouble, FaCheck, FaEye } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import SeenTick from "../../assets/icons/charm_tick-double.png";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// SearchBar Component
const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchQuery);
  };

  return (
    <header className="flex flex-col items-start justify-start py-2 px-4 sm:py-2  container mx-auto text-start">
      <p className="text-3xl sm:text-4xl tracking-[0.8px]">Notifications</p>
    </header>
  );
};

const InboxPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [studentName, setStudentName] = useState("S");
  const [adminId, setAdminId] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [exams, setExams] = useState([]);
  const [internships, setInternships] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Jobs");
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState({
    achievements: 1,
    internships: 1,
    studyMaterials: 1,
    Jobs: 1,
    Exams: 1,
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
      setAdminId(decodedToken.superadmin_user);
    } catch (error) {
      console.error("Invalid token format.");
    }

    fetchAchievements();
    fetchJobs();
    fetchExams();
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
    setSelectedItem(null);
  }, [selectedCategory]);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/get_achievements_with_admin/"
      );
      setAchievements(response.data.achievements || []);
    } catch (err) {
      console.error("Failed to fetch achievements.");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/get_jobs_with_admin/"
      );
      let jobsData = response.data.jobs || [];
      if (Array.isArray(jobsData)) {
        jobsData = jobsData.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setJobs(jobsData);
      } else {
        console.error("Unexpected data format:", jobsData);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/get_exams_with_admin/"
      );
      let examsData = response.data.exams || [];
      if (Array.isArray(examsData)) {
        examsData = examsData.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setExams(examsData);
      } else {
        console.error("Unexpected data format:", examsData);
      }
    } catch (err) {
      console.error("Error fetching exams:", err);
    }
  };

  const fetchInternships = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/get_internships_with_admin/"
      );
      let internshipsData = response.data.internships || [];
      if (Array.isArray(internshipsData)) {
        internshipsData = internshipsData.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
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
      const response = await axios.get(
        "http://localhost:8000/api/get_study_materials_with_admin/"
      );
      setStudyMaterials(response.data.study_materials || []);
    } catch (err) {
      console.error("Failed to fetch study materials.", err);
    }
  };

  const fetchStudentAchievements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/get_student_achievements_with_students/"
      );
      setStudentAchievements(response.data.student_achievements || []);
    } catch (err) {
      console.error("Failed to fetch student achievements.");
    }
  };

  const fetchMessages = async (student_id) => {
    setSelectedStudent(student_id);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get_student_messages/${student_id}/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markMessagesAsSeen = async (student_id) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/mark_messages_as_seen/${student_id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );
      if (response.status === 200) {
        fetchMessages(student_id);
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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/admin_reply_message/",
        replyData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );
      if (response.status === 200) {
        setReply("");
        fetchMessages(selectedStudent);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleSearch = (query) => {
    // Filtering is handled in renderContent
  };

  const categories = [
    { name: "Jobs", icon: Briefcase },
    { name: "Exams", icon: Briefcase },
    { name: "Internships", icon: GraduationCap },
    // { name: "studyMaterials", icon: BookOpen },
    { name: "Achievements", icon: Trophy },
    // { name: "studentAchievements", icon: Trophy },
  ];

  const handleCategoryChange = (direction) => {
    const currentIndex = categories.findIndex(
      (category) => category.name === selectedCategory
    );
    const newIndex =
      (currentIndex + direction + categories.length) % categories.length;
    setSelectedCategory(categories[newIndex].name);
  };

  let itemsToDisplay = [];

  const renderContent = () => {
    const currentPageNumber = currentPage[selectedCategory];

    switch (selectedCategory) {
      case "achievements":
        itemsToDisplay = achievements.slice(
          (currentPageNumber - 1) * itemsPerPage,
          currentPageNumber * itemsPerPage
        );
        break;
      case "internships":
        itemsToDisplay = internships.slice(
          (currentPageNumber - 1) * itemsPerPage,
          currentPageNumber * itemsPerPage
        );
        break;
        // case "studyMaterials":
        //   itemsToDisplay = studyMaterials.slice(
        //     (currentPageNumber - 1) * itemsPerPage,
        //     currentPageNumber * itemsPerPage
        //   );
        break;
      case "Jobs":
        itemsToDisplay = jobs.slice(
          (currentPageNumber - 1) * itemsPerPage,
          currentPageNumber * itemsPerPage
        );
        break;
      case "Exams":
        itemsToDisplay = exams.slice(
          (currentPageNumber - 1) * itemsPerPage,
          currentPageNumber * itemsPerPage
        );
        break;
        // case "studentAchievements":
        //   itemsToDisplay = studentAchievements.slice(
        //     (currentPageNumber - 1) * itemsPerPage,
        //     currentPageNumber * itemsPerPage
        //   );
        break;
      default:
        return null;
    }
    const handleView = (item) => {
      let path = "";

      switch (selectedCategory) {
        case "achievements":
          path = `/achievement-preview/${item.achievement_id}`;
          break;
        case "internships":
          path = `/internship-preview/${item.internship_id}`;
          break;
        // case "studyMaterials":
        //   path = `/student-study-detail/${item.study_material_id}`;
        //   break;
        case "Jobs":
          path = `/job-preview/${item.job_id}`;
          break;
        case "Exams":
          path = `/exam-preview/${item.exam_id}`;
          break;
        // case "studentAchievements":
        //   path = `/student-achievement-preview/${item.student_achievement_id}`;
        //   break;
        default:
          path = "/";
      }

      navigate(path);
    };

    const filteredItems = itemsToDisplay.filter(
      (item) =>
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
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedCategory.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <div className="space-y-2">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={index}
                  className={`p-3 border border-gray-300 rounded-md flex justify-between items-center hover:bg-gray-50 transition duration-300 ${
                    selectedItem === item ? "border-blue-500" : ""
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-gray-900">
                    <span className="font-bold block">
                      {item.job_data?.title ||
                        item.internship_data?.title ||
                        item.exam_data?.exam_title ||
                        item.achievement_data?.type}
                    </span>
                    <span className="block">
                      {item.admin_name ||
                        item.name ||
                        item.student_name ||
                        "Admin"}{" "}
                      posted a{" "}
                      {item.job_data
                        ? "Job"
                        : item.internship_data
                        ? "Internship"
                        : item.exam_data
                        ? "Exam"
                        : item.achievement_data
                        ? "Achievement"
                        : "Post"}
                    </span>
                  </div>

                  <button
                    className="flex items-center px-4 py-2 border border-black rounded-md text-black hover:bg-gray-200 transition duration-300"
                    // onClick={async (e) => {
                    //   e.stopPropagation();
                    //   if (selectedCategory === "contactMessages") {
                    //     setSelectedStudent(item.student_id);
                    //     await markMessagesAsSeen(item.student_id);
                    //     await fetchMessages(item.student_id);
                    //     const response = await axios.get(
                    //       `http://localhost:8000/api/profile/${item.student_id}/`
                    //     );
                    //     const data = response.data;
                    //     item.name = data.data.name;
                    //     setStudentName(item.name[0]);
                    //     setIsChatOpen(true);
                    //   } else {
                    //     setSelectedItem(item);
                    //   }
                    // }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleView(item);
                    }}
                  >
                    <span className="mr-5">View</span> <FaEye className="w-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center border border-gray-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedCategory.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <p className="text-gray-600">No items found.</p>
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
          <h2 className="text-xl font-semibold ml-2">
            Chat with{" "}
            {selectedStudent &&
              students.find((student) => student.student_id === selectedStudent)
                ?.name}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] p-4 bg-white rounded-lg shadow-inner">
          {messages.length > 0 ? (
            messages.map((message, index) => {
              const dateLabel = formatDate(message.timestamp);
              const shouldShowDate =
                index === 0 ||
                formatDate(messages[index - 1].timestamp) !== dateLabel;

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
                        message.sender === "admin"
                          ? "items-end ml-auto"
                          : "items-start mr-auto"
                      }`}
                    >
                      <div
                        className={`flex items-start ${
                          message.sender === "admin"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.sender !== "admin" && (
                          <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center text-lg mr-2">
                            {studentName}
                          </div>
                        )}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg w-xs ${
                            message.sender === "admin"
                              ? "bg-[#ffc800]"
                              : "bg-[#f5f5f5] text-black"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex justify-end items-center mt-1 text-xs">
                            {message.sender === "admin" && (
                              <>
                                <span className="mr-1 text-gray-700">
                                  {new Date(
                                    message.timestamp
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {message.status === "seen" ? (
                                  <img src={SeenTick} alt="Seen" />
                                ) : (
                                  <FaCheck />
                                )}
                              </>
                            )}
                            {message.sender !== "admin" && (
                              <span className="text-gray-700">
                                {new Date(message.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            )}
                          </div>
                        </motion.div>
                        {message.sender === "admin" && (
                          <div className="w-10 h-10 rounded-full bg-[#ffc800] flex items-center justify-center text-lg text-gray-700 ml-2">
                            <span>A</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <p className="text-center text-gray-500 italic">
              No messages found.
            </p>
          )}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
          />
          <button
            onClick={sendReply}
            className="flex items-center ml-2 p-3 bg-[#ffc800] text-black rounded-lg hover:bg-yellow-300 transition duration-300 shadow-sm"
          >
            <IoIosSend className="mr-2" />
            Send
          </button>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    if (!selectedItem) return null;

    const {
      job_data,
      exam_data,
      internship_data,
      study_material_data,
      item_type,
      item_id,
    } = selectedItem;

    if (
      selectedCategory === "studentAchievements" ||
      selectedCategory === "achievements"
    ) {
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
                {student_name ? student_name[0] : "A"}
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
              <p>
                <strong>Description:</strong> {achievement_data?.description}
              </p>
              <p>
                <strong>Type:</strong> {achievement_data?.type}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(achievement_data?.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Batch:</strong> {achievement_data?.batch}
              </p>
              <p>
                <strong>Approval Status:</strong>{" "}
                {achievement_data?.is_approved ? "Approved" : "Not Approved"}
              </p>
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
              {selectedItem.name ? selectedItem.name[0] : "A"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {job_data?.title ||
                  exam_data?.title ||
                  internship_data?.title ||
                  selectedItem.name ||
                  study_material_data?.title ||
                  "Notification"}
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {job_data?.company_name ||
                    exam_data?.exam_title ||
                    internship_data?.company_name ||
                    "Company Name"}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t my-4" />
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {job_data?.job_description ||
              exam_data?.about_exam ||
              internship_data?.job_description ||
              study_material_data?.description ||
              `Feedback: ${selectedItem.feedback}`}
          </div>
          {exam_data && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-600 font-semibold">Highlights:</p>
                <p className="text-sm">{exam_data.exam_highlights}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Location:</p>
                <p className="text-sm">{exam_data.exam_centers}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Cut Off:</p>
                <p className="text-sm">{exam_data.cutoff}</p>
              </div>
            </div>
          )}
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
                <p className="text-sm">{job_data.work_type}</p>
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
                <p className="text-sm">
                  {new Date(internship_data.deadline).toLocaleDateString()}
                </p>
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
                href={
                  item_type === "internship"
                    ? `/internship-edit/${item_id}`
                    : `/job-edit/${item_id}`
                }
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-block"
              >
                Edit
              </a>
            </div>
          )}
          {!item_type && (
            <div className="mt-4">
              <a
                href={job_data?.job_link || internship_data?.job_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center inline-block"
              >
                {job_data
                  ? "Apply Now"
                  : internship_data
                  ? "Apply Now"
                  : "View More"}
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
    <div className="flex">
      <SuperAdminPageNavbar />
      <div className="flex flex-1 flex-col p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>

        {/* Category Toggle */}
        <div className="flex items-center mb-6">
          <button
            className="h-9.5 w-10 flex items-center justify-center border border-gray-300 rounded-tl-[10px] rounded-bl-[10px]"
            onClick={() => handleCategoryChange(-1)}
          >
            <IoIosArrowBack className="h-4 w-4" />
          </button>
          <div className="h-9.5 px-4 flex items-center border-t border-b border-gray-300">
            {selectedCategory.replace(/([A-Z])/g, " $1").trim()}
          </div>
          <button
            className="h-9.5 w-10 flex items-center justify-center border border-gray-300 rounded-tr-[10px] rounded-br-[10px]"
            onClick={() => handleCategoryChange(1)}
          >
            <IoIosArrowForward className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto space-y-4 flex">
          <div className="flex-1">
            {isChatOpen ? renderChatInterface() : renderContent()}
          </div>
          {/* {selectedItem && selectedCategory !== "contactMessages" && (
            <div className="w-1/3 p-4">
              {renderPreview()}
            </div>
          )} */}
        </div>

        {/* Pagination */}
        {itemsToDisplay.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage[selectedCategory]}
            totalItems={itemsToDisplay.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => paginate(selectedCategory, page)}
          />
        )}
      </div>
    </div>
  );
};

export default InboxPage;
