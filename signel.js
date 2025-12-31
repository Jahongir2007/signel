/*
  Signel.js v2.0.0
  Author: Jahongir Sobirov
  License: MIT
  All rights reserved
*/
const deps = new Map();
let activeEffect = null;

function track(target, key) {
  if (!activeEffect) return;

  let depsMap = deps.get(target);
  if (!depsMap) deps.set(target, (depsMap = new Map()));

  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));

  dep.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = deps.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  dep && dep.forEach(fn => fn());
}

window.state = obj =>
  new Proxy(obj, {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, value) {
      if (target[key] === value) return true;
      target[key] = value;
      trigger(target, key);
      return true;
    }
  });

window.render = fn => {
  activeEffect = fn;
  fn();
  activeEffect = null;
};

window.dom = function(selector) {
    const elements = document.querySelectorAll(selector);

    return {
        text(content) {
            elements.forEach(el => el.textContent = content);
            return this;
        },
        show() {
            elements.forEach(el => el.style.display = '');
            return this;
        },
        hide() {
            elements.forEach(el => el.style.display = 'none');
            return this;
        },
        css(style) {
            elements.forEach(el => el.style.cssText = style);
            return this;
        },
        val(newValue) {
            if (newValue === undefined) {
                // getter: return first element's value
                return elements[0]?.value;
            } else {
                // setter
                elements.forEach(el => el.value = newValue);
                return this;
            }
        },
        click(fn) {
            elements.forEach(el => el.addEventListener('click', fn));
            return this;
        },
        change(fn) {
            elements.forEach(el => el.addEventListener('change', fn));
            return this;
        },
        hover(overFn, outFn) {
            elements.forEach(el => {
                if (overFn) el.addEventListener('mouseenter', overFn);
                if (outFn) el.addEventListener('mouseleave', outFn);
            });
            return this;
        },

        html(value) {
            if (value === undefined) {
                return elements[0]?.innerHTML;
            }
            elements.forEach(el => el.innerHTML = value);
            return this;
        },

        addClass(className) {
            elements.forEach(el => el.classList.add(className));
            return this;
        },
        removeClass(className) {
            elements.forEach(el => el.classList.remove(className));
            return this;
        },
        toggleClass(className) {
            elements.forEach(el => el.classList.toggle(className));
            return this;
        },
        hasClass(className) {
            return elements[0]?.classList.contains(className);
        },

        attr(name, value) {
            if (value === undefined) {
                return elements[0]?.getAttribute(name);
            }
            elements.forEach(el => el.setAttribute(name, value));
            return this;
        },
        removeAttr(name) {
            elements.forEach(el => el.removeAttribute(name));
            return this;
        },

        bind(state) {
            elements.forEach(el => {
                if (!el.__template) {
                    el.__template = el.textContent;
                }
            });

            render(() => {
                elements.forEach(el => {
                    let output = el.__template;

                    for (const key in state) {
                        output = output.replaceAll(`$$${key}`, state[key]);
                    }

                    el.textContent = output;
                });
            });

            return this;
        }

    }
}
