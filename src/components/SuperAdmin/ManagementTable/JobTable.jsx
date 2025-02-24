import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FaCheck, FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "../../../components/Admin/pagination";
import backIcon from '../../../assets/icons/back-icon.svg';
import nextIcon from '../../../assets/icons/next-icon.svg';
import { formatDate } from "date-fns";

const JobTable = ({
  jobs,
  toggleAutoApproval,
  autoApproval,
  selectedJobs,
  setVisibleSection,
  setSelectedJobs,
  handleAction,
  handleDelete,
  handleView,
  handleBulkApprove, // Ensure this prop is received
  handleBulkDelete, // Ensure this prop is received
  currentPage,
  itemsPerPage,
  handlePageChange,
}) => {
  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map((job) => job._id));
    }
  };

  return (
    <div id="jobs-section" className="mt-4 w-full flex-col">
      <div className="flex justify-between items-center mb-6 w-full">
        <div className="flex rounded-lg border border-gray-300 items-center">
          <button className="p-2 border-r border-gray-300 opacity-50 rounded-l-lg" disabled> <img src={backIcon} alt="" className="w-5" /> </button>
          <p className="px-3"> Job Approvals </p>
          <button className="p-2 border-l border-gray-300 hover:bg-gray-50 cursor-pointer rounded-r-lg" onClick={() => setVisibleSection("internships")}> <img src={nextIcon} alt="" className="w-5" /> </button>
        </div>
        <div className="flex items-stretch space-x-4">

          {/* auto approve */}
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
            onClick={() => handleBulkApprove("job")} // Use the prop here
          >
            <p> Approve all </p>
            <FaCheck />
          </button>
          <button
            className="px-5 py-1 bg-[#ef3826] text-white rounded text-sm flex items-center space-x-2"
            onClick={() => handleBulkDelete("job")} // Use the prop here
          >
            <p> Delete all </p>
            <FaTrashAlt />
          </button>
        </div>
      </div>
      {jobs.length === 0 ? (
        <p className="text-gray-600 text-sm">No jobs to review.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="">
              <tr>
                <th className="py-3 border-b border-gray-200 flex justify-center items-center"> <input
                  type="checkbox"
                  checked={selectedJobs.length === jobs.length}
                  onChange={handleSelectAll}
                  className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                /> Select</th>
                <th className="py-3 border-b border-gray-200">Title</th>
                <th className="py-3 border-b border-gray-200">Company</th>
                <th className="py-3 border-b border-gray-200">Staff Name</th>
                <th className="py-3 border-b border-gray-200">Deadline</th>
                <th className="py-3 border-b border-gray-200">Status</th>
                <th className="py-3 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(jobs).map((job) => (
                <tr key={job._id} className="border-b border-gray-200 hover:bg-gray-50 py-3">
                  <td className="text-center px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job._id)}
                      onChange={() =>
                        setSelectedJobs((prev) =>
                          prev.includes(job._id)
                            ? prev.filter((id) => id !== job._id)
                            : [...prev, job._id]
                        )
                      }
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="text-center py-3 py-1">{job.job_data.title}</td>
                  <td className="text-center py-3 py-1">{job.job_data.company_name}</td>
                  <td className="text-center py-3 py-1">{job.admin_name}</td>
                  <td className="text-center py-3 py-1">{job.job_data.application_deadline}</td>
                  <td className="text-center py-3 py-1 font-semibold">
                    {job.is_publish === true ? (
                      <span className="text-green-800 px-1 py-0.5 rounded-full text-xs">
                        Approved
                      </span>
                    ) : job.is_publish === false ? (
                      <span className="text-red-800 px-1 py-0.5 rounded-full text-xs">
                        Rejected
                      </span>
                    ) : (
                      <span className="text-yellow-800 px-1 py-0.5 rounded-full text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="text-center py-3 py-1">
                    <div className="flex justify-center space-x-1">
                      {job.is_publish === null && (
                        <>
                          <IoMdCheckmark
                            className="text-green-500 cursor-pointer"
                            size={16}
                            onClick={() => handleAction(job._id, "approve", "job")}
                          />
                          <FaXmark
                            className="text-red-500 cursor-pointer"
                            size={16}
                            onClick={() => handleAction(job._id, "reject", "job")}
                          />
                        </>
                      )}
                      <FaEye
                        className="text-blue-500 cursor-pointer"
                        size={16}
                        onClick={() => handleView(job._id, "job")}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer"
                        size={16}
                        onClick={() => handleDelete(job._id, "job")}
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
        totalItems={jobs.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default JobTable;
