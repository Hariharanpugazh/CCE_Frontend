import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FiMail, FiPlus, FiMenu } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineWorkOutline } from "react-icons/md";
import { PiStudent, PiExam } from "react-icons/pi";
import { GoTrophy } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { RiNotification3Line } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; // Add this import

// Assume these imports are correct for your project structure
import snslogo from "../../assets/icons/Navbar_lcon.png";
import verifyIcon from "../../assets/icons/material-symbols_order-approve-outline-rounded.png";
import Managementverify from "../../assets/icons/Group.png";
import LogoutIcon from "../../assets/icons/material-symbols_logout-rounded.png";

export default function AdminSidebar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const location = useLocation();

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt");
    window.location.href = "/";
  };

  const userInitials = username ? username.charAt(0).toUpperCase() : "S";

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ href, children }) => (
    <a
      href={href}
      className={`flex items-center p-2 rounded ${
        isActive(href) ? "bg-yellow-200" : "hover:bg-yellow-200"
      }`}
    >
      {children}
    </a>
  );

  return (
    <div className="lg:relative lg:w-65 z-[8999]">
      <div className="fixed lg:flex">
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full"
        >
          <FiMenu size={20} />
        </button>

        <div
          className={`bg-white shadow-lg h-screen md:relative w-65 fixed left-0 top-0 flex flex-col transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
        >
          <div className="p-4 border-b border-gray-400 flex items-center justify-center bg-[]">
            <img
              src={snslogo || "/placeholder.svg"}
              alt="Logo"
              className="h-20 w-40 mr-2"
            />
            {/* <h1 className="text-lg font-semibold">CCE</h1> */}
          </div>

          <h2 className="text-gray-500 font-medium mb-1 ml-4 mt-2">
            MAIN MENU
          </h2>

          <nav className="flex-1 overflow-y-auto scrollbar-hide">
            <ul className="p-2">
              <li className="mb-0">
                <NavLink href="/admin/home">
                  <RxDashboard className="mr-3" /> Dashboard
                </NavLink>
              </li>
              <li className="mb-0">
                <NavLink href="/jobs">
                  <MdOutlineWorkOutline className="mr-3" /> Jobs
                </NavLink>
              </li>
              <li className="mb-0">
                <NavLink href="/internships">
                  <PiStudent className="mr-3" /> Internships
                </NavLink>
              </li>
              <li className="mb-0">
                <NavLink href="/exams">
                  <PiExam tudent className="mr-3" /> Exams
                </NavLink>
              </li>
              <li className="mb-0">
                <NavLink href="/study-material">
                  <HiOutlineBookOpen className="mr-3" /> Study Material
                </NavLink>
              </li>
              <li className="mb-0">
                <NavLink href="/admin-achievements">
                  <GoTrophy className="mr-3" /> Achievements
                </NavLink>
              </li>
              <li className="mb-0">
                <NavLink href="/admin/mail">
                  <RiNotification3Line className="mr-3" /> Notification
                </NavLink>
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
                        <FiPlus className="text-text-BLACK-700 mr-2" />{" "}
                        Internship Post
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
                        <FiPlus className="text-BLACK-700 mr-2" /> Study
                        Material Post
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <h2 className="text-gray-500 font-medium mb-4 ml-2">MANAGE</h2>

              <ul>
                <li>
                  <NavLink href="/manage-student">
                    <img
                      src={Managementverify || "/placeholder.svg"}
                      alt="Manage Post"
                      className="mr-2"
                    />
                    Student Management
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/manage-jobs">
                    <img
                      src={verifyIcon || "/placeholder.svg"}
                      alt="Manage Post"
                      className="mr-2"
                    />
                    Manage Post
                  </NavLink>
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
                <p className="text-sm text-[#000000]">Administrator</p>
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
