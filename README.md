# 🚀 Signel.js v1.1.0 — Beginner-Friendly Guide

### 🆕 What’s New in v1.1
#### ✅ Watchers (`watch`)
> NEW in v1.1: `watch()` — react to state changes without touching the DOM directly.

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

#### 1. Reactive Text and Input
```html
<p>Hello $$name</p>
<input id="name">
```
```js
let state = el("p", { name: "John" });
input("#name", state, "name");

// Programmatic change
setTimeout(() => state.name = "John Doe", 2000);
```

#### 2. Button Click
```html
<button id="btn">Click me</button>
<p>Count: $$count</p>
```
```js
let state = el("p", { count: 0 });
button("#btn", () => state.count++);
```

#### 3. Checkbox
```html
<input type="checkbox" id="agree">
<p>Agreed: $$agree</p>
```
```js
let state = el("p", { agree: false });
checkbox("#agree", state, "agree");
```

#### 4. Select Dropdown with `model()`
```html
<select id="country">
  <option value="uz">Uzbekistan</option>
  <option value="us">USA</option>
</select>
<p>Country: $$country</p>
```
```js
let state = el("p", { country: "uz" });
model("#country", state, "country");
```

#### 5. Toggle Elements
```html
<button class="toggle-btn">Show/Hide</button>
<div class="box">Hello!</div>
```
```js
toggle({
  btn: ".toggle-btn",
  content: ".box"
});
```

#### 6.Tabs
```html
<button class="tab-btn1">Tab 1</button>
<button class="tab-btn2">Tab 2</button>

<div class="tab-panel1">Content 1</div>
<div class="tab-panel2">Content 2</div>
```
```js
tabs({
  btn: [".tab-btn1", ".tab-btn2"],
  panel: [".tab-panel1", ".tab-panel2"]
});
```

#### 7.Reactive Arrays (Todos)
```html
<ul class="list"></ul>
<input class="newwork">
<button class="addwork">Add</button>
```
```js
let todos = list(["Task 1", "Task 2"]);

renderList(".list", todos, item => `<li>${item}</li>`);

button(".addwork", () => {
  const inputEl = document.querySelector(".newwork");
  todos.push(inputEl.value);
  inputEl.value = "";
});
```

#### 8. Watchers (NEW 🔥)
Why `watch()`?

Sometimes you don’t want to update the DOM directly.
You just want to **react** to state changes.

Examples:
 - Live validation
 - Derived values
 - Side effects
 - Debugging

```js
let state = el(".box", { count: 0 });

watch(state, "count", value => {
  console.log("Count changed to:", value);
});

state.count++; // logs → Count changed to: 1
```

##### Multiple Watchers on Same Key
```js
watch(state, "username", v => console.log("Username:", v));
watch(state, "username", v => console.log("Length:", v.length));
```
All watchers run in order.

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
| `watch(state, key, fn)`                          | 🔥 Run logic when a state key changes                                                                         |


### Notes / Best Practices 💡

 - Use `el()` for reactive objects.
 - Use `list()` for reactive arrays.
 - `model()` handles two-way binding for <input>, <textarea>, <select>, <checkbox>.
 - `renderList()` is the only function that renders arrays to DOM.
 - You can combine `list()` + `el()` for complex reactive state.
 - Avoid overwriting arrays (`state.todos = [...]`), instead use array methods (`push`, `pop`, `splice`) to maintain reactivity.

### License
MIT — free to use and modify.
