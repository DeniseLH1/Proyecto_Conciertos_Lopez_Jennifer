// Referencias
const catForm = document.getElementById(‘category-form’);
const catTableBody = document.getElementById(‘categories-table-body’);

// --- GUARDAR CATEGORÍA ---
catForm.addEventListener(‘submit’, event => {
    event.preventDefault();
    
    const categories = JSON.parse(localStorage.getItem(‘categorias’)) || [];
    const newCat = {
        id: Date.now(),
        nombre: document.getElementById(‘cat-name’).value,
        descripcion: document.getElementById(‘cat-desc’).value
    };

    Categories.push(newCat);
    localStorage.setItem(‘categorias’, JSON.stringify(categories)); // Guardamos
    catForm.reset();
    renderCategories();
    alert(‘Categoría guardada con éxito’);
});

// --- RENDERIZAR TABLA ---
Function renderCategories() {
    Const categories = JSON.parse(localStorage.getItem(‘categorias’)) || [];
    catTableBody.innerHTML = ‘’;
    categories.forEach(cat => {
        catTableBody.innerHTML += `
            <tr>
                <td>${cat.nombre}</td>
                <td>${cat.descripcion}</td>
                <td>
                    <button class=”btn-delete-row” onclick=”deleteCategory(${cat.id})”>Eliminar</button>
                </td>
            </tr>
        `;
    });
}

Window.deleteCategory = (id) => {
    Let categories = JSON.parse(localStorage.getItem(‘categorias’)) || [];
    Categories = categories.filter(c => c.id ¡== id);
    localStorage.setItem(‘categorias’, JSON.stringify(categories));
    renderCategories();
};

renderCategories();
