document.addEventListener('DOMContentLoaded', () => {
    renderizarTablaSugerencias();
});

function renderizarTablaSugerencias() {
    const tablaBody = document.getElementById('sales-table-body');
    const sugerencias = JSON.parse(localStorage.getItem('sugerencias')) || [];

    if (!tablaBody) return;

    tablaBody.innerHTML = '';

    if (sugerencias.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay sugerencias aún.</td></tr>';
        return;
    }

    // Dibujar cada fila en la tabla
    sugerencias.forEach(sug => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${sug.nombre}</td>
            <td>${sug.email}</td>
            <td>${sug.sugerencia}</td>
        `;
        tablaBody.appendChild(fila);
    });
}