# Signel.js v3.0.0 Documentation
## Overview

Signel.js is a lightweight reactive UI library inspired by Vue & Alpine.
It lets you bind state → DOM using simple HTML attributes — no build tools, no virtual DOM.

## Installation
With CDN:
```html
<script src="https://signel.onrender.com/signel.js"></script>
```
With NPM:
```bash
npm install signel
```

## ✨ Features
 - ⚡ Reactive state using Proxy
 - 🔁 Automatic DOM updates
 - 🧠 Expression evaluation with `$if`
 - 🔄 List rendering with `$loop`
 - 🔗 Two-way binding with `$model`
 - 🖱 Event handling with `$click`
 - 📦 Zero dependencies

## 🚀 Basic Usage

### 1️⃣ Create Reactive State
```js
const state = reactive({
  count: 0,
  inc() {
    this.count++
  }
})
```

### 2️⃣ Compile the DOM
```js
compile('#app', state)
```

### 3️⃣ HTML Template
```html
<div id="app">
  <p $text="count"></p>
  <button $click="inc">+</button>
</div>
```

## 🧠 Core Concepts

### 🔹 `reactive(state)`

Creates **a reactive proxy** of your state object.
```js
const state = reactive({
  message: 'Hello'
})
```

Every state change automatically updates the DOM.

### 🔹 `$text` — Text Binding

Binds text content to state.
```html
<p $text="message"></p>
```
```js
state.message = 'Hi!' // updates DOM automatically
```
### 🔹 `$click` — Event Binding

Attach click handlers to state methods.
```html
<button $click="submit">Send</button>
```
```js
const state = reactive({
  submit() {
    alert('Clicked!')
  }
})
```

### 🔹 `$model` — Two-Way Binding

Sync input value with state.
```html
<input $model="username">
<p $text="username"></p>
```
```js
const state = reactive({
  username: ''
})
```

✔ DOM → State
✔ State → DOM

### 🔹 `$if` — Conditional Rendering

Show or hide elements using expressions.
```html
<p $if="count > 5">Count is big</p>
```
```js
state.count = 10 // element becomes visible
```

Expressions can use **any state property.**

### 🔹 `$loop` — List Rendering

Render arrays easily.
```html
<ul $loop="item in items">
  <li>$$item</li>
</ul>
```
```js
const state = reactive({
  items: ['Apple', 'Banana']
})
```
### Output:
```html
<li>Apple</li>
<li>Banana</li>
```

> `$$item` is replaced with the current item value.

### 🔄 Reactivity Behavior

Any `state[key] = value`:
 - Updates `$text`
 - Updates `$model`
 - Re-evaluates `$if`
 - Re-renders `$loop`

### ⚠ Important Notes
 - `$loop` supports primitive values (strings, numbers)
 - `$if` uses `new Function()` → **do not inject untrusted input**
 - No virtual DOM (direct DOM manipulation)
 - Best for **small / medium apps**
