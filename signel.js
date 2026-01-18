/**
 * Signel.js v4.0.0
 * Author: Janongir Sobirov
 * Lisence: MIT (c) 2025 - 2026
 */
let activeEffect = null
window.effect = function(fn){
    activeEffect = fn   // store the function itself
    fn()                // run it once immediately
    activeEffect = null
}


window.state = function(initialValue, options){
    function updateArrayDOM(arr, element, showEach) {
        if(showEach && typeof showEach === 'function') {
            element.innerHTML = arr.map(showEach).join('')
        } else {
            element.textContent = arr.join(', ')
        }
    }

    if(options?.storageKey && localStorage.getItem(options.storageKey)){
        const stored = JSON.parse(localStorage.getItem(options.storageKey))
        if(Array.isArray(initialValue)) {
            initialValue.splice(0, initialValue.length, ...stored) // populate array
        } else {
            initialValue = stored
        }
    }
    const subscribers = new Set()
    const textNodes = new WeakMap()
    const methodObj = {}
    const roots = new Set()
    const effectSubscribers = new Set()
    let proxy
    let arrProxy
    if(typeof initialValue !== 'object'){
        proxy = new Proxy({ value: initialValue }, {
            set(target, key, value){
                target[key] = value
                subscribers.forEach(el => {
                    if (textNodes.has(el)) {
                        textNodes.get(el).nodeValue = target.value
                    }
                })

                if(options && options.storageKey){
                    localStorage.setItem(options.storageKey, value)
                }

                return true
            }
        })
    }else{
        arrProxy = new Proxy(initialValue, {
            get(target, prop) {
                if (['push','pop','splice','shift','unshift'].includes(prop)) {
                    return function(...args) {
                        const result = Array.prototype[prop].apply(target, args)
                        // trigger reactive DOM update here
                        subscribers.forEach(el => {
                            // el is the container
                            el.innerHTML = '' // clear old content (or do diffing later)
                            arrProxy.forEach(item => {
                                let node
                                if(typeof options.showEach === 'function'){
                                    // create an element from the template string
                                    const template = document.createElement('div')
                                    template.innerHTML = options.showEach(item)
                                    node = template.firstChild
                                }else{
                                    node = document.createTextNode(item)
                                }
                                el.appendChild(node)
                            })
                        })

                        effectSubscribers.forEach(fn => fn())
                        if(options && options.storageKey){
                            localStorage.setItem(options.storageKey, JSON.stringify(target))
                        }
                        return result
                    }
                }
                return target[prop]
            },

            set(target, key, value){
                target[key] = value

                subscribers.forEach(el => {
                    updateArrayDOM(target, el, options?.showEach)
                })

                effectSubscribers.forEach(fn => fn())

                if(options && options.storageKey){
                    localStorage.setItem(options.storageKey, JSON.stringify(target))
                }

                return true
            }
        })
    }


    Object.defineProperty(methodObj, 'val', {
        get() {

            if(activeEffect) {
                // Register this effect in a Set for this state
                effectSubscribers.add(activeEffect)
            }

            return proxy ? proxy.value : arrProxy
        },
        set(newValue) {
            if(proxy) proxy.value = newValue
            else {
                arrProxy.splice(0, arrProxy.length, ...newValue)
            }

            effectSubscribers.forEach(fn => fn())
        }
    })

    methodObj.root = function(selector){        
        if (typeof selector === 'string') {
            document.querySelectorAll(selector).forEach(el => roots.add(el))
        } else if (selector instanceof Element) {
            roots.add(selector)
        } else if (selector instanceof NodeList || Array.isArray(selector)) {
            selector.forEach(el => roots.add(el))
        } else {
            throw new TypeError('Invalid selector')
        }

        return this
    }

    methodObj.render = function(component){
        roots.forEach(rootElement => {
            rootElement.querySelectorAll(component).forEach(comp => {
                let valueToRender
                if(Array.isArray(arrProxy) && typeof options?.showEach === 'function'){
                    // Map array through showEach template
                    valueToRender = arrProxy.map(options.showEach).join('')
                } else if(proxy) {
                    valueToRender = proxy.value
                } else {
                    valueToRender = arrProxy
                }

                if (Array.isArray(arrProxy) && typeof options?.showEach === 'function') {
                    comp.innerHTML = arrProxy.map(options.showEach).join('')
                } else {
                    if (!textNodes.has(comp)) {
                        const node = document.createTextNode(valueToRender)
                        comp.appendChild(node)
                        textNodes.set(comp, node)
                    } else {
                        textNodes.get(comp).nodeValue = valueToRender
                    }
                }

                if(proxy && (comp.tagName === 'INPUT' || comp.tagName === 'TEXTAREA')){
                    comp.value = proxy.value
                    comp.addEventListener('input', e => {
                        methodObj.val = e.target.value
                    })
                }else if(proxy && comp.tagName === 'SELECT'){
                    comp.value = proxy.value
                    comp.addEventListener('change', e => {
                        methodObj.val = e.target.value
                    })
                }
                subscribers.add(comp)
            })
        })

        return this
    }

    return methodObj
}

window.component = function(name, setup) {
    const tag = name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()

    if (!tag.includes('-')) {
        throw new Error(
        `Component name "${name}" must contain a hyphen (e.g. "counter-box")`
        )
    }
    customElements.define(
        tag,
        class extends HTMLElement {
        connectedCallback() {
            const mount = this
            const props = Object.fromEntries(
            [...this.attributes].map(a => [a.name, a.value])
            )

            mount.innerHTML = setup(props, mount)
        }
    })
}
