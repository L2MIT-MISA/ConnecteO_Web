let conversationActive = null;
async function chargerMessages() {
    const { data: sessionData } = await supabase.auth.getSession();

    if(!sessionData.session) {
        return;
    }

    const monId = sessionData.session.user.id;

    const { data: messages, error } = await supabase
        .from('messages')
        .select('id, content, created_at, sender_id, receiver_id')
        .or(`sender_id.eq.${monId},receiver_id.eq.${monId}`)
        .order('created_at', { ascending: false });
    
    if(error) {
        console.log("Erreur en recuperant les messages :", error.message);
        return;
    }

    const conversations = {};

    messages.forEach(msg => {
        const autreId = msg.sender_id === monId ? msg.receiver_id : msg.sender_id;

        if(!conversations[autreId]) {
            conversations[autreId] = msg;
        }
    });

    const convList = document.getElementById('conv-list');
    convList.innerHTML = '';

    for(const autreId in conversations) {
        const dernierMsg = conversations[autreId];

        const { data: profil } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', autreId)
            .single();
        
        const nom = profil ? profil.full_name : 'utilisateur inconnu';
        const initiales = nom.split(' ').map(m => m[0]).join('').toUpperCase();
        const heure = new Date(dernierMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        convList.innerHTML += `
          <div class="msg-row" data-id="${autreId}">
            <div class="avatar">${initiales}</div>
            <div class="msg-info">
              <div class="top-line">
                <span class="name">${nom}</span>
                <span class="time">${heure}</span>
              </div>
              <div class="preview">${dernierMsg.content}</div>
            </div>
          </div>
        `;
    }
    document.querySelectorAll('.msg-row').forEach(ligne => {
    ligne.addEventListener('click', () => {
        const autreId = ligne.dataset.id;
        const nom = ligne.querySelector('.name').textContent;
        ouvrirConversation(autreId, nom, monId);
    });
  });
}


async function ouvrirConversation(autreId, nom, monId) {
    conversationActive = { autreId, nom, monId };
    const { data: msgs, error } = await supabase
        .from('messages')
        .select('id, content, created_at, sender_id')
        .or(`and(sender_id.eq.${monId},receiver_id.eq.${autreId}),and(sender_id.eq.${autreId},receiver_id.eq.${monId})`)
        .order('created_at', { ascending: true});

    if(error) {
        console.log("Erreur chargement conversation :", error.message);
        return;
    }

    const initiales = nom.split(' ').map(m => m[0]).join('').toUpperCase();

    document.querySelector('.chat-header').innerHTML = `
        <div class="avatar">${initiales}</div>
        <div>
            <div class="name">${nom}</div>
            <div class="status">En ligne</div>
        </div>
    `;
    document.querySelector('.chat-input').style.display = 'flex';
    const zoneMessages = document.querySelector('.chat-messages');
    zoneMessages.innerHTML = '';

    msgs.forEach(msg => {
        const type = msg.sender_id === monId ? 'sent' : 'received';
        zoneMessages.innerHTML += `<div class="bubble ${type}">${msg.content}</div>`;
    });
}

async function envoyerMessage() {
    if(!conversationActive) {
        console.log(conversationActive);
        return;
    }
    const champ = document.querySelector('.chat-input input');
    const texte = champ.value.trim();

    if(!texte) return;

    const { error } = await supabase
        .from('messages')
        .insert({
            sender_id: conversationActive.monId,
            receiver_id: conversationActive.autreId,
            content: texte,
            read: false
    });

    if(error) {
        console.log("Erreur envoi message :", error.message);
        return;
    }

    document.querySelector('.chat-messages').innerHTML += `<div class="bubble sent">${texte}</div>`;
    champ.value = '';

    chargerMessages();
}

document.querySelector('.chat-input button').addEventListener('click', envoyerMessage);
chargerMessages();

async function afficherUtilisateurs() {
    const { data: sessionData } = await supabase.auth.getSession();
    const monId = sessionData.session.user.id;
    const { data: profils, error } = await supabase
        .from('profiles')   
        .select('id, full_name')
        .neq('id', monId);

    if(error)
    {
        console.log("Erreur récupération utilisateurs :", error.message);
        return;
    }

    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    profils.forEach(p => {
        const nom = p.full_name || 'Utilisateur inconnu';
        userList.innerHTML+= `
            <div class="msg-row" data-id="${p.id}" data-nom="${p.full_name}">
                <div class="avatar">${nom[0].toUpperCase()}</div>
                <div class="msg-info"><span class="name">${p.full_name}</span></div>
            </div>
        `;
    });

    userList.querySelectorAll('.msg-row').forEach(ligne => {
        ligne.addEventListener('click', () => {
            const autreId = ligne.dataset.id;
            const nom = ligne.dataset.nom;
            ouvrirConversation(autreId, nom, monId);
            userList.style.display = 'none';
        });
    });

    userList.style.display = 'block';
    chargerMessages();
}

document.getElementById('btn-nouveau').addEventListener('click', afficherUtilisateurs);