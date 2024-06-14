//URL de base qui est commune
const BASE_URL = 'http://localhost:5678/api/';

/*Gallery*/

let allWorks = [];

const getWorks = async () => {
    try {
        const response = await fetch(`${BASE_URL}works`); // Utilisation de BASE_URL
        if (!response.ok) {
            throw new Error('Failed to fetch works: ' + response.status);
        }
        const works = await response.json();
        allWorks = works; // On remplit le tableau des travaux
        console.log(works);
        populateWorks(works); // Appel de la fonction pour afficher les travaux
    } catch (err) {
        console.error('Error fetching works:', err);
    }
}

//Affiche les travaux dans la gallerie
const populateWorks = (works) => {
    const galleryDiv = document.querySelector("div.gallery");
    galleryDiv.innerHTML = ''; // Nettoie la galerie si besoin
    works.forEach(work => {
        let figure = createWorkFigure(work);
        galleryDiv.appendChild(figure); // Ajouter la figure à la galerie
    });
}

//Création d'une figure de travail
const createWorkFigure = (work) => {
    let myFigure = document.createElement('figure');
    myFigure.className = `work-item category-id-0 category-id-${work.categoryId}`;
    myFigure.id = `work-item-${work.id}`;

    let myImg = document.createElement('img');
    myImg.src = work.imageUrl;
    myImg.alt = work.title;
    myFigure.appendChild(myImg);

    let myFigCaption = document.createElement('figcaption');
    myFigCaption.textContent = work.title;
    myFigure.appendChild(myFigCaption);

    return myFigure;
}

//Appel de la méthode au rechargement et quand c'est nécessaire
document.addEventListener('DOMContentLoaded', getWorks);

let allCategory = [];

//Récupération des catégories avec une fonction asynchrone
const fetchCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}categories`);
        if (!response.ok) {
            throw new Error('Failed to fetch categories: ' + response.status);
        }
        const categories = await response.json();
        categories.unshift({ id: 0, name: 'Tous' }); // Ajout de la catégorie "Tous"
        allCategory = categories;
        console.log(categories);
        populateFilters(categories);
    } catch (err) {
        console.error('Error fetching categories:', err.message);
    }
}


//Fonction pour afficher les filtres avec les catégories
const populateFilters = (categories) => {
    const filterContainer = document.querySelector(".filters");
    filterContainer.innerHTML = ''; // Vide s'il y en a eu avant
    categories.forEach(category => {
        let button = createCategoryButton(category);
        filterContainer.appendChild(button);
        setupFilterButton(button, category.id);
    });
}

//Pour créer les boutons des catégories
const createCategoryButton = (category) => {
    let myButton = document.createElement('button');
    myButton.classList.add('work-filter', 'filters-design');
    if (category.id === 0) myButton.classList.add('filter-active', 'filter-all');
    myButton.setAttribute('data-filter', category.id);
    myButton.textContent = category.name;
    return myButton;
}

//Mettre en place les filtres
const setupFilterButton = (button, categoryId) => {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        setActiveFilter(button);
        filterWorksByCategory(categoryId);
    });
}

//Gérer l'activation ou non avec des styles css
const setActiveFilter = (button) => {
    document.querySelectorAll('.work-filter').forEach(workFilter => {
        workFilter.classList.remove('filter-active');
    });
    button.classList.add('filter-active');
}

//Filterer les catégories
const filterWorksByCategory = (categoryId) => {
    document.querySelectorAll('.work-item').forEach(workItem => {
        //Expression ternaire pour ne pas afficher les catégories qui ne sont pas sélectionnées
        workItem.style.display = workItem.classList.contains(`category-id-${categoryId}`) ? 'block' : 'none';
    });
}

//Appel de la fonction fetchCategories lorsque la page est chargée ou lorsque c'est nécessaire
document.addEventListener('DOMContentLoaded', fetchCategories);


const logButton = document.getElementById("logBtn");
const buttonModifier = document.getElementById("modifier");
const edition = document.querySelector(".edition");
const categories = document.querySelector(".filters");

// Fonction pour vérifier si l'utilisateur est connecté
const isConnected = () => {
    // Vérifie si le token est présent dans le local storage
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth && auth.token; // Retourne true si le token existe, false sinon
}

// Fonction pour mettre à jour l'interface utilisateur en fonction de l'état de connexion de l'utilisateur
const updateUI = () => {
    if (isConnected()) {
        // Si l'utilisateur est connecté, afficher le bouton de déconnexion
        logButton.textContent = "logout";
        // Afficher le bouton modifier
        buttonModifier.style.visibility = "visible";
        // Afficher la bannière
        document.getElementById('banner').style.display = 'block';
        categories.style.visibility = "hidden";
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

let trash = [];
let snaps = [];
let list_works = document.querySelector(".list_works");
let modal = document.querySelector(".modal");
let gallery_interface = document.querySelector(".gallery_interface");
let gallery_close = document.querySelector(".gallery_close"); // boutton de fermeture de la gallerie d'édition

/* Fonction pour récupérer les données depuis l'API et les afficher dans la gallerie de la modale principale et 
supprimer des works qu'on choisit de la gallerie de la modale principale*/
const modifier = async () => {
    try {
        const works = await fetch(`${BASE_URL}works`); // Récupération des données depuis l'API
        let worksData = await works.json(); // Conversion de la réponse en format JSON

        list_works.innerHTML = "";

        worksData.forEach(dataGroup => { // Parcours de chaque groupe de données

            let img = document.createElement("img"); // Crée un élément <img>
            img.src = dataGroup.imageUrl; // Définit l'attribut 'src' de <img>

            snaps[dataGroup.id] = document.createElement("figure"); // Crée un élément <img> pour chaque projet
            snaps[dataGroup.id].appendChild(img); // Ajoute <img> à <figure>

            trash[dataGroup.id] = document.createElement("i"); // Crée un élément <i> pour chaque projet
            trash[dataGroup.id].classList.add('fa-solid', 'fa-trash-can', 'trash');
            snaps[dataGroup.id].appendChild(trash[dataGroup.id]);

            list_works.appendChild(snaps[dataGroup.id]);

            let urlId = `${BASE_URL}works/${dataGroup.id}`;

            trash[dataGroup.id].addEventListener("click", () => {
                deleteData(urlId);
                modal.style.display = "none"
            })


        });
    } catch (error) {
        console.error('error fetching works:', error)
        throw new Error(`api error status with status code ${response.status}`)
    }
}

buttonModifier.addEventListener("click", () => {
    modal.style.display = "flex";
    gallery_interface.style.display = "flex";
    modifier();
})
//Pour fermer la gallerie
gallery_close.addEventListener("click", () => {
    modal.style.display = "none"

})

const galleryContainer = document.querySelector(".gallery")

getToken = () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth ? auth.token : null; // Retourne le token s'il existe, sinon null
}

//Méthode pour supprmier une image des travaux
const deleteData = async (urlId) => {
    const token = getToken();
    if (!token) {
        alert("Vous devez être connecté pour effectuer cette action");
        return;
    }
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
    if (!confirmation) {
        return;
    }
    try {
        let response = await fetch(urlId, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token} `
            }
        })
        if (!response.ok) {
            throw new Error(`error http ${response.status}`)
        }
        console.log("work deleted");
    } catch (error) {
        console.error('error fetching works:', error)
        throw new Error(`api error status with status code ${response.status}`)
    }

    galleryContainer.innerHTML = "";//Vider le contenu de la gallerie
    modifier(); //Rafraichir la gallerie
    getWorks(); //Rafraichir la liste des travaux
    gallery_interface.style.display = "none"; //Masquer la gallerie
}

//Crée les options categories de la balise select
const selectCategory = () => {
    const categorySelect = document.querySelector('#category');
    categorySelect.innerHTML = '';  // Nettoyer les options existantes

    let option = document.createElement('option');  // Créer une première option vide qui apparait par défaut
    categorySelect.appendChild(option);  // Ajouter la première option au select

    console.log(allCategory);  // Afficher toutes les catégories disponibles
    const categoriesWithoutTous = allCategory.filter(
        (categorie) => categorie.id !== 0  // Filtrer pour exclure la catégorie avec id 0
    );

    categoriesWithoutTous.forEach((categorie) => {
        let option = document.createElement('option');  // Créer une nouvelle option pour chaque catégorie
        option.value = categorie.name;  // Définir la valeur de l'option
        option.innerText = categorie.name;  // Définir le texte de l'option
        option.id = categorie.id;  // Définir l'ID de l'option
        categorySelect.appendChild(option);  // Ajouter l'option au select
    });
};


// Get the modal elements
const mainModal = document.getElementById('modal');
const addPhotoModal = document.getElementById('myModal');

// Get the button that opens the add photo modal
const addPhotoBtn = document.querySelector('.button_add');

// Get the <span> elements that close the modals
const closeBtns = document.querySelectorAll('.gallery_close');

// When the user clicks the button, open the add photo modal
addPhotoBtn.onclick = () => {
    mainModal.style.display = "none"; // Hide the main modal
    addPhotoModal.style.display = "block"; // Show the add photo modal
    resetFileInput(); // Réinitialiser le champ input file
    selectCategory();
    updateSubmitButtonState()
}

// When the user clicks on <span> (x), close the modals
closeBtns.forEach(function (btn) {
    btn.onclick = function () {
        mainModal.style.display = "none";
        addPhotoModal.style.display = "none";
    }
});

// When the user clicks anywhere outside of the modals, close them
window.onclick = function (event) {
    if (event.target == mainModal) {
        mainModal.style.display = "none";
    } else if (event.target == addPhotoModal) {
        addPhotoModal.style.display = "none";
    }
}


// Récupération du lien de retour
const returnIcon = document.getElementById('arrow-return');

// Fonction pour afficher la modale principale et cacher la modale d'ajout de photo
const showMainModal = () => {
    mainModal.style.display = 'flex';   // Modale principale
    addPhotoModal.style.display = 'none'; // Cache la modale d'ajout de photo
}

// Au click on revient sur la modale principale
returnIcon.addEventListener('click', function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien
    showMainModal();
});


// Récupérer les éléments HTML nécessaires
const fileInput = document.getElementById('file-upload');
const addButton = document.querySelector('.custom-file-upload');
const imagePreview = document.getElementById('imagePreview');

//Gestionnaire d'événements pour le clic sur le bouton "Ajouter une photo"
// Au chargement du fichier ou image
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    console.log('Fichier sélectionné:', file);
    const ACCEPTED_EXTENSIONS = ['png', 'jpg'];
    // On met le nom du fichier dans une variable
    const fileName = file.name;
    console.log('Nom du fichier sélectionné:', fileName);
    const extension = fileName.split('.').pop().toLowerCase();
    //On vérifie l'extension et la taille des images uploadées
    if (file &&
        file.size <= 4 * 1024 * 1024 &&
        ACCEPTED_EXTENSIONS.includes(extension)) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Afficher la prévisualisation de l'image
            addButton.style.display = 'none'; // Masquer le bouton "Ajouter photo"
        };
        reader.readAsDataURL(file);
    } else {
        alert('Erreur lors du chargement de l\'image');
    }
    updateSubmitButtonState();//Mettre à jour l'état du bouton "Valider"
});

let form = document.querySelector('#myModal form');

//Pour la soumission du formulaire
form.addEventListener('submit', async function (e) {
    e.preventDefault(); // Empêche le comportement de soumission de formulaire par défaut
    await upLoadFile(); // Appelle la fonction uploadFile pour envoyer l'image ou le work au serveur

});



//Pour transformer l'image en blob (binary large object) afin de faciliter le televersement.
const dataURLtoBlob = async (dataurl) => {
    const response = await fetch(dataurl);
    const blob = await response.blob();
    return blob;
};


//Pour envoyer l'image ou le work au serveur
const upLoadFile = async () => {
    const token = getToken();

    if (!token) {
        alert("Vous devez être connecté pour publier un work");
        return;
    }

    const select = document.getElementById('category');
    const title = document.getElementById('title').value;
    const optionName = select.options[select.selectedIndex].innerText;
    const optionId = select.options[select.selectedIndex].id;
    const selectedFile = fileInput.files[0];

    const reader = new FileReader();
    reader.onloadend = async function (event) {
        try {
            const base64String = event.target.result;
            /*On convertit l'image en blob qui est plus avantageux entre autres,  réduit l'utilisation de la mémoire
            et améliore les performances de l'applications etc */
            const blobImg = await dataURLtoBlob(base64String);

            const formData = new FormData();
            formData.append('image', blobImg);
            formData.append('title', title);
            formData.append('category', optionId);

            await postDataToBdd(token, formData, title, optionName);
        } catch (error) {
            console.error('Error converting image or uploading file:', error);
        }
    };
    reader.readAsDataURL(selectedFile);
};




//Permet d'ajouter un work dans la BDD ensuite dans la gallery
const postDataToBdd = async (token, formData, title, optionName) => {
    const urlPostWork = `${BASE_URL}works`;
    const confirmation = confirm(`Voulez-vous ajouter ${title} à la gallerie?`);
    if (!confirmation) return;

    try {
        const response = await fetch(urlPostWork, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const responseData = await response.json();
        console.log('Successful response:', responseData);
        addToWorksData(responseData, optionName);
        galleryContainer.innerHTML = ""; // Vider le contenu de la galerie
        modifier(); // Rafraîchir la galerie
        getWorks(); // Rafraîchir la liste des travaux
        addPhotoModal.style.display = "none"; // Masquer la galerie ajout photo
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
    }
};


const addToWorksData = (data, optionName) => {
    newWork = {};
    newWork.title = data.title;
    newWork.id = data.id;
    newWork.category = { id: data.optionId, name: optionName };
    newWork.imageUrl = data.imageUrl;
    allWorks.push(newWork);
};



const submitButton = document.querySelector("#myModal form button[type='submit']");

//Etat du bouton par défaut lorsque la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    submitButton.classList.add('validerDisabled');
    submitButton.disabled = true;
});



//Mettre à jour l'état du bouton "Valider"
const updateSubmitButtonState = () => {
    const title = document.getElementById('title').value.trim();//On enlève les espaces du title
    const categorySelected = document.getElementById('category').selectedIndex > 0;
    const imageLoaded = fileInput.files.length > 0;

    console.log('title', title, 'categorySelected', categorySelected, 'imageLoaded', imageLoaded);
    console.log('submitButton', submitButton);

    if (title && categorySelected && imageLoaded) {
        submitButton.classList.remove('validerDisabled');
        submitButton.classList.add('valider');
        submitButton.disabled = false;
    } else {
        submitButton.classList.add('validerDisabled');
        submitButton.disabled = true;
    }
}

document.getElementById('title').addEventListener('input', updateSubmitButtonState);
document.getElementById('category').addEventListener('change', updateSubmitButtonState);
fileInput.addEventListener('change', updateSubmitButtonState);



// Gestion de la fermeture de la modale d'ajout de photo

document.querySelectorAll('.gallery_close').forEach(el => el.addEventListener('click', function () {
    document.getElementById('myModal').style.display = 'none';
    resetFileInput();
}));



const resetFileInput = () => {
    fileInput.value = ''; // Réinitialiser l'élément input type file
    document.getElementById('title').value = ''; // Réinitialiser le champs title
    imagePreview.src = '';
    imagePreview.style.display = 'none'; // Masquer la prévisualisation de l'image
    addButton.style.display = 'inline'; // Afficher le bouton "Ajouter photo"

} 
