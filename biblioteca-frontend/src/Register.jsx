import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registro bem-sucedido! Redirecionando...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Erro ao registrar.");
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setMessage("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ color: "#4CAF50", marginBottom: "20px" }}>Registro</h1>
      <form onSubmit={handleRegister} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuário"
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            marginBottom: "20px",
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
            width: "100%",
          }}
        >
          Registrar
        </button>
      </form>

      {message && (
        <p style={{ color: message.includes("Erro") ? "red" : "green", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
}
