/* ===== UI ===== */
const $ = s => document.querySelector(s);
const store = {
  get(k, d){ try{ const v = localStorage.getItem('dz.' + k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('dz.' + k, JSON.stringify(v)); }catch(e){} }
};
const S = {
  langs: store.get('langs', ['it','en','es','zh','ja','fr','si']),
  es: store.get('es', 'both'),
  ui: store.get('ui', (navigator.language || 'it').startsWith('it') ? 'it' : 'en'),
  size: store.get('size', 1),
  theme: store.get('theme', 'light'),
  recent: store.get('recent', []),
  saved: store.get('saved', []),
  last: store.get('last', '')
};
const TXT = {
  it: {ph:'Scrivi una parola…', go:'Cerca', recent:'Recenti', saved:'Salvate', meaning:'Significato', syn:'Sinonimi', ant:'Contrari',
    nyms:'Sinonimi e contrari', trans:'Traduzioni', rel:'Parole collegate', help:'Aiuti', all:'Tutto', listen:'Ascolta', save:'Salva', unsave:'Salvata',
    copy:'Copia', copied:'Copiata!', more:'Mostra altri', notFound:'Non trovo', maybe:'Forse cercavi:', noLang:'Questa parola esiste, ma non in una delle tue lingue.',
    also:'Esiste in:', net:'Non riesco a collegarmi. Controlla la connessione e riprova.', loading:'Cerco…', via:'Passando dall’inglese:',
    noTrans:'Nessuna traduzione trovata nelle tue lingue.', noNyms:'Wiktionary non ha ancora sinonimi o contrari per questa parola.', forms:'Forme', notes:'Note d’uso',
    wikt:'Apri la voce completa su Wiktionary (coniugazioni, etimologia…)', settings:'Impostazioni', myLangs:'Le mie lingue', esVar:'Quale spagnolo?',
    both:'Entrambi', ES:'Spagna', LA:'America Latina', uiLang:'Lingua dell’app', close:'Fatto', defsIn:'Le spiegazioni dei significati sono in inglese.',
    src:'Dati da Wiktionary (CC BY-SA 4.0) · Nessuna AI', goLemma:'Vai a', hint:'Scrivi in una qualsiasi delle tue lingue. Tocca una parola colorata per cercarla.',
    size:'Dimensione del testo', theme:'Tema chiaro / scuro', general:'In generale', otherSenses:'Altri significati', empty:'Ancora niente qui.', title:'Kotoba',
    favs:'Le mie parole', favsBtn:'Parole preferite', favsEmpty:'Non hai ancora parole preferite. Quando trovi una parola che ti piace, tocca ☆ Salva e la ritrovi qui.',
    allL:'Tutte', removed:'Tolta dalle preferite.', undo:'Annulla', copyList:'Copia la lista', remove:'Togli', seeAll:'Vedi tutte', back:'← Indietro',
    wTitle:'Ciao! Questo è Kotoba', wSub:'Un dizionario calmo, per scrivere e per imparare le lingue.',
    w1:'Scrivi una parola in una delle tue lingue.', w2:'Trovi significato, esempi, sinonimi, contrari e traduzioni, con la scrittura originale e la pronuncia.',
    w3:'Tocca una parola colorata per cercarla. Salva con ☆ quelle che ti piacciono.',
    wLangs:'Quali lingue usi?', wLater:'Puoi cambiarle quando vuoi da ⚙.', start:'Inizia', reWelcome:'Rivedi il benvenuto', noAI:'Niente AI, niente account: i dati vengono da Wiktionary e le tue parole restano sul tuo dispositivo.'},
  en: {ph:'Type a word…', go:'Search', recent:'Recent', saved:'Saved', meaning:'Meaning', syn:'Synonyms', ant:'Opposites',
    nyms:'Synonyms & opposites', trans:'Translations', rel:'Related words', help:'Helpers', all:'All', listen:'Listen', save:'Save', unsave:'Saved',
    copy:'Copy', copied:'Copied!', more:'Show more', notFound:'I can’t find', maybe:'Did you mean:', noLang:'This word exists, but not in one of your languages.',
    also:'It exists in:', net:'I can’t connect. Check your connection and try again.', loading:'Searching…', via:'Going through English:',
    noTrans:'No translations found in your languages.', noNyms:'Wiktionary has no synonyms or opposites for this word yet.', forms:'Forms', notes:'Usage notes',
    wikt:'Open the full entry on Wiktionary (conjugations, etymology…)', settings:'Settings', myLangs:'My languages', esVar:'Which Spanish?',
    both:'Both', ES:'Spain', LA:'Latin America', uiLang:'App language', close:'Done', defsIn:'Meanings are explained in English.',
    src:'Data from Wiktionary (CC BY-SA 4.0) · No AI', goLemma:'Go to', hint:'Type in any of your languages. Tap a coloured word to look it up.',
    size:'Text size', theme:'Light / dark theme', general:'In general', otherSenses:'Other meanings', empty:'Nothing here yet.', title:'Kotoba',
    favs:'My words', favsBtn:'Favourite words', favsEmpty:'No favourite words yet. When you find a word you like, tap ☆ Save and it will be here.',
    allL:'All', removed:'Removed from favourites.', undo:'Undo', copyList:'Copy the list', remove:'Remove', seeAll:'See all', back:'← Back',
    wTitle:'Hi! This is Kotoba', wSub:'A calm dictionary, for writing and for learning languages.',
    w1:'Type a word in any of your languages.', w2:'You get meanings, examples, synonyms, opposites and translations, in the original script with pronunciation.',
    w3:'Tap a coloured word to look it up. Save the ones you like with ☆.',
    wLangs:'Which languages do you use?', wLater:'You can change them any time from ⚙.', start:'Start', reWelcome:'See the welcome again', noAI:'No AI, no account: the data comes from Wiktionary and your words stay on your device.'}
};
const POS_IT = {Noun:'Sostantivo', Verb:'Verbo', Adjective:'Aggettivo', Adverb:'Avverbio', Pronoun:'Pronome', Preposition:'Preposizione', Conjunction:'Congiunzione',
  Interjection:'Interiezione', 'Proper noun':'Nome proprio', Numeral:'Numerale', Article:'Articolo', Determiner:'Determinante', Particle:'Particella', Phrase:'Frase',
  Idiom:'Modo di dire', Proverb:'Proverbio', Definitions:'Significati', Prefix:'Prefisso', Suffix:'Suffisso', Classifier:'Classificatore', Counter:'Contatore'};
const t = k => TXT[S.ui][k];
const posName = n => { n = n.replace(/ \d+$/, ''); return S.ui === 'it' ? (POS_IT[n] || n) : n; };
const langName = c => { const L = Core.BY_C[c]; return S.ui === 'it' ? L.it : L.wk; };
const out = $('#out'), input = $('#q'), sug = $('#sug');
let R = null, token = 0, focus = 'all', view = 'home', favFilter = 'all', lastRemoved = null;

function applyPrefs(){
  document.documentElement.dataset.theme = S.theme;
  document.documentElement.dataset.size = S.size;
  document.documentElement.lang = S.ui;
  input.placeholder = t('ph'); $('#go').textContent = t('go'); $('#src').textContent = t('src');
  $('#brand').textContent = t('title'); document.title = t('title');
  $('#bsize').title = t('size'); $('#bfav').title = t('favsBtn'); $('#bfav').setAttribute('aria-label', t('favsBtn')); $('#btheme').title = t('theme'); $('#bset').title = t('settings');
}
function regionBadge(r){ return r ? '<span class="rg rg-' + r + '">' + (r === 'ES' ? 'ES' : 'LATAM') + '</span>' : ''; }
function chip(x, lc, kind){
  const dim = lc === 'es' && S.es !== 'both' && x.r && x.r !== S.es;
  return '<button class="chip ' + (kind || '') + (dim ? ' dim' : '') + '" data-w="' + esc(x.w || x.t) + '" data-l="' + lc + '">' +
    '<span class="ct" lang="' + lc + '">' + esc(x.t) + '</span>' +
    (x.alt ? '<span class="calt" lang="' + lc + '">' + esc(x.alt) + '</span>' : '') +
    (x.tr ? '<span class="ctr">' + esc(x.tr) + '</span>' : '') +
    (x.g ? '<span class="cg">' + esc(x.g) + '</span>' : '') +
    (x.r ? regionBadge(x.r) : (x.q ? '<span class="cq">' + esc(x.q.slice(0, 28)) + '</span>' : '')) + '</button>';
}
function wordChips(list){
  return list.map(x => '<button class="chip plain" data-w="' + esc(x.w) + '" data-l="' + (x.l || '') + '">' + esc(x.w) +
    (x.l ? '<span class="cq">' + x.l.toUpperCase() + '</span>' : '') + '</button>').join('');
}
function scriptOf(w, avail){
  const has = c => avail.includes(c);
  if(/[඀-෿]/.test(w) && has('si')) return 'si';
  if(/[぀-ヿ]/.test(w) && has('ja')) return 'ja';
  if(/[一-鿿]/.test(w)) return S.last === 'ja' && has('ja') ? 'ja' : has('zh') ? 'zh' : has('ja') ? 'ja' : null;
  if(/[가-힯]/.test(w) && has('ko')) return 'ko';
  if(/[Ѐ-ӿ]/.test(w) && has('ru')) return 'ru';
  if(/[؀-ۿ]/.test(w) && has('ar')) return 'ar';
  if(/[ऀ-ॿ]/.test(w) && has('hi')) return 'hi';
  return null;
}
function home(){
  R = null; token++; input.value = ''; view = 'home'; document.body.classList.remove('welcoming');
  if(location.hash) history.replaceState(null, '', location.pathname + location.search);
  out.innerHTML = '<p class="hint">' + t('hint') + '</p>' +
    (S.saved.length ? '<section class="shelf"><h2>★ ' + t('favs') + '</h2><div class="chips">' + wordChips(S.saved.slice(0, 8)) + '</div>' + (S.saved.length > 8 ? '<button class="morebtn" data-nav="favs">' + t('seeAll') + ' (' + S.saved.length + ')</button>' : '') + '</section>' : '') +
    (S.recent.length ? '<section class="shelf"><h2>' + t('recent') + '</h2><div class="chips">' + wordChips(S.recent) + '</div></section>' : '');
}
function message(html){ out.innerHTML = '<div class="msg">' + html + '</div>'; }

async function search(w, hint){
  w = (w || '').trim(); if(!w) return home();
  const my = ++token; input.value = w; sug.hidden = true;
  message('<span class="spin"></span>' + t('loading'));
  let r;
  try{ r = await Core.lookup(w); }catch(e){ if(my === token) message(t('net')); return; }
  if(my !== token) return;
  if(!r){
    const sg = (await Core.suggest(w)).filter(x => x !== w);
    if(my !== token) return;
    return message(t('notFound') + ' <b>“' + esc(w) + '”</b>.' + (sg.length ? '<p>' + t('maybe') + '</p><div class="chips">' + wordChips(sg.map(x => ({w: x}))) + '</div>' : ''));
  }
  const avail = S.langs.filter(c => r.entries[c]);
  if(!avail.length){
    const names = Object.keys(r.entries).map(langName).concat(r.others).slice(0, 12);
    return message(t('noLang') + (names.length ? '<p>' + t('also') + ' ' + esc(names.join(', ')) + '</p>' : ''));
  }
  const size = c => r.entries[c].pos.reduce((n, p) => n + p.senses.length, 0) + (c === S.last ? 0.5 : 0);
  const richest = avail.slice().sort((a, b) => size(b) - size(a))[0];
  const cur = hint && avail.includes(hint) ? hint : scriptOf(r.title, avail) || richest;
  R = {r, avail, cur, pivot: null}; view = 'word';
  focus = 'all';
  if(decodeURIComponent(location.hash.slice(1)) !== r.title) location.hash = encodeURIComponent(r.title);
  show();
}
function remember(){
  const w = R.r.title, l = R.cur;
  S.recent = [{w, l}].concat(S.recent.filter(x => !(x.w === w && x.l === l))).slice(0, 14);
  store.set('recent', S.recent);
}
const isSaved = () => S.saved.some(x => x.w === R.r.title && x.l === R.cur);

function show(){
  const E = R.r.entries[R.cur], lc = R.cur, L = Core.BY_C[lc];
  remember();
  let n = 0; E.pos.forEach(p => p.senses.forEach(s => { s.n = ++n; }));
  const h0 = E.pos.find(p => p.head);
  let big = E.typed ? esc(E.typed) : (h0 && h0.head.html ? h0.head.html.replace(/<\/?a[^>]*>/g, '') : esc(E.word));
  const alt = E.typed && E.typed !== E.word ? E.word : '';
  let pr = E.pron;
  if(lc === 'es' && S.es !== 'both'){ const m = pr.filter(p => !p.r || p.r === S.es); if(m.length) pr = m; }
  pr = pr.slice(0, lc === 'es' || lc === 'en' ? 2 : 1);
  let h = '';
  if(R.avail.length > 1) h += '<nav class="tabs">' + R.avail.map(c => '<button class="tab' + (c === lc ? ' on' : '') + '" data-tab="' + c + '">' + esc(Core.BY_C[c].n) + '</button>').join('') + '</nav>';
  h += '<header class="word"><div class="wl">' + esc(L.n) + (lc === 'es' && S.es !== 'both' ? ' · ' + t(S.es) : '') + '</div>' +
    '<h1 lang="' + lc + '">' + big + (alt ? ' <small lang="' + lc + '">' + esc(alt) + '</small>' : '') + '</h1>' +
    (E.tr ? '<div class="roman">' + esc(E.tr) + '</div>' : '') +
    (pr.length ? '<div class="ipa">' + pr.map(p => '<span>' + esc(p.ipa) + (p.r ? ' ' + regionBadge(p.r) : (p.label && pr.length > 1 ? ' <em>' + esc(p.label.split(',')[0]) + '</em>' : '')) + '</span>').join('') + '</div>' : '') +
    '<div class="acts"><button class="act" data-act="listen">🔊 ' + t('listen') + '</button>' +
    '<button class="act' + (isSaved() ? ' on' : '') + '" data-act="save">' + (isSaved() ? '★ ' + t('unsave') : '☆ ' + t('save')) + '</button>' +
    '<button class="act" data-act="copy">⧉ ' + t('copy') + '</button></div></header>';
  h += '<nav class="focus">' + [['all','all'],['mean','meaning'],['nyms','nyms'],['tr','trans']].map(f =>
    '<button data-focus="' + f[0] + '" class="' + (focus === f[0] ? 'on' : '') + '">' + t(f[1]) + '</button>').join('') + '</nav>';

  /* meanings */
  h += '<section class="card mean" data-k="mean"><h2>' + t('meaning') + '</h2>';
  E.pos.forEach(p => {
    h += '<h3>' + esc(posName(p.name)) + '</h3><ol class="senses">';
    p.senses.forEach((s, i) => {
      const dim = lc === 'es' && S.es !== 'both' && s.r && s.r !== S.es;
      h += '<li class="sense' + (s.sub ? ' sub' : '') + (dim ? ' dim' : '') + (i >= 5 ? ' extra' : '') + '"><span class="num">' + s.n + '</span><div>' +
        '<p class="def">' + regionBadge(s.r) + s.labels.filter(l => !Core.region(l)).slice(0, 3).map(l => '<span class="lb">' + esc(l) + '</span>').join('') + ' ' + s.html + '</p>' +
        s.ex.slice(0, 2).map(e => '<div class="ex"><span class="ex-t" lang="' + lc + '">' + e.h + '</span>' +
          (e.tr ? '<span class="ex-r">' + esc(e.tr) + '</span>' : '') + (e.t ? '<span class="ex-m">' + esc(e.t) + '</span>' : '') + '</div>').join('') +
        (s.formOf ? '<button class="chip plain" data-w="' + esc(s.formOf) + '" data-l="' + lc + '">→ ' + t('goLemma') + ' <b>' + esc(s.formOf) + '</b></button>' : '') +
        '</div></li>';
    });
    h += '</ol>';
    if(p.senses.length > 5) h += '<button class="morebtn" data-more>' + t('more') + ' ' + (p.senses.length - 5) + '</button>';
  });
  h += '</section>';

  /* synonyms & antonyms */
  const nym = (key, cls, title) => {
    let rows = '';
    E.pos.forEach(p => p.senses.forEach(s => { if(s[key].length) rows += '<div class="nrow"><span class="num">' + s.n + '</span><div class="chips">' + s[key].map(x => chip(x, lc, cls)).join('') + '</div></div>'; }));
    if(E[key].length) rows += '<div class="nrow"><span class="num gen">∗</span><div class="chips">' + E[key].slice(0, 30).map(x => chip(x, lc, cls)).join('') + '</div></div>';
    return rows ? '<section class="card ' + cls + '" data-k="nyms"><h2>' + title + '</h2>' + rows + '</section>' : '';
  };
  const nyms = nym('syn', 'syn', t('syn')) + nym('ant', 'ant', t('ant'));
  h += nyms || '<section class="card syn quiet" data-k="nyms"><p class="muted">' + t('noNyms') + '</p></section>';

  /* translations (filled in asynchronously) */
  h += '<section class="card tr" data-k="tr"><h2>' + t('trans') + '</h2><div id="trbox"><span class="spin"></span></div></section>';

  /* related words */
  if(E.rel.length) h += '<details class="card rel" data-k="all"><summary>' + t('rel') + ' (' + E.rel.length + ')</summary><div class="chips">' + E.rel.map(x => chip(x, lc, '')).join('') + '</div></details>';

  /* helpers */
  h += '<section class="card help" data-k="all"><h2>' + t('help') + '</h2>';
  E.pos.forEach(p => { if(p.head && p.head.info) h += '<p><b>' + t('forms') + ' · ' + esc(posName(p.name)) + ':</b> <span lang="' + lc + '">' + esc(p.head.info) + '</span></p>'; });
  if(E.notes.length) h += '<p><b>' + t('notes') + ':</b></p><ul>' + E.notes.map(x => '<li>' + x + '</li>').join('') + '</ul>';
  h += '<p class="muted">' + t('defsIn') + '</p><p><a class="ext" target="_blank" rel="noopener" href="https://en.wiktionary.org/wiki/' + encodeURIComponent(E.word) + '#' + L.wk + '">' + t('wikt') + ' ↗</a></p></section>';

  out.innerHTML = h; out.dataset.focus = focus;
  window.scrollTo(0, 0);
  loadTrans();
}

async function loadTrans(){
  const my = token, E = R.r.entries[R.cur], lc = R.cur, box = $('#trbox');
  const targets = S.langs.filter(c => c !== lc && c !== 'en');
  let pivots = [], word = E.word, wantPos = null;
  if(lc !== 'en'){
    E.pos.forEach(p => p.senses.forEach(s => { const k = s.links[0]; if(k && pivots.length < 6 && !pivots.some(x => x.w === k)) pivots.push({w: k, pos: p.name.replace(/ \d+$/, '')}); }));
    if(!pivots.length){ box.innerHTML = '<p class="muted">' + t('noTrans') + '</p>'; return; }
    const pv = pivots.find(x => x.w === R.pivot) || pivots[0];
    word = pv.w; wantPos = pv.pos; R.pivot = pv.w;
  }
  let groups = [];
  try{ groups = await Core.translations(word, targets); }catch(e){ if(my === token) box.innerHTML = '<p class="muted">' + t('net') + '</p>'; return; }
  if(my !== token || !$('#trbox')) return;
  if(wantPos){ const m = groups.filter(g => g.pos.replace(/ \d+$/, '') === wantPos); if(m.length) groups = m; }
  let h = '';
  if(lc !== 'en') h += '<div class="pivots"><span class="muted">' + t('via') + '</span> ' + pivots.map(p =>
    '<button class="pv' + (p.w === word ? ' on' : '') + '" data-pivot="' + esc(p.w) + '" lang="en">' + esc(p.w) + '</button>').join('') + '</div>';
  if(!groups.length) h += '<p class="muted">' + t('noTrans') + '</p>';
  const grp = (g, extra) => {
    let s = '<div class="tg' + (extra ? ' extra' : '') + '"><h3 lang="en">' + (lc !== 'en' ? '<b>' + esc(word) + '</b> · ' : '') + esc(g.gloss || '') + '</h3>';
    targets.forEach(c => {
      let ts = g.by[c]; if(!ts) return;
      if(c === 'es' && S.es !== 'both') ts = ts.slice().sort((a, b) => (a.r && a.r !== S.es ? 1 : 0) - (b.r && b.r !== S.es ? 1 : 0));
      s += '<div class="trow"><span class="tl">' + esc(Core.BY_C[c].n) + '</span><div class="chips">' + ts.slice(0, 8).map(x => chip(x, c, 'trc')).join('') + '</div></div>';
    });
    return s + '</div>';
  };
  groups.forEach((g, i) => { h += grp(g, i >= 3); });
  if(groups.length > 3) h += '<button class="morebtn" data-more>' + t('otherSenses') + ' (' + (groups.length - 3) + ')</button>';
  box.innerHTML = h;
}

/* listen: recorded audio from Wiktionary when there is one, else the device voice */
function speak(){
  if(!('speechSynthesis' in window)) return;
  const E = R.r.entries[R.cur], u = new SpeechSynthesisUtterance(E.typed || E.word);
  u.lang = R.cur === 'es' && S.es === 'LA' ? 'es-MX' : Core.BY_C[R.cur].sp; u.rate = 0.85;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function listen(){
  const E = R.r.entries[R.cur]; let a = E.audio;
  if(R.cur === 'es' && S.es !== 'both'){ const m = a.filter(x => x.r === S.es); a = m.length ? m : a.filter(x => !x.r); }
  if(!a.length) return speak();
  try{ new Audio(a[0].src).play().catch(speak); }catch(e){ speak(); }
}

/* settings */
function openSettings(){
  const d = $('#set');
  d.innerHTML = '<h2>' + t('settings') + '</h2><h3>' + t('myLangs') + '</h3><div class="lgrid">' +
    Core.LANGS.map(L => '<label><input type="checkbox" data-lang="' + L.c + '"' + (S.langs.includes(L.c) ? ' checked' : '') + '> <span lang="' + L.c + '">' + esc(L.n) + '</span> <small>' + esc(langName(L.c)) + '</small></label>').join('') +
    '</div><h3>' + t('esVar') + '</h3><div class="seg">' + ['both','ES','LA'].map(v => '<button data-es="' + v + '" class="' + (S.es === v ? 'on' : '') + '">' + t(v) + '</button>').join('') +
    '</div><h3>' + t('uiLang') + '</h3><div class="seg">' + ['it','en'].map(v => '<button data-ui="' + v + '" class="' + (S.ui === v ? 'on' : '') + '">' + (v === 'it' ? 'Italiano' : 'English') + '</button>').join('') +
    '</div><button class="linkbtn" data-rewelcome>' + t('reWelcome') + '</button><button class="done" data-close>' + t('close') + '</button>';
  if(d.showModal) d.showModal(); else d.setAttribute('open', '');
}
$('#set').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  if(b.dataset.es){ S.es = b.dataset.es; store.set('es', S.es); openSettingsRefresh(); }
  else if(b.dataset.ui){ S.ui = b.dataset.ui; store.set('ui', S.ui); applyPrefs(); openSettingsRefresh(); }
  else if('close' in b.dataset){ $('#set').close ? $('#set').close() : $('#set').removeAttribute('open'); }
  else if('rewelcome' in b.dataset){ skipReload = true; $('#set').close ? $('#set').close() : $('#set').removeAttribute('open'); welcome(); }
});
function openSettingsRefresh(){ const d = $('#set'); if(d.close && d.open) d.close(); openSettings(); }
$('#set').addEventListener('change', e => {
  const c = e.target.dataset.lang; if(!c) return;
  const on = new Set(S.langs); e.target.checked ? on.add(c) : on.delete(c);
  S.langs = Core.LANGS.map(L => L.c).filter(x => on.has(x));
  if(!S.langs.length) S.langs = ['en'];
  store.set('langs', S.langs);
});
let skipReload = false;
$('#set').addEventListener('close', () => {
  if(skipReload){ skipReload = false; return; }
  if(R) search(R.r.title, R.cur); else if(view === 'favs') favs(); else home();
});

/* events */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-w],[data-tab],[data-focus],[data-act],[data-more],[data-pivot]');
  if(!b || b.closest('#set')) return;
  const d = b.dataset;
  if(d.w !== undefined){ search(d.w, d.l || 'en'); }
  else if(d.tab){ R.cur = d.tab; R.pivot = null; S.last = d.tab; store.set('last', S.last); show(); }
  else if(d.focus){ focus = d.focus; out.dataset.focus = focus; out.querySelectorAll('.focus button').forEach(x => x.classList.toggle('on', x === b)); }
  else if(d.pivot){ R.pivot = d.pivot; $('#trbox').innerHTML = '<span class="spin"></span>'; loadTrans(); }
  else if('more' in d){ b.parentElement.querySelectorAll('.extra').forEach(x => x.classList.remove('extra')); b.remove(); }
  else if(d.act === 'listen') listen();
  else if(d.act === 'save'){
    const w = R.r.title, l = R.cur;
    const E = R.r.entries[l], s0 = E.pos[0] && E.pos[0].senses[0];
    const g = s0 ? s0.html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim().slice(0, 90) : '';
    S.saved = isSaved() ? S.saved.filter(x => !(x.w === w && x.l === l)) : [{w, l, s: E.typed || E.word, tr: E.tr || '', g, at: Date.now()}].concat(S.saved);
    store.set('saved', S.saved);
    b.classList.toggle('on', isSaved()); b.textContent = isSaved() ? '★ ' + t('unsave') : '☆ ' + t('save');
  }
  else if(d.act === 'copy'){
    const E = R.r.entries[R.cur], w = E.typed || E.word;
    const ok = () => { b.textContent = '✓ ' + t('copied'); setTimeout(() => { b.textContent = '⧉ ' + t('copy'); }, 1400); };
    try{ navigator.clipboard.writeText(w).then(ok, () => {}); }catch(err){}
  }
});
$('#form').addEventListener('submit', e => { e.preventDefault(); search(input.value); input.blur(); });
let st = 0;
input.addEventListener('input', () => {
  clearTimeout(st); const v = input.value.trim();
  if(v.length < 2){ sug.hidden = true; return; }
  st = setTimeout(async () => {
    const list = await Core.suggest(v);
    if(input.value.trim() !== v || document.activeElement !== input) return;
    sug.innerHTML = list.map(x => '<button type="button" data-w="' + esc(x) + '" data-l="">' + esc(x) + '</button>').join('');
    sug.hidden = !list.length;
  }, 220);
});
sug.addEventListener('click', e => { const b = e.target.closest('[data-w]'); if(b){ e.stopPropagation(); search(b.dataset.w); } });
input.addEventListener('blur', () => setTimeout(() => { sug.hidden = true; }, 180));
$('#brand').addEventListener('click', e => { e.preventDefault(); if(document.body.classList.contains('welcoming')) return; home(); input.focus(); });
$('#bfav').addEventListener('click', () => { if(!document.body.classList.contains('welcoming')) favs(); });
$('#bsize').addEventListener('click', () => { S.size = (S.size + 1) % 3; store.set('size', S.size); applyPrefs(); });
$('#btheme').addEventListener('click', () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; store.set('theme', S.theme); applyPrefs(); });
$('#bset').addEventListener('click', openSettings);
document.addEventListener('keydown', e => { if(e.key === '/' && document.activeElement !== input && !$('#set').open){ e.preventDefault(); input.focus(); input.select(); } });
window.addEventListener('hashchange', () => {
  const w = decodeURIComponent(location.hash.slice(1));
  if(document.body.classList.contains('welcoming')) return;
  if(!w){ if(view === 'word') home(); return; }
  if(!R || R.r.title !== w) search(w);
});
/* ===== Welcome ===== */
const WELCOME_LANGS = ['it','en','es','zh','ja','fr','si','ca','de','pt','ru','ar','hi','ko'];
function welcome(){
  R = null; token++; view = 'welcome';
  document.body.classList.add('welcoming');
  if(location.hash) history.replaceState(null, '', location.pathname + location.search);
  const step = (n, cls, txt) => '<li><span class="wn ' + cls + '">' + n + '</span><span>' + txt + '</span></li>';
  out.innerHTML = '<section class="welcome">' +
    '<div class="seg wui">' + ['it','en'].map(v => '<button data-wui="' + v + '" class="' + (S.ui === v ? 'on' : '') + '">' + (v === 'it' ? 'Italiano' : 'English') + '</button>').join('') + '</div>' +
    '<div class="wlogo" aria-hidden="true">' + LOGO + '</div>' +
    '<h1>' + t('wTitle') + '</h1><p class="wsub">' + t('wSub') + '</p>' +
    '<ol class="wsteps">' + step(1, 'c-mean', t('w1')) + step(2, 'c-syn', t('w2')) + step(3, 'c-ant', t('w3')) + '</ol>' +
    '<h2>' + t('wLangs') + '</h2><div class="chips wlangs">' +
    WELCOME_LANGS.map(c => '<button class="chip plain wl' + (S.langs.includes(c) ? ' on' : '') + '" data-wl="' + c + '" aria-pressed="' + S.langs.includes(c) + '"><span lang="' + c + '">' + esc(Core.BY_C[c].n) + '</span>' +
      (Core.BY_C[c].n !== langName(c) ? '<span class="cq">' + esc(langName(c)) + '</span>' : '') + '</button>').join('') + '</div>' +
    '<div class="wes"><h2>' + t('esVar') + '</h2><div class="seg">' + ['both','ES','LA'].map(v => '<button data-wes="' + v + '" class="' + (S.es === v ? 'on' : '') + '">' + t(v) + '</button>').join('') + '</div></div>' +
    '<p class="muted small">' + t('wLater') + '</p>' +
    '<button class="done big" data-start>' + t('start') + ' →</button>' +
    '<p class="muted small center">' + t('noAI') + '</p></section>';
  window.scrollTo(0, 0);
}
const LOGO = '<svg viewBox="0 0 120 120" width="88" height="88"><rect x="24" y="28" width="72" height="51" rx="13" fill="var(--pfill)"/><path d="M43 77 L39 96 L60 78 Z" fill="var(--pfill)"/>' +
  '<rect x="35" y="40" width="48" height="6" rx="3" fill="var(--mean)"/><rect x="35" y="51" width="36" height="6" rx="3" fill="var(--syn)"/><rect x="35" y="62" width="43" height="6" rx="3" fill="var(--ant)"/></svg>';

/* ===== Favourite words ===== */
function favs(){
  R = null; token++; view = 'favs'; input.value = '';
  document.body.classList.remove('welcoming');
  if(location.hash) history.replaceState(null, '', location.pathname + location.search);
  const langs = [...new Set(S.saved.map(x => x.l))].filter(c => Core.BY_C[c]);
  if(favFilter !== 'all' && !langs.includes(favFilter)) favFilter = 'all';
  const list = S.saved.filter(x => favFilter === 'all' || x.l === favFilter);
  let h = '<button class="linkbtn" data-nav="home">' + t('back') + '</button>' +
    '<header class="fhead"><h1>★ ' + t('favs') + '</h1><span class="count">' + S.saved.length + '</span></header>';
  if(lastRemoved) h += '<div class="toast">' + t('removed') + ' <button data-undo>' + t('undo') + '</button></div>';
  if(!S.saved.length){ out.innerHTML = h + '<div class="msg">' + t('favsEmpty') + '</div>'; return; }
  if(langs.length > 1) h += '<nav class="tabs ffilt">' + ['all'].concat(langs).map(c =>
    '<button class="tab' + (favFilter === c ? ' on' : '') + '" data-ff="' + c + '">' + (c === 'all' ? t('allL') : esc(Core.BY_C[c].n)) +
    ' <small>' + (c === 'all' ? S.saved.length : S.saved.filter(x => x.l === c).length) + '</small></button>').join('') + '</nav>';
  h += '<ul class="favlist">' + list.map(x => {
    const L = Core.BY_C[x.l];
    return '<li class="fav"><button class="fopen" data-w="' + esc(x.w) + '" data-l="' + esc(x.l || '') + '">' +
      '<span class="fw" lang="' + esc(x.l || '') + '">' + esc(x.s || x.w) + '</span>' +
      (x.tr ? '<span class="ftr">' + esc(x.tr) + '</span>' : '') +
      (x.g ? '<span class="fg">' + esc(x.g) + '</span>' : '') +
      '</button><span class="flang">' + (L ? esc(L.n) : '') + '</span>' +
      '<button class="fx" data-unfav="' + esc(x.w) + '" data-ul="' + esc(x.l || '') + '" aria-label="' + t('remove') + '" title="' + t('remove') + '">✕</button></li>';
  }).join('') + '</ul>';
  h += '<button class="act" data-copyfavs>⧉ ' + t('copyList') + '</button>';
  out.innerHTML = h;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-nav],[data-wl],[data-wes],[data-wui],[data-start],[data-ff],[data-unfav],[data-undo],[data-copyfavs]');
  if(!b || b.closest('#set')) return;
  const d = b.dataset;
  if(d.nav === 'home'){ lastRemoved = null; home(); }
  else if(d.nav === 'favs'){ favs(); }
  else if(d.wl){
    const on = new Set(S.langs); on.has(d.wl) ? on.delete(d.wl) : on.add(d.wl);
    if(!on.size) return;
    S.langs = Core.LANGS.map(L => L.c).filter(x => on.has(x)); store.set('langs', S.langs);
    b.classList.toggle('on', on.has(d.wl)); b.setAttribute('aria-pressed', on.has(d.wl));
  }
  else if(d.wes){ S.es = d.wes; store.set('es', S.es); b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); }
  else if(d.wui){ S.ui = d.wui; store.set('ui', S.ui); applyPrefs(); welcome(); }
  else if('start' in d){ store.set('welcomed', true); home(); input.focus(); }
  else if(d.ff){ favFilter = d.ff; lastRemoved = null; favs(); }
  else if(d.unfav !== undefined){
    const i = S.saved.findIndex(x => x.w === d.unfav && (x.l || '') === d.ul);
    if(i < 0) return;
    lastRemoved = {item: S.saved[i], i};
    S.saved.splice(i, 1); store.set('saved', S.saved); favs();
  }
  else if('undo' in d){
    if(lastRemoved){ S.saved.splice(lastRemoved.i, 0, lastRemoved.item); store.set('saved', S.saved); }
    lastRemoved = null; favs();
  }
  else if('copyfavs' in d){
    const list = S.saved.filter(x => favFilter === 'all' || x.l === favFilter);
    const txt = list.map(x => (x.s || x.w) + (x.tr ? ' (' + x.tr + ')' : '') + (x.g ? ' — ' + x.g : '')).join('\n');
    try{ navigator.clipboard.writeText(txt).then(() => { b.textContent = '✓ ' + t('copied'); setTimeout(() => { b.textContent = '⧉ ' + t('copyList'); }, 1400); }, () => {}); }catch(err){}
  }
});

applyPrefs();
if(!store.get('welcomed', false)) welcome();
else if(location.hash.length > 1) search(decodeURIComponent(location.hash.slice(1)));
else home();

if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
