import { useEffect, useState } from "react";
import { useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuperAdminNavBar from "../../components/SuperAdmin/SuperAdminNavBar";
import Pagination from "../../components/Admin/pagination";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

const StudentManagement_superadmin = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editableStudent, setEditableStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("https://cce-backend-54k0.onrender.com/api/students/");
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

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filter, statusFilter, totalPages]);

  const handleDeleteStudent = (id) => {
    setStudents(students.filter((student) => student._id !== id));
    setSelectedStudent(null);
    setShowDeleteConfirm(false);
    toast.success("Student deleted successfully!"); // Show toast notification
  };

  const handleToggleStatus = (student) => {
    const updatedStatus = student.status === "active" ? "inactive" : "active";
    setStudents(
      students.map((s) =>
        s._id === student._id ? { ...s, status: updatedStatus } : s
      )
    );
    setSelectedStudent(null);
    toast.success(`Student ${updatedStatus}d successfully!`); // Show toast notification
  };

  const handleEditProfile = () => {
    setEditableStudent({ ...selectedStudent });
    setEditMode(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Send the updated student data to the backend
      await axios.put(`https://cce-backend-54k0.onrender.com/api/students/${editableStudent._id}/update/`, editableStudent);
  
      // Update the local state with the new student data
      setStudents(
        students.map((student) =>
          student._id === editableStudent._id ? editableStudent : student
        )
      );
      setEditMode(false);
      setSelectedStudent(editableStudent);
      
      // Show toast notification
      toast.success("Student profile updated successfully!");
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student profile. Please try again.");
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


  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for A-Z, "desc" for Z-A

  const handleSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  // Sorting logic for "Name" column
  const sortedStudents = useMemo(() => {
    return [...paginatedStudents].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name); // A-Z sorting
      } else {
        return b.name.localeCompare(a.name); // Z-A sorting
      }
    });
  }, [paginatedStudents, sortOrder]);

  return (
    <div>
      <SuperAdminNavBar />
      <div className="p-8 bg-gray-100 min-h-screen ml-55">
        <h1 className="text-4xl font-bold text-center mb-8">Student Management</h1>

        <div className="flex flex-wrap items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 p-3 border rounded-lg"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="">Filter by Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            className={`${buttonStyles} bg-green-600 hover:bg-green-700`}
            onClick={() => navigate("/student-signup")}
          >
            Create Student
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
                <th className="text-center p-4" onClick={handleSort}>
              Name
              <span className="ml-2">
                {sortOrder === "asc" ? "↑" : "↓"} {/* Arrow indicators */}
              </span>
            </th>
              <th className="text-center p-4">Department</th>
              <th className="text-center p-4">Email</th>
              <th className="text-center p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr
                key={student._id}
                onClick={() => setSelectedStudent(student)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="text-center p-4">{student.name}</td>
                <td className="text-center p-4">{student.department}</td>
                <td className="text-center p-4">{student.email}</td>
                <td className="text-center p-4">
                  <span
                    className={`inline-block text-center w-24 px-3 py-1 rounded-full text-m font-semibold ${
                      student.status === "active" ? "text-green-800" : "text-red-900"
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

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredStudents.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>

        {selectedStudent && (
          <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-lg shadow-lg w-3/4 max-w-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => {
                  setSelectedStudent(null);
                  setEditMode(false);
                }}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6">Student Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {["name", "email", "department", "year", "college_name"].map((field) => (
                  <div key={field} className="bg-gray-100 p-4 rounded-lg">
                    <strong className="block text-sm font-semibold">
                      {field.replace("_", " ").toUpperCase()}:
                    </strong>
                    {editMode && field !== "email" ? ( // Make email non-editable
                      <input
                        type="text"
                        name={field}
                        value={editableStudent[field] || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      <span>{selectedStudent[field]}</span> // Email remains non-editable
                    )}
                  </div>
                ))}
              </div>


              <div className="mt-8 flex justify-center gap-6">
                {editMode ? (
                  <>
                    <button
                      className={`${buttonStyles} bg-blue-600 hover:bg-blue-700`}
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                    <button
                      className={`${buttonStyles} bg-gray-600 hover:bg-gray-700`}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`${buttonStyles} bg-blue-600 hover:bg-blue-700`}
                      onClick={() => handleToggleStatus(selectedStudent)}
                    >
                      {selectedStudent.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className={`${buttonStyles} bg-yellow-600 hover:bg-yellow-700`}
                      onClick={handleEditProfile}
                    >
                      Edit
                    </button>
                    <button
                      className={`${buttonStyles} bg-red-600 hover:bg-red-700`}
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

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};

export default StudentManagement_superadmin;
