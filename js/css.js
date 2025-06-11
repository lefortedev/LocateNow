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

$(document).ready(async function(){
    await custom_header();
});

async function custom_header() {
    
    const dropdown = document.querySelector('.dropdown-hover');
    const button = document.querySelector('.menu-button');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Controle de estado
    let isOpen = false;
  
    // Hover no dropdown (desktop)
    dropdown.addEventListener('mouseenter', () => {
        menu.classList.add('show');
        button.classList.add('active');
        isOpen = true;
    });
    
    dropdown.addEventListener('mouseleave', (e) => {
        if (!dropdown.contains(e.relatedTarget)) {
            closeDropdown();
        }
    });
    
    // Clique no botão (mobile/desktop)
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        button.classList.toggle('active', isOpen);
        menu.classList.toggle('show', isOpen);
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
    
    function closeDropdown() {
        menu.classList.remove('show');
        button.classList.remove('active');
        isOpen = false;
    }
  }

  