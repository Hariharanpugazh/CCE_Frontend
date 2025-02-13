import { FiBookmark, FiX } from 'react-icons/fi';
import experienceIcon from '../../assets/icons/experience-icon.svg'
import jobRoleIcon from '../../assets/icons/job-role-icon.svg'
import locationIcon from '../../assets/icons/location-icon.svg'
import timeIcon from '../../assets/icons/time-icon.svg'
import Cookies from "js-cookie"
import axios from "axios"
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const borderColor = "border-gray-300";

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000); // Time difference in seconds

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second'); // Less than a minute ago
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return rtf.format(-diffInMinutes, 'minute'); // Less than an hour ago
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return rtf.format(-diffInHours, 'hour'); // Less than a day ago
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return rtf.format(-diffInDays, 'day'); // Less than a month ago
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return rtf.format(-diffInMonths, 'month'); // Less than a year ago
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(-diffInYears, 'year'); // More than a year ago
}

// {
//     "title": "Software Engineer Intern",
//     "company_name": "Flexi Analyst",
//     "location": "Bangalore (Cross-border opportunity)",
//     "duration": "5 months",
//     "stipend": "INR 10,000 per month",
//     "application_deadline": "2025-02-07",
//     "required_skills": [
//         "Python",
//         "JavaScript",
//         "SQL",
//         "Testing"
//     ],
//     "education_requirements": "BE or B.Tech",
//     "job_description": "Flexi Analyst is a part of the Champ Team of Business-Quality-Data & Content Analysts, focused on helping businesses build their community for Acquisition, Retention, and Engagement. The Leadership team has backgrounds in Accenture, Amazon, Flipkart, Apple, and Inmobi, and is working towards creating the world's largest community of Analysts. The company prioritizes adding value to customers above all else.",
//     "company_website": "https://in.linkedin.com/company/flexianalystpvtltd?trk=public_jobs_topcard-org-name",
//     "job_link": "https://www.linkedin.com/signup/cold-join?source=jobs_registration&session_redirect=https%3A%2F%2Fin.linkedin.com%2Fjobs%2Fview%2Fsoftware-engineer-intern-at-flexi-analyst-4116289967&trk=public_jobs_save-job",
//     "internship_type": "Full-time",
//     "id": "67a5ddb014e043652e79b633",
//     "type": "internship"
// }


export default function SidePreview({ selectedItem, handleViewItem, setSelectedItem, isSaved, fetchSavedJobs }) {
    useEffect(() => {
        console.log({ selectedItem, happy: "happy" })
        console.log(selectedItem?.updated_at);
    }, [selectedItem])

    const handleBookmark = async (event) => {
        event.stopPropagation();

        try {
            const token = Cookies.get("jwt");
            const userId = JSON.parse(atob(token.split(".")[1])).student_user;
            if (selectedItem.job_data) {
                const res = await axios.post(
                    `http://localhost:8000/api/save-job/${selectedItem._id}/`,
                    { applicationId: selectedItem._id, userId }
                );
                if (res.status === 200) {
                    toast.success("Item Bookmarked")
                    fetchSavedJobs()
                }
            } else {
                const res = await axios.post(
                    `http://localhost:8000/api/save-internship/${selectedItem.id}/`,
                    { applicationId: selectedItem.id, userId }
                );
                if (res.status === 200) {
                    toast.success("Item Bookmarked")
                    fetchSavedJobs()

                }
            }
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    const handleUnbookmark = async (event) => {
        event.stopPropagation();
        try {
            const token = Cookies.get("jwt");
            const userId = JSON.parse(atob(token.split(".")[1])).student_user;
            if (selectedItem.job_data) {
                const res = await axios.post(
                    `http://localhost:8000/api/unsave-job/${selectedItem._id}/`,
                    { applicationId: selectedItem._id, userId }
                );
                if (res.status === 200) {
                    fetchSavedJobs()
                    toast.warn("Item unbookmarked")
                }
            } else {
                const res = await axios.post(
                    `http://localhost:8000/api/unsave-internship/${selectedItem.id}/`,
                    { applicationId: selectedItem.id, userId }
                );
                if (res.status === 200) {
                    fetchSavedJobs()
                    toast.warn("Item unbookmarked")
                }
            }
        } catch (error) {
            console.error("Error unsaving job:", error);
        }
    };

    const dataFields = {
        itemTitle: selectedItem?.job_data ? selectedItem?.job_data.title : selectedItem?.title,
        company_name: selectedItem?.job_data ? selectedItem?.job_data.company_name : selectedItem?.company_name,
        generalDetails: [
            {
                title: "Job Location",
                value: selectedItem?.job_data?.job_location || selectedItem?.location,
                icon: locationIcon
            },
            {
                title: "Job Role",
                value: selectedItem?.job_data?.work_type,
                icon: jobRoleIcon
            },
            {
                title: "Job Type",
                value: selectedItem?.job_data?.selectedWorkType || selectedItem?.internship_type,
                icon: timeIcon
            },
            {
                title: "Experience",
                value: selectedItem?.job_data?.experience_level,
                icon: experienceIcon
            },
            {
                title: "Duration",
                value: selectedItem?.job_data?.duration || selectedItem?.duration,
                icon: timeIcon
            }
        ],
        updated_at: selectedItem?.updated_at,
        company_website: selectedItem?.job_data ? selectedItem.job_data.company_website : selectedItem?.company_website,
        description: selectedItem?.job_data ? selectedItem?.job_data.job_description : selectedItem?.job_description,
        application_description: selectedItem?.job_data ? selectedItem?.job_data.application_instructions : undefined,
        education_requirements: selectedItem?.job_data ? selectedItem?.job_data.education_requirements : selectedItem?.education_requirements,
        application_deadline: selectedItem?.job_data ? selectedItem?.job_data.application_deadline : selectedItem?.application_deadline
    }

    return (
        <div className={`relative overflow-hidden ${!selectedItem ? "w-[0px]" : "w-[20%]"}`}>
            <div className={`flex flex-col border ${borderColor} rounded-lg mb-8 ${!selectedItem ? "absolute translate-x-[100vw]" : ""}`}>
                <span className={`flex justify-between p-3 items-center border-b ${borderColor}`}>
                    <p> Job Preview </p>
                    <button className="cursor-pointer" onClick={() => setSelectedItem(undefined)}>
                        <FiX />
                    </button>
                </span>

                {/* general details */}
                <div className="flex flex-col">
                    {/* title */}
                    <div className="flex justify-between items-start p-3 px-5">
                        <div className='w-[85%] break-words'>
                            <p className="text-xl"> {dataFields.itemTitle} </p>
                            <p className="text-xs text-yellow-300"> {dataFields.company_name} </p>
                        </div>

                        {isSaved !== undefined && <FiBookmark className={`text-2xl cursor-pointer ${isSaved && "text-blue-500 fill-current"}`} onClick={isSaved ? handleUnbookmark : handleBookmark} />}
                    </div>

                    {/* details */}
                    <div className="grid grid-cols-2 justify-stretch p-3 px-5 gap-3">
                        {
                            dataFields.generalDetails.map((category, key) => category.value && (
                                <div className="flex items-start text-xs" key={key}>
                                    <img src={category.icon} alt="" className="w-4" />
                                    <div className="ml-2">
                                        <p className="font-semibold"> {category.title} </p>
                                        <p className="text-[10px] text-gray-500"> {category.value} </p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <span className="flex space-x-3 text-xs text-gray-400 items-center px-6 pt-2">
                        <p> Posted {selectedItem && getTimeAgo(dataFields.updated_at)} </p>
                    </span>

                    <div className="flex space-x-2 my-5 text-xs px-5">
                        <a
                            href={
                                dataFields?.company_website?.startsWith("http")
                                    ? dataFields?.company_website
                                    : `https://${dataFields?.company_website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded px-3 p-1 flex-1 bg-yellow-400 cursor-pointer text-center"
                        >
                            Apply Now
                        </a>
                        <button className="rounded px-3 p-1 flex-1 bg-gray-300 cursor-pointer" onClick={handleViewItem}>
                            View Details
                        </button>
                    </div>
                </div>

                {/* more details */}
                <div className="px-3">
                    <div className={`border-t ${borderColor}`}>
                        <div className="flex flex-col my-4 px-2">
                            <p className="font-semibold"> Description </p>
                            <p className="text-xs"> {dataFields.description} </p>
                        </div>

                        {
                            dataFields.application_instructions && <div className="flex flex-col my-4 px-2">
                                <p className="font-semibold mb-2"> Application Instructions </p>
                                <ul className="pl-2 space-y-3">
                                    {
                                        dataFields.application_instructions?.split(".").map((phrase, index) => {
                                            return phrase.length > 0 && <li key={index} className="text-xs flex items-center"> - <p className="pl-2"> {phrase} </p> </li>;
                                        })
                                    }
                                </ul>
                            </div>
                        }

                        <div className="flex flex-col my-4 px-2">
                            <p className="font-semibold"> Education Requirements </p>
                            <p className="text-xs"> {dataFields.education_requirements} </p>
                        </div>
                    </div>
                </div>

                <button className="border border-rose-700 text-rose-700 p-2 rounded text-sm my-4 mx-3">
                    Deadline - {selectedItem && new Date(dataFields.application_deadline).toLocaleDateString('en-GB')}
                </button>
            </div>
        </div>
    );
}