export function renderTodos(todos, change, remove, rename) {
    const list = document.getElementById("output");
    list.innerHTML = "";

    for (const todo of todos) {
        const li = document.createElement("li");
        const check = document.createElement("input");
        const span = document.createElement("span");
        const button = document.createElement("button");

        check.type = "checkbox";
         check.checked = todo.completed;
          check.onchange = () => change(todo, check.checked);

        span.textContent = todo.title;

        button.type = "button";
        button.textContent = "×";
        button.onclick = () => remove(todo);

        span.ondblclick = () => {
            const input = document.createElement("input");
         input.type = "text";
        input.value = todo.title;
        span.replaceWith(input);
         input.focus();

            const finish = () => {
                // 置き換えによるblurで再び実行されるのを防ぐ
                input.onblur = null;

                const title = input.value;

                 if (title) {
                    span.textContent = title;
                    input.replaceWith(span);
                    rename(todo, title);
                } else {
                    remove(todo);
                }
            };

            input.onblur = () => finish();

            input.onkeydown = event => {
                if (event.isComposing) return;

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