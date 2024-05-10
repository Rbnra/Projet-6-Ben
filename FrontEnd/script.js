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
const logButton = document.getElementById("logBtn")
const buttonModifier = document.getElementById("modifier")
const edition = document.querySelector(".edition")
const categories = document.querySelector(".filters")
const connectedFunction = () => {
	token = sessionStorage.getItem("token");
	if (token) {
		connected = true;
	}

	if (connected) {
		logButton.textContent = "logout";
		buttonModifier.style.visibility = "visible";
		edition.style.height = "5.5vh";
		/*categories.style.display = "none";*/
	} else {
		buttonModifier.style.visibility = "hidden";
	}
}

connectedFunction()

