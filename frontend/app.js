// Configuração da API (ajuste a porta se necessário)
const API_BASE_URL = "http://localhost:3000";

// Elementos do DOM
const formUsuario = document.getElementById('form-usuario');
const formCartao = document.getElementById('form-cartao');
const listaDados = document.getElementById('lista-dados');
const mensagem = document.getElementById('mensagem');

async function buscarDados(){
  try{
    const res = await fetch(`${API_BASE_URL}/usuarios-com-cartoes`);
    if(!res.ok) throw new Error('Resposta do servidor: ' + res.status);
    const dados = await res.json();
    renderizarDados(dados);
  }catch(err){
    console.error(err);
    mensagem.textContent = 'Erro ao buscar dados. Verifique o backend.';
  }
}

function renderizarDados(lista){
  listaDados.innerHTML = '';
  if(!Array.isArray(lista) || lista.length === 0){
    listaDados.innerHTML = '<li>Nenhum usuário cadastrado ainda.</li>';
    return;
  }

  lista.forEach(usuario => {
    const li = document.createElement('li');

    const cartoesHtml = (usuario.cartoes && usuario.cartoes.length > 0)
      ? (`<ul>${usuario.cartoes.map(c => `<li>Cartão #${c.id} — ${c.numero} (val: ${c.validade})</li>`).join('')}</ul>`)
      : '<em>Sem cartões</em>';

    li.innerHTML = `
      <strong>${usuario.nome} (ID: ${usuario.id})</strong><br>
      <small>${usuario.email} • ${usuario.telefone}</small>
      <div>${cartoesHtml}</div>
      <div style="margin-top:6px">
        <button data-delete-user="${usuario.id}" class="btn-delete-user">Excluir usuário</button>
      </div>
    `;

    listaDados.appendChild(li);
  });
}

// Envio do formulário de usuário
formUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensagem.textContent = '';

  const payload = {
    nome: document.getElementById('nome').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    email: document.getElementById('email').value.trim(),
    endereco: document.getElementById('endereco').value.trim(),
  };

  try{
    const res = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!res.ok){
      const body = await res.json().catch(()=>({}));
      throw new Error(body.erro || 'Erro ao cadastrar usuário');
    }
    formUsuario.reset();
    buscarDados();
    alert('Usuário cadastrado com sucesso!');
  }catch(err){
    console.error(err);
    mensagem.textContent = err.message;
  }
});

// Envio do formulário de cartão
formCartao.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensagem.textContent = '';

  const payload = {
    numero: document.getElementById('numero').value.trim(),
    validade: document.getElementById('validade').value.trim(),
    cvv: document.getElementById('cvv').value.trim(),
    id_usuario: Number(document.getElementById('id_usuario').value.trim())
  };

  if(!payload.id_usuario) return mensagem.textContent = 'Informe um id_usuario válido.';

  try{
    const res = await fetch(`${API_BASE_URL}/cartoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!res.ok){
      const body = await res.json().catch(()=>({}));
      throw new Error(body.erro || 'Erro ao cadastrar cartão');
    }
    formCartao.reset();
    buscarDados();
    alert('Cartão cadastrado com sucesso!');
  }catch(err){
    console.error(err);
    mensagem.textContent = err.message;
  }
});

// Deletar usuário (botão dinâmico)
listaDados.addEventListener('click', async (e) =>{
  const btn = e.target.closest('[data-delete-user]');
  if(!btn) return;
  const id = btn.getAttribute('data-delete-user');
  if(!confirm('Deseja realmente excluir o usuário #' + id + '?')) return;

  try{
    const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, { method: 'DELETE' });
    if(!res.ok) throw new Error('Erro ao excluir');
    buscarDados();
  }catch(err){
    console.error(err);
    mensagem.textContent = 'Não foi possível excluir o usuário.';
  }
});

// Inicializa
buscarDados();