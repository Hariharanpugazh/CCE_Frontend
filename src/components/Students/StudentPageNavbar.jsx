import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { IoMdNotifications } from "react-icons/io";
import { FiMail } from "react-icons/fi";
import { MdOutlinePostAdd, MdWork } from "react-icons/md";
import { IoBookmarksSharp } from "react-icons/io5";
import { AppPages } from "../../utils/constants";

export default function StudentPageNavbar({ currentPage, transparent, tag }) {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setUsername(user);
    }

    if (transparent) {
      const handleScroll = () => {
        const heroSection = document.getElementById("hero");
        if (heroSection) {
          const heroBottom = heroSection.offsetHeight;
          setIsScrolled(window.scrollY > heroBottom);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [transparent]);

  const handleLogout = () => {
    Cookies.remove("jwt");
    localStorage.clear();
    window.location.href = "/";
  };

  const handleStudyMaterialClick = (event) => {
    event.preventDefault();
    alert("Coming Soon!");
  };

  const userInitials = username ? username.charAt(0).toUpperCase() : "A";

  // Conditional class for Jobs and Internships pages
  const navbarClasses = currentPage === "jobs" || currentPage === "internships" ? "custom-navbar-class" : "";

  return (
    <div className={`w-screen top-0 
      ${transparent ? (isScrolled ? "fixed bg-white shadow rounded-b-lg" : "fixed glass-lg") : "sticky bg-white shadow rounded-b-lg"}
      z-10 ${navbarClasses} transition-all duration-300`}>
      <nav className="flex justify-between p-4 items-stretch relative">
        <span className="flex-1 max-w-[25%]"></span>

        <div className="flex flex-1 justify-evenly space-x-5 items-center text-lg">
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = "/home")}>
            Home
          </p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = AppPages.jobDashboard.route)}>
            Jobs
          </p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = AppPages.internShipDashboard.route)}>
            Internships
          </p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={handleStudyMaterialClick}>Study Material</p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = "/achievements")}>
            Achievements
          </p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = "/contact")}>
            Contact
          </p>
        </div>
        
        <div className="flex flex-1 max-w-[25%] justify-end items-center text-sm relative space-x-4">
          <div className="flex space-x-2 items-center cursor-pointer relative" onClick={() => {
            setMailPopupOpen(toggle => !toggle);
            setProfileMenuOpen(false);
          }}>
            <IoMdNotifications className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500" style={{ width: "2rem" }} title="Options" />
            {isMailPopupOpen && (
              <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-60 z-50 absolute p-2">
                <ul className="flex flex-col">
                  <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/student/mail")}>
                    <FiMail className="text-xl mr-2" /> Inbox
                  </li>
                  <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/studentachievement")}>
                    <MdOutlinePostAdd className="text-xl mr-2" /> Post Achievement
                  </li>
                  <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/saved-jobs")}>
                    <IoBookmarksSharp className="text-xl mr-2" /> Saved Items
                  </li>
                  <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/applied-jobs")}>
                    <MdWork className="text-xl mr-2" /> Applied Jobs
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex space-x-2 pr-2 items-center cursor-pointer relative" onClick={() => {
            setProfileMenuOpen(toggle => !toggle);
            setMailPopupOpen(false);
          }}>
            <p>{username || "Profile"}</p>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-700 text-lg font-semibold">
              {userInitials}
            </div>
            {isProfileMenuOpen && (
              <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50 absolute p-2">
                <ul className="flex flex-col">
                  <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/profile")}>
                    Profile
                  </li>
                  <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
                    Logout
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
