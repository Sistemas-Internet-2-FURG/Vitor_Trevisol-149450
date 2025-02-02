from flask import Flask, request, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permitir requisições do front-end React
app.secret_key = 'secret_key'  # Pode ser removido se não for usar sessões

# Conexão com o banco de dados
def get_db_connection():
    conn = sqlite3.connect('biblioteca.db')
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON;')
    return conn

# Criar tabelas no banco de dados
def init_db():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS Generos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    )
    ''')
    conn.execute('''
    CREATE TABLE IF NOT EXISTS Livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        genero_id INTEGER,
        FOREIGN KEY(genero_id) REFERENCES Generos(id) ON DELETE RESTRICT
    )
    ''')
    conn.execute('''
    CREATE TABLE IF NOT EXISTS Usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
    ''')
    conn.commit()
    conn.close()

# Registro de usuário
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Usuário e senha são obrigatórios."}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO Usuarios (username, password) VALUES (?, ?)', (username, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({"message": "Nome de usuário já existe."}), 400
    finally:
        conn.close()

    return jsonify({"message": "Usuário registrado com sucesso."}), 201

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM Usuarios WHERE username = ?', (username,)).fetchone()
    conn.close()

    if user:
        if check_password_hash(user['password'], password):  # Usa hash para segurança
            return jsonify({"message": "Login realizado com sucesso."}), 200
        else:
            return jsonify({"message": "Senha incorreta."}), 401
    return jsonify({"message": "Usuário não encontrado."}), 401


# Listar e adicionar gêneros
@app.route('/generos', methods=['GET', 'POST'])
def generos():
    conn = get_db_connection()

    if request.method == 'POST':
        data = request.json
        nome = data.get('nome')

        if not nome:
            return jsonify({"message": "Nome do gênero é obrigatório"}), 400

        try:
            conn.execute('INSERT INTO Generos (nome) VALUES (?)', (nome,))
            conn.commit()
        except sqlite3.IntegrityError:
            return jsonify({"message": "Gênero já existe."}), 400
        finally:
            conn.close()

        return jsonify({"message": "Gênero adicionado com sucesso"}), 201

    generos = conn.execute('SELECT * FROM Generos').fetchall()
    conn.close()
    return jsonify([{"id": g["id"], "nome": g["nome"]} for g in generos])

# Deletar gênero
@app.route('/delete_genero/<int:id>', methods=['DELETE'])
def delete_genero(id):
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM Generos WHERE id = ?', (id,))
        conn.commit()
        return jsonify({"message": "Gênero deletado com sucesso"}), 200
    except sqlite3.IntegrityError:
        return jsonify({"message": "Não é possível excluir o gênero porque ele está sendo usado"}), 400
    finally:
        conn.close()

# Listar e adicionar livros
@app.route('/livros', methods=['GET', 'POST'])
def livros():
    conn = get_db_connection()

    if request.method == 'POST':
        data = request.json
        titulo = data.get('titulo')
        autor = data.get('autor')
        genero_id = data.get('genero_id')

        if not titulo or not autor or not genero_id:
            return jsonify({"message": "Todos os campos são obrigatórios"}), 400

        try:
            conn.execute('INSERT INTO Livros (titulo, autor, genero_id) VALUES (?, ?, ?)', 
                         (titulo, autor, genero_id))
            conn.commit()
        except sqlite3.IntegrityError:
            return jsonify({"message": "Erro ao adicionar livro"}), 400
        finally:
            conn.close()

        return jsonify({"message": "Livro adicionado com sucesso"}), 201

    livros = conn.execute('''
    SELECT Livros.id, Livros.titulo, Livros.autor, Generos.nome AS genero 
    FROM Livros 
    JOIN Generos ON Livros.genero_id = Generos.id
    ''').fetchall()
    conn.close()
    return jsonify([{"id": l["id"], "titulo": l["titulo"], "autor": l["autor"], "genero": l["genero"]} for l in livros])

# Deletar livro
@app.route('/delete_livro/<int:id>', methods=['DELETE'])
def delete_livro(id):
    print(id)
    conn = get_db_connection()
    conn.execute('DELETE FROM Livros WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Livro deletado com sucesso"}), 200

if __name__ == '__main__':
    init_db()  # Cria as tabelas se não existirem
    app.run(debug=True)
