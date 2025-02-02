import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login.jsx";
import Home from "./home";
import Generos from "./Generos.jsx";
import Livros from "./Livros";
import Register from "./Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/generos" element={<Generos />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
