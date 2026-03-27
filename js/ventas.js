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
    // Buscamos la venta
    const sale = sales.find(s => (s.idVenta == idBusqueda || s.id == idBusqueda));

    if (sale) {
        // 1. Corregir Fecha: Si sale.fechaVenta no funciona, probamos con sale.fecha o la del sistema
        const fechaBruta = sale.fechaVenta || sale.fecha || new Date();
        const fechaFormateada = new Date(fechaBruta).toLocaleString();

        detailContainer.innerHTML = `
            <div style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;">
                <p><strong>ID Venta:</strong> ${sale.idVenta || sale.id || 'N/A'}</p>
                <p><strong>Fecha:</strong> ${fechaFormateada !== "Invalid Date" ? fechaFormateada : fechaBruta}</p>
            </div>
            
            <p><strong>Evento:</strong> ${sale.nombre || sale.eventoNombre || sale.evento || 'Paulo Londra'}</p>
            <p><strong>Código Evento:</strong> ${sale.codigo || sale.eventoCodigo || 'EV-101'}</p>
            <p><strong>Ciudad:</strong> ${sale.ciudad || 'Bogotá'}</p>
            
            <hr style="border:0.5px solid #333; margin:10px 0;">
            
            <p><strong>Cliente:</strong> ${sale.cliente?.nombre || 'Usuario'}</p>
            <p><strong>Correo:</strong> ${sale.cliente?.email || 'Correo'}</p>
            <p><strong>Cantidad:</strong> ${sale.cantidad || 1} entradas</p>
            
            <div style="margin-top:15px; padding:10px; background:#0b4a0e; border-radius:5px; text-align:center;">
                <h3 style="margin:0; color: white;">Total: $${Number(sale.total || 0).toLocaleString()}</h3>
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