import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({
  isOpen,
  onToggle,
  categories,
  selectedCategory,
  onCategorySelect,
  className = "",
}) => {
  return (
    <div
      className={`bg-white shadow-xl transition-all duration-300 ease-in-out fixed h-full z-10${
        isOpen ? "w-64" : "w-20"
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-100">
          <button
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
            onClick={onToggle}
          >
              <div className="flex items-center space-x-2">
                <span>Tools</span>
              </div>
          </button>
        </div>

        <div className="flex-1 py-6 space-y-1 overflow-y-auto">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => onCategorySelect(name)}
              className={`w-full flex items-center px-4 py-3 transition-all duration-200
                ${
                  selectedCategory === name
                    ? "bg-yellow-50 text-yellow-600 border-r-4 border-yellow-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
                ${!isOpen ? "justify-center" : "justify-start"}
              `}
            >
              <Icon className={`h-5 w-5 ${isOpen ? "mr-3" : ""}`} />
              {isOpen && (
                <span className="font-medium whitespace-nowrap">{name}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 
 
export default Sidebar;
