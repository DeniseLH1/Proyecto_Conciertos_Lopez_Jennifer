/**
 * 4. GESTIÓN DEL CARRITO
 */
window.agregarAlBuzon = (bu) => {
    const buzon = JSON.parse(localStorage.getItem('buzon')) || [];
    const su = buzon.find(e => e.bu === bu);

    const itemExistente = buzon.find(item => item.bu === bu);
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        buzon.push({ ...su, cantidad: 1 });
    }
    actualizarBuzonUI();
};

window.cambiarCantidad = (index, cambio) => {
    buzon[index].cantidad += cambio;
    if (buzon[index].cantidad <= 0) buzon.splice(index, 1);
    actualizarBuzonUI();
};

window.eliminarDelCarrito = (index) => {
    buzon.splice(index, 1);
    actualizarBuzonUI();
};

function actualizarBuzonUI() {
    const sugerencia = document.getElementById('lista-buzon');
    if (sugerencia) {
        sugerencia.innerHTML = '';

        buzon.forEach((item, index) => {
            lista.innerHTML += `
                <div class="item-buzon" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <div style="flex-grow:1; margin-left:10px;">
                        <strong>${item.nombre}</strong><br>
                        <div style="margin-top: 5px;">
                            <span style="margin: 0 10px;">${item.cantidad}</span>
                            <button onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; color:red; cursor:pointer;">Eliminar</button>
                    </div>
                </div>
            `;
        });
        if (totalElement) totalElement.textContent = `$${totalAcumulado.toLocaleString()}`;
    }
}

/**
 * 5. FINALIZAR COMPRA
 */
const formCompra = document.getElementById('form-compra');
if (formCompra) {
    formCompra.onsubmit = (e) => {
        e.preventDefault();
        if (carrito.length === 0) return alert("Tu carrito está vacío.");

        const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
        const nuevaVenta = {
            idVenta: "TICK-" + Date.now(),
            fechaCompra: new Date().toLocaleString(),
            cliente: {
                id: document.getElementById('c-id').value,
                nombre: document.getElementById('c-nombre').value,
                direccion: document.getElementById('c-dir').value,
                telefono: document.getElementById('c-tel').value,
                email: document.getElementById('c-email').value
            },
            productos: [...carrito],
            total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
        };

        ventas.push(nuevaVenta);
        localStorage.setItem('ventas', JSON.stringify(ventas));

        Swal.fire({
        title: '¡Éxito!',
        text: 'Tu compra en Tickyiyo fue procesada',
        icon: 'success',
        confirmButtonText: 'Genial'
});;
        carrito = [];
        actualizarCarritoUI();
        cerrarCarrito();
        e.target.reset();
    };
}

// FUNCIONES DE NAVEGACIÓN (Window para ser vistas desde el HTML)
window.abrirCarrito = () => document.getElementById('modal-carrito').style.display = 'flex';
window.cerrarCarrito = () => document.getElementById('modal-carrito').style.display = 'none';
window.cerrarDetalle = () => document.getElementById('modal-detalle').style.display = 'none';
window.cancelarCompra = () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        carrito = [];
        actualizarCarritoUI();
        cerrarCarrito();
    }
};