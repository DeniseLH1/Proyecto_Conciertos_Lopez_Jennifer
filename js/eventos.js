const modal = document.getElementById('event-modal');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const eventForm = document.getElementById('event-form');
const tableBody = document.getElementById('events-table-body');
const selectCategory = document.getElementById('ev-category');

// Elementos del formulario
const inputId = document.getElementById('edit-id');
const inputCode = document.getElementById('ev-code');
const inputName = document.getElementById('ev-name');
const inputPrice = document.getElementById('ev-price');
const inputDate = document.getElementById('ev-date');
const inputTime = document.getElementById('ev-time');
const inputCity = document.getElementById('ev-city');
const inputImage = document.getElementById('ev-image');
const inputDesc = document.getElementById('ev-desc');

// --- CARGAR CATEGORÍAS EN EL SELECT ---
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categorias')) || [];
    selectCategory.innerHTML = '<option value="" disabled selected>Seleccione...</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.nombre;
        option.textContent = cat.nombre;
        selectCategory.appendChild(option);
    });
}

// --- ABRIR/CERRAR MODAL ---
btnOpenModal.onclick = () => {
    loadCategories(); // Actualiza categorías cada vez que abres
    eventForm.reset();
    inputId.value = '';
    document.getElementById('modal-title').innerText = 'Nuevo Evento';
    modal.style.display = 'flex';
};

btnCloseModal.onclick = () => modal.style.display = 'none';

// --- GUARDAR O EDITAR ---
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const events = JSON.parse(localStorage.getItem('eventos')) || [];
    const id = inputId.value;

    const eventData = {
        id: id ? Number(id) : Date.now(),
        codigo: inputCode.value,
        nombre: inputName.value,
        categoria: selectCategory.value,
        precio: inputPrice.value,
        fecha: inputDate.value,
        hora: inputTime.value,
        ciudad: inputCity.value,
        imagen: inputImage.value || '../img/default-event.jpg',
        descripcion: inputDesc.value
    };

    if (id) {
        const index = events.findIndex(ev => ev.id == id);
        events[index] = eventData;
    } else {
        events.push(eventData);
    }

    localStorage.setItem('eventos', JSON.stringify(events));
    modal.style.display = 'none';
    renderEvents();
});

// --- DIBUJAR TABLA ---
function renderEvents() {
    const events = JSON.parse(localStorage.getItem('eventos')) || [];
    tableBody.innerHTML = '';

    events.forEach(ev => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${ev.imagen}" class="img-mini" alt="thumb"></td>
            <td>${ev.codigo}</td>
            <td><strong>${ev.nombre}</strong></td>
            <td>${ev.categoria}</td>
            <td>${ev.ciudad}</td>
            <td>$${Number(ev.precio).toLocaleString()}</td>
            <td>
                <button class="btn-edit-row" onclick="prepareEditEvent(${ev.id})">Editar</button>
                <button class="btn-delete-row" onclick="deleteEvent(${ev.id})">Borrar</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// --- EDITAR ---
window.prepareEditEvent = (id) => {
    const events = JSON.parse(localStorage.getItem('eventos')) || [];
    const ev = events.find(e => e.id == id);
    loadCategories();

    inputId.value = ev.id;
    inputCode.value = ev.codigo;
    inputName.value = ev.nombre;
    selectCategory.value = ev.categoria;
    inputPrice.value = ev.precio;
    inputDate.value = ev.fecha;
    inputTime.value = ev.hora;
    inputCity.value = ev.ciudad;
    inputImage.value = ev.imagen;
    inputDesc.value = ev.descripcion;

    document.getElementById('modal-title').innerText = 'Editar Evento';
    modal.style.display = 'flex';
};

// --- ELIMINAR ---
window.deleteEvent = (id) => {
    if(confirm('¿Eliminar este evento definitivamente?')) {
        let events = JSON.parse(localStorage.getItem('eventos')) || [];
        events = events.filter(e => e.id != id);
        localStorage.setItem('eventos', JSON.stringify(events));
        renderEvents();
    }
};

// Carga inicial
renderEvents();