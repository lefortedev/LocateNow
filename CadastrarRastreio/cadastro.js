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
 
 // Objeto global de validações
 const _validar = {
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    nome: (nome) => nome.trim().split(/\s+/).length >= 2,
    documento: (doc) => [11, 14].includes(doc.replace(/\D/g, '').length),
    codigo: (codigo) => /^[A-Z0-9]{8,12}$/i.test(codigo)
};

$(document).ready(function () {
    // Auto-foco
    setTimeout(() => $('#cpfCnpj').focus(), 100);
    
    // Máscara com debounce
    const debouncedApplyMask = _.debounce(function () {
        const value = $('#cpfCnpj').val().replace(/\D/g, '');
        $('#cpfCnpj').mask(applyMask(value));
    }, 300);
    
    // Eventos do campo CPF/CNPJ
    $('#cpfCnpj').on('input', function () {
        debouncedApplyMask();
        if (_validar.documento($(this).val())) {
            handleConsultarDocumento();
        }
    });
    
    // Eventos principais
    $('#btnConsultarDocumento').click(handleConsultarDocumento);
    $('#formCadastro').submit(handleSalvarRastreio);
    
});

  // Funções de manipulação de UI
  function preencherDados(dados, isExistingUser = false) {
   // Definindo os valores e tornando os campos readonly e disabled
    $('#nome').val(dados.nome).prop('readonly', true).prop('disabled', true);
    $('#email').val(dados.email).prop('readonly', true).prop('disabled', true);

    if (isExistingUser) {
        Swal.fire({
            icon: 'info',
            title: 'Usuário já cadastrado',
            text: 'Você pode adicionar um novo código de rastreio.',
            toast: true,
            position: 'top-end',
            timer: 3000
        });
    }
}

// Aplica máscara dinâmica
function applyMask(value) {
    return value.length <= 11 ? '000.000.000-00' : '00.000.000/0000-00';
}


function limparDados() {
    // Limpando os valores e removendo readonly e disabled
    $('#nome, #email').val('').prop('readonly', false).prop('disabled', false);
    $('#nome, #email, #cpfCnpj, #codigoRastreio').removeClass('is-valid is-invalid');
}

function marcarValidacao(campo, valido, mensagem = '') {
  const $campo = $(campo);
  const $grupo = $campo.closest('.mb-4'); // Encontra o grupo principal
  
  // Limpa estados anteriores
  $campo.removeClass('is-valid is-invalid');
  
  // Encontra os feedbacks RELATIVOS AO GRUPO
  const $invalid = $grupo.find('.invalid-feedback');
  const $valid = $grupo.find('.valid-feedback');

  if (valido) {
    $campo.addClass('is-valid');
    $valid.show();
    $invalid.hide();
  } else {
    $campo.addClass('is-invalid');
    $invalid.text(mensagem).show();
    $valid.hide();
  }
}


// Operações com o banco de dados
async function verificarUsuarioExistente(cpfCnpj) {
    try {
        return await db.usuarios.where('cpfCnpj').equals(cpfCnpj).first();
    } catch (error) {
        console.error('Erro na consulta:', error);
        throw new Error('Falha ao verificar usuário');
    }
}

// Consulta de documento
async function handleConsultarDocumento() {
    const doc = $('#cpfCnpj').val().replace(/\D/g, '');
    const btn = $('#btnConsultarDocumento');
    
    try {
        btn.prop('disabled', true).addClass('btn-loading');

        // Verifica se o campo está vazio
        if (!doc) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vazio',
                text: 'Por favor, preencha o CPF ou CNPJ antes de realizar a consulta.',
                confirmButtonText: 'Entendi'
            });
            marcarValidacao('#cpfCnpj', false);
            
            return;
        }

        // Valida o tamanho do documento
        if (!_validar.documento(doc)) {
            marcarValidacao('#cpfCnpj', false);
            throw new Error('Documento inválido');
        }

        // Consulta o usuário no IndexedDB
        const usuario = await verificarUsuarioExistente(doc);

        if (usuario) {
            preencherDados(usuario, true);
            marcarValidacao('#cpfCnpj', true);
            Swal.fire({
                icon: 'success',
                title: 'Usuário encontrado!',
                toast: true,
                position: 'top-end',
                timer: 2000
            });
        } else {
            limparDados();
            Swal.fire({
                icon: 'info',
                title: 'Novo cadastro',
                text: 'Preencha os dados do usuário',
                confirmButtonText: 'Entendi'
            });
        }
    } catch (error) {
        // Erros gerais não tratados anteriormente
        Swal.fire({
            icon: 'error',
            title: 'Erro na consulta',
            text: error.message,
            confirmButtonText: 'OK'
        });
    } finally {
        btn.prop('disabled', false).removeClass('btn-loading');
    }
}

// Submissão do formulário
async function handleSalvarRastreio(e) {
    e.preventDefault();
    const form = $(this);
    const btn = form.find('button[type="submit"]');
    
    try {
        btn.prop('disabled', true).addClass('btn-loading');

        const campos = {
            nome: $('#nome').val().trim(),
            email: $('#email').val().trim(),
            cpfCnpj: $('#cpfCnpj').val().replace(/\D/g, ''),
            codigoRastreio: $('#codigoRastreio').val().toUpperCase()
        };

        const validacoes = {
            nome: _validar.nome(campos.nome),
            email: _validar.email(campos.email),
            cpfCnpj: _validar.documento(campos.cpfCnpj),
            codigoRastreio: _validar.codigo(campos.codigoRastreio)
        };

        // Aplicar validações visuais
        marcarValidacao('#nome', validacoes.nome, validacoes.nome ? '' : 'Digite seu nome completo (mínimo 2 palavras).');
        marcarValidacao('#email', validacoes.email, validacoes.email ? '' : 'Informe um e-mail válido.');
        marcarValidacao('#cpfCnpj', validacoes.cpfCnpj, validacoes.cpfCnpj ? '' : 'CPF deve ter 11 ou CNPJ 14 dígitos numéricos.');
        marcarValidacao('#codigoRastreio', validacoes.codigoRastreio, validacoes.codigoRastreio ? '' : 'O código deve ter entre 8 e 12 letras ou números.');

        if (!Object.values(validacoes).every(v => v)) {
            const camposInvalidos = Object.entries(validacoes)
                .filter(([_, valido]) => !valido)
                .map(([campo]) => {
                    if (campo === 'cpfCnpj') return 'CPF/CNPJ';
                    return campo.charAt(0).toUpperCase() + campo.slice(1);
                });

            throw new Error(`Por favor, corrija os seguintes campos: ${camposInvalidos.join(', ')}`);
        }

        // Verificar se código já existe
        const codigoExistente = await db.rastreios.where('codigo').equals(campos.codigoRastreio).first();
        if (codigoExistente) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: "Este código de rastreio já está cadastrado.",
                confirmButtonText: 'Entendi'
            }).then(() => {
                setTimeout(() => $('#codigoRastreio').val('').focus(), 100);
            });
            return;
        }

        // Verificar/inserir usuário
        let usuarioId;
        const usuarioExistente = await verificarUsuarioExistente(campos.cpfCnpj);

        if (usuarioExistente) {
            usuarioId = usuarioExistente.pk;
        } else {
            usuarioId = await db.usuarios.add({
                nome: campos.nome,
                email: campos.email,
                cpfCnpj: campos.cpfCnpj
            });
        }

        // Adicionar rastreio
        const previsaoEntrega = new Date();
        previsaoEntrega.setDate(previsaoEntrega.getDate() + 5); // Pega a data atual e soma + 5 dias

        await db.rastreios.add({
            codigo: campos.codigoRastreio,
            cpfCnpj: campos.cpfCnpj,
            status: 'Aguardando coleta',
            usuarioId: usuarioId,
            data: new Date(),
            ultimaLocalizacao: "Centro de Distribuição - São Paulo/SP",
            previsaoEntrega: previsaoEntrega
        });

        await Swal.fire({
            icon: 'success',
            title: 'Cadastro realizado!',
            text: 'Redirecionando para tela inicial...',
            timer: 2000,
            willClose: () => window.location.href = '../Home/home.html'
        });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro no cadastro',
            text: error.message,
            confirmButtonText: 'Entendi'
        });
    } finally {
        btn.prop('disabled', false).removeClass('btn-loading');
    }
}