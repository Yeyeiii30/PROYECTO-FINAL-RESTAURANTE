function toggleMenu() {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('overlay');
    const content  = document.getElementById('main-content');

    if (sidebar)  sidebar.classList.toggle('active');
    if (overlay)  overlay.classList.toggle('active');
    if (content)  content.classList.toggle('active');
}

function irMenu()    { window.location.href = 'menu.html';    }
function irOrden()   { window.location.href = 'ordenar.html'; }
function irReserva() { window.location.href = 'reservas.html';}

function mostrarToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function guardarReserva(e) {
    e.preventDefault();

    const inputs = e.target.querySelectorAll('input, select');
    const reserva = {
        nombre:   inputs[0].value,
        telefono: inputs[1].value,
        fecha:    inputs[2].value,
        hora:     inputs[3].value,
        personas: inputs[4].value
    };

    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    const msg = document.getElementById('mensaje');
    if (msg) {
        msg.textContent = 'Reserva guardada correctamente';
        msg.classList.add('visible');
        setTimeout(() => msg.classList.remove('visible'), 4000);
    }

    e.target.reset();
    mostrarReservas();
}

function mostrarReservas() {
    const lista = document.getElementById('listaReservas');
    if (!lista) return;

    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    if (reservas.length === 0) {
        lista.innerHTML = '<p class="empty-state">No hay reservas registradas aún.</p>';
        return;
    }

    lista.innerHTML = reservas.map((r, i) => `
        <div class="reserva-item">
            <div class="reserva-info">
                <strong>${r.nombre}</strong>
                <p>${r.fecha} a las ${r.hora}</p>
                <p>${r.personas} · 📞 ${r.telefono}</p>
            </div>
            <button class="btn-eliminar" onclick="eliminarReserva(${i})">✕ Eliminar</button>
        </div>
    `).join('');
}

function eliminarReserva(index) {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas.splice(index, 1);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    mostrarReservas();
    mostrarToast('Reserva eliminada');
}

function agregarCarrito(nombre, precio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push({ nombre, precio });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    mostrarToast('🛒 ' + nombre + ' agregado al carrito');
}

function mostrarCarrito() {
    const lista    = document.getElementById('listaCarrito');
    const totalEl  = document.getElementById('total');
    const countEl  = document.getElementById('carrito-count');

    if (!lista) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        lista.innerHTML = `
            <div class="carrito-empty">
                <span class="empty-icon">🛒</span>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega platos desde el menú para comenzar tu pedido</p>
                <a href="menu.html" class="btn-ver-menu">Ver Menú</a>
            </div>`;
        if (totalEl) totalEl.textContent = 'Total: $0';
        if (countEl) countEl.textContent = '0 ítems';
        return;
    }

    let total = 0;
    lista.innerHTML = carrito.map((item, i) => {
        total += item.precio;
        return `
        <div class="carrito-item">
            <span class="item-name">${item.nombre}</span>
            <span class="item-price">RD$${item.precio}</span>
            <button class="btn-eliminar-item" onclick="eliminarCarrito(${i})" title="Eliminar">✕</button>
        </div>`;
    }).join('');

    if (totalEl) totalEl.textContent = 'Total: RD$' + total;
    if (countEl) countEl.textContent = carrito.length + (carrito.length === 1 ? ' ítem' : ' ítems');
}

function eliminarCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const nombre  = carrito[index]?.nombre || 'Ítem';
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();
    mostrarToast(nombre + ' eliminado del carrito');
}

function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        mostrarToast('Tu carrito está vacío');
        return;
    }
    localStorage.removeItem('carrito');
    mostrarCarrito();
    actualizarContador();
    mostrarToast('Pedido realizado con éxito. ¡Gracias!');
}

function actualizarContador() {
    const carrito  = JSON.parse(localStorage.getItem('carrito')) || [];
    const contador = document.getElementById('contador');
    if (contador) contador.textContent = carrito.length;
}

function enviarMensaje(e) {
    e.preventDefault();
    const msg = document.getElementById('msgContacto');
    if (msg) {
        msg.textContent = 'Mensaje enviado correctamente. ¡Te responderemos pronto!';
        msg.classList.add('visible');
        setTimeout(() => msg.classList.remove('visible'), 5000);
    }
    mostrarToast('Mensaje enviado');
    e.target.reset();
}

function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

window.onload = function () {
    mostrarReservas();
    mostrarCarrito();
    actualizarContador();
    initScrollReveal();
};
