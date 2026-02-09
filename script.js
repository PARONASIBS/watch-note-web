// ==========================
// SUPABASE CONFIG
// ==========================

const SUPABASE_URL = "https://zvwtjojfnohgteojpecz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2d3Rqb2pmbm9oZ3Rlb2pwZWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjI4NTYsImV4cCI6MjA4NjIzODg1Nn0.Lxo2KYp8-_dWTFqxy0ALF3VecHI1NphIeoNP_zU2MT0";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ==========================
// GLOBAL STATE
// ==========================

let notes = [];
let activeIndex = null;

// ==========================
// LOAD ON START
// ==========================

window.addEventListener("DOMContentLoaded", async () => {

  const darkToggle = document.getElementById("darkToggle");

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    darkToggle.checked = true;
  }

  darkToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark") ? "enabled" : "disabled"
    );
  });

  await loadNotes();
});

// ==========================
// LOAD NOTES
// ==========================

async function loadNotes() {

  const { data, error } = await supabaseClient
    .from("Notes")
    .select("*")
    .order("pinned", { ascending: false })
    .order("lastedited", { ascending: false });

  if (error) {
    console.error("Load error:", error);
    return;
  }

  notes = data || [];
  renderNotes();
}

// ==========================
// ADD NOTE
// ==========================

async function addNote() {

  const { data, error } = await supabaseClient
    .from("Notes")
    .insert([
      {
        title: "New Note",
        content: "",
        color: "#8ecae6",
        pinned: false,
        lastedited: Date.now()
      }
    ])
    .select();

  if (error) {
    console.error("Insert error:", error);
    return;
  }

  notes.unshift(data[0]);
  activeIndex = 0;
  renderNotes();
}

// ==========================
// RENDER NOTES
// ==========================

function renderNotes() {

  const list = document.getElementById("notesList");
  list.innerHTML = "";

  const sortedNotes = [...notes]
    .sort((a, b) => b.pinned - a.pinned)
    .sort((a, b) => b.lastedited - a.lastedited);

  sortedNotes.forEach((note) => {

    const index = notes.findIndex(n => n.id === note.id);

    const div = document.createElement("div");
    div.className = "note-item";
    div.style.background = note.color;

    div.innerHTML = `
      ${note.pinned ? "📌 " : ""}
      ${note.title || "Untitled"}
    `;

    div.onclick = () => selectNote(index);

    list.appendChild(div);
  });
}

// ==========================
// SELECT NOTE
// ==========================

function selectNote(index) {

  activeIndex = index;
  const note = notes[index];

  document.getElementById("title").value = note.title;
  document.getElementById("content").value = note.content;

  updatePinButton();
}

// ==========================
// AUTO SAVE TITLE
// ==========================

document.getElementById("title").addEventListener("input", async (e) => {

  if (activeIndex === null) return;

  const note = notes[activeIndex];
  note.title = e.target.value;
  note.lastedited = Date.now();

  await supabaseClient
    .from("Notes")
    .update({
      title: note.title,
      lastedited: note.lastedited
    })
    .eq("id", note.id);

  renderNotes();
});

// ==========================
// AUTO SAVE CONTENT
// ==========================

document.getElementById("content").addEventListener("input", async (e) => {

  if (activeIndex === null) return;

  const note = notes[activeIndex];
  note.content = e.target.value;
  note.lastedited = Date.now();

  await supabaseClient
    .from("Notes")
    .update({
      content: note.content,
      lastedited: note.lastedited
    })
    .eq("id", note.id);
});

// ==========================
// TOGGLE PIN
// ==========================

async function togglePin() {

  if (activeIndex === null) return;

  const note = notes[activeIndex];

  const { error } = await supabaseClient
    .from("Notes")
    .update({
      pinned: !note.pinned,
      lastedited: Date.now()
    })
    .eq("id", note.id);

  if (error) {
    console.error(error);
    return;
  }

  note.pinned = !note.pinned;
  renderNotes();
  updatePinButton();
}

function updatePinButton() {

  const pinBtn = document.getElementById("pinBtn");
  if (activeIndex === null) return;

  pinBtn.innerText = notes[activeIndex].pinned
    ? "📌 Unpin"
    : "📌 Pin";
}

// ==========================
// COLOR CHANGE
// ==========================

document.getElementById("colorPicker").addEventListener("input", async (e) => {

  if (activeIndex === null) return;

  const note = notes[activeIndex];
  note.color = e.target.value;
  note.lastedited = Date.now();

  await supabaseClient
    .from("Notes")
    .update({
      color: note.color,
      lastedited: note.lastedited
    })
    .eq("id", note.id);

  renderNotes();
});

// ==========================
// DELETE NOTE
// ==========================

function deleteNote() {
  if (activeIndex === null) return;
  document.getElementById("deleteModal").style.display = "flex";
}

document.getElementById("cancelDelete").onclick = () => {
  document.getElementById("deleteModal").style.display = "none";
};

document.getElementById("confirmDelete").onclick = async () => {

  if (activeIndex === null) return;

  const noteId = notes[activeIndex].id;

  await supabaseClient
    .from("Notes")
    .delete()
    .eq("id", noteId);

  notes.splice(activeIndex, 1);
  activeIndex = null;

  document.getElementById("deleteModal").style.display = "none";
  renderNotes();
};

// ==========================
// MENU TOGGLE
// ==========================

function toggleMenu() {
  document.getElementById("menuDropdown").classList.toggle("show");
}
