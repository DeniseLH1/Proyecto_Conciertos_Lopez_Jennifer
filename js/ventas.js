const salesTable = document.getElementById('sales-table-body');
const detailModal = document.getElementById('detail-modal');
const detailContainer = document.getElementById('order-full-details');

// --- 1. RENDERIZAR VENTAS ---
function renderSales() {
    // Obtenemos los datos de la "llave" ventas
    const sales = JSON.parse(localStorage.getItem('ventas')) || [];

    // Ordenar: Más recientes arriba
    sales.sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta));

    salesTable.innerHTML = '';

    if (sales.length === 0) {
        salesTable.innerHTML = '<tr><td colspan="5" style="text-align:center; background:white; border-radius:10px;">No hay registros de ventas.</td></tr>';
        return;
    }

    sales.forEach(sale => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(sale.fechaVenta).toLocaleDateString()}</td>
            <td><strong>${sale.cliente.nombre}</strong></td>
            <td>${sale.ciudad}</td>
            <td style="font-weight: bold; color: #27ae60;">$${Number(sale.total).toLocaleString()}</td>
            <td>
                <span class="btn-detail" onclick="viewDetail('${sale.id}')">Ver Detalle</span>
            </td>
        `;
        salesTable.appendChild(tr);
    });
}

// --- 2. MOSTRAR DETALLE COMPLETO ---
window.viewDetail = (id) => {
    const sales = JSON.parse(localStorage.getItem('ventas')) || [];
    const sale = sales.find(s => s.id === id);

    if (sale) {
        detailContainer.innerHTML = `
            <div style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;">
                <p><strong>ID Venta:</strong> ${sale.id}</p>
                <p><strong>Fecha:</strong> ${new Date(sale.fechaVenta).toLocaleString()}</p>
            </div>
            <p><strong>Evento:</strong> ${sale.eventoNombre}</p>
            <p><strong>Código Evento:</strong> ${sale.eventoCodigo}</p>
            <p><strong>Ciudad:</strong> ${sale.ciudad}</p>
            <hr style="border:0.5px solid #333; margin:10px 0;">
            <p><strong>Cliente:</strong> ${sale.cliente.nombre}</p>
            <p><strong>Correo:</strong> ${sale.cliente.email}</p>
            <p><strong>Cantidad:</strong> ${sale.cantidad} entradas</p>
            <div style="margin-top:15px; padding:10px; background:#0b4a0e; border-radius:5px; text-align:center;">
                <h3 style="margin:0;">Total: $${Number(sale.total).toLocaleString()}</h3>
            </div>
        `;
        detailModal.style.display = 'flex';
    }
};

window.closeDetail = () => {
    detailModal.style.display = 'none';
};

// Cerrar si hace click fuera del modal
window.onclick = (event) => {
    if (event.target == detailModal) {
        closeDetail();
    }
};

// Cargar al abrir la página
renderSales();