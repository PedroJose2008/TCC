// carrega os dados assim que a tela carrega 
document.addEventListener('DOMContentLoaded', function()  {
  const avatarBtn = document.getElementById('user-menu-btn');
  const userModal = document.getElementById('user-modal');

  // Alterna a exibição do modal ao clicar no avatar AL
  avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que o clique feche o modal imediatamente
    const isVisible = userModal.style.display === 'block';
    userModal.style.display = isVisible ? 'none' : 'block';
  });

  // Fecha o modal se o usuário clicar em qualquer outro lugar da tela
  document.addEventListener('click', (e) => {
    if (!userModal.contains(e.target) && e.target !== avatarBtn) {
      userModal.style.display = 'none';
	  
	  carregarDados();	
    }
  });
});

// Funções de clique dos botões do Modal
function sair() {
  if (confirm("Deseja realmente sair?")) {
    window.location.href = "login.html"; // manda o usuario  para o login
  }
}

	
	
	


function carregarDados(){

	// pego o nome que foi salvo no localStroge 
	const usuarioNome=localStorage.getItem('usuarioLogin');
	
	// aqui eu verifico se existe algum usuário logado 
	if(usuarioNome){
	
		//transformo o Json para usar ele depois
		const usuarioJson=JSON.parse(usuarioNome);
	}
	console.log(usuarioJson);
	
	
	
}

