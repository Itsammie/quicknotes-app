const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const noteCategory = document.getElementById('note-category');
const errorMessage = document.getElementById('error-message');
const notesList = document.getElementById('notes-list');
const noteCount = document.getElementById('note-count');
const searchInput = document.getElementById('search-input');
const clearAllBtn = document.getElementById('clear-all-btn');

let notes = JSON.parse(localStorage.getItem('quicknotes')) || [];

function saveNotes() {
  localStorage.setItem('quicknotes', JSON.stringify(notes));
}

function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  render(searchInput.value);
}

function render(filterText = '') {
  // Clear current list safely without using innerHTML
  while (notesList.firstChild) {
    notesList.removeChild(notesList.firstChild);
  }
  
  const filteredNotes = notes.filter(note => 
    note.text.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filteredNotes.length === 0 && filterText !== '') {
    const li = document.createElement('li');
    li.textContent = "No notes match your search.";
    notesList.appendChild(li);
  } else {
    filteredNotes.forEach(note => {
      const li = document.createElement('li');
      li.className = `note-card category-${note.category.toLowerCase()}`;
      
      const textP = document.createElement('p');
      textP.textContent = note.text;
      
      const metaP = document.createElement('small');
      metaP.textContent = `${note.category} • ${note.createdAt}`;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = () => deleteNote(note.id);
      
      li.appendChild(textP);
      li.appendChild(metaP);
      li.appendChild(deleteBtn);
      
      notesList.appendChild(li);
    });
  }
  
  updateCount();
}

noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = noteInput.value.trim();
  
  if (text === '') {
    errorMessage.textContent = "Please type a note first.";
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }
  
  errorMessage.textContent = ''; // Clear error on success
  
  const newNote = {
    id: Date.now(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };
  
  notes.push(newNote);
  saveNotes();
  noteInput.value = '';
  render(searchInput.value);
});

searchInput.addEventListener('input', (e) => {
  render(e.target.value);
});

// Bonus: Clear all functionality
if (clearAllBtn) {
  clearAllBtn.addEventListener('click', () => {
    if (notes.length > 0 && confirm("Delete all notes?")) {
      notes = [];
      saveNotes();
      render();
    }
  });
}

render();