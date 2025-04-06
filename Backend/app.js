const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const Database = require('./BasedeDatos/database');
const Users = require('./Controladores/Users');
const Auth = require('./Controladores/Auth');

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
app.get('/perfil', (req, res) => {
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
  

  
  
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
