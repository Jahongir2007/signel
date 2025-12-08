# ResignJS 🔮

A **lightweight reactive JavaScript library** for building interactive DOM applications with minimal boilerplate. Inspired by Vue and React, ResignJS makes arrays, inputs, and tabs fully reactive while keeping your code simple and readable.

---

## Features ✨

- **Reactive Inputs**: Automatically update and save values to `localStorage`.  
- **Reactive Lists**: Arrays update the DOM in real-time with simple callbacks.  
- **Reactive Tabs**: Only one active tab at a time, fully reactive.
- **Template Engine**: Use `$$variable` syntax inside HTML templates for reactive updates.
- **Utility Methods**: Add/remove classes, toggle elements, listen to events easily.  
- **Lightweight & Simple**: No virtual DOM, easy to integrate with any project.  

---

## Installation 💻

### Via npm
```bash
npm install resign
```

### Via CDN
```html
<script src="https://cdn.jsdelivr.net/gh/jahongir2007/resignjs/resign.js"></script>
```

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

#### Template Engine
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

| Method                               | Description                                                            |
| ------------------------------------ | ---------------------------------------------------------------------- |
| `input(selector, callback)`          | Makes `<input>` or `<textarea>` reactive, updates DOM and localStorage |
| `El(selector, callback)`             | Main reactive wrapper for elements                                     |
| `proxy.list(key, array, templateFn)` | Reactive lists                                                         |
| `proxy.tab(name, selector)`          | Reactive tabs                                                          |
| `proxy.classes(str)`                 | Set classes for elements                                               |
| `proxy.addClass(str)`                | Add class                                                              |
| `proxy.removeClass(str)`             | Remove class                                                           |
| `proxy.on(event, fn)`                | Add event listeners                                                    |
| `proxy.toggle(selector)`             | Toggle element display                                                 |

### Why ResignJS? 💡

 - **Minimal**: Small footprint, no virtual DOM.
 - **Reactive**: Automatically updates DOM when your data changes.
 - **Flexible**: Works in any project, integrates with existing HTML easily.
