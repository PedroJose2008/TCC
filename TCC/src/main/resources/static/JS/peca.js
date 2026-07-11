const API_BUSCAR_TODOS = "http://192.168.10.22:8013/pecas/listartodos";
const API_BUSCAR_ID = "http://192.168.10.22:8013/pecas/buscarid";
const API_SALVAR ="http://192.168.10.22:8013/pecas/salvar";
const API_ATUALIZAR = "http://192.168.10.22:8013/pecas/atualizar";
const API_DELETAR = "http://192.168.10.22:8013/pecas/deletar";
const API_FORNECEDORES = "http://192.168.10.22:8013/fornecedores/listartodos";

let editandoId = null;

async function listarPecas(){
	const response = await fetch(API_BUSCAR_TODOS);
	const pecas = await response.json();
	
	const tbody = document.getElementById('tabelaPecas');
	tbody.innerHTML = '';
	
	pecas.forEach(peca => {
		const tr = document.createElement("tr");
		
		const nomeFornecedor = (peca.fornecedor && (peca.fornecedor.razaoSocial || peca.fornecedor.nome));
		
		tr.innerHTML = `
			<td>${peca.id}</td>
			<td>${peca.nome}</td>
			<td>${peca.prateleira}</td>
			<td>${peca.numeroPratelira}</td>
			<td>${peca.tipo}</td>
			<td>${nomeFornecedor}</td>
			<td>${peca.preco}</td>
			<td>${peca.quantidadeEstoque}</td>
			<td>${peca.dataCadastro}</td>
			<td>
				<button class="btn btn-ghost" onclick="editar(${peca.id})">
				Editar
				</button>
				<button class="btn btn-danger" onclick="deletar(${peca.id})">
				Deletar
				</button>
			</td>
		`;
		tbody.appendChild(tr);
	});
}

async function SelectFornecedores() {
	const response = await fetch(API_FORNECEDORES);
	const fornecedores = await response.json();
	const select = document.getElementById("idFornecedor");
	
	select.innerHTML = '<option value="" disabled selected hidden>Selecione um fornecedor...</option>';

	fornecedores.forEach(f => {
		const option = document.createElement("option");
		option.value = f.id;
		option.text = f.razaoSocial || f.nome;
		select.appendChild(option);
	});
}

document.addEventListener("DOMContentLoaded", () => {
	listarPecas();
	SelectFornecedores();
});

async function salvar(){
	const precoInformado = parseFloat(document.getElementById('preco').value);
	const estoqueInformado = parseInt(document.getElementById('quantidadeEstoque').value);

	//VALIDACOES
	if (isNaN(precoInformado) || precoInformado < 0 || precoInformado > 999999) {
		alert("Por favor, insira um preço válido (máximo de R$ 999.999).");
		return;
	}

	
	if (isNaN(estoqueInformado) || estoqueInformado < 0 || estoqueInformado > 999999) {
		alert("Por favor, insira uma quantidade de estoque válida (máxima de 999.999 unidades).");
		return;
	}

	let dataFinal = document.getElementById('dataCadastro').value;

	if (!editandoId) {
		dataFinal = new Date().toISOString().split('T')[0];
	}

	const peca = {
		nome: document.getElementById('nome').value,
		prateleira: document.getElementById('prateleira').value,
		numeroPratelira: document.getElementById('numero').value,
		tipo: document.getElementById('tipo').value,
		fornecedor: { id: document.getElementById('idFornecedor').value },
		preco: precoInformado,
		quantidadeEstoque: estoqueInformado,
		dataCadastro: dataFinal
	};
	
	if(editandoId){
		await fetch(`${API_ATUALIZAR}/${editandoId}`, {
			method : 'PUT',
			headers : { 'Content-Type': 'application/json' },
			body : JSON.stringify(peca)
		});
	} else {
		await fetch(API_SALVAR, {
			method : 'POST',
			headers : { 'Content-Type': 'application/json' },
			body : JSON.stringify(peca)
		});
	}
	
	await listarPecas();
	limparFormulario();
	fecharModal();
}

function limparFormulario(){
	document.getElementById('codigo').value = 'Gerado Automaticamente';
	document.getElementById('nome').value = '';
	document.getElementById('prateleira').selectedIndex = 0;	
	document.getElementById('numero').selectedIndex = 0;
	document.getElementById('tipo').selectedIndex = 0;
	document.getElementById('idFornecedor').selectedIndex = 0;
	document.getElementById('preco').value = '';
	document.getElementById('quantidadeEstoque').value = '';
	document.getElementById('dataCadastro').value = '';
	
	editandoId = null;
}

async function deletar(id){
	console.log("Solicitação de exclusão para a peça ID:", id);
	if (!confirm('Deseja realmente excluir?')) return;
	
	await fetch(`${API_DELETAR}/${id}`, {
		method: 'DELETE'
	});
	
	await listarPecas();
}

function fecharModal(){
	const modalElement = document.getElementById('modalPeca');
	const modal = bootstrap.Modal.getInstance(modalElement);
	
	modal.hide();
	
	// Remove o foco de qualquer elemento de dentro do modal que ficou "preso"
		    if (document.activeElement && modalElement.contains(document.activeElement)) {
		        document.activeElement.blur(); 
		    }
	
}

function abrirModal(){
	const modal = new bootstrap.Modal(document.getElementById('modalPeca'));
	modal.show();
}

function abrirModalCadastro() {
	limparFormulario();
	document.getElementById("modalTitle").innerText = "Cadastrar Nova Peça";
	abrirModal();
}

async function editar(id){
	document.getElementById("modalTitle").innerText = "Editar Peça";
	abrirModal();
	
	const response = await fetch(API_BUSCAR_TODOS);
	const pecas = await response.json();
	const peca = pecas.find(p => p.id === id);
	
	editandoId = id;
	document.getElementById('codigo').value = peca.id;
	document.getElementById('nome').value = peca.nome;
	document.getElementById('prateleira').value = peca.prateleira;	
	document.getElementById('numero').value = peca.numeroPratelira;
	document.getElementById('tipo').value = peca.tipo;
	document.getElementById('idFornecedor').value = (peca.fornecedor && peca.fornecedor.id) ;
	document.getElementById('preco').value = peca.preco;
	document.getElementById('quantidadeEstoque').value = peca.quantidadeEstoque;
	document.getElementById('dataCadastro').value = peca.dataCadastro;
}

async function buscarPorNome() {
	const termo = document.getElementById("filtroNome").value.toLowerCase().trim();
	const response = await fetch(API_BUSCAR_TODOS);
	const pecas = await response.json();
	const tbody = document.getElementById("tabelaPecas");
	
	tbody.innerHTML = "";
	const pecasFiltradas = pecas.filter(p => p.nome.toLowerCase().includes(termo));

	pecasFiltradas.forEach(peca => {
		const tr = document.createElement("tr");
		
		const nomeFornecedor = (peca.fornecedor && (peca.fornecedor.razaoSocial || peca.fornecedor.nome));
		
		tr.innerHTML = `
			<td>${peca.id}</td>
			<td>${peca.nome}</td>
			<td>${peca.prateleira}</td>
			<td>${peca.numeroPratelira}</td>
			<td>${peca.tipo}</td>
			<td>${nomeFornecedor}</td>
			<td>${peca.preco}</td>
			<td>${peca.quantidadeEstoque}</td>
			<td>${peca.dataCadastro}</td>
			<td>
				<button class="btn btn-ghost" onclick="editar(${peca.id})">
				Editar
				</button>
				<button class="btn btn-danger" onclick="deletar(${peca.id})">
				Deletar
				</button>
			</td>
		`;
		tbody.appendChild(tr);
	});
}