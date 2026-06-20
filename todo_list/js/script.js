/* ============================================================
   Quill To-Do — vanilla JS with localStorage
   ============================================================ */

(function () {
    "use strict";

    const STORAGE_KEY = "quill.todos.v1";

    const els = {
        list: document.getElementById("taskList"),
        empty: document.getElementById("emptyState"),
        form: document.getElementById("composer"),
        input: document.getElementById("taskInput"),
        template: document.getElementById("taskTemplate"),
        filters: document.querySelectorAll(".filter[data-filter]"),
        clearDone: document.getElementById("clearDone"),
        statTotal: document.getElementById("statTotal"),
        statDone: document.getElementById("statDone"),
        todayDate: document.getElementById("todayDate"),
    };

    let state = {
        todos: load(),
        filter: "all",
    };

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    }

    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function addTodo(text) {
        const trimmed = text.trim();
        if (!trimmed) return;
        state.todos.unshift({
            id: uid(),
            text: trimmed,
            done: false,
            createdAt: new Date().toISOString(),
        });
        save();
        render();
    }

    function toggleTodo(id) {
        const t = state.todos.find((x) => x.id === id);
        if (!t) return;
        t.done = !t.done;
        save();
        render();
    }

    function deleteTodo(id) {
        state.todos = state.todos.filter((x) => x.id !== id);
        save();
        render();
    }

    function updateTodo(id, text) {
        const t = state.todos.find((x) => x.id === id);
        if (!t) return;
        const trimmed = text.trim();
        if (!trimmed) {
            deleteTodo(id);
            return;
        }
        t.text = trimmed;
        save();
        render();
    }

    function clearCompleted() {
        state.todos = state.todos.filter((x) => !x.done);
        save();
        render();
    }

    function setFilter(f) {
        state.filter = f;
        els.filters.forEach((b) => {
            b.classList.toggle("is-active", b.dataset.filter === f);
        });
        render();
    }

    function filtered() {
        if (state.filter === "active") return state.todos.filter((t) => !t.done);
        if (state.filter === "done") return state.todos.filter((t) => t.done);
        return state.todos;
    }

    function render() {
        const items = filtered();
        els.list.innerHTML = "";

        items.forEach((t) => {
            const node = els.template.content.firstElementChild.cloneNode(true);
            node.dataset.id = t.id;
            if (t.done) node.classList.add("is-done");

            const textEl = node.querySelector(".task__text");
            const editEl = node.querySelector(".task__edit");
            textEl.textContent = t.text;

            node.querySelector(".task__check").addEventListener("click", () => toggleTodo(t.id));
            node.querySelector(".task__delete").addEventListener("click", () => deleteTodo(t.id));

            // Edit on dblclick
            textEl.addEventListener("dblclick", () => beginEdit(node, t));
            textEl.addEventListener("keydown", (e) => {
                if (e.key === "Enter") beginEdit(node, t);
            });

            function beginEdit(rowNode, todo) {
                editEl.value = todo.text;
                editEl.hidden = false;
                textEl.hidden = true;
                editEl.focus();
                editEl.select();
            }

            function commit() {
                editEl.hidden = true;
                textEl.hidden = false;
                updateTodo(t.id, editEl.value);
            }

            editEl.addEventListener("blur", commit);
            editEl.addEventListener("keydown", (e) => {
                if (e.key === "Enter") editEl.blur();
                if (e.key === "Escape") {
                    editEl.value = t.text;
                    editEl.blur();
                }
            });

            els.list.appendChild(node);
        });

        // Empty state
        els.empty.hidden = items.length > 0;

        // Stats
        els.statTotal.textContent = state.todos.length;
        els.statDone.textContent = state.todos.filter((t) => t.done).length;
    }

    function renderDate() {
        const d = new Date();
        els.todayDate.textContent = d.toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
        });
    }

    // Listeners
    els.form.addEventListener("submit", (e) => {
        e.preventDefault();
        addTodo(els.input.value);
        els.input.value = "";
        els.input.focus();
    });

    els.filters.forEach((b) =>
        b.addEventListener("click", () => setFilter(b.dataset.filter))
    );

    els.clearDone.addEventListener("click", clearCompleted);

    // Init
    renderDate();
    render();
})();
