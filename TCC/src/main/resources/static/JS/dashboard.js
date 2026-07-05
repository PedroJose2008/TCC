// carrega os dados assim que a tela carrega 
//js dashboard
document.addEventListener('DOMContentLoaded', function()  {
  const avatarBtn = document.getElementById('user-menu-btn');
  const userModal = document.getElementById('user-modal');

  carregarDados();	
  
  // Alterna a exibição do modal ao clicar no avatar
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const isVisible = userModal.style.display === 'block';
      userModal.style.display = isVisible ? 'none' : 'block';
    });

    // Fecha o modal se o usuário clicar em qualquer outro lugar da tela
    document.addEventListener('click', (e) => {
      if (!userModal.contains(e.target) && e.target !== avatarBtn) {
        userModal.style.display = 'none';
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

	// pego o texto bruto que foi salvo no localStorage 
	  const usuarioNomeBruto = localStorage.getItem('usuarioLogin');
	  
	  // aqui eu verifico se existe algum usuário logado 
	  if (usuarioNomeBruto) {
	    
	    const usuarioJson = JSON.parse(usuarioNomeBruto);
	    console.log("Carregou o usuário com sucesso:", usuarioJson);
	    
	    // pego os elementos do meu HTML
	    const nomePessoa = document.getElementById('modal-username');	
	    const cargoPessoa = document.querySelector('.user-role-subtitle');
	    const avatarPessoa = document.getElementById('user-menu-btn');
	    
	    // vou colocar o nome da pessoa 
	    if (nomePessoa && usuarioJson.nome) {
	    	//transformo o modal do nome para o nome do uusário 
	      nomePessoa.textContent = "Bem vindo, " + usuarioJson.nome;
	    }

	    // pego o cargo do meu usuário
	    if (cargoPessoa && usuarioJson.cargo) {
	    
			//resgato o cargo do usuário do mesmo jeito que esta salvo no bano de dados
	      cargoPessoa.textContent = usuarioJson.cargo;
	    }
	    
	    // agora vou mudar as iniciais do botão azul 
	    if (avatarPessoa && usuarioJson.nome) {
			// pego o nome completo do usuario 
			// removo todos os espaços, depois usando o splint eu quebro o nome do usuário em partes 
	      const NomeEmPartes = usuarioJson.nome.trim().split(" ")
		  
		  // pego a Inicial da primeira parte depois junto a primeira inicial com a segunda, se o usuário não tiver sobrenome não deixa passar
		  const iniciais= NomeEmPartes[0][0]+(NomeEmPartes[1] ? NomeEmPartes[1][0]: "");
		  
		  // pego as duas primerias letras da variavel e o toUpperCase deixa maiúsculo
	      avatarPessoa.textContent = iniciais.toUpperCase();

	    }
	  } 
	  else {
	   //Se não encontrar os dados do usuário volta para o login 
	    window.location.href = "login.html";
	  }
	}