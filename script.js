let notes = JSON.parse(localStorage.getItem("notes")) || [];
let activeNoteIndex = null;

const notesList = document.getElementById("notesList");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function addNote() {
  notes.push({
    title: "New Note",
    content: "",
    lastEdited: Date.now()
  });

  activeNoteIndex = notes.length - 1;
  saveNotes();
  renderNotes();
  loadActiveNote();
}

function renderNotes() {
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note-item";
    div.textContent = note.title;

    div.onclick = () => {
      activeNoteIndex = index;
      loadActiveNote();
    };

    notesList.appendChild(div);
  });
}

function loadActiveNote() {
  if (activeNoteIndex === null) return;

  titleInput.value = notes[activeNoteIndex].title;
  contentInput.value = notes[activeNoteIndex].content;
}

titleInput.addEventListener("input", () => {
  if (activeNoteIndex === null) return;
  notes[activeNoteIndex].title = titleInput.value;
  saveNotes();
  renderNotes();
});

contentInput.addEventListener("input", () => {
  if (activeNoteIndex === null) return;
  notes[activeNoteIndex].content = contentInput.value;
  saveNotes();
});

renderNotes();
