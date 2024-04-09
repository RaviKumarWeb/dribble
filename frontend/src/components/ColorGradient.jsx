import React, { useState } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";

const ColorGradientDropdown = ({ colors, onSelectColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block cursor-pointer">
      <div>
        <p
          className="inline-flex justify-center items-center rounded-md text-sm font-medium text-gray-700 md:mt-5 "
          onClick={handleDropdownToggle}
        >
          {isOpen ? (
            <MdKeyboardArrowDown className=" text-xl" />
          ) : (
            <MdKeyboardArrowRight className=" text-xl" />
          )}{" "}
          <span className="  text-[12px] md:text-[16px]">
            Or choose one of our defaults
          </span>
        </p>
      </div>
      <div
        className={`${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        } origin-top-right absolute left-6 md:left-10 mt-2 w-56 rounded-md   transition duration-300 ease-in-out`}
      >
        <div className="flex space-x-2 p-2">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => onSelectColor(color)}
              className={`w-8 h-8 rounded-full transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none ${color}`}
              aria-label={`Color ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorGradientDropdown;
