import * as model from "./models.js";


export function renderTodos() {
	const todos = model.todos;
	const list = document.getElementById("output");
	list.innerHTML = "";

	 const filter = model.selectedViewStatus.find(function (status) {
		return status.selected;
	}).name;

 const completedTodos = todos.filter(function (todo) {
		return todo.completed;
	});
	

	const visibleTodos = todos.filter(function(todo) {
    if (filter === "all") {
        return true;
    }

    if (filter === "completed") {
        return todo.completed;
    }

    return !todo.completed;
});

	for (const todo of visibleTodos) {
		const li = document.createElement("li");
		const check = document.createElement("input");
		const span = document.createElement("span");
		const button = document.createElement("button");

		check.type = "checkbox";
		check.checked = todo.completed;
		check.onchange = () => {
    model.setTodoCompleted(todo, check.checked);
    renderTodos();
};

		span.textContent = todo.title;

		button.type = "button";
		button.textContent = "×";
		button.onclick = () => {
    model.deleteTodo(todo);
    renderTodos();
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
				renderTodos()
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

		
	};
	
	
// ボタンを表示するかどうかの制御
	if (completedTodos.length === 0) {
		document.getElementById("clearcompleted").style.display = "none";
	} else {
		document.getElementById("clearcompleted").style.display = "";
	}


		const selectbuttons=["all","active","completed","toggle-all"];
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

	//リンクの名前変更
	
}
