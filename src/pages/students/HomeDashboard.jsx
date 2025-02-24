import { useContext, useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LoaderContext } from "../../components/Common/Loader";
import gridImg from '../../assets/images/Grid Lines.png';
import achievementScreenShot from '../../assets/images/achievements-screenshot.png';
import ApplicationCard from "../../components/Students/ApplicationCard";

// icon imports
import codeSandBoxIcon from '../../assets/icons/codesandbox.png';
import pullIcon from '../../assets/icons/git-pull-request.png';
import gridIcon from '../../assets/icons/grid-icon.png';
import mailIcon from '../../assets/icons/mail.png';
import sendIcon from '../../assets/icons/send.png';
import fileIcon from '../../assets/icons/file.png';

import { toast, ToastContainer } from 'react-toastify'

const themeButton = "px-7 py-[6px] rounded w-fit text-sm bg-[#FFCC00] cursor-pointer";

import { IoIosArrowForward } from "react-icons/io";
import { IoMdClose, IoMdAdd } from "react-icons/io";

import { FiMail, FiPhone } from "react-icons/fi";


//image imports
import mentor1 from '../../assets/images/mentors (1).jpeg'
import mentor2 from '../../assets/images/mentors (2).jpeg'
import mentor3 from '../../assets/images/mentors (3).png'

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", contact: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);

    if (formData.contact.length <= 4 || formData.name.length <= 4 || formData.name.length <= 4) {
      toast.error("Please enter a valid message")
      return
    }

    toast.success("Message Sent Successfully")
  };

  return (
    <div className="flex flex-col md:flex-row items-center space-x-12 justify-stretch py-8 pt-22 relative">
      <img src={gridImg} className="absolute w-full h-full -z-1 object-cover" alt="" />

      <div className="px-[5%] w-full flex">
        {/* Left Section */}
        <div className="md:w-1/2 space-y-4 px-[4%]">
          <h2 className="text-3xl font-bold">Get in touch with us today!</h2>
          <p className="text-gray-600">
            Whatever you need, whenever you need, our team is here to help, dedicated
            to supporting you every step of the way.
          </p>
          <div className="flex items-center space-x-18 py-12 w-full">
            <div className="flex flex-col items-stretch space-x-3 pb-2 flex-1">
              <div className="border-b pb-2.5 mb-2.5">
                <FiMail className="w-8 h-8 p-1.5 border rounded-lg border-gray-500 mb-1" />
                <p className="text-xl">Message Us</p>
              </div>

              <p className="text-gray-500">support@gmail.com</p>
            </div>
            <div className="flex flex-col items-stretch space-x-3 pb-2 flex-1">
              <div className="border-b pb-2.5 mb-2.5">
                <FiPhone className="w-8 h-8 p-1.5 border rounded-lg border-gray-500 mb-1" />
                <p className="text-xl">Call Us</p>
              </div>

              <p className="text-gray-500">+91 98765 54321</p>
            </div>


          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="flex-1 px-[8%]">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full mt-6 md:mt-0">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded bg-yellow-100 focus:outline-none"
              />
              <input
                type="text"
                name="contact"
                placeholder="Your contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full p-3 rounded bg-yellow-100 focus:outline-none"
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
                className="w-full bg-yellow-400 text-black font-semibold py-3 rounded hover:bg-yellow-500 transition"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQSection = () => {
  const faqs = [
    {
      question: "Can I enroll in multiple courses at once?",
      answer:
        "Absolutely! You can enroll in multiple courses simultaneously and access them at your convenience.",
      linkText: "Enrollment Process for Different Courses",
    },
    {
      question: "What kind of support can I expect from instructors?",
    },
    {
      question: "Are the courses self-paced or do they have specific start and end dates?",
    },
    {
      question: "Are there any prerequisites for the courses?",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center items-center py-24 w-[90%]">
      <div className="w-full  grid grid-cols-2 gap-10">
        {/* Left Side */}
        <div className="flex flex-col space-y-4 justify-center">
          <h2 className="text-5xl">FAQs</h2>
          <p className="text-gray-500">Still have any questions? Contact our Team via support@mail.com</p>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 w-fit">See All FAQs</button>
        </div>

        {/* Right Side - FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 bg-white relative"
            >
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleFAQ(index)}>
                <p className="font-medium">{faq.question}</p>
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
}

const Header = ({ jobs }) => {
  return <header className="w-full relative" id="hero">
    <img src={gridImg} alt="" className="absolute h-full w-full -z-1 object-cover" />

    <div className="h-20"></div>

    <div className="w-full">
      <StudentPageNavbar transparent={true} />
    </div>

    {jobs.length > 0 && <div className="w-full h-full absolute flex">
      <div className="flex-1 flex flex-col">

        <div className="flex-1 flex items-center px-20 pt-10">
          <div className="w-70 rotate-[-20deg] hover:rotate-[0deg] hover:scale-[1.2] cursor-pointer">
            <ApplicationCard
              small={true}
              application={{ ...(jobs[0]), ...(jobs[0]?.job_data) }}
              key={(jobs[0])?._id}
              handleCardClick={() => {
              }}
              isSaved={undefined}
            />
          </div>
        </div>

        <div className="flex-1 flex justify-end px-30 pb-30">
          <div className="w-70 scale-[0.5] rotate-[-50deg] relative hover:rotate-[0deg] hover:scale-[1.1]">
            <ApplicationCard
              small={true}
              application={{ ...(jobs[1]), ...(jobs[1]?.job_data) }}
              key={(jobs[1])?._id}
              handleCardClick={() => {
              }}
              isSaved={undefined}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end -mt-30 px-30">
        <div className="w-70 rotate-[20deg]  scale-[0.8] relative hover:rotate-[0deg] hover:scale-[1.2] cursor-pointer">
          <ApplicationCard
            small={true}
            application={{ ...(jobs[2]), ...(jobs[2]?.job_data) }}
            key={(jobs[2])?._id}
            handleCardClick={() => {
            }}
            isSaved={undefined}
          />
        </div>
      </div>
    </div>}

    <div className="w-full flex flex-col items-center text-center py-34 space-y-5 z-20">
      <p className="text-7xl font-semibold"> One Step Closer To <br /> Your <span className="text-[#FFCC00]"> Dream Job </span> </p>
      <p> let us help you find a job that suits you the best! </p>
      <button className={themeButton + " z-20"} onClick={() => window.location.href = "jobs"}> Explore </button>
    </div>

    <div className="relative w-full">
      <p className="w-full bg-[#FFCC00] p-4 px-0 rotate-[2deg] text-justify shadow-lg leading-snug custom-justify text-2xl">
        Build an entrepreneurial mindset through our Design Thinking Framework * Redesigning common mind and Business Towards Excellence
      </p>

      <p className="absolute -z-1 top-0 w-full bg-[#e4b600] p-6 py-9 rotate-[-2deg]"> </p>
    </div>
  </header>
}

const Insights = () => {
  return <section className="w-[85%] self-center flex flex-col items-center space-y-20">
    <div className="flex flex-col items-center space-y-2">
      <p className="text-4xl font-semibold"> Spend less time looking for work </p>
      <p className="text-gray-500"> We'll help you through the hardest part of your job search. </p>
    </div>
    <div className="grid grid-cols-3 gap-8">
      {[
        {
          icon: codeSandBoxIcon,
          title: "Cover Letter",
          content:
            "A cover letter is a document that accompanies a job application and is written to introduce the applicant to the employer.",
        },
        {
          icon: pullIcon,
          title: "Resignation Letters",
          content:
            "A resignation letter is a formal document that an employee writes to inform their employer of their decision to leave the company.",
        },
        {
          icon: gridIcon,
          title: "Connection Request",
          content:
            "A connection request is a message sent on a social networking site, such as LinkedIn, requesting to connect with another user.",
        },
        {
          icon: mailIcon,
          title: "Outreach Emails",
          content:
            "Outreach emails are messages sent by individuals or businesses to introduce themselves, establish a connection, or propose a collaboration.",
        },
        {
          icon: sendIcon,
          title: "Resume Optimization",
          content:
            "Smart Personalization refers to the use of data and technology to deliver tailored experiences and content to individual customers or users.",
        },
        {
          icon: fileIcon,
          title: "Resume Design",
          content:
            "A resume scanner is a software application that uses optical character recognition (OCR) technology to extract and analyze data from resumes.",
        },
      ].map((item, key) => {
        const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

        const baseColors = ["#f8c974", "#fcf5ec", "#e09343", "#9f501e", "#f8c974"];

        var shuffledArray = shuffleArray([...baseColors])
        shuffledArray = [...shuffledArray, shuffledArray[0]]

        const randomizedGradient = `conic-gradient(${shuffledArray.join(", ")})`;

        return (
          <div
            key={key}
            className="custom-border p-4 py-6 flex flex-col space-y-8 justify-between"
            style={{ "--custom-gradient": randomizedGradient }} // Pass gradient as CSS variable
          >
            <div>
              <img src={item.icon} className="w-6 mb-1" alt="" />
              <p className="text-xl font-semibold"> {item.title} </p>
            </div>
            <p> {item.content} </p>
          </div>
        )
      })}
    </div>
  </section>
}

const ThatOnePainInTheA__ = ({ avatars }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return <section className="flex w-[85%] py-30 items-center">
    <div className="space-y-3 flex-1">
      <p className=" text-5xl font-semibold"> Our Distinguished Achievers </p>
      <p className="text-gray-600"> Celebrating the inspiring journeys of individuals who exemplify excellence, innovation and leadership </p>
      <button className={themeButton} onClick={!isLoggedIn ? () => window.location.href = "/" : () => window.location.href = "/achievements"}> {!isLoggedIn ? "Log In" : "Visit Achievements"} </button>
    </div>

    <div className="w-2/3 flex justify-end">
      <div className="h-[600px] aspect-square border-dashed border border-[#ffcc00] rounded-full flex items-center justify-center relative">
        {/* outer circle avatars */}
        <img src={avatars[0].photo} alt="" className="w-16 rounded-full object-cover aspect-square absolute -top-8" />
        <img src={avatars[1].photo} alt="" className="w-16 rounded-full object-cover aspect-square absolute bottom-18 right-10" />
        <img src={avatars[2].photo} alt="" className="w-16 rounded-full object-cover aspect-square absolute bottom-18 left-12" />
        <img src={avatars[3].photo} alt="" className="w-16 rounded-full object-cover aspect-square absolute top-30 left-0" />
        <img src={avatars[4].photo} alt="" className="w-16 rounded-full object-cover aspect-square absolute top-30 right-0" />

        <div className="h-[300px] aspect-square border-dashed border border-[#ffcc00] rounded-full flex items-center justify-center relative">
          {/* inner cirlce images */}
          <img src={avatars[5].photo} alt="" className="w-16 rounded-full object-cover aspect-square absolute -top-7 " />
          <img src={avatars[6].photo} alt="" className="w-16 rounded-full object-cover aspect-square absolute bottom-7 left-0" />
          <img src={avatars[7].photo} alt="" className="w-16 rounded-full object-cover aspect-square absolute bottom-7 right-0 " />

          {/* center image */}
          <img src={avatars[8].photo} alt="" className="w-16 rounded-full object-cover aspect-square" />
        </div>
      </div>
    </div>
  </section>
}

const AboutCCE = () => {
  return <section className="flex flex-col w-[90%] space-y-20 items-center">
    <div className="flex flex-col items-center space-y-5">
      <p className="text-5xl"> About CCE </p>
      <p> At SNS Institutions, we constantly endeavor to identify the potential opportunities for our students to elevate their personality and professional competence, which in turn will enhance their socio-economic status. To strengthen our endeavor further, a unique center by name “Center for Competitive Exams” has been created, which will function under the command and control of the Dr Nalin Vimal Kumar, Technical Director, SNS Institutions, with an aim to guide and assist students to get placed in Indian Armed Forces, Paramilitary Forces, Union & State Public Service Commission (UPSC & TNPSC), Defence Research & Development Organisation (DRDO) Labs, Council of Scientific & Industrial Research (CSIR) Labs, Indian Space Research Organisation (ISRO), Department of Science & Technology (DST), Indian Engineering Services, Defence Public Sector Undertakings (DPSUs), Central Public Sector Undertakings (CPSUs) and State Public Sector Undertakings (SPSUs), in addition to various Micro Small & Medium Enterprise (MSME) clusters and Private companies associated with the aforesaid organisations. In addition, the center will also endeavor to identify opportunities for pursuing Internship & Research in renowned Institutions and Organisations. To steer the activities in the right direction, Commander (Dr.) D K Karthik (Retd.) has been hired and appointed as Professor & Head-Center for Competitive Exams, SNS Institutions. </p>
    </div>

    <div className="flex flex-col items-center text-center space-y-5">
      <p className="text-5xl"> Meet our team </p>
      <p> Engage yourself and grab your opportunity with the <br /> resources available here. </p>
    </div>

    <div className="flex space-x-14 mb-18 w-full">
      {
        [
          {
            name: "Dr.Karthick",
            post: "Commander Chief",
            title: "Head of CCE",
            photo: "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
          },
          {
            name: "Sindhuja",
            post: "M.Tech, Ph.D (Maths)",
            title: "CCE Support Staff",
            photo: mentor1
          },
          {
            name: "Sindhuja",
            post: "M.Tech, Ph.D (Maths)",
            title: "CCE Support Staff",
            photo: mentor2
          },
        ].map((person, key) => {
          const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

          // Define the base colors
          const baseColors = ["#f8c974", "#fcf5ec", "#e09343", "#9f501e", "#f8c974"];

          var shuffledArray = shuffleArray([...baseColors])
          shuffledArray = [...shuffledArray, shuffledArray[0]]

          // Shuffle colors randomly for each div
          const randomizedGradient = `conic-gradient(${shuffledArray.join(", ")})`;

          return <div className="relative flex-1 aspect-[2/3] flex flex-col justify-end items-start custom-border relative" style={{ "--custom-gradient": randomizedGradient, "--border-width": "-2.5px" }} >
            <img src={person.photo} alt="" className="object-cover h-full w-full absolute rounded-[8px]" />
            <div className="p-2 z-10 w-full">
              <div className="flex flex-col items-start w-full bg-[#ffffffde] p-3 rounded-lg">
                <span className="flex items-end space-x-2"> <p className="text-2xl leading-none"> {person.name} </p> <p className="text-xs text-rose-400"> {person.post} </p> </span>
                <p className="text-gray-500"> {person.title} </p>
              </div>
            </div>
          </div>
        })
      }
    </div>
  </section>
}

const Footer = () => {
  return (
    <footer className="w-full flex justify-center items-center min-h-[30vh] border border-gray-300 mt-20">
      <div className="container p-10">
        <div className="flex">
          <div className="w-2/5">
            <h3 className="text-3xl mb-5">Centre for Competitive Exams</h3>
            <div className="w-3/4">
              <p className="text-sm">CCE focuses on constantly endeavor to identify the potential opportunities for our students to elevate their personality and professional competence, which in turn will enhance their socio-economic status</p>
              <hr className="border-1 border-black my-5" />
              <p className="text-sm mb-5">SNS Kalvi Nagar, Sathy Mani Road NH-209,<br />Vazhiyampalayam, Saravanampatti, Coimbatore,<br />Tamil Nadu<br />641035</p>
              <div className="flex space-x-7">
                <i className="bi bi-linkedin text-2xl"></i>
                <i className="bi bi-youtube text-2xl"></i>
                <i className="bi bi-instagram text-2xl"></i>
                <i className="bi bi-twitter text-2xl"></i>
              </div>
            </div>
          </div>
          <div className="w-3/5 flex justify-between pl-20">
            <div>
              <p className="font-bold mb-10">Products</p>
              <ul className="space-y-3">
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-10">Resources</p>
              <ul className="space-y-3">
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-10">Company</p>
              <ul className="space-y-3">
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-10">Support</p>
              <ul className="space-y-3">
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="my-10 space-y-5 ">
          <hr className="border-1 border-black" />
          <p className="text-sm">&copy; {new Date().getFullYear()} SNS iHub Workplace. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}

export default function HomeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [unconfirmedJob, setUnconfirmedJob] = useState(null);

  const { setIsLoading } = useContext(LoaderContext)

  useEffect(() => {
    // setIsLoading(true)
    const fetchData = async () => {
      try {
        const [jobsRes, achievementsRes, internshipsRes] = await Promise.all([
          axios.get("https://cce-backend-54k0.onrender.com/api/published-jobs/"),
          axios.get("https://cce-backend-54k0.onrender.com/api/published-achievement/"),
          axios.get("https://cce-backend-54k0.onrender.com/api/published-internship/")
        ]);

        setJobs(jobsRes.data.jobs);
        setAchievements(achievementsRes.data.achievements);
        setInternships(internshipsRes.data.internships);
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setIsLoading(false)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(`https://cce-backend-54k0.onrender.com/api/applied-jobs/${userId}/`);
        const appliedJobs = response.data.jobs;

        const unconfirmed = appliedJobs.find(job => job.confirmed === null);
        if (unconfirmed) {
          // Fetch job details using the job ID
          const jobResponse = await axios.get(`https://cce-backend-54k0.onrender.com/api/job/${unconfirmed.job_id}/`);
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
      await axios.post('https://cce-backend-54k0.onrender.com/api/confirm-job/', {
        studentId: userId,
        jobId: unconfirmedJob.job_id,
        confirmed: true
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
      await axios.post('https://cce-backend-54k0.onrender.com/api/confirm-job/', {
        studentId: userId,
        jobId: unconfirmedJob.job_id,
        confirmed: false
      });
      setShowPopup(false);
    } catch (error) {
      console.error("Error marking job application as not confirmed:", error);
      alert("Unable to mark application as not confirmed. Please try again later.");
    }
  };

  const mentors = [
    { 'photo': "https://media.istockphoto.com/id/1300512215/photo/headshot-portrait-of-smiling-ethnic-businessman-in-office.jpg?s=612x612&w=0&k=20&c=QjebAlXBgee05B3rcLDAtOaMtmdLjtZ5Yg9IJoiy-VY=", 'name': "Joe" },
    { 'photo': "https://t3.ftcdn.net/jpg/06/39/64/14/360_F_639641415_lLjzVDVwL0RwdNrkURYFboc4N21YIXJR.jpg", 'name': "Samaratian" },
    { 'photo': "https://cdn2.f-cdn.com/files/download/38547697/ddc116.jpg", 'name': "Jane" },
    { 'photo': "https://media.istockphoto.com/id/1317804578/photo/one-businesswoman-headshot-smiling-at-the-camera.jpg?s=612x612&w=0&k=20&c=EqR2Lffp4tkIYzpqYh8aYIPRr-gmZliRHRxcQC5yylY=", 'name': "Emma" },
    { 'photo': "https://thumbs.dreamstime.com/b/profile-picture-caucasian-male-employee-posing-office-happy-young-worker-look-camera-workplace-headshot-portrait-smiling-190186649.jpg", 'name': "Shaun" },
    { 'photo': "https://th.bing.com/th/id/R.bc205eac509090ba026433b1565bc18a?rik=1BblnGHP1wqVYA&riu=http%3a%2f%2fwww.perfocal.com%2fblog%2fcontent%2fimages%2f2021%2f01%2fPerfocal_17-11-2019_TYWFAQ_100_standard-3.jpg&ehk=MXaB6gPhPiykBuERz%2bfG0C9O7kxtvL6qKybZiRVExMI%3d&risl=&pid=ImgRaw&r=0", 'name': "Ghale" },
    { 'photo': "https://th.bing.com/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?rs=1&pid=ImgDetMain", 'name': "Elise" },
    { 'photo': "https://th.bing.com/th/id/OIP.bwuFduLmNb4boaf_mWiVFgHaFG?rs=1&pid=ImgDetMain", 'name': "Pitt" },
    { 'photo': "https://m.media-amazon.com/images/M/MV5BNGJmMWEzOGQtMWZkNS00MGNiLTk5NGEtYzg1YzAyZTgzZTZmXkEyXkFqcGdeQXVyMTE1MTYxNDAw._V1_FMjpg_UX1000_.jpg", 'name': "Reeves" }
  ]

  return (
    <div className="flex flex-col items-center">
      <Header jobs={jobs} />

      <ToastContainer />

      <section className="pt-40 pb-20 flex flex-col items-center justify-center text-center">
        <p className="text-2xl"> Submit Better job applications </p>
        <p className="text-7xl font-semibold"> 10x faster </p>
        <p className="text-sm"> AI cover letter generator, resume keyword checker, outreach <br /> message writer, and more. Powered by GPT </p>
      </section>

      <Insights />

      <section className="flex flex-col space-y-3 mt-30 mb-20 items-center w-[85%]">
        <p className="px-3 py-1 border rounded font-semibold"> NEWEST </p>
        <p className="text-4xl font-semibold"> Jobs. Internships. Exams. More </p>

        <div className="flex w-full gap-8 mt-6">
          {jobs.length > 0 && <>
            <ApplicationCard
              application={{ ...(jobs[4]), ...(jobs[4]?.job_data) }}
              key={(jobs[4])?._id}
              handleCardClick={() => {
              }}
              isSaved={undefined}
            />
            <ApplicationCard
              application={{ ...(jobs[2]), ...(jobs[2]?.job_data) }}
              key={(jobs[2])?._id}
              handleCardClick={() => {
              }}
              isSaved={undefined}
            />
          </>}

          {
            internships.length > 0 && <ApplicationCard
              key={(internships[0]).id}
              application={{ ...(internships[0].internship_data), total_views: (internships[0]).total_views, ...(internships[0]) }} // Include total_views
              handleCardClick={() => { console.log(internships[0]) }}
              isSaved={undefined}
            />
          }
        </div>
      </section>

      <ThatOnePainInTheA__ avatars={mentors} />

      <AboutCCE mentors={mentors} />

      <FAQSection />

      <ContactSection />

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1e2939a8] z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Job Application</h2>
            <p className="mb-4">
              Did you complete your job application for "{unconfirmedJob?.job_data?.title}"?
            </p>
            <div className="flex justify-center space-x-4">
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
