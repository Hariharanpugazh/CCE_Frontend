import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Pagination from "../../components/Admin/pagination"; // Import Pagination component

export default function ManagementHomePage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch admin details from the backend
    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axios.get("https://cce-backend-54k0.onrender.com/api/admins-list/");
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

    // Calculate metrics
    const totalAdmins = admins.length;
    const activeAdmins = admins.filter(admin => admin.status === "Active").length;
    const inactiveAdmins = admins.filter(admin => admin.status === "Inactive").length;

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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 ml-55">
            <SuperAdminPageNavbar />
            <main className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6">Admin Management</h1>

                    {/* Metrics */}
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded">
                            <span className="text-sm text-gray-600">Total Admins</span>
                            <span className="text-sm font-medium">{totalAdmins}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-green-200 p-2 rounded">
                            <span className="text-sm text-gray-600">Active Admins</span>
                            <span className="text-sm font-medium">{activeAdmins}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-red-200 p-2 rounded">
                            <span className="text-sm text-gray-600">Inactive Admins</span>
                            <span className="text-sm font-medium">{inactiveAdmins}</span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center space-x-2 mb-6">
                        <input
                            type="text"
                            placeholder="Search admins..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border p-2 rounded w-1/3"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <button
                            onClick={handleCreateUser}
                            className="bg-blue-500 text-white px-4 py-2 rounded ml-auto"
                        >
                            Create New Admin
                        </button>
                    </div>

                    {/* Table */}
                    {error ? (
                        <p className="text-red-600 text-center">{error}</p>
                    ) : filteredAdmins.length === 0 ? (
                        <p className="text-gray-600 text-center">No admin details match your search.</p>
                    ) : (
                        <div className="rounded-lg border border-gray-300 bg-white overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th
                                            className="py-2 px-4 border-b border-gray-300 text-left cursor-pointer"
                                            onClick={() => requestSort('name')}
                                        >
                                            Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-2 px-4 border-b border-gray-300 text-left cursor-pointer"
                                            onClick={() => requestSort('email')}
                                        >
                                            Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-2 px-4 border-b border-gray-300 text-left cursor-pointer"
                                            onClick={() => requestSort('created_at')}
                                        >
                                            Date Created {sortConfig.key === 'created_at' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-2 px-4 border-b border-gray-300 text-left cursor-pointer"
                                            onClick={() => requestSort('last_login')}
                                        >
                                            Last Login {sortConfig.key === 'last_login' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-300 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((admin) => (
                                        <tr
                                            key={admin._id}
                                            onClick={() => handleAdminClick(admin._id)}
                                            className="cursor-pointer hover:bg-gray-100"
                                        >
                                            <td className="py-2 px-4 border-b border-gray-300">{admin.name || 'N/A'}</td>
                                            <td className="py-2 px-4 border-b border-gray-300">{admin.email || 'N/A'}</td>
                                            <td className="py-2 px-4 border-b border-gray-300">{admin.created_at ? new Date(admin.created_at).toLocaleString() : "N/A"}</td>
                                            <td className="py-2 px-4 border-b border-gray-300">{admin.last_login ? new Date(admin.last_login).toLocaleString() : "N/A"}</td>
                                            <td className="py-2 px-4 border-b border-gray-300">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        admin.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {admin.status || 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filteredAdmins.length > itemsPerPage && (
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredAdmins.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
