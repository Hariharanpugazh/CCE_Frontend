import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const borderColor = "border-gray-300";

export default function Filters({args}) {
    return (
        <div className={`flex flex-col w-[20%] space-y-5 ${args.searchPhrase.length > 0 ? "pointer-events-none opacity-75" : ""}`}>
            <div className={`border ${borderColor} rounded-lg flex-1`}>
                <span className={`flex justify-between p-3 items-center border-b ${borderColor}`}>
                    <p> Filter Options </p>
                    <button className="text-rose-500 text-xs" onClick={args.clearFilters}> Clear all filters </button>
                </span>

                {/* salary filter */}
                <div className={`flex flex-col p-3 pb-2 items-center border-b ${borderColor}`}>
                    <span className="flex justify-between items-center w-full">
                        <p className="text-sm"> Salary range </p>
                        <button className="cursor-pointer" onClick={() => args.setIsSalaryOpen(prevDropDown => !prevDropDown)}>
                            {args.isSalaryOpen ? <FaCaretUp /> : <FaCaretDown />}
                        </button>
                    </span>

                    <div className={`${args.isSalaryOpen ? "flex flex-col w-[90%] pb-4" : "hidden"}`}>
                        {/* salary range values */}
                        <span className="flex mt-4 justify-evenly mb-3 space-x-2 items-center">
                            <button
                                className={`p-1 px-2 border rounded text-xs outline-2 w-full ${args.salaryRangeIndex === 0 ? "outline-gray-400" : "outline-transparent"}`}
                                onClick={() => args.setSalaryRangeIndex(0)}
                            >
                                ₹ {args.filters.salaryRange.min.toLocaleString("en-IN")}
                            </button>
                            <p> - </p>
                            <button
                                className={`p-1 px-2 border rounded text-xs outline-2 w-full ${args.salaryRangeIndex === 1 ? "outline-gray-400" : "outline-transparent"}`}
                                onClick={() => args.setSalaryRangeIndex(1)}
                            >
                                ₹ {args.filters.salaryRange.max.toLocaleString("en-IN")}
                            </button>
                        </span>

                        {/* salary range slider */}
                        <input
                            type="range"
                            min={10000}
                            max={1000000}
                            className="h-1 bg-yellow-300 mt-2"
                            id="salary-range"
                            step={1000}
                            value={args.salaryRangeIndex === 0 ? args.filters.salaryRange.min : args.filters.salaryRange.max}
                            onChange={(e) =>
                                args.salaryRangeIndex === 0
                                    ? args.setFilters(prevFilters => ({
                                          ...prevFilters,
                                          salaryRange: { ...prevFilters.salaryRange, min: Number(e.target.value) }
                                      }))
                                    : args.setFilters(prevFilters => ({
                                          ...prevFilters,
                                          salaryRange: { ...prevFilters.salaryRange, max: Number(e.target.value) }
                                      }))
                            }
                        />
                    </div>
                </div>

                {/* experience filter */}
                <div className={`flex flex-col p-3 pb-2 items-center border-b ${borderColor}`}>
                    <span className="flex justify-between items-center w-full">
                        <p className="text-sm"> Experience </p>
                        <button className="cursor-pointer" onClick={() => args.setIsExperienceOpen(prevDropDown => !prevDropDown)}>
                            {args.isExperienceOpen ? <FaCaretUp /> : <FaCaretDown />}
                        </button>
                    </span>

                    <div className={`${args.isExperienceOpen ? "flex flex-col py-2 w-full space-y-1" : "hidden"}`}>
                        {[1, 2, 3, 4, 5].map((year) => (
                            <span className="text-xs flex space-x-1" key={year}>
                                <input
                                    type="checkbox"
                                    className="border-yellow-300"
                                    checked={args.filters.experience.value === year}
                                    onChange={() =>
                                        args.setFilters(prevFilters => ({
                                            ...prevFilters,
                                            experience: prevFilters.experience.value === year ? { value: 0, category: "" } : { value: year, category: year === 5 ? "above" : "under" }
                                        }))
                                    }
                                />
                                <p> {year === 5 ? "More than 5 Years" : `Under ${year} Year${year > 1 ? "s" : ""}`} </p>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Employment type */}
                <div className={`flex flex-col p-3 pb-2 items-center border-b ${borderColor}`}>
                    <span className="flex justify-between items-center w-full">
                        <p className="text-sm"> Employment Type </p>
                        <button className="cursor-pointer" onClick={() => args.setIsEmployTypeOpen(prevDropDown => !prevDropDown)}>
                            {args.isEmployTypeOpen ? <FaCaretUp /> : <FaCaretDown />}
                        </button>
                    </span>

                    <div className={`${args.isEmployTypeOpen ? "flex flex-col py-2 w-full space-y-1" : "hidden"}`}>
                        {["onSite", "remote", "hybrid"].map((type) => (
                            <span className="text-xs flex space-x-1" key={type}>
                                <input
                                    type="checkbox"
                                    className="border-yellow-300"
                                    checked={args.filters.employmentType[type]}
                                    onChange={() =>
                                        args.setFilters(prevFilters => ({
                                            ...prevFilters,
                                            employmentType: { ...prevFilters.employmentType, [type]: !prevFilters.employmentType[type] }
                                        }))
                                    }
                                />
                                <p> {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, " $1")} </p>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Working mode */}
                <div className={`flex flex-col p-3 pb-2 items-center border-b ${borderColor}`}>
                    <span className="flex justify-between items-center w-full">
                        <p className="text-sm"> Working Mode </p>
                        <button className="cursor-pointer" onClick={() => args.setIsWorkModeOpen(prevDropDown => !prevDropDown)}>
                            {args.isWorkModeOpen ? <FaCaretUp /> : <FaCaretDown />}
                        </button>
                    </span>

                    <div className={`${args.isWorkModeOpen ? "flex flex-col py-2 w-full space-y-1" : "hidden"}`}>
                        {["online", "offline", "hybrid"].map((mode) => (
                            <span className="text-xs flex space-x-1" key={mode}>
                                <input
                                    type="checkbox"
                                    className="border-yellow-300"
                                    checked={args.filters.workingMode[mode]}
                                    onChange={() =>
                                        args.setFilters(prevFilters => ({
                                            ...prevFilters,
                                            workingMode: { ...prevFilters.workingMode, [mode]: !prevFilters.workingMode[mode] }
                                        }))
                                    }
                                />
                                <p> {mode.charAt(0).toUpperCase() + mode.slice(1)} </p>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sort by */}
            <div className={`border ${borderColor} rounded-lg flex-1 mb-8`}>
                <span className={`flex justify-between p-3 items-center border-b ${borderColor}`}>
                    <p> Sort Options </p>
                    <button className="text-rose-500 text-xs"> Clear all filters </button>
                </span>
                <div className="p-3">
                    <button
                        className={`text-sm px-3 p-2 border w-full ${borderColor} rounded flex justify-between items-center`}
                        onClick={() => args.setIsSortOpen(prevDropDown => !prevDropDown)}
                    >
                        <p> Sort by {args.filters.sortBy} </p>
                        {args.isSortOpen ? <FaCaretUp /> : <FaCaretDown />}
                    </button>
                </div>
            </div>
        </div>
    );
}
