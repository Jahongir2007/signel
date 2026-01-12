/*
  Signel.js v2.3.0
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

window.state = value => {
    // ✅ primitive → wrap into { val }
    if (typeof value !== 'object' || value === null) {
        return state({ val: value });
    }

    // ✅ object → proxy
    return new Proxy(value, {
        get(target, key) {
        track(target, key);
        return target[key];
        },
        set(target, key, newValue) {
        if (target[key] === newValue) return true;
        target[key] = newValue;
        trigger(target, key);
        return true;
        }
    });
};

window.render = fn => {
    activeEffect = fn;
    fn();
    activeEffect = null;
};

function effect(fn) {
  const runner = () => {
    activeEffect = runner;
    fn();
    activeEffect = null;
  };
  runner();
  return runner;
}

window.when = condition => {
  let renderFn = null;
  let cleanup = null;

  const runner = () => {
    if (!condition()) {
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
      return;
    }

    if (renderFn) {
      cleanup = renderFn() || null;
    }
  };

  effect(runner);

  return {
    render(fn) {
      renderFn = fn;
      runner(); // run immediately if condition is true
      return this;
    }
  };
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
        },

        on(event, fn){
            elements.forEach(el => el.addEventListener(event, fn))
            return this
        },

        model(state, key) {
            elements.forEach(el => {

                render(() => {
                    if (el.value !== state[key]) {
                        el.value = state[key] ?? ''
                    }
                })

                const event = el.tagName === 'SELECT' ? 'change' : 'input'

                el.addEventListener(event, () => {
                    state[key] = el.value
                })
            })

            return this
        },

        data(key, value){
            // GET
            if (value === undefined) {
                return elements[0]?.dataset[key]
            }

            // SET
            elements.forEach(el => {
                el.dataset[key] = value
            })

            return this
        },

        loop(state, key, template){
            elements.forEach(el => {
                render(() => {
                    const arr = state[key]

                    if (!Array.isArray(arr)) {
                        console.warn('loop() expects an array')
                        return
                    }

                    el.innerHTML = arr.map((item, index) =>
                        template(item, index)
                    ).join('')
                })
            })

            return this
        }
    }
}

window.watch = function (getter, callback) {
  let oldVal;

  render(() => {
    const newVal = getter()
    if (newVal !== oldVal) {
      callback(newVal, oldVal);
      oldVal = newVal;
    }
  });
};

window.watchKey = function (state, key, cb) {
  watch(() => state[key], cb);
}

window.derive = function(fn){
    let cached
    render(()=> {
        cached = fn()
    })

    return ()=> cached
}

const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

window.list = function(initial = []) {
  const raw = [...initial]

  const proxy = new Proxy(raw, {
    get(target, key) {
      if (arrayMethods.includes(key)) {
        return (...args) => {
          const res = Array.prototype[key].apply(target, args)
          trigger(target, 'iterate')
          return res
        }
      }

      track(target, 'iterate')
      return Reflect.get(target, key)
    },

    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      trigger(target, 'iterate')
      return res
    }
  })

  return proxy
}
