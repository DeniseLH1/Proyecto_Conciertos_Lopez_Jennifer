const modal = document.getElementById('category-modal');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const categoryForm = document.getElementById('category-form');
const tableBody = document.getElementById('categories-table-body');

// Referencias a los inputs
const inputId = document.getElementById('edit-id');
const inputName = document.getElementById('cat-name');
const inputDesc = document.getElementById('cat-desc');

// --- 1. DATOS INICIALES (PARA QUE NO ESTÉ VACÍO) ---
const categoriasPorDefecto = [
    { id: 1, nombre: 'Conciertos', descripcion: 'Eventos musicales en vivo de todos los géneros.' },
    { id: 2, nombre: 'Teatro', descripcion: 'Obras dramáticas, musicales y presentaciones escénicas.' },
    { id: 3, nombre: 'Festivales', descripcion: 'Grandes eventos con múltiples artistas y actividades.' },
    { id: 4, nombre: 'Deportes', descripcion: 'Encuentros deportivos y competencias nacionales.' }
];

// Función para inicializar el sistema
function inicializarCategorias() {
    const existentes = JSON.parse(localStorage.getItem('categorias'));
    
    // Si no existe O si existe pero la lista tiene 0 elementos
    if (!existentes || existentes.length === 0) {
        localStorage.setItem('categorias', JSON.stringify(categoriasPorDefecto));
        console.log("Datos iniciales cargados con éxito");
    }
}

// --- 2. ABRIR Y CERRAR MODAL ---
btnOpenModal.onclick = () => {
    categoryForm.reset();
    inputId.value = ''; // Limpiamos ID para que sepa que es NUEVO
    document.getElementById('modal-title').innerText = 'Nueva Categoría';
    modal.style.display = 'flex';
};

btnCloseModal.onclick = () => modal.style.display = 'none';

// --- 3. GUARDAR O EDITAR ---
categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const categories = JSON.parse(localStorage.getItem('categorias')) || [];
    const id = inputId.value;
    
    if (id) {
        // MODO EDICIÓN
        const index = categories.findIndex(c => c.id == id);
        if (index !== -1) {
            categories[index].nombre = inputName.value;
            categories[index].descripcion = inputDesc.value;
        }
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

// --- 4. RENDERIZAR TABLA ---
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
        </td>`
;
        tableBody.appendChild(tr);
    });
}

// --- PREPARAR EDICIÓN 
window.prepareEdit = (id) => {
    const categories = JSON.parse(localStorage.getItem('categorias')) || [];
    const cat = categories.find(c => c.id == id);
    
    if (cat) {
        inputId.value = cat.id;
        inputName.value = cat.nombre;
        inputDesc.value = cat.descripcion;
        
        document.getElementById('modal-title').innerText = 'Editar Categoría';
        modal.style.display = 'flex';
    }
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
// --- CARGA INICIAL ---
// Primero inicializamos si está vacío, luego dibujamos
inicializarCategorias();
renderCategories();
