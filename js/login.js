console.log("Bienvenido a Tickyiyo");
const formulario = document.querySelector('.login-form');
if (formulario) {
    formulario.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log("Datos capturados:", email, password);
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