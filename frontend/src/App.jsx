import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import CreateProfille from "./pages/CreateProfille";
import Getstarted from "./pages/Getstarted";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/create-profile" element={<CreateProfille />} />
        <Route path="/get-started" element={<Getstarted />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
