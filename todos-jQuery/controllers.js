import * as model from "./models.js";
import { refreshView } from "./views.js";

export function setupEventHandlers() {
	model.setSelectedView(getFilterStatusFromUrl());
	$("#form").on("submit", function (event) {
		event.preventDefault();

		const input = $("#todo-input");
		const title = input.val().trim();
		if (!title) return;

		model.addTodo(title);
		input.val("");
		refreshView();
	});

	$("#toggle-all").on("click", function () {
		model.toggleAllTodos();
		refreshView();
	});

	$("#clearcompleted").on("submit", function (event) {
		event.preventDefault();
		model.clearCompletedTodos();
		refreshView();
	})


	//hashchangeイベントのリスナーを追加
	model.selectedViewStatus.forEach(function (status) {
		$("#" + status.name).on("submit", function (event) {
			event.preventDefault();

			if (status.name === "all") {
				location.hash = "#/";
			} else {
				location.hash = "#/" + status.name;
			}
		})
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
	$(window).on("hashchange", function () {
		model.setSelectedView(getFilterStatusFromUrl());
		refreshView();
	});
}
