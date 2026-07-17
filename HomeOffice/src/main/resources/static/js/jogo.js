const API_BASE = "http://localhost:8080/jogo";
const API_BUSCAR_TODOS = `${API_BASE}/listar`;

const API_SALVAR = `${API_BASE}/salvar`;
const API_ATUALIZAR = `${API_BASE}/atualizar`;
const API_LISTAR_POR_ID = `${API_BASE}/listaId`;
const API_Deletar = `${API_BASE}/deletar`;


let editandoID= null;

function limparFormulario(){
	
	document.getElementById("nome").value="";	
	document.getElementById("genero").value="";
	document.getElementById("ano").value="";
	document.getElementById("plataforma").value="";
	document.getElementById("preco").value="";

	editandoID=null;
}


function abrirModal(){
		
		const modal= new bootstrap.Modal(document.getElementById("modalJogo"));
		modal.show();
	}

	function fecharModal(){
		
		const modalElement= document.getElementById("modalJogo");
		const modal= bootstrap.Modal.getInstance(modalElement);
		modal.hide();
	}
	
	async function listarJogos(){
			
		
			const response = await fetch(API_BUSCAR_TODOS);
			
		
			const jogos= await response.json();
		
			
			
			const tbody=document.querySelector("tbody");
			tbody.innerHTML="";
		
			
			jogos.forEach(dado => {

			const tr = document.createElement("tr");
					
		
			tr.innerHTML = `

			<td>${dado.id}</td>

			<td>${dado.nome}</td>

			<td>${dado.genero}</td>

			<td>${dado.ano}</td>

			<td>${dado.plataforma}</td>
			
			<td>${dado.preco}</td>
			

			<td>

			<button class="btn btn-warning btn-sm" onclick="editar(${dado.id})">

			Editar

			</button>

			<button class="btn btn-danger btn-sm" onclick="deletar(${dado.id})">

			Deletar

			</button>

			</td>

			`;

			tbody.appendChild(tr);

			});
			
			
		
				
		}
	
		//inicialização 
			
		document.addEventListener("DOMContentLoaded", () => {
		    listarJogos();//
		});
			//fim da i	nicialização
			
			async function salvarJogos() {
			    // Captura os dados exatamente como o Java espera
			    const jogos = {
			        nome: document.getElementById("nome").value,
			        genero: document.getElementById("genero").value,
			        ano: document.getElementById("ano").value, // Captura "AAAA-MM-DD" que o LocalDate aceita
			        plataforma: document.getElementById("plataforma").value,
			        preco: parseFloat(document.getElementById("preco").value) // Converte string para número real
			    };
			    
			    console.log("Tentando salvar os dados:", jogos);

			    try {
			        let response;
			        if (editandoID) {
			            // update     
			            response = await fetch(`${API_ATUALIZAR}/${editandoID}`, {
			                method: "PUT",
			                headers: {
			                    "Content-Type": "application/json" 
			                },
			                body: JSON.stringify(jogos)
			            });
			        } else {
			            // create 
			            response = await fetch(API_SALVAR, {
			                method: "POST",
			                headers: {
			                    "Content-Type": "application/json"
			                },
			                body: JSON.stringify(jogos)
			            });
			        }

			        if (response.ok) {
			            console.log("Salvo com sucesso no banco!");
			            fecharModal();
			            await listarJogos(); // Atualiza a tabela na tela
			            limparFormulario();
			        } else {
			            console.error("O servidor rejeitou os dados. Código de erro:", response.status);
			            alert("Erro ao salvar! Verifique o console do eclipse para detalhes.");
			        }

			    } catch (error) {
			        console.error("Erro na requisição Fetch:", error);
			    }
			}
			
			
			
		
		
						async function deletar(id){
								
								//mensagem para confirmar 
								if(!confirm("Deseja excluir?"))return;
								
								//chamada da API de deletar 
								await fetch(`${API_Deletar}/${id}`,{
									
								method:"Delete"
								
								});
								
								listarJogos();
								
							}//
		
							async function editar(id){
									
									const response = await fetch(`${API_LISTAR_POR_ID}/${id}`);
									const carro = await response.json();
									
									editandoID=id;
									//atribui em cada input as informações 
									document.getElementById("nome").value=carro.nome;
									document.getElementById("genero").value=carro.genero;
									document.getElementById("ano").value=carro.ano;
									document.getElementById("plataforma").value=carro.plataforma;
									document.getElementById("preco").value=carro.preco;
									
									
									abrirModal();
									
								}//fim editar