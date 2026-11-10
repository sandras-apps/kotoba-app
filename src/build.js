// Builds ../index.html from the sources in this folder.  Run: node src/build.js
const fs = require('fs'), path = require('path');
const r = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kotoba</title>
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#F5EFE6">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-192.png">
<meta name="description" content="A calm, fast multilingual dictionary. Data from Wiktionary. No AI.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Noto+Sans+Sinhala:wght@400;700&display=swap" rel="stylesheet">
<style>
${r('style.css')}</style>
</head>
<body>
<div class="top"><div class="wrap">
  <div class="bar"><a href="#" id="brand">Kotoba</a>
    <button class="ib" id="bfav" aria-label="Favourites">★</button>
    <button class="ib" id="bsize" aria-label="Text size" aria-haspopup="true" aria-expanded="false">Aa</button>
    <button class="ib" id="btheme" aria-label="Theme">◐</button>
    <button class="ib" id="bset" aria-label="Settings">⚙</button>
    <div id="sizepop" hidden></div></div>
  <form id="form" autocomplete="off"><input id="q" type="search" enterkeyhint="search" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Word"><button id="go" type="submit">Cerca</button><div id="sug" hidden></div></form>
</div></div>
<main class="wrap" id="out"></main>
<footer class="wrap"><span id="src"></span></footer>
<dialog id="set"></dialog>
<!-- Anonymous visit count (GoatCounter): pageviews only, no cookies. If it can't load, nothing else is affected. -->
<script data-goatcounter="https://kotoba-app.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script>
${r('core.js')}
${r('ui.js')}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, '..', 'index.html'), html);
console.log('index.html written,', html.length, 'bytes');
