"use strict";

let listEls = document.querySelector("#list");
let todoEl = document.querySelector("#todo");
let btn = document.querySelector("#btn");
let listJson = localStorage.getItem("todolist");

let list = listJson ? JSON.parse(listJson) : [];

for (const todo of list) {
  createLiEl(listEls, todo);
}

btn.addEventListener("click", addTodo);

todoEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

function addTodo() {
  let value = todoEl.value.trim();
  if (!value) return;

  let todoId = list.length > 0 ? list[list.length - 1].id + 1 : 0;
  let todo = { id: todoId, title: value, done: false };

  list.push(todo);
  localStorage.setItem("todolist", JSON.stringify(list));

  createLiEl(listEls, todo);

  todoEl.value = "";
  todoEl.focus();
}

function createLiEl(parent, todo) {
  let li = document.createElement("li");

  let title = document.createElement("span");
  title.textContent = todo.title;
  title.classList.add("title");
  if (todo.done) title.classList.add("line-through");

  let btnRemove = document.createElement("button");
  btnRemove.textContent = "Удалить";
  btnRemove.className = "small-btn remove";

  let btnDone = document.createElement("button");
  btnDone.textContent = "Готово";
  btnDone.className = "small-btn done";

  if (todo.done) {
    li.classList.add("opacity");
  }

  btnRemove.addEventListener("click", () => {
    list = list.filter((item) => item.id !== todo.id);
    localStorage.setItem("todolist", JSON.stringify(list));
    li.remove();
  });

  btnDone.addEventListener("click", () => {
    todo.done = !todo.done;
    localStorage.setItem("todolist", JSON.stringify(list));
    li.classList.toggle("opacity");
    title.classList.toggle("line-through");
  });

  title.addEventListener("click", () => {
    editTodo(title, todo);
  });

  li.append(title, btnRemove, btnDone);
  parent.appendChild(li);
}

function editTodo(element, todo) {
  let input = document.createElement("input");
  input.type = "text";
  input.value = element.textContent;
  element.textContent = "";
  element.appendChild(input);
  input.focus();

  input.addEventListener("blur", () => {
    let val = input.value.trim();
    element.textContent = val || todo.title;

    if (val) {
      todo.title = val;
      localStorage.setItem("todolist", JSON.stringify(list));
    }
  });
}
