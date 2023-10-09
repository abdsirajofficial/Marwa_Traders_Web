import { ArrowBigLeftDash, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/pagination";
import { deleteApi, getApi } from "../../server/app";
import { toast } from "react-hot-toast";
import loading from "../../assets/loading.svg";

export const ViewProducts = ({
  setViewMode,
  seteditProductIndex,
  data,
  setdata,
}) => {
  const navigate = useNavigate();

  const [total, settotal] = useState();
  const [searchProduct, setsearchProduct] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [delIsLoading, setdelIsLoading] = useState([]);

  useEffect(() => {
    if (data) {
      setdelIsLoading(Array(data.length).fill(false));
    }
  }, [data]);

  useEffect(() => {
    getApi(`product/getProducts?page=1&maxResult=9`, setdata, settotal);
  }, []);

  const editProduct = (index) => {
    seteditProductIndex(index);
    setViewMode("edit");
  };

  const handleSearh = (text) => {
      setsearchProduct(text)
      getApi(`product/getProducts?page=${currentPage}&maxResult=9&productName=${text}`,setdata, settotal);
  };

  const deleteProduct = (id, index) => {
    setdelIsLoading((prevLoading) => {
      const newLoading = [...prevLoading];
      newLoading[index] = true;
      return newLoading;
    });

    deleteApi(`product/deleteProducts/${id}`).then((res) => {
      if (res.status === 200) {
        toast.success("Material deleted successfully!", { duration: 1500 });
        setdelIsLoading((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = false;
          return newLoading;
        });
        getApi(`product/getProducts?page=1&maxResult=9`, setdata, settotal);
      } else {
        toast.error("Something went Wrong", { duration: 1500 });
        setdelIsLoading((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = false;
          return newLoading;
        });
      }
    });
  };

  //#region handle pagination change
  const handlePageChange = (pageNumber) => {
    setcurrentPage(pageNumber);
    getApi(`product/getProducts?maxResult=9&page=${pageNumber}`,setdata,settotal);
  };

  return (
    <div className="pt-5 px-5 ">

      <div className=" flex justify-between">
        <button
          className="flex items-center cursor-pointer p-2 border-2 gap-2 rounded-md bg-white border-gray-300 hover:border-blue-500 text-[14px]"
          onClick={() => navigate("/")}
        >
          <p>
            <ArrowBigLeftDash />
          </p>
          Back
        </button>
        <div className="flex items-center gap-x-4">
          <input
            type="search"
            className="w-full h-12 rounded border-2 pl-3"
            placeholder="Search"
            onChange={(e) => handleSearh(e.target.value)}
          />
          <button
            className="flex items-center gap-x-2 rounded text-white bg-[#2b83fd] hover:bg-[#4a83d3] px-4 py-2 text-[14px]"
            onClick={() => setViewMode("add")}
          >
            <Plus />
            <h1 className="">Product</h1>
          </button>
        </div>
      </div>

      <div className="w-full h-auto bg-white shadow-sm grid grid-cols-8 grid-rows-1 text-center rounded py-3 mt-3 font-semibold text-[13px] ">
        <p className="w-full col-span-2">Name</p>
        <p>Quantity</p>
        <p>UPVC/CPVC</p>
        <p>Mrp Rate</p>
        <p>Dis (-)</p>
        <p>Net Rate</p>
        <p>Action</p>
      </div>

      <div className=" mt-5">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-8 space-x-2 text-center w-full text-[13px] bg-white shadow-sm  border-b py-3 hover:bg-zinc-50"
            >
              <p className="w-full col-span-2 ">
                {item.productName}
              </p>
              <p className=" flex justify-center items-center">{item.quantity}</p>
              <p className=" flex justify-center items-center">{item.category}</p>
              <p className=" flex justify-center items-center">{item.mrp}</p>
              <p className=" flex justify-center items-center">{item.discount}%</p>
              <p className=" flex justify-center items-center">{item.netRate.toFixed(2)}</p>
              <div className=" flex space-x-3 justify-center items-center">
                <Pencil
                  className=" cursor-pointer hover:text-blue-700 text-[5px] "
                  onClick={() => editProduct(index)}
                />
                {delIsLoading[index] === true ? (
                  <img src={loading} alt="" className=" w-4 h-4 animate-spin" />
                ) : (
                  <Trash2
                    className=" cursor-pointer hover:text-red-700"
                    onClick={() => deleteProduct(item.id, index)}
                  />
                )}
              </div>
            </div>
          ))):(
            <p className="flex justify-center items-center w-full h-full">
            No data found
          </p>
          )}
      </div>

      <div className=" fixed bottom-3 right-0">
        <Pagination
          currentPage={currentPage}
          total={total}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
