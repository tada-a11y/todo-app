import * as model from "./models.js";
import { renderTodos } from "./views.js";


function getFilterFromUrl() {
    if (location.hash === "#/active") {
        return "active";
    }

    if (location.hash === "#/completed") {
        return "completed";
    }

    return "all";
}

let filter = getFilterFromUrl();

export function updateView() {
    const todos = model.getTodos();

     for (const name of ["all", "active", "completed", "toggle-all"]) {
        if (todos.length === 0) {
            document.getElementById(name).style.display = "none";
        
        } else {
            document.getElementById(name).style.display = "";
        }
    }

    const completedTodos = todos.filter(function(todo) {
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
        todo => {
              model.deleteTodo(todo);
            updateView();
        },
        (todo, title) => {
               model.renameTodo(todo, title);
              updateView();  
        }
    );

const counter = document.getElementById("counter");

if (todos.length > 0) {
    

    counter.textContent =
        ` ${todos.filter(t => !t.completed).length} items left`;
} else {
    // Todoがなければ隠す
    counter.textContent = "";
}

    for (const name of ["all", "active", "completed"]) {
        document.getElementById(name).classList.toggle("selected", filter === name);
    }
}

export function setupController() {
    document.getElementById("form").onsubmit = event => {
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

    document.getElementById("clearcompleted").onsubmit = event => {
        event.preventDefault();
        model.clearCompletedTodos();
        updateView();
    };

    for (const name of ["all", "active", "completed"]) {
    document.getElementById(name).onsubmit = event => {
        event.preventDefault();

      if (name === "all") {
    location.hash = "#/";
} else {
    location.hash = "#/" + name;
}
    };
}


window.addEventListener("hashchange", function() {
    filter = getFilterFromUrl();
    updateView();
});
}
