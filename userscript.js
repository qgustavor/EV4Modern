// ==UserScript==
// @name         EV4Modern
// @namespace    https://github.com/qgustavor
// @version      0.1
// @description  A user-script that makes ev.org.br work in modern browsers
// @author       qgustavor
// @downloadURL  https://raw.githubusercontent.com/qgustavor/EV4Modern/master/userscript.js
// @updateURL    https://raw.githubusercontent.com/qgustavor/EV4Modern/master/userscript.js
// @match        http://www.ev.org.br/*
// @match        http://lms.ev.org.br/*
// @icon         http://www.ev.org.br/Style%20Library/EV/Imagens/rodape_ev.png
// @grant        none
// @run-at       document-start
// ==/UserScript==

// Userscripts are run in their own context, but they share the `document` from page context
// So the first thing we do is creating a function to be injected into the page in a <script>

function injectedFn (isIframe) {
  // This function runs only once, but if for some reason it's injected multiple times
  // the check below prevents it from running more than once.
  if (window.EV4Modern_Injected) return
  window.EV4Modern_Injected = true

  // Stop the `window.open` abuse. EV uses it a lot, even if
  // it isn't needed, as a simple URL redirection will work.
  window.open = url => {
    window.location.href = url
    return window
  }

  // Simulate the deprecated ActiveXObject object that some courses use
  class ActiveXObject {
    constructor (type) {
      this.type = type
    }
    load (url) {
      // .load() is defined by the Microsoft.XMLDOM ActiveX
      // it can be simulated using syncronous XMLHttpRequest and the DOMParser      
      if (this.type !== 'Microsoft.XMLDOM') throw Error('expected Microsoft.XMLDOM')
      
      const xhr = new window.XMLHttpRequest()
      xhr.open('GET', url, false)
      xhr.send()
      const xmlParser = new window.DOMParser()
      const xmlDOM = xmlParser.parseFromString(xhr.responseText, 'text/xml')
      fixDom(xmlDOM)
      this.documentElement = xmlDOM.documentElement
      this.parseError = {errorCode: 0}
    }
  }

  function fixDom (dom) {
    // For some reason the ActiveX don't return text nodes in the `childNodes` property
    // The equivalent property for doing that using DOMParser is `children`
    // So we just replace `childNodes` with `children`
    Object.defineProperty(dom, 'childNodes', {
      configurable: true,
      enumerable: true,
      get () {
        return dom.children
      }
    })
    // Also do the same for all nodes in the three
    for (let child of dom.children) fixDom(child)
  }

  // We can export the simulated object by assigning it to `window`
  window.ActiveXObject = ActiveXObject

  // Some courses use `document.Flash`, which returns `undefined` in modern browsers
  // To fix that we replace that attribute with a getter, without letting the browser undo it
  Object.defineProperty(document, 'Flash', {
    configurable: false,
    enumerable: false,
    get () {
      return document.querySelector('embed')
    }
  })

  // Some courses use `document.Flash.setVariable`, which returns undefined
  // The correct property is `SetVariable`. I don't know why how it worked in IE.
  Object.defineProperty(window.HTMLEmbedElement.prototype, 'setVariable', {
    configurable: true,
    enumerable: true,
    get () {
      return this.SetVariable
    }
  })

  // Now we are using MutationObservers to detect all frame, iframe and embed creation
  // MutationObservers are objects that detects changes in the DOM tree
  let observerActive = true
  function handleEmbeds () {
    // `observerActive` prevent loops, more info below
    if (!observerActive) return

    // We want to inject the code in iframes, as they're not matched by the @match rule
    // if the `src` of those are empty or `about:blank`.
    const frames = document.querySelectorAll('frame, iframe')
    Array.from(frames).forEach(frame => {
      const document = frame.contentDocument
      const window = frame.contentWindow
      const script = document.createElement('script')
      script.innerHTML = '(' + injectedFn + '(true))'
      
      // When iframes are created there isn't any element to observe
      // So we have to make a loop waiting for the <head> creation
      ;(function waitHead () {
        if (!document.head) {
          // This is a way to call a function fast without blocking <iframe> loading
          // Other way can be using `setTimeout` or `setInterval`, but those are
          // slower than using the `onmessage` *hack* below.
          window.onmessage = waitHead
          window.postMessage('waitHead')
        } else {
          document.head.appendChild(script)
          window.onmessage = null
        }
      })
    })

    // We also want to detect embeds and add `allowScriptAccess` to those
    // Seems that the courses were coded when Flash allowed all movies to access
    // JavaScript variables, but now Flash movies need to request this permission.
    const embeds = document.querySelectorAll('embed')
    if (!embeds || embeds.length === 0) return

    // Here we disable the observer, as we are going to change the DOM
    // If we don't disable it here the observer will detect the change we
    // are going to do and it will create a infinite loop
    observerActive = false
    for (let element of embeds) {
      element.setAttribute('allowScriptAccess', 'always')
      element.insertAdjacentHTML('beforebegin', '<param name="allowScriptAccess" value="always" />')
    }
    // Here we enable the observer again, but inside a Promise, so the call order is:
    // Observer disabled, element added, promise created, observer calls this function,
    // promise.then() called, then observer is actived again.
    Promise.resolve().then(() => { observerActive = true })
  }

  const observer = new window.MutationObserver(handleEmbeds)
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  })

  handleEmbeds()
  
  // Sometimes listening to DOMContentLoaded event, or the load event, causes problems
  // so we do the dirty setTimeout-loop based check
  ;(function waitLoad () {
    if (document.readyState !== 'complete') return setTimeout(waitLoad, 100)
    if (typeof Carrega === 'function') setTimeout(reloadObjects, 1000)
  }())

  // Here we reload all objects by removing and readding those to the DOM tree
  // This is because sometimes even the fast MutationObserver can't add the
  // allowScriptAccess permission before Flash starts the movie.
  // After reloading we run the `Carrega` function again
  function reloadObjects () {
    const objects = document.querySelectorAll('object')
    const temporaryNode = document.createTextNode('')
    objects.forEach((node, index) => {
      node.replaceWith(temporaryNode)
      temporaryNode.replaceWith(node)
    })
    setTimeout(window.Carrega, 1000)
  }
  
  // Even with all those changes sometimes the finish button don't works
  // If it's the case the user can open the JavaScript console and run
  // `skipModule()` to go to the next module.
  window.skipModule = () => {
    window.SetStatus('completed')
	  window.SetScore(10)
	  window.SetLocation(28)
	  window.FinishScorm()
  }
}

// Here we inject the function above by adding a <script> in the page's <head>
const script = document.createElement('script')
script.innerHTML = '(' + injectedFn + '())'
document.head.appendChild(script)
