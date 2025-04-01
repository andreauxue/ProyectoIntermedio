class Database {

    constructor(connection, configDB) {
        this.connection = connection;
        this.configDB = configDB;
    }

    /**
     * Establece la conexión con la base de datos.
     * @returns {void}
     */
    async conectar() {
        try {
            this.connection = await mysql.createConnection(this.configDB);
            const [filas] = await conexion.execute('SELECT * FROM users');
            console.log(filas);
        } catch (error) {
            throw new Error(`Error al conectar a la base de datos: ${error.message}`);
        }
    }

    /**
     * Cierra la conexión con la base de datos.
     * @returns {void}
     */
    async cerrar() {
        try {
            if (this.connection && this.connection.state !== 'disconnected') {
                await this.connection.end();
                console.log('Conexión cerrada con la base de datos.');
                this.connection = null;
            }
        } catch (error) {
            throw new Error(`Error al cerrar la conexión con la base de datos: ${error.message}`);
        }
    }

    /**
     * Guarda registros en una tabla de la base de datos.
     * @param {string} table_name - Nombre de la tabla donde se insertarán los datos.
     * @param {Array} contents - Contenido a insertar en la tabla.
     * @returns {Object|Error} - Resultado de la operación o un objeto con el mensaje de error.
     */
    async Save(table_name, contents) {
        try {
            const query = 'INSERT INTO ${table_name} VALUES ?';
            const [result] = await this.connection.execute(query, [contents]);
            return result;
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * Actualiza un registro en una tabla de la base de datos.
     * @param {string} table_name - Nombre de la tabla donde se actualizarán los datos.
     * @param {Object} user - Objeto que contiene los datos a actualizar, incluyendo el campo 'id'.
     * @returns {Object|Error} - Resultado de la operación o un objeto con el mensaje de error.
     */
    async Update(table_name, user) {
        const { id, ...campos } = user;
        const columnas = Object.keys(campos);
        const valores = Object.values(campos);
    
        const set = columnas.map(col => '${col} = ?').join(', ');
        const query = 'UPDATE ${table_name} SET ${set} WHERE id = ?';
    
        valores.push(id);
    
        return await this.connection.execute(query, valores);
    }
    
    /**
     * Obtiene todos los registros de una tabla.
     * @param {string} table_name - Nombre de la tabla de la cual se obtendrán los registros.
     * @returns {Array|Error} - Lista de registros o un objeto con el mensaje de error.
     */
    async Get_table_registers(table_name) {
        try {
            const query = 'SELECT * FROM ${table_name}';
            const [rows] = await this.connection.execute(query);
            return rows;
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * Ejecuta una consulta SQL personalizada.
     * @param {string} sql - Consulta SQL a ejecutar.
     * @returns {Array|Error} - Resultado de la consulta o un objeto con el mensaje de error.
     */
    async Query(sql) {
        try {
          await this.conectar();
          const [rows] = await this.connection.execute(sql);
          return rows;
        } catch (error) {
          return { error: error.message };
        } finally {
          await this.cerrar();
        }
      }

}
