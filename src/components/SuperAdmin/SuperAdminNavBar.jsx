import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FiMail, FiPlus, FiMenu, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom"; // Add this import
import snslogo from "../../assets/icons/Navbar_lcon.png";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineNotifications, MdOutlineWorkOutline } from "react-icons/md";
import { PiStudent, PiExam  } from "react-icons/pi";
import { GoTrophy } from "react-icons/go";
import verifyIcon from "../../assets/icons/material-symbols_order-approve-outline-rounded.png";
import Managementverify from "../../assets/icons/Group.png";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { RiSettings3Line } from "react-icons/ri";
import LogoutIcon from "../../assets/icons/material-symbols_logout-rounded.png";
import AdminIcon from "../../assets/icons/ri_admin-line.png";

export default function SuperAdminSidebar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Retrieve the username from cookies when the component mounts
    const user = Cookies.get("username");
    if (user) {
      setUsername(user);
    }

    // Set the current path
    setCurrentPath(window.location.pathname);
  }, []);

  const handleLogout = () => {
    // Clear the JWT cookie
    Cookies.remove("jwt");

    // Redirect to the login page
    window.location.href = "/";
  };

  const userInitials = username ? username.charAt(0).toUpperCase() : "S";

  return (
    <div className="relative w-65 z-[8999]">
      <div className="fixed md:flex w-64">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full"
        >
          <FiMenu size={20} />
        </button>

        {/* Sidebar */}
        <div
          className={`bg-white shadow-lg h-screen md:relative w-65 fixed left-0 top-0 flex flex-col transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
        >
          <div className="p-4 border-b border-gray-400 flex items-center justify-center bg-[]">
            <img src={snslogo} alt="Logo" className="h-20 w-40 mr-2" />
            {/* <h1 className="text-lg font-semibold">CCE</h1> */}
          </div>

          <h2 className="text-gray-500 font-medium mb-1 ml-4 mt-2">
            MAIN MENU
          </h2>

          <nav className="flex-1 overflow-y-auto scrollbar-hide">
            <ul className="p-2">
              <li className="mb-0">
                <a
                  href="/superadmin-dashboard"
                  className={`flex items-center p-2 rounded ${
                    currentPath === "/superadmin-dashboard"
                      ? "bg-yellow-200"
                      : "hover:bg-yellow-200"
                  }`}
                >
                  <RxDashboard className="mr-3" /> Dashboard
                </a>
              </li>
              <li className="mb-0">
                <a
                  href="/jobs"
                  className={`flex items-center p-2 rounded ${
                    currentPath === "/jobs"
                      ? "bg-yellow-200"
                      : "hover:bg-yellow-200"
                  }`}
                >
                  <MdOutlineWorkOutline className="mr-3" /> Jobs
                </a>
              </li>
              <li className="mb-0">
                <a
                  href="/internships"
                  className={`flex items-center p-2 rounded ${
                    currentPath === "/internships"
                      ? "bg-yellow-200"
                      : "hover:bg-yellow-200"
                  }`}
                >
                  <PiStudent className="mr-3" /> Internships
                </a>
                </li>
              <li className="mb-0">
                <a
                  href="/exams"
                  className={`flex items-center p-2 rounded ${
                    currentPath === "/exams"
                      ? "bg-yellow-200"
                      : "hover:bg-yellow-200"
                  }`}
                >
                  <PiExam  className="mr-3" /> Exams
                </a>
              </li>
              <li className="mb-0">
                <a
                  href="/study-material"
                  className={`flex items-center p-2 rounded ${
                    currentPath === "/study-material"
                      ? "bg-yellow-200"
                      : "hover:bg-yellow-200"
                  }`}
                >
                  <HiOutlineBookOpen className="mr-3" /> Study Material
                </a>
              </li>
              <li className="mb-0">
                <a
                  href="/admin-achievements"
                  className={`flex items-center p-2 rounded ${
                    currentPath === "/admin-achievements"
                      ? "bg-yellow-200"
                      : "hover:bg-yellow-200"
                  }`}
                >
                  <GoTrophy className="mr-3" /> Achievements
                </a>
              </li>
              <li className="mb-0">
                <a
                  href="/message"
                  className={`flex items-center p-2 rounded ${
                    currentPath === "/message"
                      ? "bg-yellow-200"
                      : "hover:bg-yellow-200"
                  }`}
                >
                  <FiMail className="mr-3" /> Inbox
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/contact-inbox"
                  className={`flex items-center p-2 rounded ${
                    currentPath === "/contact-inbox"
                      ? "bg-yellow-200"
                      : "hover:bg-yellow-200"
                  }`}
                >
                  <MdOutlineNotifications className="mr-3" /> Notifications
                </a>
              </li>

              <li className="mb-2 relative">
                <button
                  onClick={() => {
                    setCreateMenuOpen(!isCreateMenuOpen);
                    setProfileMenuOpen(false);
                    setMailPopupOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2 py-3 text-gray-500 font-medium border-t border-b border-gray-400"
                >
                  <span className="">CREATE</span>
                  <FiPlus className="text-gray-600" />
                </button>

                {isCreateMenuOpen && (
                  <ul className="flex flex-col mt-1">
                    <li>
                      <a
                        href="/jobselection"
                        className="block px-4 py-2 text-black-700 flex items-center"
                      >
                        <FiPlus className="text-BLACK-700 mr-2" /> Job Post
                      </a>
                    </li>
                    <li>
                      <a
                        href="/internshipselection"
                        className="block px-4 py-2 text-black-700 flex items-center"
                      >
                        <FiPlus className="text-text-BLACK-700 mr-2" /> Internship Post
                      </a>
                    </li>
                    <li>
                      <Link
                        to="/exam-post"
                        state={{ isCreateMode: true }}
                        className="block px-4 py-2 text-black-700 flex items-center"
                      >
                        <FiPlus className="text-text-BLACK-700 mr-2" /> Exam Post
                      </Link>
                    </li>
                    <li>
                      <a
                        href="/achievementpost"
                        className="block px-4 py-2 text-black-700 flex items-center"
                      >
                        <FiPlus className="text-BLACK-700 mr-2" /> Achievement Post
                      </a>
                    </li>
                    <li>
                      <a
                        href="/studymaterial-post"
                        className="block px-4 py-2 text-black-700 flex items-center"
                      >
                        <FiPlus className="text-BLACK-700 mr-2" /> Study Material Post
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <h2 className="text-gray-500 font-medium mb-4 ml-2">MANAGE</h2>

              <ul>
              <li>
                  <a
                    href="/Admin-Management"
                    className={`flex items-center p-2 rounded ${
                      currentPath === "/Admin-Management"
                        ? "bg-yellow-200"
                        : "hover:bg-yellow-200"
                    }`}
                  >
                    <img src={AdminIcon} alt="Manage Post" className="mr-2" />
                    Admin Management
                  </a>
                </li>
                <li>
                  <a
                    href="/manage-student"
                    className={`flex items-center p-2 rounded ${
                      currentPath === "/manage-student"
                        ? "bg-yellow-200"
                        : "hover:bg-yellow-200"
                    }`}
                  >
                    <img
                      src={Managementverify}
                      alt="Manage Post"
                      className="mr-2"
                    />
                    Student Management
                  </a>
                </li>
                <li>
                  <a
                    href="/superadmin-manage-jobs"
                    className={`flex items-center p-2 rounded ${
                      currentPath === "/superadmin-manage-jobs"
                        ? "bg-yellow-200"
                        : "hover:bg-yellow-200"
                    }`}
                  >
                    <img src={verifyIcon} alt="Manage Post" className="mr-2" />
                    Approvals
                  </a>
                </li>
              </ul>
            </ul>
          </nav>
          <div className="p-4">
            <hr className="my-2 border-gray-400" />
            <div
              onClick={() => (window.location.href = "/profile")}
              className="flex items-center p-4 px-0 cursor-pointer hover:bg-yellow-200 rounded"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-[#000000] text-lg font-semibold mr-3">
                {userInitials}
              </div>
              <div>
                <p className="font-semibold text-[#000000]">
                  {username || "SuperAdmin"}
                </p>
                <p className="text-sm text-[#000000]"> Super Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-0 py-2 hover:bg-yellow-200"
            >
              <img src={LogoutIcon} alt="Logout" className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Overlay to close the menu on clicking outside */}
        {isMenuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
          ></div>
        )}
      </div>
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
    </div>
  );
}
