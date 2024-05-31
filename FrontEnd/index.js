// Récupérer et afficher les travaux depuis l'API
function getWorks() {
    fetch("http://localhost:5678/api/works")
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(data) {
        let works = data;
        console.log(works);
        works.forEach((work, index) => {
            let myFigure = document.createElement('figure');
            myFigure.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
            myFigure.setAttribute('id', `work-item-${work.id}`);
            let myImg = document.createElement('img');
            myImg.setAttribute('src', work.imageUrl);
            myImg.setAttribute('alt', work.title);
            myFigure.appendChild(myImg);
            let myFigCaption = document.createElement('figcaption');
            myFigCaption.textContent = work.title;
            myFigure.appendChild(myFigCaption);
            document.querySelector("div.gallery").appendChild(myFigure);
        });
    })
    .catch(function(err) {
        console.log(err);
    });
}
getWorks();

// Ajouter des filtres depuis l'API
fetch("http://localhost:5678/api/categories")
.then(function(response) {
    if (response.ok) {
        return response.json();
    }
})
.then(function(data) {
    let categories = data;
    categories.unshift({ id: 0, name: 'Tous' });
    console.log(categories);
    categories.forEach((category, index) => {
        let myButton = document.createElement('button');
        myButton.classList.add('work-filter', 'filters-design');
        if (category.id === 0) myButton.classList.add('filter-active', 'filter-all');
        myButton.setAttribute('data-filter', category.id);
        myButton.textContent = category.name;
        document.querySelector(".filters").appendChild(myButton);
        myButton.addEventListener('click', function(event) {
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
.catch((err) => console.log(err));

// Vérifier si l'utilisateur est connecté
function isConnected() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth && auth.token;
}

// Mettre à jour l'interface utilisateur selon l'état de connexion
function updateUI() {
    const logButton = document.getElementById("logBtn");
    const buttonModifier = document.getElementById("modifier");
    const edition = document.querySelector(".edition");
    const categories = document.querySelector(".filters");

    if (isConnected()) {
        logButton.textContent = "logout";
        buttonModifier.style.visibility = "visible";
        document.getElementById('banner').style.display = 'block';
        categories.style.visibility = "hidden";
    } else {
        logButton.textContent = "login";
        buttonModifier.style.visibility = "hidden";
        edition.style.height = "auto";
        document.getElementById('banner').style.display = 'none';
    }
}

// Initialiser l'interface utilisateur
updateUI();

// Gérer le clic sur le bouton de connexion/déconnexion
document.getElementById("logBtn").addEventListener("click", (event) => {
    event.preventDefault();
    if (isConnected()) {
        localStorage.removeItem("auth");
        updateUI();
        window.location.href = "index.html";
    } else {
        window.location.href = "login.html";
    }
});

// Modifier la galerie
const modifier = async () => {
    try {
        const works = await fetch("http://localhost:5678/api/works");
        let worksData = await works.json();
        let list_works = document.querySelector(".list_works");
        list_works.innerHTML = "";

        worksData.forEach(dataGroup => {
            let img = document.createElement("img");
            img.src = dataGroup.imageUrl;
            let figure = document.createElement("figure");
            figure.appendChild(img);
            let trashIcon = document.createElement("i");
            trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash');
            figure.appendChild(trashIcon);
            list_works.appendChild(figure);

            let urlId = 'http://localhost:5678/api/works/' + dataGroup.id;
            trashIcon.addEventListener("click", function(event) {
                event.stopPropagation();
                deleteData(urlId);
            });
        });
    } catch (error) {
        console.error('error fetching works:', error);
    }
}

document.getElementById("modifier").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "flex";
    document.querySelector(".gallery_interface").style.display = "flex";
    modifier();
});

// Fermer la galerie
document.querySelectorAll(".gallery_close").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".modal").style.display = "none";
    });
});

// Supprimer une image
function getToken() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth ? auth.token : null;
}

const deleteData = async (urlId) => {
    const token = getToken();
    try {
        let response = await fetch(urlId, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`error http ${response.status}`);
        }
    } catch (error) {
        console.error('error fetching works:', error);
    }
}

// Gérer les modales
const mainModal = document.getElementById('modal');
const addPhotoModal = document.getElementById('myModal');
const addPhotoBtn = document.querySelector('.button_add');
const closeBtns = document.querySelectorAll('.gallery_close');

addPhotoBtn.onclick = function() {
    mainModal.style.display = "none";
    addPhotoModal.style.display = "block";
}

closeBtns.forEach(function(btn) {
    btn.onclick = function() {
        mainModal.style.display = "none";
        addPhotoModal.style.display = "none";
    }
});

window.onclick = function(event) {
    if (event.target == mainModal) {
        mainModal.style.display = "none";
    } else if (event.target == addPhotoModal) {
        addPhotoModal.style.display = "none";
    }
}

// Prévisualisation de l'image ajoutée
const fileInput = document.getElementById('file-upload');
const addButton = document.querySelector('.custom-file-upload');
const imagePreview = document.getElementById('imagePreview');

// Gestionnaire d'événements pour le clic sur le bouton "Ajouter une photo"
addButton.addEventListener('click', function() {
    // Déclencher le clic sur l'élément input type file
    fileInput.click();
});

// Gestionnaire d'événements pour le changement de fichier
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Afficher la prévisualisation de l'image
            addButton.style.display = 'none'; // Masquer le bouton "Ajouter photo"
        };
        reader.readAsDataURL(file);
    }
});

// Gestion de l'ouverture et de la fermeture de la modal
document.querySelector('.button_add').addEventListener('click', function() {
    document.getElementById('myModal').style.display = 'block';
    resetFileInput(); // Réinitialiser l'input à l'ouverture de la modal
});

document.querySelectorAll('.gallery_close').forEach(el => el.addEventListener('click', function() {
    document.getElementById('myModal').style.display = 'none';
    resetFileInput();
}));

window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('myModal')) {
        document.getElementById('myModal').style.display = 'none';
        resetFileInput();
    }
});

function resetFileInput() {
    fileInput.value = ''; // Réinitialiser l'élément input type file
    imagePreview.src = '';
    imagePreview.style.display = 'none'; // Masquer la prévisualisation de l'image
    addButton.style.display = 'inline'; // Afficher le bouton "Ajouter photo"
}

