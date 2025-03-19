import { useContext, useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import Cookies from "js-cookie";
import { LoaderContext } from "../../components/Common/Loader";
import gridImg from "../../assets/images/Grid Lines.png";
import ApplicationCard from "../../components/Students/ApplicationCard";
import CarouselAchievments from "../../components/Students/CarouselAchievments";
import Image from "../../assets/images/AboutCCE1.png";
import Image1 from "../../assets/images/AboutCCE2.png";

// icon imports
import codeSandBoxIcon from "../../assets/icons/codesandbox.png";
import pullIcon from "../../assets/icons/git-pull-request.png";
import gridIcon from "../../assets/icons/grid-icon.png";
import mailIcon from "../../assets/icons/mail.png";
import sendIcon from "../../assets/icons/send.png";
import fileIcon from "../../assets/icons/file.png";

import { toast, ToastContainer } from "react-toastify";

const themeButton =
  "px-7 py-[6px] rounded w-fit text-sm bg-[#FFCC00] cursor-pointer";

import { IoIosArrowForward } from "react-icons/io";
import { IoMdClose, IoMdAdd } from "react-icons/io";

import { FiMail, FiPhone } from "react-icons/fi";

//image imports
import mentor1 from "../../assets/images/mentors (1).jpeg";
import mentor2 from "../../assets/images/mentors (2).jpeg";
import mentor3 from "../../assets/images/user.png";
import { jwtDecode } from "jwt-decode";

const ContactSection = ({ formData, setFormData, handleSubmit }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:space-x-12 space-y-8 md:space-y-0 justify-stretch py-8 pt-12 md:pt-22 relative">
      <img
        src={gridImg || "/placeholder.svg"}
        className="absolute w-full h-full -z-1 object-cover"
        alt=""
      />

      <div className="px-[5%] w-full flex flex-col md:flex-row gap-6 md:gap-0">
        {/* Left Section */}
        <div className="w-full md:w-1/2 space-y-4 px-[4%]">
          <h2 className="text-2xl md:text-3xl font-bold">
            Get in Touch with Us!
          </h2>
          <p className="text-gray-600">
            Your Questions Matter – We’re Here to Support You Every Step of the
            Way
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-8 md:space-x-18 space-y-6 sm:space-y-0 py-6 md:py-12 w-full">
            <div className="flex flex-col items-stretch space-y-2 sm:space-y-0 sm:space-x-3 pb-2 flex-1">
              <div className="border-b pb-2.5 mb-2.5">
                <FiMail className="w-8 h-8 p-1.5 border rounded-lg border-gray-500 mb-1" />
                <p className="text-xl">Message Us</p>
              </div>

              <p className="text-gray-500">support@gmail.com</p>
            </div>
            <div className="flex flex-col items-stretch space-y-2 sm:space-y-0 sm:space-x-3 pb-2 flex-1">
              <div className="border-b pb-2.5 mb-2.5">
                <FiPhone className="w-8 h-8 p-1.5 border rounded-lg border-gray-500 mb-1" />
                <p className="text-xl">Call Us</p>
              </div>

              <p className="text-gray-500">+91 98765 54321</p>
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:flex-1 px-[4%] md:px-[8%]">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full mt-0 md:mt-0">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                disabled
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 opacity-75 rounded bg-yellow-100 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                disabled
                placeholder="Your email"
                value={formData.student_email}
                onChange={handleChange}
                className="w-full p-3 opacity-75 rounded bg-yellow-100 focus:outline-none"
              />
              <textarea
                name="message"
                placeholder="How can we help..."
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded bg-yellow-100 focus:outline-none h-32"
              ></textarea>
              <button
                type="submit"
                className="w-full cursor-pointer bg-yellow-400 text-black font-semibold py-3 rounded hover:bg-yellow-500 transition"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "Are the study materials free to access?",
      answer:
        "Yes, all study materials provided on our platform are free for students. You can download PDFs, presentations, and other resources to help with your exam and job preparation.",
      linkText: "Explore the Study Materials",
    },
    {
      question: "Can I apply for multiple jobs at once?",
    },
    {
      question: "How do I showcase my achievements on the platform?",
    },
    {
      question: "Will I get notifications for new job postings?",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center items-center py-12 md:py-24 w-[95%] md:w-[90%]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Left Side */}
        <div className="flex flex-col space-y-4 justify-center">
          <h2 className="text-3xl md:text-5xl">FAQs</h2>
          <p className="text-gray-500">
            Your Questions, Answered – Everything You Need to Know
          </p>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 w-fit">
            See All FAQs
          </button>
        </div>

        {/* Right Side - FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 bg-white relative"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <p className="font-medium text-sm md:text-base">
                  {faq.question}
                </p>
                <button className="p-2 rounded-full bg-yellow-300">
                  {openIndex === index ? <IoMdClose /> : <IoMdAdd />}
                </button>
              </div>
              {openIndex === index && faq.answer && (
                <div className="mt-2 text-gray-600">
                  <p>{faq.answer}</p>
                  {faq.linkText && (
                    <div className="flex items-center mt-2 p-3 bg-gray-100 rounded-md cursor-pointer">
                      <p>{faq.linkText}</p>
                      <IoIosArrowForward className="ml-auto" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header = ({ jobs }) => {
  return (
    <header className="w-full relative" id="hero">
      <img
        src={gridImg || "/placeholder.svg"}
        alt=""
        className="absolute h-full w-full -z-1 object-cover"
      />

      <div className="h-20"></div>

      <div className="w-full">
        <StudentPageNavbar transparent={true} />
      </div>

        {jobs.length > 0 && (
          <div className="w-full h-full absolute hidden md:flex">
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-center px-20 pt-10">
                <div className="w-70 rotate-[-20deg] hover:rotate-[0deg] hover:scale-[1.2] cursor-pointer">
                  <ApplicationCard
                    small={true}
                    application={{ ...jobs[0], ...jobs[0]?.job_data }}
                    key={jobs[0]?._id}
                    handleCardClick={() => {}}
                    isSaved={undefined}
                  />
                </div>
              </div>

              <div className="flex-1 flex justify-end px-30 pb-30">
                <div className="w-70 scale-[0.5] rotate-[-50deg] relative hover:rotate-[0deg] hover:scale-[1.1]">
                  <ApplicationCard
                    small={true}
                    application={{ ...jobs[1], ...jobs[1]?.job_data }}
                    key={jobs[1]?._id}
                    handleCardClick={() => {}}
                    isSaved={undefined}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-end -mt-30 px-30">
              <div className="w-70 rotate-[20deg] scale-[0.8] relative hover:rotate-[0deg] hover:scale-[1.2] cursor-pointer">
                <ApplicationCard
                  small={true}
                  application={{ ...jobs[2], ...jobs[2]?.job_data }}
                  key={jobs[2]?._id}
                  handleCardClick={() => {}}
                  isSaved={undefined}
                />
              </div>
            </div>
          </div>
        )}

      <div className="w-full flex flex-col items-center text-center py-12 md:py-20 lg:py-34 space-y-3 md:space-y-5 z-20">
        <p className="text-3xl md:text-5xl lg:text-7xl font-semibold">
          {" "}
          One Step Closer To <br /> Your{" "}
          <span className="text-[#FFCC00]"> Dream Job </span>{" "}
        </p>
        <p className="text-sm md:text-base">
          {" "}
          let us help you find a job that suits you the best!{" "}
        </p>
        <button
          className={themeButton + " z-20"}
          onClick={() => (window.location.href = "jobs")}
        >
          {" "}
          Explore{" "}
        </button>
      </div>

      <div className="relative w-full">
        <p className="w-full bg-[#FFCC00] p-2 md:p-4 px-0 rotate-[2deg] text-justify shadow-lg leading-snug custom-justify text-sm md:text-lg lg:text-2xl">
          Build an entrepreneurial mindset through our Design Thinking Framework
          * Redesigning common mind and Business Towards Excellence
        </p>

        <p className="absolute -z-1 top-0 w-full bg-[#e4b600] p-6 py-9 rotate-[-2deg]">
          {" "}
        </p>
      </div>
    </header>
  );
};

const Insights = () => {
  return (
    <section className="w-[90%] md:w-[85%] self-center flex flex-col items-center space-y-10 md:space-y-20 px-4 md:px-0 ]">
      <div>
        <CarouselAchievments />
      </div>
      <div className="bg-[#070E20] w-screen min-h-screen px-4 py-8 md:px-20">
        <div className="flex flex-col items-center space-y-2 text-center md:mt-10 ">
          <p className="text-2xl md:text-4xl font-semibold text-white">
            {" "}
            Your Ultimate Career Toolkit{" "}
          </p>
          <p className="text-gray-500 text-sm md:text-base text-gray-400 mb-5">
            {" "}
            Essential Tools to Elevate Your Job Search & Career Growth.{" "}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[
            {
              icon: fileIcon,
              title: "Access Verified Study Materials",
              content:
                "Prepare for competitive exams and job applications with high-quality resources.",
            },
            {
              icon: mailIcon,
              title: "Explore Job & Internship Listings",
              content:
                "Find categorized opportunities based on your skills, industry, and career goals.",
            },
            {
              icon: pullIcon,
              title: "Expert Guidance & Student Support",
              content:
                "Get personalized advice, career mentorship, and assistance through our support team.",
            },
            {
              icon: sendIcon,
              title: "Achievement Showcase",
              content:
                "Highlight your career milestones, job placements, and exam successes to inspire others.",
            },
            {
              icon: gridIcon,
              title: "Real-Time Job Alerts",
              content:
                " Get instant notifications for new job openings and internship opportunities.",
            },
            {
              icon: codeSandBoxIcon,
              title: "Seamless Application Process",
              content:
                "Apply to jobs effortlessly with a user-friendly and structured platform.",
            },
          ].map((item, key) => {
            const shuffleArray = (array) =>
              array.sort(() => Math.random() - 0.5);

            const baseColors = [
              "#f8c974",
              "#fcf5ec",
              "#e09343",
              "#9f501e",
              "#f8c974",
            ];

            var shuffledArray = shuffleArray([...baseColors]);
            shuffledArray = [...shuffledArray, shuffledArray[0]];

            const randomizedGradient = `conic-gradient(${shuffledArray.join(
              ", "
            )})`;

            return (
              <div
                key={key}
                className="custom-border relative p-4 py-6 flex flex-col space-y-8 justify-between h-full text-white rounded-2xl"
                style={{
                  "--custom-gradient": randomizedGradient,
                  background: "transparent",
                  position: "relative",
                  boxShadow: "0 0 0 2px rgba(248, 201, 116, 0.2)",
                }}
              >
                {/* Gradient border with glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl -z-10"
                  style={{
                    background:
                      "linear-gradient(to bottom right, #fcf5ec, #f8c974, #e09343)",
                    padding: "1px",
                    content: "''",
                    filter: "blur(0.5px)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                  }}
                />

                <div>
                  <img
                    src={item.icon || "/placeholder.svg"}
                    className="w-6 mb-1"
                    alt=""
                  />
                  <p className="text-xl font-semibold"> {item.title} </p>
                </div>
                <p className="text-sm md:text-base"> {item.content} </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ThatOnePainInTheA__ = ({ achieversImages }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <section className="flex flex-col lg:flex-row w-[90%] mx-auto py-10 md:py-20 lg:py-30 items-center gap-8 px-4 md:px-0">
      {/* Text Section */}
      <div className="space-y-3 w-full lg:flex-1 text-center lg:text-left">
        <p className="text-3xl md:text-4xl font-semibold">
          Celebrating Student
        </p>
        <p className="text-3xl md:text-4xl font-semibold">Success &</p>
        <p className="text-3xl md:text-4xl font-semibold">Achievements!</p>
        <p className="text-gray-600 text-sm md:text-base">
          Inspiring Journeys, Remarkable Milestones
        </p>
        <button
          className={themeButton}
          onClick={
            !isLoggedIn
              ? () => (window.location.href = "/")
              : () => (window.location.href = "/achievements")
          }
        >
          {!isLoggedIn ? "Log In" : "Visit Achievements"}
        </button>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-2/3 flex justify-center lg:justify-end">
        <div className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[600px] aspect-square border-dashed border border-[#ffcc00] rounded-full flex items-center justify-center relative">
          {/* Outer Circle Avatars */}
          <img
            src={
              !achieversImages[0]
                ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                : `data:image/jpeg;base64,${achieversImages[0]}`
            }
            alt="Achiever 1"
            className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square absolute -top-4 sm:-top-5 md:-top-8"
          />
          <img
            src={
              !achieversImages[1]
                ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                : `data:image/jpeg;base64,${achieversImages[1]}`
            }
            alt="Achiever 2"
            className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square absolute bottom-10 sm:bottom-14 md:bottom-18 right-6 sm:right-8 md:right-10"
          />
          <img
            src={
              !achieversImages[2]
                ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                : `data:image/jpeg;base64,${achieversImages[2]}`
            }
            alt="Achiever 3"
            className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square absolute bottom-10 sm:bottom-14 md:bottom-18 left-6 sm:left-8 md:left-12"
          />
          <img
            src={
              !achieversImages[3]
                ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                : `data:image/jpeg;base64,${achieversImages[3]}`
            }
            alt="Achiever 4"
            className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square absolute top-14 sm:top-20 md:top-30 left-0"
          />
          <img
            src={
              !achieversImages[4]
                ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                : `data:image/jpeg;base64,${achieversImages[4]}`
            }
            alt="Achiever 5"
            className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square absolute top-14 sm:top-20 md:top-30 right-0"
          />

          {/* Inner Circle */}
          <div className="h-[120px] sm:h-[150px] md:h-[300px] aspect-square border-dashed border border-[#ffcc00] rounded-full flex items-center justify-center relative">
            {/* Inner Circle Avatars */}
            <img
              src={
                !achieversImages[5]
                  ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                  : `data:image/jpeg;base64,${achieversImages[5]}`
              }
              alt="Achiever 6"
              className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square absolute -top-4 sm:-top-5 md:-top-7"
            />
            <img
              src={
                !achieversImages[6]
                  ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                  : `data:image/jpeg;base64,${achieversImages[6]}`
              }
              alt="Achiever 7"
              className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square absolute bottom-3 sm:bottom-4 md:bottom-7 left-0"
            />
            <img
              src={
                !achieversImages[7]
                  ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                  : `data:image/jpeg;base64,${achieversImages[7]}`
              }
              alt="Achiever 8"
              className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square absolute bottom-3 sm:bottom-4 md:bottom-7 right-0"
            />

            {/* Center Image */}
            <img
              src={
                !achieversImages[8]
                  ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                  : `data:image/jpeg;base64,${achieversImages[8]}`
              }
              alt="Achiever 9"
              className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutCCE = () => {
  return (
    <section className="flex flex-col w-[90%] space-y-10 md:space-y-20 items-center px-4 md:px-0">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Hero Section with Background Image */}
        <div className="relative rounded-lg overflow-hidden mb-6">
          <div className="h-64 md:h-80">
            <img
              src={Image || "/placeholder.svg"}
              alt="Students in classroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
                About CCE
              </h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - About Us */}
          <div className="md:col-span-6">
            <div className="p-6 rounded-lg border border-gray-200 shadow-sm h-full">
              <h2 className="text-xl md:text-2xl font-bold mb-4">About Us</h2>
              <div className="text-sm space-y-4 text-justify">
                <p>
                  At SNS Institutions, we constantly endeavor to identify the
                  potential opportunities for our students to elevate their
                  personality and professional competence, which in turn will
                  enhance their socio-economic status.
                </p>
                <p>
                  To strengthen our endeavor further, a unique center by name
                  "Center for Competitive Exams" has been created, which will
                  function under the command and control of the Dr Nalin Vimal
                  Kumar, Technical Director, SNS Institutions, with an aim to
                  guide and assist students to get placed in Indian Armed
                  Forces, Paramilitary Forces, Union & State Public Service
                  Commission (UPSC & TNPSC), Defence Research & Development
                  Organisation (DRDO) Labs, Council of Scientific & Industrial
                  Research (CSIR) Labs, Indian Space Research Organisation
                  (ISRO), Department of Science & Technology (DST), Indian
                  Engineering Services, Defence Public Sector Undertakings
                  (DPSUs), Central Public Sector Undertakings (CPSUs) and State
                  Public Sector Undertakings (SPSUs), in addition to various
                  Micro Small & Medium Enterprise (MSME) clusters and Private
                  companies associated with the aforesaid organisations.
                </p>
                <p>
                  In addition, the center will also endeavor to identify
                  opportunities for pursuing Internship & Research in renowned
                  Institutions and Organisations. To steer the activities in the
                  right direction, Commander (Dr.) D K Karthik (Retd.) has been
                  hired and appointed as Professor & Head-Center for Competitive
                  Exams, SNS Institutions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="bg-white rounded-l-lg md:col-span-6 space-y-6 md:-mt-16 z-10">
            <div className="p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">
                Dummy Content As Of Now.
              </h3>
              <p className="text-sm mb-4 text-justify">
                Commander (Dr.) D K Karthik (Retd.) has completed his BE from
                National Institute of Technology (NIT), Rourkela, M.Tech from
                Indian Institute of Technology (IIT), Bombay and Ph.D from
                National Institute of Technology (NIT), Tiruchirappalli. Prior
                joining SNS Institutions in Nov 2024, he has served in M/ s HCL
                Infosystems Ltd, Bangalore between 2001-02 and the Indian Navy
                between 2002-24.
              </p>
              <p className="text-sm text-justify">
                During his illustrious career of over 22 years in the Indian
                Navy, he has served onboard warships, visited 06 Nations on
                diplomatic assignments, held key portfolios related to
                Operations, Maintenance & Training in Command Headquarters &
                Naval Ship Repair Yards and extensively interacted with various
                Central & State Government Organisations. In addition to his
                primary portfolios, he was a member of Naval Recruitment team
                for over 04 years and Project Officer overseeing the Indigenous
                development of Foreign origin equipment.
              </p>
            </div>
            {/* Bottom Image */}
            <div className="rounded-lg overflow-hidden h-48 md:h-64">
              <img
                src={Image1 || "/placeholder.svg"}
                alt="CCE activities"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#070E20] w-screen min-h-screen px-4 py-8 md:px-8">
        <div className="flex flex-col items-center text-center space-y-3 md:space-y-5 mt-4 md:mt-8">
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-medium">
            Meet Our Expert Team
          </p>
          <p className="text-sm md:text-base text-gray-400 mb-5">
            Guiding You Towards Success With Knowledge & Experience
            <br className="hidden md:block" />
          </p>
        </div>

        <div
          className="flex flex-col md:flex-row md:space-x-3 lg:space-x-6 xl:space-x-14 space-y-8 md:space-y-0 
                  mb-8 md:mb-12 lg:mb-18 w-full max-w-7xl mx-auto mt-8 justify-center items-center md:items-stretch"
        >
          {[
            {
              name: "Dr. Karthik",
              post: "COMMANDER CHIEF",
              title: "Head of CCE",
              photo: mentor3,
            },
            {
              name: "Sindhuja",
              post: "M.Tech, Ph.D (Maths)",
              title: "CCE Support Staff",
              photo: mentor1,
            },
            {
              name: "Sindhuja",
              post: "M.Tech, Ph.D (Maths)",
              title: "CCE Support Staff",
              photo: mentor2,
            },
          ].map((person, key) => {
            const shuffleArray = (array) =>
              array.sort(() => Math.random() - 0.5);

            // Define the base colors
            const baseColors = [
              "#f8c974",
              "#fcf5ec",
              "#e09343",
              "#9f501e",
              "#f8c974",
            ];

            var shuffledArray = shuffleArray([...baseColors]);
            shuffledArray = [...shuffledArray, shuffledArray[0]];

            // Shuffle colors randomly for each div
            const randomizedGradient = `conic-gradient(${shuffledArray.join(
              ", "
            )})`;

            return (
              <div
                key={key}
                className="relative w-full md:w-auto md:flex-1 aspect-[3/4] sm:aspect-[2/3] max-w-[280px] sm:max-w-[320px] md:max-w-none rounded-lg overflow-hidden"
                style={{
                  position: "relative",
                  padding: "3px",
                  background: randomizedGradient,
                }}
              >
                <div className="w-full h-full bg-[#7DA1A1] rounded-md overflow-hidden relative">
                  <img
                    src={person.photo || "/placeholder.svg"}
                    alt=""
                    className="object-cover h-full w-full absolute rounded-md"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="flex flex-col items-start w-full bg-[#ffffffde] p-2 sm:p-3 rounded-lg">
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col sm:flex-row sm:items-end gap-1">
                        <p className="text-lg sm:text-xl md:text-2xl leading-tight font-medium">
                          {person.name}
                        </p>
                        <p className="text-xs text-rose-400">{person.post}</p>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-0.5">
                        {person.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default function HomeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [unconfirmedJob, setUnconfirmedJob] = useState(null);

  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    // setIsLoading(true)
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [jobsRes, achievementsRes, internshipsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/published-jobs/"),
          axios.get("http://localhost:8000/api/published-achievement/"),
          axios.get("http://localhost:8000/api/published-internship/"),
        ]);

        setJobs(jobsRes.data.jobs);
        setAchievements(achievementsRes.data.achievements);
        setInternships(internshipsRes.data.internships);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setIsLoading]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(
          `http://localhost:8000/api/applied-jobs/${userId}/`
        );
        const appliedJobs = response.data.jobs;

        const unconfirmed = appliedJobs.find((job) => job.confirmed === null);
        if (unconfirmed) {
          // Fetch job details using the job ID
          const jobResponse = await axios.get(
            `http://localhost:8000/api/job/${unconfirmed.job_id}/`
          );
          const jobDetails = jobResponse.data.job;
          setUnconfirmedJob({ ...unconfirmed, job_data: jobDetails.job_data });
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    checkApplicationStatus();
  }, []);

  const handleConfirm = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post("http://localhost:8000/api/confirm-job/", {
        studentId: userId,
        jobId: unconfirmedJob.job_id,
        confirmed: true,
      });
      setShowPopup(false);
    } catch (error) {
      console.error("Error confirming job application:", error);
      alert("Unable to track application. Please try again later.");
    }
  };

  const handleCancel = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post("http://localhost:8000/api/confirm-job/", {
        studentId: userId,
        jobId: unconfirmedJob.job_id,
        confirmed: false,
      });
      setShowPopup(false);
    } catch (error) {
      console.error("Error marking job application as not confirmed:", error);
      alert(
        "Unable to mark application as not confirmed. Please try again later."
      );
    }
  };

  const mentors = [
    {
      photo:
        "https://media.istockphoto.com/id/1300512215/photo/headshot-portrait-of-smiling-ethnic-businessman-in-office.jpg?s=612x612&w=0&k=20&c=QjebAlXBgee05B3rcLDAtOaMtmdLjtZ5Yg9IJoiy-VY=",
      name: "Joe",
    },
    {
      photo:
        "https://t3.ftcdn.net/jpg/06/39/64/14/360_F_639641415_lLjzVDVwL0RwdNrkURYFboc4N21YIXJR.jpg",
      name: "Samaratian",
    },
    {
      photo: "https://cdn2.f-cdn.com/files/download/38547697/ddc116.jpg",
      name: "Jane",
    },
    {
      photo:
        "https://media.istockphoto.com/id/1317804578/photo/one-businesswoman-headshot-smiling-at-the-camera.jpg?s=612x612&w=0&k=20&c=EqR2Lffp4tkIYzpqYh8aYIPRr-gmZliRHRxcQC5yylY=",
      name: "Emma",
    },
    {
      photo:
        "https://thumbs.dreamstime.com/b/profile-picture-caucasian-male-employee-posing-office-happy-young-worker-look-camera-workplace-headshot-portrait-smiling-190186649.jpg",
      name: "Shaun",
    },
    {
      photo:
        "https://th.bing.com/th/id/R.bc205eac509090ba026433b1565bc18a?rik=1BblnGHP1wqVYA&riu=http%3a%2f%2fwww.perfocal.com%2fblog%2fcontent%2fimages%2f2021%2f01%2fPerfocal_17-11-2019_TYWFAQ_100_standard-3.jpgfwww.perfocal.com%2fblog%2fcontent%2fimages%2f2021%2f01%2fPerfocal_17-11-2019_TYWFAQ_100_standard-3.jpg&ehk=MXaB6gPhPiykBuERz%2bfG0C9O7kxtvL6qKybZiRVExMI%3d&risl=&pid=ImgRaw&r=0",
      name: "Ghale",
    },
    {
      photo:
        "https://th.bing.com/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?rs=1&pid=ImgDetMain",
      name: "Elise",
    },
    {
      photo:
        "https://th.bing.com/th/id/OIP.bwuFduLmNb4boaf_mWiVFgHaFG?rs=1&pid=ImgDetMain",
      name: "Pitt",
    },
    {
      photo:
        "https://m.media-amazon.com/images/M/MV5BNGJmMWEzOGQtMWZkNS00MGNiLTk5NGEtYzg1YzAyZTgzZTZmXkEyXkFqcGdeQXVyMTE1MTYxNDAw._V1_FMjpg_UX1000_.jpg",
      name: "Reeves",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    student_email: "",
    message: "",
  });

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const studentId = decodedToken.student_user;
        const storedEmail = localStorage.getItem("student.email");
        const storedName = Cookies.get("username");

        // Only update state if the values are different
        if (storedName && storedEmail && studentId) {
          setFormData((prevData) => ({
            ...prevData,
            name: storedName,
            student_email: storedEmail,
            student_id: studentId,
          }));
        }
      } catch (error) {
        console.error("Invalid token format.", error);
      }
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/contact-us/",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsLoading(false);
      toast.success(response.data.message || "Message sent successfully!");

      setTimeout(() => {
        window.location.reload(); // Refresh page after success
      }, 1500); // Wait 1.5 seconds before refreshing
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data.error || "Something went wrong!");
    } finally {
      setIsLoading(false); // Reset button text
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Header jobs={jobs} />

      <ToastContainer />

      <section className="pt-20 md:pt-40 pb-10 md:pb-20 flex flex-col items-center justify-center text-center px-4">
        <p className="text-xl md:text-2xl"> Speed Up Your Job Search </p>
        <p className="text-4xl md:text-7xl font-semibold mt-2"> 10x faster </p>
        <p className="text-sm mt-2">
          {" "}
          We provide powerful features to streamline your job{" "}
          <br className="hidden md:block" /> applications and increase your
          chances of success{" "}
        </p>
      </section>

      <Insights />

      <section className="flex flex-col space-y-4 mt-10 md:mt-0 mb-10 md:mb-20 items-center w-[90%] mx-auto px-4 md:px-0">
        {/* Header Section */}
        <div className="">
          <div className="flex flex-col items-center space-y-2 mt-5">
            <p className="px-3 py-1 border rounded font-semibold text-sm md:text-base bg-gray-100">
              NEWEST
            </p>
            <p className="text-xl sm:text-2xl md:text-4xl font-semibold text-center ">
              Explore the Latest Job Opportunities
            </p>
            <p className="text-sm sm:text-sm md:text-sm font-semibold text-center ">
              Find Your Perfect Job, Internship, or Career Breakthrough
            </p>
          </div>

          {/* Cards Section */}
          <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-6 md:gap-8 mt-6">
            {jobs.length > 0 && (
              <>
                <div className="w-full sm:flex-1">
                  <ApplicationCard
                    application={{ ...jobs[3], ...jobs[3]?.job_data }}
                    key={jobs[4]?._id}
                    handleCardClick={() => {}}
                    isSaved={undefined}
                  />
                </div>
                <div className="w-full sm:flex-1">
                  <ApplicationCard
                    application={{ ...jobs[2], ...jobs[2]?.job_data }}
                    key={jobs[2]?._id}
                    handleCardClick={() => {}}
                    isSaved={undefined}
                  />
                </div>
              </>
            )}

            {internships.length > 0 && (
              <div className="w-full sm:flex-1">
                <ApplicationCard
                  key={internships[0].id}
                  application={{
                    ...internships[4].internship_data,
                    total_views: internships[4].total_views,
                    ...internships[0],
                  }}
                  handleCardClick={() => {
                    console.log(internships[0]);
                  }}
                  isSaved={undefined}
                />
              </div>
            )}
          </div>
        </div>
      </section>
      <ThatOnePainInTheA__
        achieversImages={[...achievements.map((achiever) => achiever.photo)]}
      />

      <AboutCCE mentors={mentors} />

      <FAQSection />

      <ContactSection
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1e2939a8] z-60 px-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Confirm Your Job Application
            </h2>
            <p className="mb-4 text-sm md:text-base">
              Did you complete your job application for "
              {unconfirmedJob?.job_data?.title}"?
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
              >
                Yes, Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
