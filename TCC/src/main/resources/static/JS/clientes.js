const API_BUSCAR_TODOS = "http://192.168.10.22:8013/clientes/listartodos";
const API_BUSCAR_ID = "http://192.168.10.22:8013/clientes/listarporid";
const API_GRAVAR = "http://192.168.10.22:8013/clientes/atualizar";
const API_SALVAR = "http://192.168.10.22:8013/clientes/salvar";
const API_DELETAR = "http://192.168.10.22:8013/clientes/deletar";
const API_BUSCAR_NOME = "http://192.168.10.22:8013/clientes/buscarPorNome";

const API_VERIFICA_CPF="http://192.168.10.22:8013/clientes/validaCpf";
const API_VERIFICA_EMAIL="http://192.168.10.22:8013/clientes/validaEmail";
const API_VERIFICA_TELEFONE="http://192.168.10.22:8013/clientes/validaTelefone";


let editandoId = null;

async function listarClientes() {

    const response = await fetch(API_BUSCAR_TODOS);
    const clientes = await response.json();

    const tbody = document.getElementById("clienteTableBody");
    tbody.innerHTML = "";

    clientes.forEach(cli => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${cli.razaoSocial}</td>
            <td>${cli.cpfCnpj}</td>
            <td>${cli.telefone || '-'}</td>
            <td>${cli.email || '-'}</td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="editar(${cli.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deletar(${cli.id})">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function abrirModal() {

    document.getElementById("modalTitulo").innerText = "Adicionar Novo Cliente";
    document.getElementById("clienteModal").classList.add("active");
}

function fecharModal() {

    document.getElementById("clienteModal").classList.remove("active");
    limparFormulario();
}

function limparFormulario() {

    document.getElementById("razaoSocial").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("cep").value = "";
    document.getElementById("numero").value = "";
    document.getElementById("complemento").value = "";
    editandoId = null;
}

async function deletar(id) {

    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    await fetch(`${API_DELETAR}/${id}`, {
        method: "DELETE"
    });

    listarClientes();
}

//editar
async function editar(id) {
    const response = await fetch(`${API_BUSCAR_ID}/${id}`);
    const cli = await response.json();
    
    console.log("Pegando os dados do cliente ", cli);

    editandoId = id;
    document.getElementById("modalTitulo").innerText = "Editar Cliente";

    document.getElementById("razaoSocial").value = cli.razaoSocial || "";
    document.getElementById("telefone").value = cli.telefone || "";
    document.getElementById("email").value = cli.email || "";
    
    document.getElementById("cpf").value = cli.cpfCnpj || ""; 
    document.getElementById("cep").value = cli.cep || "";
    document.getElementById("numero").value = cli.numero || "";
    document.getElementById("complemento").value = cli.complemento || "";

	// abro a tela de editar e puxo os dados do usuário
    document.getElementById("clienteModal").classList.add("active");
}


// salvar cliente
async function salvarCliente(event) {

	//não deixo fechar o modal se um dos if for falso
	if (event) event.preventDefault();
	
	const NomeInput= document.getElementById('razaoSocial');
	const NomeSemEspaco= NomeInput.value.trim();
	
	if(NomeSemEspaco.length<3){
		alert("Nome muito pequeno, o mínimo de caracteres é 3")
		return false;
	}
	
	if(NomeSemEspaco.length>=100){
			alert("Nome muito grande, o máximo de caracteres é 100")
			return false;
		}
	
	if(!isNaN(NomeSemEspaco)){
		alert("O nome  não pode conter somente números")
					return false;
	}
		console.log("Passou pela verificação de nome")
		
	
		const TelefoneValido= validaTelefone();
		const DDDvalido=DDDTelefone();	
		const NumerosTelefoneValidos=validaNumerosTelefone();
		const CepValido=validaCep();
		const numeroCepValido=validaNumero();
		const complementoValido=validaComplemento();
		
		if(!TelefoneValido){
			alert("O campo telefone está com menos de 11 números")
					return false ;
		}
		console.log("Verificou o telefone")
		
		if(!DDDvalido){
				alert("O DDD digitado não é válido! Por favor, corrija.")
				return false;
			}
		console.log("verificou o DDD")
		
		if(!NumerosTelefoneValidos){	
				return false;
			}
		console.log("Verificou os números do telefone")
			
		if(!validarCPF()){
			alert("O CPF digitado é inválido")
					return false;
		}
		console.log("Verificou o CPF")
		
		if(!CepValido){
			alert("O CEP deve conter 9 digitos")
			return false;
		}
		
		if(!numeroCepValido){
			return false;
		}
		
		if(!complementoValido){
			return false;
		}
		
		
	
		
    const cliente = {
        razaoSocial: document.getElementById("razaoSocial").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cpfCnpj: document.getElementById("cpf").value,
        cep: document.getElementById("cep").value,
        numero: document.getElementById("numero").value,
        complemento: document.getElementById("complemento").value
    };

    if (editandoId) {

        await fetch(`${API_GRAVAR}/${editandoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

    } else {

		//não deixo fechar o modal se um dos if for falso
			if (event) event.preventDefault();
			
			const NomeInput= document.getElementById('razaoSocial');
			const NomeSemEspaco= NomeInput.value.trim();
			
			if(NomeSemEspaco.length<3){
				alert("Nome muito pequeno, o mínimo de caracteres é 3")
				return false;
			}
			
			if(NomeSemEspaco.length>=100){
					alert("Nome muito grande, o máximo de caracteres é 100")
					return false;
				}
			
			if(!isNaN(NomeSemEspaco)){
				alert("O nome  não pode conter somente números")
							return false;
			}
				console.log("Passou pela verificação de nome")
				
			
				const TelefoneValido= validaTelefone();
				const DDDvalido=DDDTelefone();	
				const NumerosTelefoneValidos=validaNumerosTelefone();
				const CepValido=validaCep();
				const numeroCepValido=validaNumero();
				const complementoValido=validaComplemento();
				
				if(!TelefoneValido){
					alert("O campo telefone está com menos de 11 números")
							return false ;
				}
				console.log("Verificou o telefone")
				
				if(!DDDvalido){
						alert("O DDD digitado não é válido! Por favor, corrija.")
						return false;
					}
				console.log("verificou o DDD")
				
				if(!NumerosTelefoneValidos){	
						return false;
					}
				console.log("Verificou os números do telefone")
					
				if(!validarCPF()){
					alert("O CPF digitado é inválido")
							return false;
				}
				console.log("Verificou o CPF")
				
				if(!CepValido){
					alert("O CEP deve conter 9 digitos")
					return false;
				}
				
				if(!numeroCepValido){
					return false;
				}
				
				if(!complementoValido){
					return false;
				}
				
				
				const emailInput=document.getElementById("email");
							const emailSemEspaco= emailInput.value.trim();
							
							const reposnseEmail= await fetch (`${API_VERIFICA_EMAIL}/${emailSemEspaco}`)
							const emailExiste= await reposnseEmail.json();
							
							console.log(emailExiste)
							
							if(emailExiste){
								alert("O email digitado já existe")
								return emailInput.value="";
							}
							console.log("verificou o email ")
							

									const telefoneInput=document.getElementById("telefone");
									const telefoneSemEspaco=telefoneInput.value;
									
									const reposnseTelefone= await fetch (`${API_VERIFICA_TELEFONE}/${telefoneSemEspaco}`)
									const TelefoneExiste= await reposnseTelefone.json();
									
									console.log(TelefoneExiste);
									
									// se for booleano ou um texto escrito verdadeiro eu barro 
									if(TelefoneExiste ||String(TelefoneExiste).trim() === "true"){
										alert("O telefone digitado já existe")
										return telefoneInput.value="";
									}
									
									console.log("Verificou o telefone");	
							
				const cpfInput=document.getElementById("cpf");
				const cpfValor= cpfInput.value;//pego o valor do input
														
				const reposnse= await fetch (`${API_VERIFICA_CPF}/${cpfValor}`)
				const cpfExiste= await reposnse.json();
														
					console.log(cpfExiste);
														
						if(cpfExiste){
															
						alert("O CPF digitado já existe ")
					return cpfInput.value="";
							}
				
		
		
        await fetch(API_SALVAR, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });
    }

    fecharModal();
    await listarClientes();
}

async function buscarCliente() {

    const nome = document.getElementById("filtroNome").value;
    
    if (!nome) {
        listarClientes();
        return;
    }

    const response = await fetch(`${API_BUSCAR_NOME}/${nome}`);
    const clientes = await response.json();

    const tbody = document.getElementById("clienteTableBody");
    tbody.innerHTML = "";

    clientes.forEach(cli => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${cli.razaoSocial}</td>
            <td>${cli.cpfCnpj}</td>
            <td>${cli.telefone || '-'}</td>
            <td>${cli.email || '-'}</td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="editar(${cli.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deletar(${cli.id})">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}



function mascaraTelefone(input) {
  let valor = input.value;
  
  //Remove tudo o que não for número
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
    valor = valor.slice(0, 9) + "-" + valor.slice(9);
  }
  

  input.value = valor; 
}

function validaTelefone(){
  const telefoneInput = document.getElementById("telefone");
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
		const telefoneInput = document.getElementById("telefone");
		const valorTelefone = telefoneInput.value;
		
		
		// se o telefone digitado não tiver um DDD válido não deixa passar
				if (ValidaDDD(valorTelefone) === false) {
				    return false; 
				}
		
		
		
		
		return true;
	}
 

	function validaNumerosTelefone(){
		
		const telefoneInput = document.getElementById("telefone");
				const valorTelefone = telefoneInput.value;
				
				
		//removo tudo que não for número dentro do input 
				const TelefonePuro=valorTelefone.replace(/\D/g,"")		
				
				//pego os números depois do parenteses por isso esta entre parenteses o número 2
				const TelefoneNumeros=TelefonePuro.substring(2)
				
				//verifico se todos  os 9 números digitados são todos  iguais
				const TelefoneRepetido=/^(\d)\1{8}$/.test(TelefoneNumeros);
				
				if(TelefoneRepetido){
					alert("Esté número de telefone é inválido!Não é permitido  números iguais")
					return false;
				}
				
				return true;
	}

	function validaEmail(){
		
		const emailInput=document.getElementById("email");
		
		const emailcerto=emailInput.value.trim();
		
		
		if(emailcerto.length>100){
		alert("O email não pode ter mais de 100 caracteres ")
		return false;
			
		}
		
		else if(emailcerto.length<3){
				alert("O email não pode ter menos de 3 caracteres ")
				return false;
					
				}
		
		return true;
	}

	
	
	function aplicarMascaraCPF(evento) {
	    let input = evento.target;
	    let valor = input.value;

	     //Remove tudo o que não for número
	    valor = valor.replace(/\D/g, "");

	    // conforme o usuário digita vai aplicando a mascara 
	    if (valor.length > 3) {
	        valor = valor.substring(0, 3) + '.' + valor.substring(3);
	    }
	    if (valor.length > 7) {
	        valor = valor.substring(0, 7) + '.' + valor.substring(7);
	    }
	    if (valor.length > 11) {
	        valor = valor.substring(0, 11) + '-' + valor.substring(11, 13);
	    }

		console.log("Mascara esta funcionando")
		
		
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
		    return false;

		  
		  console.log("validou o CPF")
		  
		  return true
		}

function mascaraCEP(input) {
		  let valor = input.value;
		  
		  // Remove tudo o que não for número	
		  valor = valor.replace(/\D/g, "");
		  
		  // coloco o traço depois do 5 número
		  if (valor.length > 5) {
		    valor = valor.slice(0, 5) + "-" + valor.slice(5, 8);
		  }
		  
		  input.value = valor; 
		}


function validaCep(){
	
	const cepInput=document.getElementById('cep');
	const cepSemEspaco= cepInput.value.trim();
	
	
	if(cepSemEspaco.length<8 || cepSemEspaco.length>10){
		return false;
	}
	
	return true;
	
	
}		
			
	function validaNumero(){
		
		const numeroInput=document.getElementById('numero');
		const numeroSemEspaco=numeroInput.value.trim();
		
		//converto o número sem espaço e digo que a base dele é decimal
		const NumeroInteiro= parseInt(numeroSemEspaco,10)
		
		if(NumeroInteiro>100000){
			alert("O número do  não pode ser maior que 100000  ")
			return false;
		}
		else if(NumeroInteiro<0|| isNaN(NumeroInteiro)){
			alert("O número do CEP não é valido")
			return false;
		}
		
		return true;
	}

	function validaComplemento(){
		
		const complementoInput=document.getElementById('complemento');
		const complementoSemEspaco= complementoInput.value.trim();
		
		
		if(complementoSemEspaco ===""){
			return true;
		}
		
		if(!isNaN(complementoSemEspaco)){
			alert("O complemento não pode conter somente números")
			return false;
		}
		
		
		else if(complementoSemEspaco.length<3){
			alert("O mínimo de caracteres é 3 ")
			return false;

		}
		
		else if(complementoSemEspaco.length>100){
			alert("O máximo de caracteres é 100")
			return false;
			
		}
		
		return true;
	}
	
	
	
	
	
//
listarClientes();