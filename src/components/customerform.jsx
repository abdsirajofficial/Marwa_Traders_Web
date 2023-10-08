import React from 'react'

export const CustomerForm = ( {setCustomerform} ) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex flex-col justify-center items-center'>
      <div className=" flex justify-center items-center">
        <div className="py-10 px-10 flex flex-col justify-start w-[450px] bg-white space-y-5 rounded-2xl shadow-lg">
          <h1 className=" text-center font-medium">ADD CUSTOMER</h1>
          <div className=" flex justify-between items-center">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="rounded border-2 p-3"
              placeholder="Name"
            />
          </div>
          <div className=" flex justify-between items-center space-x-5">
            <label htmlFor="description">Address:</label>
            <textarea
              className="rounded border-2  w-[210px] p-2"
              placeholder="address"
            />
          </div>
          <div className="flex justify-end space-x-5">
            <button className="bg-red-400 text-white py-2 px-4 rounded" onClick={()=>setCustomerform(false)}>
              Cancel
            </button>
            <button className="bg-blue-500 text-white py-2 px-6 rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
