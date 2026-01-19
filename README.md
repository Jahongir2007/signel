# Signel.js

Signel.js is a **minimal reactive JavaScript library** for building interactive UIs using native DOM APIs.
It provides:
 - Reactive state management
 - Automatic DOM updates
 - Dependency-tracked effects
 - Lightweight component system
 - Optional `localStorage` persistence

No virtual DOM. No build step. No framework lock-in.

## Table of Contents

1. Installation
2. Core Concepts
3. `state()` – Reactive State
4. `effect()` – Reactive Effects
5. DOM Rendering
6. Array Reactivity
7. Persistence with `localStorage`
8. Components
9. Examples
10. Design Philosophy & Limitations

## 1. Installation

Include Signel.js directly in your HTML:
```html
<script src="https://signel.onrender.com/signel.js"></script>
```

Signel exposes three global APIs:
```js
state()
effect()
component()
```

## 2. Core Concepts

### Reactivity Model
Signel uses:
 - **Proxies** for state mutation tracking
 - **Automatic dependency collection** via `effect()`
 - **Direct DOM updates** (no virtual DOM)

State changes trigger:
 - DOM updates
 - Effects re-execution
 - Optional persistence

## 3. `state()` – Reactive State
Creating State
```js
const count = state(0)
```

Access or update the value via `.val`:
```js
count.val++        // update
console.log(count.val) // read
```
### State API
```js
const myState = state(initialValue, options)
```
#### Parameters
| Parameter      | Description            |
| -------------- | ---------------------- |
| `initialValue` | Primitive or array     |
| `options`      | Optional configuration |

#### Options
```js
{
  storageKey: 'key-name', // persist to localStorage
  showEach: item => `<li>${item}</li>` // array rendering template
}
```

## 4. `effect()` – Reactive Effects
Effects automatically re-run when any accessed state changes.
Example
```js
const count = state(0)

effect(() => {
  console.log('Count is:', count.val)
})
```
How it works:
 - When `count.val` is read inside effect
 - The effect is registered as a dependency
 - When `count.val` changes → effect re-runs

## 5. DOM Rendering
Binding State to DOM
```html
<p class="count"></p>
```
```js
count
  .root(document.body)
  .render('.count')
```
 - `.root()` defines where Signel should search
 - `.render()` selects elements to bind
DOM updates automatically when state changes.

### Two-Way Binding (Inputs)
Supported elements:
```html
<input>
<textarea>
<select>
```
```html
<input class="name">
<p class="output"></p>
```
```js
const name = state('')

name
  .root(document.body)
  .render('.name')
  .render('.output')
```
Typing updates state → state updates DOM.

## 6. Array Reactivity
Arrays are fully reactive.
```js
const todos = state([], {
  showEach: item => `<li>${item}</li>`
})
```
Rendering Arrays
```html
<ul class="list"></ul>
```
```js
todos
  .root(document.body)
  .render('.list')
```
### Updating Arrays
```js
todos.val.push('Buy milk')
todos.val.splice(0, 1)
```
Supported mutating methods:
 - `push`
 - `pop`
 - `splice`
 - `shift`
 - `unshift`
Each mutation:
 - Updates the DOM
 - Triggers effects
 - Saves to storage (if enabled)

## 7. Persistence with localStorage

Enable persistence by providing a `storageKey`.
```js
const count = state(0, {
  storageKey: 'count'
})
```
Behavior:
 - Loads value from `localStorage` on init
 - Automatically saves on every change

Arrays are stored as JSON.

## 8. Components

Signel supports **Web Components** via `component()`.
### Defining a Component
```js
component('CounterBox', (props, mount) => {
  const count = state(0)

  count.root(mount).render('.value')

  return `
    <div>
      <span class="value"></span>
      <button>+</button>
    </div>
  `
})
```
Component names:
 - Must contain a hyphen
 - Are automatically converted to kebab-case
```html
<counter-box></counter-box>
```
### Component Props
Attributes are passed as props:
```html
<user-card name="John"></user-card>
```
```js
component('UserCard', (props) => {
  return `<p>Hello ${props.name}</p>`
})
```

## 9. Examples
### Counter
```html
<button id="inc">+</button>
<p class="count"></p>
```
```js
const count = state(0)

count.root(document.body).render('.count')

document.getElementById('inc').onclick = () => {
  count.val++
}
```
### Todo List
```html
<input id="todoInput">
<button id="add">Add</button>
<ul class="todos"></ul>
```
```js
const todos = state([], {
  showEach: item => `<li>${item}</li>`,
  storageKey: 'todos'
})

todos.root(document.body).render('.todos')

document.getElementById('add').onclick = () => {
  todos.val.push(todoInput.value)
}
```
## 10. Design Philosophy & Limitations
### Philosophy
 - Minimal API
 - No build tools
 - No JSX
 - Native browser features
 - Small mental model
### Limitations
 - No virtual DOM diffing
 - No deep object reactivity
 - Array rendering replaces `innerHTML`
 - Effects are global (not scoped)

## Summary

Signel.js is ideal for:
 - Small to medium projects
 - Learning reactivity fundamentals
 - Enhancing static HTML
 - Lightweight widgets and tools
 - It gives you reactivity without framework overhead.
