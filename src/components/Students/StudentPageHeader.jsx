import { Departments } from "../../utils/constants";
export default function StudentPageHeader({page, filter, setFilter}) {
  return (
    <header className="flex flex-col items-center justify-center py-14 container self-center">
      <p className="text-5xl tracking-[0.8px]">
        {
            page.displayName
        }
      </p>
      <p className="text-xs my-2">
        Explore all the{" "}
        {page.displayName} opportunities
        in all the existing fields around the globe.
      </p>
      <div className="flex space-x-2 flex-wrap w-[50%] justify-center">
        {["All", ...Object.values(Departments)].map((department, key) => (
          <p
            key={key}
            className={`${
              filter === department
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