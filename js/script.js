const pages = [...document.querySelectorAll('.page')];
const navItems = [...document.querySelectorAll('[data-page]')];
const breadcrumb = document.getElementById('crumb');
const sidebar = document.getElementById('sidebar');
const menuButton = document.getElementById('menu');

const pageNames = {
  dashboard: 'Visão geral',
  clientes: 'Clientes',
  equipamentos: 'Equipamentos',
  os: 'Ordens de serviço',
  agenda: 'Agenda',
  financeiro: 'Financeiro',
};

function goToPage(page) {
  pages.forEach((currentPage) => {
    currentPage.classList.toggle('active-page', currentPage.id === page);
  });

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  breadcrumb.textContent = pageNames[page] || 'Visão geral';
  sidebar.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();

    if (item.dataset.page) {
      goToPage(item.dataset.page);
    }
  });
});

if (menuButton) {
  menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

const modal = document.getElementById('modal');
const closeButton = document.getElementById('close');
const orderForm = document.getElementById('osForm');
const newOrderButtons = document.querySelectorAll('#newOs, #newOs2, #newOs3');

function openOrderModal() {
  modal.classList.add('open');
}

function closeOrderModal() {
  modal.classList.remove('open');
}

newOrderButtons.forEach((button) => {
  button?.addEventListener('click', openOrderModal);
});

closeButton?.addEventListener('click', closeOrderModal);

modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeOrderModal();
  }
});

orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  closeOrderModal();
  alert('Ordem de serviço criada com sucesso.');
  orderForm.reset();
});

function renderCalendar() {
  const calendarDays = document.getElementById('calendarDays');

  if (!calendarDays) {
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const title = document.getElementById('calendarTitle');
  if (title) title.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(now);

  const events = window.AccountStore?.isDemo() ? {
    2: 'Instalação',
    6: 'Manutenção',
    14: 'Higienização',
    20: 'Reparo',
  } : {};

  calendarDays.innerHTML = '';

  for (let index = 0; index < firstDay; index += 1) {
    calendarDays.appendChild(document.createElement('div'));
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const dayElement = document.createElement('div');
    const dayNumber = document.createElement('span');

    dayNumber.className = 'daynum';
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);

    if (day === now.getDate()) {
      dayElement.classList.add('today');
    }

    if (events[day]) {
      const eventElement = document.createElement('div');
      eventElement.className = 'event-mini';
      eventElement.textContent = events[day];
      dayElement.appendChild(eventElement);
    }

    calendarDays.appendChild(dayElement);
  }
}

renderCalendar();
