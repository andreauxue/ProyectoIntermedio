const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const Database = require('./BasedeDatos/database');
const Users = require('./Controladores/Users');
const Auth = require('./Controladores/Auth');

const Games = require('./Controladores/Games');  


const app = express();
const PORT = 3000;


// Middlewares
app.use(cors());
app.use(bodyParser.json());
// Archivos estáticos (HTML, CSS, JS) desde Frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

// Conexión a la base de datos
const db = new Database(path.join(__dirname, './BasedeDatos/ProyectoIntermedio.db'));
const users = new Users(db);
const games = new Games(db);

// Ruta POST /login
app.post('/login', async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
  }

  const login = await users.Post_AuthUser(user_name, password);

  if (!login.success) {
    return res.status(401).json({ success: false, message: login.message });
  }

  const token = Auth.create_json({ username: login.user.user_name });
  

  return res.json({
    success: true,
    message: login.message,
    token: token,
    user: login.user
  });
});

app.post('/register', async (req, res) => {
    const { complete_name, team_number, user_name, password } = req.body;
  
    if (!complete_name || !team_number || !user_name || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
    }
  
    const nuevoUsuario = {
      complete_name,
      team_number,
      user_name,
      points: 0,
      password
    };
  
    try {
      const resultado = await db.Save('users', nuevoUsuario);
      return res.json({ success: true, message: 'Usuario registrado correctamente', id: resultado.lastID });
    } catch (error) {
      console.error('ERROR al registrar usuario:', error); 
      return res.status(500).json({ success: false, message: 'Error al registrar', error: error.message });
    }
  });
  
  function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }
  
    try {
      const parsedToken = JSON.parse(token); 
      const esValido = Auth.validate_json(parsedToken);
  
      if (!esValido) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
      }
  
      req.usuario = parsedToken.username || 'Usuario'; // si se tiene username
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token no válido' });
    }
  }
  


// Ruta para servir el HTML del login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/register.html'));
  });

// Esta ruta está protegida, requiere autenticación
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/profile.html'));
  });
  app.get('/api/perfil', verificarToken, async (req, res) => {
    const user = await users.Get_User(req.usuario); // busca al usuario completo
  
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  
    res.json({
      success: true,
      message: `Bienvenida, ${user.complete_name}`,
      user: user
    });
  });

  
  // Endpoint para obtener posibles oponentes
app.get('/get-posible-oponents/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await games.get_posibles_oponents(user_id);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener los posibles oponentes:', error);
    res.status(500).json({ error: 'Error al obtener los posibles oponentes' });
  }
});
  
  // Endpoint para obtener resultados del torneo
app.get('/get-tournament-results', async (req, res) => {
  try {
    const result = await games.get_tournament_results();
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los resultados del torneo' });
  }
});
  
// Endpoint para registrar una nueva partida
app.post('/match-register', async (req, res) => {
  const { id_user_1, id_user_2 } = req.body;
  try {
    const result = await games.Post_Game(id_user_1, id_user_2);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al registrar la partida:', error);
    res.status(500).json({ error: 'Error al registrar la partida' });
  }
});

// Endpoint para recuperar partidas filtradas
app.get('/matches/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await games.Get_Game(user_id);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al recuperar las partidas en curso:', error);
    res.status(500).json({ error: 'Error al recuperar las partidas en curso' });
  }
});

// ebndpoint para guardar una jugada
app.post('/post-trick/:match_id/:user_id/:trick_id', async (req, res) => {
  const { match_id, user_id, trick_id } = req.params;
  try {
    const result = await games.Post_Trick(match_id, user_id, trick_id);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al actualizar la partida:', error);
    res.status(500).json({ error: 'Error al actualizar la partida' });
  }
});


  
  
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
