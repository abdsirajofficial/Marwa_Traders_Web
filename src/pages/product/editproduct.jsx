import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { editApi} from "../../server/app";

export const Editproduct = ({ setViewMode, data, editProductIndex }) => {
  
  const [productName, setProductName] = useState(data[editProductIndex].productName);
  const [quantity, setQuantity] = useState(data[editProductIndex].quantity);
  const [mrp, setMRP] = useState(data[editProductIndex].mrp);
  const [discount, setDiscount] = useState(data[editProductIndex].discount);
  const [addMargin, setaddMargin] = useState(data[editProductIndex].addMargin);
  const [netRate, setnetRate] = useState(data[editProductIndex].netRate);
  const [category, setCategory] = useState(data[editProductIndex].category);

  useEffect(() => {
    if (mrp !== 0 && discount !== 0 && addMargin !==0) {
      const netRate = mrp * (1 - discount / 100);
      const saleRate = netRate * (1+ addMargin /100)
      setnetRate(saleRate);
    }
  }, [mrp, discount, addMargin]);

  const editProductId = data[editProductIndex].id

  const handleSave = async () => {

    if (
      productName === "" ||
      quantity === 0 ||
      mrp === 0 ||
      discount === 0 ||
      addMargin === 0 ||
      netRate === 0 ||
      category === ""
    ) {
      toast.error("Please fill the required fields", { duration: 1500 });
    }

    const data = {
      productName: productName,
      quantity: parseInt(quantity),
      mrp: parseFloat(mrp),
      discount: parseFloat(discount),
      addMargin: parseFloat(addMargin),
      netRate: parseFloat(netRate),
      category: category,
    };

    editApi(`product/editProducts/${editProductId}`,data).then((res) => {
      if (res.status === 200) {
        toast.success('Material update successfully!', { duration : 1500 });
        setViewMode("view")
      }
      else {
        toast.error('Something went Wrong', { duration : 1500 });
      }
    });
  };

  return (
    <div className="w-full h-full pt-5 px-5">
          <div className="flex justify-center items-center space-x-4 text-white">
            <h1 className="bg-blue-400 py-1 px-2 rounded-lg">MRP: {mrp}</h1>
            <h1 className="bg-red-400 py-1 px-2 rounded-lg">
              Dis(-): {discount}%
            </h1>
            <h1 className="bg-green-400 py-1 px-2 rounded-lg">
              Add(+): {addMargin}%
            </h1>
            <h1 className="bg-yellow-400 py-1 px-2 rounded-lg">
              Net Rate: {netRate}
            </h1>
          </div>  
      <div className="flex justify-center items-center">
        <div className=" w-[550px] mt-10 py-10 px-10 flex flex-col justify-start bg-white space-y-4 rounded-2xl shadow-lg">
          <h1 className="text-center font-medium">ADD PRODUCTS</h1>
          <div className="flex justify-between items-center">
            <label htmlFor="name">Product Name:</label>
            <input
              type="text"
              className="rounded border-2 p-3 w-[300px]"
              name="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center space-x-5">
            <label htmlFor="description">Quantity:</label>
            <input
              type="number"
              className="rounded border-2 p-3 w-[300px] "
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center space-x-5">
            <label htmlFor="price">MRP:</label>
            <input
              type="number"
              className="rounded border-2 p-3 w-[300px]"
              name="mrp"
              value={mrp}
              onChange={(e) => setMRP(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center space-x-5">
            <label htmlFor="quantity">Discount (-):</label>
            <input
              type="number"
              className="rounded border-2 p-3 w-[300px]"
              name="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center space-x-5">
            <label htmlFor="quantity">Add Margin (+):</label>
            <input
              type="number"
              className="rounded border-2 p-3 w-[300px]"
              name="addMargin"
              value={addMargin}
              onChange={(e) => setaddMargin(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="category">Category:</label>
            <div className="flex items-center gap-x-4">
              <div>
                <input
                  type="radio"
                  value="PVC"
                  name="category"
                  checked={category === "PVC"}
                  onChange={() => setCategory("PVC")}
                />
                <label htmlFor="pvc">PVC</label>
              </div>
              <div>
                <input
                  type="radio"
                  value="UPVC"
                  name="category"
                  checked={category === "UPVC"}
                  onChange={() => setCategory("UPVC")}
                />
                <label htmlFor="upvc">UPVC</label>
              </div>
              <div>
                <input
                  type="radio"
                  value="CPVC"
                  name="category"
                  checked={category === "CPVC"}
                  onChange={() => setCategory("CPVC")}
                />
                <label htmlFor="cpvc">CPVC</label>
              </div>
              <div>
                <input
                  type="radio"
                  value="SOLVENT"
                  name="category"
                  checked={category === "SOLVENT"}
                  onChange={() => setCategory("SOLVENT")}
                />
                <label htmlFor="SOLVENT">SOLVENT</label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-5">
            <button
              className="bg-red-400 text-white py-2 px-4 rounded"
              onClick={() => setViewMode("view")}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded"
              onClick={handleSave}
            >
              {}
              <p>Save</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};
