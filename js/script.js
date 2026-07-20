document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario-contato");
  const destinoFormulario = document.getElementById("contato") || formulario;
  const mensagemFormulario = document.getElementById("mensagem-formulario");

  const botaoCabecalho = document.getElementById("botao-cabecalho");
  const botaoAgendar = document.getElementById("botao-agendar");
  const botaoRodape = document.getElementById("botao-rodape");

  const botaoMenu = document.getElementById("botao-menu");
  const menuPrincipal = document.getElementById("menu-principal");
  const linksMenu = document.querySelectorAll("#menu-principal a");

  const campoNome = document.getElementById("nome");
  const campoTelefone = document.getElementById("telefone");
  const campoCep = document.getElementById("cep");
  const campoRua = document.getElementById("rua");
  const campoBairro = document.getElementById("bairro");
  const campoCidade = document.getElementById("cidade");
  const campoEstado = document.getElementById("estado");
  const campoNumero = document.getElementById("numero");

  function fecharMenu() {
    if (!botaoMenu || !menuPrincipal) {
      return;
    }

    menuPrincipal.classList.remove("aberto");
    botaoMenu.classList.remove("ativo");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
  }

  if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", function () {
      const menuEstaAberto = menuPrincipal.classList.toggle("aberto");

      botaoMenu.classList.toggle("ativo", menuEstaAberto);
      botaoMenu.setAttribute("aria-expanded", String(menuEstaAberto));

      if (menuEstaAberto) {
        botaoMenu.setAttribute("aria-label", "Fechar menu");
      } else {
        botaoMenu.setAttribute("aria-label", "Abrir menu");
      }
    });

    document.addEventListener("click", function (evento) {
      const clicouNoMenu = menuPrincipal.contains(evento.target);
      const clicouNoBotao = botaoMenu.contains(evento.target);

      if (!clicouNoMenu && !clicouNoBotao) {
        fecharMenu();
      }
    });
  }

  linksMenu.forEach(function (link) {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1000) {
      fecharMenu();
    }
  });

  function irParaFormulario() {
    if (!destinoFormulario) {
      return;
    }

    destinoFormulario.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(function () {
      if (campoNome) {
        campoNome.focus();
      }
    }, 700);
  }

  const botoesAgendamento = [
    botaoCabecalho,
    botaoAgendar,
    botaoRodape,
  ];

  botoesAgendamento.forEach(function (botao) {
    if (botao) {
      botao.addEventListener("click", irParaFormulario);
    }
  });

  const depoimentos = document.querySelectorAll(".depoimento-item");
  const indicadores = document.querySelectorAll(".indicador");
  const botaoAnterior = document.getElementById("depoimento-anterior");
  const botaoProximo = document.getElementById("depoimento-proximo");
  const carrossel = document.querySelector(".carrossel-depoimentos");

  let indiceAtual = 0;
  let intervaloCarrossel;

  const tempoTroca = 5000;

  function mostrarDepoimento(indice) {
    if (depoimentos.length === 0) {
      return;
    }

    if (indice < 0) {
      indiceAtual = depoimentos.length - 1;
    } else if (indice >= depoimentos.length) {
      indiceAtual = 0;
    } else {
      indiceAtual = indice;
    }

    depoimentos.forEach(function (depoimento) {
      depoimento.classList.remove("ativo");
    });

    indicadores.forEach(function (indicador) {
      indicador.classList.remove("ativo");
    });

    depoimentos[indiceAtual].classList.add("ativo");

    if (indicadores[indiceAtual]) {
      indicadores[indiceAtual].classList.add("ativo");
    }
  }

  function iniciarCarrosselAutomatico() {
    clearInterval(intervaloCarrossel);

    if (depoimentos.length === 0) {
      return;
    }

    intervaloCarrossel = setInterval(function () {
      mostrarDepoimento(indiceAtual + 1);
    }, tempoTroca);
  }

  function pararCarrosselAutomatico() {
    clearInterval(intervaloCarrossel);
  }

  function reiniciarCarrosselAutomatico() {
    pararCarrosselAutomatico();
    iniciarCarrosselAutomatico();
  }

  if (botaoAnterior) {
    botaoAnterior.addEventListener("click", function () {
      mostrarDepoimento(indiceAtual - 1);
      reiniciarCarrosselAutomatico();
    });
  }

  if (botaoProximo) {
    botaoProximo.addEventListener("click", function () {
      mostrarDepoimento(indiceAtual + 1);
      reiniciarCarrosselAutomatico();
    });
  }

  indicadores.forEach(function (indicador) {
    indicador.addEventListener("click", function () {
      const indice = Number(indicador.dataset.indice);

      mostrarDepoimento(indice);
      reiniciarCarrosselAutomatico();
    });
  });

  if (carrossel) {
    carrossel.addEventListener(
      "mouseenter",
      pararCarrosselAutomatico,
    );

    carrossel.addEventListener(
      "mouseleave",
      iniciarCarrosselAutomatico,
    );

    carrossel.addEventListener(
      "focusin",
      pararCarrosselAutomatico,
    );

    carrossel.addEventListener(
      "focusout",
      iniciarCarrosselAutomatico,
    );
  }

  mostrarDepoimento(0);
  iniciarCarrosselAutomatico();

  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 6) {
      return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
    }

    if (numeros.length <= 10) {
      return (
        "(" +
        numeros.slice(0, 2) +
        ") " +
        numeros.slice(2, 6) +
        "-" +
        numeros.slice(6)
      );
    }

    return (
      "(" +
      numeros.slice(0, 2) +
      ") " +
      numeros.slice(2, 7) +
      "-" +
      numeros.slice(7)
    );
  }

  if (campoTelefone) {
    campoTelefone.addEventListener("input", function () {
      campoTelefone.value = formatarTelefone(campoTelefone.value);
    });
  }

  let mensagemCep = document.getElementById("mensagem-cep");

  if (!mensagemCep && campoCep) {
    mensagemCep = document.createElement("span");
    mensagemCep.id = "mensagem-cep";
    mensagemCep.className = "mensagem-cep";
    mensagemCep.setAttribute("aria-live", "polite");

    campoCep.insertAdjacentElement("afterend", mensagemCep);
  }

  if (mensagemFormulario) {
    mensagemFormulario.setAttribute("aria-live", "polite");
  }

  function mostrarMensagemCep(texto, tipo) {
    if (!mensagemCep) {
      return;
    }

    mensagemCep.textContent = texto;
    mensagemCep.classList.remove("sucesso", "erro");

    if (tipo) {
      mensagemCep.classList.add(tipo);
    }
  }

  function limparEndereco() {
    if (campoRua) {
      campoRua.value = "";
    }

    if (campoBairro) {
      campoBairro.value = "";
    }

    if (campoCidade) {
      campoCidade.value = "";
    }

    if (campoEstado) {
      campoEstado.value = "";
    }
  }

  function formatarCep(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);

    if (numeros.length > 5) {
      return numeros.slice(0, 5) + "-" + numeros.slice(5);
    }

    return numeros;
  }

  if (campoCep) {
    campoCep.dataset.cepValido = "false";

    campoCep.addEventListener("input", function () {
      campoCep.value = formatarCep(campoCep.value);
      campoCep.dataset.cepValido = "false";

      limparEndereco();
      mostrarMensagemCep("", "");
    });

    campoCep.addEventListener("blur", buscarCep);
  }

  async function buscarCep() {
    const cep = campoCep.value.replace(/\D/g, "");

    campoCep.dataset.cepValido = "false";
    limparEndereco();

    if (cep.length === 0) {
      mostrarMensagemCep("", "");
      return;
    }

    if (cep.length !== 8) {
      mostrarMensagemCep(
        "Digite um CEP com oito números.",
        "erro",
      );
      return;
    }

    mostrarMensagemCep("Buscando endereço...", "");

    try {
      const resposta = await fetch(
        "https://viacep.com.br/ws/" + cep + "/json/",
      );

      if (!resposta.ok) {
        throw new Error("Erro ao consultar o CEP.");
      }

      const endereco = await resposta.json();

      if (endereco.erro) {
        mostrarMensagemCep("CEP não encontrado.", "erro");
        return;
      }

      if (campoRua) {
        campoRua.value = endereco.logradouro || "";
      }

      if (campoBairro) {
        campoBairro.value = endereco.bairro || "";
      }

      if (campoCidade) {
        campoCidade.value = endereco.localidade || "";
      }

      if (campoEstado) {
        campoEstado.value = endereco.uf || "";
      }

      campoCep.dataset.cepValido = "true";
      mostrarMensagemCep("Endereço encontrado.", "sucesso");

      if (campoNumero) {
        campoNumero.focus();
      }
    } catch (erro) {
      campoCep.dataset.cepValido = "false";
      limparEndereco();

      mostrarMensagemCep(
        "Não foi possível consultar o CEP. Tente novamente.",
        "erro",
      );
    }
  }

  if (formulario) {
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();

      if (
        campoCep &&
        campoCep.dataset.cepValido !== "true"
      ) {
        if (mensagemFormulario) {
          mensagemFormulario.textContent =
            "Confira o CEP antes de enviar o agendamento.";

          mensagemFormulario.classList.remove("sucesso");
          mensagemFormulario.classList.add("erro");
        }

        campoCep.focus();
        return;
      }

      if (mensagemFormulario) {
        mensagemFormulario.textContent =
          "Agendamento enviado! Em breve entraremos em contato.";

        mensagemFormulario.classList.remove("erro");
        mensagemFormulario.classList.add("sucesso");
      }

      formulario.reset();
      limparEndereco();

      if (campoCep) {
        campoCep.dataset.cepValido = "false";
      }

      mostrarMensagemCep("", "");
    });

    formulario.addEventListener("input", function () {
      if (mensagemFormulario) {
        mensagemFormulario.textContent = "";
        mensagemFormulario.classList.remove(
          "sucesso",
          "erro",
        );
      }
    });
  }
});