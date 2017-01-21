# EV4Modern
A user-script that makes [ev.org.br](http://ev.org.br) work in modern browsers

## Why?

Because it recommends using Internet Explorer, which is unsafe. Even Microsoft don't supports Internet Explorer anymore: they reccomend using Edge, which is far better, secure and faster than Internet Explorer, in fact in some point it's better than other modern browsers (except by the point below).

That's not the only problem: some courses use Flash, which can run in all operating systems but mobile devices. In the other hand Internet Explorer only runs in Windows. If you use Linux or OSX you will need to download a Virtual Machine to access EV!

## How to use it?

1. Install an userscript extension (Greasemonkey, Tampermonkey, etc)
2. Open this: https://github.com/qgustavor/EV4Modern/raw/master/userscript.js

## What can Bradesco do to fix that problems?

* If they don't have any time to spend with this: well... nothing.
* If they have 5 minutes to spend: insert a `<script src="https://github.com/qgustavor/EV4Modern/raw/master/userscript.js"></script>` in their pages `<head>`
* If they have more time to spend:
    * Replace all ActiveX objects with the modern equivalents
    * Replace `document.[element-id]` with `document.getElementById('[element-id]')`
    * Replace `setVariables` with `SetVariables`
    * Add `allowScriptAccess` to Flash parameters

## Does it solve all problems?

No, as currently it only support two courses: "Contabilidade Empresarial" and "Estratégia de Negócios". Maybe other courses are fixed by this userscript, but those aren't tested. If you can send a pull request adding support to other courses and/or fixing more bugs.
