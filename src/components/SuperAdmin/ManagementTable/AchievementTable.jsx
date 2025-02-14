import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "../../../components/Admin/pagination";

const AchievementTable = ({
  achievements,
  selectedAchievements,
  setSelectedAchievements,
  handleAction,
  handleDelete,
  handleView,
  currentPage,
  itemsPerPage,
  handlePageChange,
}) => {
  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div id="achievements-section" className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Achievement Approvals</h2>
        <div className="flex items-center space-x-4">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => handleBulkApprove("achievement")}
          >
            Approve all
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => handleBulkDelete("achievement")}
          >
            Delete all
          </button>
          <input
            type="checkbox"
            checked={selectedAchievements.length === achievements.length}
            onChange={() => handleSelectAll("achievement")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2">Select All</span>
        </div>
      </div>
      {achievements.length === 0 ? (
        <p className="text-gray-600">No achievements to review.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b border-gray-200">Select</th>
                <th className="px-4 py-2 border-b border-gray-200">Name</th>
                <th className="px-4 py-2 border-b border-gray-200">Type</th>
                <th className="px-4 py-2 border-b border-gray-200">Company</th>
                <th className="px-4 py-2 border-b border-gray-200">Batch</th>
                <th className="px-4 py-2 border-b border-gray-200">Status</th>
                <th className="px-4 py-2 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(achievements).map((achievement) => (
                <tr key={achievement._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedAchievements.includes(achievement._id)}
                      onChange={() =>
                        setSelectedAchievements((prev) =>
                          prev.includes(achievement._id)
                            ? prev.filter((id) => id !== achievement._id)
                            : [...prev, achievement._id]
                        )
                      }
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2">{achievement.name}</td>
                  <td className="px-4 py-2">{achievement.achievement_type}</td>
                  <td className="px-4 py-2">{achievement.company_name}</td>
                  <td className="px-4 py-2">{achievement.batch}</td>
                  <td className="px-4 py-2 font-semibold">
                    {achievement.is_publish === null ? (
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    ) : achievement.is_publish === true ? (
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full">
                        Approved
                      </span>
                    ) : (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      {achievement.is_publish === null && (
                        <>
                          <IoMdCheckmark
                            className="text-green-500 cursor-pointer"
                            size={20}
                            onClick={() => handleAction(achievement._id, "approve", "achievement")}
                          />
                          <FaXmark
                            className="text-red-500 cursor-pointer"
                            size={20}
                            onClick={() => handleAction(achievement._id, "reject", "achievement")}
                          />
                        </>
                      )}
                      <FaEye
                        className="text-blue-500 cursor-pointer"
                        size={20}
                        onClick={() => handleView(achievement._id, "achievement")}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer"
                        size={20}
                        onClick={() => handleDelete(achievement._id, "achievement")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={achievements.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AchievementTable;
