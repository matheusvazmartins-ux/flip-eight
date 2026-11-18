/* =========================================
   Inicialização e Variáveis Globais
========================================= */

let produtos = [];
let carrinho = [];
let numeroLoja = "5521967782267";
let temporizadorToast;
const nomesCategorias = {
  todos: "Todas as Categorias",
  camisetas: "Camisetas",
  canecas: "Canecas",
  bones: "Bonés",
  figures: "Figures",
  decoracao: "Decoração",
};

/* =========================================
   Funções Auxiliares
========================================= */

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function mostrarAviso(texto) {
  let aviso = document.getElementById("aviso");
  if (!aviso) return;

  aviso.textContent = texto;
  aviso.classList.add("ativo");

  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(function () {
    aviso.textContent = "";
    aviso.classList.remove("ativo");
  }, 2500);
}

/* =========================================
   Navegação de Fotos
========================================= */

function mudarFoto(elemento, direcao) {
  const container = elemento.closest(".container-foto-produto");
  if (!container) return;

  const img = container.querySelector("img");
  if (!img) return;

  const fotosString = img.getAttribute("data-fotos");
  if (!fotosString) return;

  const listaFotos = fotosString.split(",");
  if (listaFotos.length <= 1) return;

  let indexAtual = parseInt(img.getAttribute("data-index"), 10);
  if (isNaN(indexAtual)) {
    indexAtual = 0;
  }

  let novoIndex = indexAtual + direcao;

  if (novoIndex < 0) {
    novoIndex = listaFotos.length - 1;
  } else if (novoIndex >= listaFotos.length) {
    novoIndex = 0;
  }

  img.src = listaFotos[novoIndex].trim();

  img.setAttribute("data-index", novoIndex.toString());
}

/* =========================================
   Geração dos Cards dos Produtos
========================================= */

function criarCardProduto(p) {
  const fotos = Array.isArray(p.imagem)
    ? p.imagem
    : Array.isArray(p.imagens)
      ? p.imagens
      : [p.imagem];

  const temVarios = fotos.length > 1;

  return `
    <div class="produto">
      <div class="container-foto-produto">
        ${temVarios ? `<button type="button" class="seta-foto seta-esq" onclick="mudarFoto(this, -1)"><i class="fa-solid fa-chevron-left"></i></button>` : ""}
        
        <img src="${fotos[0]}" alt="${p.alt || p.nome}" data-fotos="${fotos.join(",")}" data-index="0">
        
        ${temVarios ? `<button type="button" class="seta-foto seta-dir" onclick="mudarFoto(this, 1)"><i class="fa-solid fa-chevron-right"></i></button>` : ""}
      </div>

      <h3>${p.nome}</h3>
      <p>${p.descricao}</p>
      <span class="preco">${formatarPreco(p.preco)}</span>
      <button type="button" onclick="adicionarAoCarrinho(${p.id})">COMPRAR</button>
    </div>
  `;
}

/* =========================================
   Renderização de Vitrines
========================================= */

function mostrarVitrine(categoriaFiltrada = "todos") {
  const containerVitrine = document.getElementById("vitrine");
  if (!containerVitrine) return;

  const produtosFiltrados =
    categoriaFiltrada === "todos"
      ? produtos
      : produtos.filter(
          (p) => p.categoria.toLowerCase() === categoriaFiltrada.toLowerCase(),
        );

  if (produtosFiltrados.length === 0) {
    containerVitrine.innerHTML =
      "<p class='aviso'>Nenhum produto encontrado nesta categoria.</p>";
    return;
  }

  containerVitrine.innerHTML = produtosFiltrados.map(criarCardProduto).join("");
}

function mostrarDestaques() {
  const containerDestaque = document.getElementById("vitrine-destaque");
  if (!containerDestaque) return;

  const listaDestaques = produtos.filter((p) => p.destaque === true);

  if (listaDestaques.length === 0) {
    containerDestaque.innerHTML =
      "<p class='aviso'>Nenhum produto em destaque no momento.</p>";
    return;
  }

  containerDestaque.innerHTML = listaDestaques.map(criarCardProduto).join("");
}

function montarTabela() {
  const corpo = document.getElementById("tabela-corpo");
  const total = document.getElementById("tabela-total");
  if (!corpo) return;

  let html = "";
  produtos.forEach(function (p) {
    html += `<tr>
    <td>${p.nome}</td>
    <td>${nomesCategorias[p.categoria] || p.categoria} </td>
    <td class="preco">${formatarPreco(p.preco)}</td>
    </tr>`;
  });

  corpo.innerHTML = html;
  if (total) total.textContent = produtos.length;
}

/* =========================================
   Carregamento de Dados (Fetch API)
========================================= */

document.addEventListener("DOMContentLoaded", carregarProdutos);

function carregarProdutos() {
  const containerVitrine = document.getElementById("vitrine");
  const containerDestaque = document.getElementById("vitrine-destaque");

  if (!containerVitrine && !containerDestaque) return;

  fetch("produtos.json")
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error("Ficheiro produtos.json não encontrado");
      }
      return resposta.json();
    })
    .then((dados) => {
      produtos = dados;

      if (containerDestaque) {
        mostrarDestaques();
      }

      if (containerVitrine) {
        montarFiltros();

        const urlParams = new URLSearchParams(window.location.search);
        const categoriaUrl = urlParams.get("categoria") || "todos";
        const selectFiltro = document.getElementById("filtro-categoria");

        if (
          selectFiltro &&
          selectFiltro.querySelector(`option[value="${categoriaUrl}"]`)
        ) {
          selectFiltro.value = categoriaUrl;
        }

        mostrarVitrine(categoriaUrl);
        montarTabela();
      }
    })
    .catch((erro) => {
      console.error("Erro no Fetch:", erro);
      mostrarAviso("ERRO AO CARREGAR PRODUTOS");
    });
}

/* =========================================
   Filtros
========================================= */

function montarFiltros() {
  const selectFiltro = document.getElementById("filtro-categoria");
  if (!selectFiltro) return;

  let categoriasUnicas = ["todos"];

  produtos.forEach((p) => {
    if (p.categoria && !categoriasUnicas.includes(p.categoria.toLowerCase())) {
      categoriasUnicas.push(p.categoria.toLowerCase());
    }
  });

  let htmlOptions = "";
  categoriasUnicas.forEach((cat) => {
    let nomeExibicao = nomesCategorias[cat] || cat;

    htmlOptions += `<option value="${cat}">${nomeExibicao}</option>`;
  });

  selectFiltro.innerHTML = htmlOptions;
}

/* =========================================
   Carrinho de Compras
========================================= */

function adicionarAoCarrinho(idOuPosicao) {
  let produto =
    produtos.find((p) => p.id === idOuPosicao) || produtos[idOuPosicao];
  if (!produto) return;

  carrinho.push(produto);
  salvar();
  atualizarCarrinho();

  mostrarAviso(produto.nome + " ADICIONADO AO CARRINHO.");
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
    total += carrinho[i].preco;
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

  let palavra = carrinho.length === 1 ? "item" : "itens";

  const elemLista = document.getElementById("lista-carrinho");
  const elemTotal = document.getElementById("total");
  const elemContador = document.getElementById("contador");
  const elemPalavra = document.getElementById("palavra");

  if (elemLista) elemLista.innerHTML = html;
  if (elemTotal) elemTotal.textContent = formatarPreco(total);
  if (elemContador) elemContador.textContent = carrinho.length;
  if (elemPalavra) elemPalavra.textContent = palavra;
}

function alternarCarrinho() {
  document.getElementById("painel-carrinho")?.classList.toggle("aberto");
  document.getElementById("fundo-carrinho")?.classList.toggle("aberto");
}

function fecharCarrinho() {
  document.getElementById("painel-carrinho")?.classList.remove("aberto");
  document.getElementById("fundo-carrinho")?.classList.remove("aberto");
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

  for (let i = 0; i < carrinho.length; i++) {
    mensagem +=
      "- " + carrinho[i].nome + " (" + formatarPreco(carrinho[i].preco) + ")\n";
    total += carrinho[i].preco;
  }

  mensagem += "TOTAL: " + formatarPreco(total);

  let url =
    "https://wa.me/" + numeroLoja + "?text=" + encodeURIComponent(mensagem);
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
   Validação do Formulário de Cadastro
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
  let inputNome = document.getElementById("nome");
  let erro = document.getElementById("erro-nome");
  if (!inputNome || !erro) return true;

  let nome = inputNome.value;
  let ruim = caractereInvalido(nome);

  if (ruim === "") {
    erro.textContent = "";
    return true;
  } else {
    erro.textContent = "O nome não pode ter " + ruim;
    return false;
  }
}

function mudarDica() {
  let assuntoElem = document.getElementById("assunto");
  let dicaElem = document.getElementById("dica");
  if (!assuntoElem || !dicaElem) return;

  let assunto = assuntoElem.value;
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

  dicaElem.textContent = dica;
}

function mostrarErro(id, texto) {
  const elem = document.getElementById(id);
  if (elem) elem.textContent = texto;
}

function validarCadastro() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const assunto = document.getElementById("assunto").value;
  const mensagem = document.getElementById("mensagem").value.trim();
  const aceitou = document.getElementById("aceite").checked;
  const resultado = document.getElementById("resultado");

  let tudoCerto = true;

  ["nome", "email", "telefone", "mensagem", "aceite"].forEach(function (campo) {
    mostrarErro("erro-" + campo, "");
  });
  resultado.textContent = "";

  if (nome.length < 3) {
    mostrarErro("erro-nome", "Digite seu nome completo (mínimo 3 letras).");
    tudoCerto = false;
  } else if (conferirNome() === false) {
    tudoCerto = false;
  }

  const modeloEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!modeloEmail.test(email)) {
    mostrarErro("erro-email", "E-mail inválido. Exemplo: nome@exemplo.com");
    tudoCerto = false;
  }

  const modeloTelefone = /^[0-9]{2} [0-9]{5}-[0-9]{4}$/;
  if (telefone === "") {
    mostrarErro(
      "erro-telefone",
      "Digite seu telefone para entrarmos em contato.",
    );
    tudoCerto = false;
  } else if (!modeloTelefone.test(telefone)) {
    mostrarErro(
      "erro-telefone",
      "Telefone inválido. Use o formato 21 99999-9999.",
    );
    tudoCerto = false;
  }

  if (mensagem === "") {
    mostrarErro("erro-mensagem", "Escreva sua mensagem.");
    tudoCerto = false;
  } else if (assunto === "troca" && mensagem.length < 5) {
    mostrarErro("erro-mensagem", "Para troca, conte o motivo.");
    tudoCerto = false;
  }

  if (!aceitou) {
    mostrarErro("erro-aceite", "Marque a caixinha para continuar.");
    tudoCerto = false;
  }

  if (tudoCerto) {
    resultado.textContent = "Cadastro validado com sucesso!";
  }

  return false;
}

/* =========================================
   UI: Menu Mobile e Tema Dark
========================================= */

function alternarMenu() {
  let menu = document.getElementById("lista-menu");
  if (menu) menu.classList.toggle("ativo");
}

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
  } else {
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
   Execução Inicial
========================================= */

carregarTema();
carregar();
atualizarCarrinho();
