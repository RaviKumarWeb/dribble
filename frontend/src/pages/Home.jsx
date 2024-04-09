import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [isTokenExists, setIsTokenExists] = useState(true);

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const resendEmail = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/resend-verification-email",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`An email has been sent to your registered Email ID`);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsTokenExists(false);
    } else {
      getUser();
    }
  }, []);

  useEffect(() => {
    if (!isTokenExists) {
      navigate("/signin");
    }
  }, [isTokenExists, navigate]);

  return (
    <div className="h-screen flex flex-col justify-between">
      <Header avatar={user.avatar} />
      <Hero user={user} resendEmail={resendEmail} />
      <Footer />
    </div>
  );
};

export default Home;
