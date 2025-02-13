import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
  });
  const navigate = useNavigate();

  // Fetch user role from JWT token in cookies
  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      setUserRole(payload.role); // Assuming the payload has a 'role' field
    }
  }, []);

  // Fetch student list
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/students/"); // Replace with your API endpoint
        setStudents(response.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Filter and sort students
  const filteredStudents = students
    .filter((student) =>
      (student.name && student.name.toLowerCase().includes(filter.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(filter.toLowerCase()))
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  // Handle status toggle
  const toggleStatus = async (student) => {
    try {
      setIsLoading(true);
      const newStatus = student.status === "active" ? "inactive" : "active";
      await axios.put(`http://localhost:8000/api/students/${student._id}/update/`, { status: newStatus });
      setStudents((prev) =>
        prev.map((s) =>
          s._id === student._id ? { ...s, status: newStatus } : s
        )
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating status:", error);
      setIsLoading(false);
    }
  };

  // Handle student deletion
  const deleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/students/${studentId}/delete/`);
      setStudents((prev) => prev.filter((s) => s._id !== studentId));
      setSelectedStudent(null);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = () => {
    setEditMode(true);
    setFormData({
      name: selectedStudent.name,
      email: selectedStudent.email,
      department: selectedStudent.department || "",
      year: selectedStudent.year || "",
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const validData = {
        name: formData.name || selectedStudent.name,
        email: formData.email || selectedStudent.email,
        department: formData.department || selectedStudent.department,
        year: formData.year || selectedStudent.year
      };
  
      const response = await axios.put(`http://localhost:8000/api/students/${selectedStudent._id}/update/`, validData);
      if (response.status === 200) {
        setStudents((prev) =>
          prev.map((s) =>
            s._id === selectedStudent._id ? { ...s, ...validData } : s
          )
        );
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
    setIsLoading(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
      {/* Render appropriate navbar based on user role */}
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Student List */}
        <div className="col-span-1 bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Student List</h2>
            <button
              onClick={() => navigate("/student-signup")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Student +
            </button>
          </div>
          <ul className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <li
                key={student._id}
                onClick={() => setSelectedStudent(student)}
                className={`cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-100 ${
                  selectedStudent?._id === student._id ? "bg-gray-200" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">
                    {student.name} ({student.status})
                  </span>
                  <span className="text-gray-500 text-sm">{student.email}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Student Details */}
        {selectedStudent && (
          <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {selectedStudent.name}
            </h2>

            {editMode ? (
              <div>
                <label className="block mb-2">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </label>
                <label className="block mb-2">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </label>
                <label className="block mb-2">
                  Department:
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </label>
                <label className="block mb-2">
                  Year:
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </label>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-800">{selectedStudent.name}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-800">{selectedStudent.email}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-600">Department:</span>
                  <span className="ml-2 text-gray-800">{selectedStudent.department || "N/A"}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-600">Year:</span>
                  <span className="ml-2 text-gray-800">{selectedStudent.year || "N/A"}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded ${
                      selectedStudent.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="ml-2 text-gray-800">{selectedStudent.last_login || "Never"}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-600">Created At:</span>
                  <span className="ml-2 text-gray-800">{selectedStudent.created_at || "Unknown"}</span>
                </div>
                <button
                  onClick={() => toggleStatus(selectedStudent)}
                  className={`w-full py-2 mb-4 text-white rounded-lg font-medium transition duration-300 ${
                    selectedStudent.status === "active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isLoading
                    ? selectedStudent.status === "active"
                      ? "Inactivating..."
                      : "Activating..."
                    : `Set to ${selectedStudent.status === "active" ? "Inactive" : "Active"}`}
                </button>
                <button
                  onClick={handleEdit}
                  className="w-full py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition mb-4"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => deleteStudent(selectedStudent._id)}
                  className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition duration-300"
                >
                  Delete Student
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
