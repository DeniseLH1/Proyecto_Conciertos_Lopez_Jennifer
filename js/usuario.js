// Variable global para almacenar los productos seleccionados
let carrito = [];
let buzon=[];

/**
 * 1. CARGAR CATEGORÍAS
 * Trae las categorías desde el LocalStorage (creadas en el Admin)
 * y las pone en el select de filtros.
 */
function cargarCategoriasDinamicas() {
    const filtroSelect = document.getElementById('filtro-categoria');
    if (!filtroSelect) return;

    const categoriasGuardadas = JSON.parse(localStorage.getItem('categorias')) || [];
    filtroSelect.innerHTML = '<option value="">Todas las Categorías</option>';

    categoriasGuardadas.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.nombre;
        option.textContent = cat.nombre;
        filtroSelect.appendChild(option);
    });
}

/**
 * 2. RENDERIZAR EVENTOS (Buscador + Filtros)
 * Esta función se ejecuta cada vez que escribes o cambias un filtro.
 */
function dibujarEventos() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const busquedaInput = document.getElementById('input-busqueda');
    const ciudadInput = document.getElementById('filtro-ciudad');
    const catInput = document.getElementById('filtro-categoria');
    const contenedor = document.getElementById('contenedor-eventos');

    if (!contenedor) return;

    // Capturamos los valores actuales de los filtros
    const textoBusqueda = busquedaInput ? busquedaInput.value.toLowerCase() : "";
    const ciudadSel = ciudadInput ? ciudadInput.value : "";
    const catSel = catInput ? catInput.value : "";

    contenedor.innerHTML = '';

    // Aplicamos la lógica de filtrado
    const filtrados = eventos.filter(ev => {
        const coincideNombre = ev.nombre.toLowerCase().includes(textoBusqueda);
        const coincideCiudad = ciudadSel === "" || ev.ciudad === ciudadSel;
        const coincideCat = catSel === "" || ev.categoria === catSel;
        return coincideNombre && coincideCiudad && coincideCat;
    });

    // Si no hay resultados
    if (filtrados.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
            No se encontraron eventos que coincidan con tu búsqueda.
        </p>`;
        return;
    }

    // Dibujamos las tarjetas (Cards)
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
                <button class="btn-add-buzon" onclick="agregarAlBuzon(${ev.bu})">Agregar al buzon</buton>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

/**
 * 3. VISTA DE DETALLE (Modal de información)
 */
window.verDetalle = (id) => {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const ev = eventos.find(e => e.id === id);
    if (!ev) return;

    const contenido = document.getElementById('contenido-detalle');
    contenido.innerHTML = `
        <div class="detalle-grid-content">
            <img src="${ev.imagen}" alt="${ev.nombre}" style="width:100%; border-radius:10px; max-height: 400px; object-fit: cover;">
            <div>
                <h2>${ev.nombre}</h2>
                <p style="margin: 15px 0; color: #555; line-height: 1.6;">${ev.descripcion || 'Sin descripción disponible.'}</p>
                <p><strong>📍 Ubicación:</strong> ${ev.ciudad}</p>
                <p><strong>🗓️ Fecha y Hora:</strong> ${ev.fecha} | ${ev.hora || '20:00'}</p>
                <h3 style="color: #27ae60; margin: 20px 0;">Precio: $${Number(ev.precio).toLocaleString()}</h3>
                <button class="btn-save" style="width: 100%;" onclick="agregarAlCarrito(${ev.id}); cerrarDetalle();">
                    Añadir al Carrito ahora
                </button>
            </div>
        </div>
    `;
    document.getElementById('modal-detalle').style.display = 'flex';
};

/**
 * 4. GESTIÓN DEL CARRITO
 */
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

function actualizarCarritoUI() {
    const badge = document.getElementById('contador-carrito');
    const lista = document.getElementById('lista-carrito');
    const totalElement = document.getElementById('precio-total');

    if (badge) badge.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (lista) {
        lista.innerHTML = '';
        let totalAcumulado = 0;

        carrito.forEach((item, index) => {
            const subtotal = Number(item.precio) * item.cantidad;
            totalAcumulado += subtotal;
            lista.innerHTML += `
                <div class="item-carrito" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <img src="${item.imagen}" width="50" height="50" style="object-fit:cover; border-radius:5px;">
                    <div style="flex-grow:1; margin-left:10px;">
                        <strong>${item.nombre}</strong><br>
                        <div style="margin-top: 5px;">
                            <button onclick="cambiarCantidad(${index}, -1)">-</button>
                            <span style="margin: 0 10px;">${item.cantidad}</span>
                            <button onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color:#27ae60; font-weight: bold;">$${subtotal.toLocaleString()}</div>
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

/**
 * 6. INICIALIZACIÓN DE LISTENERS
 * Esperamos a que el DOM esté listo para conectar los inputs
 */
document.addEventListener('DOMContentLoaded', () => {
    cargarCategoriasDinamicas();
    dibujarEventos();

    // Conectamos los filtros al buscador
    const inputBusqueda = document.getElementById('input-busqueda');
    const filtroCiudad = document.getElementById('filtro-ciudad');
    const filtroCategoria = document.getElementById('filtro-categoria');

    if (inputBusqueda) inputBusqueda.addEventListener('input', dibujarEventos);
    if (filtroCiudad) filtroCiudad.addEventListener('change', dibujarEventos);
    if (filtroCategoria) filtroCategoria.addEventListener('change', dibujarEventos);
});
document.addEventListener('DOMContentLoaded', () => {
    // Es vital llamar a inicializar aquí también por si el usuario
    const existentes = JSON.parse(localStorage.getItem('eventos'));
    if (!existentes || existentes.length === 0) {
        const semilla = [{
            id: 1711280000001,
            codigo: 'EV-101',
            nombre: 'PAULO LONDRA',
            categoria: 'Conciertos',
            ciudad: 'Bogotá',
            precio: 250000,
            imagen: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745'
        }];
        localStorage.setItem('eventos', JSON.stringify(semilla));
    }
    dibujarEventos();
});
function cargarCategoriasDinamicas() {
    const filtroSelect = document.getElementById('filtro-categoria');
    if (!filtroSelect) return;

    const categoriasGuardadas = JSON.parse(localStorage.getItem('categorias')) || [];

    // Limpiamos y dejamos la opción por defecto
    filtroSelect.innerHTML = '<option value="">Todas las Categorías</option>';

    // Creamos una opción por cada categoría guardada
    categoriasGuardadas.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.nombre;
        option.textContent = cat.nombre;
        filtroSelect.appendChild(option);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar categorías si están vacías (Semilla)
    if (!localStorage.getItem('categorias')) {
        const catSemilla = [{ id: 1, nombre: 'Conciertos', descripcion: 'Música en vivo' }];
        localStorage.setItem('categorias', JSON.stringify(catSemilla));
    }
    // 2. Cargar el menú desplegable de filtros
    cargarCategoriasDinamicas();

    // 3. Dibujar los eventos (como ya lo tenías)
    dibujarEventos();
});



// buzon
/**
 * 4. GESTIÓN DEL BUZON
 */
/**
 * 4. GESTIÓN DEL CARRITO
 */
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

function actualizarCarritoUI() {
    const badge = document.getElementById('contador-carrito');
    const lista = document.getElementById('lista-carrito');
    const totalElement = document.getElementById('precio-total');

    if (badge) badge.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (lista) {
        lista.innerHTML = '';
        let totalAcumulado = 0;

        carrito.forEach((item, index) => {
            const subtotal = Number(item.precio) * item.cantidad;
            totalAcumulado += subtotal;
            lista.innerHTML += `
                <div class="item-carrito" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <img src="${item.imagen}" width="50" height="50" style="object-fit:cover; border-radius:5px;">
                    <div style="flex-grow:1; margin-left:10px;">
                        <strong>${item.nombre}</strong><br>
                        <div style="margin-top: 5px;">
                            <button onclick="cambiarCantidad(${index}, -1)">-</button>
                            <span style="margin: 0 10px;">${item.cantidad}</span>
                            <button onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color:#27ae60; font-weight: bold;">$${subtotal.toLocaleString()}</div>
                        <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; color:red; cursor:pointer;">Eliminar</button>
                    </div>
                </div>
            `;
        });
        if (totalElement) totalElement.textContent = `$${totalAcumulado.toLocaleString()}`;
    }
}
S