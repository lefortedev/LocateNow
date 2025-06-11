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

// Base de conhecimento do chatbot - Respostas inteligentes baseadas em palavras-chave
const chatbotKnowledge = {
  // === PALAVRAS-CHAVE: RASTREAR / LOCALIZAR PACOTE ===
  "rastrear|rastreamento|localizar|rastrear pacote|rastreio|rastreie|procure|procurar|rastrear código|rastrear objeto|rastrear encomenda": [
    "Para rastrear uma encomenda, digite o código de rastreamento ou seu CPF.",
    "Exemplos:<br>- Código: PL123456789BR<br>- CPF: 12345678901"
  ],
  // === PALAVRAS-CHAVE: STATUS DO PACOTE ===
  "status|situação|onde está|onde esta|posicao|posição|estado|como vai|como está|atualização|atualizacao": [
    "Os status mais comuns são:",
    "- Postado<br>- Em trânsito<br>- Saiu para entrega<br>- Entregue<br>- Fiscalização aduaneira",
    "Digite um código de rastreamento para saber o status em tempo real."
  ],
  // === PALAVRAS-CHAVE: PREVISÃO DE ENTREGA / PRAZO ===
  "tempo|prazo|entrega|previsão|previsto|chega|quando chega|data de entrega|data prevista|data de chegada": [
    "O prazo de entrega varia conforme o tipo de serviço:",
    "- PAC: 3 a 10 dias úteis<br>- SEDEX: 1 a 3 dias úteis<br>- SEDEX Hoje: no mesmo dia",
    "Use o código do pacote para ver a previsão exata."
  ],
  // === PALAVRAS-CHAVE: ERROS COMUNS NO CÓDIGO / CPF ===
  "não encontrado|nao achei|codigo invalido|cpf errado|nao localizado|nao existe|invalido": [
    "Código ou CPF não encontrado. Verifique se digitou corretamente.",
    "Exemplo válido: PL123456789BR ou 12345678901 (CPF)"
  ],
  // === PALAVRAS-CHAVE: ATRASOS E PROBLEMAS ===
  "extraviado|perdido|atrasado|demorando|demora|muito tempo|parado|sem atualização|sem movimento|rota alterada": [
    "Se seu pacote está atrasado ou sem atualizações, pode estar em análise, fiscalização ou em trânsito.",
    "Informe o código para verificar detalhes específicos."
  ],
  // === PALAVRAS-CHAVE: ALFÂNDEGA / FISCALIZAÇÃO ADUANEIRA ===
  "alfândega|aduana|fiscalizacao|fiscalização|imposto|taxa|retenção|liberação|lacre|despachante": [
    "Pacotes internacionais podem ficar na alfândega por até 15 dias úteis.",
    "Verifique o status com o código do pacote."
  ],
  // === PALAVRAS-CHAVE: INFORMAÇÕES GERAIS SOBRE O CHATBOT ===
  "ajuda|suporte|funciona|como usar|como funciona|para que serve|ajude me|preciso de ajuda|oque voce faz|oque você faz|sobre|informações": [
    "Posso te ajudar com:",
    "- Rastreamento por código ou CPF<br>- Status de encomendas<br>- Prazos de entrega<br>- Problemas com pacotes",
    "Digite um código de rastreamento ou seu CPF para consultar."
  ],
  // === PALAVRAS-CHAVE: FUNCIONAMENTO DO SISTEMA ===
  "chatbot|inteligência artificial|bot|automático|funcionamento|plataformas|disponibilidade|horário|24 horas|whatsapp|telegram|site": [
    "O chatbot da LocateNow funciona 24 horas por dia nas plataformas WhatsApp, Telegram e site oficial.",
    "Você não precisa fazer cadastro — basta enviar o código de rastreamento."
  ],
  // === RESPOSTA PADRÃO PARA PERGUNTAS NÃO COBERTAS ===
  "default": [
    "Posso te ajudar com:",
    "- Rastreamento por código ou CPF<br>- Status de encomendas<br>- Prazos de entrega<br>- Problemas com pacotes",
    "Digite um código de rastreamento ou seu CPF para consultar."
  ]
};

// Inicialização do chatbot - Adiciona o botão e janela do chat ao DOM
$(document).ready(function() {
  // Garante que o botão do chatbot só seja criado uma única vez
  if ($('#chatbotToggle').length === 0) {
    $('body').append(`
      <div class="chatbot-container">
        <button class="chatbot-toggle" id="chatbotToggle">
          <i class="fas fa-robot"></i>
        </button>
        <div class="chatbot-window" id="chatbotWindow">
          <div class="chatbot-header">
            <h3>Assistente LocateNow</h3>
            <button class="chatbot-close" id="chatbotClose">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="chatbot-messages" id="chatbotMessages">
            <div class="message message-bot">
              Olá! Sou o assistente da LocateNow. Posso te ajudar com informações sobre seus pacotes.
            </div>
          </div>
          <div class="chatbot-input">
            <input type="text" id="chatbotInput" placeholder="Digite um código ou sua pergunta...">
            <button id="chatbotSend">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `);
  }

  // Toggle chatbot window - Abre/fecha o chatbot ao clicar no botão
  $('#chatbotToggle').off('click').on('click', function() {
    $('#chatbotWindow').toggleClass('active');
    if ($('#chatbotWindow').hasClass('active')) {
      $('#chatbotInput').focus();
    }
  });

  // Fecha o chatbot ao clicar no X
  $('#chatbotClose').off('click').on('click', function() {
    $('#chatbotWindow').removeClass('active');
  });

  // Envia mensagem ao pressionar Enter
  $('#chatbotInput').keypress(function(e) {
    if (e.which === 13) {
      sendMessage();
    }
  });

  // Envia mensagem ao clicar no botão de envio
  $('#chatbotSend').off('click').on('click', sendMessage);

  // Muda o ícone do botão para lupa quando há texto digitado
  $('#chatbotInput').on('input', function () {
    const hasText = $(this).val().trim() !== '';
    const $toggle = $('#chatbotToggle');

    if (hasText) {
      $toggle.addClass('lupa');
      $toggle.html('<i class="fas fa-search"></i>');
    } else {
      $toggle.removeClass('lupa');
      $toggle.html('<i class="fas fa-robot"></i>');
    }
  });

  // Envia a mensagem automaticamente ao clicar no botão com a lupa ativa
  $(document).on('click', '#chatbotToggle', function () {
    const $toggle = $(this);
    if ($toggle.hasClass('lupa')) {
      const message = $('#chatbotInput').val().trim();
      if (message) {
        addUserMessage(message);
        $('#chatbotInput').val('');
        processMessage(message);
        $toggle.removeClass('lupa').html('<i class="fas fa-robot"></i>');
      }
    }
  });
});

// Função para enviar uma nova mensagem do usuário
async function sendMessage() {
  const input = $('#chatbotInput');
  const message = input.val().trim();
  if (message) {
    addUserMessage(message);
    input.val('');

    // Mostra indicador de digitação do bot
    const typingIndicator = $('<div class="typing-indicator"><span></span><span></span><span></span></div>');
    $('#chatbotMessages').append(typingIndicator);
    $('#chatbotMessages').scrollTop($('#chatbotMessages')[0].scrollHeight);

    // Processa a mensagem após um pequeno delay
    setTimeout(async () => {
      typingIndicator.remove();
      await processMessage(message);
    }, 1000);
  }
}

// Exibe uma mensagem do usuário no chat
function addUserMessage(text) {
  $('#chatbotMessages').append(`<div class="message message-user">${text}</div>`);
  $('#chatbotMessages').scrollTop($('#chatbotMessages')[0].scrollHeight);
}

// Exibe uma mensagem do bot no chat (aceita HTML)
function addBotMessage(text, isHTML = false) {
  if (isHTML) {
    $('#chatbotMessages').append(`<div class="message message-bot">${text}</div>`);
  } else {
    $('#chatbotMessages').append(`<div class="message message-bot">${text.replace(/\n/g, '<br>')}</div>`);
  }
  $('#chatbotMessages').scrollTop($('#chatbotMessages')[0].scrollHeight);
}

// Processa a mensagem do usuário e decide a resposta apropriada
async function processMessage(message) {
  const lowerMessage = message.toLowerCase();

  // Verifica se há um código de rastreamento na mensagem
  const codeMatch = message.match(/[A-Z]{2}\d{9}[A-Z]{2}|\d{11}/i);
  if (codeMatch) {
    const cleanQuery = codeMatch[0].replace(/[^a-z0-9]/gi, '').toUpperCase();
    await handleTrackingQuery(cleanQuery);
    return;
  }

  // Procura por palavras-chave e retorna respostas relevantes
  let responseFound = false;
  for (const [keywords, responses] of Object.entries(chatbotKnowledge)) {
    if (new RegExp(`\\b(${keywords})\\b`, 'i').test(lowerMessage)) {
      responses.forEach(r => addBotMessage(r, true));
      responseFound = true;
      break;
    }
  }

  // Se nenhuma palavra-chave corresponder, mostra a resposta padrão
  if (!responseFound) {
    chatbotKnowledge.default.forEach(r => addBotMessage(r, true));
  }
}

// Função principal de consulta de rastreamento
async function handleTrackingQuery(query) {
  try {
    const cleanQuery = query.replace(/[^a-z0-9]/gi, '').toUpperCase();

    // Verifica se é um CPF (11 dígitos)
    if (/^\d{11}$/.test(cleanQuery)) {
      const resultados = await db.rastreios.where('cpfCnpj').equals(cleanQuery).toArray();
      if (resultados.length === 0) {
        addBotMessage(`Nenhum pacote encontrado para o CPF ${cleanQuery}.`);
        return;
      }
      addBotMessage(`Encontrei ${resultados.length} pacote(s) para o CPF ${cleanQuery}:`);
      resultados.forEach(pacote => {
        const statusBadge = getStatusBadge(pacote.status);
        addBotMessage(`
          <strong>Código:</strong> ${pacote.codigo}<br>
          <strong>Status:</strong> ${statusBadge}<br>
          <strong>Última localização:</strong> ${pacote.ultimaLocalizacao || '-'}<br>
          <strong>Previsão de entrega:</strong> ${pacote.previsaoEntrega ? new Date(pacote.previsaoEntrega).toLocaleDateString('pt-BR') : '-'}
        `, true);
      });
      return;
    }

    // Trata como código de rastreamento
    const pacote = await db.rastreios.where('codigo').equals(cleanQuery).first();
    if (!pacote) {
      addBotMessage(`Código ${cleanQuery} não encontrado. Verifique se digitou corretamente.`);
      return;
    }

    const statusBadge = getStatusBadge(pacote.status);
    addBotMessage(`
      <strong>Informações do pacote ${cleanQuery}:</strong><br><br>
      <strong>Status:</strong> ${statusBadge}<br>
      <strong>Última localização:</strong> ${pacote.ultimaLocalizacao || '-'}<br>
      <strong>Previsão de entrega:</strong> ${pacote.previsaoEntrega ? new Date(pacote.previsaoEntrega).toLocaleDateString('pt-BR') : '-'}
    `, true);

    // Mensagens personalizadas com base no status
    if (pacote.status.toLowerCase().includes('alfândega')) {
      addBotMessage("Seu pacote está na alfândega. O processo de liberação pode levar de 5 a 15 dias úteis.");
    } else if (pacote.status.toLowerCase().includes('trânsito')) {
      addBotMessage("Seu pacote está a caminho. Acompanhe diariamente para atualizações.");
    } else if (pacote.status.toLowerCase().includes('entregue')) {
      addBotMessage("Pacote entregue! Caso não tenha recebido, verifique com vizinhos ou porteiro.");
    }
  } catch (error) {
    console.error("Erro ao consultar pacote:", error);
    addBotMessage("Ocorreu um erro ao consultar o banco de dados. Tente novamente mais tarde.");
  }
}

// Gera um badge visual com base no status do pacote
function getStatusBadge(status) {
  let badgeClass = 'bg-secondary';
  let icon = '';
  switch (status.toLowerCase()) {
    case 'postado': case 'aguardando coleta': case 'processando':
      badgeClass = 'bg-warning text-dark'; icon = '<i class="fas fa-clock me-1"></i>'; break;
    case 'em trânsito': case 'em trânsito internacional': case 'em trânsito local': 
    case 'chegou ao país de destino': case 'entregue à transportadora': case 'saiu para entrega':
      badgeClass = 'bg-info text-white'; icon = '<i class="fas fa-truck me-1"></i>'; break;
    case 'fiscalização aduaneira': case 'parado na alfândega':
      badgeClass = 'bg-secondary text-white'; icon = '<i class="fas fa-passport me-1"></i>'; break;
    case 'atrasado': case 'extraviado': case 'rota alterada':
      badgeClass = 'bg-danger text-white'; icon = '<i class="fas fa-exclamation-triangle me-1"></i>'; break;
    case 'aguardando retirada':
      badgeClass = 'bg-primary text-white'; icon = '<i class="fas fa-store me-1"></i>'; break;
    case 'devolvido ao remetente':
      badgeClass = 'bg-dark text-white'; icon = '<i class="fas fa-undo me-1"></i>'; break;
    case 'entregue':
      badgeClass = 'bg-success text-white'; icon = '<i class="fas fa-check-circle me-1"></i>'; break;
    default:
      badgeClass = 'bg-light text-dark border'; icon = '<i class="fas fa-info-circle me-1"></i>';
  }
  return `<span class="badge ${badgeClass}">${icon}${status}</span>`;
}