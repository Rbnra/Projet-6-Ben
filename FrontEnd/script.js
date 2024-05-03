const galleryContainer = document.querySelector(".gallery")

const API = 'http://localhost:5678/api/works'

const getWorks = async()=> {
try {
const response = await fetch(`${API}`)
const results = await response.json()
for(let work of results) {
const figure = createWorkFigure(work)
galleryContainer.appendChild(figure)
}
console.log("Ensembles des works est",results)
} catch(error){
    console.error("L'API est erroné",error)
} 
}
getWorks()

const createWorkFigure = (work) => {
const figure = document.createElement("figure")
const image = document.createElement("img")
image.src = work.imageUrl
image.alt = work.title
figure.appendChild(image)

const figcaption = document.createElement("figcaption")
figcaption.textContent = work.title
figure.appendChild(figcaption)
return figure 
}