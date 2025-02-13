import React from 'react';

function StudentPageSearchBar({ context }) {

    return (
        <div className='flex items-stretch border-[1px] border-[#8C8C8C99] rounded-lg'>
            {/* searchbar */}
            <div className='flex-1 relative'>
                <i className="bi bi-search absolute text-sm p-2 h-full"></i>

                <input type="text" className='flex-1 p-2 px-8 outline-none' />
            </div>

            {/* filters */}
            <div>
                {
                    
                }
            </div>
        </div>
    );
}

export default StudentPageSearchBar;