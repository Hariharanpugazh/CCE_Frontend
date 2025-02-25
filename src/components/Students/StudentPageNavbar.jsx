import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { IoMdNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BsFilePost } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { MdOutlinePostAdd, MdWork } from "react-icons/md";
import { IoBookmarksSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { AppPages } from "../../utils/constants";
import LOGOSNS from "../../assets/images/snslogo.png";
import LogoutIcon from "../../assets/icons/material-symbols_logout-rounded.png";

export default function StudentPageNavbar({ currentPage, transparent, tag }) {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // State to manage dropdown

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

  const toggleDropdown = (itemLabel) => {
    if (openDropdown === itemLabel) {
      setOpenDropdown(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdown(itemLabel); // Open the dropdown
    }
  };

  const userInitials = username ? username.charAt(0).toUpperCase() : "A";
  const navbarClasses =
    currentPage === "jobs" || currentPage === "internships"
      ? "custom-navbar-class"
      : "";

  const menuItems = [
    { label: "Home", href: "/home" },
    {
      label: "Opportunities",
      subItems: [
        { label: "Jobs", href: AppPages.jobDashboard.route },
        { label: "Internships", href: AppPages.internShipDashboard.route },
      ],
    },
    { label: "Study Material", href: "/study-material" },
    { label: "Achievements", href: "/achievements" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div
      className={`w-screen top-0 z-50
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
        {/* Mobile Menu Button - Left */}
        <button
          className="md:hidden text-2xl p-2 text-black"
          onClick={() => {
            setMobileMenuOpen(!isMobileMenuOpen);
            setProfileMenuOpen(false); // Close profile menu when opening mobile menu
          }}
        >
          {isMobileMenuOpen ? <IoMdClose /> : <RxHamburgerMenu />}
        </button>

        {/* Logo - Center on mobile, left on desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:transform-none md:flex md:flex-1">
          <div className="flex items-center justify-center md:justify-start">
            <img
              src={LOGOSNS}
              alt="SNS"
              className="h-12 w-auto object-contain md:h-12 md:ml-0"
            />
          </div>
        </div>

        <div className="flex justify-center w-full">
          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center space-x-10 items-center text-lg ml-10">
            {menuItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.href ? (
                  <p
                    className="cursor-pointer hover:underline text-black"
                    onClick={() => (window.location.href = item.href)}
                  >
                    {item.label}
                  </p>
                ) : item.onClick ? (
                  <p
                    className="cursor-pointer hover:underline text-black"
                    onClick={item.onClick}
                  >
                    {item.label}
                  </p>
                ) : (
                  <p className="cursor-pointer hover:underline text-black">
                    {item.label}
                  </p>
                )}
                {item.subItems && (
                  <div className="hidden group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-lg w-48 z-50">
                    {item.subItems.map((subItem) => (
                      <p
                        key={subItem.label}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => (window.location.href = subItem.href)}
                      >
                        {subItem.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profile Icon - Right side */}
        <div className="md:flex flex-none items-center">
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center cursor-pointer mr-5"
              onClick={() => {
                setProfileMenuOpen(!isProfileMenuOpen);
                setMobileMenuOpen(false); // Close mobile menu when opening profile menu
              }}
            >
              {userInitials}
            </div>
          </div>

          {/* Profile Menu */}
          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50">
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                  onClick={() => (window.location.href = "/profile")}
                >
                  <CgProfile className="text-xl mr-2" />
                  Profile
                </li>

                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/student/mail")}
                >
                  <FiMail className="text-xl mr-2" /> Inbox
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/studentachievement")}
                >
                  <BsFilePost className="text-xl mr-2" /> Post Achievement
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/saved-jobs")}
                >
                  <IoBookmarksSharp className="text-xl mr-2" /> Saved Items
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/applied-jobs")}
                >
                  <MdWork className="text-xl mr-2" /> Applied Jobs
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500 whitespace-nowrap"
                  onClick={handleLogout}
                >
                  <img
                    src={LogoutIcon}
                    alt="Logout Icon"
                    className="mr-2 h-4 w-4 inline-block"
                  />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 md:hidden">
            <div className="flex flex-col">
              {menuItems.map((item) => (
                <div key={item.label} className="border-b border-gray-300">
                  {item.href ? (
                    <p
                      className="px-6 py-4 hover:bg-gray-50"
                      onClick={() => {
                        window.location.href = item.href;
                        setMobileMenuOpen(false); // Close mobile menu on item click
                      }}
                    >
                      {item.label}
                    </p>
                  ) : item.onClick ? (
                    <p
                      className="px-6 py-4 hover:bg-gray-50"
                      onClick={(event) => {
                        item.onClick(event);
                        setMobileMenuOpen(false); // Close mobile menu on item click
                      }}
                    >
                      {item.label}
                    </p>
                  ) : (
                    <div>
                      <p
                        className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleDropdown(item.label)}
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 ml-2 ${
                            openDropdown === item.label
                              ? "transform rotate-180"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </p>
                      {openDropdown === item.label && (
                        <div className="bg-gray-50">
                          {item.subItems.map((subItem) => (
                            <p
                              key={subItem.label}
                              className="px-8 py-3 hover:bg-gray-100"
                              onClick={() => {
                                window.location.href = subItem.href;
                                setMobileMenuOpen(false); // Close mobile menu on sub-item click
                              }}
                            >
                              {subItem.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-b border-gray-300">
                <p
                  className="px-6 py-4 hover:bg-gray-50"
                  onClick={() => (window.location.href = "/profile")}
                >
                  My Profile
                </p>
              </div>
              <div>
                <p
                  className="px-6 py-4 text-red-500 hover:bg-gray-50 flex items-center"
                  onClick={handleLogout}
                >
                  <img
                    src={LogoutIcon}
                    alt="Logout Icon"
                    className="mr-2 h-4 w-4"
                  />
                  Log out
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
