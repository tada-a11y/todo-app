import * as model from "./models.js";

export function refreshView() {
	const todos = model.todos;
	const selectedViewName = model.selectedViewStatus.find(function (status) {
		return status.selected;
	}).name;

	const completedTodos = todos.filter(function (todo) {
		return todo.completed;
	});

	const visibleTodos = todos.filter(function (todo) {
		if (selectedViewName === "all") {
			return true;
		}

		if (selectedViewName === "completed") {
			return todo.completed;
		}

		return !todo.completed;
	});

	renderTodos(visibleTodos);
	// ボタンを表示するかどうかの制御
	if (completedTodos.length === 0) {
		document.getElementById("clearcompleted").style.display = "none";
	} else {
		document.getElementById("clearcompleted").style.display = "";
	}

	const selectbuttons = ["all", "active", "completed", "toggle-all"];
	for (const name of selectbuttons) {
		if (todos.length === 0) {
			document.getElementById(name).style.display = "none";
		} else {
			document.getElementById(name).style.display = "";
		}
	}

	const counter = document.getElementById("counter");

	if (todos.length > 0) {
		counter.textContent = ` ${todos.filter((t) => !t.completed).length} items left`;
	} else {
		counter.textContent = "";
	}
}

function renderTodos(visibleTodos) {
	const list = document.getElementById("output");
	list.innerHTML = "";
	for (const todo of visibleTodos) {
		const li = document.createElement("li");
		const check = document.createElement("input");
		const span = document.createElement("span");
		const button = document.createElement("button");

		check.type = "checkbox";
		check.checked = todo.completed;
		check.onchange = () => {
			model.setTodoCompleted(todo, check.checked);
			refreshView();
		};

		span.textContent = todo.title;

		button.type = "button";
		button.textContent = "×";
		button.onclick = () => {
			model.deleteTodo(todo);
			refreshView();
		};

		span.ondblclick = () => {
			const input = document.createElement("input");
			input.type = "text";
			input.value = todo.title;
			span.replaceWith(input);
			input.focus();

			const finish = () => {
				// 置き換えによるblurで再び実行されるのを防ぐ
				input.onblur = null;

				const title = input.value.trim();

				if (title) {
					span.textContent = title;
					input.replaceWith(span);
					model.renameTodo(todo, title);
				} else {
					model.deleteTodo(todo);
				}
				refreshView();
			};

			input.onblur = () => finish();

			input.onkeydown = (event) => {
				if (event.isComposing) return;

				if (event.key === "Escape") {
					event.preventDefault();

					input.onblur = null;

					input.replaceWith(span);
					return;
				}

				if (event.key === "Enter") {
					event.preventDefault();
					finish();
				}
			};
		};

		li.append(check, span, button);
		list.append(li);
	}
}
