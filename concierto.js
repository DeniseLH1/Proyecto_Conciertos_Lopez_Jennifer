// -->Modulo de ventas parte administrativa
const user={
    email: "",
    password:""
}
const categorias=[
    {
        code:"01",
        name:"Bandas de Mexico",
        description:"",
        active:true
    },
]
// MANERA REFERENCIADA A TRAVES DEL CODIGO
const concerts=[
    {
        code:"C01",
        name:"",
        category:"01",
        price:0,
        date:"",
        hour:"",
        city:"",
        imageUrl:"",
        description:""
    },
    {
        code: "C05",
        name: "",
        category: "01",
        price: 12,
        eventDate: "",
        hour: "",
        city: "",
        imageUrl: "",
        description: ""
      }
]

// -->carrito de compras
const sales =[
    {
        customer:{
            identificationNumber:"",
            fullName:"",
            address:"",
            phone:"",
            email:""
        },
        tickets:[
         {// bebida
         concerts:{
                code:"C01",
                name:"",
                category:"01",
                price:10,
                date:"",
                hour:"",
                city:"",
                imageUrl:"",
                description:""
            },
            quantity:2
        },
        // referenciado
        {
            concert:"C05", 
            quantity:"1"
        }
        ]
    }
]



// function leerLocalStorage(){
//     let datos = localStorage.getItem('productos')
//     return JSON.parse(datos)
// }
// function escribirLocalStorage(datos){
//     const obj =leerLocalStorage()??[]
//     obj.push(datos)
//     localStorage.setItem('productos',JSON.stringify(obj))
// }
// localStorage.clear()
// // escribirLocalStorage({
// //     cod:"01",
// //     nombre:"Tomates",
// //     precio:15
// // })
// // escribirLocalStorage({
// //     cod:"02",
// //     nombre:"Papas",
// //     precio:10
// // })
// console.log(leerLocalStorage())