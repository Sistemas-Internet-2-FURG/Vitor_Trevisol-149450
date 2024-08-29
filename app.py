from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
from functools import wraps
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import time
 

app = Flask(__name__)
app.secret_key = 'secret_key'  # Chave secraeta para gerenciar sessões

# Função para conectar ao banco de dados
def get_db_connection():
    conn = sqlite3.connect('biblioteca.db')
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON;')
    return conn

# Decorador para proteger rotas
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('Você precisa estar logado para acessar esta página.')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    conn = get_db_connection()
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = conn.execute('SELECT * FROM Usuarios WHERE username = ?', (username,)).fetchone()
        if user and user['password'] == password:
            session['logged_in'] = True
            return redirect(url_for('index'))
        else:
            flash('Credenciais inválidas. Tente novamente.')
            return redirect(url_for('register'))

    conn.close()
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    conn = get_db_connection()
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        try:
            conn.execute('INSERT INTO Usuarios (username, password) VALUES (?, ?)', (username, password))
            conn.commit()
            flash('Usuário criado com sucesso!')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('Nome de usuário já existe. Escolha outro.')
            return redirect(url_for('register'))
    
    conn.close()
    return render_template('register.html')

# Página de logout
@app.route('/logout')
@login_required
def logout():
    session.pop('logged_in', None)
    flash('Você foi deslogado com sucesso.')
    return redirect(url_for('login'))

# Página inicial
@app.route('/')
@login_required
def index():
    return render_template('index.html')

# Exibir e adicionar gêneros
@app.route('/generos', methods=['GET', 'POST'])
@login_required
def generos():
    conn = get_db_connection()
    if request.method == 'POST':
        nome = request.form['nome']
        conn.execute('INSERT INTO Generos (nome) VALUES (?)', (nome,))
        conn.commit()
        return redirect(url_for('generos'))

    generos = conn.execute('SELECT * FROM Generos').fetchall()
    conn.close()
    return render_template('generos.html', generos=generos)

# Exibir e adicionar livros
@app.route('/livros', methods=['GET', 'POST'])
@login_required
def livros():
    conn = get_db_connection()
    if request.method == 'POST':
        titulo = request.form['titulo']
        autor = request.form['autor']
        genero_id = request.form['genero_id']
        print(genero_id)
        print('------------')
        conn.execute('INSERT INTO Livros (titulo, autor, genero_id) VALUES (?, ?, ?)', (titulo, autor, genero_id))
        conn.commit()
        return redirect(url_for('livros'))

    livros = conn.execute('''
    SELECT Livros.id, Livros.titulo, Livros.autor, Generos.nome AS genero 
    FROM Livros 
    JOIN Generos ON Livros.genero_id = Generos.id
    ''').fetchall()
    generos = conn.execute('SELECT * FROM Generos').fetchall()
    conn.close()
    return render_template('livros.html', livros=livros, generos=generos)

# Deletar livro
@app.route('/delete_livro/<int:id>')
@login_required
def delete_livro(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM Livros WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('livros'))

# Deletar gênero
@app.route('/delete_genero/<int:id>')
@login_required
def delete_genero(id):
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM Generos WHERE id = ?', (id,))
        conn.commit()
        flash('Gênero deletado com sucesso.')
    except sqlite3.IntegrityError:
        flash('Não é possível excluir o gênero porque ele está sendo usado por um livro.')
    finally:
        conn.close()
    return redirect(url_for('generos'))



if __name__ == '__main__':
    # Configurações de banco de dados (criação das tabelas)
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS Generos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
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
    conn.close()

    # Iniciar o servidor Flask
    app.run(debug=True)
