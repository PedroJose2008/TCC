
const API_SALVAR_USUARIOS="http://localhost:8000/usuarios/salvar";
const API_VERIFICA_CPF="http://localhost:8000/usuarios/validaCpf";
const API_VERIFICA_EMAIL="http://localhost:8000/usuarios/validaEmail";
const API_VERIFICA_TELEFONE="http://localhost:8000/usuarios/validaTelefone";



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
		alert("salvando usuario");
		salvarUsu();
	}
	
}


// salvo o usuário puxando a roda de salvar 
async function salvarUsu(){
	
	
	
			
			
			if(!validaUsu()){
				return;//não deixa salvar se a função validar usuário estiver errada 
			}
			
			const cpfInput=document.getElementById("cpf");
			const cpfSemEspaco = cpfInput.value.replace(/\D/g, '');
			
			const reposnse= await fetch (`${API_VERIFICA_CPF}/${cpfSemEspaco}`)
			const cpfExiste= await reposnse.json();
			
			console.log(cpfExiste);
			
			if(cpfExiste){
				
				alert("O CPF digitado já existe ")
				return cpfInput.value="";
			}
			
			console.log("verificou o cpf")
			
			const emailInput=document.getElementById("email_usuario");
			const emailSemEspaco= emailInput.value.trim();
			
			const reposnseEmail= await fetch (`${API_VERIFICA_EMAIL}/${emailSemEspaco}`)
			const emailExiste= await reposnseEmail.json();
			
			console.log(emailExiste)
			
			if(emailExiste){
				alert("O email digitado já existe")
				return emailInput.value="";
			}
			console.log("verificou o email ")
			
			const telefoneInput=document.getElementById("telefone_usuario");
			const telefoneSemEspaco=telefoneInput.value.replace(/\D/g, '');
			
			const reposnseTelefone= await fetch (`${API_VERIFICA_TELEFONE}/${telefoneSemEspaco}`)
			const TelefoneExiste= await reposnseTelefone.json();
			
			console.log(TelefoneExiste);
			
			if(TelefoneExiste){
				alert("O telefone digitado já existe")
				return telefoneInput.value="";
			}
			
			console.log("Verificou o telefone");
			
			const inscricao = {
			        nome: document.getElementById("nome").value,
			        telefone: document.getElementById("telefone_usuario").value,
			        email: document.getElementById("email_usuario").value,
			        cpf: document.getElementById("cpf").value,
			        cargo: document.getElementById("cargo").value,
			        senha: document.getElementById("senha").value,
				 dataCadastro: document.getElementById("dataCadastro").value

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
	console.log(cpfValido);
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
		alert("O CPF digitado é inválido")
		return false;
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
		validarNome(nomeInput);
		return true;
	}
	


}

function validarNome(input) {
  // Impede que o valor seja digitado se contiver apenas números
  if (/^\d+$/.test(input.value)) {
	
    input.value = ""; // Limpa se o usário digitar somente números 
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
	
	
	if(emailcerto.length>100){
	return false;
		
	}
	
	return true;
}
// email
	
function aplicarMascaraCPF(evento) {
    let input = evento.target;
    let valor = input.value;

    // 1. Remove tudo o que não for número
    valor = valor.replace(/\D/g, "");

    // 2. Aplica a formatação correta de forma progressiva conforme digita
    if (valor.length > 3) {
        valor = valor.substring(0, 3) + '.' + valor.substring(3);
    }
    if (valor.length > 7) {
        valor = valor.substring(0, 7) + '.' + valor.substring(7);
    }
    if (valor.length > 11) {
        valor = valor.substring(0, 11) + '-' + valor.substring(11, 13);
    }

    // 3. Devolve o valor formatado de volta para o campo
    input.value = valor;
}

function validarCPF(cpf) {

	
	
	
	  var Soma = 0
	  var Resto
		console.log(document.getElementById("cpf").value);
	  
	  const cpfInput = document.getElementById("cpf").value;
	      if (!cpfInput) return false;
	  
	  var strCPF = String(cpfInput).replace(/[^\d]/g, '')
	  
	  if (strCPF.length !== 11)
	     return false
	  
	  if ([
	    '00000000000',
	    '11111111111',
	    '22222222222',
	    '33333333333',
	    '44444444444',
	    '55555555555',
	    '66666666666',
	    '77777777777',
	    '88888888888',
	    '99999999999',
	    ].indexOf(strCPF) !== -1)
	    return false

	  for (i=1; i<=9; i++)
	    Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);

	  Resto = (Soma * 10) % 11

	  if ((Resto == 10) || (Resto == 11)) 
	    Resto = 0

	  if (Resto != parseInt(strCPF.substring(9, 10)) )
	    return false

	  Soma = 0

	  for (i = 1; i <= 10; i++)
	    Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)

	  Resto = (Soma * 10) % 11

	  
	
	  if ((Resto == 10) || (Resto == 11)) 
	    Resto = 0

	  if (Resto != parseInt(strCPF.substring(10, 11) ) )
	    return false

	  return true
	}




//valida senha
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









































































































