import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Generos() {
  const [generos, setGeneros] = useState([]);
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchGeneros();
    }
  }, [navigate]);

  const fetchGeneros = async () => {
    try {
      const response = await fetch("http://localhost:5000/generos");
      const data = await response.json();
      setGeneros(data);
    } catch (error) {
      console.error("Erro ao buscar gêneros:", error);
    }
  };

  const adicionarGenero = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/generos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });
      if (response.ok) {
        setNome("");
        fetchGeneros();
      } else {
        alert("Erro ao adicionar gênero.");
      }
    } catch (error) {
      console.error("Erro ao adicionar gênero:", error);
    }
  };

  const deletarGenero = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_genero/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchGeneros();
      } else {
        alert("Erro ao deletar gênero.");
      }
    } catch (error) {
      console.error("Erro ao deletar gênero:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "#4CAF50", marginBottom: "20px" }}>Gêneros</h1>
      
      <form onSubmit={adicionarGenero} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do Gênero"
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "80%",
            marginBottom: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Adicionar Gênero
        </button>
      </form>

      <h2 style={{ marginBottom: "20px" }}>Lista de Gêneros</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {generos.map((genero) => (
          <li key={genero.id} style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "18px", marginRight: "10px" }}>{genero.nome}</span>
            <button
              onClick={() => deletarGenero(genero.id)}
              style={{
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#f1f1f1",
          color: "#333",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
          fontSize: "16px",
        }}
      >
        Voltar
      </button>
    </div>
  );
}
