import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";  // Import Framer Motion
import { FaEnvelope, FaForward, FaReply } from "react-icons/fa";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const StudentMail = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const studentId = decodedToken.student_user;

      if (!studentId) {
        setError("Invalid token. No student ID found.");
        return;
      }

      fetch(`http://localhost:8000/api/get_student_messages/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages(data.messages || []);
        })
        .catch((err) => {
          console.error("Error fetching messages:", err);
          setError("Failed to load messages.");
        });
    } catch (err) {
      setError("Invalid token format.");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StudentPageNavbar />
      <section className="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-md">
        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-3xl font-semibold text-gray-800 flex items-center">
            <FaEnvelope className="mr-3 text-pink-600" />
            Student Inbox
          </h2>
        </motion.div>

        {/* Message Section */}
        {error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500"
          >
            {error}
          </motion.p>
        ) : messages.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 border-b last:border-none hover:bg-gray-100 transition duration-300 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    From: Admin <br />
                    <span className="text-sm font-medium text-gray-600">
                      To: {window.localStorage.getItem("student.email")}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 italic">
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="mt-4 p-4 bg-blue-50 rounded-lg"
                >
                  <h4 className="text-md font-semibold text-blue-700 flex items-center">
                    <FaForward className="mr-2" />
                    Your message:
                  </h4>
                  <p className="text-gray-700 mt-2">{message.message}</p>
                </motion.div>

                {/* Reply Section */}
                {message.reply_message && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mt-4 p-4 bg-green-50 rounded-lg"
                  >
                    <h4 className="text-md font-semibold text-green-700 flex items-center">
                      <FaReply className="mr-2" />
                      Reply to you:
                    </h4>
                    <p className="text-green-700 mt-2">{message.reply_message}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 italic"
          >
            No messages found.
          </motion.p>
        )}
      </section>
    </motion.div>
  );
};

export default StudentMail;
