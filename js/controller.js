//   ╔══════════════════════════════════════════════════════════════════════╗
//   ║                                                                      ║
//   ║   ██████╗ ██╗   ██╗    ██████╗ ███╗   ██╗███████╗██████╗ ██╗███████╗ ║
//   ║   ██╔══██╗╚██╗ ██╔╝    ██╔══██╗████╗  ██║██╔════╝██╔══██╗██║██╔════╝ ║
//   ║   ██████╔╝ ╚████╔╝     ██║  ██║██╔██╗ ██║█████╗  ██████╔╝██║███████╗ ║
//   ║   ██╔══██╗  ╚██╔╝      ██║  ██║██║╚██╗██║██╔══╝  ██╔══██╗██║╚════██║ ║
//   ║   ██████╔╝   ██║       ██████╔╝██║ ╚████║███████╗██║  ██║██║███████║ ║
//   ║   ╚═════╝    ╚═╝       ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝ ║
//   ║                                                                      ║
//   ║  Desenvolvido por: Daniel Neris Gomes                                ║
//   ║  Email: Dnerisgg@gmail.com                                           ║
//   ║  Instagram: _Dneris                                                  ║
//   ║  Projeto: LocateNow                                                  ║
//   ║                                                                      ║
//   ╚══════════════════════════════════════════════════════════════════════╝

$(document).ready(function () {
// localStorage.setItem("testDataInserted", "false");
  
  $(".logo-text").on("click", function () {
    openPage("../Home/home.html");
  });

  // clear_dataBase();
  insert_manual_teste();
});

// clear_dataBase
function clear_dataBase() {
  db.delete()
    .then(() => {
      console.log("Banco excluído com sucesso!");
    })
    .catch((err) => {
      console.error("Erro ao excluir banco:", err);
    });
}

function openPage(url) {
  if (!url) return console.error("URL inválida.");
  window.location.href = url;
}

// ===== Inicialização de Efeitos Visuais =====

function initParticles() {
  if (
    document.getElementById("particles-js") &&
    typeof particlesJS !== "undefined"
  ) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 120,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#3a86ff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.2,
            sync: false,
          },
        },
        size: {
          value: 4,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#6c63ff",
          opacity: 0.4,
          width: 1.5,
        },
        move: {
          enable: true,
          speed: 3, // Mantido como está
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: true, // Habilitado para interação com o mouse
            rotateX: 3000,
            rotateY: 3000,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab", // Partículas "agarram" o mouse
          },
          onclick: {
            enable: true,
            mode: "push", // Adiciona mais partículas no clique
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 250, // Aumente para interação mais ampla
            line_linked: {
              opacity: 0.8,
            },
          },
          push: {
            particles_nb: 8,
          },
        },
      },
      retina_detect: true,
    });
  } else {
    console.warn(
      "Particles.js library ou container #particles-js não encontrado ou deu ruim na inicialização."
    );
  }
}

function initParticlesHoverEffect() {
  const particlesContainer = document.getElementById("particles-js");
  if (particlesContainer && window.pJSDom && window.pJSDom[0]) {
    document.addEventListener("mousemove", function (e) {
      const canvas = document.querySelector("#particles-js canvas");
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Simula interatividade manualmente (opcional)
      const pJS = window.pJSDom[0].pJS;
      pJS.interactivity.mouse.pos_x = mouseX;
      pJS.interactivity.mouse.pos_y = mouseY;
      pJS.interactivity.status = "mousemove";
    });
  }
}

function initScrollReveal() {
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      origin: "bottom",
      distance: "30px",
      duration: 1000,
      delay: 200,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
      reset: false,
    });
    sr.reveal(".hero h1", { delay: 100 });
    sr.reveal(".hero .lead", { delay: 300 });
    sr.reveal(".hero .input-group", { delay: 500 });
    sr.reveal(".hero .btn-outline-primary", { delay: 700 });
    sr.reveal(".table-section h4", { delay: 100 });
    sr.reveal(".table-responsive", { delay: 300 });
    sr.reveal(".como-funciona h2", { delay: 100 });
    sr.reveal(".como-funciona .card", { interval: 200 });
    sr.reveal("#quem-somos h2", { delay: 100 });
    sr.reveal("#quem-somos .lead", { delay: 300 });
    sr.reveal("#quem-somos .feature-box", { interval: 200 });
    sr.reveal("footer h5", { interval: 200 });
    sr.reveal("footer p", { delay: 300 });
    sr.reveal(".social-icon", { interval: 100 });
  } else {
    console.warn("ScrollReveal library not found.");
  }
}

function addJumpAnimation() {
  if (!document.getElementById("btn-jump-kf-style")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "btn-jump-kf-style";
    styleSheet.type = "text/css";
    styleSheet.innerText = `@keyframes btn-jump-kf { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } } .animate-jump { animation: btn-jump-kf 0.5s ease; }`;
    document.head.appendChild(styleSheet);
  }
}

function initSearchButtonEffect() {
  const searchButton = $("#btn_search");
  if (searchButton.length) {
    searchButton.on("mouseenter", function () {
      const searchIcon = $(this).find("i.fa-search");
      if (searchIcon.length) {
        searchIcon.addClass("animate-jump");
        setTimeout(() => {
          searchIcon.removeClass("animate-jump");
        }, 500);
      }
    });
  } else {
    console.warn("Search button #btn_search not found.");
  }
}

// Essa função serve para fazer insert de dados de rastreio de forma rápida
async function insert_manual_teste() {

    // Verifica no localStorage se já inseriu
    if (localStorage.getItem('testDataInserted') === 'true') {
        // console.log('Dados de teste já foram inseridos anteriormente.');
        return;
    }

  try {
    // 1. Pacote nacional em fase inicial
    await db.rastreios.add({
      codigo: "PL123456789BR",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Postado",
      data: new Date(),
      ultimaLocalizacao: "Curitiba - PR",
      previsaoEntrega: new Date("2025-05-08"),
    });

    // 2. Pacote internacional em trânsito
    await db.rastreios.add({
      codigo: "LX987654321CN",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Em trânsito internacional",
      data: new Date(),
      ultimaLocalizacao: "Centro de Distribuição - Shanghai/China",
      previsaoEntrega: new Date("2025-05-15"),
    });

    // 3. Pacote em fiscalização
    await db.rastreios.add({
      codigo: "RB123456789US",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Fiscalização aduaneira",
      data: new Date(),
      ultimaLocalizacao: "Alfândega - Miami/EUA",
      previsaoEntrega: new Date("2025-05-20"),
    });

    // 4. Pacote nacional saindo para entrega
    await db.rastreios.add({
      codigo: "PL987654321BR",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Saiu para entrega",
      data: new Date(),
      ultimaLocalizacao: "Centro de Distribuição - São Paulo/SP",
      previsaoEntrega: new Date("2025-05-05"), // Entrega próxima
    });

    // 5. Pacote internacional chegou ao Brasil
    await db.rastreios.add({
      codigo: "QM123456789DE",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Chegou ao país de destino",
      data: new Date(),
      ultimaLocalizacao: "Centro Internacional - Guarulhos/SP",
      previsaoEntrega: new Date("2025-05-12"),
    });

    // 6. Pacote atrasado
    await db.rastreios.add({
      codigo: "PL555555555BR",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Atrasado",
      data: new Date(),
      ultimaLocalizacao: "Agência dos Correios - Rio de Janeiro/RJ",
      previsaoEntrega: new Date("2025-05-18"),
    });

    // 7. Pacote devolvido
    await db.rastreios.add({
      codigo: "PL111111111BR",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Devolvido ao remetente",
      data: new Date(),
      ultimaLocalizacao: "Centro de Distribuição - Porto Alegre/RS",
      previsaoEntrega: null,
    });

    // 8. Pacote entregue
    await db.rastreios.add({
      codigo: "PL999999999BR",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Entregue",
      data: new Date(),
      ultimaLocalizacao: "Residência - Salvador/BA",
      previsaoEntrega: new Date("2025-05-03"),
    });

    // 9. Pacote parado na alfândega
    await db.rastreios.add({
      codigo: "ES123456789ES",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Parado na alfândega",
      data: new Date(),
      ultimaLocalizacao: "Madri - Espanha",
      previsaoEntrega: new Date("2025-06-01"),
    });

    // 10. Pacote em rota alterada
    await db.rastreios.add({
      codigo: "UK123456789GB",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Rota alterada",
      data: new Date(),
      ultimaLocalizacao: "Londres - Reino Unido",
      previsaoEntrega: new Date("2025-06-05"),
    });

    // 11. Pacote aguardando retirada
    await db.rastreios.add({
      codigo: "PL888888888BR",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Aguardando retirada",
      data: new Date(),
      ultimaLocalizacao: "Agência dos Correios - Florianópolis/SC",
      previsaoEntrega: new Date("2025-05-09"),
    });

    // 12. Pacote em processamento
    await db.rastreios.add({
      codigo: "FR123456789FR",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Processando",
      data: new Date(),
      ultimaLocalizacao: "Paris - França",
      previsaoEntrega: new Date("2025-05-25"),
    });

    // 13. Pacote extraviado (sem previsão)
    await db.rastreios.add({
      codigo: "IT123456789IT",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Extraviado",
      data: new Date(),
      ultimaLocalizacao: "Roma - Itália",
      previsaoEntrega: null,
    });

    // 14. Pacote em transporte local
    await db.rastreios.add({
      codigo: "NL123456789NL",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Em trânsito local",
      data: new Date(),
      ultimaLocalizacao: "Roterdã - Holanda",
      previsaoEntrega: new Date("2025-05-22"),
    });

    // 15. Pacote com entrega hoje
    await db.rastreios.add({
      codigo: "PL777777777BR",
      cpfCnpj: "12345678901",
      usuarioId: 1,
      status: "Saiu para entrega",
      data: new Date(),
      ultimaLocalizacao: "Centro de Distribuição - Belo Horizonte/MG",
      previsaoEntrega: new Date(), // Data do dia
    });
    // Marca no localStorage que já inseriu
    localStorage.setItem("testDataInserted", "true");
    // console.log("Dados de teste para fins educacionais inseridos com sucesso!");

  } catch (error) {
    console.error("Erro ao inserir dados de teste:", error);
  }
}
