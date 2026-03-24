let carrito = [];

// 1. RENDERIZAR CARTELERA
function dibujarEventos() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const busqueda = document.getElementById('input-busqueda').value.toLowerCase();
    const ciudad = document.getElementById('filtro-ciudad').value;
    const categoria = document.getElementById('filtro-categoria').value;
    
    const contenedor = document.getElementById('contenedor-eventos');
    contenedor.innerHTML = '';

    const filtrados = eventos.filter(ev => {
        return ev.nombre.toLowerCase().includes(busqueda) &&
               (ciudad === "" || ev.ciudad === ciudad) &&
               (categoria === "" || ev.categoria === categoria);
    });

    filtrados.forEach(ev => {
        const card = document.createElement('article');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-image" style="background-image: url('${ev.imagen}')" onclick="verDetalle(${ev.id})"></div>
            <div class="event-details">
                <h3 onclick="verDetalle(${ev.id})">${ev.nombre}</h3>
                <p>🗓️ ${ev.fecha} | 🕒 ${ev.hora || '20:00'}</p>
                <p>📍 ${ev.ciudad}</p>
                <div class="event-price">$${Number(ev.precio).toLocaleString()}</div>
                <button class="btn-add-cart" onclick="agregarAlCarrito(${ev.id})">Agregar al Carrito</button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// 2. VISTA DE DETALLE
window.verDetalle = (id) => {
    const ev = JSON.parse(localStorage.getItem('eventos')).find(e => e.id === id);
    document.getElementById('contenido-detalle').innerHTML = `
        <img src="${ev.imagen}" style="width:100%; border-radius:10px;">
        <h2>${ev.nombre}</h2>
        <p style="color:#aaa;">${ev.descripcion}</p>
        <div class="event-meta">
            <span>📅 ${ev.fecha}</span> | <span>🕒 ${ev.hora || '20:00'}</span>
        </div>
        <h3 style="color:#27ae60; margin: 15px 0;">Precio: $${Number(ev.precio).toLocaleString()}</h3>
        <button class="btn-save" onclick="agregarAlCarrito(${ev.id}); cerrarDetalle();">Añadir al Carrito</button>
    `;
    document.getElementById('modal-detalle').style.display = 'flex';
};

// 3. LÓGICA DEL CARRITO
window.agregarAlCarrito = (id) => {
    const ev = JSON.parse(localStorage.getItem('eventos')).find(e => e.id === id);
    carrito.push(ev);
    actualizarCarritoUI();
};

function actualizarCarritoUI() {
    document.getElementById('contador-carrito').textContent = carrito.length;
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        total += Number(item.precio);
        lista.innerHTML += `
            <div class="item-carrito">
                <img src="${item.imagen}" width="50">
                <div>
                    <strong>${item.nombre}</strong><br>
                    <span>$${Number(item.precio).toLocaleString()}</span>
                </div>
                <button onclick="eliminarDelCarrito(${index})">❌</button>
            </div>
        `;
    });
    document.getElementById('precio-total').textContent = `$${total.toLocaleString()}`;
}

// 4. FINALIZAR COMPRA (Almacenar en Módulo de Ventas)
document.getElementById('form-compra').onsubmit = (e) => {
    e.preventDefault();
    if(carrito.length === 0) return alert("El carrito está vacío");

    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    
    // Crear el registro de venta por cada item o por el total
    const nuevaVenta = {
        id: "TICK-" + Date.now(),
        fechaVenta: new Date().toISOString(), // REQUISITO: Fecha de realización
        cliente: {
            id: document.getElementById('c-id').value,
            nombre: document.getElementById('c-nombre').value,
            direccion: document.getElementById('c-dir').value,
            telefono: document.getElementById('c-tel').value,
            email: document.getElementById('c-email').value
        },
        items: carrito,
        total: carrito.reduce((sum, item) => sum + Number(item.precio), 0)
    };

    ventas.push(nuevaVenta);
    localStorage.setItem('ventas', JSON.stringify(ventas));
    
    alert("¡Compra exitosa! Revisa tus entradas en el correo.");
    carrito = [];
    actualizarCarritoUI();
    cerrarCarrito();
};

// Listeners de filtros
document.getElementById('input-busqueda').oninput = dibujarEventos;
document.getElementById('filtro-ciudad').onchange = dibujarEventos;
document.getElementById('filtro-categoria').onchange = dibujarEventos;

window.cerrarDetalle = () => document.getElementById('modal-detalle').style.display = 'none';
window.abrirCarrito = () => document.getElementById('modal-carrito').style.display = 'flex';
window.cerrarCarrito = () => document.getElementById('modal-carrito').style.display = 'none';

// Carga inicial
dibujarEventos();