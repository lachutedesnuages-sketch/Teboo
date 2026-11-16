// Menú: fondo sólido al bajar, y menú móvil
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
const onScroll = () => nav.classList.toggle('solid', scrollY > innerHeight * 0.8 || nav.classList.contains('open'));
addEventListener('scroll', onScroll, { passive: true }); onScroll();
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.textContent = open ? 'Cerrar' : 'Menú';
  onScroll();
});
nav.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.textContent = 'Menú'; onScroll(); }));

// Si el usuario prefiere menos movimiento, el video queda en pausa
if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelector('.hero video').pause();

// Filtros del portafolio
const rows = [...document.querySelectorAll('.row')];
function filter(f) {
  document.querySelectorAll('.filters button').forEach(b => b.classList.toggle('on', b.dataset.f === f));
  rows.forEach(r => r.hidden = !(f === 'all' || r.dataset.g === f));
}
document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => filter(b.dataset.f)));
document.querySelectorAll('[data-filter]').forEach(a => a.addEventListener('click', () => filter(a.dataset.filter)));

// Vista previa de la foto al pasar el ratón sobre un proyecto
const peek = document.querySelector('.peek');
const index = document.querySelector('.index');
rows.forEach(r => {
  const b = r.querySelector('button');
  b.addEventListener('mouseenter', () => { if (b.dataset.img) { peek.src = b.dataset.img; peek.hidden = false; } });
  b.addEventListener('mouseleave', () => peek.hidden = true);
  b.addEventListener('mousemove', e => { const r0 = index.getBoundingClientRect(); peek.style.top = (e.clientY - r0.top - 110) + 'px'; });
});

// Ficha técnica del proyecto
const modal = document.getElementById('modal'), mb = document.getElementById('mb');
function openP(id) {
  const p = P[id]; if (!p) return;
  const imgs = p.imgs || [];
  const thumbs = imgs.length > 1 ? `<div class="m-th">${imgs.map((s, i) => `<button data-i="${i}"${i ? '' : ' class="on"'}><img src="${s}" alt=""></button>`).join('')}</div>` : '';
  mb.innerHTML = `<div class="m"><div class="m-img"><img id="mainimg" src="${imgs[0]}" alt="${p.t}">${thumbs}</div><div class="m-b"><h2>${p.t}</h2><p class="sub">${p.sub}</p>
   <dl><dt>Lugar</dt><dd>${p.loc}</dd><dt>Área</dt><dd>${p.area}</dd><dt>Año</dt><dd>${p.y}</dd><dt>Estado</dt><dd>${p.st}</dd><dt>Materiales</dt><dd>${p.mat}</dd></dl>
   <p>${p.txt}</p></div></div>`;
  mb.querySelectorAll('.m-th button').forEach(b => b.addEventListener('click', () => {
    mb.querySelector('#mainimg').src = imgs[b.dataset.i];
    mb.querySelectorAll('.m-th button').forEach(x => x.classList.toggle('on', x === b));
  }));
  modal.showModal();
}
rows.forEach(r => r.querySelector('button').addEventListener('click', e => openP(e.currentTarget.dataset.id)));
modal.querySelector('.x').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

// "Quiero participar" preselecciona el tipo
document.querySelectorAll('[data-tipo]').forEach(a => a.addEventListener('click', () => {
  document.querySelector('select[name=tipo]').value = a.dataset.tipo;
}));

// Formulario → mensaje de WhatsApp ya escrito
document.getElementById('f').addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.target);
  const msg = `Hola Teboo, soy ${d.get('nombre')}.\nQuiero construir: ${d.get('tipo')}\nTerreno: ${d.get('terreno')}\n` +
    `Lugar: ${d.get('ubicacion') || '—'}\nPresupuesto: ${d.get('presupuesto')}\n\n${d.get('mensaje') || ''}`;
  const url = 'https://wa.me/573204815569?text=' + encodeURIComponent(msg);
  const note = document.getElementById('fn');
  note.hidden = false;
  note.innerHTML = `Tu mensaje está listo: <a href="${url}" target="_blank" rel="noopener">abrir WhatsApp para enviarlo →</a>`;
  window.open(url, '_blank');
});

// Galería bento: arrastrar para recorrer, clic para ampliar
const bento = document.querySelector('.bento');
if (bento) {
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { bento.classList.add('in'); o.disconnect(); } }), { threshold: .2 }).observe(bento);
  let down = false, moved = false, sx = 0, sl = 0;
  bento.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = bento.scrollLeft; });
  addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 5) { moved = true; bento.classList.add('dragging'); }
    bento.scrollLeft = sl - dx;
  });
  addEventListener('pointerup', () => { down = false; setTimeout(() => bento.classList.remove('dragging'), 0); });
  bento.addEventListener('keydown', e => { if (e.key === 'ArrowRight') bento.scrollBy({ left: 300, behavior: 'smooth' }); if (e.key === 'ArrowLeft') bento.scrollBy({ left: -300, behavior: 'smooth' }); });
  const lb = document.getElementById('lb'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption');
  const close = () => { lb.hidden = true; };
  bento.querySelectorAll('.b-item').forEach(b => b.addEventListener('click', () => {
    if (moved) return;
    lbImg.src = b.dataset.src; lbImg.alt = b.dataset.t; lbCap.textContent = `${b.dataset.t} — ${b.dataset.d}`;
    lb.hidden = false; lb.querySelector('.lb-x').focus();
  }));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-x')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
}
