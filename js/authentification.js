const loginForm = document.getElementById("login-form");

if(loginForm){
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const errorBox = document.getElementById("login-error");
    errorBox.hidden = true;

    const email  = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if(error){
      errorBox.textContent = "Email ou mot de passe incorrect.";
      errorBox.hidden = false;
    }
    else{
      window.location.href = "parametres.html";
    }

  });
}

const registerForm = document.getElementById("register-form");

if(registerForm){
  registerForm.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const errorBox = document.getElementById("register-error");
    errorBox.hidden = true;

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    if(password !== password2){
      errorBox.textContent="Les mots de passe ne correspondent pas.";
      errorBox.hidden = false;
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if(error){
      errorBox.textContent = "Inscription impossible :  " + error.message;
      errorBox.hidden = false;
    }
    else{
      const { error: erreurProfil } = await supabase.from('profiles').insert({ id: data.user.id, full_name: fullname, email: email});

      if(erreurProfil){
        errorBox.textContent = "Compte créé mais erreur sur le profile : " + erreurProfil.message;
        errorBox.hidden = false;
      }
      else {
        window.location.href = "index.html";
      }
    }
  });
}