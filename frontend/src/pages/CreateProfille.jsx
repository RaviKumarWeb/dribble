import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ColorGradientDropdown from "../components/ColorGradient";
import { Link } from "react-router-dom";
import axios from "axios";

const CreateProfile = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState();
  const [defaultColor, setDefaultColor] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = [
    "bg-blue-400",
    "bg-purple-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-pink-400",
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage({
        dataURL: reader.result,
        name: file.name,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
    setAvatar(e.target.files[0]);
  };

  const handleDelete = () => {
    setImage(null);
    setDefaultColor(null);
  };

  const handleColorSelect = (color) => {
    setDefaultColor(color);
  };

  const handleCreateProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", avatar);
      formData.append("profileBackgroundColor", defaultColor);
      formData.append("location", location);

      const response = await axios.post(
        "http://localhost:5000/api/user/create-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        navigate("/get-started");
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
        <div className="">
          <h1 className="font-semibold mb-6 antialiased text-xl md:text-3xl lg:text-4xl">
            Welcome Let's create your profile
          </h1>
          <p className="text-[12px] md:text-[14px] lg:text-[16px]">
            Let others get to know you better! You can do these later
          </p>
        </div>

        <div className="py-10">
          <h1 className="text-[16px] md:text-xl lg:text-2xl font-semibold antialiased">
            Add an avatar
          </h1>

          <div className="py-8  flex items-center gap-10">
            <label
              htmlFor="image-upload"
              className="relative inline-block cursor-pointer"
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="absolute h-0 w-0 overflow-hidden cursor-pointer"
                onChange={handleImageUpload}
              />
              <div className="w-32 h-32 md:h-48 md:w-48 rounded-full overflow-hidden border-[2px] border-gray-300 border-dashed flex items-center justify-center">
                {image ? (
                  <img
                    src={image.dataURL}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                ) : defaultColor ? (
                  <div
                    className={`w-full h-full rounded-full ${defaultColor}`}
                  />
                ) : (
                  <span className="text-gray-500">Upload</span>
                )}
                {image !== null || defaultColor !== null ? (
                  <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      className="rounded-full ring-2 text-2xl absolute left-12 md:left-20 -bottom-2 bg-red-600 p-1 text-white"
                      onClick={handleDelete}
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </label>

            <div className="md:self-start mt-5 flex flex-col gap-3">
              <label className=" text-[10px] px-2 md:px-4 md:text-[16px] py-3 border rounded-full cursor-pointer text-center">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="absolute h-0 w-0 overflow-hidden cursor-pointer"
                  onChange={handleImageUpload}
                />
                Choose image
              </label>
              <div className=" hidden md:block">
                <ColorGradientDropdown
                  colors={colors}
                  onSelectColor={handleColorSelect}
                />
              </div>
            </div>
          </div>
          <div className=" block md:hidden">
            <ColorGradientDropdown
              colors={colors}
              onSelectColor={handleColorSelect}
            />
          </div>
        </div>

        <div className=" py-6 md:py-10">
          <h1 className="text-[16px] md:text-xl lg:text-2xl font-semibold antialiased">
            Add your location
          </h1>

          <div className=" mt-6">
            <input
              type="text"
              className="w-full outline-none bg-transparent border-b-2 font-[500] text-[16px] md:text-[18px]"
              placeholder="Enter a location"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              required
            />
          </div>
        </div>
        <div className=" flex flex-col gap-4 items-center justify-center md:justify-start md:items-start">
          <button
            className="mt-5 py-2 px-10 rounded-md bg-[#ff4678] text-white relative"
            disabled={loading}
            onClick={handleCreateProfile}
          >
            <p className={`${loading ? " animate-pulse" : ""}`}>
              {loading ? "Creating Profile..." : "Next"}
            </p>
          </button>

          <Link
            to="/signin"
            className=" text-[#ff4678] text-[12px] md:text-[16px] ml-5"
          >
            or <span className=" font-[500]">Press</span>{" "}
            <span className=" uppercase font-[600]">Return</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
