// Teboo — interacciones del sitio. TX (textos) y P (proyectos) vienen de index.html.

// Menú: fondo sólido al bajar, y menú móvil
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
const onScroll = () => nav.classList.toggle('solid', scrollY > innerHeight * 0.75 || nav.classList.contains('open'));
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const setMenu = open => {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.textContent = open ? burger.dataset.close : burger.dataset.open;
  onScroll();
};
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); } });

// Video de portada: versión ligera en el móvil, ninguno si se pide ahorrar datos o menos movimiento
const video = document.querySelector('.hero video');
const saveData = navigator.connection && navigator.connection.saveData;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (video) {
  const small = matchMedia('(max-width: 700px)').matches;
  if (small) video.poster = video.dataset.posterM;
  if (!saveData && !reduced) {
    video.src = small ? video.dataset.srcM : video.dataset.src;
    video.play().catch(() => {});
  }
}

// Portafolio: mapa (Leaflet) + leyenda que filtra mapa y lista
const rows = [...document.querySelectorAll('.row')];
const COL = { construccion: '#B23A2B', taller: '#4F6B32', diseno: '#C08A2E' };
const active = new Set(Object.keys(COL));
const markers = [];
const mapEl = document.getElementById('map');
if (mapEl && window.L) {
  const map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  const pts = [];
  Object.entries(P).forEach(([id, p]) => {
    const m = L.circleMarker([p.lat, p.lng], { radius: 9, color: '#fff', weight: 2, fillColor: COL[p.cat], fillOpacity: 1 });
    const html = `<div class="pop"><img src="${p.imgs[0]}" alt=""><b>${p.t}</b><span>${p.loc} · ${p.y}</span><span class="pc"><i class="dot ${p.cat}"></i>${TX.cats[p.cat]}</span><button class="link-btn" data-open="${id}">${TX.view} →</button></div>`;
    m.bindPopup(html, { maxWidth: 240, minWidth: 220 });
    m.bindTooltip(p.t, { direction: 'top', offset: [0, -8] });
    m.cat = p.cat; m.addTo(map); markers.push(m); pts.push([p.lat, p.lng]);
  });
  map.fitBounds(pts, { padding: [40, 40] });
  // la rueda del ratón solo hace zoom después de hacer clic en el mapa (para no atrapar el scroll de la página)
  map.on('click focus', () => map.scrollWheelZoom.enable());
  mapEl.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());
  window._teboomap = map;
}
document.querySelectorAll('.legend .lg').forEach(b => b.addEventListener('click', () => {
  const c = b.dataset.cat;
  if (active.has(c) && active.size > 1) active.delete(c); else active.add(c);
  document.querySelectorAll('.legend .lg').forEach(x => { const on = active.has(x.dataset.cat); x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
  markers.forEach(m => { const on = active.has(m.cat); if (on && !window._teboomap.hasLayer(m)) m.addTo(window._teboomap); if (!on) m.remove(); });
  rows.forEach(r => r.hidden = !active.has(r.dataset.g));
}));
rows.forEach(r => { const b = r.querySelector('button'); b.addEventListener('click', () => openP(b.dataset.id, b)); });
document.addEventListener('click', e => { const b = e.target.closest('.link-btn[data-open]'); if (b) openP(b.dataset.open, b); });

// Ficha del proyecto con galería
const modal = document.getElementById('modal'), mb = document.getElementById('mb');
let lastFocus = null;
function openP(id, from) {
  const p = P[id]; if (!p) return;
  lastFocus = from || document.activeElement;
  const imgs = p.imgs || [];
  const thumbs = imgs.length > 1 ? `<div class="m-th">${imgs.map((s, i) => `<button data-i="${i}" aria-label="${i + 1} / ${imgs.length}"${i ? '' : ' class="on" aria-current="true"'}><img src="${s}" alt=""></button>`).join('')}</div>` : '';
  const m = TX.m;
  mb.innerHTML = `<div class="m"><div class="m-img"><img id="mainimg" src="${imgs[0]}" alt="${p.t}">${thumbs}</div><div class="m-b"><h2 id="mtitle">${p.t}</h2><p class="sub">${p.sub}</p>
   <dl><dt>${m.loc}</dt><dd>${p.loc}</dd><dt>${m.area}</dt><dd>${p.area}</dd><dt>${m.y}</dt><dd>${p.y}</dd><dt>${m.st}</dt><dd>${p.st}</dd><dt>${m.mat}</dt><dd>${p.mat}</dd></dl>
   <p>${p.txt}</p></div></div>`;
  mb.querySelectorAll('.m-th button').forEach(b => b.addEventListener('click', () => {
    mb.querySelector('#mainimg').src = imgs[b.dataset.i];
    mb.querySelectorAll('.m-th button').forEach(x => { x.classList.toggle('on', x === b); x.toggleAttribute('aria-current', x === b); });
  }));
  if (!modal.open) modal.showModal();
}
modal.querySelector('.x').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
modal.addEventListener('close', () => lastFocus && lastFocus.focus());

// "Quiero participar" preselecciona el tipo
document.querySelectorAll('[data-tipo]').forEach(a => a.addEventListener('click', () => {
  document.querySelector('select[name=tipo]').value = a.dataset.tipo;
}));

// Formulario → mensaje de WhatsApp ya escrito (sin ventanas emergentes)
const form = document.getElementById('f');
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const name = (d.get('nombre') || '').trim();
  const nameInput = form.elements.nombre, err = document.getElementById('err-nombre');
  const note = document.getElementById('fn');
  if (!name) {
    err.hidden = false; nameInput.setAttribute('aria-invalid', 'true'); nameInput.focus();
    note.textContent = ''; return;
  }
  err.hidden = true; nameInput.removeAttribute('aria-invalid');
  const msg = `${TX.hi} ${name}.\n${TX.want}: ${d.get('tipo')}\n${TX.land}: ${d.get('terreno')}\n` +
    `${TX.where}: ${d.get('ubicacion') || '—'}\n${TX.budget}: ${d.get('presupuesto')}\n\n${d.get('mensaje') || ''}`;
  const url = 'https://wa.me/573204815569?text=' + encodeURIComponent(msg);
  note.innerHTML = `${TX.ready} <a class="btn" href="${url}" target="_blank" rel="noopener">${TX.open}</a><br><small>${TX.orm}</small>`;
  note.querySelector('a').focus();
});
form.elements.nombre.addEventListener('input', () => { if (form.elements.nombre.value.trim()) { document.getElementById('err-nombre').hidden = true; form.elements.nombre.removeAttribute('aria-invalid'); } });

// Galería bento: arrastrar para recorrer, clic para ampliar
const bento = document.querySelector('.bento');
if (bento) {
  if ('IntersectionObserver' in window && !reduced) {
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { bento.classList.add('in'); o.disconnect(); } }), { threshold: .15 }).observe(bento);
  } else bento.classList.add('in');
  let down = false, moved = false, sx = 0, sl = 0;
  bento.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = bento.scrollLeft; });
  addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 5) { moved = true; bento.classList.add('dragging'); }
    bento.scrollLeft = sl - dx;
  });
  addEventListener('pointerup', () => { down = false; setTimeout(() => bento.classList.remove('dragging'), 0); });
  bento.addEventListener('keydown', e => {
    if (e.target !== bento) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); bento.scrollBy({ left: 300, behavior: reduced ? 'auto' : 'smooth' }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); bento.scrollBy({ left: -300, behavior: reduced ? 'auto' : 'smooth' }); }
  });
  const lb = document.getElementById('lb'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption'), lbX = lb.querySelector('.lb-x');
  let lbFrom = null;
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; lbFrom && lbFrom.focus(); };
  bento.querySelectorAll('.b-item').forEach(b => b.addEventListener('click', () => {
    if (moved) return;
    lbFrom = b;
    lbImg.src = b.dataset.src; lbImg.alt = b.dataset.t; lbCap.textContent = `${b.dataset.t} — ${b.dataset.d}`;
    lb.hidden = false; document.body.style.overflow = 'hidden'; lbX.focus();
  }));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-x')) close(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { e.preventDefault(); lbX.focus(); } // el foco se queda en la imagen ampliada
  });
}
