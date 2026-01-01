# Signel.js v2.2.0 Documentation
## Overview

Signel.js is a small JavaScript library that helps with reactivity and DOM manipulation. It allows for a simple state management system with reactive updates to the DOM and provides useful utilities to interact with DOM elements.

## Installation
With CDN:
```html
<script src="https://signel.onrender.com/signel.js"></script>
```
With NPM:
```bash
npm install signel
```

## Core Features

### 1. Reactivity System
### 2. Watchers & Derived State
### 3. DOM Manipulation
### 4. Template Binding

### 1. Reactivity System

Signel.js introduces a reactive state management system where changes to an object’s properties automatically trigger updates to the DOM.

 - `state(obj)`
Creates a reactive state object using a JavaScript `Proxy`. This enables automatic tracking and updating when state properties change.
#### Usage
```js
var state = state({
  count: 0
});
```
 - This will allow you to set up reactive properties (`count` in the example above) that will automatically trigger updates in the DOM when modified.
#### Example
```js
state.count = 10;  // Triggers reactivity system to update related DOM elements
```

 - `track(target, key)`
Tracks changes to a specific property (`key`) on a `target` object and registers any "active effect" (i.e., a function that needs to run when the property changes).

 - `trigger(target, key)`
When a property (`key`) of a `target` object changes, this function triggers the registered effect, re-running the effect and updating the DOM if necessary.

 - `render(fn)`
This method registers a "reactive effect," a function that should run whenever the state is modified. The effect will be re-executed whenever any part of the state it depends on changes.

#### Example:
```js
render(() => {
  console.log(state.count);
});
```
This will log the `state.count` value to the console every time it changes.

### 2. Watchers & Derived State
Signel.js provides utilities to observe state changes and derive new reactive values without directly manipulating the DOM.

 - `watch(getter, callback)`
Watches a reactive value and executes a callback whenever it changes.
 - `getter` → a function that returns a reactive value
 - `callback(newValue, oldValue)` → runs when the value changes

#### Usage:
```js
watch(()=> state.count, (newVal, oldVal)=> {
  console.log('Count changed from', oldVal, 'to', newVal);
});
```
**Notes**
 - The getter function is required to enable reactivity.
 - The callback only runs when the value actually changes.

 - `watchKey(state, key, callback)`
A shortcut for watching a specific key in a state object.

#### Usage:
```js
watchKey(state, 'count', (newVal, oldVal) => {
  console.log(newVal);
});
```
#### Equivalent to
```js
watch(() => state.count, callback);
```

 - `computed(getter)`

Creates a **derived reactive value** based on other reactive state.
 - Automatically recalculates when dependencies change
 - Returns a **read-only reactive value**

#### Usage:
```js
const doubleCount = computed(() => state.count * 2);
```
#### Example:
```js
render(() => {
  console.log(doubleCount.value);
});
```
When `state.count` changes, `doubleCount.value` updates automatically.

#### Example: watch + computed together
```js
var state = state({ count: 1 });

const doubled = computed(() => state.count * 2);

watch(() => doubled.value, (newVal) => {
    console.log('Doubled count:', newVal);
});

state.count = 5; // Logs: Doubled count: 10
```

### 3. DOM Manipulation Utilities
Signel.js provides various methods for easy DOM manipulation and event handling.

 - `dom(selector)`
This function selects DOM elements based on a CSS selector and provides a chainable API to manipulate those elements.

#### Available Methods:

 - `text(content)`
Sets the text content of all selected elements. If no argument is passed, it gets the text content of the first element.
```js
dom('.my-element').text('Hello World');
```

 - `show()`
Displays the selected elements by setting their `display` style to `''`.
```js
dom('.hidden').show();
```

 - `hide()`
Hides the selected elements by setting their `display` style to `'none'`.
```js
dom('.visible').hide();
```

 - `css(style)`
Applies CSS styles to the selected elements. You provide a string of CSS styles.
```js
dom('.box').css('background-color: red; width: 100px;');
```

 - `val(newValue)`
Sets the value of the selected elements (e.g., form inputs). If no value is provided, it retrieves the value of the first selected element.
```js
dom('input').val('new value');
```

 - `click(fn)`
Adds a click event listener to the selected elements.
```js
dom('.button').click(() => alert('Button clicked!'));
```

 - `change(fn)`
Adds a change event listener to the selected elements (useful for form elements like inputs and selects).
```js
dom('input').change(() => alert('Input changed!'));
```

 - `hover(overFn, outFn)`
Adds mouseenter and mouseleave event listeners to the selected elements.
```js
dom('.item').hover(
  () => console.log('Hovered over'),
  () => console.log('Hovered out')
);
```

 - `html(value)`
Gets or sets the inner HTML content of the selected elements.
```js
dom('.container').html('<p>New HTML content</p>');
```

 - `addClass(className)`
Adds a class to the selected elements.
```js
dom('.item').addClass('active');
```

 - `removeClass(className)`
Removes a class from the selected elements.
```js
dom('.item').removeClass('active');
```

 - `toggleClass(className)`
Toggles a class on the selected elements.
```js
dom('.item').toggleClass('active');
```

- `hasClass(className)`
Checks if the first selected element has the specified class.
```js
dom('.item').hasClass('active');  // returns true or false
```

 - `attr(name, value)`
Gets or sets an attribute on the selected elements.
```js
dom('.image').attr('src', 'new-image.jpg');
```

 - `removeAttr(name)`
Removes an attribute from the selected elements.
```js
dom('.image').removeAttr('src');
```

 - `bind(state)`
Binds the state to the selected elements. This allows you to replace placeholder variables (e.g., `$$count`) inside the element’s content with actual state values.

#### Usage:
```js
dom('.count-display').bind(state);
```

#### Example:
```html
<div class="count-display">$$count</div>
```

If `state.count` is `5`, the div will display `5`.

 - `on(event, fn)`
Sets events and functions to the elements. And execute that function on that event
```js
dom('#phone').on('input', ()=> console.log('Typing...'))
```

### 2. Example Usage
#### Example 1: Simple State Binding and DOM Manipulation
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Signel.js Example</title>
    <script src="https://signel.onrender.com/signel.js"></script>
  </head>
  <body>
    <div id="count-display">Count: $$count</div>
    <button id="increment-btn">Increment</button>
    
    <script>
      const state = state({ count: 0 });

      // Bind state to DOM
      dom('#count-display').bind(state);

      // Button click increments the state
      dom('#increment-btn').click(() => {
        state.count += 1;
      });
    </script>
  </body>
</html>
```

This example shows how the state object is bound to the DOM, and clicking the button will update the count and automatically update the DOM.
