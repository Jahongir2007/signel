/**
 * Signel.js v3.0.0
 * Author: Jahongir Sobirov
 * Lisence: MIT
 * All rights reserved (c) 2025-2026
 */
window.reactive = function(obj) {
    const callbacks = {} // track who depends on which key

    // create a proxy
    const proxy = new Proxy(obj, {
        get(target, key) {
            const value = target[key]
            // if value is a function, return it bound to proxy
            if (typeof value === 'function') return value.bind(proxy)
            return value
        },
        set(target, key, value) {
            target[key] = value
            // call all callbacks for this key
            if (callbacks[key]) callbacks[key].forEach(fn => fn(value))
            // call render() if exists
            if (typeof proxy.render === 'function') proxy.render()
            // re-run all $if expressions
            if(proxy._ifElements){
                proxy._ifElements.forEach(({ node, expr }) => {
                    const result = evaluate(expr, proxy)
                    node.style.display = result ? '' : 'none'
                })
            }

            if(proxy._loopElements){
                proxy._loopElements.forEach(loop => {
                    if(loop.updating) return
                    loop.updating = true
                    const array = state[loop.arrayKey] || []
                    loop.node.innerHTML = ''
                    array.forEach(item => {
                        const clone = loop.template.cloneNode(true)
                        clone.innerHTML = clone.innerHTML.replaceAll(`$$${loop.itemName}`, item)
                        loop.node.appendChild(clone)
                    })
                    loop.updating = false
                })
            }
            return true
        }
    })

    // helper to register DOM updates
    proxy._track = function(key, fn) {
        callbacks[key] = callbacks[key] || []
        callbacks[key].push(fn)
    }

    // initialize $if tracking array
    proxy._ifElements = []

    // initialize $loop tracking array
    proxy._loopElements = []

    return proxy
}

function evaluate(expr, state) {
    // create a function that can access the state object
    // 'with' lets us access state.count directly as 'count'
    return new Function('state', `
        with(state){ 
            return ${expr} 
        }
    `)(state)
}

window.compile = function(selector, state) {
    const root = document.querySelector(selector)

    function traverse(node) {
        if (node.nodeType !== 1) return // only elements

        // bind text
        if (node.hasAttribute('$text')) {
            const key = node.getAttribute('$text')
            node.textContent = state[key] // initial value
            // track updates
            state._track(key, val => node.textContent = val)
        }

        // bind click
        if (node.hasAttribute('$click')) {
            const fnName = node.getAttribute('$click')
            node.addEventListener('click', () => state[fnName]())
        }

        if(node.hasAttribute('$if')){
            const expr = node.getAttribute('$if')
            const updateIf = () => {
                const result = evaluate(expr, state)
                node.style.display = result ? '' : 'none'
            }
            state._ifElements.push({ node, expr })
            updateIf()
        }

        if(node.hasAttribute('$loop')){
            const [itemName, arrayKey] = node.getAttribute('$loop').split(' in ').map(s => s.trim())
            
            // save template
            const template = node.cloneNode(true)
            template.removeAttribute('$loop')
            node.innerHTML = '' // clear original content
            
            // push to _loopElements
            state._loopElements.push({ node, template, arrayKey, itemName })

            const arr = state[arrayKey] || []
            // node.innerHTML = arr;

            arr.forEach(item => {
                    const clone = template.cloneNode(true)
                    clone.innerHTML = clone.innerHTML.replaceAll(`$$${itemName}`, item)
                    node.appendChild(clone)
            })
            
        }

        // $model
        if (node.hasAttribute('$model')) {
            const key = node.getAttribute('$model')

            // 1️⃣ Initial value
            node.value = state[key]

            // 2️⃣ State → DOM
            state._track(key, val => {
                if (node.value !== val) node.value = val
            })

            // 3️⃣ DOM → State
            node.addEventListener('input', e => {
                state[key] = e.target.value
            })
        }

        // recurse children
        Array.from(node.children).forEach(traverse)
    }

    traverse(root)
}
