import axios from "axios";
import { toast } from "react-hot-toast";

export const api_url = import.meta.env.VITE_APP_API_URL;

//login api
export const loginAdmin = async (path, data, setShowLoading) => {
  try{
    const res = await axios.post(api_url + path,data)
    return res
  } catch (err){
    toast.error(err.response.data.error, {duration: 1500})
    setShowLoading(false)
  }
}

//addproduct api
export const addProduct = async (data) => {
  try {
    const res = await axios.post(`${api_url}product/addProducts`, data);
    return res;
  } catch (err) {
    toast.error(err.response.data.error.message, { duration: 1500});
  }
};

//product get api
export const getApi = async (path,setdata,settotal) => {
    try {
      const res = await axios.get(api_url + path);
      setdata(res.data.success);
      settotal(res.data.totalPages);
      return res;
    } 
    catch (err) {
      toast.error(err.response.data.error.message,{ duration : 1500});
    }
  };

//product edit api
export const editApi = async (path, data)=>{
    try {
      const res = await axios.post(api_url + path, data);
      return res;
    } catch (err) {
      toast.error(err.response.data.error.message,{ duration: 1500});
    }
  };

//Product delete api
export const deleteApi = async (path)=>{
    try {
      const res = await axios.delete(api_url + path);
      return res;
    } catch (err) {
      toast.error(err.response.data.error.message,{ duration: 1500});
    }
  };

//product get api for billing
export const getProductBySearch = async (path,setdata) => {
  try {
    const res = await axios.get(api_url + path);
    setdata(res.data.success);
    return res;
  } 
  catch (err) {
    toast.error(err.response.data.error.message,{ duration : 1500});
  }
};

//addbill
export const addbill = async (data) => {
  try {
    const res = await axios.post(`${api_url}billing/addBill`, data);
    return res;
  } catch (err) {
    toast.error(err.response.data.errors, { duration: 1500});
  }
};

//report get api
export const getReport = async (path,setdata,settotal, settotalItem) => {
  try {
    const res = await axios.get(api_url + path);
    setdata(res.data.success);
    settotal(res.data.totalPages)
    settotalItem(res.data.countByInvoiceNumber);
    return res;
  } 
  catch (err) {
    toast.error(err.response.data.error.message,{ duration : 1500});
  }
};

//report get report by name
export const getReportByName = async (path,setdata,settotal, settotalItem) => {
  try {
    const res = await axios.get(api_url + path);
    setdata(res.data.success);
    settotal(res.data.totalPages)
    settotalItem(res.data.countByInvoiceNumber);
    return res;
  } 
  catch (err) {
    toast.error(err.response.data.error,{ duration : 1500});
  }
};


//report get product details by invoice number
export const getPoductDetails = async (path, setViewBillData) => {
  try {
    const res = await axios.get(api_url + path);
    setViewBillData(res.data.success);
    return res;
  } 
  catch (err) {
    toast.error(err.response.data.error.message,{ duration : 1500});
  }
};
//report get total product amount by invoice number
export const getTotalAmount = async (path, setProductData) => {
  try {
    const res = await axios.get(api_url + path);
    setProductData(res.data.success);
    return res;
  } 
  catch (err) {
    toast.error(err.response.data.error.message,{ duration : 1500});
  }
};

//get report details by date
export const getReportByDate = async (path,setdata,settotal, settotalItem) => {
  try {
    const res = await axios.get(api_url + path);
    setdata(res.data.success);
    settotal(res.data.totalPages)
    settotalItem(res.data.countByInvoiceNumber);
    return res;
  } 
  catch (err) {
    toast.error(err.response.data.error.message,{ duration : 1500});
  }
};

//get report for download
export const getReportPdf = async (path, setdata) => {
  try {
    const res = await axios.get(api_url + path);
    setdata(res.data.success);
    console.log(res.data.success)
    return res;
  } 
  catch (err) {
    // toast.error(err.response.data.error.message,{ duration : 1500});
    toast.error(err.response.data.error.message,{ duration : 1500});
  }
};