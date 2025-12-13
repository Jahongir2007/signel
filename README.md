# 🚀 Signel.js v1.0.0 — Beginner-Friendly Guide

Signel.js is a tiny reactive JS library for building dynamic UIs easily.
It allows **reactive state**, **reactive lists**, **tabs**, **toggles**, and **buttons**.

---

## Installation 💻

### Via npm
```bash
npm install signel
```

### Via CDN
```html
<script src="https://signel.onrender.com/signel.js"></script>
```

No dependencies, works in modern browsers.

### Usage 🚀

#### 1. Reactive Input
```html
<input id="nameInput" placeholder="Type your name"/>
<p id="greeting"></p>

<script>
input("#nameInput", proxy => {
  proxy.show("#greeting", "Hello, $$value!");
});
</script>
```

#### 2. Reactive list
```html
<ul id="todoList"></ul>

<script>
El("#todoList", proxy => {
  proxy.list("todos", ["Learn JS", "Build ResignJS"], item => `<li class="p-2 bg-gray-800 mb-2 rounded">${item}</li>`);
  proxy.todos.push("New Task"); // Automatically updates the list
});
</script>
```

#### 3. Reactive tabs
```html
<div id="tab1">Tab 1 content</div>
<div id="tab2" style="display:none">Tab 2 content</div>

<script>
El("#tabs", proxy => {
  proxy.tab("tab1", "#tab1");
  proxy.tab("tab2", "#tab2");

  // Activate tab1
  proxy.tab1.active = true;
});
</script>
```

#### 4. Template Engine
```html
<div id="userCard">
  <div class="p-4 bg-gray-800 rounded text-gray-100">
    <h2 class="text-purple-500 font-bold">$$name</h2>
    <p>Age: $$age</p>
  </div>
</div>

<script>
  El("#userCard", proxy => {
    proxy.name = "Jahongir";
    proxy.age = 18;
        
    // Updating reactive data automatically updates template
    setTimeout(() => proxy.age = 19, 2000);
  });
</script>
```

### API Overview 📝

| Function                                         | Description                                                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `el(selector, state)`                            | Creates a reactive object bound to DOM elements. Supports template syntax `$$key`.                   |
| `button(selector, fn)`                           | Adds click event listener(s) to buttons.                                                             |
| `input(selector, state, key)`                    | Two-way binding for text inputs / textareas.                                                         |
| `model(selector, state, key)`                    | Two-way binding for `<input>`, `<select>`, `<textarea>`, `<checkbox>`.                               |
| `checkbox(selector, state, key)`                 | Bind checkboxes to state.                                                                            |
| `toggle({btn, content})`                         | Show/hide elements when buttons are clicked.                                                         |
| `tabs({btn, panel})`                             | Simple tabs system.                                                                                  |
| `list(initial)`                                  | Creates reactive array. Supports `.push()`, `.pop()`, `.splice()` with automatic subscriber updates. |
| `renderList(selector, reactiveList, renderItem)` | Renders reactive array to DOM.                                                                       |
| `reactiveArray(arr, notify)`                     | Low-level helper (internal).                                                                         |


### Why Signel? 💡

 - **Minimal**: Small footprint, no virtual DOM.
 - **Reactive**: Automatically updates DOM when your data changes.
 - **Flexible**: Works in any project, integrates with existing HTML easily.
