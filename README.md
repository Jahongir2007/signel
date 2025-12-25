# Signel.js v1.2.0

**Signel.js** is a tiny reactive JavaScript micro‑library for building interactive UI without frameworks.
It focuses on **reactive state**, **DOM bindings**, and **simple helpers**.

Author: Jahongir Sobirov
License: MIT

---

## Table of Contents

1. Getting Started
2. Core Concept: Reactive State
3. `el()` – Reactive Template Binding
4. Events Helpers

   * `click()` / `button()`
   * `hover()`
5. Form Bindings

   * `input()`
   * `checkbox()`
   * `model()`
6. Watching State Changes

   * `watch()`
7. UI Helpers

   * `toggle()`
   * `tabs()`
   * `tooltip()`
8. Reactive Lists

   * `list()`
   * `renderList()`
9. Styling & Classes
10. Design Philosophy & Notes
11. Online demos

---

## 1. Getting Started

Include Signel.js in your page:

```html
<script src="https://signel.onrender.com/signel.js"></script>
```

Signel works directly with the DOM. No build tools required.

---

## 2. Core Concept: Reactive State

Signel uses JavaScript `Proxy` to make state reactive.

Whenever you update a state property, **DOM automatically re‑renders**.

```js
const state = el("#app", {
  name: "Jahongir",
  count: 0
});
```

---

## 3. `el(selector, state)` – Reactive Template Binding

Binds a state object to one or more elements.

### HTML

```html
<div id="app">
  Hello $$name 👋
  <p>Count: $$count</p>
</div>
```

### JS

```js
const state = el("#app", {
  name: "Jahongir",
  count: 1,
  classes: "card active",
  style: "color: blue;"
});
```

### Supported features

* `$$key` → text interpolation
* `state.style` → inline styles
* `state.classes` → className string

---

## 4. Event Helpers

### `click(selector, fn)` / `button(selector, fn)`

Attach click listeners.

```js
click("#inc", () => {
  state.count++;
});
```

> `button()` is an alias of `click()`

---

### `hover(selector, fn)`

```js
hover(".card", el => {
  el.style.background = "#eee";
});
```

---

## 5. Form Bindings

### `input(selector, state, key)`

One‑way input binding.

```html
<input id="nameInput" />
```

```js
input("#nameInput", state, "name");
```

---

### `checkbox(selector, state, key)`

```html
<input type="checkbox" id="agree" />
```

```js
checkbox("#agree", state, "accepted");
```

---

### `model(selector, state, key)` (Two‑way binding)

Works like `v-model`.

```html
<input id="username" />
```

```js
model("#username", state, "name");
```

Supports:

* text inputs
* checkboxes
* select

---

## 6. Watching State Changes

### `watch(state, key, fn)`

Run logic when a value changes.

```js
watch(state, "count", value => {
  console.log("Count changed:", value);
});
```

---

## 7. UI Helpers

### `toggle({ btn, content })`

```js
toggle({
  btn: ".toggle-btn",
  content: ".toggle-content"
});
```

Click button → show/hide content.

---

### `tabs({ btn, panel })`

```js
tabs({
  btn: [".tab-btn"],
  panel: [".tab-panel"]
});
```

Tabs are matched by index.

---

### `tooltip(selector)`

### HTML

```html
<button data-tooltip="tip1">Hover</button>
<div id="tip1" class="tooltip">Hello</div>
```

### JS

```js
tooltip("[data-tooltip]");
```

Tooltip follows mouse.

---

## 8. Reactive Lists

### `list(initialArray)`

Creates a reactive array.

```js
const todos = list(["Learn JS", "Build Startup"]);
```

---

### `renderList(selector, reactiveList, renderItem)`

```html
<ul id="todos"></ul>
```

```js
renderList("#todos", todos, item => `<li>${item}</li>`);
```

Update array → UI updates automatically.

```js
todos.push("Ship Signel.js");
```

---

## 9. Styling & Classes

### Classes

```js
state.classes = "card active";
```

> Overwrites element className

### Styles

```js
state.style = "color:red; font-weight:bold;";
```

---

## 10. Design Philosophy & Notes

* No virtual DOM
* No JSX
* No build step
* State‑driven UI
* Inspired by Vue / Svelte / Solid

### Recommendations

* Keep `id` static in HTML
* Use state for UI, not DOM queries
* Avoid heavy re‑render in big templates

---

## Example

```html
<div id="app">Hello $$name</div>
<input id="name" />
<button id="btn">Change</button>
```

```js
const state = el("#app", { name: "World" });
model("#name", state, "name");
click("#btn", () => state.name = "Signel.js");
```

---

## 11. Online demos
[Online mini timer](https://jsfiddle.net/jahongirsobirov/fno2qabe/6/)
[Number list](https://jsfiddle.net/jahongirsobirov/q92j5a6v/7/)
[Tabs](https://jsfiddle.net/jahongirsobirov/o940rkvy/6/)
---

## Final Words

Signel.js is perfect for:

* small projects
* admin panels
* landing pages
* learning reactivity internals

You are encouraged to extend it 🚀
