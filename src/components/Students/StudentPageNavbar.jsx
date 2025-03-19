import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io"
import { CgProfile } from "react-icons/cg"
import { BsFilePost } from "react-icons/bs"
import { RxHamburgerMenu } from "react-icons/rx"
import { AppPages } from "../../utils/constants"
import LOGOSNS from "../../assets/images/snslogo.png"
import ProfileStudent from "../../assets/icons/profilestudent.png"
import LogoutIcon from "../../assets/icons/material-symbols_logout-rounded.png"

export default function StudentPageNavbar({ currentPage, transparent, tag }) {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isMailPopupOpen, setMailPopupOpen] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    const user = Cookies.get("username")
    if (user) {
      setUsername(user)
    }

    if (transparent) {
      const handleScroll = () => {
        const heroSection = document.getElementById("hero")
        if (heroSection) {
          const heroBottom = heroSection.offsetHeight
          setIsScrolled(window.scrollY > heroBottom)
        }
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [transparent])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest(".profile-menu-container")) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const handleLogout = () => {
    Cookies.remove("jwt")
    localStorage.clear()
    window.location.href = "/"
  }

  const toggleDropdown = (itemLabel) => {
    if (openDropdown === itemLabel) {
      setOpenDropdown(null)
    } else {
      setOpenDropdown(itemLabel)
    }
  }

  const navbarClasses = currentPage === "jobs" || currentPage === "internships" ? "custom-navbar-class" : ""

  const menuItems = [
    { label: "Home", href: "/home" },
    {
      label: (
        <span className="flex items-center gap-1">
          Opportunities <IoMdArrowDropdown className="transition-transform duration-200" />
        </span>
      ),
      mobileLabel: "Opportunities",
      dropdownId: "opportunities",
      subItems: [
        { label: "Jobs", href: AppPages.jobDashboard.route },
        { label: "Internships", href: AppPages.internShipDashboard.route },
        { label: "Exams", href: "/exams" },
      ],
    },
    { label: "Study Material", href: "/study-material" },
    { label: "Achievements", href: "/achievements" },
    {
      label: (
        <span className="flex items-center gap-1">
          Support <IoMdArrowDropdown className="transition-transform duration-200" />
        </span>
      ),
      mobileLabel: "Support",
      dropdownId: "support",
      subItems: [
        { label: "Contact Us", href: "/contact" },
        { label: "Inbox", href: "/student/mail" },
      ],
    },
  ]

  return (
    <div
      className={`w-full top-0 z-50
        ${
          transparent
            ? isScrolled
              ? "fixed bg-white shadow-md"
              : "fixed bg-[#ffc800] md:bg-transparent glass-lg"
            : "sticky shadow-md"
        }
        z-10 ${navbarClasses} transition-all duration-300`}
    >
      <nav className="flex justify-between bg-white items-center p-2 md:p-4 relative max-w-[1920px] mx-auto">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl p-2 text-black focus:outline-none"
          onClick={() => {
            setMobileMenuOpen(!isMobileMenuOpen)
            setProfileMenuOpen(false)
          }}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <IoMdClose /> : <RxHamburgerMenu />}
        </button>

        {/* Logo - Center on mobile, left on desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:transform-none md:flex md:flex-1">
          <div className="flex items-center justify-center md:justify-start">
            <img src={LOGOSNS || "/placeholder.svg"} alt="SNS" className="h-10 md:h-12 w-auto object-contain md:ml-0" />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex w-full justify-center items-center">
          <div className="flex space-x-6 lg:space-x-10 items-center text-lg">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.href ? (
                  <button
                    className="cursor-pointer hover:underline text-black focus:outline-none"
                    onClick={() => (window.location.href = item.href)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <button
                    className="cursor-pointer hover:underline text-black focus:outline-none"
                    onClick={() => toggleDropdown(item.dropdownId)}
                    aria-expanded={openDropdown === item.dropdownId}
                    aria-haspopup="true"
                  >
                    {item.label}
                  </button>
                )}
                {item.subItems && (
                  <div
                    className={`${
                      openDropdown === item.dropdownId ? "block" : "hidden"
                    } md:hidden md:group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-lg w-48 z-50 py-1`}
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-left"
                        onClick={() => {
                          window.location.href = subItem.href
                          setOpenDropdown(null)
                        }}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profile Section */}
        <div className="md:flex flex-none items-center profile-menu-container">
          <div className="flex items-center space-x-2">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setProfileMenuOpen(!isProfileMenuOpen)
                setMobileMenuOpen(false)
              }}
            >
              <span className="text-lg text-black mr-2 hidden md:block">My Profile</span>
              <img
                src={ProfileStudent || "/placeholder.svg"}
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2 md:mr-5 object-cover"
              />
            </div>
          </div>

          {/* Profile Menu */}
          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50">
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    window.location.href = "/profile"
                    setProfileMenuOpen(false)
                  }}
                >
                  <CgProfile className="text-xl mr-2" />
                  Profile
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-not-allowed hover:bg-gray-100"
                >
                  <BsFilePost className="text-xl mr-2" /> Post Achievement
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500 whitespace-nowrap"
                  onClick={handleLogout}
                >
                  <img src={LogoutIcon || "/placeholder.svg"} alt="Logout Icon" className="mr-2 h-4 w-4 inline-block" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 md:hidden max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col">
              {menuItems.map((item, index) => (
                <div key={index} className="border-b border-gray-300">
                  {item.href ? (
                    <button
                      className="px-6 py-4 hover:bg-gray-50 w-full text-left"
                      onClick={() => {
                        window.location.href = item.href
                        setMobileMenuOpen(false)
                      }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <div>
                      <button
                        className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer w-full"
                        onClick={() => toggleDropdown(item.dropdownId)}
                        aria-expanded={openDropdown === item.dropdownId}
                      >
                        <span className="flex items-center gap-1">
                          {item.mobileLabel || item.label}
                          <IoMdArrowDropdown
                            className={`transition-transform duration-200 ${
                              openDropdown === item.dropdownId ? "transform rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>
                      {openDropdown === item.dropdownId && (
                        <div className="bg-gray-50">
                          {item.subItems.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              className="px-8 py-3 hover:bg-gray-100 w-full text-left"
                              onClick={() => {
                                window.location.href = subItem.href
                                setMobileMenuOpen(false)
                              }}
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-b border-gray-300">
                <button
                  className="px-6 py-4 hover:bg-gray-50 w-full text-left"
                  onClick={() => {
                    window.location.href = "/profile"
                    setMobileMenuOpen(false)
                  }}
                >
                  My Profile
                </button>
              </div>
              <div>
                <button
                  className="px-6 py-4 text-red-500 hover:bg-gray-50 flex items-center w-full"
                  onClick={handleLogout}
                >
                  <img src={LogoutIcon || "/placeholder.svg"} alt="Logout Icon" className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

