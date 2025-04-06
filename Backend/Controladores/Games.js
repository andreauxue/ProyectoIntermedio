class Games {
    constructor(database) {
      this.db = database; // instancia de la clase Database
    }
  
    // POST - Registra una nueva partida en la base de datos
    async Post_Game(game) {
      try {
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
    async Get_Game(filter) {
      try {
        let query = 'SELECT * FROM games';
        const condiciones = [];
        const valores = [];
  
        // Genera condiciones dinámicas
        if (filter.id) {
          condiciones.push('id = ?');
          valores.push(filter.id);
        }
        if (filter.id_user_1) {
          condiciones.push('id_user_1 = ?');
          valores.push(filter.id_user_1);
        }
        if (filter.id_user_2) {
          condiciones.push('id_user_2 = ?');
          valores.push(filter.id_user_2);
        }
        if (filter.game_pool_id) {
          condiciones.push('game_pool_id = ?');
          valores.push(filter.game_pool_id);
        }
  
        if (condiciones.length > 0) {
          query += ' WHERE ' + condiciones.join(' AND ');
        }
  
        const resultados = await this.db.query(query, valores);
        return resultados;
      } catch (error) {
        return { error: error.message };
      }
    }
  }
  
  module.exports = Games;
  