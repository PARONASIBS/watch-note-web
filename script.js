let notes = [];
let activeIndex = null;

function addNote() {
    notes.push({
        title: "New Note",
        content: "",
        color: "#8ecae6",
        pinned: false
    });
    activeIndex = notes.length - 1;
    renderNotes();
}

function renderNotes() {
    const list = document.getElementById("notesList");
    list.innerHTML = "";

    notes.forEach((note, index) => {
        const div = document.createElement("div");
        div.className = "note-item";
        div.style.background = note.color;
        div.innerText = note.title;
        div.onclick = () => selectNote(index);
        list.appendChild(div);
    });
}

function selectNote(index) {
    activeIndex = index;
    document.getElementById("title").value = notes[index].title;
    document.getElementById("content").value = notes[index].content;
}

function toggleMenu() {
    document.getElementById("menuDropdown").classList.toggle("show");
}
