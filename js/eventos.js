// Referencias a los elementos del DOM
const modal = document.getElementById('event-modal');
const btnOpen = document.getElementById('btn-open-modal');
const btnClose = document.getElementById('btn-close-modal');
const eventForm = document.getElementById('event-form');
const selectCategory = document.getElementById('ev-category');
const tableBody = document.getElementById('events-table-body');
const modalTitle = document.getElementById('modal-title');

// --- 1. CARGAR CATEGORÍAS (Desde el LocalStorage de Categorías) ---
function updateCategorySelect() {
    const categories = JSON.parse(localStorage.getItem('categorias')) || [];
    selectCategory.innerHTML = '<option value="" disabled selected>Seleccione...</option>';
    
    if (categories.length === 0) {
        const option = document.createElement('option');
        option.textContent = "Crea categorías primero";
        option.disabled = true;
        selectCategory.appendChild(option);
    } else {
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.nombre;
            option.textContent = cat.nombre;
            selectCategory.appendChild(option);
        });
    }
}

// --- 2. RENDERIZAR TABLA (Dibujar los eventos) ---
function renderEvents() {
    const events = JSON.parse(localStorage.getItem('eventos')) || [];
    tableBody.innerHTML = ''; 

    events.forEach(ev => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>
                <img src="${ev.imagen || '../img/placeholder.png'}" class="img-mini">
            </td>
            <td style="font-weight: bold;">${ev.codigo}</td>
            <td>
                <strong>${ev.nombre}</strong><br>
                <small style="color: #666;">${ev.categoria}</small>
            </td>
            <td>${ev.ciudad}</td>
            <td style="font-weight: bold;">$${Number(ev.precio).toLocaleString()}</td>
            <td>
                <span class="btn-edit-row" onclick="prepareEdit(${ev.id})">Editar</span>
                <span class="btn-delete-row" onclick="deleteEvent(${ev.id})">Eliminar</span>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// --- 3. GUARDAR O ACTUALIZAR EVENTO ---
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const events = JSON.parse(localStorage.getItem('eventos')) || [];
    const editId = document.getElementById('edit-id').value;

    const eventData = {
        id: editId ? Number(editId) : Date.now(),
        codigo: document.getElementById('ev-code').value,
        nombre: document.getElementById('ev-name').value,
        categoria: selectCategory.value,
        precio: document.getElementById('ev-price').value,
        fecha: document.getElementById('ev-date').value,
        hora: document.getElementById('ev-time').value,
        ciudad: document.getElementById('ev-city').value,
        imagen: document.getElementById('ev-image').value,
        descripcion: document.getElementById('ev-desc').value
    };

    if (editId) {
        // Editar: Reemplazar el existente
        const index = events.findIndex(ev => ev.id === Number(editId));
        events[index] = eventData;
    } else {
        // Crear: Nuevo evento
        events.push(eventData);
    }

    localStorage.setItem('eventos', JSON.stringify(events));
    eventForm.reset();
    document.getElementById('edit-id').value = '';
    modal.style.display = 'none';
    renderEvents();
});

// --- 4. PREPARAR EDICIÓN (Cargar datos en el modal) ---
window.prepareEdit = (id) => {
    const events = JSON.parse(localStorage.getItem('eventos')) || [];
    const ev = events.find(e => e.id === id);

    if (ev) {
        updateCategorySelect(); // Asegurar que las opciones existan
        
        document.getElementById('edit-id').value = ev.id;
        document.getElementById('ev-code').value = ev.codigo;
        document.getElementById('ev-name').value = ev.nombre;
        document.getElementById('ev-price').value = ev.precio;
        document.getElementById('ev-date').value = ev.fecha;
        document.getElementById('ev-time').value = ev.hora;
        document.getElementById('ev-city').value = ev.ciudad;
        document.getElementById('ev-image').value = ev.imagen;
        document.getElementById('ev-desc').value = ev.descripcion;
        selectCategory.value = ev.categoria;

        modalTitle.textContent = "Editar Evento";
        modal.style.display = 'flex';
    }
};

// --- 5. ELIMINAR EVENTO ---
window.deleteEvent = (id) => {
    if (confirm('¿Seguro que quieres eliminar este evento?')) {
        let events = JSON.parse(localStorage.getItem('eventos')) || [];
        events = events.filter(ev => ev.id !== id);
        localStorage.setItem('eventos', JSON.stringify(events));
        renderEvents();
    }
};

// --- CONTROLES DE INTERFAZ ---
btnOpen.onclick = () => {
    eventForm.reset();
    document.getElementById('edit-id').value = '';
    modalTitle.textContent = "Registrar Evento";
    updateCategorySelect();
    modal.style.display = 'flex';
};

btnClose.onclick = () => {
    modal.style.display = 'none';
};

// Cerrar modal si se hace click afuera del contenido
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Inicializar la tabla al cargar
renderEvents();