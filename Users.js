class Users {
    constructor(id, username, complete_name, email, team, password) {
        let _id = id; // Variable privada con let
        let _username = username;     // Variable privada con let
        let _complete_name = complete_name; // Variable privada con let
        let _email = email;     // Variable privada con let
        let _team = team; // Variable privada con let
        let _password = password;     // Variable privada con let     
}



static async Put_User(req, res) {
    try {
      const { id, username, complete_name, email, team, password1, password2 } = req.body;

      if (!id || !username || !complete_name || !email || !team || !password1 || !password2) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      if (password1 !== password2) {
        return res.status(400).json({ error: "Las contraseñas no coinciden" });
      }

      const hashedPassword = Auth.encode(password1);

      const userData = {
        id,
        username,
        complete_name,
        email,
        team,
        password: hashedPassword,
      };

      Database.Save("USERS", [userData]);

      return res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }


  static async Get_User(req, res) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ error: "El nombre de usuario es obligatorio" });
      }

      const query = `SELECT * FROM USERS WHERE USERNAME = '${username}'`;
      const user = await Database.Query(query);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }


  static async Get_ListUsers(res) {
    try {
      const users = await Database.get_table_registers("USERS");

      if (!users || users.length==0) {
        return res.status(400).json({ error: "No se encontraron usuarios" });
      }

      const usersFiltered = users
            .map(({password, ...user})=> user)
            .sort((a,b)=> b.points - a.points);

      return res.status(200).json(usersFiltered);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async Update_User(user) {
      try {
        await Database.update("USERS", user);
        return { message: "Usuario actualizado correctamente" };
      } catch (error) {
        return { error: "Error al actualizar el usuario" };
      }
    }



  static async Login(req, res){
    try{
      const {username, password} = req.body;
      if(!username || !password){
        return res.status(400).json({error: "Faltan datos"});
      }

      const hashedPassword = await Auth.encode(password);

      const query = `SELECT * FROM USERS WHERE USERNAME = '${username}'`;
      const user = await Database.Query(query);

      if(!user){
        return res.status(401).json({error: "Usuario incorrecto"});
      }

      if(user.password != hashedPassword){
        return res.status(401).json({error: "Contraseña incorrecta"});
      }

      const userJson = await Auth.create_json(user);
      return res.status(200).json(userJson);
    }catch(error){
      return res.status(500).json({error: "Error interno del servidor"});
    }
  }
}

