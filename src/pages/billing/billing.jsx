import {
  ArrowBigLeftDash,
  Coins,
  CreditCard,
  Plus,
  Smartphone,
  XCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getApi, getProductBySearch} from "../../server/app";

export const Billing = ({
  setViewMode,
  state,
  setState,
  selectedItems,
  setselectedItems,
}) => {
  const navigate = useNavigate();
  const [qty, setqty] = useState();
  const [disc, setdisc] = useState();
  const [selectforvlaueEnter, setselectforvlaueEnter] = useState([]);
  const [data, setdata] = useState([]);
  const [allItem, setallItem] = useState([]);
  const [total, settotal] = useState();
  const [searchProduct, setsearchProduct] = useState();

  const qtyRef = useRef(null); // Add this ref for quantity input
  const discRef = useRef(null); //

  useEffect(() => {
    getProductBySearch(`product/getProductBySearch`, setallItem);
  },[]);

  const handleInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    // Check if the input field is for spl or gst
    if (name === "spl" || name === "gst") {
      // Use parseFloat to convert the value to a floating-point number
      value = parseFloat(value);
    }

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearh = (text) => {
    setsearchProduct(text);

    if(text){
      getProductBySearch(
        `product/getProductBySearch?&question=${text}`,
        setdata,
      );   
    }
    else{
      setdata([])
    }

  };

  const handlePaymentMode = (mode) => {
    setState((prevState) => ({
      ...prevState,
      paymentMode: mode,
    }));
  };

  const handleBillNext = () => {
    const { name, area, paymentMode } = state;

    if (selectedItems.length === 0) {
      toast.error("Please add the products", { duration: 1500 });
    } else if (name === "" || area === "") {
      toast.error("Please fill customer fields", { duration: 1500 });
    } else if (paymentMode === "") {
      toast.error("Please select the payment mode", { duration: 1500 });
    } else {
      setViewMode("bill");
    }
  };

  const handleSelected = (itemId) => {
    // Find the item with the matching id in the allItem array
    const selectedItem = allItem?.find((item) => item?.id === itemId);

    // Do something with the selected item (e.g., display it in a modal)
    if (selectedItem) {
      // Display the selected item or perform other actions
      setselectforvlaueEnter((prevData) => [...prevData, selectedItem]);
      setdisc();
      setdata([]);
      setsearchProduct("");
      // You can also update state or trigger other UI changes here
    }
  };

  const handleAddSelectedItem = (item) => {
    const quantityVal = item.quantity
    if (qty > 0 && disc >= 0) {
      // Check if the item already exists in selectedItems
      const isDuplicate = selectedItems.some(
        (selectedItem) => selectedItem.id === item.id
      );
  
      if (isDuplicate) {
        // Display an alert or toast message indicating that the item is already selected
        toast.error("This product is already in the selected product.", {
          duration: 1500,
        });
        setqty();
        setdisc();
        setselectforvlaueEnter([]);
      } else {
        // Check if the quantity is greater than or equal to parseInt(qty)
        if (qty <= quantityVal ) {
          // If it's not a duplicate and quantity is valid, add the item to selectedItems
          const updatedItem = { ...item, quantity: parseInt(qty), discount: parseFloat(disc) };
  
          setselectedItems((prevData) => [...prevData, updatedItem]);
          // Clear quantity and discount input fields
          setqty();
          setdisc();
          setselectforvlaueEnter([]);
        } else {
          // Display an error message indicating that the quantity is invalid
          toast.error(`This Product is Out stock ${quantityVal}.`, { duration: 1500 });
          setqty();
          setdisc();
          setselectforvlaueEnter([]);
        }
      }
    } else {
      toast.error("Please enter the quantity and discount", { duration: 1500 });
    }
  };
  

  const handleSelectItem = (index) => {
    // Copy the selectedItems array to a new array
    const updatedSelectedItems = [...selectedItems];

    // Remove the item at the specified index
    updatedSelectedItems.splice(index, 1);

    // Update the state with the modified selectedItems array
    setselectedItems(updatedSelectedItems);
  };

  return (
    <div className=" w-full h-full flex flex-col pt-5 px-5 relative">
      <div className=" flex justify-between">
        <div className=" md:flex space-x-3">
          <button
            className="flex items-center cursor-pointer p-2 border-2 gap-2 rounded-md bg-white border-gray-300 hover:border-blue-500"
            onClick={() => navigate("/")}
          >
            <p>
              <ArrowBigLeftDash />
            </p>
            Back
          </button>
        </div>
        <div className=" md:flex   justify-center items-center gap-x-4 px-3">
          <input
            type="text"
            className="w-full h-12 rounded border-2 pl-3"
            placeholder="Customer Name"
            name="name"
            value={state.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="w-full h-12 rounded border-2 pl-3"
            placeholder="Address"
            name="area"
            value={state.area}
            onChange={handleInputChange}
          />
          <input
            type="search"
            className="w-full h-12 rounded border-2 pl-3"
            placeholder="Search The Product"
            value={searchProduct}
            onChange={(e) => handleSearh(e.target.value)}
          />
        </div>
        <div className=" md:flex space-x-3">
          <button
            className="flex items-center gap-x-2 rounded text-white bg-[#2b83fd] hover:bg-[#4a83d3] px-4 py-2"
            type="submit"
            onClick={() => navigate("/Product")}
          >
            <Plus />
            <h1 className="">Product</h1>
          </button>
        </div>
      </div>

      {/* search data fucntion */}
      <div className=" absolute top-[5rem] w-full left-0">
        {data.map((item, index) => {
          return (
            <div
              className="w-full h-auto bg-red-100 shadow-sm grid grid-cols-7 grid-rows-1 text-center rounded py-3  text-[14px] hover:bg-blue-200 cursor-pointer "
              key={index}
              onClick={() => handleSelected(item.id)}
            >
              <p className=" flex justify-center items-center col-span-2">{item.productName}</p>
              <p className=" flex justify-center items-center">{item.category}</p>
              <p className=" flex justify-center items-center">{item.quantity}</p>
              <p className=" flex justify-center items-center">{item.mrp}</p>
              <p className=" flex justify-center items-center">{item.discount}%</p>
              <p className=" flex justify-center items-center">{item.netRate.toFixed(2)}</p>
            </div>
          );
        })}
      </div>

      {/* enter the value for input box */}
      {selectforvlaueEnter.length > 0 && (
        <div className="absolute top-[5rem] w-full left-0">
          {selectforvlaueEnter.map((item, index) => {
            const total = (qty * item.mrp * (1 - disc / 100)).toFixed(2);
            const formattedTotal = isNaN(total) ? "0.00" : total; // Format total to 2 decimal places or '0.00' if not a number
            return (
              <div
                className="w-full h-auto bg-blue-200 text-center shadow-sm grid grid-cols-8 grid-rows-1 rounded py-3 text-[14px]"
                key={index}
              >
                <p className=" flex justify-center items-center col-span-2">{item.productName}</p>
                <p className=" flex justify-center items-center">{item.category}</p>
                <div className=" flex justify-center items-center">
                  <input
                    type="text"
                    value={qty}
                    className="bg-blue-200 w-8 text-center font-medium"
                    placeholder="Qty"
                    name="Qty"
                    onChange={(e) => setqty(e.target.value)}
                    ref={qtyRef}
                    tabIndex={index * 2 + 1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        discRef.current.focus();
                      }
                    }}
                  />
                </div>
                <p className=" flex justify-center items-center">{item.mrp}</p>
                <div className="flex justify-center items-center">
                  <input
                    type="text"
                    value={disc}
                    className="bg-blue-200 w-8 text-center font-medium"
                    placeholder="Disc"
                    name="Disc"
                    onChange={(e) => setdisc(e.target.value)}
                    ref={discRef}
                    tabIndex={index * 2 + 2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSelectedItem(item);
                      }
                    }}
                  />
                  <p>%</p>
                </div>
                <p className=" flex justify-center items-center">{formattedTotal}</p>
                <p className="flex justify-center items-center text-red-600 cursor-pointer">
                  <XCircle onClick={() => setselectforvlaueEnter([])} />
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className=" w-full h-auto bg-white shadow-sm grid grid-cols-8 grid-rows-1 text-center rounded py-3 my-5 font-semibold text-[14px] ">
        <p>S.No</p>
        <p className=" col-span-2">Product</p>
        <p>Quantity</p>
        <p>Rate</p>
        <p>Disc(-)</p>
        <p>Total</p>
        <p>Action</p>
      </div>

      {/* final selected function */}
      <div className=" w-full grow">
        {selectedItems.map((item, index) => {
          const total = (
            item.quantity *
            item.mrp *
            (1 - item.discount / 100)
          ).toFixed(2);
          return (
            <div className="w-full h-auto bg-white grid grid-cols-8 grid-rows-1 text-center shadow-sm  border-b rounded py-3 text-[14px] ">
              <p className=" flex justify-center items-center">{index + 1}</p>
              <p className=" flex justify-center items-center col-span-2">
                {item.productName}
                {item.category}
              </p>
              <p className=" flex justify-center items-center">{item.quantity}</p>
              <p className=" flex justify-center items-center">{item.mrp}</p>
              <p className=" flex justify-center items-center">{item.discount}%</p>
              {/* <p>{(item.quantity * item.saleRate) - (item.saleRate * (item.discount / 100))}</p> */}
              <p className=" flex justify-center items-center">{total || 0}</p>
              <p className=" flex justify-center items-center text-red-600">
                <XCircle
                  onClick={() => handleSelectItem(index)}
                  className=" cursor-pointer"
                />
              </p>
            </div>
          );
        })}
      </div>

      <div className="w-full grid grid-cols-6 my-5">
        <button
          className={`flex justify-center items-center cursor-pointer px-1 border-2 gap-2 rounded-md ${
            state.paymentMode == "UPI"
              ? "border-2 bg-red-100 border-blue-500 rounded-lg shadow-lg"
              : "bg-white border-gray-300 hover:bg-gray-200"
          }`}
          type="submit"
          onClick={() => handlePaymentMode("UPI")}
        >
          <p>
            <Smartphone />
          </p>
          UPI
        </button>
        <button
          className={`flex justify-center items-center cursor-pointer px-1 border-2 gap-2 rounded-md ${
            state.paymentMode == "CASH"
              ? "border-2 bg-red-100 border-blue-500 rounded-lg shadow-lg"
              : "bg-white border-gray-300 hover:bg-gray-200"
          }`}
          type="submit"
          onClick={() => handlePaymentMode("CASH")}
        >
          <p>
            <Coins />
          </p>
          Cash
        </button>
        <button
          className={`flex justify-center items-center cursor-pointer px-1 border-2 gap-2 rounded-md ${
            state.paymentMode == "CARD"
              ? "border-2 bg-red-100 border-blue-500 rounded-lg shadow-lg"
              : "bg-white border-gray-300 hover:bg-gray-200"
          }`}
          type="submit"
          onClick={() => handlePaymentMode("CARD")}
        >
          <p>
            <CreditCard />
          </p>
          Card
        </button>
        <button
          className="flex justify-center items-center cursor-pointer px-1 border-2 space-x-2 rounded-md bg-blue-100 border-blue-200 shadow-lg"
          type="submit"
        >
          <p>SPL</p>
          <input
            type="number"
            value={state.spl}
            className="bg-blue-100 w-8 text-center font-medium h-12 "
            placeholder="spl"
            onChange={(e) => handleInputChange(e)}
            name="spl"
          />
          <p>%</p>
        </button>
        <button
          className="flex justify-center items-center cursor-pointer px-1 border-2 space-x-2 rounded-md bg-red-100 border-gray-200 shadow-lg"
          type="submit"
        >
          <p>GST</p>
          <input
            type="number"
            value={state.gst}
            className="bg-red-100 w-8 text-center font-medium h-12 "
            placeholder="GST"
            onChange={(e) => handleInputChange(e)}
            name="gst"
          />
          <p>%</p>
        </button>
        <button
          className=" text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md"
          onClick={() => handleBillNext()}
        >
          Next
        </button>
      </div>
    </div>
  );
};
