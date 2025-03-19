"use client";
import { useState, useEffect, useContext, useMemo, useRef } from "react";
import axios from "axios";
import { motion, useInView } from "framer-motion";
import { LoaderContext } from "../Common/Loader";
import GridLines from "../../assets/images/Grid Lines.png";

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
  const [isTablet, setIsTablet] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [carouselFilter, setCarouselFilter] = useState("");
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [carouselDuration, setCarouselDuration] = useState(25);

  const carouselRef = useRef(null);
  const carouselInView = useRef(null);
  const isInView = useInView(carouselInView);

  // Fetch data
  useEffect(() => {
    const fetchPublishedAchievements = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/published-achievement/"
        );
        const sortedAchievements = response.data.achievements.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setAchievements(sortedAchievements);
        setFilteredAchievements(sortedAchievements);
      } catch (err) {
        console.error("Error fetching published achievements:", err);
        setError("Failed to load achievements.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedAchievements();
  }, [setIsLoading]);

  // Device detection for responsive design
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);

      // Adjust carousel speed based on screen size for better mobile experience
      if (width < 640) {
        setCarouselDuration(15); // Faster on mobile
      } else if (width < 1024) {
        setCarouselDuration(20); // Medium speed on tablet
      } else {
        setCarouselDuration(25); // Default speed on desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    // Get up to 10 items for a better loop
    let items = filtered.slice(0, 10);

    // If we have less than 2 items, return an empty array to avoid errors
    if (items.length < 2) {
      return [];
    }

    // If we have 2 to 9 items, duplicate them to create a continuous effect
    if (items.length < 10) {
      const multiplier = Math.ceil(10 / items.length);
      items = Array(multiplier).fill(items).flat().slice(0, 10);
    }

    return items;
  }, [achievements, carouselFilter]);

  // Pause animation on hover (only on non-touch devices)
  const handleMouseEnter = () => {
    if (!isMobile) setIsCarouselPaused(true);
  };
  const handleMouseLeave = () => setIsCarouselPaused(false);

  // Handle touch interactions for mobile
  const handleTouchStart = () => setIsCarouselPaused(true);
  const handleTouchEnd = () => {
    // Add a small delay before resuming to improve touch experience
    setTimeout(() => setIsCarouselPaused(false), 1000);
  };

  return (
    <div className="flex flex-col min-h-screen relative w-full">
      <div className="relative w-full h-screen">
        <img
          src={GridLines || "/placeholder.svg"}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Header Section - Responsive typography */}
        <div className="text-center my-2 sm:my-4 md:my-6 lg:my-8 py-2 md:py-4 lg:py-6 relative px-2 sm:px-4 md:px-6 z-10">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl tracking-[0.8px] font-bold mt-0">
            <span>Celebrating</span>
            <span className="text-[#ffcc00]"> Student Excellence,</span>
            <br />
            <span>Inspiring Achievements!</span>
          </h1>
        </div>

        {/* Featured Achievements Carousel - Enhanced for all device sizes */}
        <div
          ref={carouselInView}
          className="w-full py-3 sm:py-4 md:py-6 lg:py-10 relative overflow-hidden from-amber-50 via-white to-amber-50 z-10"
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">
                {/* <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400">
          Featured Achievements
        </span> */}
              </h2>
            </div>
            {error ? (
              <p className="text-red-600 text-center">{error}</p>
            ) : recentAchievements.length === 0 ? (
              <p className="text-gray-600 text-center w-full">
                No starred achievements available at the moment.
              </p>
            ) : (
              <div
                className="relative overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Main carousel container */}
                <div className="flex overflow-hidden">
                  {/* Continuous scrolling container */}
                  <div className="relative flex">
                    {/* First copy of items */}
                    <motion.div
                      className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5"
                      initial={{ x: "0%" }}
                      animate={{
                        x: isCarouselPaused ? "0%" : "-100%",
                      }}
                      transition={{
                        ease: "linear",
                        duration: carouselDuration,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                      style={{
                        flexWrap: "nowrap",
                        willChange: "transform",
                      }}
                    >
                      {recentAchievements.map((achievement, index) => (
                        <AchievementCard
                          key={`first-${achievement._id || index}`}
                          achievement={achievement}
                          index={index}
                          isMobile={isMobile}
                          isTablet={isTablet}
                        />
                      ))}
                    </motion.div>

                    {/* Second copy of items positioned right after the first set */}
                    <motion.div
                      className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 absolute left-full top-0"
                      initial={{ x: "0%" }}
                      animate={{
                        x: isCarouselPaused ? "0%" : "-100%",
                      }}
                      transition={{
                        ease: "linear",
                        duration: carouselDuration,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                      style={{
                        flexWrap: "nowrap",
                        willChange: "transform",
                      }}
                    >
                      {recentAchievements.map((achievement, index) => (
                        <AchievementCard
                          key={`second-${achievement._id || index}`}
                          achievement={achievement}
                          index={index}
                          isMobile={isMobile}
                          isTablet={isTablet}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
                {/* Gradient overlays for seamless effect */}
                <div className="absolute top-0 left-0 h-full w-8 sm:w-16 bg-gradient-to-r from-amber-50 to-transparent z-10"></div>
                <div className="absolute top-0 right-0 h-full w-8 sm:w-16 bg-gradient-to-l from-amber-50 to-transparent z-10"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Responsive Achievement Card component
const AchievementCard = ({ achievement, index, isMobile, isTablet }) => {
  // Responsive card sizing with more granular breakpoints
  const cardWidth = isMobile
    ? "w-[160px] sm:w-[180px]"
    : isTablet
    ? "w-[200px] md:w-[220px]"
    : "w-[240px] lg:w-[260px] xl:w-[280px]";

  const imageHeight = isMobile
    ? "h-40 sm:h-48"
    : isTablet
    ? "h-52 md:h-56"
    : "h-60 lg:h-64";

  return (
    <motion.div
      className={`flex-shrink-0 ${cardWidth}`}
      whileHover={!isMobile ? { y: -8, scale: 1.03 } : {}}
      whileTap={isMobile ? { scale: 0.98 } : {}}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full border border-amber-100">
        <div className={`relative ${imageHeight} overflow-hidden`}>
          {achievement.photo && (
            <img
              src={`data:image/jpeg;base64,${achievement.photo}`}
              alt={achievement.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 right-2"></div>
        </div>

        <div className="p-2 sm:p-3 md:p-4">
          <span className="inline-block px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
            {achievement.achievement_type}
          </span>
          <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 text-sm sm:text-base md:text-lg">
            {achievement.name}
          </h3>
          <p className="text-amber-500 text-xs sm:text-sm mb-1 sm:mb-2">
            {achievement.batch}
          </p>
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-1 sm:mb-2">
            {achievement.achievement_description}
          </p>
          <div className="pt-1 sm:pt-2 border-t border-gray-100">
            {/* <p className="text-xs text-gray-500 truncate">
              {achievement.email}
            </p> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
