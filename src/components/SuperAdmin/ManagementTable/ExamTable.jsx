import React, { Component } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaEye, FaCheck, FaTrashAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Pagination from "../../../components/Admin/pagination";
import backIcon from "../../../assets/icons/back-icon.svg";
import nextIcon from "../../../assets/icons/next-icon.svg";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

const renderCellContent = (content) => {
  if (typeof content === "string") {
    return content;
  }
  return JSON.stringify(content);
};

const ExamTable = ({
  exams,
  selectedExams,
  setSelectedExams,
  handleAction,
  handleDelete,
  handleView,
  handleBulkApprove,
  handleBulkDelete,
  currentPage,
  autoApprove,
  toggleAutoApprove,
  itemsPerPage,
  handlePageChange,
  setVisibleSection,
}) => {
  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleSelectAll = () => {
    if (selectedExams.length === exams.length) {
      setSelectedExams([]);
    } else {
      setSelectedExams(exams.map((exam) => exam._id));
    }
  };

  return (
    <ErrorBoundary>
      <div id="exams-section" className="mt-4 w-full flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 w-full">
          <div className="flex rounded-lg border border-gray-300 items-center">
            <button
              className="p-2 border-r border-gray-300 hover:bg-gray-50 cursor-pointer rounded-l-lg"
              onClick={() => setVisibleSection("internships")}
            >
              <img src={backIcon} alt="Back" className="w-5" />
            </button>
            <p className="px-3">Exam Approvals</p>
            <button
              className="p-2 border-l border-gray-300 hover:bg-gray-50 opacity-50 cursor-not-allowed rounded-r-lg"
              disabled
            >
              <img src={nextIcon} alt="Next" className="w-5" />
            </button>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-stretch space-x-4">
            {/* Auto Approve */}
            <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-300">
              <span className="text-gray-700 px-2">Auto-Approve</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={toggleAutoApprove}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                <span
                  className={`absolute left-1 top-1 h-3 w-3 bg-white rounded-full transition-transform ${autoApprove ? "translate-x-4" : ""
                    }`}
                ></span>
              </label>
            </div>

            <button
              className="px-5 py-1 bg-[#00b69b] text-white rounded text-sm flex items-center space-x-2"
              onClick={() => handleBulkApprove("exam")}
            >
              <p>Approve all</p>
              <FaCheck />
            </button>
            <button
              className="px-5 py-1 bg-[#ef3826] text-white rounded text-sm flex items-center space-x-2"
              onClick={() => handleBulkDelete("exam")}
            >
              <p>Delete all</p>
              <FaTrashAlt />
            </button>
          </div>
        </div>

        {/* Table */}
        {exams.length === 0 ? (
          <p className="text-gray-600 text-sm">No exams to review.</p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="py-3 border-b border-gray-200 flex justify-center items-center">
                    <input
                      type="checkbox"
                      checked={selectedExams.length === exams.length}
                      onChange={handleSelectAll}
                      className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                    />
                    Select
                  </th>
                  <th className="py-3 border-b border-gray-200">Title</th>
                  <th className="py-3 border-b border-gray-200">Cutoff</th>
                  <th className="py-3 border-b border-gray-200">Staff Name</th>
                  <th className="py-3 border-b border-gray-200">Status</th>
                  <th className="py-3 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentItems(exams).map((exam) => {
                  const data = exam.exam_data || {};
                  return (
                    <tr key={exam._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="text-center px-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedExams.includes(exam._id)}
                          onChange={() =>
                            setSelectedExams((prev) =>
                              prev.includes(exam._id)
                                ? prev.filter((id) => id !== exam._id)
                                : [...prev, exam._id]
                            )
                          }
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                      </td>
                      <td className="text-center py-3">{truncateText(renderCellContent(data.exam_title) || "N/A", 20)}</td>
                      <td className="text-center py-3">{truncateText(renderCellContent(data.cutoff) || "N/A", 20)}</td>
                      <td className="text-center py-3">{truncateText(renderCellContent(exam.admin_name) || "N/A", 20)}</td>
                      <td className="text-center py-3 font-semibold">
                        {exam.is_publish === true ? (
                          <span className="text-green-800 px-1 py-0.5 rounded-full text-xs">
                            Approved
                          </span>
                        ) : exam.is_publish === false ? (
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
                          {exam.is_publish === null && (
                            <>
                              <IoMdCheckmark
                                className="text-green-500 cursor-pointer"
                                size={16}
                                onClick={() => handleAction(exam._id, "approve", "exam")}
                              />
                              <FaXmark
                                className="text-red-500 cursor-pointer"
                                size={16}
                                onClick={() => handleAction(exam._id, "reject", "exam")}
                              />
                            </>
                          )}
                          <FaEye
                            className="text-blue-500 cursor-pointer"
                            size={16}
                            onClick={() => handleView(exam._id, "exam")}
                          />
                          <FaTrashAlt
                            className="text-red-500 cursor-pointer"
                            size={16}
                            onClick={() => handleDelete(exam._id, "exam")}
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
          totalItems={exams.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ExamTable;
