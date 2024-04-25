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
function creerNote() {
  noteCount++; // Incrémenter le compteur de notes
  const noteId = id.value;
  if (noteId) {
    updateNote(noteId);
  }else {
  // Créer une div pour la note avec un ID unique basé sur le compteur de notes
  const note = document.createElement('div');
  note.id = `note-${noteCount}`;
  note.classList.add('note', 'flex', 'items-center', 'justify-center', 'justify-between', 'border', 'border-gray-300', 'bg-slate-900', 'rounded-lg', 'p-4', 'm-4');
  note.innerHTML = `
      <div class="left-content flex flex-col justify-between py-2">
          <h1 class="text-4xl">${titre.value}</h1>
          <p class="text-slate-400">${contenu.value}</p>
      </div>
      <div class="right-content flex flex-col justify-center items-center gap-2">
          <button class="hover:scale-125 duration-200" onclick="editNote('${note.id}', '${titre.value}', '${contenu.value}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/>
              </svg>
          </button>
          <button class="hover:scale-125 duration-200" onclick="supprimerNote('${note.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
          </button>
      </div>
  `;
  document.body.appendChild(note);
} 
}


// Fonction pour supprimer une note
function supprimerNote(noteId) {
  const note = document.getElementById(noteId);
  note.parentNode.removeChild(note);
}

// Fonction pour éditer une note
function editNote(noteId) {
  toggleModal();
  const note = document.getElementById(noteId);
  const title = note.querySelector('h1').innerText;
  const content = note.querySelector('p').innerText;

  // Mise à jour des champs titre et contenu avec les valeurs de la note sélectionnée
  titre.value = title;
  contenu.value = content;

  // Stocker l'ID de la note sélectionnée dans un attribut de l'élément 'id'
  id.value = noteId;
}

function updateNote() {
  const noteId = id.value;
  const note = document.getElementById(noteId);
  note.querySelector('h1').innerText = titre.value;
  note.querySelector('p').innerText = contenu.value;
  toggleModal(); 
}




function toggleModal() {
    document.getElementById('modal').classList.toggle('hidden');
    clearToggle();
}

function clearToggle() {
    titleTag.value = '';
    descTag.value = '';
}