import { useEffect, useState, useContext } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import Footer from "../../components/Common/Footer";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Admin/pagination";
import { LoaderContext } from "../../components/Common/Loader";
import NoListingImage from "../../assets/images/NoListing.svg"; // Import the image

export default function InternshipDashboard() {
  const [internships, setInternships] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [savedInterns, setSavedInterns] = useState([]);
  const [isSavedInternsOpen, setIsSavedInternsOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [stipendRange, setStipendRange] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "Relevance",
  });

  const navigate = useNavigate();
  const borderColor = "border-gray-300";

  // Load saved filters and page position from localStorage on component mount
  useEffect(() => {
    const savedFilters = localStorage.getItem("internshipFilters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setSearchPhrase(parsedFilters.searchPhrase || "");
      setLocation(parsedFilters.location || "");
      setDuration(parsedFilters.duration || "");
      setStipendRange(parsedFilters.stipendRange || "");
      setFilters({ sortBy: parsedFilters.sortBy || "Relevance" });
    }

    const savedPage = localStorage.getItem("internshipCurrentPage");
    if (savedPage) {
      setCurrentPage(Number.parseInt(savedPage, 10));
    }
  }, []);

  useEffect(() => {
    const fetchPublishedInternships = async () => {
      setIsLoading(true); // Set loading to true before fetching data
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8000/api/published-internship/");
        const internshipsWithType = response.data.internships.map((internship) => ({
          ...internship.internship_data,
          id: internship._id,
          type: "internship",
          status: internship.status,
          updated_at: internship.updated_at,
          views: internship.views,
        }));
        setInternships(internshipsWithType);
        setFilteredInterns(internshipsWithType);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching published internships:", err);
        setError("Failed to load internships.");
        setIsLoading(false);
      }
    };
    fetchPublishedInternships();
  }, [setIsLoading]);

  useEffect(() => {
    if (internships.length > 0) {
      applyFilters();
    }
  }, [internships]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(!payload.student_user ? payload.role : "student");
      } catch (err) {
        console.error("Error parsing JWT:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (userRole === "student") {
      fetchSavedInternships();
    }
  }, [userRole, isSavedInternsOpen]);

  const fetchSavedInternships = async () => {
    try {
      const token = Cookies.get("jwt");
      if (!token) return;
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      const response = await axios.get(`http://localhost:8000/api/saved-internships/${userId}/`);
      setSavedInterns(response.data.internships.map((internship) => internship._id));
    } catch (err) {
      console.error("Error fetching saved internships:", err);
    }
  };

  const applyFilters = () => {
    let filtered = [...internships];

    const filtersToSave = {
      searchPhrase,
      location,
      duration,
      stipendRange,
      sortBy: filters.sortBy,
    };
    localStorage.setItem("internshipFilters", JSON.stringify(filtersToSave));

    filtered = filtered.filter((intern) => {
      const matchesSearch =
        !searchPhrase ||
        intern.title?.toLowerCase().includes(searchPhrase) ||
        intern.company_name?.toLowerCase().includes(searchPhrase) ||
        intern.job_description?.toLowerCase().includes(searchPhrase) ||
        (Array.isArray(intern.required_skills) &&
          intern.required_skills.some((skill) => skill?.toLowerCase().includes(searchPhrase))) ||
        intern.internship_type?.toLowerCase().includes(searchPhrase);

      const matchesLocation = !location || intern.location?.toLowerCase().includes(location.toLowerCase());
      const matchesDuration = !duration || intern.duration?.toLowerCase().includes(duration.toLowerCase());

      let matchesStipend = true;
      if (stipendRange) {
        const [minStipend, maxStipend] = stipendRange.split("-").map(Number);
        const internStipend = Number.parseInt(intern.stipend) || 0;
        matchesStipend = internStipend >= minStipend && internStipend <= maxStipend;
      }

      return matchesSearch && matchesLocation && matchesDuration && matchesStipend;
    });

    if (filters.sortBy === "Newest" || filters.sortBy === "Oldest") {
      const now = new Date();
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(now.getDate() - 1);

      if (filters.sortBy === "Newest") {
        filtered = filtered.filter((intern) => {
          const internshipUpdateDate = new Date(intern.updated_at);
          return internshipUpdateDate >= oneDayAgo;
        });
      } else if (filters.sortBy === "Oldest") {
        filtered = filtered.filter((intern) => {
          const internshipUpdateDate = new Date(intern.updated_at);
          return internshipUpdateDate < oneDayAgo;
        });
      }
    } else {
      filtered.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return filters.sortBy === "Newest" ? dateB - dateA : dateA - dateB;
      });
    }

    setFilteredInterns(filtered);
  };

  useEffect(() => {
    if (internships.length > 0) {
      applyFilters();
    }
  }, [searchPhrase, location, duration, stipendRange, filters.sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "location":
        setLocation(value);
        break;
      case "duration":
        setDuration(value);
        break;
      case "stipendRange":
        setStipendRange(value);
        break;
      case "sortBy":
        setFilters((prev) => ({ ...prev, sortBy: value }));
        break;
      default:
        break;
    }
  };

  const handleSearchClick = () => {
    applyFilters();
  };

  const clearFilters = () => {
    setSearchPhrase("");
    setLocation("");
    setDuration("");
    setStipendRange("");
    setFilters({ sortBy: "Relevance" });
    setFilteredInterns(internships);
    setCurrentPage(1);

    localStorage.removeItem("internshipFilters");
    localStorage.removeItem("internshipCurrentPage");
  };

  useEffect(() => {
    localStorage.setItem("internshipCurrentPage", currentPage.toString());
  }, [currentPage]);

  const indexOfLastIntern = currentPage * itemsPerPage;
  const indexOfFirstIntern = indexOfLastIntern - itemsPerPage;
  const currentInterns = filteredInterns.slice(indexOfFirstIntern, indexOfLastIntern);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInternshipSelection = (intern) => {
    setSelectedIntern(intern);

    localStorage.setItem("internshipCurrentPage", currentPage.toString());

    const filtersToSave = {
      searchPhrase,
      location,
      duration,
      stipendRange,
      sortBy: filters.sortBy,
    };
    localStorage.setItem("internshipFilters", JSON.stringify(filtersToSave));

    navigate(`/internship-details/${intern.id}`);
  };

  return (
    <div className="sm:flex">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1">
        {userRole === "student" && <StudentPageNavbar />}

        <div className="flex flex-col flex-1">
          <header className="flex flex-col items-center justify-center py-8 px-4 sm:py-14 container mx-auto text-center">
            <p className="text-3xl sm:text-6xl tracking-[0.8px]">Internships</p>
            <p className="text-base sm:text-lg mt-2">
              Explore all the internship opportunities in all the existing fields <br />
              around the globe.
            </p>
          </header>

          <div className="top-0 z-10 bg-white px-4 sm:px-10 mb-5">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex items-center w-full">
                <FiSearch className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 h-10 rounded-md w-full border border-gray-300 focus:outline-none"
                  value={searchPhrase}
                  onChange={(e) => setSearchPhrase(e.target.value.toLowerCase())}
                />
              </div>

              <div>
                <select
                  className="h-10 bg-white border border-gray-300 rounded-md px-4 hover:bg-gray-100 w-70"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="Relevance">Sort by relevance</option>
                  <option value="Newest">Newest (Last 24 hours)</option>
                  <option value="Oldest">Oldest (More than 24 hours)</option>
                </select>
              </div>

              <button
                className="sm:hidden h-10 border border-gray-300 rounded-md px-4 flex items-center gap-2"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              >
                Filters {isMobileFiltersOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row px-4 sm:px-10 space-y-5 sm:space-y-0 sm:space-x-5">
            <div className="flex-1 flex flex-col space-y-3">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {isLoading ? (
                  <p className="text-center text-gray-600">Loading...</p>
                ) : error ? (
                  <p className="text-red-600">{error}</p>
                ) : internships.length === 0 ? (
                  <div className="alert alert-danger w-full col-span-full text-center flex flex-col items-center">
                    <img src={NoListingImage} alt="No Listings" className="mb-4" />
                  </div>
                ) : currentInterns.length === 0 ? (
                  <div className="alert alert-danger w-full col-span-full text-center flex flex-col items-center">
                    <img src={NoListingImage} alt="No Listings" className="mb-4" />
                  </div>
                ) : (
                  currentInterns.map((intern) => (
                    <ApplicationCard
                      application={intern}
                      key={intern.id}
                      handleCardClick={() => handleInternshipSelection(intern)}
                      isSaved={
                        userRole === "superadmin" || userRole === "admin" ? undefined : savedInterns.includes(intern.id)
                      }
                      savedJobs={savedInterns}
                      isSavedJobsOpen={isSavedInternsOpen}
                      setSavedJobs={setSavedInterns}
                      setIsSavedJobsOpen={setIsSavedInternsOpen}
                    />
                  ))
                )}
              </div>

              {filteredInterns.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredInterns.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
          {userRole === "student" && <Footer />}
        </div>
      </div>
    </div>
  );
}
