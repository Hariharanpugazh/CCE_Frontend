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
        .filter((admin) => {
            const matchesFilter =
                (admin.name && admin.name.toLowerCase().includes(filter.toLowerCase())) ||
                (admin.email && admin.email.toLowerCase().includes(filter.toLowerCase())) ||
                (admin.status && admin.status.toLowerCase().includes(filter.toLowerCase())) ||
                (admin.created_at && new Date(admin.created_at).toLocaleString().includes(filter)) ||
                (admin.last_login && new Date(admin.last_login).toLocaleString().includes(filter));
            const matchesStatus = !statusFilter || admin.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesFilter && matchesStatus;
        })
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
        <div className="flex">
            <SuperAdminPageNavbar />
            <main className="p-8 flex-1">
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
                    <div className="flex flex-wrap items-center mb-10 gap-4">
                        <div className="flex flex-1 items-center border rounded-lg border-gray-500 w-full">
                            <input
                                type="text"
                                placeholder=" Search..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="flex-1 px-3 outline-none w-full"
                            />
                            <button className="px-10 py-2 bg-yellow-400 rounded-tr rounded-br border-l border-gray-500">
                                <strong>Search</strong>
                            </button>
                        </div>

                        <div className="flex items-center ml-60 border rounded-lg">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 p-3 border-r px-3  py-2 ml-1 mr-3  rounded-l-lg  appearance-none"
                            >
                                <option value="">Filter by Status  ⮟ </option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <button
                                onClick={handleCreateUser}
                                className=" text-black px-4 py-2 rounded ml-auto"
                            >
                                Create Admin +
                            </button>
                        </div>
                    </div>
                    {/* Table */}
                    {error ? (
                        <p className="text-red-600 text-center">{error}</p>
                    ) : filteredAdmins.length === 0 ? (
                        <p className="text-gray-600 text-center">No admin details match your search.</p>
                    ) : (
                        <div className="rounded-lg border border-gray-300 bg-white overflow-x-auto border border-gray-500">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th
                                            className="py-3 px-4  border-b  border-gray-500 text-left cursor-pointer"
                                            onClick={() => requestSort('name')}
                                        >
                                            Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-2 px-4 border-b border-gray-500 text-left cursor-pointer"
                                            onClick={() => requestSort('email')}
                                        >
                                            Email Address{sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-2 px-4 border-b border-gray-500 text-left cursor-pointer"
                                            onClick={() => requestSort('created_at')}
                                        >
                                            Date Created {sortConfig.key === 'created_at' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-2 px-4 border-b border-gray-500 text-left cursor-pointer"
                                            onClick={() => requestSort('last_login')}
                                        >
                                            Last Logged in {sortConfig.key === 'last_login' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-500 text-center">Status</th>
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
                                                    className={`inline-block text-center w-30 px-5 py-1  ml-12 rounded-lg text-m font-semibold ${admin.status === "Active" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
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
