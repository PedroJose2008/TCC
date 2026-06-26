const API_SALVAR_CLIENTES="http://localhost:8000/clientes/salvar";
const API_SALVAR_FORNECEDORES="http://localhost:8000/fornecedores/salvar";
const API_SALVAR_USUARIOS="http://localhost:8000/usuarios/salvar";

//pega a opção usuario do switchTab e coloca ela como primeira, assim que o usuario entra na página a primeira opção é o usário   por foi esse parametro que eu coloquei 
let opcao="usuario";

//pega o parametro que o usuário clicou, seja ele usuário, fornecedor ou cliente
function switchTab(type) {
  
	opcao=type;
	
	document.querySelectorAll('.tab-btn').forEach((btn, index) => {
    const types = ['usuario'];
    if(types[index] === type) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`conteudo-${type}`).classList.add('active');
  document.getElementById('tipo_conta').value = type;

  
}



//pega a opção que o usuário selecionou e chama a função de salvar , valida e com a API funcionando 
async function salvar(){
	
	if(opcao==="usuario"){
		alert("salvando usuario");
		salvarUsu();
	}
	
}


// salvo o usuário puxando a roda de salvar 
async function salvarUsu(){
	
	//valida
	validaUsu();
	
	
}

// 	validotodos os os campos do formúlario 
function validaUsu(){
	
	//pega o valor do input nome na tabela de usuário	
	const nomeInput=document.getElementById("nome");
	
	//dessa forma retira todos os espaços vazios do campo nome deixando somente as caracters 
	const nomeCerto= nomeInput.value.trim();
	
	if(nomeCerto.length<3){
		alert("Nome muito pequeno, por favor digite um nome válido")
		//apaga o que o usuário digitou 
		return  nomeInput.value="";
	}
	
	
	
	
	
}














































































































