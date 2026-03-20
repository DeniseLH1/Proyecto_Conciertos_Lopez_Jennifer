document.addEventListener['submit',(event)=>{
    event.preventDefault()
    const email =document.querySelector['input[type="email"]'].value
    const password=document.querySelector['input[type="password"]'].value
    console.log("Datos recibidos: ",email,password)
    if(email==='admin@gmail.com'&& password==='123456'){
    console.log("Datos correctos")
    window.location.href="Snooptick.html"
    }
    else{
    console.log("DATOS INCORRECTOS")
    }
}]
