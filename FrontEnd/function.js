// fonction pour récuperer l'id utilisateur et le token
function getAuthorization() {
    const token = JSON.parse(localStorage.getItem('auth')).token;
    return 'Bearer ' + token;
  }
  
  // Fonction pour voir si l'utilisateur est connecté
  function isConnected() {
    const connecting = getAuthorization() ? true : false;
    return connecting;
  }