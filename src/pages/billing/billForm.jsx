import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { ArrowBigLeftDash, Printer, Save, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.svg";
import numWords from "num-words";
import { addbill } from "../../server/app";
import toast from "react-hot-toast";

export const BillForm = ({ setViewMode, selectedItems, state, setState, setinvoice }) => {

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Format the current date as "dd/mm/yyyy"
    const formattedDate = currentDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "-"); // Replace '/' with '-'    

    // Update the date field in the state
    setState((prevState) => ({
      ...prevState,
      date: formattedDate,
    }));
  }, []); // The empty dependency array ensures this effect runs once on component mount

  const handlesave = () => {

    // setViewMode("save");

    const data = {
      State: {
        paymentMethod: state.paymentMode,
        gst: state.gst,
        spl: state.spl,
        name: state.name,
        area: state.area,
        date: state.date
      },
      Products: selectedItems,
    };

    addbill(data).then((res) => {
      if (res.status === 200) {
        toast.success(res.data.success, { duration: 1500 });
        setViewMode("save")
        setinvoice(res.data.invoiceNumber)
      } else {
        toast.error(res.data.errorMessages.error, { duration: 1500 });
      }
    });
  };

  const handleClose = () => {
    setState({
      paymentMode: "",
      spl: 0,
      gst: 18,
      name: "",
      area: "",
      date: "",
    });
    setViewMode("Billing");
  };

  function numberToWords(num) {
    return numWords(num);
  }

  return (
    <div className=" w-full h-auto pt-5 px-5 bg-gray-200">
      <div className=" flex justify-between">
        <button
          className="flex items-center cursor-pointer p-2 border-2 gap-2 rounded-md bg-white border-gray-300 hover:border-blue-500"
          onClick={() => setViewMode("billing")}
        >
          <p>
            <ArrowBigLeftDash />
          </p>
          Back
        </button>

        <div className=" flex space-x-5">
          <button
            className="flex space-x-3 text-white bg-yellow-500 hover:bg-yellow-700 px-4 py-2 rounded-md"
            onClick={() => handleClose()}
          >
            <XCircle />
            <p>Cancel</p>
          </button>
          <button
            className="flex space-x-3 text-white bg-green-500 hover:bg-green-700 px-4 py-2 rounded-md"
            onClick={() => handlesave()}
          >
            <Save />
            <p>Save</p>
          </button>
        </div>
      </div>

      <div className=" bg-white w-full h-min p-5 rounded-lg mt-5 ">
        <div className=" flex justify-center items-center space-x-5 border-2 p-2">
          <img src={logoImage} alt="" className=" w-36" />
          <div className=" fles text-center pl-20">
            <p className=" font-bold text-[20px] tracking-wider">
              MARWA TRADERS
            </p>
            <p className="   tracking-widest">No.44/A, MAMBALAPATTU ROAD,</p>
            <p className="   tracking-widest">VILLUPURAM - 605602</p>
            <p className="   tracking-widest">PHONE : 9043732149,6381364796</p>
            <p className=" tracking-widest">GSTIN: 33OLDPS1329N1ZJ</p>
          </div>
        </div>
        <div className=" flex justify-between border-b-2">
          <div className=" w-1/2 border-l-2 p-2 text-[14px]">
            <div className=" flex space-x-5">
              <p className=" font-bold ">To :-</p>
              <p>{state.name}</p>
            </div>
            <div className=" pl-12  ">
              <p>{state.area}</p>
            </div>
          </div>
          <div className=" w-1/2 border-l-2 text-[14px]">
            <div className=" flex space-x-10 border-b-2 border-r-2 p-2 font-medium">
              <p>TAX INVOICE</p>
              <p>CASH BILL</p>
            </div>
            <div className=" grid grid-cols-2 p-2 border-r-2">
              <p>INVOICE NO : </p>
              <p></p>
              <p>PAYMENT MODE : </p>
              <p>{state.paymentMode}</p>
              <p>DATE :</p>
              <p> {state.date}</p>
            </div>
          </div>
        </div>
        <table className="w-full text-center border-x-2 text-[14px]">
          <thead>
            <tr className=" border-b-2">
              <th className="p-2 ">S.No</th>
              <th className="p-2 border-x-2">Description</th>
              <th className="p-2 ">Quantity</th>
              <th className="p-2 border-x-2">Rate</th>
              <th className="p-2">Disc</th>
              <th className="p-2 border-l-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => {
              // Calculate the total for the current item
              const total = (
                item.quantity *
                item.mrp *
                (1 - item.discount / 100)
              ).toFixed(2);

              return (
                <tr key={index}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 border-x-2 gap-2 text-start">
                    {item.productName}
                    {item.category}
                  </td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2 border-x-2">{item.mrp}</td>
                  <td className="p-2">{item.discount}%</td>
                  <td className="p-2 border-x-2">{total}</td>
                </tr>
              );
            })}

            <tr className=" border-y-2">
              <td
                className="p-2 text-start border-r-2 border-b-2 capitalize text-[14px]"
                colSpan="3"
                rowSpan="4"
              >
                {numberToWords(
                  state.spl > 0
                    ? Math.round(
                        parseFloat(
                          selectedItems.reduce((acc, item) => {
                            return (
                              acc +
                              item.quantity *
                                item.mrp *
                                (1 - item.discount / 100)
                            );
                          }, 0)
                        ) +
                          parseFloat(
                            selectedItems.reduce((acc, item) => {
                              return (
                                acc +
                                item.quantity *
                                  item.mrp *
                                  (1 - item.discount / 100)
                              );
                            }, 0)
                          ) *
                            (state.gst / 100)
                      ) -
                        Math.round(
                          selectedItems.reduce((acc, item) => {
                            return (
                              acc +
                              item.quantity *
                                item.mrp *
                                (1 - item.discount / 100)
                            );
                          }, 0) *
                            (state.spl / 100)
                        )
                    : Math.round(
                        parseFloat(
                          selectedItems.reduce((acc, item) => {
                            return (
                              acc +
                              item.quantity *
                                item.mrp *
                                (1 - item.discount / 100)
                            );
                          }, 0)
                        ) +
                          parseFloat(
                            selectedItems.reduce((acc, item) => {
                              return (
                                acc +
                                item.quantity *
                                  item.mrp *
                                  (1 - item.discount / 100)
                              );
                            }, 0)
                          ) *
                            (state.gst / 100)
                      )
                )}
                <p className=" font-medium underline">Our Bank Details :</p>
                <div className=" flex space-x-3 ">
                  <p className=" font-medium">Bank Name :</p>
                  <p>Axis Bank </p>
                  <p className=" font-medium">A/c No :</p>
                  <p>923020011076412 </p>
                  <p className=" font-medium">IFSC Code :</p>
                  <p>UTIB0000467 </p>
                </div>
              </td>
              <td className="p-1 text-right border-r-2" colSpan="2">
                Amount
              </td>
              <td className="p-1 text-center pr-8 font-medium">
                {/* Calculate and display the grand total of all items */}
                {selectedItems
                  .map((item) => {
                    const total =
                      item.quantity * item.mrp * (1 - item.discount / 100);
                    return isNaN(total) ? 0 : total;
                  })
                  .reduce((acc, total) => acc + total, 0)
                  .toFixed(2)}
              </td>
            </tr>

            <tr className=" border-b-2">
              <td className="p-1 text-right border-r-2" colSpan="2">
                Gst {state.gst}%
              </td>
              <td className="p-1 text-center pr-8 " colSpan="2">
                {(
                  selectedItems.reduce((acc, item) => {
                    return (
                      acc + item.quantity * item.mrp * (1 - item.discount / 100)
                    );
                  }, 0) *
                  (state.gst / 100)
                ).toFixed(2)}
              </td>
            </tr>
            {state.spl > 0 && (
              <tr className="border-b-2">
                <td className="p-1 text-right border-r-2" colSpan="2">
                  Special dis(-) {state.spl}%
                </td>
                <td className="p-1 text-center pr-8" colSpan="2">
                  {(
                    selectedItems.reduce((acc, item) => {
                      return (
                        acc +
                        item.quantity * item.mrp * (1 - item.discount / 100)
                      );
                    }, 0) *
                    (state.spl / 100)
                  ).toFixed(2)}
                </td>
              </tr>
            )}

            <tr className="">
              <td className="p-1 text-right border-r-2" colSpan="2">
                Total
              </td>
              <td className="p-1 text-center pr-8 font-medium" colSpan="">
                {state.spl > 0
                  ? (
                      parseFloat(
                        selectedItems.reduce((acc, item) => {
                          return (
                            acc +
                            item.quantity * item.mrp * (1 - item.discount / 100)
                          );
                        }, 0)
                      ) +
                      parseFloat(
                        selectedItems.reduce((acc, item) => {
                          return (
                            acc +
                            item.quantity * item.mrp * (1 - item.discount / 100)
                          );
                        }, 0)
                      ) *
                        (state.gst / 100)
                    ).toFixed(2) -
                    (
                      selectedItems.reduce((acc, item) => {
                        return (
                          acc +
                          item.quantity * item.mrp * (1 - item.discount / 100)
                        );
                      }, 0) *
                      (state.spl / 100)
                    ).toFixed(2)
                  : (
                      parseFloat(
                        selectedItems.reduce((acc, item) => {
                          return (
                            acc +
                            item.quantity * item.mrp * (1 - item.discount / 100)
                          );
                        }, 0)
                      ) +
                      parseFloat(
                        selectedItems.reduce((acc, item) => {
                          return (
                            acc +
                            item.quantity * item.mrp * (1 - item.discount / 100)
                          );
                        }, 0)
                      ) *
                        (state.gst / 100)
                    ).toFixed(2)}
              </td>
            </tr>
            {state.spl <= 0 && (
              <tr>
                <td colSpan="3"></td>
              </tr>
            )}
            <tr className=" border-b-2 ">
              <td
                className=" text-start border-x-2 p-2"
                colSpan="3"
                rowSpan="3"
              >
                <p className=" font-medium underline"> E.& O.E </p>
                <div className=" text-[13px]">
                  <p>
                    Certified the all particular given above are true and
                    correct.
                  </p>
                  <p>Goods once sold are not returnable or exchangable.</p>
                  <p>
                    Our responsibility ceases after the goods released from
                    shop.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td
                className=" border-x-2 border-b-2  font-medium text-end"
                colSpan="2"
              >
                GRAND TOTAL
              </td>
              <td className="text-center pr-8 border-b-2 font-medium">
                {state.spl > 0
                  ? Math.round(
                      parseFloat(
                        selectedItems.reduce((acc, item) => {
                          return (
                            acc +
                            item.quantity * item.mrp * (1 - item.discount / 100)
                          );
                        }, 0)
                      ) +
                        parseFloat(
                          selectedItems.reduce((acc, item) => {
                            return (
                              acc +
                              item.quantity *
                                item.mrp *
                                (1 - item.discount / 100)
                            );
                          }, 0)
                        ) *
                          (state.gst / 100)
                    ) -
                    Math.round(
                      selectedItems.reduce((acc, item) => {
                        return (
                          acc +
                          item.quantity * item.mrp * (1 - item.discount / 100)
                        );
                      }, 0) *
                        (state.spl / 100)
                    )
                  : Math.round(
                      parseFloat(
                        selectedItems.reduce((acc, item) => {
                          return (
                            acc +
                            item.quantity * item.mrp * (1 - item.discount / 100)
                          );
                        }, 0)
                      ) +
                        parseFloat(
                          selectedItems.reduce((acc, item) => {
                            return (
                              acc +
                              item.quantity *
                                item.mrp *
                                (1 - item.discount / 100)
                            );
                          }, 0)
                        ) *
                          (state.gst / 100)
                    )}
              </td>
            </tr>
            <tr className=" border-b-2">
              <td
                className="p-3 text-start border-r-2 space-y-10 text-[13px] font-medium"
                colSpan="3"
              >
                <p>for MARWA TRADERS</p>
                <p className=" text-end">Authorised Signatory</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
