﻿# ProyectoIntermedio
# Instrucciones del Frontend: Login, Registro y Rutas Protegidas

---

# 1. Requisitos del Proyecto

- Node.js v18 o superior
- SQLite3
- Git
- Navegador moderno (Chrome, Firefox)

---

# 2. Instrucciones para ejecutar el proyecto desde la rama Andrea


## 1. Clona el repositorio y entra al proyecto
git clone https://github.com/andreauxue/ProyectoIntermedio.git

git checkout Andrea

cd ProyectoIntermedio

cd Backend

## 2. Instala las dependencias
npm install

## 3. Inicia el servidor
node app.js

## 4. Abre en el navegador
http://localhost:3000/register


---

# 3. Estructura del Login y Registro

### Frontend:
- `login.html` y `register.html` contienen los formularios.
- `login.js` y `register.js` manejan las solicitudes POST a `/login` y `/register`.
- El token se guarda en `localStorage` tras el login.

### Backend:
- `POST /login`: Verifica credenciales, genera token con hash y timestamp.
- `POST /register`: Guarda nuevos usuarios en la tabla `users`.
- `Auth.create_json()`: Genera un objeto tipo token con `username`, `date` y `hash`.

---

# 4. Protección de Rutas

- El token se guarda en `localStorage` tras el login.
- Para acceder a rutas protegidas como `/api/perfil`, el frontend debe enviar el token en el header `Authorization`.
- Middleware `verificarToken` en el backend revisa que el token exista, sea válido y no haya expirado (1 hora).

---

# 5. Flujo Completo del Login y Perfil

1. Usuario entra a `/login` y se autentica.
2. Se guarda el token en `localStorage`.
3. Navega a `/perfil`, donde `profile.js` hace una solicitud a `/api/perfil`.
4. El backend valida el token y responde con los datos del usuario.
5. El frontend los muestra dinámicamente en la vista de perfil.

---

