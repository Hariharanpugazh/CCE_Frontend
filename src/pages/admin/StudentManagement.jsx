import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import AdminPageNavbar from '../../components/Admin/AdminNavBar';
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Pagination from "../../components/Admin/pagination";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuGitFork, LuPhone } from "react-icons/lu";
import NoStudent from "../../assets/images/NoStudent.svg";
import { FaSearch } from "react-icons/fa";


const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editableStudent, setEditableStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/students/");
        setStudents(response.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesFilter =
      student.name.toLowerCase().includes(filter.toLowerCase()) ||
      student.email.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter ? student.status === statusFilter : true;
    return matchesFilter && matchesStatus;
  });

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      setUserRole(!payload.student_user ? payload.role : "student"); // Assuming the payload has a 'role' field
    }
  }, []);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filter, statusFilter, totalPages]);

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/students/${id}/delete/`);
      setStudents(students.filter((student) => student._id !== id));
      setSelectedStudent(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting student:", error.response ? error.response.data : error);
      alert("Failed to delete student. Please try again.");
    }
  };

  const handleToggleStatus = async (student) => {
    const updatedStatus = student.status === "active" ? "inactive" : "active";
    try {
      await axios.put(`http://localhost:8000/api/students/${student._id}/update/`, { status: updatedStatus });

      // Update both student list and selected student to reflect changes
      setStudents(
        students.map((s) =>
          s._id === student._id ? { ...s, status: updatedStatus } : s
        )
      );

      setSelectedStudent((prevStudent) => ({
        ...prevStudent,
        status: updatedStatus, // Update the status without closing the modal
      }));
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  const handleEditProfile = () => {
    setEditableStudent({ ...selectedStudent });
    setEditMode(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Send the updated student data to the backend with the correct URL
      await axios.put(`http://localhost:8000/api/students/${editableStudent._id}/update/`, editableStudent);

      // Update the local state with the new student data
      setStudents(
        students.map((student) =>
          student._id === editableStudent._id ? editableStudent : student
        )
      );
      setEditMode(false);
      setSelectedStudent(editableStudent);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditableStudent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedStudent(null);
  };

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const buttonStyles = "px-4 py-3 w-32 text-white rounded-lg text-sm font-medium transition-colors duration-200";

  return (
    <div>
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="p-8 min-h-screen ml-62 mr-5">
        <h1 className="text-4xl font-bold mb-3">Student Management</h1>

        <div className="sticky top-0 bg-white z-10 py-5 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex flex-1 items-center border rounded-lg border-gray-400">
            <input
              type="text"
              placeholder=" Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-400 text-sm rounded-lg pl-8 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <FaSearch className="absolute left-2 text-gray-400" />
          </div>

          <div className="flex items-center border rounded-lg border-gray-500">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 p-3 border-r px-3 py-2 mr-3 rounded-l-lg"
            >
              <option value=""><center>Filter by Status</center></option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              className="text-black border-r px-5"
              onClick={() => navigate("/student-signup")}
            >
              Create Student <strong>＋</strong>
            </button>
            <button
              className="text-black px-5"
              onClick={() => navigate("/studentbulksignup")}
            >
              Bulk Upload student <strong>＋</strong>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-x-auto border border-gray-500 max-h-[calc(100vh-300px)] overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead className="outline sticky top-0 bg-white">
              <tr>
                <th className="text-center p-4 w-40">Name</th>
                <th className="text-center p-4 w-60">Department</th>
                <th className="text-center p-4 w-2/6">Email Address</th>
                <th className="text-center p-4 w-40">Phone Number</th> {/* Increased width for Phone Number column */}
                <th className="text-center p-4 w-32">Status</th> {/* Fixed width for Status column */}
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr
                  key={student._id}
                  onClick={() => setSelectedStudent(student)}
                  className="cursor-pointer hover:bg-gray-100 border-b border-gray-300"
                >
                  <td className="text-center p-4">{student.name}</td>
                  <td className="text-center p-4 W-50">{student.department}</td>
                  <td className="text-center p-4 w-2/9">{student.email}</td>
                  <td className="text-center p-4 w-60"> {student.mobile_number ? student.mobile_number : "N/A"}
                  </td>
                  <td className="text-center p-4 w-32"> {/* Fixed width for Status column */}
                    <span
                      className={`inline-block text-center w-24 px-3 py-1 rounded-lg text-m font-semibold ${student.status === "active"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                        }`}
                    >
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedStudents.length > 0 ? (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredStudents.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center mt-10">
            <img src={NoStudent} alt="No Students" className="max-w-full max-h-full mt-30" />
          </div>
        )}

        {selectedStudent && (
          <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-xl relative">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 p-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => {
                  setSelectedStudent(null);
                  setEditMode(false);
                }}
              >
                ✕
              </button>

              {/* Header Section */}
              <div className="flex items-center mb-4">
                <div className="w-15 h-15 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-3xl font-bold mr-4">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedStudent.name.toUpperCase()}</h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1 bg-gray-200 rounded-sm text-sm font-semibold ${selectedStudent.status === "active" ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {selectedStudent.status.toUpperCase()}
                    </span>
                    <span className="p-1 text-sm bg-gray-200 rounded-sm text-gray-500">
                      CREATED ON : {new Date(selectedStudent.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HiOutlineBuildingOffice className="text-gray-500 mb-1" />
                    <span className="text-gray-400">College Name:</span>
                    <span>{editMode ? (
                      <input
                        type="text"
                        name="college_name"
                        value={editableStudent.college_name || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      selectedStudent.college_name
                    )}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuGitFork className="rotate-180 text-gray-500" />
                    <span className="text-gray-400">Department:</span>
                    <span>{editMode ? (
                      <input
                        type="text"
                        name="department"
                        value={editableStudent.department || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      selectedStudent.department
                    )}</span>
                  </div>
                </div>
              </div>
              <hr className="my-4" />

              {/* Contact Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MdOutlineMailOutline className="text-gray-500 mb-1" />
                    <span className="text-gray-400">E-mail:</span>
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuPhone className="text-gray-500 mb-1" />
                    <span className="text-gray-400">Contact Number:</span>
                    <span>{selectedStudent.mobile_number || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {editMode ? (
                  <>
                    <button
                      className={`px-4 py-3 w-32 text-black rounded-lg text-sm font-medium transition-colors duration-200 bg-yellow-300 hover:bg-yellow-600`}
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                    <button
                      className={`px-4 py-3 w-32 text-red rounded-lg text-sm font-medium  duration-200 bg-white border-2 border-red-600 text-red-600 font-semibold`}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`px-4 py-3 w-32 text-black rounded-lg text-sm font-medium transition-colors duration-200 bg-yellow-300 hover:bg-yellow-600 text-black font-semibold`}
                      onClick={handleEditProfile}
                    >
                      Edit Info
                    </button>
                    <button
                      className={`px-4 py-3 w-32 rounded-lg text-sm font-medium duration-200 border-2 font-semibold ${selectedStudent.status === "active"
                        ? "bg-white border-red-600 text-red-600"
                        : "border-green-600 text-green-600"
                        }`}
                      onClick={() => handleToggleStatus(selectedStudent)}
                    >
                      {selectedStudent.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className={`${buttonStyles} bg-red-600 hover:bg-red-800 text-white font-semibold`}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
              <div className="text-red-500 text-6xl mb-4">✕</div>
              <h2 className="text-2xl font-bold mb-4">Are you sure?</h2>
              <p className="mb-6">Do you really want to delete this student? This action cannot be undone.</p>
              <div className="flex justify-center gap-6">
                <button
                  className={`${buttonStyles} bg-red-600 hover:bg-red-700`}
                  onClick={() => handleDeleteStudent(selectedStudent._id)}
                >
                  Yes
                </button>
                <button
                  className={`${buttonStyles} bg-gray-600 hover:bg-gray-700`}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
