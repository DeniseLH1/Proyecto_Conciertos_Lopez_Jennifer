const modal = document.getElementById('category-modal');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const categoryForm = document.getElementById('category-form');
const tableBody = document.getElementById('categories-table-body');

// Referencias a los inputs
const inputId = document.getElementById('edit-id');
const inputName = document.getElementById('cat-name');
const inputDesc = document.getElementById('cat-desc');

// --- ABRIR Y CERRAR MODAL ---
btnOpenModal.onclick = () => {
    categoryForm.reset();
    inputId.value = ''; // Limpiamos ID para que sepa que es NUEVO
    document.getElementById('modal-title').innerText = 'Nueva Categoría';
    modal.style.display = 'flex';
};

btnCloseModal.onclick = () => modal.style.display = 'none';

// --- GUARDAR O EDITAR ---
categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const categories = JSON.parse(localStorage.getItem('categorias')) || [];
    const id = inputId.value;
    
    if (id) {
        // MODO EDICIÓN
        const index = categories.findIndex(c => c.id == id);
        categories[index].nombre = inputName.value;
        categories[index].descripcion = inputDesc.value;
    } else {
        // MODO CREACIÓN
        categories.push({
            id: Date.now(),
            nombre: inputName.value,
            descripcion: inputDesc.value
        });
    }
    
    localStorage.setItem('categorias', JSON.stringify(categories));
    modal.style.display = 'none';
    renderCategories();
});

// --- RENDERIZAR TABLA ---
function renderCategories() {
    const categories = JSON.parse(localStorage.getItem('categorias')) || [];
    tableBody.innerHTML = '';

    categories.forEach(cat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${cat.nombre}</strong></td>
            <td>${cat.descripcion}</td>
            <td>
                <button class="btn-edit-row" onclick="prepareEdit(${cat.id})">Editar</button>
                <button class="btn-delete-row" onclick="deleteCategory(${cat.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// --- PREPARAR EDICIÓN ---
window.prepareEdit = (id) => {
    const categories = JSON.parse(localStorage.getItem('categorias')) || [];
    const cat = categories.find(c => c.id == id);
    
    inputId.value = cat.id;
    inputName.value = cat.nombre;
    inputDesc.value = cat.descripcion;
    
    document.getElementById('modal-title').innerText = 'Editar Categoría';
    modal.style.display = 'flex';
};

// --- ELIMINAR ---
window.deleteCategory = (id) => {
    if(confirm('¿Estás seguro de eliminar esta categoría?')) {
        let categories = JSON.parse(localStorage.getItem('categorias')) || [];
        categories = categories.filter(c => c.id != id);
        localStorage.setItem('categorias', JSON.stringify(categories));
        renderCategories();
    }
};

// Carga inicial
renderCategories();