console.log("Bienvenido a Tickyiyo");

// 1. Buscamos el formulario
const formulario = document.querySelector('.login-form');

if (formulario) {
    formulario.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue

        // 2. BUSCAMOS POR ID (Es lo más exacto)
        // Usamos .value para sacar el texto de la caja
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log("Datos capturados:", email, password);

        // 3. COMPARACIÓN
        if (email === 'admin@gmail.com' && password === '123456') {
            console.log("¡DATOS CORRECTOS!");
            window.location.href="../html/dashboard.html" 
        } else {
            console.log("DATOS INCORRECTOS");
            alert("El correo o la contraseña son incorrectos");
        }
    });
} else {
    console.error("No se encontró el formulario con la clase .login-form");
}