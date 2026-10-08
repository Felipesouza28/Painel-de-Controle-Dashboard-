function getCurrentUser() {
  return AccountStore.getActiveAccount();
}

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'CG';
}

function hydrateDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  const userName = document.getElementById('userName');
  const companyName = document.getElementById('companyName');
  const dashboardCompanyName = document.getElementById('dashboardCompanyName');
  const companyAvatar = document.getElementById('companyAvatar');
  const userAvatar = document.getElementById('userAvatar');
  const companyDocument = document.getElementById('companyDocument');
  const companyPhone = document.getElementById('companyPhone');
  const userEmail = document.getElementById('userEmail');

  if (userName) userName.textContent = (user.name || user.company || 'Sua empresa').split(' ')[0];
  if (companyName) companyName.textContent = user.company;
  if (dashboardCompanyName) dashboardCompanyName.textContent = user.company;
  if (companyAvatar) companyAvatar.textContent = initials(user.company);
  if (userAvatar) userAvatar.textContent = initials(user.name);
  if (companyDocument) companyDocument.textContent = user.cnpj || 'CNPJ não informado';
  if (companyPhone) companyPhone.textContent = user.phone || 'Telefone não informado';
  if (userEmail) userEmail.textContent = user.email || 'E-mail não informado';

  document.title = `${user.company || 'ClimaGestão'} — Dashboard`;
  document.body.dataset.account = user.email || '';
  document.body.dataset.accountType = AccountStore.isDemo() ? 'demo' : 'account';

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const heading = document.querySelector('#dashboard h1');
  if (heading) heading.firstChild.textContent = `${greeting}, `;
  const date = document.getElementById('dashboardDate');
  if (date) date.textContent = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);

  if (!AccountStore.isDemo()) showEmptyAccountDashboard();
}

function addEmptyState(parent, title, description) {
  if (!parent) return;
  const empty = document.createElement('div');
  empty.className = 'account-empty';
  const heading = document.createElement('strong');
  const message = document.createElement('span');
  heading.textContent = title;
  message.textContent = description;
  empty.append(heading, message);
  parent.append(empty);
}

function showEmptyAccountDashboard() {
  const dashboardStats = document.querySelectorAll('#dashboard > .cards .stat');
  const statValues = ['R$ 0,00', '0', '0', 'R$ 0,00'];
  const statNotes = ['Sem movimentações registradas', 'Nenhum serviço agendado', 'Nenhuma ordem em andamento', 'Nenhuma cobrança pendente'];
  dashboardStats.forEach((stat, index) => {
    const value = stat.querySelector('strong');
    const note = stat.querySelector('small');
    if (value) value.textContent = statValues[index];
    if (note) note.textContent = statNotes[index];
  });

  const serviceList = document.querySelector('#dashboard .service-list');
  if (serviceList) {
    serviceList.hidden = true;
    addEmptyState(serviceList.parentElement, 'Agenda vazia', 'Os atendimentos da sua empresa aparecerão aqui quando forem agendados.');
  }
  const alertsCard = document.querySelector('#dashboard .alerts');
  if (alertsCard) {
    alertsCard.querySelectorAll('.alert').forEach((alert) => { alert.hidden = true; });
    addEmptyState(alertsCard, 'Nenhuma pendência', 'As tarefas que precisarem da sua atenção aparecerão aqui.');
  }
  const chart = document.querySelector('#dashboard .chart-wrap');
  if (chart) {
    chart.hidden = true;
    addEmptyState(chart.parentElement, 'Sem dados financeiros', 'O gráfico será preenchido conforme sua empresa registrar movimentações.');
  }
  const kpiBanner = document.querySelector('#dashboard .kpi-banner');
  if (kpiBanner) kpiBanner.hidden = true;

  const orderCount = document.querySelector('#sidebar [data-page="os"] em');
  if (orderCount) { orderCount.textContent = '0'; orderCount.hidden = true; }

  const equipment = document.getElementById('equipamentos');
  const equipmentStats = equipment?.querySelector('.cards');
  const equipmentTable = equipment?.querySelector('.table-card');
  if (equipmentStats) equipmentStats.hidden = true;
  if (equipmentTable) equipmentTable.hidden = true;
  addEmptyState(equipment, 'Nenhum equipamento cadastrado', 'Os equipamentos da sua empresa aparecerão aqui quando forem adicionados.');

  const orders = document.getElementById('os');
  const orderBoard = orders?.querySelector('.kanban');
  if (orderBoard) orderBoard.hidden = true;
  addEmptyState(orders, 'Nenhuma ordem de serviço', 'As ordens da sua empresa aparecerão aqui quando forem cadastradas.');

  const finance = document.getElementById('financeiro');
  finance?.querySelectorAll('.cards, .table-card').forEach((element) => { element.hidden = true; });
  addEmptyState(finance, 'Nenhuma movimentação financeira', 'Receitas, despesas e valores a receber aparecerão aqui conforme forem registrados.');
}

function setupLogout() {
  document.getElementById('logoutButton')?.addEventListener('click', () => {
    AccountStore.logout();
    window.location.replace('index.html');
  });
}

hydrateDashboard();
setupLogout();
