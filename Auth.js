class Auth {
    static create_json(user) {
        const fecha = Date.now();
        const jwtData = { username: user.username, date: fecha };
        const hash = this.encode(JSON.stringify(jwtData));
        return { hash, date: fecha };
    }

    static encode(texto) {
        const crypto = require('crypto'); // Esto SOLO funciona en Node.js
        return crypto.createHash('sha256').update(texto).digest('hex');
    }

    static validate_json(jwt_token) {
        const ahora = Date.now();
        const fechaToken = jwt_token.date;
        return (ahora - fechaToken) < 3600000; // 1 hora
    }
}

// Prueba
const user = { username: 'alex' };
const jwt = Auth.create_json(user);
console.log('Token generado:', jwt);
console.log('¿Es válido?', Auth.validate_json(jwt));