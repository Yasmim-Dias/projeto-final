// ------------------------------
// CONFIG: ajuste a porta do backend aqui
// ------------------------------
const API_URL = "http://localhost:3000/usuarios-com-cartoes";  

// ------------------------------
// CADASTRAR USUÁRIO
// ------------------------------
document.getElementById("form-usuario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = {
    nome: document.getElementById("nome").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    endereco: document.getElementById("endereco").value,
  };

  const resposta = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });

  const data = await resposta.json();
  alert("Usuário cadastrado! ID: " + data.id);
  carregarDados();
});

// ------------------------------
// CADASTRAR CARTÃO
// ------------------------------
document.getElementById("form-cartao").addEventListener("submit", async (e) => {
  e.preventDefault();

  const cartao = {
    numero: document.getElementById("numero").value,
    validade: document.getElementById("validade").value,
    cvv: document.getElementById("cvv").value,
    id_usuario: document.getElementById("id_usuario").value,
  };

  const resposta = await fetch(`${API_URL}/cartoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cartao),
  });

  const data = await resposta.json();
  alert("Cartão registrado!");
  carregarDados();
});

// ------------------------------
// LISTAR USUÁRIOS + CARTÕES
// ------------------------------
async function carregarDados() {
  const lista = document.getElementById("lista-dados");
  lista.innerHTML = "Carregando...";

  const resposta = await fetch(`${API_URL}/usuarios-com-cartoes`);
  const dados = await resposta.json();

  lista.innerHTML = "";

  dados.forEach((u) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${u.nome}</strong> (ID: ${u.id})<br>
      Email: ${u.email}<br>
      Telefone: ${u.telefone}<br>
      Endereço: ${u.endereco}<br>
      <strong>Cartões:</strong> 
      ${
        u.cartoes.length > 0
          ? u.cartoes.map((c) => `#${c.id} - ${c.numero} (${c.validade})`).join("<br>")
          : "Nenhum cartão cadastrado"
      }
      <br><button onclick="deletarUsuario(${u.id})">Excluir usuário</button>
      <hr>
    `;

    lista.appendChild(li);
  });
}

// ------------------------------
// DELETAR USUÁRIO
// ------------------------------
async function deletarUsuario(id) {
  if (!confirm("Excluir este usuário?")) return;

  await fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
  });

  carregarDados();
}

carregarDados();
