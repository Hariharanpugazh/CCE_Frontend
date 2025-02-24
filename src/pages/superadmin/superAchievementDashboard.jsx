import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import { LoaderContext } from "../../components/Common/Loader";
import SuperAdminNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import bgimage from "../../assets/icons/Group 1.svg";
import { FiSearch } from "react-icons/fi";

export default function AchievementDashboard() {
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [error, setError] = useState("");
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const fetchPublishedAchievements = async () => {
      setIsLoading(true); // Show loader when fetching data
      try {
        const response = await axios.get("https://cce-backend-54k0.onrender.com/api/published-achievement/");
        setAchievements(response.data.achievements);
        setFilteredAchievements(response.data.achievements);
      } catch (err) {
        console.error("Error fetching published achievements:", err);
        setError("Failed to load achievements.");
      } finally {
        setIsLoading(false); // Hide loader after data fetch
      }
    };

    fetchPublishedAchievements();
  }, [setIsLoading]);

  const filters = ["Internship", "Job Placement", "Certification", "Exam Cracked"];

  useEffect(() => {
    let filtered = achievements;

    if (selectedFilter) {
      filtered = filtered.filter((achievement) => achievement.achievement_type === selectedFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter((achievement) =>
        achievement.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAchievements(filtered);
  }, [selectedFilter, searchQuery, achievements]);

  return (
    <div className="flex flex-col ml-30">
      <SuperAdminNavbar/>

      {/* Header Section */}
      <div className="text-center my-5 py-4">   
        <h1 className="text-6xl tracking-[0.8px]">Achievement</h1>
        <p className="text-lg mt-2 text-center">
          Explore all the opportunities in all the existing fields around the globe.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="w-[25%] self-auto mt-6 ml-46 flex justify-between items-center  p-4 rounded-xl gap-4">
        <div className="flex gap-3">
          {/* Job & Internship Filter */}
          <select
            className="px-2 py-2 ml-6 text-sm bg-white rounded-full shadow-sm border border-gray-300 hover:bg-gray-200 transition"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="">Job Type</option>
            {filters.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Student"
            className="pl-4 pr-10 py-2 text-sm bg-white rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute right-3 top-3 text-gray-500" />
        </div>
      </div>

      {/* Loader Display */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          {/* <p className="text-lg font-semibold text-gray-700">Loading Achievements...</p> */}
        </div>
      ) : (
        <>
          <div className="w-[70%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : filteredAchievements.length === 0 ? (
              <p className="text-gray-600">No achievements available at the moment.</p>
            ) : (
              filteredAchievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="p-6 border-gray-900 rounded-xl shadow-lg bg-white flex flex-col items-center relative transition-transform duration-300 hover:scale-109 hover:shadow-xl"
                >
                  {/* Background Image */}
                  <img
                    src={bgimage}
                    alt="Background" 
                    className="absolute top-0 left-0 right-0 w-full h-full object-contain "
                  />
                  {/* Background Image */}
                  <img 
                    src={bgimage}
                    alt="Background" 
                    className="absolute top-0 left-0 w-full h-full object-contain opacity-20"
                  />
                  {achievement.photo && (
                    <img
                      src={`data:image/jpeg;base64,${achievement.photo}`}
                      alt="Achievement"
                      className="w-24 h-24 object-cover rounded-full bg-white  "
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-900 mt-4">{achievement.name}</h2>
                  <p className="text-gray-600 text-sm">{achievement.achievement_type}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">{achievement.company_name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}