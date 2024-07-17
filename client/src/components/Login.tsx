import React, { useState } from "react";
import { ILoginDTO } from "../interfaces/interfaces";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import PopUp from "./PopUp";
import vector from "../utils/images/vector.jpg";
const Login = () => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const showError = (message: string) => {
    setPopupMessage(message);
  };

  const handleClosePopup = () => {
    setPopupMessage(null);
  };
  const navigate = useNavigate();

  const [loginDto, setLoginDTO] = useState<ILoginDTO>({
    EmailAddress: "",
    Password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = () => {
    return loginDto.EmailAddress.includes("@") && loginDto.Password.length >= 6;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isFormValid()) {
      const loginResponse = await login(loginDto, showError);
      if (loginResponse.success && loginResponse.data) {
        const { token, id } = loginResponse.data;
        localStorage.setItem("token", token!);
        localStorage.setItem("id", id!.toString());
        navigate("/dashboard/employee");
      } else {
        setPopupMessage(loginResponse.message || "Login failed");
      }
    } else {
      setPopupMessage("Form is Invalid!");
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginDTO((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col items-center bg-primary shadow-custom-black">
        <div className="flex flex-row items-center">
          <div className="px-6">
            <img src={vector} alt="login" />
          </div>
          <div className="flex flex-col px-6 text-slate-200 py-16">
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              className="flex flex-col items-center gap-8"
            >
              <h2 className="font-bold text-2xl">Login</h2>
              <div className="w-full text-primary">
                <label className="text-slate-200" htmlFor="email">
                  Email:
                </label>
                <input
                  id="email"
                  name="EmailAddress"
                  className="text-slate-200 mt-2 p-2 bg-primary border-2 border-border rounded-full w-full text-lg focus:outline-none "
                  type="email"
                  placeholder="Enter Your Email"
                  value={loginDto.EmailAddress}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full flex flex-col mb-4 text-primary">
                <div className="relative">
                  <label className="text-slate-200" htmlFor="email">
                    Password
                  </label>
                  <input
                    id="password"
                    name="Password"
                    className="text-slate-200 mt-2 p-2 bg-primary border-2 border-border rounded-full w-full text-lg focus:outline-none"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Your Password"
                    value={loginDto.Password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute mt-8 inset-y-0 right-0 px-4 text-slate-200"
                    onClick={togglePassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </form>
            <button
              onClick={handleSubmit}
              className={`bg-border mt-4 text-white rounded-full hover:bg-blue-600 
          lg:px-32 lg:py-3 lg:text-xl
          sm:px-6 sm:py-1 sm:text-lg sm:rounded-xl ${
            isFormValid()
              ? ""
              : "bg-gray-400 hover:bg-rejected cursor-not-allowed "
          }`}
            >
              Login
            </button>
            {popupMessage && (
              <PopUp message={popupMessage} onClose={handleClosePopup} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
