import React, { useState } from "react";
import { ILoginDTO } from "../interfaces/interfaces";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import PopUp from "./PopUp";

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
    <div className="w-1/2 mx-auto p-8 bg-primary rounded-xl text-slate-200 ">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
        className="flex flex-col items-center gap-1 "
      >
        <h2 className="font-bold text-2xl">Login</h2>
        <div className="w-full text-primary">
          <label className="text-slate-200" htmlFor="email">
            Email:
          </label>
          <input
            id="email"
            name="EmailAddress"
            className="p-2 border rounded-lg w-full text-lg"
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
              className="p-2 border rounded-lg w-full text-lg"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={loginDto.Password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute mt-4 inset-y-0 right-0 px-4 text-gray-500"
              onClick={togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className={`bg-blue-500 text-white rounded hover:bg-blue-600 
          lg:px-32 lg:py-3 lg:text-xl
          sm:px-6 sm:py-1 sm:text-lg sm:rounded-xl ${
            isFormValid() ? "" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Login
        </button>
        {popupMessage && (
          <PopUp message={popupMessage} onClose={handleClosePopup} />
        )}
      </form>
    </div>
  );
};

export default Login;
