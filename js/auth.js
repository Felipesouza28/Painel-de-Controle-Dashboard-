function getUser() {
  return AccountStore.getRegisteredAccount();
}

function saveUser(user) {
  AccountStore.saveRegisteredAccount(user);
}

function showMessage(element, message, type = '') {
  if (!element) return;
  element.textContent = message;
  element.className = `form-message ${type}`.trim();
}

function onlyDigits(value) {
  return value.replace(/\D/g, '');
}

function formatCnpj(value) {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
}

function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

function goToLogin() {
  window.location.href = 'index.html';
}

function setupPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      button.textContent = showing ? 'Mostrar' : 'Ocultar';
    });
  });
}

function setupLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  if (AccountStore.hasSession()) {
    // A sessão anterior existe, mas deixamos o usuário decidir se quer entrar novamente.
  }

  const email = document.getElementById('loginEmail');
  const password = document.getElementById('loginPassword');
  const message = document.getElementById('loginMessage');
  const demoButton = document.getElementById('demoLogin');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = getUser();

    if (!user) {
      showMessage(message, 'Nenhuma conta encontrada. Crie sua conta para continuar.');
      return;
    }

    if (email.value.trim().toLowerCase() !== user.email.toLowerCase() || password.value !== user.password) {
      showMessage(message, 'E-mail ou senha incorretos.');
      return;
    }

    AccountStore.startSession('account');
    goToDashboard();
  });

  demoButton?.addEventListener('click', () => {
    AccountStore.startSession('demo');
    goToDashboard();
  });
}

function setupRegister() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const name = document.getElementById('registerName');
  const company = document.getElementById('registerCompany');
  const cnpj = document.getElementById('registerCnpj');
  const phone = document.getElementById('registerPhone');
  const email = document.getElementById('registerEmail');
  const password = document.getElementById('registerPassword');
  const confirmation = document.getElementById('registerPasswordConfirm');
  const message = document.getElementById('registerMessage');

  cnpj?.addEventListener('input', () => { cnpj.value = formatCnpj(cnpj.value); });
  phone?.addEventListener('input', () => { phone.value = formatPhone(phone.value); });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const normalizedEmail = email.value.trim().toLowerCase();

    if (!name.value.trim() || !company.value.trim() || !cnpj.value.trim() || !normalizedEmail || !password.value) {
      showMessage(message, 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (onlyDigits(cnpj.value).length !== 14) {
      showMessage(message, 'Informe um CNPJ válido com 14 dígitos.');
      return;
    }

    if (password.value.length < 6) {
      showMessage(message, 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (password.value !== confirmation.value) {
      showMessage(message, 'As senhas não coincidem.');
      return;
    }

    const user = {
      name: name.value.trim(),
      company: company.value.trim(),
      cnpj: cnpj.value.trim(),
      phone: phone.value.trim(),
      email: normalizedEmail,
      password: password.value,
      clients: [],
    };

    saveUser(user);
    AccountStore.logout();
    showMessage(message, 'Conta criada com sucesso! Redirecionando para o login...', 'success');

    setTimeout(() => {
      goToLogin();
    }, 700);
  });
}

setupPasswordToggles();
setupLogin();
setupRegister();
