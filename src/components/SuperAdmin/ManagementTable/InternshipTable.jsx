import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "../../../components/Admin/pagination";

const InternshipTable = ({
  internships,
  selectedInternships,
  setSelectedInternships,
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
    <div id="internships-section" className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Internship Approvals</h2>
        <div className="flex items-center space-x-4">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => handleBulkApprove("internship")}
          >
            Approve all
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => handleBulkDelete("internship")}
          >
            Delete all
          </button>
          <input
            type="checkbox"
            checked={selectedInternships.length === internships.length}
            onChange={() => handleSelectAll("internship")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2">Select All </span>
        </div>
      </div>
      {internships.length === 0 ? (
        <p className="text-gray-600">No internships to review.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b border-gray-200">Select</th>
                <th className="px-4 py-2 border-b border-gray-200">Title</th>
                <th className="px-4 py-2 border-b border-gray-200">Company</th>
                <th className="px-4 py-2 border-b border-gray-200">Staff Name</th>
                <th className="px-4 py-2 border-b border-gray-200">Deadline</th>
                <th className="px-4 py-2 border-b border-gray-200">Duration</th>
                <th className="px-4 py-2 border-b border-gray-200">Status</th>
                <th className="px-4 py-2 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(internships).map((internship) => {
                const data = internship.internship_data || {};
                return (
                  <tr key={internship._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="px-4 py-2">
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
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                    <td className="px-4 py-2">{data.title || "N/A"}</td>
                    <td className="px-4 py-2">{data.company_name || "N/A"}</td>
                    <td className="px-4 py-2">{internship.admin_name || "N/A"}</td>
                    <td className="px-4 py-2">{data.application_deadline || "N/A"}</td>
                    <td className="px-4 py-2">{data.duration || "N/A"}</td>
                    <td className="px-4 py-2 font-semibold">
                      {internship.is_publish === true ? (
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full">
                          Approved
                        </span>
                      ) : internship.is_publish === false ? (
                        <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full">
                          Rejected
                        </span>
                      ) : (
                        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        {internship.is_publish === null && (
                          <>
                            <IoMdCheckmark
                              className="text-green-500 cursor-pointer"
                              size={20}
                              onClick={() => handleAction(internship._id, "approve", "internship")}
                            />
                            <FaXmark
                              className="text-red-500 cursor-pointer"
                              size={20}
                              onClick={() => handleAction(internship._id, "reject", "internship")}
                            />
                          </>
                        )}
                        <FaEye
                          className="text-blue-500 cursor-pointer"
                          size={20}
                          onClick={() => handleView(internship._id, "internship")}
                        />
                        <FaTrashAlt
                          className="text-red-500 cursor-pointer"
                          size={20}
                          onClick={() => handleDelete(internship._id, "internship")}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={internships.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default InternshipTable;
