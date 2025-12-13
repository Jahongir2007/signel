/*
  Signel.js v1.0.0
  Author: Jahongir Sobirov
  License: MIT
  All rights reserved
*/
window.el = function (selector, state = {}) {
  const elements = Array.from(document.querySelectorAll(selector));
  if (!elements.length) throw Error("No elements found: " + selector);

  // save templates for each element
  const templates = elements.map(el => el.innerHTML);

  state.__bindings = {};
  const proxy = new Proxy(state, {
    set(target, prop, value) {
      target[prop] = value;

      render();
      if (state.__bindings[prop]) {
        state.__bindings[prop].forEach(inputEl => {
          inputEl.value = value;
        });
      }
      
      return true;
    }
  });

  function render() {
    elements.forEach((el, i) => {
      el.innerHTML = templates[i].replace(/\$\$(\w+)/g, (_, key) => {
        return proxy[key] ?? "";
      });
    });
  }

  render();
  return proxy;
};

window.button = function (selector, fn) {
  const elements = Array.from(document.querySelectorAll(selector));
  if (!elements.length) throw Error("No elements found: " + selector);

  elements.forEach(el => {
    el.addEventListener("click", () => fn(el));
  });

  return elements;
};

window.input = function (selector, state, key) {
  const inputs = Array.from(document.querySelectorAll(selector));

  // Bind each input
  inputs.forEach(el => {
    // When typing → update state → updates DOM + other inputs
    el.addEventListener("input", () => {
      state[key] = el.value;
    });

    // store binding
    if (!state.__bindings[key]) state.__bindings[key] = [];
    state.__bindings[key].push(el);

    // initial sync state → input
    el.value = state[key] ?? "";
  });
};

window.toggle = function ({ btn, content }) {
  const btns = Array.from(document.querySelectorAll(btn));
  if (!btns.length) throw Error("No elements found: " + btn);

  const contents = Array.from(document.querySelectorAll(content));
  if (!contents.length) throw Error("No elements found: " + content);

  btns.forEach(btnEl => {
    btnEl.addEventListener("click", () => {
      contents.forEach(contentEl => {
        contentEl.style.display =
          contentEl.style.display === "none" ? "block" : "none";
      });
    });
  });
};

window.tabs = function({ btn, panel }) {
  if (!Array.isArray(btn) || !Array.isArray(panel)) {
    throw Error("btn and panel must be arrays");
  }

  if (btn.length !== panel.length) {
    throw Error("btn and panel arrays must have equal length");
  }

  btn.forEach((btnSelector, i) => {
    const btns = document.querySelectorAll(btnSelector);
    const panels = document.querySelectorAll(panel[i]);

    if (!btns.length) throw Error(`Buttons not found: ${btnSelector}`);
    if (!panels.length) throw Error(`Panels not found: ${panel[i]}`);

    // hide all panels at start except first
    panels.forEach((p, index) =>
      p.style.display = index === 0 ? "block" : "none"
    );

    btns.forEach((btnEl, index) => {
      btnEl.addEventListener("click", () => {
        // hide all panels
        panels.forEach(p => p.style.display = "none");

        // show the panel with same index
        panels[index].style.display = "block";
      });
    });
  });
};

window.checkbox = function(selector, state, key) {
  const els = document.querySelectorAll(selector);
  els.forEach(el => {
    el.checked = state[key] ?? false;

    el.addEventListener("change", () => state[key] = el.checked);

    if (!state.__bindings) state.__bindings = {};
    if (!state.__bindings[key]) state.__bindings[key] = [];
    state.__bindings[key].push(el);
  });
};

function reactiveArray(arr, notify) {
  return new Proxy(arr, {
    set(target, prop, value) {
      target[prop] = value;
      notify();
      return true;
    }
  });
}

window.list = function(initial = []) {
  if (!Array.isArray(initial)) {
    throw Error("list() expects an array");
  }

  const subscribers = new Set();

  function notify() {
    subscribers.forEach(fn => fn(proxy));
  }

  const proxy = new Proxy(initial, {
    set(target, prop, value) {
      target[prop] = value;

      // ignore length changes optimization (optional)
      notify();

      return true;
    }
  });

  proxy.subscribe = function(fn) {
    subscribers.add(fn);
    fn(proxy); // initial run
    return () => subscribers.delete(fn);
  };

  return proxy;
};

window.renderList = function(selector, reactiveList, renderItem) {
  const els = document.querySelectorAll(selector);

  reactiveList.subscribe(arr => {
    els.forEach(el => {
      el.innerHTML = arr.map(renderItem).join("");
    });
  });
}

window.model = function(selector, state, key) {
  const els = document.querySelectorAll(selector);
  if (!els.length) throw Error("No elements found");

  if (!state.__bindings) state.__bindings = {};
  if (!state.__bindings[key]) state.__bindings[key] = [];

  els.forEach(el => {
    // initial value
    if (el.type === "checkbox") {
      el.checked = !!state[key];
    } else {
      el.value = state[key] ?? "";
    }

    const event =
      el.tagName === "SELECT" || el.type === "checkbox"
        ? "change"
        : "input";

    // input → state
    el.addEventListener(event, () => {
      state[key] = el.type === "checkbox" ? el.checked : el.value;
    });

    // state → input
    state.__bindings[key].push(value => {
      if (el.type === "checkbox") {
        el.checked = !!value;
      } else {
        el.value = value ?? "";
      }
    });
  });
};
