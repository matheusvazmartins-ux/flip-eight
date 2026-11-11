/* =========================================
   Inicialização do Script
========================================= */

console.log("A loja está viva! O script.js foi carregado.");

/* =========================================
   Array
========================================= */

let produtos = [];

let carrinho = [];
let numeroLoja = "5521967782267";

/* =========================================
   Funções Auxiliares
========================================= */

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

let temporizadorToast;

function mostrarAviso(texto) {
  let aviso = document.getElementById("aviso");
  aviso.textContent = texto;
  aviso.classList.add("ativo");

  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(function () {
    aviso.textContent = "";
  }, 2500);
}

/* =========================================
   Fetch API
========================================= */

function carregarProdutos() {
  fetch ("produtos.json")
    .then(resposta => {
      if (!resposta.ok) {
        throw new Error("Não foi possível carregar os arquivo produtos.json");
      }
      return resposta.json();
    })
    .then (dados => {
      produtos = dados;
      mostrarVitrine();
    })
    .catch(erro => {
      console.error("Erro no Fetch:", erro);
      mostrarAviso("Erro ao carregar os produtos do servidor.");
    })
}

/* =========================================
   Vitrine
========================================= */

function mostrarVitrine(categoriaFiltrada = "todos") {
  let html= "";

  for (let i = 0; i < produtos.length; i++) {
    let p = produtos[i];

  if (categoriaFiltrada === "todos" || p.categoria === categoriaFiltrada) {
    html += `
      <article class="produto">
        <img src="${p.imagem}" alt="${p.alt}">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <p class="preco">${formatarPreco(p.preco)}</p>
        <button type="button" onclick="adicionarAoCarrinho(${i})">Comprar</button>
      </article>`;
  }
}

  if (html === "") {
    html = `<p class="aviso">Nenhum produto encontrado nesta categoria.</p>`
  }

  document.getElementById("vitrine").innerHTML = html;
}

/* =========================================
   Carrinho de Compras
========================================= */

function adicionarAoCarrinho(posicao) {
  let produto = produtos[posicao];

  carrinho.push(produto);
  salvar();
  atualizarCarrinho();

  mostrarAviso(produto.nome + " ADICIONADO AO CARRINHO.");

  console.log("ITENS NO CARRINHO: " + carrinho.length);
}

function removerDoCarrinho(posicao) {
  let produto = carrinho[posicao];

  carrinho.splice(posicao, 1);
  salvar();
  atualizarCarrinho();

  mostrarAviso(produto.nome + " REMOVIDO DO CARRINHO.");
}

function limparCarrinho() {
  carrinho = [];
  salvar();
  atualizarCarrinho();
  mostrarAviso("CARRINHO VAZIO.");
}

function atualizarCarrinho() {
  let total = 0;
  let html = "";

  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].preco;
    html += `<li>
      <span>${carrinho[i].nome} - ${formatarPreco(carrinho[i].preco)}</span>
      <button type="button" onclick="removerDoCarrinho(${i})">Remover</button>
      </li>`;
  }

  if (carrinho.length === 0) {
    html = `<li class="carrinho-vazio">
      <i class="fa-solid fa-cart-shopping"></i>
      <p>Seu carrinho está vazio. :(</p>
      </li>`;
  }

  let palavra = "";
  if (carrinho.length === 1) {
    palavra = "item";
  } else {
    palavra = "itens";
  }

  document.getElementById("lista-carrinho").innerHTML = html;
  document.getElementById("total").textContent = formatarPreco(total);
  document.getElementById("contador").textContent = carrinho.length;
  document.getElementById("palavra").textContent = palavra;
}

function alternarCarrinho() {
  document.getElementById("painel-carrinho").classList.toggle("aberto");
  document.getElementById("fundo-carrinho").classList.toggle("aberto");
}

function fecharCarrinho() {
  document.getElementById("painel-carrinho").classList.remove("aberto");
  document.getElementById("fundo-carrinho").classList.remove("aberto");
}

/* =========================================
   WhatsApp
========================================= */

function enviarWhatsApp() {
  if (carrinho.length === 0) {
    mostrarAviso("ADICIONE UM PRODUTO PRIMEIRO.");
    return;
  }

  let total = 0;
  let mensagem = "Olá! Quero fazer este pedido:\n";

  for (let i = 0; i <carrinho.length; i++) {
    mensagem += "- " + carrinho[i].nome +" (" + formatarPreco(carrinho[i].preco) + ") \n";
    total = total + carrinho[i].preco;
  }
  
  mensagem += "TOTAL: " + formatarPreco(total);

  let url = "https://wa.me/" + numeroLoja + "?text=" + encodeURIComponent(mensagem);
  window.open(url, "_blank");
}

/* =========================================
   Local Storage
========================================= */

function salvar() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function carregar() {
  let guardado = localStorage.getItem("carrinho");

  if (guardado !== null) {
    carrinho = JSON.parse(guardado);
  }
}

/* =========================================
   Validação de Nomes
========================================= */

function caractereInvalido(nome) {
  for (let i = 0; i < nome.length; i++) {
    let c = nome[i];
    let ehLetra = c.toLowerCase() !== c.toUpperCase();
    let ehPermitido = c === " " || c === "-" || c === "'";

    if (ehLetra === false && ehPermitido === false) {
      return c;
    }
  }

  return "";
}

function conferirNome() {
  let nome = document.getElementById("nome").value;
  let ruim = caractereInvalido(nome);
  let erro = document.getElementById("erro-nome");

  if (ruim === "") {
    erro.textContent = "";
    return true;
  } else {
    erro.textContent = "O nome não pode ter " + ruim;
    return false;
  }
}

/* =========================================
   Interatividade do Formulário
========================================= */

function mudarDica() {
  let assunto = document.getElementById("assunto").value;
  let dica = "";

  switch (assunto) {
    case "duvida":
      dica = "Diga qual produto.";
      break;
    case "pedido":
      dica = "Informe o número do pedido.";
      break;
    case "troca":
      dica = "Conte o motivo da troca.";
      break;
    default:
      dica = "Conte a sua ideia.";
  }

  document.getElementById("dica").textContent = dica;
}

function validarCadastro() {
  let assunto = document.getElementById("assunto").value;
  let mensagem = document.getElementById("mensagem").value.trim();
  let erroMsg = document.getElementById("erro-mensagem");
  let resultado = document.getElementById("resultado");

  erroMsg.textContent = "";
  resultado.textContent = "";

  if (conferirNome() === false) {
    return false;
  }

  if (assunto === "troca" && mensagem.length < 10) {
    erroMsg.textContent = "Para troca, conte o motivo.";
    return false;
  }

  resultado.textContent = "Tudo certo! O navegador conferiu.";
  console.log("Cadastro aprovado no navegador.");

  return false;
}

/* =========================================
   Menuzinho Mobile (Hambúrguer)
========================================= */

function alternarMenu() {
  let menu = document.getElementById("lista-menu");
  menu.classList.toggle("ativo");
}

/* =========================================
   Tema Dark
========================================= */

function alternarTema() {
  let body = document.body;
  body.classList.toggle("dark-mode");

  let ehDark = body.classList.contains("dark-mode");

  localStorage.setItem("tema", ehDark ? "dark" : "light");

  atualizarIconeTema(ehDark);
}

function atualizarIconeTema(ehDark) {
   let icone = document.querySelector("#btn-tema i");
   if (!icone) return;

   if (ehDark) {
    icone.classList.remove("fa-moon");
    icone.classList.add("fa-sun");
   }else{
    icone.classList.remove("fa-sun");
    icone.classList.add("fa-moon");
   }
}

function carregarTema() {
  let temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "dark") {
    document.body.classList.add("dark-mode");
    atualizarIconeTema(true);
  }
}

/* =========================================
   Início
========================================= */

carregarTema();
carregar();
carregarProdutos();
atualizarCarrinho();