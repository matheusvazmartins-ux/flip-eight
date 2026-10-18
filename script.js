/* =========================================
   Inicialização do Script
========================================= */

console.log("A loja está viva! O script.js foi carregado.");

let itens = 0;

/* =========================================
   Carrinho de Compras
========================================= */

function adicionarAoCarrinho(produto) {
  itens = itens + 1;

  let palavra = "";
  if (itens === 1) {
    palavra = "item";
  } else {
    palavra = "itens";
  }

  document.getElementById("contador").textContent = itens;
  document.getElementById("palavra").textContent = palavra;
  document.getElementById("aviso").textContent = produto + " foi para o carrinho.";

  console.log("Itens no carrinho: " + itens);
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
  console.log("Cadastro aprovado no navegador. Guardar é com o servidor (Aula 12).");

  return false;
}

/* =========================================
   Menuzinho Mobile (Hambúrguer)
========================================= */

function alternarMenu() {
  let menu = document.getElementById("lista-menu");
  menu.classList.toggle("ativo");
}