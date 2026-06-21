// ============================================================
// CONFIGURACION GENERAL
// ============================================================

const API_URL = 'http://localhost:3000/api';


// ============================================================
// SESION / AUTENTICACION
// ============================================================

function guardarSesion(token, usuario) {
  localStorage.setItem('fg_token', token);
  localStorage.setItem('fg_usuario', JSON.stringify(usuario));
}

function obtenerToken() {
  return localStorage.getItem('fg_token');
}

function obtenerUsuario() {
  const data = localStorage.getItem('fg_usuario');
  return data ? JSON.parse(data) : null;
}

function cerrarSesion() {
  localStorage.removeItem('fg_token');
  localStorage.removeItem('fg_usuario');
  window.location.href = 'login.html';
}

function haySesionActiva() {
  return !!obtenerToken();
}


// ============================================================
// FILTROS Y VISTA DE GRILLA (galeria / ofertas / eventos)
// ============================================================

function filtrar(categoria, btn) {
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const grid = document.getElementById('productos-grid')
    || document.getElementById('galeria-grid')
    || document.getElementById('ofertas-grid');
  if (!grid) return;

  grid.querySelectorAll('.product-card').forEach(card => {
    if (categoria === 'todo' || card.dataset.categoria === categoria) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function cambiarVista(tipo, icon) {
  document.querySelectorAll('.grid-icon').forEach(i => i.classList.remove('active-icon'));
  icon.classList.add('active-icon');

  const grid = document.getElementById('productos-grid')
    || document.getElementById('galeria-grid')
    || document.getElementById('ofertas-grid');
  if (!grid) return;

  grid.querySelectorAll('.product-card').forEach(card => {
    if (tipo === 'lista') {
      card.className = card.className.replace('col-md-4', 'col-md-6');
      card.className = card.className.replace('col-md-3', 'col-md-6');
    } else {
      card.className = card.className.replace('col-md-6', 'col-md-4');
    }
  });
}


// ============================================================
// FORMULARIO DE CONTACTO (contactanos.html / eventos)
// ============================================================

function enviarFormulario() {
  let valido = true;

  document.querySelectorAll('.campo-error').forEach(e => e.style.display = 'none');
  document.querySelectorAll('.campo-input').forEach(i => i.classList.remove('input-error'));

  const nombre = document.getElementById('nombre');
  if (nombre && !nombre.value.trim()) {
    document.getElementById('error-nombre').style.display = 'block';
    nombre.classList.add('input-error');
    valido = false;
  }

  const apellido = document.getElementById('apellido');
  if (apellido && !apellido.value.trim()) {
    document.getElementById('error-apellido').style.display = 'block';
    apellido.classList.add('input-error');
    valido = false;
  }

  const correo = document.getElementById('correo');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo && !emailRegex.test(correo.value.trim())) {
    document.getElementById('error-correo').style.display = 'block';
    correo.classList.add('input-error');
    valido = false;
  }

  const telefono = document.getElementById('telefono');
  if (telefono && (!telefono.value.trim() || telefono.value.trim().length < 7)) {
    document.getElementById('error-telefono').style.display = 'block';
    telefono.classList.add('input-error');
    valido = false;
  }

  if (valido) {
    document.getElementById('mensaje-exito').style.display = 'block';
    if (nombre)    nombre.value    = '';
    if (apellido)  apellido.value  = '';
    if (correo)    correo.value    = '';
    if (telefono)  telefono.value  = '';
    const evento = document.getElementById('evento');
    const comentarios = document.getElementById('comentarios');
    if (evento)      evento.value      = '';
    if (comentarios) comentarios.value = '';
  }
}


// ============================================================
// LOGIN / REGISTRO (login.html)
// ============================================================

function cambiarTab(tab) {
  const tabLogin = document.getElementById('tab-login');
  const tabRegistro = document.getElementById('tab-registro');
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');

  if (!tabLogin || !tabRegistro || !formLogin || !formRegistro) return;

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabRegistro.classList.remove('active');
    formLogin.style.display = 'flex';
    formRegistro.style.display = 'none';
  } else {
    tabRegistro.classList.add('active');
    tabLogin.classList.remove('active');
    formRegistro.style.display = 'flex';
    formLogin.style.display = 'none';
  }
}

async function registrar() {
  const nombreInput = document.getElementById('registro-nombre');
  const emailInput = document.getElementById('registro-email');
  const passwordInput = document.getElementById('registro-password');
  const error = document.getElementById('registro-error');

  if (!nombreInput || !emailInput || !passwordInput) return;

  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  error.style.display = 'none';
  [nombreInput, emailInput, passwordInput].forEach(i => i.classList.remove('input-error'));

  if (!nombre) {
    mostrarErrorLogin(error, 'Ingresa tu nombre completo');
    nombreInput.classList.add('input-error');
    return;
  }
  if (!emailRegex.test(email)) {
    mostrarErrorLogin(error, 'Ingresa un correo electrónico válido');
    emailInput.classList.add('input-error');
    return;
  }
  if (password.length < 6) {
    mostrarErrorLogin(error, 'La contraseña debe tener al menos 6 caracteres');
    passwordInput.classList.add('input-error');
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mostrarErrorLogin(error, data.error || 'No se pudo completar el registro');
      return;
    }

    guardarSesion(data.token, data.usuario);
    window.location.href = '../index.html';

  } catch (err) {
    mostrarErrorLogin(error, 'No se pudo conectar con el servidor');
  }
}

async function iniciarSesion() {
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const error = document.getElementById('login-error');

  if (!emailInput || !passwordInput) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  error.style.display = 'none';
  [emailInput, passwordInput].forEach(i => i.classList.remove('input-error'));

  if (!emailRegex.test(email)) {
    mostrarErrorLogin(error, 'Ingresa un correo electrónico válido');
    emailInput.classList.add('input-error');
    return;
  }
  if (!password) {
    mostrarErrorLogin(error, 'Ingresa tu contraseña');
    passwordInput.classList.add('input-error');
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mostrarErrorLogin(error, data.error || 'Correo o contraseña incorrectos');
      return;
    }

    guardarSesion(data.token, data.usuario);
    window.location.href = '../index.html';

  } catch (err) {
    mostrarErrorLogin(error, 'No se pudo conectar con el servidor');
  }
}

function mostrarErrorLogin(elementoError, mensaje) {
  if (!elementoError) return;
  elementoError.textContent = mensaje;
  elementoError.style.display = 'block';
}


// ============================================================
// CARRITO DE COMPRAS (conectado al backend)
// ============================================================

// Agrega un producto al carrito en el backend.
// productoId debe coincidir con el id real en la tabla `productos`.
async function agregarAlCarrito(productoId, nombre) {
  if (!haySesionActiva()) {
    mostrarToast('Inicia sesión para agregar productos al carrito');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/carrito`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${obtenerToken()}`
      },
      body: JSON.stringify({ producto_id: productoId, cantidad: 1 })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mostrarToast(data.error || 'No se pudo agregar el producto');
      return;
    }

    mostrarToast(`"${nombre}" añadido al carrito`);
    actualizarContadorCarrito();

  } catch (err) {
    mostrarToast('No se pudo conectar con el servidor');
  }
}

async function eliminarDelCarrito(carritoId) {
  try {
    const respuesta = await fetch(`${API_URL}/carrito/${carritoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${obtenerToken()}`
      }
    });

    if (!respuesta.ok) {
      const data = await respuesta.json();
      mostrarToast(data.error || 'No se pudo eliminar el producto');
      return;
    }

    // Recargamos la lista del carrito para reflejar el cambio
    cargarCarrito();

  } catch (err) {
    mostrarToast('No se pudo conectar con el servidor');
  }
}

// Pinta el contenido completo de carrito.html pidiendo los datos al backend
async function cargarCarrito() {
  const sinSesion = document.getElementById('carrito-sin-sesion');
  const vacio = document.getElementById('carrito-vacio');
  const contenido = document.getElementById('carrito-contenido');
  const cargando = document.getElementById('carrito-cargando');
  const lista = document.getElementById('carrito-lista');
  const total = document.getElementById('carrito-total');

  // Esta función solo aplica en carrito.html
  if (!lista) return;

  if (!haySesionActiva()) {
    if (cargando) cargando.style.display = 'none';
    if (sinSesion) sinSesion.style.display = 'block';
    if (vacio) vacio.style.display = 'none';
    if (contenido) contenido.style.display = 'none';
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/carrito`, {
      headers: { 'Authorization': `Bearer ${obtenerToken()}` }
    });

    if (respuesta.status === 401) {
      // Token vencido o inválido
      cerrarSesion();
      return;
    }

    const productos = await respuesta.json();

    if (cargando) cargando.style.display = 'none';
    if (sinSesion) sinSesion.style.display = 'none';

    if (!productos.length) {
      if (vacio) vacio.style.display = 'block';
      if (contenido) contenido.style.display = 'none';
      actualizarContadorCarrito(0);
      return;
    }

    if (vacio) vacio.style.display = 'none';
    if (contenido) contenido.style.display = 'block';

    lista.innerHTML = '';
    let suma = 0;
    let totalItems = 0;

    productos.forEach(item => {
      const precioUnitario = Number(item.precio);
      const subtotal = precioUnitario * item.cantidad;
      suma += subtotal;
      totalItems += item.cantidad;

      const fila = document.createElement('div');
      fila.className = 'carrito-fila d-flex justify-content-between align-items-center';
      fila.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <img src="${item.imagen_url}" alt="${item.nombre}" class="carrito-imagen" />
          <div>
            <p class="carrito-nombre">${item.nombre}</p>
            <p class="carrito-cantidad">Cantidad: ${item.cantidad}</p>
          </div>
        </div>
        <div class="d-flex align-items-center gap-3">
          <span class="carrito-precio">$${subtotal.toLocaleString('es-CO')}</span>
          <button class="carrito-eliminar" onclick="eliminarDelCarrito(${item.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      lista.appendChild(fila);
    });

    if (total) total.textContent = `$${suma.toLocaleString('es-CO')}`;
    actualizarContadorCarrito(totalItems);

  } catch (err) {
    if (cargando) cargando.textContent = 'No se pudo cargar el carrito. Intenta de nuevo más tarde.';
  }
}

// Actualiza el contador del ícono de carrito en la barra superior (todas las páginas)
async function actualizarContadorCarrito(totalConocido) {
  const counter = document.getElementById('carrito-counter');
  if (!counter) return;

  if (!haySesionActiva()) {
    counter.textContent = '';
    return;
  }

  if (typeof totalConocido === 'number') {
    counter.textContent = totalConocido > 0 ? totalConocido : '';
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/carrito`, {
      headers: { 'Authorization': `Bearer ${obtenerToken()}` }
    });
    if (!respuesta.ok) return;

    const productos = await respuesta.json();
    const totalItems = productos.reduce((acc, item) => acc + item.cantidad, 0);
    counter.textContent = totalItems > 0 ? totalItems : '';
  } catch (err) {
    // Si falla, dejamos el contador como estaba
  }
}

function mostrarToast(mensaje) {
  const toast = document.getElementById('toast-carrito');
  if (!toast) {
    console.log(mensaje);
    return;
  }
  toast.textContent = mensaje;
  toast.classList.add('toast-visible');
  setTimeout(() => toast.classList.remove('toast-visible'), 2500);
}


// ============================================================
// MODAL DE PRODUCTO DESTACADO (galeria.html / ofertas.html)
// ============================================================

function abrirModal(card) {
  const img = card.querySelector('img').src;
  const alt = card.querySelector('img').alt;
  const precios = card.querySelectorAll('h5');
  const precio = precios[0] ? precios[0].innerText : '';
  const descuento = precios.length > 1 ? precios[1].innerText : '';
  const nombre = card.querySelector('p').innerText;
  const productoId = card.dataset.id;

  const modalImg = document.getElementById('modalImg');
  const modalPrecio = document.getElementById('modalPrecio');
  const modalDescuento = document.getElementById('modalDescuento');
  const modalNombre = document.getElementById('modalNombre');
  const modalBoton = document.getElementById('modalAgregarBtn');

  if (modalImg) { modalImg.src = img; modalImg.alt = alt; }
  if (modalPrecio) modalPrecio.innerText = precio;
  if (modalDescuento) modalDescuento.innerText = descuento;
  if (modalNombre) modalNombre.innerText = nombre;
  if (modalBoton) {
    modalBoton.onclick = () => agregarAlCarrito(productoId, nombre);
  }

  const modal = document.getElementById('productoModal');
  if (modal) modal.classList.add('activo');
}

function cerrarModal() {
  const modal = document.getElementById('productoModal');
  if (modal) modal.classList.remove('activo');
}


// ============================================================
// INICIALIZACION GENERAL (se ejecuta en todas las paginas)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Resaltar el link activo en la navbar ---
  const links = document.querySelectorAll('.nav-link');
  const actual = window.location.pathname.split('/').pop();

  links.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === actual) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- Modal de producto destacado (galeria / ofertas) ---
  document.querySelectorAll('#galeria-grid .product-card, #ofertas-grid .product-card, #productos-grid .product-card')
    .forEach(card => {
      card.addEventListener('click', () => abrirModal(card));
    });

  const modal = document.getElementById('productoModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'productoModal') {
        cerrarModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarModal();
    }
  });

  // --- Carrito: contador en la barra superior (todas las páginas) ---
  actualizarContadorCarrito();

  // --- Carrito: si estamos en carrito.html, cargar el contenido ---
  cargarCarrito();

  // --- Botón "Finalizar compra" (decorativo, no enlaza a nada) ---
  const btnFinalizar = document.getElementById('btn-finalizar-compra');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      mostrarToast('¡Gracias por tu compra! (Función de pago aún no disponible)');
    });
  }

});
