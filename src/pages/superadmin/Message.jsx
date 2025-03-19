"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Cookies from "js-cookie";
import { FaCheck, FaSearch, FaPaperPlane, FaTimes } from "react-icons/fa";
import SeenTick from "../../assets/icons/charm_tick-double.png";

export default function Message() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = Cookies.get("jwt");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/get_all_student_chats/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(response.data.chats || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Update to scroll when messages change

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async (student_id) => {
    setSelectedStudent(student_id);
    setIsChatOpen(true); // Ensure chat is open when selecting a student
    const token = Cookies.get("jwt");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get_student_messages/${student_id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendReply = async (e) => {
    e?.preventDefault();

    if (!selectedStudent || newMessage.trim() === "") {
      console.error("No student selected or empty message.");
      return;
    }

    const token = Cookies.get("jwt");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    const replyData = {
      student_id: selectedStudent,
      content: newMessage,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/admin_reply_message/",
        replyData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setNewMessage("");
        fetchMessages(selectedStudent);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const getStudentInitial = (email) => {
    if (!email) return "S";
    // Get the part before @ and take the first character
    const username = email.split("@")[0];
    return username.charAt(0).toUpperCase();
  };

  const getRandomColor = (email) => {
    // Generate a consistent color based on the email
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-red-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-indigo-600",
    ];

    const sum = email
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  // Handle keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Press Enter to send message
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        document.activeElement ===
          document.querySelector(
            'input[type="text"][placeholder="Write message..."]'
          )
      ) {
        e.preventDefault();
        sendReply();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); //Fixed useEffect dependency

  return (
    <div className="flex h-screen bg-gray-100">
      <SuperAdminPageNavbar />

      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-[#000000]/30 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#000000]/30">
          <h2 className="text-xl font-bold text-gray-800">Inbox</h2>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search Inbox"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 pl-8 border border-[#000000]/30 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <FaSearch className="absolute left-2.5 top-3 text-gray-400" />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {students.length > 0 ? (
            students
              .filter((s) =>
                s.student_email.toLowerCase().includes(filter.toLowerCase())
              )
              .map((student) => {
                const isSelected = selectedStudent === student.student_id;

                return (
                  <div
                    key={student.student_id}
                    className={`p-3 border-b border-[#000000]/30 cursor-pointer transition-colors duration-200 hover:bg-gray-100 ${
                      isSelected ? "bg-gray-100" : ""
                    }`}
                    onClick={() => fetchMessages(student.student_id)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center mr-3 font-medium">
                        {getStudentInitial(student.student_email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">
                          {student.student_email.split("@")[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500 text-center py-4">No students found</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedStudent && isChatOpen ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-[#000000]/30 flex items-center justify-between">
              {students.find(
                (student) => student.student_id === selectedStudent
              ) && (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center mr-3">
                    {getStudentInitial(
                      students.find(
                        (student) => student.student_id === selectedStudent
                      )?.student_email
                    )}
                  </div>
                  <h2 className="text-base font-semibold text-gray-800">
                    {
                      students
                        .find(
                          (student) => student.student_id === selectedStudent
                        )
                        ?.student_email.split("@")[0]
                    }
                  </h2>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition duration-300"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-100 custom-scrollbar"
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.length > 0 ? (
                <>
                  {messages.map((message, index) => {
                    const dateLabel = formatDate(message.timestamp);
                    const shouldShowDate =
                      index === 0 ||
                      formatDate(messages[index - 1].timestamp) !== dateLabel;

                    const studentEmail = students.find(
                      (student) => student.student_id === selectedStudent
                    )?.student_email;
                    const isAdmin = message.sender === "admin";

                    return (
                      <React.Fragment key={index}>
                        {shouldShowDate && (
                          <div className="flex justify-center my-3">
                            <div className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                              {dateLabel}
                            </div>
                          </div>
                        )}
                        <div
                          className={`flex items-start mb-3 ${
                            isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isAdmin && (
                            <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm mr-2 mt-1">
                              {getStudentInitial(studentEmail)}
                            </div>
                          )}
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isAdmin
                                ? "bg-yellow-400 text-gray-800 rounded-tr-none"
                                : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={`flex text-xs text-gray-500 mt-1 ${
                                isAdmin ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span>
                                {new Date(message.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              {isAdmin && (
                                <span className="ml-1">
                                  {message.status === "seen" ? (
                                    <img
                                      src={SeenTick || "/placeholder.svg"}
                                      alt="Seen"
                                      className="inline-block h-4 w-4"
                                    />
                                  ) : (
                                    <FaCheck className="inline-block h-3 w-3 text-gray-600" />
                                  )}
                                </span>
                              )}
                            </div>
                          </motion.div>
                          {isAdmin && (
                            <div className="w-8 h-8 rounded-full bg-yellow-400 text-gray-800 flex items-center justify-center text-sm ml-2 mt-1">
                              A
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-gray-500 italic">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={sendReply}
              className="p-3 bg-white border-t border-[#000000]/30 flex items-center"
            >
              <input
                type="text"
                placeholder="Write message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="ml-2 w-10 h-10 bg-yellow-400 text-gray-800 rounded-full flex items-center justify-center transition-colors hover:bg-yellow-500 focus:outline-none"
                disabled={!newMessage.trim()}
              >
                <FaPaperPlane className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 bg-gray-100 text-gray-500">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="mt-4 font-medium">
                {selectedStudent
                  ? "Chat closed. Select a student to reopen."
                  : "Select a student to start chatting"}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
