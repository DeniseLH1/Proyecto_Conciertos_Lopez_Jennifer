const salesTable = document.getElementById('sales-table-body');
const detailModal = document.getElementById('detail-modal');
const detailContainer = document.getElementById('order-full-details');

// --- 1. RENDERIZAR VENTAS ---
function renderSales() {
    const sales = JSON.parse(localStorage.getItem('ventas')) || [];

    // Ajuste para Chrome: Validar que existan fechas antes de ordenar
    sales.sort((a, b) => {
        const fechaA = new Date(a.fechaVenta || a.fechaCompra);
        const fechaB = new Date(b.fechaVenta || b.fechaCompra);
        return fechaB - fechaA;
    });

    salesTable.innerHTML = '';

    if (sales.length === 0) {
        salesTable.innerHTML = '<tr><td colspan="5" style="text-align:center; background:white; padding:20px;">No hay registros de ventas.</td></tr>';
        return;
    }

    sales.forEach(sale => {
        // Chrome a veces prefiere fechaCompra si fechaVenta viene nulo
        const fechaMostrar = sale.fechaVenta || sale.fechaCompra || "Sin fecha";
        
        // IMPORTANTE: Usamos idVenta o id, lo que exista
        const idCorrecto = sale.idVenta || sale.id;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${fechaMostrar}</td>
            <td><strong>${sale.cliente.nombre}</strong></td>
            <td>${sale.ciudad || 'N/A'}</td>
            <td style="font-weight: bold; color: #27ae60;">$${Number(sale.total).toLocaleString()}</td>
            <td>
                <button class="btn-detail" onclick="viewDetail('${idCorrecto}')">Ver Detalle</button>
            </td>
        `;
        salesTable.appendChild(tr);
    });
}

// --- 2. MOSTRAR DETALLE COMPLETO ---
window.viewDetail = (idBusqueda) => {
    const sales = JSON.parse(localStorage.getItem('ventas')) || [];
    // Buscamos coincidencia en id o idVenta
    const sale = sales.find(s => (s.idVenta === idBusqueda || s.id === idBusqueda));

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