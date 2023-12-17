import React, { useEffect, useState } from "react";
import DateRangePicker from "../../components/dataPicker";
import { ArrowBigLeftDash, ArrowDownToLine } from "lucide-react";
import Pagination from "../../components/pagination";
import { getPoductDetails, getReport, getReportByName } from "../../server/app";
import { ViewBill } from "./ViewBill";
import DownloadReports from "../../components/downloadReport";

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
                  acc + item.quantity * item.netRate * (1 - item.discount / 100)
                );
              }, 0)
            ) +
            parseFloat(
              productData.reduce((acc, item) => {
                return (
                  acc + item.quantity * item.netRate * (1 - item.discount / 100)
                );
              }, 0)
            ) *
              (commonValues.gst / 100)
          ).toFixed(2) -
          (
            productData.reduce((acc, item) => {
              return acc + item.quantity * item.netRate * (1 - item.discount / 100);
            }, 0) *
            (commonValues.spl / 100)
          ).toFixed(2)
        : (
            parseFloat(
              productData.reduce((acc, item) => {
                return (
                  acc + item.quantity * item.netRate * (1 - item.discount / 100)
                );
              }, 0)
            ) +
            parseFloat(
              productData.reduce((acc, item) => {
                return (
                  acc + item.quantity * item.netRate * (1 - item.discount / 100)
                );
              }, 0)
            ) *
              (commonValues.gst / 100)
          ).toFixed(2)}
    </div>
  );
};

export const Report = () => {
  const [totalItem, settotalItem] = useState([]);
  const [total, settotal] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);
  const [data, setdata] = useState([]);
  const [searchByName, setsearchByName] = useState("");
  const [ViewBillShow, setViewBillShow] = useState(false);
  const [ViewBillData, setViewBillData] = useState([]);
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [downloadReport, setdownloadReport] = useState(false);

  useEffect(() => {
    getReport(
      `reports/?page=${currentPage}&maxResult=9`,
      setdata,
      settotal,
      settotalItem
    );
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setcurrentPage(pageNumber);
    getReport(
      `reports/?page=${pageNumber}&maxResult=9`,
      setdata,
      settotal,
      settotalItem
    );
  };

  const handleSearch = (text) => {
    setsearchByName(text);
    getReportByName(
      `reports/byName?page=${currentPage}&maxResult=9&name=${text}`,
      setdata,
      settotal,
      settotalItem
    );
  };

  const handleViewBill = (invoiceNumber) => {
    getPoductDetails(
      `reports/products?invoiceNumber=${invoiceNumber}`,
      setViewBillData
    );
    setViewBillShow(true);
  };

  return ViewBillShow ? (
    <ViewBill
      setViewBillShow={setViewBillShow}
      setViewBillData={setViewBillData}
      ViewBillData={ViewBillData}
    />
  ) : (
    <div className="w-full h-full pt-5 px-5">
      <div className="flex justify-between">
        <button
          className="flex items-center cursor-pointer p-2 border-2 gap-2 rounded-md bg-white border-gray-300 hover:border-blue-500"
          onClick={() => navigate("/")}
        >
          <p>
            <ArrowBigLeftDash />
          </p>
          Back
        </button>
        <div className="flex space-x-3">
          <div>
            <input
              type="search"
              className="w-full h-12 rounded border-2 pl-3"
              placeholder="Search The report"
              value={searchByName}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <DateRangePicker
            setdata={setdata}
            settotal={settotal}
            currentPage={currentPage}
            settotalItem={settotalItem}
          />
          <button
            className="flex items-center gap-x-2 rounded text-white bg-[#2b83fd] hover:bg-[#4a83d3] px-4 py-2"
            onClick={() => setdownloadReport(true)}
          >
            <p>
              <ArrowDownToLine />
            </p>
            PDF
          </button>
        </div>
      </div>
      <div className="w-full h-auto bg-white shadow-sm grid grid-cols-9 grid-rows-1 text-center rounded py-3 my-3 font-semibold text-[13px]">
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
      {data.length > 0 ? (
        data.map((item, index) => {
          return (
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
          );
        })
      ) : (
        <div className="text-center text-red-500">No records Today</div>
      )}
      {downloadReport && (
        <DownloadReports setdownloadReport={setdownloadReport} />
      )}

      <div className="fixed bottom-3 right-0">
        <Pagination
          currentPage={currentPage}
          total={total}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
