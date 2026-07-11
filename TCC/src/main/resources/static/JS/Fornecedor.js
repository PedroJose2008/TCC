const API_BUSCAR_TODOS = "http://192.168.10.22:8013/fornecedores/listartodos";
const API_BUSCAR_ID = "http://192.168.10.22:8013/fornecedores/listarporid";
const API_GRAVAR = "http://192.168.10.22:8013/fornecedores/atualizar";
const API_SALVAR = "http://192.168.10.22:8013/fornecedores/salvar";
const API_DELETAR = "http://192.168.10.22:8013/fornecedores/deletar";
const API_BUSCAR_NOME = "http://192.168.10.22:8013/fornecedores/buscarPorNome";

const API_VERIFICA_CPF="http://192.168.10.22:8013/fornecedores/validaCpf";
const API_VERIFICA_EMAIL="http://192.168.10.22:8013/fornecedores/validaEmail";
const API_VERIFICA_TELEFONE="http://192.168.10.22:8013/fornecedores/validaTelefone";




let editandoId = null;

async function listarFornecedores() {
    const response = await fetch(API_BUSCAR_TODOS);
    const fornecedores = await response.json();

    const tbody = document.getElementById("fornecedorTableBody");
    tbody.innerHTML = "";

    fornecedores.forEach(forn => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${forn.razaoSocial}</td>
            <td>${forn.cnpj}</td>
            <td>${forn.telefone}</td>
            <td>${forn.email}</td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="editar(${forn.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deletar(${forn.id})">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function abrirModal() {
    const modalElement = document.getElementById("fornecedorModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function abrirModalCadastro() {
    limparFormulario();
    abrirModal();
}

function fecharModal() {
    const modalElement = document.getElementById("fornecedorModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
	
    modal.hide();
	
	// Remove o foco de qualquer elemento de dentro do modal que ficou "preso"
	    if (document.activeElement && modalElement.contains(document.activeElement)) {
	        document.activeElement.blur(); 
	    }
	
    limparFormulario();
}

function limparFormulario() {
    document.getElementById("razaoSocial").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("cnpj").value = "";
    document.getElementById("cep").value = "";
	document.getElementById("numero").value = "";

    document.getElementById("complemento").value = "";
    editandoId = null;
}

async function deletar(id) {
    if (!confirm("Deseja realmente excluir?")) return;

    await fetch(`${API_DELETAR}/${id}`, {
        method: "DELETE"
    });

    listarFornecedores();
}

async function editar(id) {
    const response = await fetch(`${API_BUSCAR_ID}/${id}`);
    const forn = await response.json();

    editandoId = id;

    document.getElementById("razaoSocial").value = forn.razaoSocial;
    document.getElementById("telefone").value = forn.telefone;
    document.getElementById("email").value = forn.email;
    document.getElementById("cnpj").value = forn.cnpj;
    document.getElementById("cep").value = forn.cep;
	document.getElementById("numero").value = forn.numero;

    document.getElementById("complemento").value = forn.complemento;

    abrirModal();
}

async function salvarFornecedor(event) {
	
	
	//não deixo fechar o modal se um dos if for falso , assim deixo ediar mesmo se não passar por esses campos
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
			
		
		if(!validarCNPJ()){
			alert("O CNPJ não é válido! Por favor,corrija")
			return false;
		}
		//função para validar CNPJ
		
		console.log("Verificou o CNPJ")
		
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
	
	
    const fornecedor = {
        razaoSocial: document.getElementById("razaoSocial").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cnpj: document.getElementById("cnpj").value,
        cep: document.getElementById("cep").value,
		numero:document.getElementById('numero').value,
        complemento: document.getElementById("complemento").value
    };

    if (editandoId) {
        await fetch(`${API_GRAVAR}/${editandoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fornecedor)
        });
    } else {
		
		
		//não deixo fechar o modal se um dos if for falso , assim deixo ediar mesmo se não passar por esses campos
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
					
				
				if(!validarCNPJ()){
					alert("O CNPJ não é válido! Por favor,corrija")
					return false;
				}
				//função para validar CNPJ
				
				console.log("Verificou o CNPJ")
				
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
									
						const cpfInput=document.getElementById("cnpj");
						//retiro as mascaras do CNPJ
						const cpfValorPuro = cpfInput.value.replace(/\D/g, "");
					
																
						const reposnse= await fetch (`${API_VERIFICA_CPF}/${cpfValorPuro}`)
						const cpfExiste= await reposnse.json();
																
							console.log(cpfExiste);
																
								if(cpfExiste){
																	
								alert("O CPF digitado já existe ")
							 cpfInput.value="";
							return false;
									}
				
		
		
        await fetch(API_SALVAR, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fornecedor)
        });
    }

    fecharModal();
    await listarFornecedores();
}

async function buscarFornecedor() {
    let razaoSocial = document.getElementById("filtroNome").value.trim();
    
    
    if (razaoSocial === "") {
        listarFornecedores();
        return;
    }

    const response = await fetch(`${API_BUSCAR_NOME}/${razaoSocial}`);
    const fornecedores = await response.json();

    const tbody = document.getElementById("fornecedorTableBody");
    tbody.innerHTML = "";

    fornecedores.forEach(forn => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${forn.razaoSocial}</td>
            <td>${forn.cnpj}</td>
            <td>${forn.telefone}</td>
            <td>${forn.email}</td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="editar(${forn.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deletar(${forn.id})">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// aplico a mascara de telefone
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
}// fim da mascara



//valido o telefone do usuário
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
// fim do validar telefone

// valido se o DDD do telefone do usuário é valido
function DDDTelefone(){
		const telefoneInput = document.getElementById("telefone");
		const valorTelefone = telefoneInput.value;
		
		
		// se o telefone digitado não tiver um DDD válido não deixa passar
				if (ValidaDDD(valorTelefone) === false) {
				    return false; 
				}
		
		
		
		
		return true;
	}//fim de validação de DDD do telefone


//valido se os números do usuário são repetidos	
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
	
	// valido se o DDD é valido
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
	}// fim da verificação de DDD

		function DDDTelefone(){
			const telefoneInput = document.getElementById("telefone");
			const valorTelefone = telefoneInput.value;
			
			
			// se o telefone digitado não tiver um DDD válido não deixa passar
					if (ValidaDDD(valorTelefone) === false) {
					    return false; 
					}
			
			
			
			
			return true;
		}
	
	
// aplico a mascara no CEP
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
	
	
//valido o CEP do usuário	
	function validaCep(){
		
		const cepInput=document.getElementById('cep');
		const cepSemEspaco= cepInput.value.trim();
		
		
		if(cepSemEspaco.length<8 || cepSemEspaco.length>10){
			return false;
		}
		
		return true;
		
		
	}// fim da validação de CEP
	
//valido se os números digitados são iguis s	
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
	}// fim da validação dos números

//valida o complemento	
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
	}//fim da validação de complemento


	function mascaraCNPJ(input) {
	    let valor = input.value;
	    
	    valor = valor
	        .replace(/\D/g, '') 
	        .replace(/^(\d{2})(\d)/, '$1.$2') 
	        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') 
	        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4') 
	        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5') 
	        .slice(0, 18); 

	    input.value = valor;
	}

	
	
	
	
	function validarCNPJ() { 
	    
	    const CNPJInput = document.getElementById('cnpj').value;
	    
	    if (!CNPJInput) {
	        return false;
	    }
	    
	    // retiro a mascara e deixo somente os números
	    let cnpjValida = CNPJInput.replace(/[^\d]+/g, '');

	    // Valida se tem os 14 dígitos
	    if (cnpjValida.length !== 14) return false;

	    // Elimina CNPJs inválidos conhecidos
	    if (/^(\d)\1+$/.test(cnpjValida)) return false;

	    // Valida primeiro dígito
	   
	    let tamanho = cnpjValida.length - 2;
	    let numeros = cnpjValida.substring(0, tamanho);
	    let digitos = cnpjValida.substring(tamanho);
	    let soma = 0;
	    let pos = tamanho - 7;
	    for (let i = tamanho; i >= 1; i--) {
	        soma += numeros.charAt(tamanho - i) * pos--;
	        if (pos < 2) pos = 9;
	    }
	    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	    if (resultado != digitos.charAt(0)) return false;

	    // Valida segundo dígito
	 
	    tamanho = tamanho + 1;
	    numeros = cnpjValida.substring(0, tamanho);
	    soma = 0;
	    pos = tamanho - 7;
	    for (let i = tamanho; i >= 1; i--) {
	        soma += numeros.charAt(tamanho - i) * pos--;
	        if (pos < 2) pos = 9;
	    }
	    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	    if (resultado != digitos.charAt(1)) return false;

	    console.log("Verificou o CNPJ com sucesso!");
	    return true;
	}

	
listarFornecedores();