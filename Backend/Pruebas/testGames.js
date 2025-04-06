const path = require('path'); 
const Database = require('../BasedeDatos/database');
const Games = require('../Controladores/Games');    

const rutaBD = path.join(__dirname, '../BasedeDatos/ProyectoIntermedio.db');
console.log('Conectando a base de datos:', rutaBD);

const db = new Database(rutaBD);
const games = new Games(db);

async function probarGames() {
  console.log('Registrando nueva partida...');
  const partida = {
    id_user_1: 1,
    id_user_2: 2,
    move_user_1: 'cooperate',
    move_user_2: 'betray',
    game_pool_id: 1
  };
  const res = await games.Post_Game(partida);
  console.log(res);

  console.log('Obteniendo partidas del usuario 1...');
  const partidas = await games.Get_Game({ id_user_1: 1 });
  console.log(partidas);
}

probarGames();
