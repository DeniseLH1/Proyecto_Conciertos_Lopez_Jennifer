// Variable global del carrito
let carrito = [];

// 1. CARGAR CATEGORÍAS (Sincronizado con Administrador)
function cargarCategoriasDinamicas() {
    const filtroSelect = document.getElementById('filtro-categoria');
    const categoriasGuardadas = JSON.parse(localStorage.getItem('categorias')) || [];

    filtroSelect.innerHTML = '<option value="">Todas las Categorías</option>';

    categoriasGuardadas.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.nombre;
        option.textContent = cat.nombre;
        filtroSelect.appendChild(option);
    });
}

// 2. RENDERIZAR EVENTOS (Buscador + Filtros)
function dibujarEventos() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const textoBusqueda = document.getElementById('input-busqueda').value.toLowerCase();
    const ciudadSel = document.getElementById('filtro-ciudad').value;
    const catSel = document.getElementById('filtro-categoria').value;
    
    const contenedor = document.getElementById('contenedor-eventos');
    contenedor.innerHTML = '';

    const filtrados = eventos.filter(ev => {
        const coincideNombre = ev.nombre.toLowerCase().includes(textoBusqueda);
        const coincideCiudad = ciudadSel === "" || ev.ciudad === ciudadSel;
        const coincideCat = catSel === "" || ev.categoria === catSel;
        return coincideNombre && coincideCiudad && coincideCat;
    });

    if (filtrados.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No se encontraron resultados.</p>`;
        return;
    }

    filtrados.forEach(ev => {
        const card = document.createElement('article');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-image" style="background-image: url('${ev.imagen || '../img/placeholder.png'}')" onclick="verDetalle(${ev.id})"></div>
            <div class="event-details">
                <span class="category-tag">${ev.categoria}</span>
                <h3 onclick="verDetalle(${ev.id})">${ev.nombre}</h3>
                <p class="event-meta">🗓️ ${ev.fecha} | 🕒 ${ev.hora || '20:00'}</p>
                <p class="event-meta">📍 ${ev.ciudad}</p>
                <div class="event-price">$${Number(ev.precio).toLocaleString()}</div>
                <button class="btn-add-cart" onclick="agregarAlCarrito(${ev.id})">Agregar al Carrito</button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// 3. VISTA DE DETALLE
window.verDetalle = (id) => {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const ev = eventos.find(e => e.id === id);
    if (!ev) return;

    document.getElementById('contenido-detalle').innerHTML = `
        <div class="detalle-grid-content" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <img src="${ev.imagen}" style="width:100%; border-radius:10px;">
            <div>
                <h2>${ev.nombre}</h2>
                <p style="margin: 15px 0; color: #aaa;">${ev.descripcion || 'Sin descripción.'}</p>
                <p><strong>📍 Ciudad:</strong> ${ev.ciudad}</p>
                <p><strong>🗓️ Fecha:</strong> ${ev.fecha} | 🕒 ${ev.hora || '20:00'}</p>
                <h3 style="color: #27ae60; margin: 20px 0;">Precio: $${Number(ev.precio).toLocaleString()}</h3>
                <button class="btn-save" onclick="agregarAlCarrito(${ev.id}); cerrarDetalle();">Añadir al Carrito</button>
            </div>
        </div>
    `;
    document.getElementById('modal-detalle').style.display = 'flex';
};

// 4. GESTIÓN DEL CARRITO (Cantidades y Botones)
window.agregarAlCarrito = (id) => {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const ev = eventos.find(e => e.id === id);
    
    const itemExistente = carrito.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ ...ev, cantidad: 1 });
    }
    actualizarCarritoUI();
};

window.cambiarCantidad = (index, cambio) => {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    actualizarCarritoUI();
};

window.eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    actualizarCarritoUI();
};

window.cancelarCompra = () => {
    if (confirm("¿Vaciar el carrito?")) {
        carrito = [];
        actualizarCarritoUI();
        cerrarCarrito();
    }
};

function actualizarCarritoUI() {
    const badge = document.getElementById('contador-carrito');
    const lista = document.getElementById('lista-carrito');
    const totalElement = document.getElementById('precio-total');
    
    badge.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    lista.innerHTML = '';
    let totalAcumulado = 0;

    carrito.forEach((item, index) => {
        const subtotal = Number(item.precio) * item.cantidad;
        totalAcumulado += subtotal;
        lista.innerHTML += `
            <div class="item-carrito">
                <img src="${item.imagen}" width="50" height="50" style="object-fit:cover; border-radius:5px;">
                <div style="flex-grow:1; margin-left:10px;">
                    <strong>${item.nombre}</strong><br>
                    <div class="controles-cantidad">
                        <button onclick="cambiarCantidad(${index}, -1)">-</button>
                        <span>${item.cantidad} tickets</span>
                        <button onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                    <span style="color:#27ae60">$${subtotal.toLocaleString()}</span>
                </div>
                <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; cursor:pointer;">❌</button>
            </div>
        `;
    });
    totalElement.textContent = `$${totalAcumulado.toLocaleString()}`;
}

// 5. FINALIZAR COMPRA (Guardar con fecha)
document.getElementById('form-compra').onsubmit = (e) => {
    e.preventDefault();
    if (carrito.length === 0) return alert("Carrito vacío");

    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const nuevaVenta = {
        idVenta: "TICK-" + Date.now(),
        fechaCompra: new Date().toLocaleString(), // REQUISITO: Fecha de pedido
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
    
    alert("¡Compra exitosa!");
    carrito = [];
    actualizarCarritoUI();
    cerrarCarrito();
    e.target.reset();
};

// Eventos de escucha
document.getElementById('input-busqueda').addEventListener('input', dibujarEventos);
document.getElementById('filtro-ciudad').addEventListener('change', dibujarEventos);
document.getElementById('filtro-categoria').addEventListener('change', dibujarEventos);

window.abrirCarrito = () => document.getElementById('modal-carrito').style.display = 'flex';
window.cerrarCarrito = () => document.getElementById('modal-carrito').style.display = 'none';
window.cerrarDetalle = () => document.getElementById('modal-detalle').style.display = 'none';

document.addEventListener('DOMContentLoaded', () => {
    const barra = document.getElementById('input-busqueda');
    if (barra) {
        console.log("Buscador conectado con éxito");
        barra.addEventListener('input', dibujarEventos);
    } else {
        console.error("No encontré el input con id 'input-busqueda'");
    }
    document.getElementById('filtro-ciudad').onchange = dibujarEventos;
    document.getElementById('filtro-categoria').onchange = dibujarEventos;

    dibujarEventos();
});