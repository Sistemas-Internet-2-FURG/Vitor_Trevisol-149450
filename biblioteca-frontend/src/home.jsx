import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redireciona para login se não estiver autenticado
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "#4CAF50", marginBottom: "30px" }}>
        Bem-vindo ao Sistema de Gerenciamento de Biblioteca
      </h1>
      <ul style={{ listStyle: "none", padding: 0, fontSize: "18px" }}>
        <li>
          <a
            href="/generos"
            style={{
              display: "block",
              margin: "15px 0",
              padding: "10px",
              backgroundColor: "#f4f4f4",
              textDecoration: "none",
              borderRadius: "5px",
              color: "#333",
              textAlign: "center",
              transition: "background-color 0.3s",
            }}
          >
            Gerenciar Gêneros
          </a>
        </li>
        <li>
          <a
            href="/livros"
            style={{
              display: "block",
              margin: "15px 0",
              padding: "10px",
              backgroundColor: "#f4f4f4",
              textDecoration: "none",
              borderRadius: "5px",
              color: "#333",
              textAlign: "center",
              transition: "background-color 0.3s",
            }}
          >
            Gerenciar Livros
          </a>
        </li>
      </ul>
    </div>
  );
}
