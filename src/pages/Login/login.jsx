import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.svg";
import loadingIcon from "../../assets/loading.svg";
import { loginAdmin } from "../../server/app";
import { toast } from "react-hot-toast";
import jwt_decode from "jwt-decode";

export const Login = () => {

  const navigate = useNavigate();

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  //password eye
  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  //login api call
  const onSubmit = () => {

    setShowLoading(true)
    
    const data = { email: username, password: password };
    
    loginAdmin("user/login", data, setShowLoading).then((res) => {
      if (res.status === 200) {
        const token = res.data.token;
        if (token) {
          const decoded = jwt_decode(token);
          
          if (decoded) {
            localStorage.setItem("loginToken", token);
            toast.success('Login successfull!', { duration : 1500 });
              navigate("/");
              setShowLoading(false)
            }
          } else {
            toast.error("Login failed", {duration: 1500});
            setShowLoading(false)
          }
      }else{
        toast.error("Something wrong", {duration : 1500})
        setShowLoading(false)
      }
    })
    
  };


  return (
    <div className="flex justify-center items-center w-full h-screen bg-gradient-to-br from-sky-500 to-indigo-500 ">
      <div className=" bg-[#031635] w-[450px] px-5 py-10 rounded-lg ">
        <div className=" flex justify-center items-center">
          <img src={logoImage} alt="no img" className="md:w-52 w-36" />
        </div>
        <div className=" text-end space-y-5 pt-5">
          <div className="text-start space-y-2">
            <h1 className="text-white font-medium md:text-[18px] text-[16px]">
              UserName
            </h1>
            <input
              type="text"
              className="w-full h-[50px] bg-[#031635] pl-2 border-b-2 text-gray-300 border-[#B4B4B4] rounded"
              placeholder="UserName"
              id="username"
              defaultValue={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </div>
          <div className="relative text-start space-y-2">
            <h1 className="text-white font-medium md:text-[18px] text-[16px] ">
              Password
            </h1>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-[50px] pl-2 bg-[#031635]  border-b-2 text-gray-300 border-[#B4B4B4] rounded"
              placeholder="Password"
              id="password"
              defaultValue={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <div
              className="absolute  right-4 top-1/2 cursor-pointer text-xl"
              onClick={handlePassword}
            >
              {showPassword ? (
                <Eye className=" text-white " />
              ) : (
                <EyeOff className=" text-white" />
              )}
            </div>
          </div>
        </div>
        <button
          className="bg-[#2200f1] flex justify-center items-center gap-4 w-full p-3 text-white mt-10 rounded"
          onClick={() => onSubmit()}
        > 
          Login
          {showLoading && 
          <img src={loadingIcon} alt="no img" className=" w-5"/>
        }
        </button>
      </div>
    </div>
  );
};
