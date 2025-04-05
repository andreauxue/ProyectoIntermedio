async function cargarPerfil() {
    const mensaje = document.getElementById('mensaje');
    const nombre = document.getElementById('nombre');
    const usuario = document.getElementById('usuario');
    const equipo = document.getElementById('equipo');
    const puntos = document.getElementById('puntos');
  
    const token = localStorage.getItem('token');
    if (!token) {
      mensaje.textContent = 'No hay sesión activa';
      return;
    }
  
    try {
      const respuesta = await fetch('http://localhost:3000/api/perfil', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
  
      const datos = await respuesta.json();
      console.log('Respuesta del backend:', datos);
  
      if (datos.success) {
        mensaje.textContent = datos.message;
  
        // Mostrar los datos del usuario
        nombre.textContent = datos.user.complete_name;
        usuario.textContent = datos.user.user_name;
        equipo.textContent = datos.user.team_number;
        puntos.textContent = datos.user.points;
      } else {
        mensaje.style.color = 'red';
        mensaje.textContent = datos.message || 'Token inválido o expirado';
      }
    } catch (err) {
      console.error(' Error al cargar perfil:', err);
      mensaje.textContent = 'Error de conexión con el servidor';
    }
  }
  