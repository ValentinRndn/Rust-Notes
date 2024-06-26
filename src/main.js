const titre = document.getElementById('titre');
const contenu = document.getElementById('contenu');
const addBox = document.querySelector('.add-box');
const popupBox = document.querySelector('.popup-box');
const titleTag = document.querySelector("#titre");
const descTag = document.querySelector("#contenu");
const addButton = document.querySelector('#addNote');
const id = document.getElementById("id"); // Déclarer 'id' avant de l'utiliser
let noteCount = 0;
// Fonction pour créer une note
async function creerNote() {
  const { invoke } = window.__TAURI__.tauri;
  const noteId = id.value;

  try {
    if (noteId) {
      // Si l'ID de la note existe, mettre à jour la note existante
      await updateNote();
      await invoke('update_note_sql', { id: noteId, title: titre.value, content: contenu.value });
    } else {
      // Sinon, créer une nouvelle note
      const newNote = { title: titre.value, content: contenu.value };
      const updatedNotes = await invoke('create_note_sqlite', newNote);
    }

    // Réinitialiser les champs après l'ajout ou la mise à jour de la note
    titre.value = '';
    contenu.value = '';
    toggleModal();
  } catch (error) {
    console.error("Erreur lors de la création ou de la mise à jour de la note:", error);
  }
}


async function supprimerNote(noteId) {
  const { invoke } = window.__TAURI__.tauri;

  try {
    console.log("Note à supprimer :", noteId);
    // Supprimer la note avec l'ID spécifié
    await invoke('delete_note_sql', { id: noteId });
    // Supprimer la note du DOM
    const noteElement = document.getElementById(noteId);
    if (noteElement) {
      noteElement.remove();
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error);
  }
}

// Fonction pour éditer une note
async function editNote(noteId) {

  // Récupérer la note sélectionnée  

  const note = document.getElementById(noteId);
  console.log("Note sélectionnée :", note);
  if (!note) {
    console.error("Note non trouvée :", noteId);
    return;
  }

  console.log("Note sélectionnée :", note);
  const title = note.querySelector('h1').innerText;
  const content = note.querySelector('p').innerText;

  // Remplir les champs titre et contenu avec les valeurs de la note sélectionnée
  titre.value = title;
  contenu.value = content;

  // Stocker l'ID de la note sélectionnée dans un attribut de l'élément 'id'
  id.value = noteId;

  // Afficher la fenêtre modale
  toggleModal();
}


// Fonction pour mettre à jour une note
async function updateNote(noteId, newTitle, newContent) {
  try {
    // Appeler la méthode Rust pour mettre à jour la note avec les nouvelles valeurs
    const success = await invoke('update_note_sql', { title: newTitle, content: newContent, id: noteId });
    
    if (success) {
      console.log('Note mise à jour avec succès');
      // Mettre à jour la note dans le DOM si nécessaire
      // Vous pouvez ajouter du code ici pour mettre à jour l'affichage de la note dans l'interface utilisateur
    } else {
      console.error('Erreur lors de la mise à jour de la note : La note n\'a pas été mise à jour');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note :', error);
  }
}




// Fonction pour afficher ou masquer la fenêtre modale
function toggleModal() {
    document.getElementById('modal').classList.toggle('hidden');
    clearToggle();
}

// Fonction pour nettoyer la modal
function clearToggle() {
    titleTag.value = '';
    descTag.value = '';
}

// Fonction pour intégrer les notes au front-end
async function initialiseNotes() {
  try {
    const { invoke } = window.__TAURI__.tauri;
    // Appeler la commande back-end pour récupérer les notes
    const notes = await invoke("get_notes_sql");
    
    // Traiter les notes récupérées
    notes.forEach((note) => {
      const noteElement = document.createElement('div');
      noteElement.id = `note-${note.id}`;
      noteElement.classList.add('note', 'flex', 'items-center', 'justify-center', 'justify-between', 'border', 'border-gray-300', 'bg-slate-900', 'rounded-lg', 'p-4', 'm-4');
      noteElement.innerHTML = `
        <div class="left-content flex flex-col justify-between py-2">
          <h1 class="text-4xl">${note.title}</h1>
          <p class="text-slate-400">${note.description}</p>
        </div>
        <div class="right-content flex flex-col justify-center items-center gap-2">
        <button class="hover:scale-125 duration-200" onclick="editNote('${note.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/>
            </svg>
          </button>
          <button class="hover:scale-125 duration-200" onclick="supprimerNote(${note.id})">                     
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      `;
      document.body.appendChild(noteElement);
    });
  } catch (error) {
    console.error("Erreur lors de l'invocation de fetch_notes:", error);
  }
}


// Encapsulation dans une fonction asynchrone auto-invoquée
(async function init() {
  await initialiseNotes();
})();


async function afficherPoeme() {
  const { invoke } = window.__TAURI__.tauri;

  try {
    // Appeler la commande Rust pour générer un poème aléatoire
    const poeme = await invoke('generate_random_poem', { prompt: 'Écris un poème aléatoire' });
    
    // Afficher le poème dans l'interface utilisateur
    document.getElementById('poeme-container').innerText = poeme;
    
    console.log("Poème généré avec succès :", poeme);
  } catch (error) {
    // Gérer les erreurs éventuelles
    console.error('Erreur lors de la récupération du poème :', error);
  }
}

// Appeler la fonction pour afficher le poème lors du chargement de la page
afficherPoeme();
