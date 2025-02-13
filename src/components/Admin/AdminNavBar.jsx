import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie
import { AppPages } from "../../utils/constants";
import { FiPlus, FiUser, FiMail, FiSettings } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import { MdInbox, MdWork } from "react-icons/md"; // Icons for pop-up box

export default function AdminPageNavbar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Retrieve the username from cookies when the component mounts
    const user = Cookies.get("username");
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    // Clear the JWT cookie
    Cookies.remove("jwt");

    // Redirect to the login page
    window.location.href = "/";
  };

  return (
    <div className="sticky top-0 bg-white shadow z-10 rounded-b-lg mx-3">
    <nav className="flex justify-between p-4 items-stretch pt-8 relative">
      <span className="flex-1 max-w-[25%]"></span>

      <div className="flex flex-1 justify-evenly space-x-5 items-center text-lg">
        <p
          className="cursor-pointer hover:underline hover:text-blue-400"
          onClick={() => (window.location.href = "/admin/home")}
        >
          Home
        </p>
        <p
          className="cursor-pointer hover:underline hover:text-blue-400"
          onClick={() => (window.location.href = AppPages.jobDashboard.route)}
        >
          Jobs
        </p>
        <p
          className="cursor-pointer hover:underline hover:text-blue-400"
          onClick={() => (window.location.href = AppPages.internShipDashboard.route)}
        >
          Internships
        </p>
        <p className="cursor-pointer hover:underline hover:text-blue-400"
           onClick={() => (window.location.href = "/study-material")}
        >
          Study Material 
        </p>
        <p
          className="cursor-pointer hover:underline hover:text-blue-400"
          onClick={() => (window.location.href = "/admin/achievements")}
        >
          Achievements
        </p>
        <p className="cursor-pointer hover:underline hover:text-blue-400">Contact</p>
      </div>

      <div className="flex flex-1 max-w-[25%] justify-end items-center text-sm space-x-4">
        <div
          className="flex space-x-2 items-center cursor-pointer relative"
          onClick={() => {
            setProfileMenuOpen((toggle) => !toggle);
            setCreateMenuOpen(false);
            setMailPopupOpen(false);
          }}
        >
          <p>{username || "Admin"}</p>
          <FiUser
            className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500 hover:cursor-pointer"
            style={{ width: "2rem" }}
          />

          {/* Profile Menu */}
          {isProfileMenuOpen && (
            <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50 absolute p-2">
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/profile")}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mail Button */}
        <div
          className="flex space-x-2 items-center cursor-pointer relative"
          onClick={() => {
            setMailPopupOpen((toggle) => !toggle);
            setProfileMenuOpen(false);
            setCreateMenuOpen(false);
          }}
        >
          <SlOptions 
            className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500 hover:cursor-pointer"
            style={{ width: "2rem" }}
            title="Options"
          />

          {/* Mail Popup */}
          {isMailPopupOpen && (
            <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-60 z-50 absolute p-2">
              <ul className="flex flex-col">
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/admin/mail")}
                >
                  <FiMail className="text-xl mr-2" /> Inbox
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/manage-jobs")}
                >
                  <MdWork className="text-xl mr-2" /> Manage Jobs
                </li>
              </ul>
            </div>
          )}
        </div>

        <div
          className="flex space-x-2 items-center relative cursor-pointer"
          onClick={() => {
            setCreateMenuOpen((toggle) => !toggle);
            setProfileMenuOpen(false);
            setMailPopupOpen(false);
          }}
        >
          <p>Create New</p>
          <FiPlus
            className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500 hover:cursor-pointer"
            style={{ width: "2rem" }}
            title="Create"
          />

          {/* Create Menu */}
          {isCreateMenuOpen && (
            <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50 absolute p-2">
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/internpost")}
                >
                  Internship
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/jobpost")}
                >
                  Job Post
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/studymaterial-post")}
                >
                  Study Material Post
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/achievementpost")}
                >
                  Achievement Post
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/manage-student")}
                >
                  Student Management
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
    </div>
  );
}
