// Menú móvil
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Filtros del portafolio
const cards = [...document.querySelectorAll('.card')];
const empty = document.querySelector('.empty');
document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.filters button').forEach(x => x.classList.toggle('on', x === b));
  const f = b.dataset.f;
  let n = 0;
  cards.forEach(c => { const show = f === 'all' || c.dataset.cat === f; c.hidden = !show; if (show) n++; });
  empty.hidden = n > 0;
}));

// Ficha técnica (modal)
const modal = document.getElementById('modal');
const mb = document.getElementById('mb');
function openP(id) {
  const p = P[id]; if (!p) return;
  const media = p.img
    ? `<div class="media"><img src="${p.img}" alt="${p.t}"></div>`
    : `<div class="media ph"><span>Foto · ${p.t}</span></div>`;
  mb.innerHTML = `<div class="m">${media}<div class="m-b"><span class="tag">${p.tag}</span><h2>${p.t}</h2>
    <p class="sub">${p.sub}</p><dl><dt>Ubicación</dt><dd>${p.loc}</dd><dt>Área</dt><dd>${p.area}</dd>
    <dt>Fecha</dt><dd>${p.fecha}</dd><dt>Materiales</dt><dd>${p.mat}</dd></dl><p>${p.txt}</p></div></div>`;
  modal.showModal();
}
cards.forEach(c => {
  c.addEventListener('click', () => openP(c.dataset.id));
  c.addEventListener('keydown', e => { if (e.key === 'Enter') openP(c.dataset.id); });
});
document.querySelectorAll('[data-open]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openP(a.dataset.open); }));
modal.querySelector('.x').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

// Render vs realidad
const cmp = document.querySelector('.cmp');
cmp.querySelector('input').addEventListener('input', e => cmp.style.setProperty('--p', e.target.value + '%'));

// Pre-seleccionar "Taller" desde la sección El Taller
document.querySelectorAll('[data-tipo]').forEach(a => a.addEventListener('click', () => {
  document.querySelector('select[name=tipo]').value = a.dataset.tipo;
}));

// Formulario → WhatsApp
document.getElementById('f').addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.target);
  const msg = `Hola Teboo, soy ${d.get('nombre')}.\n` +
    `Tipo de obra: ${d.get('tipo')}\nTerreno: ${d.get('terreno')}\n` +
    `Ubicación: ${d.get('ubicacion') || '—'}\nPresupuesto: ${d.get('presupuesto')}\n\n${d.get('mensaje') || ''}`;
  const url = 'https://wa.me/573204815569?text=' + encodeURIComponent(msg);
  const note = document.getElementById('fn');
  note.hidden = false;
  note.innerHTML = `Abra WhatsApp para enviar su mensaje: <a href="${url}" target="_blank" rel="noopener">continuar en WhatsApp →</a>`;
  window.open(url, '_blank');
});

// Aparición suave al hacer scroll
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .12 });
document.querySelectorAll('.sec-h, .pillar, .feed-i, .card, .srv article, .lab, .person, .ws, .compare, form').forEach(el => { el.classList.add('rv'); io.observe(el); });
