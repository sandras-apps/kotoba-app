/* ===== Core: data from en.wiktionary.org (CC BY-SA). No AI. ===== */
const LANGS = [
  {c:'it', wk:'Italian',   n:'Italiano',  it:'Italiano',   sp:'it-IT'},
  {c:'en', wk:'English',   n:'English',   it:'Inglese',    sp:'en-US'},
  {c:'es', wk:'Spanish',   n:'Español',   it:'Spagnolo',   sp:'es-ES'},
  {c:'zh', wk:'Chinese',   n:'中文',       it:'Cinese',     sp:'zh-CN', tw:'Mandarin'},
  {c:'ja', wk:'Japanese',  n:'日本語',     it:'Giapponese', sp:'ja-JP'},
  {c:'fr', wk:'French',    n:'Français',  it:'Francese',   sp:'fr-FR'},
  {c:'si', wk:'Sinhalese', n:'සිංහල',     it:'Singalese',  sp:'si-LK'},
  {c:'ca', wk:'Catalan',   n:'Català',    it:'Catalano',   sp:'ca-ES'},
  {c:'de', wk:'German',    n:'Deutsch',   it:'Tedesco',    sp:'de-DE'},
  {c:'pt', wk:'Portuguese',n:'Português', it:'Portoghese', sp:'pt-PT'},
  {c:'ru', wk:'Russian',   n:'Русский',   it:'Russo',      sp:'ru-RU'},
  {c:'ar', wk:'Arabic',    n:'العربية',   it:'Arabo',      sp:'ar-SA'},
  {c:'hi', wk:'Hindi',     n:'हिन्दी',      it:'Hindi',      sp:'hi-IN'},
  {c:'ko', wk:'Korean',    n:'한국어',     it:'Coreano',    sp:'ko-KR'}
];
const BY_WK = Object.fromEntries(LANGS.map(l => [l.wk, l]));
const BY_C  = Object.fromEntries(LANGS.map(l => [l.c, l]));
const API = 'https://en.wiktionary.org/w/api.php';
const cache = new Map();

function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function txt(el){
  if(!el) return '';
  const c = el.cloneNode(true);
  c.querySelectorAll('rt,rp').forEach(e => e.remove());
  return c.textContent.replace(/\s+/g,' ').trim();
}
/* Serialise Wiktionary HTML keeping only harmless tags; wiki links become <a data-w>. */
function safe(n, nolink){
  let o = '';
  n.childNodes.forEach(c => {
    if(c.nodeType === 3) o += esc(c.nodeValue);
    else if(c.nodeType === 1){
      const t = c.tagName;
      if(t === 'B' || t === 'STRONG') o += '<b>' + safe(c, nolink) + '</b>';
      else if(t === 'I' || t === 'EM') o += '<i>' + safe(c, nolink) + '</i>';
      else if(t === 'RUBY') o += '<ruby>' + safe(c, nolink) + '</ruby>';
      else if(t === 'RT') o += '<rt>' + safe(c, nolink) + '</rt>';
      else if(t === 'RP') {}
      else if(t === 'BR') o += ' ';
      else if(t === 'A'){
        const h = (c.getAttribute('href') || '').split('#');
        if(!nolink && /^\/wiki\/[^:]+$/.test(h[0]) && !c.classList.contains('new'))
          o += '<a data-w="' + esc(c.getAttribute('title') || c.textContent) + '" data-l="' + esc((BY_WK[(h[1]||'').replace(/_/g,' ')]||{}).c || '') + '">' + safe(c) + '</a>';
        else o += safe(c, nolink);
      } else o += safe(c, nolink);
    }
  });
  return o;
}
function region(s){
  if(!s) return null;
  const es = /\b(Spain|Peninsular|Castilian|Canary Islands|Andalusia)\b/i.test(s);
  const la = /\b(Latin America|Americas|Mexico|Argentina|Colombia|Chile|Peru|Venezuela|Cuba|Caribbean|Central America|South America|Rioplatense|Uruguay|Ecuador|Bolivia|Paraguay|Costa Rica|Guatemala|Honduras|Nicaragua|Panama|Puerto Rico|Dominican Republic|El Salvador|Andes|Southern Cone)\b/i.test(s);
  return es && !la ? 'ES' : la && !es ? 'LA' : null;
}

async function getDoc(title){
  if(cache.has(title)) return cache.get(title);
  const p = (async () => {
    const r = await fetch(API + '?action=parse&prop=text&redirects=1&format=json&formatversion=2&origin=*&page=' + encodeURIComponent(title));
    if(!r.ok) throw new Error('network');
    const j = await r.json();
    if(j.error) return null;
    const d = new DOMParser().parseFromString(j.parse.text, 'text/html');
    d.querySelectorAll('style,script,.mw-editsection,sup.reference,.maintenance-line,figure,.sister-project,.interproject-box,.checktrans,.thumb').forEach(e => e.remove());
    return {title: j.parse.title, root: d.body.firstElementChild};
  })();
  cache.set(title, p);
  p.catch(() => cache.delete(title));
  return p;
}
/* Languages written in their own script: a Latin-letter title there is only a romanisation, so it is not offered. */
const SCRIPT = {zh:/[\u3400-\u9FFF]/, ja:/[\u3040-\u30FF\u3400-\u9FFF]/, si:/[\u0D80-\u0DFF]/, ko:/[\uAC00-\uD7AF]/, ru:/[\u0400-\u04FF]/, ar:/[\u0600-\u06FF]/, hi:/[\u0900-\u097F]/};
/* Suggestions while typing: [{w, langs:[{c, form}]}], only words that exist in one of `codes`.
   form = true when the word is only an inflected form there (plural, conjugation…). */
async function suggest(q, codes){
  let titles;
  try{
    const r = await fetch(API + '?action=opensearch&limit=14&namespace=0&format=json&origin=*&search=' + encodeURIComponent(q));
    titles = (await r.json())[1] || [];
  }catch(e){ return []; }
  if(!titles.length || !codes || !codes.length) return titles.map(w => ({w, langs: []}));
  const cats = codes.flatMap(c => ['Category:' + BY_C[c].wk + ' lemmas', 'Category:' + BY_C[c].wk + ' non-lemma forms']).join('|');
  let pages;
  try{
    const r = await fetch(API + '?action=query&format=json&formatversion=2&origin=*&prop=categories&cllimit=max&clcategories=' + encodeURIComponent(cats) + '&titles=' + encodeURIComponent(titles.join('|')));
    pages = ((await r.json()).query || {}).pages || [];
  }catch(e){ return titles.map(w => ({w, langs: []})); }
  const by = {};
  pages.forEach(p => {
    const m = {};
    (p.categories || []).forEach(x => {
      const k = x.title.match(/^Category:(.+) (lemmas|non-lemma forms)$/); if(!k) return;
      const L = BY_WK[k[1]]; if(!L || (SCRIPT[L.c] && !SCRIPT[L.c].test(p.title))) return;
      m[L.c] = (m[L.c] === false) ? false : k[2] !== 'lemmas';
      if(k[2] === 'lemmas') m[L.c] = false;
    });
    by[p.title] = codes.filter(c => c in m).map(c => ({c, form: m[c]}));
  });
  return titles.map(w => ({w, langs: by[w] || []})).filter(x => x.langs.length).slice(0, 8);
}
function sections(root){
  const m = new Map(); let cur = null;
  for(const c of root.children){
    const h = c.matches('.mw-heading2') ? c.querySelector('h2') : null;
    if(h){ cur = []; m.set(h.textContent.trim(), cur); continue; }
    if(cur) cur.push(c);
  }
  return m;
}
/* Collect terms (word + transliteration + qualifier + gender) from a list item or nyms span. */
function terms(box){
  const out = []; let cur = null, pre = null;
  box.querySelectorAll('[lang],.tr,.qualifier-content,.gender').forEach(e => {
    const lg = e.getAttribute('lang') || '';
    if(e.classList.contains('tr') || /-Latn$/.test(lg)){ if(cur && !cur.tr) cur.tr = txt(e); return; }
    if(e.classList.contains('gender')){ if(cur) cur.g = txt(e); return; }
    if(e.classList.contains('qualifier-content')){
      const br = e.previousElementSibling, pv = br && br.previousSibling;
      if(!cur || (pv && pv.nodeType === 3 && /[,;:]\s*$/.test(pv.nodeValue))) pre = txt(e);
      else { cur.q = txt(e); cur.r = region(cur.q); }
      return;
    }
    const p = e.parentElement.closest('[lang]');
    if(p && p !== box && box.contains(p)) return;
    const a = e.closest('a') || e.querySelector('a');
    if(a && /^Thesaurus:/.test(a.getAttribute('title') || '')) return;
    const t = txt(e); if(!t) return;
    if(cur && cur.hant && !cur.tr && e.classList.contains('Hans')){ cur.alt = cur.t; cur.t = t; cur.hant = false; if(a && !a.classList.contains('new')) cur.w = a.getAttribute('title'); return; }
    cur = {t, w: a && !a.classList.contains('new') && a.getAttribute('title') ? a.getAttribute('title') : t, hant: e.classList.contains('Hant')};
    if(pre){ cur.q = pre; cur.r = region(pre); pre = null; }
    out.push(cur);
  });
  return out;
}
function listTerms(el){
  if(el.matches('.NavFrame,table')) return [];
  const lis = el.tagName === 'UL' ? [...el.children] : [...el.querySelectorAll('li')];
  return lis.flatMap(li => terms(li));
}
function pron(el, E){
  const zp = el.matches('.zhpron') ? el : el.querySelector('.zhpron');
  if(zp){ const py = zp.querySelector('[class*="pinyin"]'); if(py && !E.tr) E.tr = txt(py); }
  const boxes = el.querySelectorAll('li').length ? [...el.querySelectorAll('li')] : [el];
  boxes.forEach(b => {
    const own = x => (x.closest('li') || el) === b;
    const ipa = [...b.querySelectorAll('.IPA')].filter(own).map(txt).filter(x => !/^-/.test(x));
    if(ipa.length && E.pron.length < (zp ? 1 : 6)){
      const lb = [...b.querySelectorAll('.usage-label-accent,.qualifier-content')].filter(own)[0];
      const label = txt(lb);
      E.pron.push({ipa: ipa[0], label, r: region(label)});
    }
  });
  el.querySelectorAll('audio').forEach(a => {
    const s = a.querySelector('source[type="audio/mpeg"]') || a.querySelector('source');
    if(!s) return;
    let src = s.getAttribute('src') || ''; if(src.startsWith('//')) src = 'https:' + src;
    const box = a.closest('li,tr,dd');
    const label = box ? ((txt(box).match(/\(([^)]{2,40})\)/) || [])[1] || '') : '';
    E.audio.push({src, label, r: region(label)});
  });
}
function headInfo(hl){
  const st = hl.querySelector('.headword');
  const tr = hl.querySelector('.headword-tr') || hl.querySelector('.tr');
  const c = hl.cloneNode(true);
  c.querySelectorAll('.headword,.headword-tr').forEach(e => e.remove());
  const info = txt(c).replace(/•\s*\(\s*\)/, '').replace(/^[\s•]+/, '').replace(/\(\s*\)/g, '').trim();
  return {html: st ? safe(st) : '', text: txt(st), tr: txt(tr), info};
}
function example(x){
  const e = x.querySelector('.e-example,.e-quotation'); if(!e) return null;
  return {h: safe(e, true), tr: txt(x.querySelector('.e-transliteration')), t: txt(x.querySelector('.e-translation'))};
}
function zhExample(x){
  if(!/Pinyin\]/.test(x.textContent)) return null;
  const s = x.querySelector('.Hans') || x.querySelector('[lang^="zh"],[lang^="cmn"]'); if(!s) return null;
  const tr = x.querySelector('[lang$="-Latn"],.tr,i.Latn');
  const dd = [...x.querySelectorAll('dd')].pop();
  return {h: safe(s, true), tr: txt(tr), t: dd ? txt(dd) : ''};
}
function senses(ol, P, depth){
  for(const li of ol.children){
    if(li.tagName !== 'LI') continue;
    const c = li.cloneNode(true);
    const S = {html:'', labels:[], syn:[], ant:[], ex:[], links:[], sub: depth > 0, formOf:null, r:null};
    c.querySelectorAll(':scope > ol').forEach(o => o.remove());
    c.querySelectorAll('.nyms').forEach(n => {
      const k = n.classList.contains('synonym') ? 'syn' : n.classList.contains('antonym') ? 'ant' : null;
      if(k) S[k].push(...terms(n));
      n.remove();
    });
    c.querySelectorAll('.h-usage-example').forEach(x => { const e = example(x); if(e && S.ex.length < 4) S.ex.push(e); });
    c.querySelectorAll('.zhusex').forEach(x => { const e = zhExample(x); if(e && S.ex.length < 4) S.ex.push(e); });
    if(!S.ex.length){
      const q = c.querySelector('.h-quotation'); const e = q && example(q);
      if(e && e.h.length < 170 && !/ſ/.test(e.h)) S.ex.push(e);
    }
    c.querySelectorAll('dl,ul').forEach(e => e.remove());
    c.querySelectorAll('.usage-label-sense').forEach(u => {
      u.querySelectorAll('.ib-content').forEach(l => S.labels.push(...txt(l).split(/\s*,\s*/).filter(Boolean)));
      u.remove();
    });
    S.r = region(S.labels.join(', '));
    const fo = c.querySelector('.form-of-definition-link a'); if(fo) S.formOf = fo.getAttribute('title');
    c.querySelectorAll('a[href^="/wiki/"]').forEach(a => {
      const h = a.getAttribute('href').split('#'); const t = a.getAttribute('title');
      if(t && !/:/.test(t) && (!h[1] || h[1] === 'English') && !a.closest('.qualifier-content,.mention-gloss')) S.links.push(t);
    });
    S.html = safe(c).replace(/\s+/g, ' ').trim();
    if(S.html) P.senses.push(S);
    li.querySelectorAll(':scope > ol').forEach(o => senses(o, P, depth + 1));
  }
}
const NOT_POS = /^(Etymology|Pronunciation|References|Further reading|See also|Anagrams|Descendants|Alternative forms|Conjugation|Declension|Inflection|Usage notes|Synonyms|Antonyms|Derived terms|Related terms|Translations|Quotations|Notes|Hyponyms|Hypernyms|Coordinate terms|Compounds|Collocations)/;
function build(els, lc, title){
  const E = {word: title, lc, tr:'', pron:[], audio:[], pos:[], syn:[], ant:[], rel:[], notes:[], tt:[], tsub:null, see:null};
  let h = '', P = null;
  for(const el of els){
    const hd = el.matches('.mw-heading') && el.querySelector('h3,h4,h5,h6');
    if(hd){ h = hd.textContent.trim(); continue; }
    const see = el.matches('table[class*="-see"]') ? el : el.querySelector('table[class*="-see"]');
    if(see && !E.see){ const a = [...see.querySelectorAll('a[href^="/wiki/"]')].find(a => /#(Chinese|Japanese)/.test(a.getAttribute('href')) && a.getAttribute('title') && !title.includes(a.getAttribute('title'))); if(a) E.see = a.getAttribute('title'); }
    if(/^Pronunciation/.test(h)){ pron(el, E); continue; }
    const hl = el.tagName === 'P' && el.querySelector('.headword-line');
    if(hl){ P = {name: h, head: headInfo(hl), senses: []}; E.pos.push(P); continue; }
    if(el.tagName === 'OL' && !NOT_POS.test(h)){
      if(!P || P.name !== h){ P = {name: h, head: null, senses: []}; E.pos.push(P); }
      senses(el, P, 0); continue;
    }
    const tabs = el.matches('table.translations') ? [el] : [...el.querySelectorAll('table.translations')];
    tabs.forEach(t => E.tt.push({gloss: t.getAttribute('data-gloss') || '', pos: /^Translations/.test(h) ? (P ? P.name : '') : h, el: t}));
    if(!tabs.length && /^Translations/.test(h)){
      const a = el.querySelector('a[href*="/translations"]');
      if(a) E.tsub = decodeURIComponent(a.getAttribute('href').replace(/^\/wiki\//, '').split('#')[0]).replace(/_/g, ' ');
    }
    if(/^Synonyms/.test(h)) E.syn.push(...listTerms(el));
    else if(/^Antonyms/.test(h)) E.ant.push(...listTerms(el));
    else if(/^(Derived|Related) terms/.test(h)){ if(E.rel.length < 40) E.rel.push(...listTerms(el).slice(0, 40 - E.rel.length)); }
    else if(/^Usage notes/.test(h)){
      (el.tagName === 'UL' ? [...el.children] : [el]).forEach(x => { const s = safe(x).replace(/\s+/g,' ').trim(); if(s && E.notes.length < 4) E.notes.push(s); });
    }
  }
  E.pos = E.pos.filter(p => p.senses.length);
  const merged = [];
  E.pos.forEach(p => { const k = p.name.replace(/ \d+$/, ''); const m = merged.find(x => x.name === k);
    if(m){ m.senses.push(...p.senses); if(!m.head) m.head = p.head; } else merged.push({...p, name: k}); });
  E.pos = merged;
  const h0 = E.pos.find(p => p.head); if(h0 && !E.tr) E.tr = h0.head.tr;
  return E;
}
/* Look a word up. Returns {title, entries:{code:Entry}, others:[language names]} or null if the page does not exist. */
async function lookup(word, codes, exact){
  const low = word.toLowerCase();
  const order = exact || low === word ? [word] : [low, word];
  let first = null;
  for(const w of order){
    const d = await getDoc(w); if(!d) continue;
    const res = await fromDoc(d);
    if(!first) first = res;
    if(!codes || codes.some(c => res.entries[c])){ if(w !== word) res.asked = word; return res; }
  }
  return first;
}
async function fromDoc(d){
  const secs = sections(d.root), entries = {}, others = [];
  for(const [name, els] of secs){
    const L = BY_WK[name];
    if(!L){ others.push(name); continue; }
    let E = build(els, L.c, d.title);
    if(!E.pos.length && E.see){
      const d2 = await getDoc(E.see); const s2 = d2 && sections(d2.root).get(name);
      if(s2){ E = build(s2, L.c, d2.title); E.typed = d.title; }
    }
    if(E.pos.length) entries[L.c] = E;
  }
  return {title: d.title, entries, others};
}
/* Translations of an English entry into the wanted languages, grouped by sense. */
function readTables(tt, codes){
  const out = [];
  for(const T of tt){
    const by = {};
    T.el.querySelectorAll('li').forEach(li => {
      if(li.parentElement.closest('li')) return;
      const name = (li.firstChild && li.firstChild.nodeType === 3 ? li.firstChild.nodeValue : '').split(':')[0].trim();
      const L = BY_WK[name]; if(!L || !codes.includes(L.c)) return;
      let box = li.cloneNode(true);
      if(L.tw){
        box = [...box.querySelectorAll('dd')].find(d => txt(d).startsWith(L.tw + ':'));
        if(!box) return;
      } else box.querySelectorAll('dl').forEach(d => d.remove());
      const ts = terms(box); if(ts.length) by[L.c] = ts;
    });
    if(Object.keys(by).length) out.push({gloss: T.gloss, pos: T.pos, by});
  }
  return out;
}
async function translations(enWord, codes){
  const d = await getDoc(enWord); if(!d) return [];
  const els = sections(d.root).get('English'); if(!els) return [];
  const E = build(els, 'en', d.title);
  let tt = E.tt;
  if(E.tsub){
    const d2 = await getDoc(E.tsub); const s2 = d2 && sections(d2.root).get('English');
    if(s2) tt = tt.concat(build(s2, 'en', d2.title).tt);
  }
  return readTables(tt, codes);
}
/* ===== Random words (word of the day, surprise) =====
   Picks from Wiktionary categories by starting at a random sort-key prefix. */
const LAT = 'bcdfglmnprstv', VOW = 'aeiou';
const PICK = {
  zh: {cat:'Mandarin terms with usage examples', pre:'人口女心手日月木水火土山言金食馬大小子白目石竹米糸衣車門雨', ok:/^[\u4E00-\u9FFF]{1,3}$/},
  ja: {cat:'Japanese terms with usage examples', pre:'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわ', ok:/^[\u3040-\u30FF\u4E00-\u9FFF]{1,5}$/},
  si: {cat:'Sinhalese lemmas', pre:'අආඉඋඑඔකගචජතදනපබමයරලවසහ', ok:/^[\u0D80-\u0DFF]{2,9}$/},
  ko: {cat:'Korean lemmas', pre:'가나다라마바사아자차카타파하', ok:/^[\uAC00-\uD7AF]{1,4}$/},
  ru: {cat:'Russian terms with usage examples', pre:'абвгдежзиклмнопрстуфхчш', ok:/^[а-яё]{3,12}$/},
  ar: {cat:'Arabic lemmas', pre:'ابتجحدرسشصعفقكلمنهو', ok:/^[\u0600-\u06FF]{2,8}$/},
  hi: {cat:'Hindi terms with usage examples', pre:'अआइउएओकखगचजतदधनपबभमयरलवशसह', ok:/^[\u0900-\u097F]{2,10}$/},
  de: {ok:/^[A-Za-zÄÖÜäöüß]{3,14}$/}
};
async function randomWord(code, rnd){
  const L = BY_C[code], P = PICK[code] || {};
  const cat = P.cat || (L.wk + ' terms with usage examples');
  const ok = P.ok || /^[a-zà-öø-ÿœç]{3,13}$/;
  for(let tries = 0; tries < 4; tries++){
    const pre = P.pre ? P.pre[Math.floor(rnd() * P.pre.length)] : LAT[Math.floor(rnd() * LAT.length)] + VOW[Math.floor(rnd() * VOW.length)];
    let list = [];
    try{
      const r = await fetch(API + '?action=query&format=json&formatversion=2&origin=*&list=categorymembers&cmtype=page&cmnamespace=0&cmlimit=40&cmtitle=' +
        encodeURIComponent('Category:' + cat) + '&cmstartsortkeyprefix=' + encodeURIComponent(pre));
      list = (((await r.json()).query || {}).categorymembers || []).map(m => m.title).filter(w => ok.test(w));
    }catch(e){ return null; }
    if(!list.length) continue;
    const w = list[Math.floor(rnd() * list.length)];
    const res = await lookup(w, [code], true);
    const E = res && res.entries[code];
    const s0 = E && E.pos[0] && E.pos[0].senses[0];
    if(s0 && !s0.formOf && !/\b(plural|form|inflection|participle|feminine) of\b/i.test(s0.html)) return {w: res.title, E};
  }
  return null;
}
const Core = {LANGS, BY_C, BY_WK, lookup, translations, suggest, randomWord, esc, region};
