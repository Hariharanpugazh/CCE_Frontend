// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { motion } from "framer-motion";
// import { FaCheckDouble, FaCheck } from "react-icons/fa";
// import { Inbox } from "lucide-react";
// import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
// import { IoIosSend } from "react-icons/io";
// import SeenTick from "../../assets/icons/charm_tick-double.png";

// const StudentMail = () => {
//   const [messages, setMessages] = useState([]);
//   const [error, setError] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [status, setStatus] = useState(null);
//   const [studentId, setStudentId] = useState(null);
//   const studentName = Cookies.get("username");

//   useEffect(() => {
//     const token = Cookies.get("jwt");
//     if (!token) {
//       setError("No token found. Please log in.");
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode(token);
//       const extractedStudentId = decodedToken.student_user;
//       setStudentId(extractedStudentId); // Extract and set student ID
//       fetchMessages(extractedStudentId); // Fetch messages using student ID
//       markMessagesAsSeenByStudent(extractedStudentId); // Mark messages as seen
//     } catch (error) {
//       setError("Invalid token format.");
//     }
//   }, []);

//   const fetchMessages = async (student_id) => {
//     try {
//       const response = await fetch(
//         `https://cce-backend-54k0.onrender.com/api/get_student_messages/${student_id}/`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${Cookies.get("jwt")}`,
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         }
//       );

//       const data = await response.json();
//       setMessages(data.messages || []);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       setError("Failed to load messages.");
//     }
//   };

//   const markMessagesAsSeenByStudent = async (student_id) => {
//     try {
//       const response = await fetch(
//         `https://cce-backend-54k0.onrender.com/api/mark_messages_as_seen_by_student/${student_id}/`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${Cookies.get("jwt")}`,
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         }
//       );

//       if (response.ok) {
//         console.log("Messages marked as seen by student.");
//         fetchMessages(student_id); // Refresh messages to reflect the status change
//       } else {
//         console.error("Failed to mark messages as seen by student.");
//       }
//     } catch (error) {
//       console.error("Error marking messages as seen by student:", error);
//     }
//   };

//   const sendMessage = async () => {
//     if (!studentId) {
//       setStatus("Student ID not found.");
//       return;
//     }

//     const messageData = {
//       student_id: studentId,
//       content: newMessage,
//     };

//     try {
//       const response = await fetch(
//         "https://cce-backend-54k0.onrender.com/api/student_send_message/",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${Cookies.get("jwt")}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(messageData),
//         }
//       );

//       if (response.ok) {
//         setStatus("Message sent successfully!");
//         setNewMessage(""); // Clear input field
//         fetchMessages(studentId); // Refresh chat
//       } else {
//         setStatus("Failed to send message.");
//       }
//     } catch (error) {
//       setStatus("Error sending message.");
//     }
//   };

//   const formatDate = (timestamp) => {
//     const today = new Date();
//     const messageDate = new Date(timestamp);
//     const diff = today.getDate() - messageDate.getDate();

//     if (diff === 0) return "Today";
//     if (diff === 1) return "Yesterday";
//     return messageDate.toLocaleDateString();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//       className="flex flex-col h-screen"
//     >
//       <StudentPageNavbar />
//       <section className="flex-1 flex flex-col p-6 w-4/5 mx-auto mt-4 rounded-lg shadow-lg overflow-y-auto custom-scrollbar">
//         {/* Header Section */}
//         <motion.div
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="flex justify-between items-center mb-6"
//         >
//           <h2 className="text-3xl font-semibold text-gray-800 flex items-center">
//             <Inbox className="mr-2" />
//             Inbox
//           </h2>
//         </motion.div>

//         {/* Message Section */}
//         <div className="flex-1 overflow-y-auto space-y-4">
//           {error ? (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-red-500 text-center"
//             >
//               {error}
//             </motion.p>
//           ) : messages.length > 0 ? (
//             messages.map((message, index) => {
//               const dateLabel = formatDate(message.timestamp);
//               const shouldShowDate =
//                 index === 0 ||
//                 formatDate(messages[index - 1].timestamp) !== dateLabel;

//               return (
//                 <React.Fragment key={index}>
//                   {shouldShowDate && (
//                     <div className="text-center text-gray-500 mb-2">
//                       {dateLabel}
//                     </div>
//                   )}
//                   <div className="flex items-start mb-4">
//                     <div
//                       className={`flex flex-col ${
//                         message.sender === "student"
//                           ? "items-end ml-auto"
//                           : "items-start mr-auto"
//                       }`}
//                     >
//                       <div
//                         className={`flex items-start ${
//                           message.sender === "student"
//                             ? "justify-end"
//                             : "justify-start"
//                         }`}
//                       >
//                         {message.sender !== "student" && (
//                           <div
//                             className={`w-10 h-10 rounded-full bg-[#ffc800] flex items-center justify-center text-lg text-gray-700 mr-2`}
//                           >
//                             A
//                           </div>
//                         )}
//                         <motion.div
//                           initial={{ y: 20, opacity: 0 }}
//                           animate={{ y: 0, opacity: 1 }}
//                           transition={{ delay: index * 0.1 }}
//                           className={`p-3 rounded-lg w-xs ${
//                             message.sender === "student"
//                               ? "bg-[#f5f5f5] text-black"
//                               : "bg-[#ffc800]"
//                           }`}
//                         >
//                           <p className="text-sm">{message.content}</p>
//                           <div className="flex justify-end items-center mt-1 text-xs">
//                             {message.sender === "student" && (
//                               <>
//                                 <span className="mr-1 text-gray-700">
//                                   {new Date(
//                                     message.timestamp
//                                   ).toLocaleTimeString([], {
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                   })}
//                                 </span>
//                                 {message.status === "seen" ? (
//                                   <img src={SeenTick} alt="Seen" />
//                                 ) : (
//                                   <FaCheck />
//                                 )}
//                               </>
//                             )}
//                             {message.sender !== "student" && (
//                               <span className="text-gray-700">
//                                 {new Date(message.timestamp).toLocaleTimeString(
//                                   [],
//                                   {
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                   }
//                                 )}
//                               </span>
//                             )}
//                           </div>
//                         </motion.div>
//                         {message.sender === "student" && (
//                           <div
//                             className={`w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center text-lg ml-2`}
//                           >
//                             {studentName[0]}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </React.Fragment>
//               );
//             })
//           ) : (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center text-gray-500 italic"
//             >
//               No messages found.
//             </motion.p>
//           )}
//         </div>

//         {/* Input Section */}
//         <div className="flex items-center mt-4">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message"
//             className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
//           />
//           <button
//             onClick={sendMessage}
//             className="flex items-center ml-2 p-3 bg-[#ffc800] text-black rounded-lg hover:bg-yellow-300 transition duration-300 shadow-sm"
//           >
//             <IoIosSend className="mr-2" />{" "}
//             {/* Add margin to the right of the icon */}
//             Send
//           </button>
//         </div>
//       </section>
//     </motion.div>
//   );
// };

// export default StudentMail;

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { FaCheckDouble, FaCheck } from "react-icons/fa";
import { Inbox } from "lucide-react";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { IoIosSend } from "react-icons/io";

const StudentMail = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const studentName = Cookies.get("username");

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const extractedStudentId = decodedToken.student_user;
      setStudentId(extractedStudentId); // Extract and set student ID
      fetchMessages(extractedStudentId); // Fetch messages using student ID
      markMessagesAsSeenByStudent(extractedStudentId); // Mark messages as seen
    } catch (error) {
      setError("Invalid token format.");
    }
  }, []);

  const fetchMessages = async (student_id) => {
    try {
      const response = await fetch(
        `https://cce-backend-54k0.onrender.com/api/get_student_messages/${student_id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages.");
    }
  };

  const markMessagesAsSeenByStudent = async (student_id) => {
    try {
      const response = await fetch(
        `https://cce-backend-54k0.onrender.com/api/mark_messages_as_seen_by_student/${student_id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Messages marked as seen by student.");
        fetchMessages(student_id); // Refresh messages to reflect the status change
      } else {
        console.error("Failed to mark messages as seen by student.");
      }
    } catch (error) {
      console.error("Error marking messages as seen by student:", error);
    }
  };

  const sendMessage = async () => {
    if (!studentId) {
        setStatus("Student ID not found.");
        return;
    }

    const messageData = {
        student_id: studentId,
        content: newMessage,
    };

    console.log("Sending message data:", messageData); // Log the data being sent

    try {
        const response = await fetch(
            "https://cce-backend-54k0.onrender.com/api/student_send_message/",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(messageData),
            }
        );

        if (response.ok) {
            setStatus("Message sent successfully!");
            setNewMessage(""); // Clear input field
            fetchMessages(studentId); // Refresh chat
        } else {
            const errorData = await response.json();
            setStatus(`Failed to send message: ${errorData.error}`);
        }
    } catch (error) {
        setStatus("Error sending message.");
    }
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen"
    >
      <StudentPageNavbar />
      <section className="flex-1 flex flex-col p-4 md:p-6 w-full md:w-4/5 mx-auto mt-4 rounded-lg shadow-lg overflow-y-auto custom-scrollbar">
        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-4 md:mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 flex items-center">
            <Inbox className="mr-2" />
            Inbox
          </h2>
        </motion.div>

        {/* Message Section */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center"
            >
              {error}
            </motion.p>
          ) : messages.length > 0 ? (
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
                        message.sender === "student"
                          ? "items-end ml-auto"
                          : "items-start mr-auto"
                      }`}
                    >
                      <div
                        className={`flex items-start ${
                          message.sender === "student"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.sender !== "student" && (
                          <div
                            className={`w-10 h-10 rounded-full bg-[#ffc800] flex items-center justify-center text-lg text-gray-700 mr-2`}
                          >
                            A
                          </div>
                        )}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg w-xs ${
                            message.sender === "student"
                              ? "bg-[#f5f5f5] text-black"
                              : "bg-[#ffc800]"
                          }`}
                        >
                          <p className="text-sm md:text-base">
                            {message.content}
                          </p>
                          <div className="flex justify-end items-center mt-1 text-xs">
                            {message.sender === "student" && (
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
                                  <FaCheckDouble />
                                ) : (
                                  <FaCheck />
                                )}
                              </>
                            )}
                            {message.sender !== "student" && (
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
                        {message.sender === "student" && (
                          <div
                            className={`w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center text-lg ml-2`}
                          >
                            {studentName[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 italic"
            >
              No messages found.
            </motion.p>
          )}
        </div>

        {/* Input Section */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
          />
          <button
            onClick={sendMessage}
            className="flex items-center ml-2 p-3 bg-[#ffc800] text-black rounded-lg hover:bg-yellow-300 transition duration-300 shadow-sm"
          >
            <IoIosSend className="mr-2" />{" "}
            {/* Add margin to the right of the icon */}
            Send
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default StudentMail;
