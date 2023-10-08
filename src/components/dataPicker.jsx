import React, { useState } from 'react';
import { format, parse } from 'date-fns';
import toast from 'react-hot-toast';
import { getReportByDate } from '../server/app';

function DateRangePicker( {setdata, settotal, settotalItem, currentPage}) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [StartDateSelected, setStartDateSelected] = useState(null)
  const [EndDateSelected, setEndDateSelected] = useState(null)

  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate ? parse(newStartDate, 'yyyy-MM-dd', new Date()) : null);
  };

  const handleEndDateChange = (event) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate ? parse(newEndDate, 'yyyy-MM-dd', new Date()) : null);
  };

  const handlePrintData = () => {

    if (startDate && endDate) {
      const start = format(startDate, 'dd-MM-yyyy');
      // setStartDateSelected(start);
      // setstartDate(start);
      // console.log(start)
      const end = format(endDate, 'dd-MM-yyyy');
      // setEndDateSelected(end);
      // setendDate(end);
      // console.log(end)
      getReportByDate(`reports/by?page=${currentPage}&maxResult=9&startDate=${start}&endDate=${end}`, setdata, settotal, settotalItem);
    } else {
      toast.error('Please select both start and end dates.');
    }

  };

  return (
    <div className='flex space-x-0 lg:space-x-3 px-1'>
      <div className=" lg:flex  space-x-0 lg:space-x-3 items-center ">
        <label >Start Date:</label>
        <input type="date" className='rounded border-2 p-2' onChange={handleStartDateChange}/>
      </div>
      <div className=" lg:flex  space-x-0 lg:space-x-3 items-center">
        <label>End Date:</label>
        <input type="date" className='rounded border-2 p-2' onChange={handleEndDateChange} />
      </div>
      <button onClick={handlePrintData} className=' text-white bg-[#2b83fd] hover:bg-[#4a83d3] px-4 py-2 rounded-md'>Search</button>
    </div>
  );
}

export default DateRangePicker;
