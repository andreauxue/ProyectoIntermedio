class Users {
    constructor(id, username, complete_name, email, team, password) {
        let _id = id; // Variable privada con let
        let _username = username;     // Variable privada con let
        let _complete_name = complete_name; // Variable privada con let
        let _email = email;     // Variable privada con let
        let _team = team; // Variable privada con let
        let _password = password;     // Variable privada con let     
}


static async put_user(req, res) {
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

      Database.Save('users', [userData]);

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

      const query = `SELECT * FROM users WHERE username = '${username}'`;
      const user = await Database.Query(query);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

