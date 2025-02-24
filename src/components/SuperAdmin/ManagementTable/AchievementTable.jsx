import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark, FaEye, FaCheck } from "react-icons/fa6";
import Pagination from "../../../components/Admin/pagination";
import { FaTrashAlt } from "react-icons/fa";
import backIcon from "../../../assets/icons/back-icon.svg";
import nextIcon from "../../../assets/icons/next-icon.svg";

const AchievementTable = ({
  achievements,
  selectedAchievements,
  setSelectedAchievements,
  handleAction,
  handleDelete,
  handleView,
  autoApproval,
  toggleAutoApproval,
  handleBulkApprove,
  handleBulkDelete,
  currentPage,
  itemsPerPage,
  handlePageChange,
  setVisibleSection,
}) => {
  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleSelectAll = () => {
    if (selectedAchievements.length === achievements.length) {
      setSelectedAchievements([]);
    } else {
      setSelectedAchievements(achievements.map((achievement) => achievement._id));
    }
  };

  return (
    <div id="achievements-section" className="mt-4 w-full flex-col">
      <div className="flex justify-between items-center mb-6 w-full">
        <div className="flex rounded-lg border border-gray-300 items-center">
          <button className="p-2 border-r border-gray-300  rounded-l-lg cursor-pointer"
            onClick={() => setVisibleSection("internships")}>
            <img src={backIcon} alt="Back" className="w-5" />
          </button>
          <p className="px-3">Achievement Approvals</p>
          <button
            className="p-2 border-l border-gray-300 hover:bg-gray-50 opacity-50 rounded-r-lg" disabled
          >
            <img src={nextIcon} alt="Next" className="w-5" />
          </button>
        </div>

        <div className="flex items-stretch space-x-4">
          <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-300">
            <span className="text-gray-700 px-2">Auto-Approval</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoApproval}
                onChange={toggleAutoApproval}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
              <span
                className={`absolute left-1 top-1 h-3 w-3 bg-white rounded-full transition-transform ${autoApproval ? "translate-x-4" : ""
                  }`}
              ></span>
            </label>
          </div>

          <button
            className="px-5 py-1 bg-[#00b69b] text-white rounded text-sm flex items-center space-x-2"
            onClick={() => handleBulkApprove("achievement")}
          >
            <p>Approve all</p>
            <FaCheck />
          </button>
          <button
            className="px-5 py-1 bg-[#ef3826] text-white rounded text-sm flex items-center space-x-2"
            onClick={() => handleBulkDelete("achievement")}
          >
            <p>Delete all</p>
            <FaTrashAlt />
          </button>
        </div>
      </div>

      {achievements.length === 0 ? (
        <p className="text-gray-600 text-sm">No achievements to review.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="">
              <tr>
                <th className="py-3 border-b border-gray-200 flex justify-center items-center">
                  <input
                    type="checkbox"
                    checked={selectedAchievements.length === achievements.length}
                    onChange={handleSelectAll}
                    className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                  />
                  Select
                </th>
                <th className="py-3 border-b border-gray-200">Name</th>
                <th className="py-3 border-b border-gray-200">Type</th>
                <th className="py-3 border-b border-gray-200">Company</th>
                <th className="py-3 border-b border-gray-200">Batch</th>
                <th className="py-3 border-b border-gray-200">Status</th>
                <th className="py-3 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(achievements).map((achievement) => (
                <tr key={achievement._id} className="border-b border-gray-200 hover:bg-gray-50 py-3">
                  <td className="text-center px-2 py-1">
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
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="text-center py-3 py-1">{achievement.name}</td>
                  <td className="text-center py-3 py-1">{achievement.achievement_type}</td>
                  <td className="text-center py-3 py-1">{achievement.company_name}</td>
                  <td className="text-center py-3 py-1">{achievement.batch}</td>
                  <td className="text-center py-3 py-1 font-semibold">
                    {achievement.is_publish === true ? (
                      <span className="text-green-800 px-1 py-0.5 rounded-full text-xs">Approved</span>
                    ) : achievement.is_publish === false ? (
                      <span className="text-red-800 px-1 py-0.5 rounded-full text-xs">Rejected</span>
                    ) : (
                      <span className="text-yellow-800 px-1 py-0.5 rounded-full text-xs">Pending</span>
                    )}
                  </td>
                  <td className="text-center py-3 py-1">
                    <div className="flex justify-center space-x-1">
                      {achievement.is_publish === null && (
                        <>
                          <IoMdCheckmark
                            className="text-green-500 cursor-pointer"
                            size={16}
                            onClick={() => handleAction(achievement._id, "approve", "achievement")}
                          />
                          <FaXmark
                            className="text-red-500 cursor-pointer"
                            size={16}
                            onClick={() => handleAction(achievement._id, "reject", "achievement")}
                          />
                        </>
                      )}
                      <FaEye
                        className="text-blue-500 cursor-pointer"
                        size={16}
                        onClick={() => handleView(achievement._id, "achievement")}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer"
                        size={16}
                        onClick={() => handleDelete(achievement._id, "achievement")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={achievements.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AchievementTable;
