// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { FiSearch } from "react-icons/fi";
// import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
// import { LoaderContext } from "../../components/Common/Loader";
// import bgimage from "../../assets/icons/Group 1.svg";

// export default function AchievementDashboard() {
//   const [achievements, setAchievements] = useState([]);
//   const [filteredAchievements, setFilteredAchievements] = useState([]);
//   const [error, setError] = useState("");
//   const { isLoading, setIsLoading } = useContext(LoaderContext);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [selectedCompany, setSelectedCompany] = useState("");

//   useEffect(() => {
//     const fetchPublishedAchievements = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get("https://cce-backend-54k0.onrender.com/api/published-achievement/");
//         setAchievements(response.data.achievements);
//         setFilteredAchievements(response.data.achievements);
//       } catch (err) {
//         console.error("Error fetching published achievements:", err);
//         setError("Failed to load achievements.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPublishedAchievements();
//   }, [setIsLoading]);

//   const filters = ["Internship", "Job Placement", "Certification", "Exam Cracked"];

//   useEffect(() => {
//     let filtered = achievements;

//     if (selectedFilter) {
//       filtered = filtered.filter((achievement) => achievement.achievement_type === selectedFilter);
//     }
//     if (selectedCompany) {
//       filtered = filtered.filter((achievement) => companies.includes(achievement.company_name));
//     }
//     if (searchQuery) {
//       filtered = filtered.filter((achievement) =>
//         achievement.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredAchievements(filtered);
//   }, [selectedFilter, selectedCompany, searchQuery, achievements]);

//   return (
//     <div className="flex flex-col ml-0">
//       <StudentPageNavbar transparent={true} />
//       {/* Header Section */}
//       <div className="text-center my-6 py-4">
//         <h1 className="text-6xl tracking-[0.8px]">Achievement</h1>
//         <p className="text-lg mt-2 text-center">Explore all the opportunities in all the existing fields around the globe.</p>
//       </div>

//       {/* Filters & Search Bar */}
//       <div className="w-[25%] self-auto mt-6 ml-35 flex justify-between items-center p-2 rounded-xl">
//         <div className="flex gap-3">
//           {/* Job & Internship Filter */}
//           <select
//             className="px-2 py-2 ml-6 text-sm bg-white rounded-full shadow-sm border border-gray-300 hover:bg-gray-200 transition"
//             value={selectedFilter}
//             onChange={(e) => setSelectedFilter(e.target.value)}
//           >
//             <option value="">Job Type</option>
//             {filters.map((type) => (
//               <option key={type} value={type}>{type}</option>
//             ))}
//           </select>
//         </div>

//         {/* Search Bar */}
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search Student"
//             className="pl-4 pr-10 py-2 text-sm bg-white rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <FiSearch className="absolute right-3 top-3 text-gray-500" />
//         </div>
//       </div>

//       {/* Achievements Grid */}
//       <div className="w-[75%] self-center mr-15 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//         {error ? (
//           <p className="text-red-600">{error}</p>
//         ) : filteredAchievements.length === 0 ? (
//           <p className="text-gray-600">No achievements available at the moment.</p>
//         ) : (
//           filteredAchievements.map((achievement) => (
//             <div
//               key={achievement._id}
//               className="p-6 border-gray-900 rounded-xl shadow-lg bg-white flex flex-col items-center relative transition-transform duration-300 hover:scale-109 hover:shadow-xl"
//             >
//           {/* Background Image */}
//               <img
//                src={bgimage}
//                alt="Background"
//                className="absolute top-0 left-0 right-0 w-full h-full object-contain "
//                 />
//               {/* Background Image */}
//               <img
//                 src={bgimage}
//                 alt="Background"
//                 className="absolute top-0 left-0 w-full h-full object-contain opacity-20"
//               />

//               {achievement.photo && (
//                 <img
//                   src={`data:image/jpeg;base64,${achievement.photo}`}
//                   alt="Achievement"
//                   className="relative z-10 w-20 h-20 object-cover rounded-full border-4 border-gray-300 shadow-md"
//                 />
//               )}
//               <h2 className="text-lg font-semibold text-gray-900 mt-3 relative z-10">{achievement.name}</h2>
//               <p className="text-gray-600 text-xs relative z-10">{achievement.achievement_type}</p>
//               <div className="mt-2 flex flex-wrap justify-center gap-2 relative z-10">
//                 <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">{achievement.company_name}</span>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { LoaderContext } from "../../components/Common/Loader";
import Squares from "../../components/ui/GridLogin";
import Pagination from "../../components/Admin/pagination";

export default function AchievementDashboard() {
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [error, setError] = useState("");
  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const fetchPublishedAchievements = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://cce-backend-54k0.onrender.com/api/published-achievement/"
        );
        setAchievements(response.data.achievements);
        setFilteredAchievements(response.data.achievements);
      } catch (err) {
        console.error("Error fetching published achievements:", err);
        setError("Failed to load achievements.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedAchievements();
  }, [setIsLoading]);

  const filters = [
    "Internship",
    "Job Placement",
    "Certification",
    "Exam Cracked",
  ];

  useEffect(() => {
    let filtered = achievements;

    if (selectedFilter) {
      filtered = filtered.filter(
        (achievement) => achievement.achievement_type === selectedFilter
      );
    }
    if (selectedCompany) {
      filtered = filtered.filter((achievement) =>
        achievement.company_name
          .toLowerCase()
          .includes(selectedCompany.toLowerCase())
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((achievement) =>
        achievement.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAchievements(filtered);
  }, [selectedFilter, selectedCompany, searchQuery, achievements]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAchievements = filteredAchievements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background */}
      <div className="h-full w-full absolute top-0 left-0 z[-5]">
        <Squares
          speed={0.1}
          squareSize={isMobile ? 20 : 40}
          direction="diagonal"
          borderColor="#FCF55F"
          hoverFillColor="#ffcc00"
        />
      </div>

      <StudentPageNavbar transparent={true} />

      {/* Header Section */}
      <div className="text-center my-6 py-4 relative">
        <h1 className="text-5xl pt-8 md:text-6xl tracking-[0.8px] font-bold">
          <span className="">Celebrating</span>
          <span className="text-[#ffcc00]"> Student Excellence,</span>
          <br />
          <span>Inspiring Achievements!</span>
        </h1>
      </div>

      {/* Featured Achievements Carousel */}
      <div className="w-full overflow-hidden py-8">
        <div className="marquee-container">
          <div className="marquee-content">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : filteredAchievements.length === 0 ? (
              <p className="text-gray-600">
                No achievements available at the moment.
              </p>
            ) : (
              filteredAchievements.map((achievement) => (
                <div key={achievement._id} className="marquee-item">
                  <div className="achievement-card relative rounded-xl shadow-md overflow-hidden">
                    <div className="w-full h-full">
                      {achievement.photo && (
                        <img
                          src={`data:image/jpeg;base64,${achievement.photo}`}
                          alt={achievement.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="achievement-info absolute bottom-0 left-0 right-0 p-3 text-black bg-white rounded-lg mb-2 ml-3 mr-3">
                      <h2 className="achievement-name">{achievement.name}</h2>
                      <p className="achievement-batch text-amber-400">
                        {achievement.batch}
                      </p>
                      <p className="achievement-description text-gray-500">
                        {achievement.achievement_description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-0 z-10 bg-[white]/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search Student"
              className="w-full pl-4 pr-10 py-2 text-sm bg-white rounded-full border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-3 text-gray-500" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  setSelectedFilter(filter === selectedFilter ? "" : filter)
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? "bg-amber-500 text-white"
                    : "bg-white border border-gray-300 hover:bg-amber-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentAchievements.map((achievement) => (
            <div
              key={achievement._id}
              className="group relative bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
            >
              {/* Photo */}
              {achievement.photo && (
                <img
                  src={`data:image/jpeg;base64,${achievement.photo}`}
                  alt={achievement.name}
                  className="w-32 h-32 object-cover rounded-full mb-4 shadow-md"
                />
              )}

              {/* Name and Role */}
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {achievement.name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {achievement.achievement_type}
                <br />
                <span className="text-amber-400 text-sm font-medium">
                  {achievement.batch}
                </span>
              </p>

              {/* Email */}
              <p className="text-sm text-gray-600 mb-4">{achievement.email}</p>

              {/* Description */}
              <p className="text-gray-700 text-center">
                {achievement.achievement_description}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredAchievements.length}
          paginate={paginate}
          currentPage={currentPage}
        />

        {/* Footer (unchanged) */}
        <footer className="w-full flex justify-center items-center min-h-[30vh]  mt-20">
          <div className="container p-10">
            <div className="flex">
              <div className="w-2/5">
                <h3 className="text-3xl mb-5">Centre for Competitive Exams</h3>
                <div className="w-3/4">
                  <p className="text-sm">
                    CCE focuses on constantly endeavor to identify the potential
                    opportunities for our students to elevate their personality
                    and professional competence, which in turn will enhance
                    their socio-economic status
                  </p>
                  <hr className="border-1 border-black my-5" />
                  <p className="text-sm mb-5">
                    SNS Kalvi Nagar, Sathy Mani Road NH-209,
                    <br />
                    Vazhiyampalayam, Saravanampatti, Coimbatore,
                    <br />
                    Tamil Nadu
                    <br />
                    641035
                  </p>
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
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-10">Resources</p>
                  <ul className="space-y-3">
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-10">Company</p>
                  <ul className="space-y-3">
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-10">Support</p>
                  <ul className="space-y-3">
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                    <li>
                      <p className="text-xs">Product</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="my-10 space-y-5 ">
              <hr className="border-1 border-black" />
              <p className="text-sm">
                &copy; {new Date().getFullYear()} SNS iHub Workplace. All Rights
                Reserved
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
