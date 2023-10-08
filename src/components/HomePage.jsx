import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FileText, LogOut, PackageSearch, ScrollText } from "lucide-react";
import logoImage from '../assets/logo1.svg'
import jwtDecode from "jwt-decode";

export const HomePage = () => {

  const navigate = useNavigate()

  const [showDropdown, setShowDropdown] = useState(false)
  const token = localStorage.getItem('loginToken')
  const [email, setemail] = useState('')

  // check token is available or not and check token exp or not
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('loginToken');
      navigate('/login');
    }
    else{
      setemail(decodedToken.email);
    }
  }, [token, navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('loginToken');
    navigate('/login');
  }

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}

      <div className="">
        <div className=" w-32 lg:w-44 h-full bg-[#11194c] flex flex-col  items-center pt-5">
          <div className=" text-white">
            <img src={logoImage} alt="" className="w-24"/>
          </div>
          <NavLink
            to={"/billingHome"}
            className=" acitive w-full mt-10 flex justify-center  items-center lg:space-x-5 text-center py-3 lg:px-10 cursor-pointer text-[#ebedf2] font-medium"
            onClick={() => setShowImage(false)}
          >
            <h1 className="text-[14px] flex gap-3 text-center">
              <ScrollText />
              Billing
            </h1>
          </NavLink>
          <NavLink
            to={"/product"}
            className=" acitive w-full mt- flex justify-center items-center lg:space-x-5 text-center py-3 lg:px-10 cursor-pointer text-[#ebedf2] font-medium"
            
          >
            <h1 className="text-[14px] flex gap-3 text-center">
              <PackageSearch />
              Product
            </h1>
          </NavLink>
          <NavLink
            to={"/report"}
            className=" acitive w-full mt- flex justify-center items-center lg:space-x-5 text-center py-3 lg:px-10 cursor-pointer text-[#ebedf2] font-medium"
          >
            <h1 className="text-[14px] flex gap-3 text-center">
              <FileText />
              Report
            </h1>
          </NavLink>
        </div>
      </div>

      <div className=" relative w-full h-full flex flex-col ">
        {/* Navbar*/}
        <div className="w-full h-12 shadow border-b-2 flex justify-end items-center bg-white pr-5">
          <div>
            <h1 className=" bg-yellow-300 px-[18px] py-2 text-[18px] rounded-full cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>{email[0]}</h1>
          </div>
        </div>
          {showDropdown && (
            <div className="absolute right-0 top-12 bg-white py-5 rounded-md shadow-lg">
             <button className=" flex justify-end items-center gap-2 bg-red-500 mx-2 rounded-md text-white hover:bg-red-600 px-4 py-2" onClick={()=>handleLogout()}><LogOut/>LogOut</button> 
            </div>
          )}

        {/*pagecontent*/}
        <div className="w-full grow bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
