import { useState, useEffect, useContext, useMemo, useRef } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { LoaderContext } from "../../components/Common/Loader";
import Squares from "../../components/ui/GridLogin";
import Pagination from "../../components/Admin/pagination";

export default function AchievementDashboard() {
  // State management
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [error, setError] = useState("");
  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [carouselFilter, setCarouselFilter] = useState("");

  const carouselRef = useRef(null);
  const animationRef = useRef(null);

  // Fetch data
  useEffect(() => {
    const fetchPublishedAchievements = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://cce-backend-54k0.onrender.com/api/published-achievement/"
        );
        const sortedAchievements = response.data.achievements.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setAchievements(sortedAchievements);
        setFilteredAchievements(sortedAchievements);
        // setIsLoading(false)
      } catch (err) {
        setIsLoading(false);
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

  // Filter logic
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedFilter, selectedCompany, searchQuery, achievements]);

  // Mobile detection and itemsPerPage adjustment
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setItemsPerPage(mobile ? 5 : 8);

      // Check if there are any starred achievements
      const starredAchievements = achievements.filter(
        (achievement) => achievement.starred === true
      );
      if (starredAchievements.length === 0) {
        console.warn("No starred achievements found");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [achievements]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAchievements = filteredAchievements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Remove the window.scrollTo(0, 0) to prevent full page refresh
  };

  // Recent achievements for carousel
  const recentAchievements = useMemo(() => {
    let filtered = achievements
      .filter((achievement) => achievement.starred === true)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    if (carouselFilter) {
      filtered = filtered.filter(
        (achievement) => achievement.achievement_type === carouselFilter
      );
    }
    return filtered.slice(0, isMobile ? 5 : 5); // Ensure we always show up to 5 items, regardless of view
  }, [achievements, carouselFilter, isMobile]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background */}
      <div className="h-full w-full absolute top-0 left-0 z-[-5]">
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
      <div className="text-center  my-4 md:my-6 py-2 md:py-4 relative px-4 ">
        <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.8px] font-bold mt-15">
          <span className="">Celebrating</span>
          <span className="text-[#ffcc00]"> Student Excellence,</span>
          <br className="hidden md:inline" />
          <span>Inspiring Achievements!</span>
        </h1>
      </div>

      {/* Featured Achievements Carousel */}
      <div className="w-full overflow-hidden py-4 md:py-8 relative">
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex w-full justify-start md:justify-center space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : recentAchievements.length === 0 ? (
              <p className="text-gray-600 text-center w-full">
                No starred achievements available at the moment.
              </p>
            ) : (
              recentAchievements.map((achievement, index) => (
                <div
                  key={achievement._id}
                  className="flex-shrink-0 w-[280px] md:w-[270px] snap-center"
                >
                  <div className="h-full bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="relative h-50 md:h-56">
                      {achievement.photo && (
                        <img
                          src={`data:image/jpeg;base64,${achievement.photo}`}
                          alt={achievement.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-amber-500 mb-2">
                        {achievement.batch}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
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
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search Student"
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-white rounded-full border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() =>
                    setSelectedFilter(filter === selectedFilter ? "" : filter)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap hover:shadow-sm ${
                    selectedFilter === filter
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-white border border-gray-300 hover:bg-amber-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Mobile Filters Dropdown */}
            <div
              className={`sm:hidden overflow-hidden transition-all duration-300 ${
                isFilterMenuOpen ? "max-h-48" : "max-h-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-2 py-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(
                        filter === selectedFilter ? "" : filter
                      );
                      setIsFilterMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
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
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full mb-4 shadow-md"
                />
              )}

              {/* Name and Role */}
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                {achievement.name}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                {achievement.achievement_type}
                <br />
                <span className="text-amber-400 text-xs md:text-sm font-medium">
                  {achievement.batch}
                </span>
              </p>

              {/* Email */}
              <p className="text-xs md:text-sm text-gray-600 mb-4">
                {achievement.email}
              </p>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-700 text-center line-clamp-3">
                {achievement.achievement_description}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAchievements.length}
          itemsPerPage={itemsPerPage}
          onPageChange={paginate}
        />

        {/* Footer */}
        <footer className="w-full flex justify-center items-center min-h-[30vh] mt-20">
          <div className="container p-4 md:p-10">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 mb-8 md:mb-0">
                <h3 className="text-2xl md:text-3xl mb-5">
                  Centre for Competitive Exams
                </h3>
                <div className="w-full md:w-3/4">
                  <p className="text-xs md:text-sm">
                    CCE focuses on constantly endeavor to identify the potential
                    opportunities for our students to elevate their personality
                    and professional competence, which in turn will enhance
                    their socio-economic status
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
                  <div className="flex space-x-7">
                    <i className="bi bi-linkedin text-xl md:text-2xl"></i>
                    <i className="bi bi-youtube text-xl md:text-2xl"></i>
                    <i className="bi bi-instagram text-xl md:text-2xl"></i>
                    <i className="bi bi-twitter text-xl md:text-2xl"></i>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-3/5 flex flex-wrap justify-between md:pl-20">
                {["Products", "Resources", "Company", "Support"].map(
                  (category) => (
                    <div
                      key={category}
                      className="w-1/2 md:w-auto mb-6 md:mb-0"
                    >
                      <p className="font-bold mb-4 md:mb-10">{category}</p>
                      <ul className="space-y-2 md:space-y-3">
                        {[...Array(6)].map((_, index) => (
                          <li key={index}>
                            <p className="text-xs">Product</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="my-6 md:my-10 space-y-5">
              <hr className="border-1 border-black" />
              <p className="text-xs md:text-sm">
                &copy; {new Date().getFullYear()} SNS iHub Workplace. All Rights
                Reserved
              </p>
            </div>
          </div>
        </footer>
      </div>
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
