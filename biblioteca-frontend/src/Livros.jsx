import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Livros() {
  const [livros, setLivros] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [generoId, setGeneroId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchLivros();
      fetchGeneros();
    }
  }, [navigate]);

  const fetchLivros = async () => {
    try {
      const response = await fetch("http://localhost:5000/livros");
      const data = await response.json();
      setLivros(data);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  };

  const fetchGeneros = async () => {
    try {
      const response = await fetch("http://localhost:5000/generos");
      const data = await response.json();
      setGeneros(data);
    } catch (error) {
      console.error("Erro ao buscar gêneros:", error);
    }
  };

  const adicionarLivro = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/livros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, autor, genero_id: generoId }),
      });
      if (response.ok) {
        setTitulo("");
        setAutor("");
        setGeneroId("");
        fetchLivros();
      } else {
        alert("Erro ao adicionar livro.");
      }
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
    }
  };

  const deletarLivro = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_livro/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchLivros();
      } else {
        alert("Erro ao deletar livro.");
      }
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#4CAF50", marginBottom: "20px" }}>Livros</h1>
      
      <form onSubmit={adicionarLivro} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título do Livro"
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
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          placeholder="Autor do Livro"
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
        <select
          value={generoId}
          onChange={(e) => setGeneroId(e.target.value)}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "80%",
            marginBottom: "20px",
          }}
        >
          <option value="">Selecione o Gênero</option>
          {generos.map((genero) => (
            <option key={genero.id} value={genero.id}>{genero.nome}</option>
          ))}
        </select>
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
          Adicionar Livro
        </button>
      </form>

      <h2 style={{ marginBottom: "20px" }}>Lista de Livros</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {livros.map((livro) => (
          <li key={livro.id} style={{ marginBottom: "10px", fontSize: "18px" }}>
            {livro.titulo} - Autor: {livro.autor} - Gênero: {livro.genero}
            <button
              onClick={() => deletarLivro(livro.id)}
              style={{
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "10px",
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
