import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import JobCard from "../../components/Admin/JobCard"; // Import the JobCard component

export default function AdminDetailPage() {
    const { id } = useParams();
    const [admin, setAdmin] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        college_name: "",
    });

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/admin-details/${id}/`);
                setAdmin(response.data.admin);
                setJobs(response.data.jobs);
                setFormData({
                    name: response.data.admin.name,
                    email: response.data.admin.email,
                    department: response.data.admin.department,
                    college_name: response.data.admin.college_name,
                });
            } catch (err) {
                console.error("Error fetching admin details:", err);
                setError("Failed to load admin details.");
            }
        };

        fetchAdminDetails();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        if (!admin) return;

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(`http://localhost:8000/api/admin-status/${id}/`, {
                status: newStatus,
            });

            if (response.status === 200) {
                setAdmin((prevAdmin) => ({ ...prevAdmin, status: newStatus }));
                setMessage(`The account is now ${newStatus}.`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setError("Failed to update admin status.");
        }
        setLoading(false);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.put(`http://localhost:8000/api/admin/${id}/edit/`, formData);

            if (response.status === 200) {
                setAdmin((prevAdmin) => ({ ...prevAdmin, ...formData }));
                setMessage("Admin details updated successfully.");
                setEditMode(false);
            }
        } catch (error) {
            console.error("Error updating admin details:", error);
            setError("Failed to update admin details.");
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const generateCSV = () => {
        const csvRows = [];

        let last_login = admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"
        last_login = last_login.replace(/,/g, " "); // Replace all commas with spaces
    
        // Add admin details
        const adminHeaders = ["Name", "Email", "Department", "College Name", "Status", "Last Login", "Date Created"];
        const adminValues = [
            admin.name,
            admin.email,
            admin.department,
            admin.college_name,
            admin.status,
            last_login,
            admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "Unknown"

        ];

        console.log(admin.last_login);
        console.log(admin.created_at);

        csvRows.push(adminHeaders.join(","));
        csvRows.push(adminValues.join(","));
    
        // Add job details
        if (jobs.length > 0) {
            const jobHeaders = ["Job Title", "Company", "Location", "Published Date"];
            csvRows.push("\n" + jobHeaders.join(","));
            
            jobs.forEach(job => {
                let location = job.job_location;
                location = location.replace(/,/g, " "); // Replace all commas with spaces
                const jobValues = [
                    job.title,
                    job.company_name,
                    location,
                    job.updated_at ? new Date(job.updated_at).toLocaleDateString() : "Unknown" // Use updated_at as published_at
                ];
                csvRows.push(jobValues.join(","));
            });
        }
    
        // Ensure no trailing comma or newline at the end
        return csvRows.join("\n").trim();
    };
    
    const downloadCSV = () => {
        const csvData = generateCSV();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "admin_details.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    if (!admin) {
        return <p className="text-gray-600">Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <SuperAdminPageNavbar />
            <h2 className="text-2xl font-bold mb-4">Admin Details</h2>
            {message && <p className="text-blue-600 font-semibold">{message}</p>}
            <div className="mb-4">
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
                            College Name:
                            <input
                                type="text"
                                name="college_name"
                                value={formData.college_name}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </label>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                ) : (
                    <div>
                        <p><strong>Name:</strong> {admin.name || "N/A"}</p>
                        <p><strong>Email:</strong> {admin.email || "N/A"}</p>
                        <p><strong>Department:</strong> {admin.department || "N/A"}</p>
                        <p><strong>College Name:</strong> {admin.college_name || "N/A"}</p>
                        <p>
                            <strong>Account Status:</strong>
                            <span
                                className={`font-bold ${
                                    admin.status === "active" ? "text-green-600" : "text-red-600"
                                }`}
                            >
                                {admin.status}
                            </span>
                        </p>
                        <p><strong>Last Login:</strong> {admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"}</p>
                        <p><strong>Date Created:</strong> {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "Unknown"}</p>
                        <div className="mt-4">
                            {admin.status === "active" ? (
                                <button
                                    onClick={() => handleStatusChange("Inactive")}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    {loading ? "Processing..." : "Inactive"}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStatusChange("active")}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    {loading ? "Processing..." : "Activate"}
                                </button>
                            )}
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-yellow-500 text-white rounded ml-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={downloadCSV}
                                className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
                            >
                                Download CSV
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Display Job Details with JobCard */}
            <h3 className="text-xl font-bold mt-6 mb-2">Jobs Posted</h3>
            {jobs.length === 0 ? (
                <p className="text-gray-600">No jobs posted by this admin.</p>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}
