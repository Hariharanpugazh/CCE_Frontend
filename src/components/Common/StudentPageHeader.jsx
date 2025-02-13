/* eslint-disable react/prop-types */
import { FiSearch } from "react-icons/fi";
import { Departments } from "../../utils/constants";


export default function PageHeader({ page, filter, setFilter, searchPhrase, setSearchPhrase }) {
  return (
    <header className="flex flex-col items-center justify-center py-14 container self-center">
      <p className="text-6xl tracking-[0.8px]">
        {
          page.displayName
        }
      </p>
      <p className="text-lg mt-2 text-center">
        Explore all the{" "}
        {page.displayName} opportunities
        in all the existing fields <br />around the globe.
      </p>

      <div className="relative flex items-stretch w-[70%]">
        <input type="text" value={searchPhrase} onChange={(e) => setSearchPhrase(e.target.value)} placeholder={`Search ${page.displayName}`} className="w-full text-lg my-5 p-2 px-5 rounded-full bg-gray-100 border-transparent border-2 hover:bg-white hover:border-blue-200 outline-blue-400" />
        <div className="absolute right-2 h-full flex items-center">
          <FiSearch className="bi bi-search bg-blue-400 rounded-full text-white" style={{color: "white", width: "35", height: "35", padding: "8px"}}/> 
        </div>
      </div>

      <div className="flex space-x-2 flex-wrap w-[50%] justify-center">
        {["All", ...Object.values(Departments)].map((department, key) => (
          <p
            key={key}
            className={`${filter === department
              ? "bg-[#000000] text-white"
              : ""
              } border-gray-700 border-[1px] py-1 px-[10px] rounded-full text-xs my-1 cursor-pointer`}
            onClick={() => setFilter(department)}
          >
            {department}
          </p>
        ))}
      </div>
    </header>
  );
}
