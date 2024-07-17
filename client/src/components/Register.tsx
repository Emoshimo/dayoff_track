import React, { useState } from "react";
import { IEmployee } from "../interfaces/interfaces";
import PopUp from "./PopUp";
import { register } from "../api";

const Register = () => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const showError = (message: string) => {
    setPopupMessage(message);
  };

  const handleClosePopup = () => {
    setPopupMessage(null);
  };
  const [employee, setEmployee] = useState<IEmployee>({
    Name: "",
    Surname: "",
    DayOffNumber: 0,
    EmailAddress: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle showing/hiding password
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    const {
      Name,
      Surname,
      DayOffNumber,
      EmailAddress,
      Password,
      ConfirmPassword,
    } = employee;

    // Check if any of the fields are empty
    if (
      !Name.trim() ||
      !Surname.trim() ||
      DayOffNumber <= 0 || // Assuming DayOffNumber should be greater than 0
      !EmailAddress.trim() ||
      !Password.trim() ||
      !ConfirmPassword.trim()
    ) {
      return false;
    }

    // Check if Password and ConfirmPassword match
    if (Password !== ConfirmPassword) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      const registerResponse = await register(employee, token!, showError);
      setPopupMessage(registerResponse.message || null);
    } else {
      setPopupMessage("Form is Invalid!");
    }
  };

  return (
    <div className="w-full  p-8 bg-primary rounded-xl text-slate-200 shadow-md">
      <div className="flex flex-col items-center gap-1">
        <h2 className="font-bold text-2xl">Register</h2>

        <div className="w-full text-primary">
          <label className="text-slate-200" htmlFor="name">
            Name:
          </label>
          <input
            id="name"
            name="Name"
            className="p-2 border rounded-lg w-full text-lg"
            type="text"
            placeholder="Enter Your Name"
            value={employee.Name}
            onChange={handleChange}
          />
        </div>

        <div className="w-full text-primary">
          <label className="text-slate-200" htmlFor="surname">
            Surname:
          </label>
          <input
            id="surname"
            name="Surname"
            className="p-2 border rounded-lg w-full text-lg"
            type="text"
            placeholder="Enter Your Surname"
            value={employee.Surname}
            onChange={handleChange}
          />
        </div>

        <div className="w-full text-primary">
          <label className="text-slate-200" htmlFor="dayOffNumber">
            Day Off Number:
          </label>
          <input
            id="dayOffNumber"
            name="DayOffNumber"
            className="p-2 border rounded-lg w-full text-lg"
            type="number"
            placeholder="Enter Your Day Off Number"
            value={employee.DayOffNumber.toString()}
            onChange={handleChange}
          />
        </div>

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
            value={employee.EmailAddress}
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
              value={employee.Password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute mt-4 inset-y-4 right-0 px-4 text-gray-500"
              onClick={togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col mb-4 text-primary">
          <div className="relative">
            <label className="text-slate-200" htmlFor="email">
              ConfirmPassword
            </label>

            <input
              id="confirmPassword"
              name="ConfirmPassword"
              className="p-2 border rounded-lg w-full text-lg"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Your Password"
              value={employee.ConfirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute mt-4 inset-y-4 right-0 px-4 text-gray-500"
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
          Register
        </button>
        {popupMessage && (
          <PopUp message={popupMessage} onClose={handleClosePopup} />
        )}
      </div>
    </div>
  );
};

export default Register;
