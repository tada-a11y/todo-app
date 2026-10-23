let todos = [];

export const getTodos = () => todos

export function addTodo(title) {
    todos.push({ title:title, completed: false });
}

export function setTodoCompleted(todo, trueorfalse) {
    todo.completed = trueorfalse;
}

export function renameTodo(todo, retitle) {
    todo.title = retitle;
}

export function deleteTodo(todo) {
    todos = todos.filter(t => t !== todo);
}

export function clearCompletedTodos() {
    todos = todos.filter(t => !t.completed);
}

export function toggleAllTodos() {
    const completed = !todos.every(t => t.completed);
    todos.forEach(t => t.completed = completed);
}

