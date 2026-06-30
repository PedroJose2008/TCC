
const API_SALVAR_USUARIOS="http://localhost:8000/usuarios/salvar";

//pega a opção usuario do switchTab e coloca ela como primeira, assim que o usuario entra na página a primeira opção é o usário   por foi esse parametro que eu coloquei 
let opcao="usuario";

let editandoId= null;

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
	
	
	
			
			
			if(!validaUsu()){
				return;//não deixa salvar se a função validar usuário estiver errada 
			}
			
			const inscricao = {
			        nome: document.getElementById("nome").value,
			        telefone: document.getElementById("telefone_usuario").value,
			        email: document.getElementById("email_usuario").value,
			        cpf: document.getElementById("cpf").value,
			        cargo: document.getElementById("cargo").value,
			        senha: document.getElementById("senha").value,
			        
			    };



			        if (editandoId) {
			            // update
			            await fetch(`${API_SALVAR_USUARIOS}/${editandoId}`, {
			                method: "PUT",
			                headers: {
			                    "Content-Type": "application/json"
			                },
			                body: JSON.stringify(inscricao)
			            });
			        } else {
			            // CREATE 
			            await fetch(API_SALVAR_USUARIOS, {
			                method: "POST",
			                headers: {
			                    "Content-Type": "application/json"
			                },
			                body: JSON.stringify(inscricao)
			            });
						alert('Cadastro realizado com sucesso');	
			        }

				
					
					
	
}

function validaUsu(){
	
	
	//pego a função válida nome 
	const nomeValido=validaNome();

	const telefoneValido= validaTelefone();
	
	const emailValido=validaEmail();
	
	const cpfValido=validarCPF();
	
	const senhaValido=validaSenha();
	
	// se estiver diferente da função válida nome não vai dexar salvar 
	if(!nomeValido){
		alert("Verifique se o campo nome está vazio,contém apenas números, se tem mais de 150 caracteres ou  menos de 3 caracteres  ")
		return false;
	}
	
	if(!telefoneValido){
		alert("Verifique se o campo telefone esta vazio ou com menos de 11 números")
		return false ;
	}
	
	if(!cpfValido){
		alert("Verifique o campo CPF e digite-o corretamente ")
		
	}
	
	if(!emailValido){
		alert("Verifique o campo Email e digite-o corretamente")
		return false 
	}
	
	if(!senhaValido){
		
		alert("As senhas não são iguais")
		return false;
	}
		
	return true;
	
		
}



// 	valida o nome 
function validaNome(){
	
	//pega o valor do input nome na tabela de usuário	
	const nomeInput=document.getElementById("nome");
	
	//dessa forma retira todos os espaços vazios do campo nome deixando somente as caracters 
	const nomeCerto= nomeInput.value.trim();
	
	if(nomeCerto.length===0){
	
		return false;
	}
	
	
	else if( nomeCerto.length<3){
		
		return false  ;
		
	}
	else if (nomeCerto.length>100){
		
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
   
    return false;
  }

  // se for menor que 11 ou maior que 11 não deixa salvar
  if (valorTelefone.length < 11 || valorTelefone.length > 11){
  
    return false;
  }
  
  return true;
}


function validaEmail(){
	
	const emailInput=document.getElementById("email_usuario");
	
	const emailcerto=emailInput.value.trim();
	
	
	if(emailcerto>100){
	return false;
		
	}
	
	return true;
}

	


function aplicarMascaraCPF(evento) {
    let input = evento.target;
    let valor = input.value;

    // Remove tudo o que não for número
    valor = valor.replace(/\D/g, "");

    // Aplica a formatação visual dinamicamente
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    // Devolve o valor formatado para o campo
    input.value = valor;
}


function validarCPF() {
    const cpfInput = document.getElementById("cpf");
    if (!cpfInput) return false;
    
    // Remove a máscara do cpf
    let cpf = cpfInput.value.replace(/[^\d]/g, '');
		
    // Verifica se tem 11 dígitos ou se é uma sequência repetida 
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        alert("CPF inválido! Por favor, confira os números.");
        return false;
    }

    // Validação do 1º dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = (resto === 10 || resto === 11) ? 0 : resto;

    if (digito1 !== parseInt(cpf.charAt(9))) {
        alert("CPF inválido! Por favor, confira os números.");
        return false;	        
    }

    // Validação do 2º dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = (resto === 10 || resto === 11) ? 0 : resto;

    if (digito2 !== parseInt(cpf.charAt(10))) {
        alert("CPF inválido! Por favor, confira os números.");
        return false;
    }

   
    return true;
}

function validaSenha(){
		
		const senha= document.getElementById("senha").value.trim();
		const confirmaSenha=document.getElementById("confirmaSenha").value.trim();
		
		// se o campo de senha e confirmar senha estiverem diferentes não deixa passar
		if(senha!==confirmaSenha){
			
			return false;
		}
		
	
		return true;
	}


// pego o o id de da cadastro, ele pega a date de hoje com o new Date e depois eu formato para o formato brasileiro
document.getElementById("dataCadastro").value = new Date().toLocaleDateString('pt-BR');









































































































