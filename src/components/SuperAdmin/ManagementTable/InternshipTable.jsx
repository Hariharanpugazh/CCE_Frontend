import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaEye, FaCheck, FaTrashAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Pagination from "../../../components/Admin/pagination";
import backIcon from "../../../assets/icons/back-icon.svg";
import nextIcon from "../../../assets/icons/next-icon.svg";
import { format } from "date-fns";

const InternshipTable = ({
  internships,
  selectedInternships,
  setSelectedInternships,
  handleAction,
  handleDelete,
  handleView,
  handleBulkApprove,
  handleBulkDelete,
  currentPage,
  autoApproval,
  toggleAutoApproval,
  itemsPerPage,
  handlePageChange,
  setVisibleSection,
}) => {
  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleSelectAll = () => {
    if (selectedInternships.length === internships.length) {
      setSelectedInternships([]);
    } else {
      setSelectedInternships(internships.map((internship) => internship._id));
    }
  };

  return (
    <div id="internships-section" className="mt-4 w-full flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 w-full">
        <div className="flex rounded-lg border border-gray-300 items-center">
          <button
            className="p-2 border-r border-gray-300 hover:bg-gray-50 cursor-pointer rounded-l-lg"
            onClick={() => setVisibleSection("jobs")}
          >
            <img src={backIcon} alt="" className="w-5" />
          </button>
          <p className="px-3">Internship Approvals</p>
          <button
            className="p-2 border-l border-gray-300 hover:bg-gray-50 cursor-pointer rounded-r-lg"
            onClick={() => setVisibleSection("achievements")}
          >
            <img src={nextIcon} alt="" className="w-5" />
          </button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-stretch space-x-4">
          {/* Auto Approve */}
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
            onClick={() => handleBulkApprove("internship")}
          >
            <p>Approve all</p>
            <FaCheck />
          </button>
          <button
            className="px-5 py-1 bg-[#ef3826] text-white rounded text-sm flex items-center space-x-2"
            onClick={() => handleBulkDelete("internship")}
          >
            <p>Delete all</p>
            <FaTrashAlt />
          </button>
        </div>
      </div>

      {/* Table */}
      {internships.length === 0 ? (
        <p className="text-gray-600 text-sm">No internships to review.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="py-3 border-b border-gray-200 flex justify-center items-center">
                  <input
                    type="checkbox"
                    checked={selectedInternships.length === internships.length}
                    onChange={handleSelectAll}
                    className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                  />
                  Select
                </th>
                <th className="py-3 border-b border-gray-200">Title</th>
                <th className="py-3 border-b border-gray-200">Company</th>
                <th className="py-3 border-b border-gray-200">Staff Name</th>
                <th className="py-3 border-b border-gray-200">Deadline</th>
                <th className="py-3 border-b border-gray-200">Duration</th>
                <th className="py-3 border-b border-gray-200">Status</th>
                <th className="py-3 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(internships).map((internship) => {
                const data = internship.internship_data || {};
                return (
                  <tr key={internship._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-center px-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedInternships.includes(internship._id)}
                        onChange={() =>
                          setSelectedInternships((prev) =>
                            prev.includes(internship._id)
                              ? prev.filter((id) => id !== internship._id)
                              : [...prev, internship._id]
                          )
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                    </td>
                    <td className="text-center py-3">{data.title || "N/A"}</td>
                    <td className="text-center py-3">{data.company_name || "N/A"}</td>
                    <td className="text-center py-3">{internship.admin_name || "N/A"}</td>
                    <td className="text-center py-3">
                      {data.application_deadline
                        ? format(new Date(data.application_deadline), "yyyy-MM-dd")
                        : "N/A"}
                    </td>
                    <td className="text-center py-3">{data.duration || "N/A"}</td>
                    <td className="text-center py-3 font-semibold">
                      {internship.is_publish === true ? (
                        <span className="text-green-800 px-1 py-0.5 rounded-full text-xs">
                          Approved
                        </span>
                      ) : internship.is_publish === false ? (
                        <span className="text-red-800 px-1 py-0.5 rounded-full text-xs">
                          Rejected
                        </span>
                      ) : (
                        <span className="text-yellow-800 px-1 py-0.5 rounded-full text-xs">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="text-center py-3">
                      <div className="flex justify-center space-x-1">
                        {internship.is_publish === null && (
                          <>
                            <IoMdCheckmark
                              className="text-green-500 cursor-pointer"
                              size={16}
                              onClick={() => handleAction(internship._id, "approve", "internship")}
                            />
                            <FaXmark
                              className="text-red-500 cursor-pointer"
                              size={16}
                              onClick={() => handleAction(internship._id, "reject", "internship")}
                            />
                          </>
                        )}
                        <FaEye
                          className="text-blue-500 cursor-pointer"
                          size={16}
                          onClick={() => handleView(internship._id, "internship")}
                        />
                        <FaTrashAlt
                          className="text-red-500 cursor-pointer"
                          size={16}
                          onClick={() => handleDelete(internship._id, "internship")}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={internships.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default InternshipTable;
