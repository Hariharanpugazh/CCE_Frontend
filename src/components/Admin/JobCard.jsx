import { FiBookmark, FiCircle, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function timeAgo(dateString) {
    const givenDate = new Date(dateString);
    const now = new Date();

    const secondsDiff = Math.floor((now - givenDate) / 1000);

    const years = Math.floor(secondsDiff / 31536000);
    if (years >= 1) {
        return years + (years === 1 ? " year ago" : " years ago");
    }

    const months = Math.floor(secondsDiff / 2592000);
    if (months >= 1) {
        return months + (months === 1 ? " month ago" : " months ago");
    }

    const days = Math.floor(secondsDiff / 86400);
    if (days >= 1) {
        return days + (days === 1 ? " day ago" : " days ago");
    }

    const hours = Math.floor(secondsDiff / 3600);
    if (hours >= 1) {
        return hours + (hours === 1 ? " hour ago" : " hours ago");
    }

    const minutes = Math.floor(secondsDiff / 60);
    if (minutes >= 1) {
        return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    }

    return "Just now";
}

export default function JobCard({ job }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        console.log(job)

        if (job._id) {
            navigate(`/job-preview/${job._id}`);
        } else {
            console.error("ObjectId is missing in the job:", job);
        }
    };

    const handleApplyClick = (event) => {
        event.stopPropagation();
        window.open(job.job_link, "_blank", "noopener noreferrer");
    };

    return (
        <div
            className="flex flex-col p-3 border border-gray-200 rounded-lg justify-between cursor-pointer bg-[#FAF9F6]"
            onClick={handleCardClick}
        >
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-2xl">{job.title}</p>
                    <div className="flex items-center space-x-3 text-sm">
                        <p className="text-[#8C8C8C] flex items-center">
                            <i className="bi bi-building w-[15px] mr-[5px]"></i> {job.company_name}
                        </p>
                        <FiCircle style={{ width: "4px", height: "4px", backgroundColor: "#8C8C8C", borderRadius: "50%" }} />
                        <p className="text-[#8C8C8C] flex items-center">
                            <FiMapPin style={{ width: "15px", marginRight: "5px" }} /> {job.job_location}
                        </p>
                    </div>
                </div>
                <FiBookmark className="text-2xl cursor-pointer mt-2" />
            </div>

            <p className="w-[95%] text-xs my-4">
                {job.job_description}
            </p>

            <div className="w-[85%] flex flex-wrap space-x-3">
                {typeof (job.skills_required ?? job.required_skills) === "string"
                    ? <p className="p-1 bg-gray-100 text-xs rounded px-2">{job.skills_required ?? job.required_skills}</p>
                    : (job.skills_required ?? job.required_skills).map((skill, key) => (
                        <p key={key} className="p-1 bg-gray-100 text-xs rounded px-2">{skill}</p>
                    ))}
            </div>

            <div className="flex text-[#8C8C8C] items-center space-x-2 mt-2">
                <p className="text-xs">{timeAgo(job.updated_at)}</p>
                <FiCircle style={{ width: "4px", height: "4px", backgroundColor: "#8C8C8C", borderRadius: "50%" }} />
                <p
                    className="underline text-xs truncate w-[65%] leading-none cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(job.company_website, "_blank", "noopener noreferrer");
                    }}
                >
                    {job.company_website}
                </p>
            </div>

            <div className="flex justify-between items-center mt-5">
                <p className="text-[#FFC800] text-xl">{job.salary_range}/-</p>
                <button
                    className="bg-[#FFC800] p-2 rounded text-xs cursor-pointer"
                    onClick={handleApplyClick}
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
}
