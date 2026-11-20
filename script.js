
const WHATSAPP_LOJA = "5586994454613";

const produtos = [
  {
    id: 1,
    nome: "Vestido Elegante",
    categoria: "feminino",
    preco: 129.90,
    imagem: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80",
    tamanhos: ["P", "M", "G"]
  },
  {
    id: 2,
    nome: "Blusa Clássica",
    categoria: "feminino",
    preco: 79.90,
    imagem: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=600&q=80",
    tamanhos: ["P", "M", "G", "GG"]
  },
  {
    id: 3,
    nome: "Camisa Masculina",
    categoria: "masculino",
    preco: 99.90,
    imagem: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80",
    tamanhos: ["P", "M", "G", "GG"]
  },
  {
    id: 4,
    nome: "Jaqueta Casual",
    categoria: "masculino",
    preco: 159.90,
    imagem: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    tamanhos: ["M", "G", "GG"]
  }
];

let carrinho = [];
let enderecoPedido = null;
let categoriaAtual = "todos";

const dinheiro = valor =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function mostrarPagina(id) {
  document.querySelectorAll(".pagina").forEach(pagina => {
    pagina.classList.toggle("ativa", pagina.id === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-ir]").forEach(botao => {
  botao.addEventListener("click", () => {
    const destino = botao.dataset.ir;

    if (destino === "carrinho") atualizarCarrinho();
    mostrarPagina(destino);
  });
});

// Cadastro demonstrativo: não cria uma conta segura real.
document.getElementById("form-cadastro").addEventListener("submit", evento => {
  evento.preventDefault();

  const nome = document.getElementById("nome-cadastro").value.trim();
  const usuario = document.getElementById("usuario-cadastro").value.trim();
  const email = document.getElementById("email-cadastro").value.trim();
  const senha = document.getElementById("senha-cadastro").value;
  const confirmar = document.getElementById("confirmar-senha").value;

  if (senha !== confirmar) {
    alert("As senhas não são iguais. Confira e tente novamente.");
    return;
  }

  alert(
    "Olá, " + nome + "! O formulário foi validado neste navegador. " +
    "Para criar uma conta real com segurança, a loja ainda precisa " +
    "de um serviço de autenticação."
  );

  document.getElementById("usuario-entrar").value = usuario;
  document.getElementById("form-cadastro").reset();
  mostrarPagina("entrada");
});

// Entrada demonstrativa, sem autenticação real.
document.getElementById("form-entrar").addEventListener("submit", evento => {
  evento.preventDefault();

  const usuario = document.getElementById("usuario-entrar").value.trim();
  const senha = document.getElementById("senha-entrar").value;

  if (!usuario || !senha) {
    alert("Preencha o usuário e a senha.");
    return;
  }

  alert(
    "Entrada demonstrativa. O login real ainda precisa de autenticação segura."
  );

  mostrarPagina("catalogo");
});

function mostrarProdutos() {
  const lista = document.getElementById("lista-produtos");
  lista.replaceChildren();

  const filtrados = produtos.filter(produto =>
    categoriaAtual === "todos" || produto.categoria === categoriaAtual
  );

  filtrados.forEach(produto => {
    const card = document.createElement("article");
    card.className = "produto";

    const imagem = document.createElement("img");
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;
    imagem.loading = "lazy";
    imagem.onerror = () => {
      imagem.alt = "Imagem indisponível para " + produto.nome;
    };

    const titulo = document.createElement("h3");
    titulo.textContent = produto.nome;

    const preco = document.createElement("p");
    preco.className = "preco";
    preco.textContent = dinheiro(produto.preco);

    const label = document.createElement("label");
    label.textContent = "Escolha o tamanho";

    const tamanho = document.createElement("select");
    tamanho.setAttribute("aria-label", "Tamanho de " + produto.nome);

    produto.tamanhos.forEach(opcao => {
      const item = document.createElement("option");
      item.value = opcao;
      item.textContent = opcao;
      tamanho.appendChild(item);
    });

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "ADICIONAR AO CARRINHO";

    botao.addEventListener("click", () => {
      const existente = carrinho.find(item =>
        item.id === produto.id && item.tamanho === tamanho.value
      );

      if (existente) {
        existente.quantidade += 1;
      } else {
        carrinho.push({
          ...produto,
          tamanho: tamanho.value,
          quantidade: 1
        });
      }

      atualizarCarrinho();
      alert(produto.nome + " foi adicionado ao carrinho!");
    });

    card.append(imagem, titulo, preco, label, tamanho, botao);
    lista.appendChild(card);
  });
}

document.querySelectorAll("[data-categoria]").forEach(botao => {
  botao.addEventListener("click", () => {
    categoriaAtual = botao.dataset.categoria;
    mostrarProdutos();
  });
});

function atualizarCarrinho() {
  const area = document.getElementById("itens-carrinho");
  area.replaceChildren();

  if (carrinho.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.textContent = "Seu carrinho está vazio.";
    area.appendChild(mensagem);
  }

  carrinho.forEach(item => {
    const linha = document.createElement("div");
    const descricao = document.createElement("p");
    descricao.textContent =
      `${item.nome} | Tamanho ${item.tamanho} | ` +
      `${item.quantidade} × ${dinheiro(item.preco)}`;

    const subtotal = document.createElement("p");
    subtotal.textContent = "Subtotal: " +
      dinheiro(item.preco * item.quantidade);

    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "secundario";
    remover.textContent = "REMOVER UMA UNIDADE";

    remover.addEventListener("click", () => {
      item.quantidade -= 1;

      if (item.quantidade <= 0) {
        carrinho = carrinho.filter(produto =>
          !(produto.id === item.id && produto.tamanho === item.tamanho)
        );
      }

      atualizarCarrinho();
    });

    linha.append(descricao, subtotal, remover);
    area.appendChild(linha);
  });

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  document.getElementById("total").textContent = dinheiro(total);
}

document.getElementById("form-entrega").addEventListener("submit", evento => {
  evento.preventDefault();

  if (carrinho.length === 0) {
    alert("Adicione pelo menos um produto antes de continuar.");
    mostrarPagina("catalogo");
    return;
  }

  const form = new FormData(evento.currentTarget);
  enderecoPedido = Object.fromEntries(form.entries());

  const resumo = document.getElementById("resumo-pedido");
  resumo.replaceChildren();

  const titulo = document.createElement("h3");
  titulo.textContent = "Produtos escolhidos";
  resumo.appendChild(titulo);

  carrinho.forEach(item => {
    const linha = document.createElement("p");
    linha.textContent =
      `${item.nome} — tamanho ${item.tamanho} — ` +
      `quantidade ${item.quantidade} — ` +
      dinheiro(item.preco * item.quantidade);

    resumo.appendChild(linha);
  });

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  const totalTexto = document.createElement("h3");
  totalTexto.textContent = "Total: " + dinheiro(total);
  resumo.appendChild(totalTexto);

  const entregaTitulo = document.createElement("h3");
  entregaTitulo.textContent = "Endereço informado";
  resumo.appendChild(entregaTitulo);

  const entregaTexto = document.createElement("p");
  entregaTexto.textContent =
    `${enderecoPedido.nome}, telefone ${enderecoPedido.telefone}; ` +
    `CEP ${enderecoPedido.cep}; ${enderecoPedido.rua}, ` +
    `nº ${enderecoPedido.numero}, ${enderecoPedido.bairro}, ` +
    `${enderecoPedido.cidade} - ${enderecoPedido.estado}. ` +
    `Complemento: ${enderecoPedido.complemento || "não informado"}.`;

  resumo.appendChild(entregaTexto);
  mostrarPagina("finalizar");
});

document.getElementById("botao-whatsapp").addEventListener("click", () => {
  if (!enderecoPedido || carrinho.length === 0) {
    alert("Confira o carrinho e preencha o endereço antes de continuar.");
    return;
  }

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  const linhas = [
    "Olá! Quero fazer um pedido na LUXO FASHION.",
    "",
    "PRODUTOS:"
  ];

  carrinho.forEach(item => {
    linhas.push(
      `- ${item.nome}, tamanho ${item.tamanho}, ` +
      `quantidade ${item.quantidade}: ` +
      dinheiro(item.preco * item.quantidade)
    );
  });

  linhas.push(
    "",
    "TOTAL DOS PRODUTOS: " + dinheiro(total),
    "",
    "DADOS PARA ENTREGA:",
    "Nome: " + enderecoPedido.nome,
    "Telefone: " + enderecoPedido.telefone,
    "CEP: " + enderecoPedido.cep,
    "Estado: " + enderecoPedido.estado,
    "Cidade: " + enderecoPedido.cidade,
    "Bairro: " + enderecoPedido.bairro,
    "Rua: " + enderecoPedido.rua,
    "Número: " + enderecoPedido.numero,
    "Complemento: " + (enderecoPedido.complemento || "Não informado"),
    "",
    "Por favor, confirme a disponibilidade e o valor da entrega."
  );

  const url =
    "https://wa.me/" + WHATSAPP_LOJA +
    "?text=" + encodeURIComponent(linhas.join("\n"));

  window.open(url, "_blank", "noopener,noreferrer");
});

mostrarProdutos();
atualizarCarrinho();
