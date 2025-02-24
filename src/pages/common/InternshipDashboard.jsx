import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import { AppPages } from "../../utils/constants";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Filters from "../../components/Common/Filters";
import SidePreview from "../../components/Common/SidePreview";
import Pagination from "../../components/Admin/pagination";

export default function InternshipDashboard() {
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const borderColor = "border-gray-300";

  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isEmployTypeOpen, setIsEmployTypeOpen] = useState(false);
  const [isWorkModeOpen, setIsWorkModeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [savedInterns, setSavedInterns] = useState([]);

  const [salaryRangeIndex, setSalaryRangeIndex] = useState(0);

  const [filters, setFilters] = useState({
    salaryRange: { min: 10000, max: 1000000 },
    experience: { value: 0, category: "under" },
    employmentType: {
      onSite: false,
      remote: false,
      hybrid: false
    },
    workingMode: {
      online: false,
      offline: false,
      hybrid: false
    },
    sortBy: "Relevance",
  });

  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [stipendRange, setStipendRange] = useState("");

  const clearFilters = () => {
    setFilters({
      salaryRange: { min: 10000, max: 1000000 },
      experience: { value: 0, category: "under" },
      employmentType: {
        onSite: false,
        remote: false,
        hybrid: false
      },
      workingMode: {
        online: false,
        offline: false,
        hybrid: false
      },
      sortBy: "Relevance",
    });
  };

  const filterArgs = {
    searchPhrase,
    clearFilters,
    isSalaryOpen,
    setIsSalaryOpen,
    salaryRangeIndex,
    setSalaryRangeIndex,
    filters,
    setFilters,
    isExperienceOpen,
    setIsExperienceOpen,
    isEmployTypeOpen,
    setIsEmployTypeOpen,
    isWorkModeOpen,
    setIsWorkModeOpen,
    isSortOpen,
    setIsSortOpen,
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "location") {
      setLocation(value);
    } else if (name === "duration") {
      setDuration(value);
    } else if (name === "stipendRange") {
      setStipendRange(value);
    }
  };

  // Fetch published internships from the backend
  useEffect(() => {
    const fetchPublishedInternships = async () => {
      try {
        const response = await axios.get("https://cce-backend-54k0.onrender.com/api/published-internship/");

        const internshipsWithType = response.data.internships.map((internship) => ({
          ...internship.internship_data, // Extract internship_data
          id: internship._id, // Add id field
          type: "internship",
          status: internship.status,
          updated_at: internship.updated_at, // Add type field
          total_views: internship.total_views // Include total_views
        }));
        // console.log("Internships with type:", internshipsWithType); // Debugging line
        setInternships(internshipsWithType); // Set internships with type
        setFilteredInterns(internshipsWithType); // Update filtered internships
      } catch (err) {
        console.error("Error fetching published internships:", err);
        setError("Failed to load internships.");
      }
    };

    fetchPublishedInternships();
  }, []);

  useEffect(() => {
    if (
      searchPhrase === "" &&
      location === "" &&
      duration === "" &&
      stipendRange === ""
    ) {
      setFilteredInterns(internships);
    } else {
      setFilteredInterns(
        internships.filter((intern) => {
          const [minStipend, maxStipend] = stipendRange.split("-").map(Number);
          return (
            (intern.title.toLowerCase().includes(searchPhrase) ||
              intern.company_name.toLowerCase().includes(searchPhrase) ||
              intern.job_description.toLowerCase().includes(searchPhrase) ||
              intern.required_skills.includes(searchPhrase) ||
              intern.internship_type.toLowerCase().includes(searchPhrase)) &&
            (location === "" || intern.location.toLowerCase().includes(location)) &&
            (duration === "" || intern.duration.toLowerCase().includes(duration)) &&
            (stipendRange === "" || (intern.stipend >= minStipend && intern.stipend <= maxStipend))
          );
        })
      );
    }
    setCurrentPage(1);
  }, [searchPhrase, location, duration, stipendRange, internships]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const user = !payload.student_user ? payload.role : "student";
      setUserRole(user);
      user === "superadmin" || user === "admin" ? undefined : fetchSavedInternships(); // Assuming the payload has a 'role' field
    }
  }, []);

  const fetchSavedInternships = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      const response = await axios.get(`https://cce-backend-54k0.onrender.com/api/saved-internships/${userId}/`);
      setSavedInterns(response.data.internships.map(internship => internship._id));
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  };

  useEffect(() => {
    console.log(savedInterns);
  }, []);

  // Pagination logic
  const indexOfLastIntern = currentPage * itemsPerPage;
  const indexOfFirstIntern = indexOfLastIntern - itemsPerPage;
  const currentInterns = filteredInterns.slice(indexOfFirstIntern, indexOfLastIntern);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1">

        {userRole === "student" && <StudentPageNavbar />}
        <header className="flex flex-col items-center justify-center py-14 container self-center">
          <p className="text-6xl tracking-[0.8px]">
            Internships
          </p>
          <p className="text-lg mt-2 text-center">
            Explore all the internship opportunities
            in all the existing fields <br />around the globe.
          </p>
          
        </header>

         {/* search */}
         <div className="sticky ml-10 top-10 z-10 bg-white flex border border-gray-300 mr-11 mb-5">
          <input
            type="text"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value.toLocaleLowerCase())}
            placeholder={`Search Jobs`}
            className={`w-full text-lg p-2 px-4 bg-white hover:border-gray-400 outline-none ${borderColor}`}
          />
          <div className="flex mr-5 justify-center items-center space-x-4">
            <select name="location" onChange={handleFilterChange} className="p-2 border-l border-gray-300">
              <option value="">All Locations</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Kerala">Kerala</option>
              <option value="Chennai">Chennai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Mumbai">Mumbai</option>
            </select>
            <select name="duration" onChange={handleFilterChange} className="p-2 border-l border-gray-300">
              <option value="">Duration</option>
              <option value="1 month">1 Month</option>
              <option value="3 months">3 Months</option>
              <option value="6 months">6 Months</option>
            </select>
            <select name="stipendRange" onChange={handleFilterChange} className="p-2 border-l border-gray-300">
              <option value="">Stipend Range</option>
              <option value="3000-5000">3000-5000</option>
              <option value="5000-8000">5000-8000</option>
              <option value="8000-10000">8000-10000</option>
              <option value="10000-15000">10000-15000</option>
            </select>
          </div>
          <button className={`px-13 bg-yellow-400 rounded-tr rounded-br ${borderColor} border`}>Search</button>
        </div>

        <div className="flex px-10 space-x-5 items-start">
          {/* filters */}
          {/* <Filters args={filterArgs} /> */}

          {/* Job cards */}
          <div className="flex-1 flex flex-col space-y-3">


            {/* jobs */}
            <div className="w-full self-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {error ? (
                <p className="text-red-600">{error}</p>
              ) : internships.length === 0 ? (
                <p className="text-gray-600">No internships available at the moment.</p>
              ) : currentInterns.length === 0 ? (
                <p className="alert alert-danger w-full col-span-full text-center">
                  !! No Internships Found !!
                </p>
              ) : (
                currentInterns.map((intern) => (
                  <ApplicationCard
                    key={intern.id}
                    application={{ ...intern, total_views: intern.total_views }} // Include total_views
                    handleCardClick={() => { setSelectedIntern(intern); console.log(intern); }}
                    isSaved={userRole === "superadmin" || userRole === "admin" ? undefined : savedInterns.includes(intern.id)}
                  />
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredInterns.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>

          {/* job preview */}
          <SidePreview
            selectedItem={selectedIntern}
            handleViewItem={() => { window.location.href = `/internship-preview/${selectedIntern.id}`; }}
            isSaved={userRole === "superadmin" || userRole === "admin" ? undefined : savedInterns.includes(selectedIntern?.id)}
            fetchSavedJobs={fetchSavedInternships}
            setSelectedItem={setSelectedIntern}
          />
        </div>
      </div>
    </div>
  );
}
