function renderDashboardCards() {
    const events = JSON.parse(localStorage.getItem('eventos')) || [];
    const container = document.getElementById('admin-cards-container');
    container.innerHTML = ''; 

    if (events.length === 0) {
        container.innerHTML = `<p style="color: white; text-align: center; grid-column: 1/-1;">No hay eventos registrados.</p>`;
        return;
    }

    events.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'event-card-admin';
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${ev.imagen || '../img/placeholder.png'}" onerror="this.src='../img/placeholder.png'">
            </div>
            <div class="card-body-admin">
                <span style="background: #0b4a0e; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; text-transform: uppercase;">
                    ${ev.categoria}
                </span>
                <h4 style="margin-top: 10px;">${ev.nombre}</h4>
                <p style="margin: 5px 0;">📍 ${ev.ciudad}</p>
                <div style="font-size: 1.2rem; font-weight: bold; color: #27ae60;">$${Number(ev.precio).toLocaleString()}</div>
            </div>
            
            <div style="padding: 15px; border-top: 1px solid #eee; display: flex; justify-content: space-between; background: #f8f9fa; border-radius: 0 0 15px 15px;">
                <button class="btn-edit-row" onclick="prepareEdit(${ev.id})">
                    Editar
                </button>
                <button class="btn-delete-row" onclick="deleteEvent(${ev.id})">
                    Eliminar
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- FUNCIÓN PARA ELIMINAR (Lógica) ---
window.deleteEvent = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este evento del dashboard?')) {
        let events = JSON.parse(localStorage.getItem('eventos')) || [];
        events = events.filter(ev => ev.id !== id);
        localStorage.setItem('eventos', JSON.stringify(events));
        renderDashboardCards(); 
    }
};

// --- FUNCIÓN PARA EDITAR (Lógica) ---
window.prepareEdit = (id) => {
   
    window.location.href = `./eventos.html?edit=${id}`;
};

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', renderDashboardCards);