"use strict";

const notebookNav = document.querySelector(".notebook__nav");
const noteField = document.querySelector(".note");
const btnAdd = document.querySelector(".btn-add");
const btnSave = document.querySelector(".btn-save");
const btnDelete = document.querySelector(".btn-delete");
const btnCancel = document.querySelector(".btn-cancel");

let noteList = JSON.parse(localStorage.getItem("notebook")) || [];

noteList.forEach(createNoteLink);

btnAdd.addEventListener("click", () => {
  const textNote = noteField.value.trim();
  if (!textNote) return;

  const idNote = noteList.length ? noteList[noteList.length - 1].id + 1 : 0;
  const note = { id: idNote, text: textNote };

  noteList.push(note);
  localStorage.setItem("notebook", JSON.stringify(noteList));
  createNoteLink(note);

  noteField.value = "";
  noteField.focus();
});

btnSave.addEventListener("click", function () {
  const editedId = +this.dataset.idnote;
  const note = noteList.find((n) => n.id === editedId);
  if (!note) return;

  const newText = noteField.value.trim();
  if (newText.length < 3 || newText === note.text) return;

  note.text = newText;
  localStorage.setItem("notebook", JSON.stringify(noteList));

  const link = document.querySelector(`[data-idnote="${editedId}"]`);
  link.textContent =
    note.text.length > 20 ? note.text.slice(0, 20) + "..." : note.text;

  resetUI();
});

btnDelete.addEventListener("click", function () {
  const deletedId = +this.dataset.idnote;
  noteList = noteList.filter((n) => n.id !== deletedId);
  localStorage.setItem("notebook", JSON.stringify(noteList));

  const item = document
    .querySelector(`[data-idnote="${deletedId}"]`)
    ?.closest(".notebook__nav_item");
  if (item) item.remove();

  resetUI();
});

function createNoteLink(note) {
  const wrap = document.createElement("div");
  wrap.classList.add("notebook__nav_item");

  const spanId = document.createElement("span");
  spanId.textContent = note.id + ". ";

  const link = document.createElement("a");
  link.href = "#";
  link.dataset.idnote = note.id;
  link.textContent =
    note.text.length > 20 ? note.text.slice(0, 20) + "..." : note.text;

  link.addEventListener("click", (e) => {
    e.preventDefault();
    noteField.value = note.text;
    noteField.focus();

    btnAdd.classList.add("hide");
    btnSave.classList.remove("hide");
    btnDelete.classList.remove("hide");
    btnCancel.classList.remove("hide");
    btnSave.dataset.idnote = note.id;
    btnDelete.dataset.idnote = note.id;
  });

  wrap.append(spanId, link);
  notebookNav.appendChild(wrap);
}

btnCancel.addEventListener("click", resetUI);

function resetUI() {
  noteField.value = "";
  noteField.focus();
  btnAdd.classList.remove("hide");
  btnSave.classList.add("hide");
  btnDelete.classList.add("hide");
  btnCancel.classList.add("hide");
}
