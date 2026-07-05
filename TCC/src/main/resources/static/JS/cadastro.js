
const API_SALVAR_USUARIOS="http://localhost:8001/usuarios/salvar";
const API_VERIFICA_CPF="http://localhost:8001/usuarios/validaCpf";
const API_VERIFICA_EMAIL="http://localhost:8001/usuarios/validaEmail";
const API_VERIFICA_TELEFONE="http://localhost:8001/usuarios/validaTelefone";



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


function redirecionarLogin(){
    console.log("Redirecionando para o login");
    window.location.href = "login.html";
}

//pega a opção que o usuário selecionou e chama a função de salvar , valida e com a API funcionando 
async function salvar(event){
	
	// so deixa o formulário regarregar na hora certa 
	event.preventDefault();
	
	if(opcao==="usuario" || salvarUsu===true){
		alert("salvando usuario");
		await salvarUsu();
		
	}
	
}


// salvo o usuário puxando a roda de salvar 
async function salvarUsu(){
	
	
	
			
			
			if(!validaUsu()){
				return;//não deixa salvar se a função validar usuário estiver errada 
			}
			
			const cpfInput=document.getElementById("cpf");
			const cpfValor= cpfInput.value;//pego o valor do input
			
			
			const reposnse= await fetch (`${API_VERIFICA_CPF}/${cpfValor}`)
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
			const telefoneSemEspaco=telefoneInput.value;
			
			const reposnseTelefone= await fetch (`${API_VERIFICA_TELEFONE}/${telefoneSemEspaco}`)
			const TelefoneExiste= await reposnseTelefone.json();
			
			console.log(TelefoneExiste);
			
			if(TelefoneExiste ||String(TelefoneExiste).trim() === "true"){
				alert("O telefone digitado já existe")
				return telefoneInput.value="";
			}
			
			console.log("Verificou o telefone");
			
			
	
			
			console.log("Começo de salvar")
			const inscricao = {
			        nome: document.getElementById("nome").value,
			        telefone: document.getElementById("telefone_usuario").value,
			        email: document.getElementById("email_usuario").value,
			        cpf: document.getElementById("cpf").value,
			        cargo: document.getElementById("cargo").value,
			        senha: document.getElementById("senha").value,
				 dataCadastro: document.getElementById("dataCadastro").value

			    };

				console.log("Passou pelos campos do input e entity")

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

				console.log("Salvou o usuário");
				redirecionarLogin();	
					
	
}

function validaUsu(){
	
	
	

	const telefoneValido= validaTelefone();
	
	const DDDvalido=DDDTelefone();
	
	const NumerosTelefoneValidos=validaNumerosTelefone();
	
	const emailValido=validaEmail();
		
	const senhaValido=validaSenha();
	
	
	
	// se estiver diferente da função válida nome não vai dexar salvar 

	
	if(!telefoneValido){
		alert("O campo telefone está com menos de 11 números")
		return false ;
	}
	
	if(!DDDvalido){
		alert("O DDD digitado não é válido! Por favor, corrija.")
		return false;
	}
	
	if(!NumerosTelefoneValidos){	
		return false;
	}
	
	if(!validarCPF()){
		alert("O CPF digitado é inválido")
		return false;
	}
	
	if(!emailValido){
		alert("Verifique o campo Email e digite-o corretamente")
		return false 
	}
	
	if(!senhaValido){
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
		alert("O nome não pode estar vazio")
		return false;
	}
	
	
	else if( nomeCerto.length<3){
		alert("A quantidade mínima de caracteres é 3")
		return false  ;
		
	}
	else if (nomeCerto.length>100){
		alert("A quantidade máxima de caracteres é 100")

		return false  ;
	} 
	
	else if(!isNaN(nomeCerto)){
			alert("O nome  não pode conter somente números")
			return false;
		}

	else {
		return true;
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
			alert("As senhas não são iguais")
			return false;
		}
		
		
		if(senha.length<6){
					alert("A senha não pode ter menos de 6 caracteres")
					return false;
				}
				
				if(confirmaSenha.length<6){
							alert("A senha não pode ter menos de 6 caracteres")
							return false;
						}
		
						
	else if(senha.length>50){
		alert("A senha não pode ter mais de 50 caracteres")
							return false;
	}
	
	else if(confirmaSenha.length>50){
			alert("A senha não pode ter mais de 50 caracteres")
								return false;
		}
		
		//lista de senhas que são inválidas 
		    const senhasProibidas = [
		        "123456", 
		        "123456789", 
		        "654321", 
		        "111111",
				"222222", 
				"333333",  
				"444444", 
				"555555",
				"666666", 
				"777777",    
				"888888",  
				"999999",  
				"101010",                          
		        "000000", 
		        "password123", 
				"password123456", 
				"senha123456", 
		        "senha123"
		    ];

		   // se estiver dentro da lista o que o usuário digitou eu barro
			if (senhasProibidas.includes(senha)) {
			        alert("Esta senha é muito fraca ! Por favor, digite outra.");
			        return false;
			    }
		
		
		else if(senhasProibidas.includes(confirmaSenha)){
					        return false;
		}
		
		
				
				
		return true;
	}


// pego o o id de da cadastro, ele pega a date de hoje com o new Date e depois eu formato para o formato brasileiro
document.getElementById("dataCadastro").value = new Date().toLocaleDateString('pt-BR');


function ValidaDDD(telefone) {
    // busco o que esta escrito no parenteses e retorno o que esta escrito dentro deles
    const ddd = telefone.match(/\(([^)]+)\)/)?.[1];
    
    /// Se não encontrou os parênteses ou o DDD veio vazio, não deixa passar
    if (!ddd) {
        return false;
    }
    
    // Lista com todos os DDDs válidos 
    const dddsValidos = [
        "11","12","13","14","15","16","17","18","19",
        "21","22","24","27","28",
        "31","32","33","34","35","37","38",
        "41","42","43","44","45","46","47","48","49",
        "51","53","54","55",
        "61","62","63","64","65","66","67","68","69",
        "71","73","74","75","77","79",
        "81","82","83","84","85","86","87","88","89",
        "91","92","93","94","95","96","97","98","99"
    ];

	//pego todos os DDDs se são válidos deixa passar 
    return dddsValidos.includes(ddd);
}

	function DDDTelefone(){
		const telefoneInput = document.getElementById("telefone_usuario");
		const valorTelefone = telefoneInput.value;
		
		
		// se o telefone digitado não tiver um DDD válido não deixa passar
				if (ValidaDDD(valorTelefone) === false) {
				    return false; 
				}
		
		
		
		
		return true;
	}
 

	function validaNumerosTelefone(){
		
		const telefoneInput = document.getElementById("telefone_usuario");
				const valorTelefone = telefoneInput.value;
				
				
		//removo tudo que não for número
				const TelefonePuro=valorTelefone.replace(/\D/g,"")		
				
				//pego os números depois do parenteses 
				const TelefoneNumeros=TelefonePuro.substring(2)
				
				//verifico se os números digitados são iguais
				const TelefoneRepetido=/^(\d)\1{8}$/.test(TelefoneNumeros);
				
				if(TelefoneRepetido){
					alert("Esté número de telefone é inválido!Não é permitido números números iguais")
					return false;
				}
				
				return true;
	}

 
























































































//










