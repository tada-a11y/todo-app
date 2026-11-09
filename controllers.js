import * as model from "./models.js";
import { refreshView } from "./views.js";

export function setupEventHandlers() {
	model.setSelectedView(getFilterStatusFromUrl());
	document.getElementById("form").onsubmit = (event) => {
		event.preventDefault();
		const input = document.getElementById("todo-input");
		const trimedValue = input.value.trim();
		if (!trimedValue) return;

		model.addTodo(trimedValue);
		input.value = "";
		refreshView();
	};

	document.getElementById("toggle-all").onclick = () => {
		model.toggleAllTodos();
		refreshView();
	};

	document.getElementById("clearcompleted").onsubmit = (event) => {
		event.preventDefault();
		model.clearCompletedTodos();
		refreshView();
	};

	//hashchangeイベントのリスナーを追加
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

	function getFilterStatusFromUrl() {
		if (location.hash === "#/active") {
			return "active";
		}

		if (location.hash === "#/completed") {
			return "completed";
		}

		return "all";
	}
	window.addEventListener("hashchange", function () {
		model.setSelectedView(getFilterStatusFromUrl());
		refreshView();
	});
}
