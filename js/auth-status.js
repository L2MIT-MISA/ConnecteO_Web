function mettreAJourStatutConnexion(){
  var lien = document.getElementById('auth-link');
  if (!lien) return;

  if (typeof supabase === 'undefined'){
    lien.textContent = "Se connecter";
    lien.href = "index.html";
    return;
  }

  supabase.auth.getSession().then(function(reponse){
    var session = reponse.data.session;

    if (session){
      lien.textContent = "Se déconnecter";
      lien.href = "#";
      lien.onclick = function(evenement){
        evenement.preventDefault();
        supabase.auth.signOut().then(function(){
          window.location.href = "index.html";
        });
      };
    } else {
      lien.textContent = "Se connecter";
      lien.href = "index.html";
      lien.onclick = null;
    }
  });
}

mettreAJourStatutConnexion();