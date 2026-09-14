async function chargerProfil() {
    const { data: sessionData } = await supabase.auth.getSession();

    if(!sessionData.session) {
        return;
    }

    const userId = sessionData.session.user.id;

    const { data: profil, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single();
    
    if(error) {
        console.log("Erreur en récupérant le profil :", error.message);
        return;
    }

    const initiales = profil.full_name
        .split(' ')
        .map(mot => mot[0])
        .join('')
        .toUpperCase();
    
    const bulle = document.getElementById('profileToggle');
    if (bulle) {
        console.log(bulle);
        bulle.textContent = initiales;
    }

    document.getElementById('profile-avatar').textContent = initiales;
    document.getElementById('profile-name').textContent = profil.full_name;
    document.getElementById('profile-email').textContent = profil.email;


    document.getElementById('value-name').value = profil.full_name;
    document.getElementById('value-email').value = profil.email;
    document.getElementById('value-tel').value = profil.phoneNumber;
    
}

chargerProfil();