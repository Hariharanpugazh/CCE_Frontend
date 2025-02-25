import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { FiMail, FiPlus, FiUser, FiHome, FiBriefcase, FiAward, FiMenu } from "react-icons/fi"
import { IoMdNotifications } from "react-icons/io"
import { MdWork } from "react-icons/md"
import snslogo from "../../assets/images/snslogo.png"

export default function SuperAdminSidebar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isCreateMenuOpen, setCreateMenuOpen] = useState(false)
  const [isMailPopupOpen, setMailPopupOpen] = useState(false)
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Retrieve the username from cookies when the component mounts
    const user = Cookies.get("username")
    if (user) {
      setUsername(user)
    }
  }, [])

  const handleLogout = () => {
    // Clear the JWT cookie
    Cookies.remove("jwt")

    // Redirect to the login page
    window.location.href = "/"
  }

  const userInitials = username ? username.charAt(0).toUpperCase() : "S"

  return (
    <div className="relative w-57 z-[9999]">
      <div className="fixed md:flex">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full"
        >
          <FiMenu size={24} />
        </button>

        {/* Sidebar */}
        <div className={`bg-white shadow-lg h-screen w-57 fixed md:relative left-0 top-0 flex flex-col transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
          <div className="p-4 border-b">
            <img src={snslogo} alt="Logo" className="h-14 w-35 mx-auto" />
          </div>

          <div className="flex items-center bg-[#111933] p-4 border-b">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white-900 text-lg font-semibold mr-3">
              {userInitials}
            </div>
            <div>
              <p className="font-semibold text-gray-200">{username || "SuperAdmin"}</p>
              <p className="text-sm text-gray-200">Super Administrator</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="p-2">
              <li className="mb-2">
                <a href="/superadmin-dashboard" className="flex items-center p-2 hover:bg-yellow-200 rounded">
                  <FiHome className="mr-3" /> Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/jobs" className="flex items-center p-2 hover:bg-yellow-200 rounded">
                  <FiBriefcase className="mr-3" /> Jobs
                </a>
              </li>
              <li className="mb-2">
                <a href="/internships" className="flex items-center p-2 hover:bg-yellow-200 rounded">
                  <FiBriefcase className="mr-3" /> Internships
                </a>
              </li>
              <li className="mb-2">
                <a href="/admin-achievements" className="flex items-center p-2 hover:bg-yellow-200 rounded">
                  <FiAward className="mr-3" /> Achievements
                </a>
              </li>

              <li className="mb-2 relative">
                <button
                  onClick={() => {
                    setCreateMenuOpen(!isCreateMenuOpen)
                    setProfileMenuOpen(false)
                    setMailPopupOpen(false)
                  }}
                  className="flex items-center p-2 hover:bg-yellow-200 rounded w-full text-left"
                >
                  <FiPlus className="mr-3" /> Create New
                </button>
                {isCreateMenuOpen && (
                  <ul className="ml-6 mt-2">
                    <li>
                      <a href="/jobselection" className="block p-2 hover:bg-yellow-200 rounded">
                        Job Post
                      </a>
                    </li>
                    <li>
                      <a href="/internshipselection" className="block p-2 hover:bg-yellow-200 rounded">
                        Internship
                      </a>
                    </li>
                    <li>
                      <a href="/achievementpost" className="block p-2 hover:bg-yellow-200 rounded">
                        Achievement Post
                      </a>
                    </li>
                    <li>
                      <a href="/studymaterial-post" className="block p-2 hover:bg-yellow-200 rounded">
                        Study Material Post
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li className="mb-2">
                <a href="/superadmin-manage-jobs" className="flex items-center p-2 hover:bg-yellow-200 rounded">
                  <MdWork className="mr-3" /> Manage Jobs
                </a>
              </li>

              <li className="mb-2 relative">
                <button
                  onClick={() => {
                    setMailPopupOpen(!isMailPopupOpen)
                    setProfileMenuOpen(false)
                    setCreateMenuOpen(false)
                  }}
                  className="flex items-center p-2 hover:bg-yellow-200 rounded w-full text-left"
                >
                  <FiUser className="mr-3" /> Management
                </button>
                {isMailPopupOpen && (
                  <ul className="ml-6 mt-2">
                    <li>
                      <a href="/manage-student" className="flex items-center p-2 hover:bg-yellow-200 rounded">
                        Student Management
                      </a>
                    </li>
                    <li>
                      <a href="/Admin-Management" className="flex items-center p-2 hover:bg-yellow-200 rounded">
                        Admin Management
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li className="mb-2">
                <a href="/contact-inbox" className="flex items-center p-2 hover:bg-yellow-200 rounded">
                  <FiMail className="mr-3" /> Inbox
                </a>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center p-2 hover:bg-yellow-200 rounded w-full"
              >
                <FiUser className="mr-3" /> Profile
              </button>
              {isProfileMenuOpen && (
                <ul className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg w-full">
                  <li>
                    <a href="/profile" className="block px-4 py-2 hover:bg-yellow-200">
                      View Profile
                    </a>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-yellow-200">
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
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
    </div>
  )
}
