console.log("Bienvenido a Tickyiyo")
document.querySelector('.login button').addEventListener('click',(event)=>{
    event.preventDefault()
    const email =document.querySelector['input [type="email"]']
    const password=document.querySelector['input [type="password"]']
    console.log("Datos recibidos: ",email,password)
    if(email=='admin@gmail.com' && password=='123456'){
    console.log("Datos correctos")
    window.location="../dashboard.html"
    }
    else{
        console.log("DATOS INCORRECTOS")
    }
})
