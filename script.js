const pages = [...document.querySelectorAll('.page')], nav = [...document.querySelectorAll('[data-page]')], crumb = document.getElementById('crumb');

const names = { dashboard: 'Visão geral', clientes: 'Clientes', equipamentos: 'Equipamentos', os: 'Ordens de serviço', agenda: 'Agenda', financeiro: 'Financeiro' };

function go(page) { pages.forEach(p => p.classList.toggle('active-page', p.id === page)); nav.forEach(n => n.classList.toggle('active', n.dataset.page === page)); crumb.textContent = names[page] || 'Visão geral'; document.getElementById('sidebar').classList.remove('open'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

nav.forEach(n => n.addEventListener('click', e => { e.preventDefault(); if (n.dataset.page) go(n.dataset.page) })); document.querySelectorAll('[data-page]').forEach(n => n.addEventListener('click', () => go(n.dataset.page)));
const sidebar = document.getElementById('sidebar'); document.getElementById('menu').onclick = () => sidebar.classList.toggle('open');

const modal = document.getElementById('modal'); const open = () => modal.classList.add('open'); document.querySelectorAll('#newOs,#newOs2,#newOs3').forEach(b => b && b.addEventListener('click', open)); document.getElementById('close').onclick = () => modal.classList.remove('open'); modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open') }); document.getElementById('osForm').addEventListener('submit', e => { e.preventDefault(); modal.classList.remove('open'); alert('Ordem de serviço criada com sucesso.'); e.target.reset() });

const days = document.getElementById('calendarDays'); if (days) { let start = new Date(2026, 9, 1).getDay(), total = 31; for (let i = 0; i < start; i++)days.appendChild(document.createElement('div')); for (let d = 1; d <= total; d++) { let el = document.createElement('div'); el.innerHTML = '<span class="daynum">' + d + '</span>'; if (d === 6) el.classList.add('today'); if ([2, 6, 14, 20].includes(d)) el.innerHTML += '<div class="event-mini">' + ({ 2: 'Instalação', 6: 'Manutenção', 14: 'Higienização', 20: 'Reparo' }[d]) + '</div>'; days.appendChild(el) } }
