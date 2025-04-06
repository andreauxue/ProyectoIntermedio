async function iniciarSesion() {
    const user_name = document.getElementById('usuario').value;
    const password = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');

    const respuesta = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name, password })
    });

    const datos = await respuesta.json();
    console.log('Respuesta del backend:', datos);

    if (datos.success) {
      mensaje.style.color = 'green';
      mensaje.textContent = 'Login exitoso';
      localStorage.setItem('token', JSON.stringify(datos.token));
      window.location.href = '/perfil'; 
    } else {
      mensaje.style.color = 'red';
      mensaje.textContent = datos.message || 'Error al iniciar sesión';
    }
  }

  