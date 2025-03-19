import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaSearch } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Pagination from "../../components/Admin/pagination";
import { LoaderContext } from "../../components/Common/Loader";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Footer from '../../components/Common/Footer';
import NoListingImage from "../../assets/images/NoListing.svg"; 
import StudentPageNavbar from '../../components/Students/StudentPageNavbar';

export default function StudyMaterial() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('Exam');
  const cardsPerPage = 6;
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(!decodedToken.student_user ? decodedToken.role : "student");
    }
  }, []);

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/all-study-material/');
        const data = await response.json();
        setCards(data.study_materials);
        updateCategories(data.study_materials, selectedType);
      } catch (error) {
        console.error('Error fetching study materials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyMaterials();
  }, [setIsLoading, selectedType]);

  const updateCategories = (materials, type) => {
    const filteredMaterials = materials.filter(material => material.type === type);
    const uniqueCategories = [...new Set(filteredMaterials.map(item => item.category))].sort();
    setCategories(uniqueCategories);
    if (uniqueCategories.length > 0) {
      setSelectedCategory(uniqueCategories[0]);
    }
  };

  const filteredCards = cards.filter((card) => {
    const categoryMatch = selectedCategory ? card.category === selectedCategory : true;
    const typeMatch = selectedType ? card.type === selectedType : true;
    const searchMatch = searchQuery
      ? (card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return categoryMatch && typeMatch && searchMatch;
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const changeType = (direction) => {
    const types = ['Exam', 'Subject', 'Topic'];
    const currentIndex = types.indexOf(selectedType);
    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
      newIndex = types.length - 1;
    } else if (newIndex >= types.length) {
      newIndex = 0;
    }

    setSelectedType(types[newIndex]);
    setCurrentPage(1);
  };

  useEffect(() => {
    updateCategories(cards, selectedType);
  }, [selectedType, cards]);

  const handleViewClick = (card) => {
    navigate(`/student-study-detail/${card._id}`, { state: { card } });
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Sidebar */}
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {userRole === "student" && <StudentPageNavbar />}

        <main className="flex-1 px-4 md:px-6 py-6">
          {/* Header */}
          <header className="flex flex-col items-center justify-center py-8 px-4 sm:py-14 container mx-auto text-center">
            <p className="text-3xl sm:text-6xl tracking-[0.8px]">Study Material</p>
            <p className="text-base sm:text-lg mt-2">
              Explore comprehensive study materials for exams, subjects, and topics <br />
              to enhance your learning experience.
            </p>
          </header>
          <div className="relative flex items-center w-[70%]">
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 h-10 rounded-md w-full border border-gray-300 focus:outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value.toLowerCase());
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Add margin-top here */}
          <div className="space-y-6 mt-6">
            {/* Type Switcher and Search Bar Container */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    className="w-10 h-9 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => changeType(-1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-4 h-9 flex items-center text-sm border-x border-gray-300 min-w-[120px] justify-center">
                    {selectedType} Material
                  </span>
                  <button
                    className="w-10 h-9 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => changeType(1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Search Bar - 70% width */}
             
            </div>

            {/* Categories - Horizontally Scrollable */}
            <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`flex-shrink-0 px-3 py-1 text-sm md:text-base font-medium whitespace-nowrap ${
                    selectedCategory === category
                    ? 'border-b-[3px] border-yellow-500 text-black'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            {searchQuery && filteredCards.length === 0 && !isLoading && (
              <div className="text-center text-gray-600 mt-4">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Cards Grid */}
          {currentCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-8">
              <img src={NoListingImage} alt="No Study Materials" className="w-80 h-80  mr-30" />
           
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {currentCards.map((card, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow flex flex-col bg-white"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-base md:text-lg text-gray-800">
                      {card.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mt-1 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                  <button
                    className="mt-4 self-end bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-3 py-1 rounded-lg flex items-center text-sm md:text-base"
                    onClick={() => handleViewClick(card)}
                  >
                    View <MdRemoveRedEye className="ml-1 h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredCards.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredCards.length}
                itemsPerPage={cardsPerPage}
                onPageChange={paginate}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        {userRole === "student" && <Footer />}
      </div>
    </div>
  );
}