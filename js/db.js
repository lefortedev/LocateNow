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

// Inicializa o banco de dados Dexie
const db = new Dexie('LocateNowDB'); // Nome da Tabela no nevegador

// Definição das tabelas com índices otimizados
db.version(3).stores({ // Altere o indice a cada atualização na estrutura do banco ao add novas tables e campos
    usuarios: '++pk, cpfCnpj, nome, email', // Índice no CPF/CNPJ para buscas rápidas
    rastreios: '++id, codigo, cpfCnpj, usuarioId, status, data, ultimaLocalizacao, previsaoEntrega'
});

// Deixa o banco disponível globalmente em qualquer arquivo do projeto
window.db = db;
