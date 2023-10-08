import { useState} from "react";
import { Billing } from "./billing";
import { BillForm } from "./billForm";
import { SaveBillForm } from "./saveBill";

export const BillingHome = () => {

  const [ViewMode, setViewMode] = useState("billing");
  const [selectedItems, setselectedItems] = useState([]);
  const [invoice, setinvoice] = useState()

  const [state, setState] = useState({
    paymentMode: "",
    gst: 18,
    spl: 0,
    name: "",
    area: "",
    date: ""
  });

  const renderPage = () => {
    switch (ViewMode) {
      
      case "billing":
        return (
          <Billing
            setViewMode={setViewMode}
            setState={setState}
            state={state}
            selectedItems={selectedItems}
            setselectedItems={setselectedItems}
          />
        );

      case "bill":
        return <BillForm 
        setViewMode={setViewMode} 
        state={state}
        setState={setState}
        selectedItems={selectedItems}
        setinvoice={setinvoice}
        />;

      case "save":

        return (
          <SaveBillForm
          setViewMode={setViewMode}  
          state={state}
          setState={setState}
          selectedItems={selectedItems}
          setselectedItems={setselectedItems}
          invoice={invoice}
          setinvoice={setinvoice}
          />
        );

    }
  };

  return (
    <div className=" w-full h-full">
      {renderPage()}
    </div>
  );
};

