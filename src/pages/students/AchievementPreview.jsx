import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function AchievementPreview() {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const token = Cookies.get("jwt");
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`https://cce-backend.onrender.com/api/get-achievement/${id}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch achievement");
        }

        const data = await response.json();
        setAchievement(data);
        // Decode base64 image if available
        if (data.photo) {
          data.photo = `data:image/png;base64,${data.photo}`;
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [id, token]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
    }
  }, []);

  const handleBack = () => {
    if (userRole === "admin") {
      navigate("/manage-jobs");
    } else if (userRole === "superadmin") {
      navigate("/admin-achievements");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="w-64 fixed h-full">
        {userRole === "admin" && <AdminPageNavbar />}
        {userRole === "superadmin" && <SuperAdminPageNavbar />}
      </div>

      {/* Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6">
            <h1 className="text-3xl font-bold justify-center text-white">Achievement Preview</h1>
            <p className="text-blue-100 mt-2">Detailed view of the achievement record</p>
          </div>

          {achievement && (
            <div className="p-8">
              <div className="flex items-center mb-8">
                {achievement.photo ? (
                  <img
                    src={achievement.photo}
                    alt="Achievement"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-yellow-500 flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-md">
                    {getInitials(achievement.name)}
                  </div>
                )}
                <div className="ml-6">
                  <h2 className="text-2xl font-semibold text-gray-800">{achievement.name}</h2>
                  <p className="text-gray-600">{achievement.achievement_type}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Company Name</h3>
                  <p className="mt-1 text-lg text-gray-800">{achievement.company_name || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Date of Achievement</h3>
                  <p className="mt-1 text-lg text-gray-800">
                    {new Date(achievement.date_of_achievement).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Description</h3>
                  <p className="mt-1 text-gray-800">{achievement.achievement_description || 'No description provided'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Batch</h3>
                  <p className="mt-1 text-lg text-gray-800">{achievement.batch || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleBack}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-md hover:bg-yellow-500 transition-colors duration-200"
                >
                  Back to List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}