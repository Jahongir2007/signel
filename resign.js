/*
  Resign.js v0.0.1
  Author: Jahongir Sobirov
  License: MIT
  All rights reserved
*/
window.input = function(selector, callback) {
  document.querySelectorAll(selector).forEach(el => {
    if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return;

    // initial reactive state
    let state = { value: el.value };

    const proxy = new Proxy(state, {
      set(target, prop, value) {
        target[prop] = value;
        // only update the input if it’s different
        if(el.value)
        if (el.value !== target[prop]) el.value = target[prop];
        if (el.id) localStorage.setItem(el.id, value);
        return true;
      }
    });

    // optional: expose a render function for templates
    proxy.show = function(selector, template){
      const out = document.querySelector(selector);
      if (!out) return;

      const html = template.replace(/\$\$([^\s]+)/g, (_, key) => {
        const v = proxy[key];
        return typeof v === "function" ? "" : (v ?? "");
      });

      out.innerHTML = html;
    };

    proxy.saved = function() {
      if (!el.id) return null; 
      localStorage.setItem(el.id, el.value);
      return localStorage.getItem(el.id);
    }


    // listen to user typing
    el.addEventListener('input', e => {
      proxy.value = e.target.value;  // update proxy
      callback(proxy);               // run user 
    });

    // initial callback run
    callback(proxy);
  });
};

window.El = function(selector, callback) {
  if (typeof selector !== "string") throw Error("Data type of element should be 'string'");

  const state = {};
  const elements = document.querySelectorAll(selector);
  const bindings = {};
  const templates = {};

  // Initialize bindings and templates for all elements
  elements.forEach(el => {
    const tag = el.tagName.toLowerCase();

    if (!bindings[tag]) bindings[tag] = [];
    bindings[tag].push(el);

    if (!templates[tag]) templates[tag] = [];
    templates[tag].push(el.innerHTML);
  });

  // Shared reactive proxy for all matched elements
  const proxy = new Proxy(state, {
    set(target, key, value) {
      target[key] = value;

      // Update all elements
      for (const tag in bindings) {
        bindings[tag].forEach((el, i) => {
          let html = templates[tag][i];
          html = html.replace(/\$\$([a-zA-Z0-9_]+)/g, (_, varName) => {
            return target[varName] ?? "";
          });
          el.innerHTML = html;
        });
      }

      return true;
    }
  });

  // Helper methods for **all matched elements**
  proxy.classes = function(classNames) {
    if (typeof classNames !== 'string') throw Error("Data type of classNames should be 'string'");
    elements.forEach(el => el.className = classNames);
  };

  proxy.addClass = function(className) {
    if (typeof className !== 'string') throw Error("Data type of className should be 'string'");
    elements.forEach(el => el.classList.add(className));
  };

  proxy.removeClass = function(className) {
    if (typeof className !== 'string') throw Error("Data type of className should be 'string'");
    elements.forEach(el => el.classList.remove(className));
  };

  proxy.on = function(event, fn) {
    if (typeof event !== 'string') throw Error("Data type of event should be 'string'");
    elements.forEach(el => el.addEventListener(event, fn));
  };

  proxy.toggle = function(selector) {
    if (typeof selector !== "string") {
      throw Error("Data type of element should be 'string'");
    }

    const el = document.querySelector(selector);
    if (!el) throw Error("Element not found: " + selector);

    // Save original display value
    if (!el.dataset.originalDisplay) {
      el.dataset.originalDisplay = getComputedStyle(el).display;
      if (el.dataset.originalDisplay === "none") {
        el.dataset.originalDisplay = "block"; // fallback
      }
    }

    // Toggle
    el.style.display =
      el.style.display === "none" ? el.dataset.originalDisplay : "none";
  };

  proxy.list = function(key, arr, listFn) {
    el = document.querySelector(selector);
    if(!proxy[key]) proxy[key] = new Proxy(arr, {
      set(target, prop, value){
        target[prop] = value;
        el.innerHTML = proxy[key].map(item => listFn(item)).join(""); 
        
        return true;
      }
    });

    el.innerHTML = proxy[key].map(item => listFn(item)).join("");
  };

  proxy.tab = function(name, contentEl){
    const el = document.querySelector(contentEl);
    if(!proxy.__tabs) proxy.__tabs = {};

    proxy.__tabs[name] = {el};
    // proxy["tabNames"]
    proxy[name] = new Proxy({contentEl, active: false}, {
      set(target, prop, value){
        target[prop] = value;

        if(prop === "active" && value === true){
          for(let key in proxy.__tabs){
            if(key !== name){
              proxy[key].active = false;
            }
          }
        }

        if(prop === "active"){
          document.querySelector(contentEl).style.display = value ? "block" : "none";
        }
        return true;
      }
    });
  };

  // Run user callback
  if (typeof callback === "function") callback(proxy);

  return proxy;
};
