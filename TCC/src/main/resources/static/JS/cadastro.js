
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
async function salvar(event){
	
	// so deixa o formulário regarregar na hora certa 
	event.preventDefault();
	
	if(opcao==="usuario"){
		//alert("salvando usuario");
		salvarUsu();
	}
	
}


// salvo o usuário puxando a roda de salvar 
async function salvarUsu(){
	
	//valida
	validaUsu();
	
	
}

function validaUsu(){
	
	validaNome();
	validaTelefone();
	validarCPF();
	
	
}



// 	valida o nome 
function validaNome(){
	
	//pega o valor do input nome na tabela de usuário	
	const nomeInput=document.getElementById("nome");
	
	//dessa forma retira todos os espaços vazios do campo nome deixando somente as caracters 
	const nomeCerto= nomeInput.value.trim();
	
	if(nomeCerto.length===0){
		alert("Nome não pode ser vazio	")
		return false;
	}
	
	
	else if( nomeCerto.length<3){
		alert("Nome muito pequeno, por favor digite um nome maior");
		return false  ;
		
	}
	else if (nomeCerto.length>100){
		alert("Nome muito grande, por favor digite um nome menor");
		return false  ;
	} 
	else {
		//pega a função de validar nome
		validarNome(nome);
	}
	


}

function validarNome(input) {
  // Impede que o valor seja digitado se contiver apenas números
  if (/^\d+$/.test(input.value)) {
	alert("Você não pode digitar números")
    input.value = ""; // Limpa o campo se for exclusivamente numérico
  }
}


function mascaraTelefone(input) {
  let valor = input.value;
  
  // 1. Remove tudo o que não for número
  valor = valor.replace(/\D/g, "");
  
  if (valor.length > 0) {
    valor = "(" + valor;
  }
  if (valor.length > 3) {
    
    valor = valor.slice(0, 3) + ") " + valor.slice(3);
  }
  if (valor.length > 10) {
    valor = valor.slice(0, 10) + "-" + valor.slice(10, 14);
  } else if (valor.length > 7) {
    // Enquanto o usuário digita (formato fixo temporário): (XX) XXXX-XXXX
    valor = valor.slice(0, 9) + "-" + valor.slice(9);
  }
  
  // 3. Devolve o valor formatado para o input
  input.value = valor; 
}

function validaTelefone(){
  const telefoneInput = document.getElementById("telefone_usuario");
  const valorTelefone = telefoneInput.value.replace(/\D/g, ""); // Pega apenas os números para validar o tamanho

  // pega o valor do input e também tira os espaços vazios
  if (valorTelefone.length === 0){
    alert("O número de telefone não pode estar vazio");
    return false;
  }

  // Celulares no Brasil com DDD possuem 11 dígitos (ex: 11 99999-9999)
  if (valorTelefone.length < 11 || valorTelefone.length > 11){
    alert("O número de telefone deve ter 1 dígitos (com o DDD)");
    return false;
  }
  
  return true;
}


	

function validarCPF(cpf) {
	
	const cpfInput = document.getElementById("cpf");
	    if (!cpfInput) return false;
		
	    // CORREÇÃO: Usamos o .value para pegar o texto e guardamos na variável 'cpf' que já existia
	    cpf = cpfInput.value.replace(/[^\d]/g, '');
		
		
    // Verifica se tem 11 dígitos ou se é uma sequência de números repetidos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
		alert("CPF inválido! Por favor, confira os números.");

       
    }

    // Validação do 1º dígito
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = (resto === 10 || resto === 11) ? 0 : resto;

    if (digito1 !== parseInt(cpf.charAt(9))) {
		alert("CPF inválido! Por favor, confira os números.");
					        
    }

    // Validação do 2º dígito
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = (resto === 10 || resto === 11) ? 0 : resto;

    if (digito2 !== parseInt(cpf.charAt(10))) {
		alert("CPF inválido! Por favor, confira os números.");
		return cpfInput.value="";
    }


}












































































































