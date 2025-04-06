async function registrarse() {
    const complete_name = document.getElementById('nombre').value;
    const team_number = parseInt(document.getElementById('equipo').value);
    const user_name = document.getElementById('usuario').value;
    const password = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');

    const respuesta = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complete_name, team_number, user_name, password })
    });

    const datos = await respuesta.json();

    if (datos.success) {
      mensaje.style.color = 'green';
      mensaje.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
    } else {
      mensaje.style.color = 'red';
      mensaje.textContent = datos.message || 'Error al registrar.';
    }
  }