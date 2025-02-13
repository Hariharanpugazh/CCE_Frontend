import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import StudentPageSearchBar from "../../components/Students/StudentPageSearchBar";
import PageHeader from "../../components/Common/StudentPageHeader";

export default function AchievementDashboard() {
  const [achievements, setAchievements] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  // Fetch published achievements from the backend
  useEffect(() => {
    const fetchPublishedAchievements = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/published-achievement/");
        setAchievements(response.data.achievements);
      } catch (err) {
        console.error("Error fetching published achievements:", err);
        setError("Failed to load achievements.");
      }
    };

    fetchPublishedAchievements();
  }, []);

  return (
    <div className="flex flex-col">
      <StudentPageNavbar />
      <PageHeader page="Achievement Dashboard" filter={filter} setFilter={setFilter} />

      {/* Search bar */}
      <div className="w-[80%] self-center">
        <StudentPageSearchBar />
      </div>

      {/* Achievement cards */}
      <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : achievements.length === 0 ? (
          <p className="text-gray-600">No achievements available at the moment.</p>
        ) : (
          achievements.map((achievement) => (
            <div
              key={achievement._id}
              className="p-4 border rounded-lg shadow-md bg-white flex flex-col justify-between items-center"
            >
              {achievement.photo && (
                <img
                  src={`data:image/jpeg;base64,${achievement.photo}`}
                  alt="Achievement"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <h2 className="text-xl font-bold text-gray-800 mt-2">{achievement.name}</h2>
              <p className="text-gray-600 mt-2">{achievement.achievement_description}</p>
              <p className="text-gray-500 mt-2">Type: {achievement.achievement_type}</p>
              <p className="text-gray-500 mt-2">Company: {achievement.company_name}</p>
              <p className="text-gray-500 mt-2">Date: {new Date(achievement.date_of_achievement).toLocaleDateString()}</p>
              <p className="text-gray-500 mt-2">Batch: {achievement.batch}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
