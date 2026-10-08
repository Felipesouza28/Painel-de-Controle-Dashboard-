# ClimaGestão — MVP de apresentação

Protótipo web de um sistema de gestão para empresas de instalação e manutenção de ar-condicionado.

## Estrutura

- `index.html` — login
- `cadastro.html` — cadastro da empresa e responsável
- `dashboard.html` — dashboard do sistema
- `css/style.css` — estilos do dashboard
- `css/auth.css` — estilos de login/cadastro
- `js/script.js` — navegação, modal de OS e calendário
- `js/auth.js` — autenticação local e cadastro
- `js/dashboard.js` — personalização da dashboard e logout
- `js/data-store.js` — acesso centralizado às contas e aos dados isolados da demonstração
- `js/clients.js` — cadastro, consulta, edição, exclusão e busca de clientes

## Fluxo de conta e demonstração

1. Abra `index.html`.
2. Para uma conta própria, use `Criar conta grátis`, cadastre os dados e entre pela tela de login.
3. Uma conta nova começa com `clients: []`; seus clientes ficam vinculados à conta no navegador.
4. Para apresentação, use `Entrar na demonstração`; os clientes fictícios ficam em um armazenamento separado.
5. No módulo Clientes, cadastre, consulte, edite, exclua e busque os contatos. O total também aparece no dashboard.

## Importante

Esta autenticação é somente para protótipo. Os dados ficam no navegador e a senha é armazenada localmente. Para produção, a autenticação deve ser migrada para um backend com banco de dados, hash de senha, sessão/token, recuperação de senha e controle de acesso. A camada `data-store.js` centraliza o acesso atual para facilitar essa migração.
