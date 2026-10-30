import * as model from "./models.js";
import { renderTodos } from "./views.js";

function getFilterStatusFromUrl() {
	if (location.hash === "#/active") {
		return "active";
	}

	if (location.hash === "#/completed") {
		return "completed";
	}

	return "all";
}

model.setSelectedView(getFilterStatusFromUrl());

export function updateView() {
	const todos = model.getTodos();

	const filter = model.selectedViewStatus.find(function (status) {
		return status.selected;
	}).name;

	for (const name of ["all", "active", "completed", "toggle-all"]) {
		if (todos.length === 0) {
			document.getElementById(name).style.display = "none";
		} else {
			document.getElementById(name).style.display = "";
		}
	}

	const completedTodos = todos.filter(function (todo) {
		return todo.completed;
	});

	if (completedTodos.length === 0) {
		document.getElementById("clearcompleted").style.display = "none";
	} else {
		document.getElementById("clearcompleted").style.display = "";
	}

	const visible = todos.filter(function (t) {
		if (filter === "all") {
			return true;
		}

		if (filter === "completed") {
			return t.completed;
		}

		return !t.completed;
	});
	renderTodos(
		visible,
		(todo, checked) => {
			model.setTodoCompleted(todo, checked);
			updateView();
		},
		(todo) => {
			model.deleteTodo(todo);
			updateView();
		},
		(todo, title) => {
			model.renameTodo(todo, title);
			updateView();
		},
	);

	const counter = document.getElementById("counter");

	if (todos.length > 0) {
		counter.textContent = ` ${todos.filter((t) => !t.completed).length} items left`;
	} else {
		// Todoがなければ隠す
		counter.textContent = "";
	}

	model.selectedViewStatus.forEach(function (status) {
		document
			.getElementById(status.name)
			.classList.toggle("selected", status.selected);
	});
}

export function setupController() {
	document.getElementById("form").onsubmit = (event) => {
		event.preventDefault();
		const input = document.getElementById("todo-input");
		if (!input.value.trim()) return;

		model.addTodo(input.value.trim());
		input.value = "";
		updateView();
	};

	document.getElementById("toggle-all").onclick = () => {
		model.toggleAllTodos();
		updateView();
	};

	document.getElementById("clearcompleted").onsubmit = (event) => {
		event.preventDefault();
		model.clearCompletedTodos();
		updateView();
	};

	model.selectedViewStatus.forEach(function (status) {
		document.getElementById(status.name).onsubmit = (event) => {
			event.preventDefault();

			if (status.name === "all") {
				location.hash = "#/";
			} else {
				location.hash = "#/" + status.name;
			}
		};
	});

	window.addEventListener("hashchange", function () {
		model.setSelectedView(getFilterStatusFromUrl());
		updateView();
	});
}
