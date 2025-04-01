const path = require('path');
const Database = require('./Database');
const Users = require('./Users');
const Auth = require('./Auth'); // Asegúrate de tener Auth.js en el mismo directorio

const config = {
  db: path.join(__dirname, 'ProyectoIntermedio.db')
};

async function probar() {
  const db = new Database(config.db);
  const users = new Users(db);

  console.log(' Probando listado de usuarios...');
  console.log(' Agregando usuario de prueba...');
    await db.Save('users', {
      complete_name: 'Andrea Uxue',
      team_number: 1,
      user_name: 'andrea',
      points: 10,
      password: '1234'
    });
  const lista = await users.Get_ListUsers();
  console.log(lista);

  console.log(' Buscando usuario andrea...');
  const uno = await users.Get_User('andrea');
  console.log(uno);

  console.log(' Autenticando usuario andrea...');
  const login = await users.Post_AuthUser('andrea', '1234');
  console.log(login);

  //  Si autenticación fue exitosa, generamos token con Auth
  if (login.success) {
    const token = Auth.create_json({ username: login.user.user_name });
    console.log(' Token generado:', token);

    //  Validamos el token
    const esValido = Auth.validate_json(token);
    console.log(' ¿Token válido?', esValido);
  }

  console.log(' Actualizando usuario...');
  const actualizacion = await users.Put_User({
    id: uno.id,
    complete_name: 'Andrea U. Actualizada',
    team_number: 3,
    user_name: 'andrea',
    points: uno.points + 5,
    password: '1234'
  });
  console.log(actualizacion);
}

probar();
