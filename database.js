const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

class Database {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
  }

  async conectar() {
    if (!this.db) {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });
    }
  }

  async cerrar() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  // Método: Save (table_name, content)
  // Inserta uno o varios registros en la tabla
  async Save(table_name, content) {
    try {
      await this.conectar();
      const keys = Object.keys(content);
      const values = Object.values(content);
      const placeholders = keys.map(() => '?').join(', ');
      const sql = `INSERT INTO ${table_name} (${keys.join(',')}) VALUES (${placeholders})`;
      const result = await this.db.run(sql, values);
      await this.cerrar();
      return result;
    } catch (error) {
      return { error: error.message };
    } finally {
      await this.cerrar();
    }
  }

  // Método: Update (table_name, content)
  // Actualiza un registro por ID
  async update(table_name, content) {
    try {
      await this.conectar();
      const { id, ...campos } = content;
      const keys = Object.keys(campos);
      const values = Object.values(campos);
      const setSQL = keys.map(k => `${k} = ?`).join(', ');
      const sql = `UPDATE ${table_name} SET ${setSQL} WHERE id = ?`;

      values.push(id); // para el WHERE

      const result = await this.db.run(sql, values);
      return result;
    } catch (error) {
      return { error: error.message };
    } finally {
      await this.cerrar();
    }
  }

  // Método: Get_table_registers (table_name)
  async Get_table_registers(table_name) {
    try {
      await this.conectar();
      const sql = `SELECT * FROM ${table_name}`;
      const rows = await this.db.all(sql);
      return rows;
    } catch (error) {
      return { error: error.message };
    } finally {
      await this.cerrar();
    }
  }

  // Método: Query (query: string)
  async query(query, params = []) {
    await this.conectar();
    const rows = await this.db.all(query, params);
    await this.cerrar();
    return rows;
  }
  
}

module.exports = Database;
