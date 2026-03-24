

const eventTableBody = document.getElementById('events-table-body');
const eventForm = document.getElementById('event-form');
const eventModal = document.getElementById('event-modal');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');

const inputId = document.getElementById('edit-id');
const inputCode = document.getElementById('ev-code');
const inputNombre = document.getElementById('ev-name');
const inputCategoria = document.getElementById('ev-category');
const inputPrecio = document.getElementById('ev-price');
const inputFecha = document.getElementById('ev-date');
const inputHora = document.getElementById('ev-time');
const inputCiudad = document.getElementById('ev-city');
const inputImagen = document.getElementById('ev-image');
const inputDesc = document.getElementById('ev-desc');

const eventosSemilla = [
    {
        id: 1711280000001,
        codigo: 'EV-101',
        nombre: 'PAULO LONDRA',
        categoria: 'Conciertos',
        ciudad: 'Bogotá',
        fecha: '2026-05-15',
        hora: '20:00',
        precio: 250000,
        descripcion: 'El regreso más esperado.',
        imagen: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200',
        estado: 'activo'
    }
];

function inicializarEventos() {
    const datos = localStorage.getItem('eventos');
    if (!datos || JSON.parse(datos).length === 0) {
        localStorage.setItem('eventos', JSON.stringify(eventosSemilla));
    }
}

if (btnOpenModal) {
    btnOpenModal.onclick = () => {
        eventForm.reset();
        inputId.value = '';
        document.getElementById('modal-title').innerText = 'Registrar Evento';
        eventModal.style.display = 'block';
    };
}

if (btnCloseModal) {
    btnCloseModal.onclick = () => eventModal.style.display = 'none';
}

function renderEventsTable() {
    if (!eventTableBody) return;
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    eventTableBody.innerHTML = '';

    eventos.forEach(ev => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${ev.imagen}" width="40" height="40" style="object-fit:cover;"></td>
            <td>${ev.codigo}</td>
            <td><strong>${ev.nombre}</strong></td>
            <td>${ev.ciudad}</td>
            <td>$${Number(ev.precio).toLocaleString()}</td>
            <td>
                <button onclick="prepareEditEvent(${ev.id})">Editar</button>
                <button onclick="deleteEvent(${ev.id})">Eliminar</button>
            </td>
        `;
        eventTableBody.appendChild(tr);
    });
}

window.prepareEditEvent = (id) => {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const ev = eventos.find(e => e.id == id);
    if (ev) {
        inputId.value = ev.id;
        inputCode.value = ev.codigo;
        inputNombre.value = ev.nombre;
        inputCategoria.value = ev.categoria;
        inputPrecio.value = ev.precio;
        inputFecha.value = ev.fecha;
        inputHora.value = ev.hora;
        inputCiudad.value = ev.ciudad;
        inputImagen.value = ev.imagen;
        inputDesc.value = ev.descripcion || '';
        document.getElementById('modal-title').innerText = 'Editar Evento';
        eventModal.style.display = 'block';
    }
};

window.deleteEvent = (id) => {
    if (confirm('¿Eliminar este evento?')) {
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        eventos = eventos.filter(e => e.id != id);
        localStorage.setItem('eventos', JSON.stringify(eventos));
        renderEventsTable();
    }
};

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const id = inputId.value;

    const datosEvento = {
        id: id ? Number(id) : Date.now(),
        codigo: inputCode.value,
        nombre: inputNombre.value,
        categoria: inputCategoria.value,
        precio: inputPrecio.value,
        fecha: inputFecha.value,
        hora: inputHora.value,
        ciudad: inputCiudad.value,
        imagen: inputImagen.value,
        descripcion: inputDesc.value,
        estado: 'activo'
    };

    if (id) {
        const index = eventos.findIndex(e => e.id == id);
        if (index !== -1) eventos[index] = datosEvento;
    } else {
        eventos.push(datosEvento);
    }

    localStorage.setItem('eventos', JSON.stringify(eventos));
    eventModal.style.display = 'none';
    renderEventsTable();
});

inicializarEventos();
renderEventsTable();