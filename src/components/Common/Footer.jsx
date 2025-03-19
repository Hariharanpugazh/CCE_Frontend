
import React from "react";
import { Link } from "react-router-dom"; // Remove this if not using React Router
import LinkedinIcon from "../../assets/icons/LinkedIn.png";
import YoutubeIcon from "../../assets/icons/YouTube.png";
import InstagramIcon from "../../assets/icons/Instagram.png";
import TwitterXIcon from "../../assets/icons/TwitterX.png";
import SnsIcon from "../../assets/images/SNS Group Logo 1.png";

const Footer = () => {
  const categories = {
    Home: [
      { name: "Jobs", link: "/jobs" },
      { name: "Internships", link: "/internships" },
      { name: "Exams", link: "/exams" },
      { name: "Study Material", link: "/study-material" },
      { name: "Achievements", link: "/achievements" },
    ],
    Profile: [
      { name: "My Profile", link: "/profile" },
      { name: "Applied Jobs", link: "/profile" },
      { name: "Saved Jobs", link: "/profile" },
    ],
    Support: [
      { name: "Contact Us", link: "/contact" },
      { name: "FAQs", link: "/faqs" },
    ],
  };

  return (
    <footer className="w-full flex justify-center items-center min-h-[30vh] mt-20">
      <div className="container p-4 md:p-10 bg-[#ffc800] md:bg-transparent">
        {/* Mobile View Categories */}
        <div className="flex justify-between md:hidden mb-4">
          {Object.keys(categories).map((category) => (
            <div key={category} className="text-center">
              <p className="font-semibold mb-2 transition-colors duration-200 hover:text-gray-700">
                {category}
              </p>
              <ul className="space-y-1">
                {categories[category].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="text-xs relative group cursor-pointer"
                    >
                      <span className="transition-colors duration-200 hover:text-gray-700">
                        {item.name}
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Horizontal line for mobile */}
        <hr className="border-1 border-[#000000]/30 my-4 md:hidden" />

        {/* Logo for mobile */}
        <div className="flex justify-center md:hidden mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <img
                src={SnsIcon}
                alt="SNS Icon"
                className="w-10 h-7 md:w-8 md:h-8"
              />
            </div>

            <h3 className="text-xl font-bold mb-2">
              Centre for Competitive Exams
            </h3>
            <p className="text-xs px-4 mb-4">
              CCE focuses on constantly endeavor to identify the potential
              opportunities for our students to elevate their personality and
              professional competence, which in turn will enhance their
              socio-economic status
            </p>

            <hr className="border-1 border-[#000000]/30 my-4 md:hidden" />
            <p className="text-xs mb-4">
              SNS Kalvi Nagar, Sathy Mani Road NH-209,
              <br />
              Vazhiyampalayam, Saravanampatti, Coimbatore,
              <br />
              Tamil Nadu
              <br />
              641035
            </p>
            <p className="text-xs">
              © {new Date().getFullYear()} SNS Institutions. All Rights Reserved
            </p>
          </div>
        </div>

        {/* Social icons for mobile */}
        <div className="flex justify-center space-x-4 md:hidden mt-4 mb-10">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <img
              src={LinkedinIcon || "/placeholder.svg"}
              alt="LinkedIn"
              className="w-6 h-6 transition-transform duration-200 hover:scale-110"
            />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <img
              src={YoutubeIcon || "/placeholder.svg"}
              alt="YouTube"
              className="w-6 h-6 transition-transform duration-200 hover:scale-110"
            />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img
              src={InstagramIcon || "/placeholder.svg"}
              alt="Instagram"
              className="w-6 h-6 transition-transform duration-200 hover:scale-110"
            />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img
              src={TwitterXIcon || "/placeholder.svg"}
              alt="Twitter"
              className="w-6 h-6 transition-transform duration-200 hover:scale-110"
            />
          </a>
        </div>

        {/* Desktop View - Original Layout */}
        <div className="hidden md:flex md:flex-col">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 mb-8 md:mb-0">
              <h3 className="text-2xl md:text-3xl mb-5">
                Centre for Competitive Exams
              </h3>
              <div className="w-full md:w-3/4">
                <p className="text-xs md:text-sm">
                  CCE focuses on constantly endeavor to identify the potential
                  opportunities for our students to elevate their personality
                  and professional competence, which in turn will enhance their
                  socio-economic status
                </p>
                <hr className="border-1 border-black my-5" />
                <p className="text-xs md:text-sm mb-5">
                  SNS Kalvi Nagar, Sathy Mani Road NH-209,
                  <br />
                  Vazhiyampalayam, Saravanampatti, Coimbatore,
                  <br />
                  Tamil Nadu
                  <br />
                  641035
                </p>
                <div className="flex space-x-4">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <img
                      src={LinkedinIcon || "/placeholder.svg"}
                      alt="LinkedIn"
                      className="w-8 h-8 transition-transform duration-200 hover:scale-110"
                    />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <img
                      src={YoutubeIcon || "/placeholder.svg"}
                      alt="YouTube"
                      className="w-8 h-8 transition-transform duration-200 hover:scale-110"
                    />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <img
                      src={InstagramIcon || "/placeholder.svg"}
                      alt="Instagram"
                      className="w-8 h-8 transition-transform duration-200 hover:scale-110"
                    />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <img
                      src={TwitterXIcon || "/placeholder.svg"}
                      alt="Twitter"
                      className="w-8 h-8 transition-transform duration-200 hover:scale-110"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/5 flex flex-wrap justify-between md:pl-20">
              {Object.keys(categories).map((category) => (
                <div key={category} className="w-1/2 md:w-auto mb-6 md:mb-0">
                  <p className="font-bold mb-4 md:mb-10 transition-colors duration-200 hover:text-gray-700 cursor-pointer">
                    {category}
                  </p>
                  <ul className="space-y-2 md:space-y-3">
                    {categories[category].map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.link}
                          className="text-xs relative group cursor-pointer"
                        >
                          <span className="transition-colors duration-200 hover:text-gray-700">
                            {item.name}
                          </span>
                          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="my-6 md:my-10 space-y-5">
            <hr className="border-1 border-black" />
            <p className="text-xs md:text-sm">
              © {new Date().getFullYear()} SNS iHub Workplace. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </footer>
  );
};

export default Footer;