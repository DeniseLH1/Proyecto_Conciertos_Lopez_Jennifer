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
    const fechaMostrar = sale.fechaCompra || sale.fechaVenta || "Sin fecha";
    const idCorrecto = sale.idVenta || sale.id;

    // Buscamos la ciudad en el primer producto del carrito. Si no existe, ponemos 'N/A'.
    const ciudadEvento = (sale.productos && sale.productos.length > 0) 
                         ? sale.productos[0].ciudad 
                         : 'N/A';

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${fechaMostrar}</td>
        <td><strong>${sale.cliente.nombre}</strong></td>
        
        <td>${ciudadEvento}</td> 
        
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
    const sale = sales.find(s => (s.idVenta == idBusqueda || s.id == idBusqueda));

    if (sale) {
        // 1. Generar la lista de productos comprados
        let listaProductosHTML = "";
        
        sale.productos.forEach(prod => {
            listaProductosHTML += `
                <div style="background: #1a1a1a; padding: 10px; border-radius: 5px; margin-bottom: 8px; border-left: 4px solid #27ae60;">
                    <p style="margin: 0; color: #eee;"><strong>${prod.nombre}</strong></p>
                    <p style="margin: 0; font-size: 0.85em; color: #aaa;">
                        ${prod.cantidad} entradas x $${Number(prod.precio).toLocaleString()}
                    </p>
                    <p style="margin: 0; font-size: 0.8em; color: #888;">📍 ${prod.ciudad || 'S/N'}</p>
                </div>
            `;
        });

        // 2. Armar el modal completo
        detailContainer.innerHTML = `
            <div style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
                <p><strong>ID Venta:</strong> ${sale.idVenta}</p>
                <p><strong>Fecha:</strong> ${sale.fechaCompra}</p>
            </div>
            
            <p><strong>Nombre:</strong> ${sale.cliente.nombre}</p>
                <p><strong>Identificación:</strong> ${sale.cliente.id || 'No registrada'}</p>
                <p><strong>Dirección:</strong> ${sale.cliente.direccion || 'No registrada'}</p>
                <p><strong>Teléfono:</strong> ${sale.cliente.telefono || 'No registrado'}</p>
                <p><strong>Correo:</strong> ${sale.cliente.email}</p>
            
            <h4 style="margin: 15px 0 10px 0; color: #27ae60;">Eventos Adquiridos:</h4>
            
            <div id="lista-eventos-detalle">
                ${listaProductosHTML}
            </div>
            
            <div style="margin-top:20px; padding:12px; background:#0b4a0e; border-radius:5px; text-align:center;">
                <h3 style="margin:0; color: white;">Total Pagado: $${Number(sale.total).toLocaleString()}</h3>
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