import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import { LoaderContext } from "../../components/Common/Loader";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Cookies from 'js-cookie';
import bgimage from "../../assets/icons/Group 1.svg";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../components/Admin/pagination"; // Import the Pagination component

export default function AchievementDashboard() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [error, setError] = useState("");
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPublishedAchievements = async () => {
      setIsLoading(true); // Show loader when fetching data
      try {
        const response = await axios.get("https://cce-backend.onrender.com/api/published-achievement/");
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
  }, []);

  useEffect(() => {
      const token = Cookies.get("jwt");
      if (token) {
          const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
          setUserRole(payload.role); // Assuming the payload has a 'role' field
      }
  }, []);

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
    setCurrentPage(1); // Reset to the first page when filters change
  }, [selectedFilter, searchQuery, achievements]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAchievements = filteredAchievements.slice(indexOfFirstItem, indexOfLastItem);

  const handleMarkAsTop = async (id, isStarred) => {
    const token = Cookies.get("jwt");
    const currentTopMarkedCount = achievements.filter(achievement => achievement.starred).length;

    if (!isStarred && currentTopMarkedCount >= 5) {
      return;
    }

    try {
      const response = await axios.put(
        `https://cce-backend.onrender.com/api/edit-achievement/${id}/`,
        { starred: !isStarred },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state to reflect the change
      setAchievements((prev) =>
        prev.map((achievement) =>
          achievement._id === id ? { ...achievement, starred: !isStarred } : achievement
        )
      );
    } catch (err) {
      console.error("Error updating starred status:", err);
    }
  };

  const topMarkedCount = achievements.filter(achievement => achievement.starred).length;

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <div className="flex-1 bg-gray-50 min-h-screen p-6">
        <div className="max-w-7xl ml-5 mr-10">
          {/* Header */}
          <header className="flex flex-col items-center justify-center py-8 px-4 sm:py-14 container mx-auto text-center">
            <p className="text-3xl sm:text-6xl tracking-[0.8px]">Achievements</p>
            <p className="text-base sm:text-lg mt-2">
              Explore all the remarkable achievements of our students <br />
              across various domains and fields.
            </p>
          </header>

          <div className="flex flex-col justify-between md:flex-row gap-4 mb-8">
            <div className="flex flex-1 max-w-md relative">
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 h-10 rounded-md w-full border border-gray-300 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="">
              <select
                className="h-10 bg-white border border-gray-300 rounded-md px-4 hover:bg-gray-100"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="">Filter by Type</option>
                {filters.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-screen">
              <p className="text-lg font-semibold text-gray-700">Loading Achievements...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
                {error ? (
                  <p className="text-red-600">{error}</p>
                ) : currentAchievements.length === 0 ? (
                  <p className="text-gray-600">No achievements available at the moment.</p>
                ) : (
                  currentAchievements.map((achievement) => (
                    <div
                      key={achievement._id}
                      className="p-6 flex flex-col items-center border border-gray-200 rounded-lg shadow-lg transition-transform duration-300 hover:scale-109 hover:shadow-xl relative"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 relative z-10">
                        {achievement.photo ? (
                          <img
                            src={`data:image/jpeg;base64,${achievement.photo}`}
                            alt={achievement.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-yellow-500 flex items-center justify-center text-2xl font-bold text-white">
                            {getInitials(achievement.name)}
                          </div>
                        )}
                      </div>
                        <h3 className="font-semibold text-md text-black opacity-75 truncate">{achievement.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">{achievement.achievement_type}</p>
                      <div className="flex justify-between gap-2 mt-auto">
                        <button
                          className="border border-gray-300 rounded-md px-4 hover:bg-gray-100 h-7 cursor-pointer"
                          onClick={() => navigate(`/achievement-edit/${achievement._id}`)}
                        >
                          Edit
                        </button>
                        {userRole === "superadmin" && (
                          <button
                            className={`border ${achievement.starred ? "bg-yellow-500 text-white" : "bg-yellow-400 text-black"} rounded-md px-4 text-sm hover:bg-yellow-500 w-2/3 h-7 ${topMarkedCount >= 5 && !achievement.starred ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => handleMarkAsTop(achievement._id, achievement.starred)}
                            disabled={topMarkedCount >= 5 && !achievement.starred}
                          >
                            {achievement.starred ? "Marked as Top" : "Mark as Top"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {filteredAchievements.length > 0 && (
                <div className="bottom-0 left-0 w-full bg-transparent p-4 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredAchievements.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
