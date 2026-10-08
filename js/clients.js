(() => {
  const store = window.AccountStore;
  const body = document.getElementById('clientsTableBody');
  const emptyState = document.getElementById('clientsEmpty');
  const table = document.getElementById('clientsTable');
  const search = document.getElementById('clientSearch');
  const modal = document.getElementById('clientModal');
  const form = document.getElementById('clientForm');
  const message = document.getElementById('clientFormMessage');
  const saveButton = document.getElementById('saveClientButton');
  const cancelButton = document.getElementById('cancelClientModal');
  const inputs = [...form.querySelectorAll('input, textarea')];
  let editingId = null;
  let viewingOnly = false;

  const field = (id) => document.getElementById(id);
  const digits = (value) => value.replace(/\D/g, '');
  const safeText = (value) => value || '—';
  const normalize = (value) => (value || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'CL';
  }

  function render() {
    const clients = store.getClients();
    const query = normalize(search.value.trim());
    const shownClients = clients.filter((client) => normalize([client.name, client.document, client.phone, client.email, client.address].join(' ')).includes(query));
    body.replaceChildren();

    shownClients.forEach((client) => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const name = document.createElement('b');
      const email = document.createElement('small');
      name.textContent = client.name;
      email.textContent = client.email || 'Sem e-mail informado';
      nameCell.append(name, email);
      row.append(nameCell);
      [client.document, client.phone, client.address].forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = safeText(value);
        row.append(cell);
      });

      const actions = document.createElement('td');
      actions.className = 'client-actions';
      [
        ['view', 'Ver'],
        ['edit', 'Editar'],
        ['delete', 'Excluir'],
      ].forEach(([action, label]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `client-action client-action-${action}`;
        button.dataset.action = action;
        button.dataset.clientId = client.id;
        button.textContent = label;
        button.setAttribute('aria-label', `${label} ${client.name}`);
        actions.append(button);
      });
      row.append(actions);
      body.append(row);
    });

    const noClients = clients.length === 0;
    const noMatches = clients.length > 0 && shownClients.length === 0;
    table.hidden = shownClients.length === 0;
    emptyState.hidden = shownClients.length > 0;
    field('clientsEmptyTitle').textContent = noMatches ? 'Nenhum cliente encontrado' : 'Sua lista de clientes começa aqui';
    field('clientsEmptyText').textContent = noMatches
      ? 'Tente buscar por outro nome, documento, telefone ou e-mail.'
      : 'Cadastre seu primeiro cliente para manter contatos e informações importantes organizados.';
    field('emptyNewClientButton').hidden = !noClients;

    const count = document.getElementById('dashboardClientCount');
    if (count) count.textContent = clients.length;
    const countLabel = document.getElementById('dashboardClientCountLabel');
    if (countLabel) countLabel.textContent = clients.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados';
    const recent = document.getElementById('dashboardRecentClients');
    if (recent) {
      recent.replaceChildren();
      clients.slice(-4).reverse().forEach((client) => {
        const row = document.createElement('div');
        row.className = 'person-row';
        const avatar = document.createElement('span');
        avatar.className = 'person-avatar';
        avatar.textContent = initials(client.name);
        const details = document.createElement('p');
        const clientName = document.createElement('b');
        const clientEmail = document.createElement('small');
        clientName.textContent = client.name;
        clientEmail.textContent = client.email || client.phone || 'Cliente cadastrado';
        details.append(clientName, clientEmail);
        row.append(avatar, details);
        recent.append(row);
      });
      if (!clients.length) {
        const empty = document.createElement('p');
        empty.className = 'dashboard-client-empty';
        empty.textContent = 'Seus clientes cadastrados aparecerão aqui.';
        recent.append(empty);
      }
    }
  }

  function setMessage(text = '') {
    message.textContent = text;
  }

  function openModal(mode, client = null) {
    editingId = client?.id || null;
    viewingOnly = mode === 'view';
    form.reset();
    setMessage();
    field('clientModalTitle').textContent = mode === 'new' ? 'Novo cliente' : mode === 'edit' ? 'Editar cliente' : 'Dados do cliente';
    field('clientModalDescription').textContent = mode === 'new'
      ? 'Informe os dados para adicionar à sua carteira.'
      : mode === 'edit' ? 'Atualize as informações deste cliente.' : 'Informações registradas para este cliente.';

    if (client) {
      field('clientName').value = client.name || '';
      field('clientDocument').value = client.document || '';
      field('clientPhone').value = client.phone || '';
      field('clientEmail').value = client.email || '';
      field('clientAddress').value = client.address || '';
      field('clientNotes').value = client.notes || '';
    }

    inputs.forEach((input) => { input.disabled = viewingOnly; });
    saveButton.hidden = viewingOnly;
    cancelButton.textContent = viewingOnly ? 'Fechar' : 'Cancelar';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (!viewingOnly) field('clientName').focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    form.reset();
    setMessage();
    editingId = null;
  }

  function formatDocument(value) {
    const valueDigits = digits(value).slice(0, 14);
    if (valueDigits.length <= 11) {
      return valueDigits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return valueDigits.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4').replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
  }

  function formatPhone(value) {
    const valueDigits = digits(value).slice(0, 11);
    if (valueDigits.length <= 2) return valueDigits ? `(${valueDigits}` : '';
    const area = valueDigits.slice(0, 2);
    const number = valueDigits.slice(2);
    const split = valueDigits.length > 10 ? 5 : 4;
    return `(${area}) ${number.length > split ? `${number.slice(0, split)}-${number.slice(split)}` : number}`;
  }

  document.getElementById('newClientButton').addEventListener('click', () => openModal('new'));
  document.getElementById('emptyNewClientButton').addEventListener('click', () => openModal('new'));
  search.addEventListener('input', render);
  cancelButton.addEventListener('click', closeModal);
  document.getElementById('closeClientModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  field('clientDocument').addEventListener('input', (event) => { event.target.value = formatDocument(event.target.value); });
  field('clientPhone').addEventListener('input', (event) => { event.target.value = formatPhone(event.target.value); });

  body.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const client = store.getClients().find((item) => item.id === button.dataset.clientId);
    if (!client) return;
    if (button.dataset.action === 'view') openModal('view', client);
    if (button.dataset.action === 'edit') openModal('edit', client);
    if (button.dataset.action === 'delete' && window.confirm(`Excluir o cliente “${client.name}”? Esta ação não pode ser desfeita.`)) {
      store.saveClients(store.getClients().filter((item) => item.id !== client.id));
      render();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (viewingOnly) return;
    const name = field('clientName').value.trim();
    const documentNumber = field('clientDocument').value.trim();
    const email = field('clientEmail').value.trim();
    const documentDigits = digits(documentNumber);
    if (!name) { setMessage('Informe o nome completo ou a razão social.'); field('clientName').focus(); return; }
    if (documentNumber && ![11, 14].includes(documentDigits.length)) { setMessage('CPF deve ter 11 dígitos e CNPJ deve ter 14 dígitos.'); field('clientDocument').focus(); return; }
    if (email && field('clientEmail').validity.typeMismatch) { setMessage('Informe um e-mail válido.'); field('clientEmail').focus(); return; }

    const client = {
      id: editingId || (window.crypto?.randomUUID ? window.crypto.randomUUID() : `client-${Date.now()}-${Math.random().toString(16).slice(2)}`),
      name,
      document: documentNumber,
      phone: field('clientPhone').value.trim(),
      email,
      address: field('clientAddress').value.trim(),
      notes: field('clientNotes').value.trim(),
    };
    const clients = store.getClients();
    const updated = editingId ? clients.map((item) => item.id === editingId ? client : item) : [...clients, client];
    store.saveClients(updated);
    closeModal();
    render();
  });

  render();
})();
