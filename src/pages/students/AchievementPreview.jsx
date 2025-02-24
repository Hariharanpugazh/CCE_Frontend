// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const AchievementPreview = () => {
//   const { id } = useParams();
//   const [achievement, setAchievement] = useState(null);

//   useEffect(() => {
//     // Fetch achievement data from the backend
//     fetch(`https://cce-backend-54k0.onrender.com/api/achievement/${id}/`)
//       .then(response => response.json())
//       .then(data => setAchievement(data.achievement))
//       .catch(error => console.error("Error fetching achievement:", error));
//   }, [id]);

//   if (!achievement) return <p className="text-center text-lg font-semibold">Loading...</p>;

//   return (
//     <div className="w-4/5 mx-auto bg-white shadow-lg rounded-lg p-8 my-10 border border-gray-200">
//       {/* Achievement Title */}
//       <div className="border-b pb-4 mb-6">
//         <h2 className="text-3xl font-bold text-gray-900">{achievement.name}</h2>
//         <p className="text-lg text-gray-700 mt-2">{achievement.company_name}</p>
//       </div>

//       {/* Achievement Details */}
//       <div className="border-b pb-4 mb-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">Achievement Details</h3>
//         <p className="text-gray-700"><strong>Type:</strong> {achievement.achievement_type}</p>
//         <p className="text-gray-700"><strong>Description:</strong> {achievement.achievement_description}</p>
//         <p className="text-gray-700"><strong>Date:</strong> {new Date(achievement.date_of_achievement).toLocaleDateString()}</p>
//         <p className="text-gray-700"><strong>Batch:</strong> {achievement.batch}</p>
//       </div>

//       {/* Photo */}
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">Photo</h3>
//         <img
//           src={`data:image/jpeg;base64,${achievement.photo}`}
//           alt={achievement.name}
//           className="w-[400px] h-auto rounded-lg shadow-md"
//         />
//       </div>

//       {/* Admin Info */}
//       {/* <div className="border-b pb-4 mb-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">Admin Info</h3>
//         <p className="text-gray-700"><strong>Created By:</strong> {achievement.created_by}</p>
//         <p className="text-gray-700"><strong>Updated At:</strong> {new Date(achievement.updated_at).toLocaleString()}</p>
//       </div> */}
//     </div>
//   );
// };

// export default AchievementPreview;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AchievementPreview = () => {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    // Fetch achievement data from the backend
    fetch(`https://cce-backend-54k0.onrender.com/api/achievement/${id}/`)
      .then((response) => response.json())
      .then((data) => setAchievement(data.achievement))
      .catch((error) => console.error("Error fetching achievement:", error));
  }, [id]);

  if (!achievement)
    return <p className="text-center text-lg font-semibold">Loading...</p>;

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="relative rounded-lg shadow-md overflow-hidden">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 grid grid-cols-12 z-0"
          style={{ pointerEvents: "none" }}
        >
          {Array(12)
            .fill()
            .map((_, i) => (
              <div
                key={`col-${i}`}
                className="h-full border-r border-gray-300 last:border-r-0"
              ></div>
            ))}
          {Array(12)
            .fill()
            .map((_, i) => (
              <div
                key={`row-${i}`}
                className="w-full col-span-12 border-b border-gray-300"
              ></div>
            ))}
        </div>

        {/* Background color */}
        <div className="absolute inset-0 bg-amber-50 opacity-40 z-0"></div>

        {/* Profile Image as background */}
        <div className="relative h-[32rem] w-full">
          <img
            src={`data:image/jpeg;base64,${achievement.photo}`}
            alt={achievement.name}
            className="w-full h-full object-cover"
          />

          {/* Info Card Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4 z-10">
            <h2 className="text-2xl font-bold text-black">
              {achievement.name}
            </h2>
            <div className="flex items-center">
              <span className="text-red-600 text-sm">
                {new Date(achievement.date_of_achievement).getFullYear()} -{" "}
                {achievement.batch?.split("-")[1] || "2025"}
              </span>
            </div>
            <p className="text-yellow-500 text-sm font-medium">
              {new Date(achievement.date_of_achievement).toLocaleDateString(
                "en-US",
                { day: "numeric", month: "long" }
              )}
            </p>
            <p className="text-gray-700 text-sm mt-1">
              {achievement.achievement_description ||
                `${achievement.company_name}  ${achievement.achievement_type} `}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPreview;
