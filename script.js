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
// Dark Mode Toggle
const darkToggle = document.getElementById("darkToggle");

darkToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");

    // Save preference
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
});

// Load saved mode
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
        darkToggle.checked = true;
    }
});

