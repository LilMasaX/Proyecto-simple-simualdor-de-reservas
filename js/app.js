const contenedor = document.getElementById('propiedades');
const ciudadInput = document.getElementById('ciudad');
const precioMaxInput = document.getElementById('precioMax');
const filtrarBtn = document.getElementById('filtrarBtn');

let propiedades = [];

// Cargar propiedades desde JSON
async function cargarPropiedades() {
  try {
    const res = await fetch('data/propiedades.json');
    propiedades = await res.json();
    mostrarPropiedades(propiedades);
  } catch (error) {
    console.error('Error al cargar las propiedades:', error);
    contenedor.innerHTML = '<p>Error al cargar los datos.</p>';
  }
}

// Mostrar propiedades en el HTML
function mostrarPropiedades(lista) {
  contenedor.innerHTML = '';

  if (lista.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron propiedades.</p>';
    return;
  }

  lista.forEach(prop => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="assets/img/${prop.img}" alt="${prop.titulo}">
      <div class="card-content">
        <h3>${prop.titulo}</h3>
        <p><strong>Ciudad:</strong> ${prop.ciudad}</p>
        <p><strong>Habitaciones:</strong> ${prop.habitaciones}</p>
        <p><strong>Precio por noche:</strong> $${prop.precioPorNoche}</p>
        <p>${prop.descripcion}</p>
        <button onclick="reservar(${prop.id})">Reservar</button>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// Función para reservar
function reservar(id) {
  const propiedad = propiedades.find(p => p.id === id);
  if (!propiedad) return;

  Swal.fire({
    title: 'Completa tu reserva',
    html: `
      <input id="swal-nombre" class="swal2-input" placeholder="Tu nombre">
      <input id="swal-email" class="swal2-input" placeholder="Tu email" type="email">
      <input id="swal-telefono" class="swal2-input" placeholder="Tu teléfono" type="tel">
    `,
    confirmButtonText: 'Reservar',
    preConfirm: () => {
      const nombre = document.getElementById('swal-nombre').value;
      const email = document.getElementById('swal-email').value;
      const telefono = document.getElementById('swal-telefono').value;
      if (!nombre || !email || !telefono) {
        Swal.showValidationMessage('Por favor completa todos los campos');
        return false;
      }
      return { nombre, email, telefono };
    }
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire(`¡Gracias por tu reserva, ${result.value.nombre}!`, '', 'success');
    }
  });
}

// Función para filtrar
function filtrarPropiedades() {
  const ciudad = ciudadInput.value;
  const precioMax = parseFloat(precioMaxInput.value);

  const filtradas = propiedades.filter(prop => {
    const ciudadCoincide = ciudad === '' || prop.ciudad === ciudad;
    const precioCoincide = isNaN(precioMax) || prop.precioPorNoche <= precioMax;
    return ciudadCoincide && precioCoincide;
  });

  mostrarPropiedades(filtradas);
}

// Eventos
filtrarBtn.addEventListener('click', filtrarPropiedades);

// Inicialización
cargarPropiedades();
