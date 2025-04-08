const Users = require("./Users");

class Games {
  constructor(database) {
    this.db = database; 
  }

  async get_posibles_oponents(user_id) {
    try {
      const query = `SELECT id, user_name FROM users WHERE id != ?
      AND id NOT IN (
      SELECT id_user_1 FROM GAMES WHERE id_user_2 = ?
      UNION
      SELECT id_user_2 FROM GAMES WHERE id_user_1 = ?
      )`;
      const result = await this.db.query(query,[user_id,user_id,user_id]);
      return result;
    } catch (error) {
      console.error('Error al obtener los posibles oponentes:', error);
    }
  }

  async get_tournament_results(){
    try {
      const query = "select user_name, points from users where points != 0 order by points desc";
      console.log(query);
      const results = await this.db.query(query);
      return {
        success: true,
        message: 'Resultados del torneo recuperados exitosamente',
        results
      }

    } catch (error) {
      return {
        success: false,
        message: 'Error al recuperar los resultados del torneo',
        error: error.message
      }
    }
  }




  // POST - Registra una nueva partida en la base de datos
  async Post_Game(id_user_1, id_user_2) {
    try {

      // escoger un game_pool que no haya sido usado por los usuarios
      const query = `SELECT id FROM game_pool WHERE id NOT IN (
        SELECT game_pool_id FROM games WHERE (id_user_1 = ? OR id_user_2 = ?) OR (id_user_1 = ? OR id_user_2 = ?)
      )`;
      const game_pool = await this.db.query(query, [id_user_1,id_user_1,id_user_2,id_user_2]);
      if (game_pool.length === 0) {
        return {
          success: false,
          message: 'No hay game_pool disponible para los usuarios seleccionados'
        };
      }
      const game_pool_id = game_pool[0].id;

      // Crear un nuevo objeto de partida
      const game = {
        id_user_1,
        id_user_2,
        game_pool_id,
        game_state: 'PROGRESS'
      };

      // Guardar la partida en la base de datos

      const result = await this.db.Save('games', game);
      return {
        success: true,
        message: 'Partida registrada exitosamente',
        result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al registrar la partida',
        error: error.message
      };
    }
  }
  // GET - Recupera partidas filtradas (por id, usuarios o game_pool_id)
  async Get_Game(user_id) {
    try {

      // se recuperan todos los juegos en progreso del usuario actual

      // aquí falta filtar por si el usuario actual ha respondido o no. se deben devolver solo las partidas que no ha respondido
      let query = `SELECT * FROM GAMES WHERE id_user_1 = ? OR id_user_2 = ? AND game_state = 'PROGRESS' `;
      const result = await this.db.query(query,[user_id, user_id]);
      return {
        success: true,
        message: 'Partidas recuperadas exitosamente',
        result
      };  
    }
    catch (error) {
      return {
        success: false,
        message: 'Error al recuperar las partidas en curso',
        error: error.message
      };
    }
  }
  
  async Finish_game(match_id) {
    try {
      // Recuperar la partida
      const query1 = `SELECT id, id_user_1, id_user_2, move_user_1, move_user_2 FROM GAMES WHERE id = ?`;
      const [match] = await this.db.query(query1, [match_id]);
  
      if (!match || match.length === 0) {
        return {
          success: false,
          message: "La partida no existe"
        };
      }
  
      // Encontrar los pesos de los movimientos
      const query2 = `SELECT weight_matrix FROM games_pool WHERE id = ?`;
      const [game_pool] = await this.db.query(query2, [match[0].game_pool_id]);
  
      if (!game_pool || game_pool.length === 0) {
        return {
          success: false,
          message: "El game pool no existe"
        };
      }
  
      const weight_matrix = JSON.parse(game_pool[0].weight_matrix); 
  
      const move_user_1 = match[0].move_user_1;
      const move_user_2 = match[0].move_user_2;
  
      // Calcular el resultado de la partida
      const points_user_1 = weight_matrix[move_user_1][move_user_2];
      const points_user_2 = weight_matrix[move_user_2][move_user_1]; 

      // Get current points
      const query3 = `SELECT points FROM users WHERE id = ?`;
      const [user1] = await this.db.query(query3, [match[0].id_user_1]);
      const [user2] = await this.db.query(query3, [match[0].id_user_2]);
  
      const currentPointsUser1 = user1[0].points;
      const currentPointsUser2 = user2[0].points;
  
      // Calculate new points
      const newPointsUser1 = currentPointsUser1 + points_user_1;
      const newPointsUser2 = currentPointsUser2 + points_user_2;
  
      // Actualizar los puntos de los jugadores
      await this.db.Update("users", { id: match[0].id_user_1, points: newPointsUser1 });
      await this.db.Update("users", { id: match[0].id_user_2, points: newPointsUser2 });
  
      // Cambiar el estado de la partida a 'FINISHED'
      await this.db.Update("games", { id: match_id, game_state: 'FINISHED' });
  
      return {
        success: true,
        message: 'Partida finalizada y puntos actualizados exitosamente'
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Error al finalizar la partida',
        error: error.message
      };
    }
  }


// ejemplo de como se veria el objeto trick
// -- {
// --   "true": {
// --     "true": 3,
// --     "false": 0
// --   },
// --   "false": {
// --     "true": 5,
// --     "false": 1
// --   }
// -- }

//  Tric debe ser true o false. true en caso de que el jugador coopere y false en caso de que el jugador no coopere


  async Post_trick(match_id, user_id, trick) {
    try {
      // Recuperar la partida
      const query = `SELECT id, id_user_1, id_user_2, move_user_1, move_user_2 FROM GAMES WHERE id = ?`;
      const match = await this.db.query(query, [match_id]);

      if (match.length === 0) {
        return {
          success: false,
          message: "La partida no existe"
        };
      }

      const game = match[0];

      // Verificar y asignar el movimiento del usuario
      if (user_id === game.id_user_1) {
        if (game.move_user_1 !== null) {
          return {
            success: false,
            message: "El usuario ya realizó su jugada"
          };
        }
        game.move_user_1 = trick;
      } else if (user_id === game.id_user_2) {
        if (game.move_user_2 !== null) {
          return {
            success: false,
            message: "El usuario ya realizó su jugada"
          };
        }
        game.move_user_2 = trick;
      } else {
        return {
          success: false,
          message: "El usuario no pertenece a esta partida"
        };
      }

      // Actualizar la partida en la base de datos
      await this.db.update("games", game);

      // Verificar si ambos jugadores han realizado sus movimientos
      if (game.move_user_1 !== null && game.move_user_2 !== null) {
        await this.Finish_game(match_id);
      }

      return {
        success: true,
        message: "Jugada registrada exitosamente"
      };
    } catch (error) {
      return {
        success: false,
        message: "No se ha podido registrar la jugada",
        error: error.message
      };
    }
  }


}
module.exports = Games;