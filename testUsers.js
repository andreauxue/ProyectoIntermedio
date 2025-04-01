const path = require('path');
const Database = require('./Database');
const Users = require('./Users');

const config = {
  db: path.join(__dirname, 'ProyectoIntermedio.db')
};


async function probar() {
  const db = new Database(config.db);
  const users = new Users(db);

  console.log('🔹 Probando listado de usuarios...');
  const lista = await users.Get_ListUsers();
  console.log(lista);

  console.log('🔹 Buscando usuario andrea...');
  const uno = await users.Get_User('andrea');
  console.log(uno);

  console.log('🔹 Autenticando usuario andrea...');
  const login = await users.Post_AuthUser('andrea', '1234');
  console.log(login);

  console.log('🔹 Actualizando usuario...');
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
