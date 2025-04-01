class Users {
  constructor(database) {
      this.db = database; // Instancia de Database
  }

  // PUT - Actualiza los datos de un usuario
  async Put_User(user) {
      try {
          const result = await this.db.update('users', user);
          return { success: true, message: 'Usuario actualizado correctamente', result };
      } catch (error) {
          return { success: false, message: 'Error al actualizar usuario', error: error.message };
      }
  }

  // POST - Autenticación con username y password
  async Post_AuthUser(username, password) {
      try {
          const query = `SELECT * FROM users WHERE user_name = ?`;
          const resultados = await this.db.query(query, [username]);

          if (resultados.length === 0) {
              return { success: false, message: 'Usuario no encontrado' };
          }

          const usuario = resultados[0];
          if (usuario.password !== password) {
              return { success: false, message: 'Contraseña incorrecta' };
          }

          return {
              success: true,
              message: 'Autenticación exitosa',
              user: {
                  id: usuario.id,
                  complete_name: usuario.complete_name,
                  team_number: usuario.team_number,
                  user_name: usuario.user_name,
                  points: usuario.points
              }
          };
      } catch (error) {
          return { success: false, message: 'Error al autenticar', error: error.message };
      }
  }

  // GET - Obtener un usuario por username
  async Get_User(username) {
      try {
          const query = `SELECT id, complete_name, team_number, user_name, points FROM users WHERE user_name = ?`;
          const resultados = await this.db.query(query, [username]);
          return resultados.length > 0 ? resultados[0] : null;
      } catch (error) {
          return null;
      }
  }

  // GET - Listar todos los usuarios
  async Get_ListUsers() {
      try {
          const query = `SELECT id, complete_name, team_number, user_name, points FROM users`;
          return await this.db.query(query);
      } catch (error) {
          return [];
      }
  }
}
module.exports = Users;
