import { useState} from "react";
import { ViewProducts } from "./viewproducts";
import { Newproduct } from "./newproduct";
import { Editproduct } from "./editproduct";

export const Product = () => {

  const [ViewMode, setViewMode] = useState("view");
  const [editProductIndex, seteditProductIndex] = useState();
  const [data, setdata] = useState([]);
  const [selectedItems, setselectedItems] = useState([]);

  const renderPage = () => {
    switch (ViewMode) {
      
      case "view":
        return (
          <ViewProducts
            setViewMode={setViewMode}
            seteditProductIndex={seteditProductIndex}
            setdata={setdata}
            data={data}
          />
        );

      case "add":
        return <Newproduct 
        setViewMode={setViewMode} 
        // setdata={setdata} 
        />;

      case "edit":

        return (
          <Editproduct
            data={data}
            editProductIndex={editProductIndex}
            setViewMode={setViewMode}
            // setdata={setdata}
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

