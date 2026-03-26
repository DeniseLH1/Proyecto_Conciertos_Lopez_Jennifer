document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.login-form');
    if (formulario) {
        formulario.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email === 'admin@gmail.com' && password === '123456') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Acceso Correcto!',
                    text: 'Bienvenida al panel de administración',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href="../html/dashboard.html"
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de acceso',
                    text: 'Correo o contraseña incorrectos',
                    confirmButtonColor: '#0b4a0e'
                });
            }
        });
    }
});
