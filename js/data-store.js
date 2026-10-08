(() => {
  const USER_KEY = 'climaGestaoUser';
  const SESSION_KEY = 'climaGestaoSession';
  const DEMO_KEY = 'climaGestaoDemoAccount';

  const demoDefaults = {
    name: 'Anderson Costa',
    company: 'Ar Clima Serviços',
    cnpj: '12.345.678/0001-90',
    phone: '(61) 99999-1001',
    email: 'demo@climagemestao.com.br',
    clients: [
      { id: 'demo-1', name: 'João da Silva', document: '123.456.789-00', phone: '(61) 99999-1001', email: 'joao@email.com', address: 'Asa Sul, Brasília - DF', notes: '' },
      { id: 'demo-2', name: 'Mariana Costa', document: '987.654.321-00', phone: '(61) 98888-2233', email: 'mariana@email.com', address: 'Lago Sul, Brasília - DF', notes: '' },
      { id: 'demo-3', name: 'Clínica Saúde+', document: '12.345.678/0001-90', phone: '(61) 97777-3344', email: 'financeiro@saude.com', address: 'Asa Norte, Brasília - DF', notes: 'Cliente empresarial' },
      { id: 'demo-4', name: 'Ricardo Mendes', document: '456.789.123-00', phone: '(61) 96666-5512', email: 'ricardo@email.com', address: 'Taguatinga, Brasília - DF', notes: '' },
    ],
  };

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }

  function getRegisteredAccount() {
    const account = read(USER_KEY);
    if (!account || typeof account !== 'object') return null;
    if (!Array.isArray(account.clients)) account.clients = [];
    return account;
  }

  function getDemoAccount() {
    let account = read(DEMO_KEY);
    if (!account || typeof account !== 'object') {
      account = { ...demoDefaults, clients: demoDefaults.clients.map((client) => ({ ...client })) };
      localStorage.setItem(DEMO_KEY, JSON.stringify(account));
    }
    if (!Array.isArray(account.clients)) account.clients = [];
    return account;
  }

  function isDemo() {
    return localStorage.getItem(SESSION_KEY) === 'demo';
  }

  function getActiveAccount() {
    return isDemo() ? getDemoAccount() : getRegisteredAccount();
  }

  function saveActiveAccount(account) {
    const key = isDemo() ? DEMO_KEY : USER_KEY;
    localStorage.setItem(key, JSON.stringify(account));
  }

  window.AccountStore = {
    getRegisteredAccount,
    getActiveAccount,
    getClients() { return getActiveAccount()?.clients || []; },
    saveClients(clients) {
      const account = getActiveAccount();
      if (!account) return;
      account.clients = clients;
      saveActiveAccount(account);
    },
    saveRegisteredAccount(account) {
      if (!Array.isArray(account.clients)) account.clients = [];
      localStorage.setItem(USER_KEY, JSON.stringify(account));
    },
    startSession(type = 'account') { localStorage.setItem(SESSION_KEY, type === 'demo' ? 'demo' : 'authenticated'); },
    hasSession() { return ['demo', 'authenticated'].includes(localStorage.getItem(SESSION_KEY)); },
    isDemo,
    logout() { localStorage.removeItem(SESSION_KEY); },
  };
})();
