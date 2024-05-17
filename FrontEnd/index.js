/*Gallery*/

fetch("http://localhost:5678/api/works") /*Récuperation de l'API*/
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (data) { /*Récuperation des données*/
        let works = data;
        console.log(works);
        works.forEach((work, index) => { /*Looping*/
            let myFigure = document.createElement('figure'); /*Création de figure*/
            myFigure.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
            myFigure.setAttribute('id', `work-item-${work.id}`);
            let myImg = document.createElement('img'); /*Création image et ses attribut*/
            myImg.setAttribute('src', work.imageUrl);
            myImg.setAttribute('alt', work.title);
            myFigure.appendChild(myImg);
            let myFigCaption = document.createElement('figcaption'); /*Création figcaption*/
            myFigCaption.textContent = work.title;
            myFigure.appendChild(myFigCaption);
            document.querySelector("div.gallery").appendChild(myFigure); /*Ajout dans la div gallery*/
        });
    })
    .catch(function (err) {
        console.log(err);
    });

/*Ajout de filtre*/

fetch("http://localhost:5678/api/categories") /*Récuperation de l'API*/
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (data) {
        let categories = data; /*Récuperation des données*/
        categories.unshift({ id: 0, name: 'Tous' }); /*Ajout d'une catégorie supplémentaire "Tous"*/
        console.log(categories);
        categories.forEach((category, index) => { /*Looping*/
            let myButton = document.createElement('button'); /*Création de boutton pour filtre*/
            myButton.classList.add('work-filter');
            myButton.classList.add('filters-design');
            if (category.id === 0) myButton.classList.add('filter-active', 'filter-all');
            myButton.setAttribute('data-filter', category.id);
            myButton.textContent = category.name;
            document.querySelector(".filters").appendChild(myButton); /*Ajout du boutton dans filtre*/
            myButton.addEventListener('click', function (event) {
                event.preventDefault();
                document.querySelectorAll('.work-filter').forEach((workFilter) => {
                    workFilter.classList.remove('filter-active');
                });
                event.target.classList.add('filter-active');
                let categoryId = myButton.getAttribute('data-filter');
                document.querySelectorAll('.work-item').forEach(workItem => {
                    workItem.style.display = 'none';
                });
                document.querySelectorAll(`.work-item.category-id-${categoryId}`).forEach(workItem => {
                    workItem.style.display = 'block';
                });
            });
        });
    })
    .catch((err) =>
        console.log(err)
    )

var token = "";
var connected = false;
const logButton = document.getElementById("logBtn");
const buttonModifier = document.getElementById("modifier");
const edition = document.querySelector(".edition");
const categories = document.querySelector(".filters");

// Fonction pour vérifier si l'utilisateur est connecté
function isConnected() {
    // Vérifie si le token est présent dans le local storage
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth && auth.token; // Retourne true si le token existe, false sinon
}

// Fonction pour mettre à jour l'interface utilisateur en fonction de l'état de connexion de l'utilisateur
function updateUI() {
    if (isConnected()) {
        // Si l'utilisateur est connecté, afficher le bouton de déconnexion
        logButton.textContent = "logout";
        // Afficher le bouton modifier
        buttonModifier.style.visibility = "visible";
        // Afficher la bannière
        document.getElementById('banner').style.display = 'block';
    } else {
        // Si l'utilisateur n'est pas connecté, afficher le bouton de connexion
        logButton.textContent = "login";
        // Masquer le bouton modifier
        buttonModifier.style.visibility = "hidden";
        edition.style.height = "auto";
        // Masquer la bannière
        document.getElementById('banner').style.display = 'none';
    }
}

// Appel initial pour mettre à jour l'interface utilisateur
updateUI();

// Gérer le clic sur le bouton de connexion/déconnexion
logButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (isConnected()) {
        // Si l'utilisateur est connecté, le déconnecter
        localStorage.removeItem("auth");
        updateUI();
        // Rediriger vers la page d'accueil après déconnexion
        window.location.href = "index.html";
    } else {
        // Rediriger l'utilisateur vers la page de connexion
        window.location.href = "login.html"; // Remplacez par l'URL de votre page de connexion
    }
});

