const galleryContainer = document.querySelector(".gallery")

const API = 'http://localhost:5678/api/works'

const getWorks = async()=> {
try {
const response = await fetch(`${API}`)
const results = await response.json()
console.log("Ensembles des works est",results)
} catch(error){
    console.error("L'API est erroné",error)
} 
}
getWorks()

