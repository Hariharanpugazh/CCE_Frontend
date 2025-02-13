import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function ManagementHomePage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState("");

    // Fetch admin details from the backend
    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/admins-list/");
                console.log("Fetched admins:", response.data.admins); // Debugging line
                setAdmins(response.data.admins); // Set admin details
            } catch (err) {
                console.error("Error fetching admin details:", err);
                setError("Failed to load admin details.");
            }
        };

        fetchAdminDetails();
    }, []);

    // Filter and sort admins
    const filteredAdmins = admins
        .filter((admin) =>
            (admin.name && admin.name.toLowerCase().includes(filter.toLowerCase())) ||
            (admin.email && admin.email.toLowerCase().includes(filter.toLowerCase())) ||
            (admin.status && admin.status.toLowerCase().includes(filter.toLowerCase())) ||
            (admin.created_at && new Date(admin.created_at).toLocaleString().includes(filter)) ||
            (admin.last_login && new Date(admin.last_login).toLocaleString().includes(filter))
        )
        .filter((admin) => !statusFilter || admin.status === statusFilter)
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
        
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];
        
            // Convert last_login and created_at to timestamps for proper sorting
            if (sortConfig.key === "last_login" || sortConfig.key === "created_at") {
                aValue = aValue ? new Date(aValue).getTime() : 0;
                bValue = bValue ? new Date(bValue).getTime() : 0;
            }
        
            if (aValue < bValue) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });

    console.log("Filtered Admins:", filteredAdmins); // Debugging line

    // Handle admin card click
    const handleAdminClick = (adminId) => {
        console.log("Admin clicked:", adminId); // Debugging line
        navigate(`/admin-details/${adminId}`);
    };

    const handleCreateUser = () => {
        // Navigate to the create user page or trigger create user action
        console.log("Create new admin clicked"); // Debugging line
        navigate('/admin-signup');
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        console.log("Sort requested:", key, direction); // Debugging line
    };

    return (
        <div className="container mx-auto p-4 text-center">
            <SuperAdminPageNavbar />
            <h1 className="text-3xl pt-4 font-bold mb-6 text-center">Admin Management</h1>
            <div className="flex justify-between items-center mb-6">
            <input
                    type="text"
                    placeholder="Search admins..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border p-2 rounded w-1/3"
                />
                <button
                    onClick={handleCreateUser}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create New Admin
                </button>
            </div>
            <div className="container text-center mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Admin List</h2>
                {error ? (
                    <p className="text-red-600">{error}</p>
                ) : filteredAdmins.length === 0 ? (
                    <p className="text-gray-600">No admin details match your search.</p>
                ) : (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th
                                    className="py-2 px-4 border-b cursor-pointer"
                                    onClick={() => requestSort('name')}
                                >
                                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="py-2 px-4 border-b cursor-pointer"
                                    onClick={() => requestSort('email')}
                                >
                                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="py-2 px-4 border-b cursor-pointer"
                                    onClick={() => requestSort('created_at')}
                                >
                                    Date Created {sortConfig.key === 'created_at' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="py-2 px-4 border-b cursor-pointer"
                                    onClick={() => requestSort('last_login')}
                                >
                                    Last Login {sortConfig.key === 'last_login' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th className="py-2 px-4 border-b relative">
                                    Status
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="ml-2 border p-1 rounded"
                                    >
                                        <option value="">All</option>
                                        <option value="active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.map((admin) => (
                                <tr
                                    key={admin._id}
                                    onClick={() => handleAdminClick(admin._id)}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    <td className="py-2 px-4 border-b">{admin.name || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{admin.email || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{admin.created_at ? new Date(admin.created_at).toLocaleString() : "N/A"}</td>
                                    <td className="py-2 px-4 border-b">{admin.last_login ? new Date(admin.last_login).toLocaleString() : "N/A"}</td>
                                    <td className="py-2 px-4 border-b">{admin.status || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
