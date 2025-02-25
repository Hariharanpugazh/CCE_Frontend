import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MdRemoveRedEye } from "react-icons/md";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import Pagination from "../../components/Admin/pagination"; // Assuming Pagination is in this path
import { LoaderContext } from "../../components/Common/Loader"; // Import Loader Context

export default function StudyMaterial() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('Exam'); // Default to 'Exam'
  const cardsPerPage = 6;
  const { isLoading, setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      setIsLoading(true); // Show loader when fetching data
      try {
        const response = await fetch('https://cce-backend-54k0.onrender.com/api/all-study-material/');
        const data = await response.json();
        setCards(data.study_materials);
        updateCategories(data.study_materials, selectedType);
      } catch (error) {
        console.error('Error fetching study materials:', error);
      } finally {
        setIsLoading(false); // Hide loader after data fetch
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
    return categoryMatch && typeMatch;
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
    setCurrentPage(1); // Reset to the first page when changing types
  };

  useEffect(() => {
    updateCategories(cards, selectedType);
  }, [selectedType, cards]);

  return (
    <div className="w-full h-screen">
      <StudentPageNavbar />
      <div className='px-8'>
        <div className="flex flex-col justify-between py-6">
          <h1 className="text-xl font-semibold">Study Material</h1>
          <div className="flex items-center mt-4">
            <button
              className="h-9.5 w-10 flex items-center justify-center border border-gray-300 rounded-tl-[10px] rounded-bl-[10px]"
              onClick={() => changeType(-1)}
              disabled={false}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm border border-gray-300 p-2 text-center h-9.5">{selectedType} Material</span>
            <button
              className="h-9.5 w-10 flex items-center justify-center border border-gray-300 rounded-tr-[10px] rounded-br-[10px]"
              onClick={() => changeType(1)}
              disabled={false}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-8 flex overflow-x-auto custom-scrollbar space-x-4 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`flex-shrink-0 px-3 py-1  ${
                selectedCategory === category ? 'border-b-[3px] border-yellow-500 text-black font-medium' : 'border-none text-gray-500 font-medium'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 px-10">
          {currentCards.map((card, index) => (
            <div key={index} className="p-3 border border-gray-400 rounded-lg hover:shadow-lg transition-shadow flex  justify-between items-center">
              <div className="mb-2">
                <h3 className="font-medium text-base">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                <div className="mt-2">
                  {card.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block mt-1 text-xs"
                    >
                      {link.topic} ({link.type})
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-3 py-1 flex items-center rounded-lg">
                  View <MdRemoveRedEye className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Component */}
        {filteredCards.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredCards.length}
            itemsPerPage={cardsPerPage}
            onPageChange={paginate}
          />
        )}
      </div>
    </div>
  );
}
