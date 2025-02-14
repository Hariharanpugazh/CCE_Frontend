import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "../../../components/Admin/pagination";

const JobTable = ({
  jobs,
  selectedJobs,
  setSelectedJobs,
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
    <div id="jobs-section" className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Job Approvals</h2>
        <div className="flex items-center space-x-4">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => handleBulkApprove("job")}
          >
            Approve all
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => handleBulkDelete("job")}
          >
            Delete all
          </button>
          <input
            type="checkbox"
            checked={selectedJobs.length === jobs.length}
            onChange={() => handleSelectAll("job")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2">Select All</span>
        </div>
      </div>
      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs to review.</p>
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
                <th className="px-4 py-2 border-b border-gray-200">Status</th>
                <th className="px-4 py-2 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(jobs).map((job) => (
                <tr key={job._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-4 py-2">
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
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2">{job.job_data.title}</td>
                  <td className="px-4 py-2">{job.job_data.company_name}</td>
                  <td className="px-4 py-2">{job.admin_name}</td>
                  <td className="px-4 py-2">{job.job_data.application_deadline}</td>
                  <td className="px-4 py-2 font-semibold">
                    {job.is_publish === true ? (
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full">
                        Approved
                      </span>
                    ) : job.is_publish === false ? (
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
                      {job.is_publish === null && (
                        <>
                          <IoMdCheckmark
                            className="text-green-500 cursor-pointer"
                            size={20}
                            onClick={() => handleAction(job._id, "approve", "job")}
                          />
                          <FaXmark
                            className="text-red-500 cursor-pointer"
                            size={20}
                            onClick={() => handleAction(job._id, "reject", "job")}
                          />
                        </>
                      )}
                      <FaEye
                        className="text-blue-500 cursor-pointer"
                        size={20}
                        onClick={() => handleView(job._id, "job")}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer"
                        size={20}
                        onClick={() => handleDelete(job._id, "job")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={jobs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default JobTable;
