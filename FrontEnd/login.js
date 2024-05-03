const baseApiUrl = "http://localhost:5678/api/"; 

document.addEventListener("submit", (e) => {
  e.preventDefault(); /*Evite rechargement de la page*/
  let form = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
  };

  fetch(`${baseApiUrl}users/login`, { /*Envoie une requête HTTP POST à l'URL*/
    method: "POST", /*Spécifie que la méthode HTTP utilisée est POST, ce qui est approprié pour soumettre des informations sensibles*/
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ /*convertit l'objet JavaScript contenant l'e-mail et le mot de passe en une chaîne JSON pour l'envoyer dans le corps de la requête.*/
      email: form.email.value,
      password: form.password.value,
    }),
  }).then((response) => {
    if (response.status !== 200) {
      alert("Email ou mot de passe erronés");
    } else {
      response.json().then((data) => {
        sessionStorage.setItem("token", data.token); //STORE TOKEN /*Si la réponse de la requête est réussie (statut 200), cette ligne stocke le token renvoyé par l'API dans le sessionStorage du navigateur. Le token est généralement utilisé pour authentifier les futures requêtes de l'utilisateur.*/
        window.location.replace("index.html");
      });
    }
  });
});