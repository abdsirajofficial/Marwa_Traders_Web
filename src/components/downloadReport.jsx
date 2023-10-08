import React, { useEffect, useRef, useState } from "react";
import { format, parse } from "date-fns";
import toast from "react-hot-toast";
import { getPoductDetails, getReportPdf } from "../server/app";
import { ArrowBigLeftDash, XCircle } from "lucide-react";
import { PDFExport } from "@progress/kendo-react-pdf";
import logoImage from "../assets/logo.svg";

// Create a ProductDetails component
const ProductDetails = ({ invoiceNumber }) => {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    getPoductDetails(
      `reports/products?invoiceNumber=${invoiceNumber}`,
      setProductData
    );
  }, [invoiceNumber]);

  if (!productData || productData.length === 0) {
    // Handle the case where productData is undefined or empty
    return <p>No data available</p>;
  }

  const firstProduct = productData[0]; // Take the first product as a reference
  const commonValues = {
    name: firstProduct.name,
    area: firstProduct.area,
    invoiceNumber: firstProduct.invoiceNumber,
    gst: firstProduct.gst,
    spl: firstProduct.spl,
    date: firstProduct.date,
    paymentMethod: firstProduct.paymentMethod,
  };

  return (
    <div>
      {commonValues.spl > 0
        ? (
            parseFloat(
              productData.reduce((acc, item) => {
                return (
                  acc + item.quantity * item.mrp * (1 - item.discount / 100)
                );
              }, 0)
            ) +
            parseFloat(
              productData.reduce((acc, item) => {
                return (
                  acc + item.quantity * item.mrp * (1 - item.discount / 100)
                );
              }, 0)
            ) *
              (commonValues.gst / 100)
          ).toFixed(2) -
          (
            productData.reduce((acc, item) => {
              return acc + item.quantity * item.mrp * (1 - item.discount / 100);
            }, 0) *
            (commonValues.spl / 100)
          ).toFixed(2)
        : (
            parseFloat(
              productData.reduce((acc, item) => {
                return (
                  acc + item.quantity * item.mrp * (1 - item.discount / 100)
                );
              }, 0)
            ) +
            parseFloat(
              productData.reduce((acc, item) => {
                return (
                  acc + item.quantity * item.mrp * (1 - item.discount / 100)
                );
              }, 0)
            ) *
              (commonValues.gst / 100)
          ).toFixed(2)}
    </div>
  );
};

function DownloadReports({ setdownloadReport }) {
  const pdfExportComponent = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [StartDateSelected, setStartDateSelected] = useState(null);
  const [EndDateSelected, setEndDateSelected] = useState(null);
  const [data, setdata] = useState([]);

  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    setStartDate(
      newStartDate ? parse(newStartDate, "yyyy-MM-dd", new Date()) : null
    );
  };

  const handleEndDateChange = (event) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate ? parse(newEndDate, "yyyy-MM-dd", new Date()) : null);
  };

  const handlePrintData = () => {
    if (startDate && endDate) {
      const start = format(startDate, "dd-MM-yyyy");
      setStartDateSelected(start);
      const end = format(endDate, "dd-MM-yyyy");
      setEndDateSelected(end);
      getReportPdf(`reports/pdf?startDate=${start}&endDate=${end}`, setdata);
    } else {
      toast.error("Please select both start and end dates.");
    }
  };

  const customFileName = `Report_${StartDateSelected}_to_${EndDateSelected}.pdf`;

  return (
    <div className=" w-full h-full fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm px-10 pt-10">
      <div className=" bg-white p-5  space-y-4 rounded-lg">
        <div className=" flex justify-between">
          <h1 className=" font-medium ">Download the reports</h1>
        </div>
        <div className=" flex justify-between items-between">
          <button
            className="flex items-center cursor-pointer p-2 border-2 gap-2 rounded-md bg-white border-gray-300 hover:border-blue-500"
            onClick={() => setdownloadReport(false)}
          >
            <p>
              <ArrowBigLeftDash />
            </p>
            Back
          </button>
          <div className=" flex  space-x-2">
            <div className=" flex justify-center items-center space-x-5">
              <label>Start Date:</label>
              <input
                type="date"
                className="rounded border-2 p-2"
                onChange={handleStartDateChange}
              />
            </div>
            <div className="  flex justify-center items-center space-x-5">
              <label>End Date:</label>
              <input
                type="date"
                className="rounded border-2 p-2"
                onChange={handleEndDateChange}
              />
            </div>
            <div className=" space-x-3">
              <button
                onClick={handlePrintData}
                className=" text-white  bg-[#2b83fd] hover:bg-[#4a83d3] px-4 py-2 rounded-md"
              >
                Search
              </button>
              <button
                onClick={() => {
                  pdfExportComponent.current.save(customFileName);
                }}
                className=" text-white  bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
              >
                Export
              </button>
            </div>
          </div>
        </div>
        <PDFExport
          scale={0.5}
          paperSize="A4"
          margin="1cm"
          ref={pdfExportComponent}
          fileName={customFileName}
        >
          <div className=" flex space-x-3 p-4 text-left border">
            <div className=" flex items-center ">
              <img src={logoImage} alt="" className=" w-16" />
            </div>
            <div>
              <h2 className="text-base font-medium">Marwa Traders</h2>
              <p className="mb-2 text-sm">
                No. 44/A, Mambalapattu Road, Villupuram
              </p>
              <p className="text-sm">
                Reports from {StartDateSelected} to {EndDateSelected}{" "}
              </p>
            </div>
          </div>
          <div>
            <div className="w-full h-auto bg-gray-100 shadow-sm grid grid-cols-9 grid-rows-1 text-center rounded py-3 my-3 font-semibold text-[13px]">
              <p>S.No</p>
              <p>Date</p>
              <p>Inv.No</p>
              <p>Name</p>
              <p>Total Items</p>
              <p>Mod</p>
              <p>Spl desc(-)</p>
              <p>GST</p>
              <p>Total Amt</p>
            </div>
            <div>
              {data.length > 0 ? (
              data.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-9 space-x-2 w-full h-auto text-center text-[13px] bg-white shadow-sm border-b py-3 hover:bg-zinc-50"
                  onClick={() => handleViewBill(item.invoiceNumber)}
                >
                  <p>{index + 1}</p>
                  <p>{item.firstProduct.date}</p>
                  <p>{item.invoiceNumber}</p>
                  <p>{item.firstProduct.name}</p>
                  <p>{item._count}</p>
                  <p>{item.firstProduct.paymentMethod}</p>
                  <p>{item.firstProduct.spl}</p>
                  <p>{item.firstProduct.gst}</p>
                  <p>
                    <ProductDetails invoiceNumber={item.invoiceNumber} />
                  </p>
                </div>
              ))):(<div className="text-center text-red-500">No records. Please select Start date and End date</div>)}
            </div>
          </div>
        </PDFExport>
      </div>
    </div>
  );
}

export default DownloadReports;
