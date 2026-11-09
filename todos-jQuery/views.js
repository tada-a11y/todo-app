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

	// ボタンの表示・非表示を切り替える
	$("#clearcompleted").toggle(completedTodos.length > 0);
	$("#all, #active, #completed, #toggle-all").toggle(todos.length > 0);

	// 残り件数を表示する
	const remaining = todos.length - completedTodos.length;
	$("#counter").text(todos.length > 0 ? `${remaining} items left` : "");
}

function renderTodos(visibleTodos) {
	const list = $("#output").empty();

	for (const todo of visibleTodos) {
		const check = $("<input>", { type: "checkbox" })
			.prop("checked", todo.completed)
			.on("change", function () {
				model.setTodoCompleted(todo, check.prop("checked"));
				refreshView();
			});

		const span = $("<span>").text(todo.title);

		const button = $("<button>", { type: "button" })
			.text("×")
			.on("click", function () {
				model.deleteTodo(todo);
				refreshView();
			});

		// 名前をダブルクリックしたら入力欄に変える
		span.on("dblclick", function () {
			const input = $("<input>", { type: "text" }).val(todo.title);

			function finish() {
				input.off("blur", finish);

				const title = input.val().trim();
				if (title) {
					model.renameTodo(todo, title);
				} else {
					model.deleteTodo(todo);
				}

				refreshView();
			}

			input.on("blur", finish);

			input.on("keydown", function (event) {
				if (event.originalEvent?.isComposing) return;

				if (event.key === "Escape") {
					event.preventDefault();
					input.off("blur", finish);
					refreshView();
				} else if (event.key === "Enter") {
					event.preventDefault();
					finish();
				}
			});

			span.replaceWith(input);
			input.trigger("focus");
		});

		// 3つの要素を1行にまとめて一覧に入れる
		const li = $("<li>").append(check, span, button);
		list.append(li);
	}
}