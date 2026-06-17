
function filtrar(categoria, btn) {
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const grid = document.querySelector('[id$="-grid"]');
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

  const grid = document.querySelector('[id$="-grid"]');
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


function registrar() {
  const correo = document.getElementById('correo-login');
  const error  = document.getElementById('login-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!correo) return;

  if (!emailRegex.test(correo.value.trim())) {
    error.style.display = 'block';
    correo.classList.add('input-error');
  } else {
    error.style.display = 'none';
    correo.classList.remove('input-error');
    alert('¡Registro exitoso! Bienvenido a Fruity Glow.');
  }
}


let carrito = [];

function agregarAlCarrito(nombre, precio) {
  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCarrito();
  mostrarToast(nombre);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista   = document.getElementById('carrito-lista');
  const total   = document.getElementById('carrito-total');
  const vacio   = document.getElementById('carrito-vacio');
  const counter = document.getElementById('carrito-counter');

  if (!lista) return;

  lista.innerHTML = '';
  let sum = 0;
  let totalItems = 0;

  carrito.forEach((item, i) => {
    sum += item.precio * item.cantidad;
    totalItems += item.cantidad;

    const fila = document.createElement('div');
    fila.className = 'carrito-fila d-flex justify-content-between align-items-center';
    fila.innerHTML = `
      <div>
        <p class="carrito-nombre">${item.nombre}</p>
        <p class="carrito-cantidad">Cantidad: ${item.cantidad}</p>
      </div>
      <div class="d-flex align-items-center gap-3">
        <span class="carrito-precio">$${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
        <button class="carrito-eliminar" onclick="eliminarDelCarrito(${i})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    lista.appendChild(fila);
  });

  if (total)   total.textContent   = `$${sum.toLocaleString('es-CO')}`;
  if (vacio)   vacio.style.display  = carrito.length === 0 ? 'block' : 'none';
  if (counter) counter.textContent  = totalItems > 0 ? totalItems : '';
}

function mostrarToast(nombre) {
  const toast = document.getElementById('toast-carrito');
  if (!toast) return;
  toast.textContent = `"${nombre}" añadido al carrito`;
  toast.classList.add('toast-visible');
  setTimeout(() => toast.classList.remove('toast-visible'), 2500);
}


document.addEventListener('DOMContentLoaded', () => {
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
});

