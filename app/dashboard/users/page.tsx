import React from 'react'
import UserTable from '@/components/AdminUserTable'
function users() {
  return (
    <div>
        <UserTable />
        {/* <div className='flex justify-start items-center mb-4'>
            <input 
            placeholder="Search users by Email..."
            className="border-2 border-pink-800 rounded-l-md max-w-[250px] md:min-w-[400px] p-3 outline-none "                
            type="text"  />
            <button className='px-4 py-3 border-2 rounded-r-md border-pink-800 bg-pink-800 '>Search</button>
        </div>
         <div className='flex justify-start items-center mb-4'>
            <button className='px-4 py-3 border-2 rounded-r-md border-pink-800 bg-pink-800 '>Search</button>
        </div> */}
    </div>
  )
}

export default users