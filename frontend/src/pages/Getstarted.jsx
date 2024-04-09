import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Getstarted = () => {
  const navigate = useNavigate();
  const [checkedIndex, setCheckedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const cardsData = [
    {
      id: 1,
      title: "I'm a designer looking to share my work",
      imageUrl:
        "https://ouch-cdn2.icons8.com/B0wiH4tZolqZQYke4PXBsrMX4YdfptD4rKj43dLtjrw/rs:fit:368:489/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvMTU4/LzMxOGNhNDRiLWQy/NTQtNDMyNy05NmE3/LTQwZTMwMTkzZWZj/ZC5wbmc.png",
    },
    {
      id: 2,
      title: "I'm looking for hire Designer.",
      imageUrl:
        "https://ouch-cdn2.icons8.com/24seKbDshCBZ8YscA-cwZtGe49b-IV2OXiD-GRXO5N4/rs:fit:368:314/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNDA0/L2Q5MDI3NGY3LWNk/OTktNGRiMi1hNTVk/LTcwNWNmM2RmNDU4/YS5wbmc.png",
    },
    {
      id: 3,
      title: "I'm looking for a deisgn inspiration",
      imageUrl:
        "https://ouch-cdn2.icons8.com/cLXMn1BYMRvbAsl7utDM_6UaqrsKpjoTHVcNMaByPhU/rs:fit:368:252/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvODk2/LzFmOWIzNzVhLTQ1/MGItNDUyYy05OTlm/LWUxZGQzYzA2MThm/OS5wbmc.png",
    },
  ];

  const handleCheck = (index) => {
    if (checkedIndex === index) {
      setCheckedIndex(null); // Uncheck if already checked
    } else {
      setCheckedIndex(index); // Check the selected card
    }
  };

  const handleProfileOptions = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}/profile-options`,
        { profileOptions: cardsData[checkedIndex].title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data) {
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error creating profile:", error);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="">
      <Navbar />

      <div className="py-10 w-[90%] md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-5">
          <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl antialiased">
            What brings you to Dribble?
          </h1>
          <p className="text-gray-600 text-[14px] md:text-[16px] text-center">
            Select the options that best describe you. Don't worry, you can
            explore other options later.
          </p>
        </div>

        <div className="py-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {cardsData.map((card, index) => (
            <div
              onClick={() => handleCheck(index)}
              key={card.id}
              className={`border p-3 relative h-[280px] flex flex-col rounded-md cursor-pointer ${
                checkedIndex === index ? "border-4 border-pink-500" : ""
              }`}
            >
              <div className="mb-auto flex items-center justify-center">
                <img
                  src={card.imageUrl}
                  alt=""
                  className={`w-32 h-32 ${
                    checkedIndex === index
                      ? "absolute transition-all duration-300 -top-10"
                      : ""
                  }`}
                />
              </div>
              <div className=" text-center mt-4 flex flex-col items-center justify-center gap-3">
                <h1 className=" text-xl font-[600]">{card.title}</h1>
                {checkedIndex === index && (
                  <p className="text-[12px] font-[500] md:text-[14px] text-gray-500">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Sunt similique tenetur.
                  </p>
                )}
                <div className="w-5 h-5 rounded-full border cursor-pointer">
                  {checkedIndex === index && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-full w-full rounded-full text-white  ${
                        checkedIndex !== null ? " bg-[#ff4678] text-white" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className=" flex flex-col items-center justify-center">
          <Link to="" className=" font-[600]">
            Anything else? You can select multiple
          </Link>

          <button
            className="mt-5 py-2 px-10 rounded-md bg-[#ff4678] text-white relative"
            disabled={loading}
            onClick={handleProfileOptions}
          >
            <p className={`${loading ? " animate-pulse" : ""}`}>
              {loading ? "Saving Profile..." : "Finish"}
            </p>
          </button>
          <Link
            to="/create-profile"
            className=" text-[#ff4678] text-[12px] md:text-[16px] mt-5"
          >
            or <span className=" font-[500]">Press</span>{" "}
            <span className=" uppercase font-[600]">Return</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Getstarted;
