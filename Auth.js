class Auth {
    static create_json(user) {
      const fecha = Date.now();
      const jwtData = { username: user.username, date: fecha };
      const hash = this.encode(JSON.stringify(jwtData));
      return { hash, date: fecha };
    }
  
    static encode(texto) {
      const crypto = require('crypto');
      return crypto.createHash('sha256').update(texto).digest('hex');
    }
  
    static validate_json(jwt_token) {
      const ahora = Date.now();
      return (ahora - jwt_token.date) < 3600000; // 1 hora
    }
  }
  
  module.exports = Auth;
  