const form = document.getElementsByClassName("form-login")[0].elements;
const messageError = document.getElementById("msg-error");
const loginURL = "http://localhost:5678/api/users/login";

// Se connecter lorque l'on clic sur le bouton
form["submit-login"].addEventListener("click",function (event) {
event.preventDefault();

  // Validation du formulaire
  if (form.email.value === "" || form.password.value === "") {
    messageError.style.display = "flex";
    return;
  } else {
    messageError.style.display = "none";
  }

    fetch(loginURL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            email: form.email.value,
            password: form.password.value,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        // Stocker les informations d'authentification et rediriger
        localStorage.setItem('auth', JSON.stringify(data));
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth && auth.token) {
          window.location = "index.html";
        } else {
          messageError.style.display = "flex";
        }
    })
    .catch((error) => {
      console.error('Error:', error);
      messageError.style.display = "flex";
    });
})
