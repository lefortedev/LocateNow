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

// Variável global para armazenar a instância do DataTable
let tableInstance = null;

// ===== Bloco Principal de Execução (DOM Ready) =====
$(document).ready(function() {

    // Inicializa efeitos visuais
    initParticles();
    initParticlesHoverEffect(); 
    initScrollReveal();
    addJumpAnimation(); 
    initSearchButtonEffect();

    // Configura listeners de eventos principais
    $('#btn_search').on('click', get_package);
    
    // Listener para o botão 'Cadastrar Novo Código'
    $(document).on('click', '.btn-outline-primary', function(event) {
        if ($(this).text().includes('Cadastrar Novo Código')) {
            if (typeof openPage === 'function') {
                openPage('../CadastrarRastreio/cadastro.html');
            } else {
                window.location.href = '../CadastrarRastreio/cadastro.html';
            }
        }
    });
});

// Função principal para buscar pacotes
async function get_package() {
    
    const input_search = $("#ipt_search").val().trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    // console.log('input_search:', input_search);

    if (input_search === '12345678901') {
        const rastreiosTeste = await db.rastreios.where('cpfCnpj').equals('12345678901').toArray();
        
        if (rastreiosTeste.length === 0 || rastreiosTeste.length < 15) {
            // Reativa a flag para permitir reinserção
            localStorage.setItem('testDataInserted', 'false');

            // Chama novamente a função com a flag agora "permitida"
            await insert_manual_teste();
        }
    }



    if (!input_search) {
        Swal.fire({ 
            icon: 'warning', 
            title: 'Oops...', 
            text: 'Digite um código de rastreio ou CPF.', 
            toast: true, 
            position: 'top-end', 
            showConfirmButton: false, 
            timer: 3000, 
            timerProgressBar: true, 
            background: '#fff', 
            color: '#333', 
            iconColor: '#f0ad4e' 
        });
        return;
    }

    try {
        const isCPF = input_search.length === 11;
        const resultados = isCPF
            ? await db.rastreios.where('cpfCnpj').equals(input_search).toArray()
            : await db.rastreios.where('codigo').equals(input_search).toArray();

        // console.log('Rastreios:', resultados);

        if (resultados.length === 0) {
            // Se já existe uma tabela, limpa os dados
            if (tableInstance) {
                tableInstance.clear().draw();
            }
            
            Swal.fire({ 
                icon: 'info', 
                title: 'Nenhum resultado encontrado', 
                text: 'Tente novamente com outro código ou CPF.', 
                confirmButtonText: 'OK', 
                background: '#fff', 
                color: '#333', 
                iconColor: '#5bc0de' 
            });
            return;
        }

        // Inicializa a tabela se ainda não foi feita
        if (!tableInstance) {
    
    tableInstance = $("#tabela-rastreamento").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json", 
            info: "", //  Remove o texto "Mostrando 1 a 5 de 15 registros"
            infoEmpty: "",
            infoFiltered: ""
        },
        paging: true,
        searching: true,
        info: true, // Pode deixar como true, pois estamos removendo só o texto
        ordering: true,
        responsive: true,
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50, 100],
        dom: '<"top"<"d-flex justify-content-between align-items-center"<"mb-3"l><"mb-3"f>>>rt<"bottom"<"d-flex justify-content-center"<"mb-3"p>>>',
        initComplete: function() {
            $('.dataTables_length select').addClass('form-select form-select-sm');
            $('.dataTables_filter input').addClass('form-control form-control-sm');
        },
        createdRow: function(row, data, dataIndex) {
            $(row).find('td').addClass('text-center');
        },
        drawCallback: function(settings) {
            $('.paginate_button').removeClass('btn-primary').addClass('btn-outline-primary');
            $('.paginate_button.current').removeClass('btn-outline-primary').addClass('btn-primary');
        }
    });
            
        } else {
            // Se a tabela já existe, limpa os dados
            tableInstance.clear();
        }

        // Adiciona os novos dados
        resultados.forEach(r => {
            let badgeClass = 'bg-secondary';
            let icon = '';
            switch (r.status.toLowerCase()) {
                case 'postado': case 'aguardando coleta': case 'processando':
                    badgeClass = 'bg-warning text-dark'; icon = '<i class="fas fa-clock me-1"></i>'; break;
                case 'em trânsito': case 'em trânsito internacional': case 'em trânsito local': case 'chegou ao país de destino': case 'entregue à transportadora': case 'saiu para entrega':
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
            
            tableInstance.row.add([
                `<span class="font-monospace">${r.codigo}</span>`,
                `<span class="badge ${badgeClass}">${icon}${r.status}</span>`,
                r.ultimaLocalizacao || '-',
                r.previsaoEntrega ? new Date(r.previsaoEntrega).toLocaleDateString('pt-BR') : '-'
            ]);
        });
        
        // Redesenha a tabela
        tableInstance.draw();
        
        // Scroll suave para a seção da tabela
        const tableSection = $('.table-responsive'); 
        if (tableSection.length) {
            $('html, body').animate({
                scrollTop: tableSection.offset().top - 100 
            }, 800);
        }

        Swal.fire({ 
            icon: 'success', 
            title: 'Resultados encontrados!', 
            text: `${resultados.length} registro(s) localizado(s).`, 
            toast: true, 
            position: 'top-end', 
            showConfirmButton: false, 
            timer: 2500, 
            timerProgressBar: true, 
            background: '#fff', 
            color: '#333', 
            iconColor: '#5cb85c' 
        });

    } catch (error) {
        console.error("Error fetching or processing data:", error);
        Swal.fire({ 
            icon: 'error', 
            title: 'Erro ao consultar dados', 
            text: 'Ocorreu um problema ao buscar as informações.', 
            confirmButtonText: 'Entendi', 
            background: '#fff', 
            color: '#333', 
            iconColor: '#d9534f' 
        });
    }
}

// Função para inicializar o DataTable (se ainda não existir)
function initializeDataTableIfNeeded() {
    // Só inicializa se a instância ainda não existir
    if (!tableInstance && $.fn.DataTable) { // Verifica também se DataTable está carregado
        console.log("Inicializando DataTable pela primeira vez.");
        try {
            tableInstance = $("#tabela-rastreamento").DataTable({
                language: {
                    url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json",
                    lengthMenu: "Mostrar _MENU_ resultados por página"
                },
                paging: true,
                searching: false, // Mantém busca desabilitada
                info: false,      // Mantém info desabilitado
                ordering: false,   // Mantém ordenação desabilitada
                responsive: true,
                pageLength: 5,
                lengthMenu: [5, 10, 25, 50, 100],
                // Usar a estrutura DOM padrão do Bootstrap 5 para garantir renderização correta dos controles
                dom: 
                    '<"row mb-3"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' + 
                    '<"row"<"col-sm-12"tr>>' + 
                    '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                // Adiciona classe text-center a todas as células da linha criada
                createdRow: function( row, data, dataIndex  ) {
                    $(row).find('td').addClass('text-center');
                },
                // Callback após desenho - útil para depuração ou aplicar estilos pós-renderização
                drawCallback: function( settings ) {
                    console.log( 'DataTable draw complete (Inicialização ou Paginação/Seleção).' );
                    // Garante que o select tenha as classes do Bootstrap após ser renderizado
                    $('.dataTables_length select').addClass('form-select form-select-sm').css('width', 'auto');
                }
            });
            console.log("DataTable inicializado com sucesso.");

        } catch (error) {
            console.error("Erro ao inicializar DataTable:", error);
            Swal.fire({ icon: 'error', title: 'Erro na Tabela', text: 'Não foi possível inicializar a tabela de dados.' });
            tableInstance = null; // Reseta para permitir nova tentativa
        }
    }
}

// Função para atualizar os dados da tabela (sem destruir)
function updateTableData(data) {
    if (!tableInstance) {
        console.error("Tentativa de atualizar dados, mas a instância do DataTable não existe.");
        initializeDataTableIfNeeded();
        if (!tableInstance) return;
    }

    console.log("Limpando dados antigos e adicionando novos...");
    try {
        tableInstance.clear(); // Limpa os dados existentes
        
        const mappedData = data.map(r => {
            let badgeClass = 'bg-secondary';
            let icon = '';
            switch (r.status.toLowerCase()) {
                case 'postado': case 'aguardando coleta': case 'processando':
                    badgeClass = 'bg-warning text-dark'; icon = '<i class="fas fa-clock me-1"></i>'; break;
                case 'em trânsito': case 'em trânsito internacional': case 'em trânsito local': case 'chegou ao país de destino': case 'entregue à transportadora': case 'saiu para entrega':
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
            return [
                `<span class="font-monospace">${r.codigo}</span>`,
                `<span class="badge ${badgeClass}">${icon}${r.status}</span>`,
                r.ultimaLocalizacao || '-',
                r.previsaoEntrega ? new Date(r.previsaoEntrega).toLocaleDateString('pt-BR') : '-'
            ];
        });

        tableInstance.rows.add(mappedData); // Adiciona as novas linhas
        tableInstance.draw(false); // Redesenha a tabela (false para manter a página atual)
        console.log("Dados da tabela atualizados e redesenhados.");

    } catch (error) {
        console.error("Erro ao atualizar dados do DataTable:", error);
        Swal.fire({ icon: 'error', title: 'Erro na Tabela', text: 'Não foi possível atualizar os dados na tabela.' });
    }
}