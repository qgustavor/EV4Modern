# EV4Modern
Um userscript que faz o [ev.org.br](http://ev.org.br) funcionar em navegadores modernos

*[Read the English readme here](https://github.com/qgustavor/EV4Modern/blob/master/README-EN.md)*

## Por quê?

Porque ele recomenda usar Internet Explorer, que é inseguro. Nem mesmo a Microsoft não suporta mais o Internet Explorer: eles recomendam o uso do Edge, que é muito melhor, seguro e mais rápido do que o Internet Explorer, de fato, em alguns pontos ele é melhor do que outros navegadores modernos (exceto pelo ponto abaixo).

Mas esse não é o único problema: mesmo que alguns cursos usem o Flash, que pode ser executado em todos os sistemas operacionais, exceto em dispositivos móveis, por outro lado o Internet Explorer só pode ser executado no Windows. Se você usa Linux ou OSX precisará baixar uma Máquina Virtual para acessar o EV!

## Como usar o userscript?

1. Instale uma extensão de userscripts (Greasemonkey, Tampermonkey, etc)
2. Abra isso: https://github.com/qgustavor/EV4Modern/raw/master/userscript.js

## O que o Bradesco pode fazer para corrigir isso?

* Se eles não tem nenhum tempo para gastar corrigindo: bem... nada.
* Se eles tem cinco minutos para gastar: inserir um `<script src="https://github.com/qgustavor/EV4Modern/raw/master/userscript.js"></script>` no `<head>` das páginas
* Se eles tem mais tempo para gastar:
    * Trocar o uso de objectos ActiveX pelos equivalentes modernos
    * Trocar `document.[element-id]` por `document.getElementById('[element-id]')`
    * Trocar `setVariables` por `SetVariables`
    * Adicionar `allowScriptAccess` aos parâmetros do Flash

## Isso resolve todos os problemas?

Não, pois actualmente o userscript só suporta dois cursos: "Contabilidade Empresarial" e "Estratégia de Negócios". Talvez outros cursos sejam corrigidos por este userscript, mas eles não foram testados. Se você puder enviar um pull request adicionando suporte a outros cursos e/ou corrigindo mais bugs seria muito bom.
