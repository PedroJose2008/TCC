//CHAMADAS DAS APIS
const API_BUSCAR_TODOS = 'http://localhost:8001/pecas/listar';
const API_BUSCAR_ID = 'http://localhost:8001/pecas/buscarid'; // Caso use busca por ID, se não tiver deixe a de listar
const API_SALVAR = 'http://localhost:8001/pecas/salvar';
const API_ATUALIZAR = 'http://localhost:8001/pecas/atualizar';
const API_DELETAR = 'http://localhost:8001/pecas/excluir';
const API_FORNECEDORES = 'http://localhost:8001/fornecedores/listar';

//VARIÁVEL DE CONTROLE
let editandoId = null;

async function listarPecas(){
	
	const response = await fetch(API_BUSCAR_TODOS);
	const pecas = await response.json();
	
	const tbody = document.getElementById('tabelaPecas');
	tbody.innerHTML = '';
	
	pecas.forEach(peca => {
		const tr = document.createElement("tr");
		
		const dataFormatada = peca.dataCadastro ? peca.dataCadastro.split('-').reverse().join('/') : "-";
		const nomeFornecedor = peca.fornecedor ? (peca.fornecedor.razaoSocial || peca.fornecedor.nome) : "Sem Fornecedor";
		const precoFormatado = peca.preco ? `R$ ${parseFloat(peca.preco).toFixed(2).replace('.', ',')}` : "R$ 0,00";
		
		tr.innerHTML = `
			<td><strong>#${peca.id}</strong></td>
			<td>${peca.nome}</td>
			<td><span class="badge" style="background:var(--surface2); color:var(--text); border:1px solid var(--border);">${peca.prateleira || '-'}</span></td>
			<td>${peca.numero || '-'}</td>
			<td><span class="badge">${peca.tipo}</span></td>
			<td>${nomeFornecedor}</td>
			<td style="font-weight:600; color:var(--text);">${precoFormatado}</td>
			<td style="font-weight:600; color:${peca.quantidadeEstoque <= 3 ? 'var(--danger)' : 'var(--text2)'}">${peca.quantidadeEstoque} un</td>
			<td>${dataFormatada}</td>
			<td>
				<button class="btn btn-ghost" style="height:30px; padding:0 10px; font-size:11px;" onclick="editar(${peca.id})">
				✏️ Editar
				</button>
				<button class="btn btn-danger" style="height:30px; padding:0 10px; font-size:11px;" onclick="deletar(${peca.id})">
				🗑️ Deletar
				</button>
			</td>
		`;
		tbody.appendChild(tr);
	});
}

// ADICIONAL PARA CARREGAR OS FORNECEDORES NO SELECT
async function popularSelectFornecedores() {
	const response = await fetch(API_FORNECEDORES);
	const fornecedores = await response.json();
	const select = document.getElementById("idFornecedor");
	
	if (!select) return;
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
	popularSelectFornecedores();
});

async function salvar(){
	
	//RECUPERANDO OS VALORES DOS INPUTS
	const peca = {
		nome: document.getElementById('nome').value,
		prateleira: document.getElementById('prateleira').value,
		numero: parseInt(document.getElementById('numero').value),
		tipo: document.getElementById('tipo').value,
		fornecedor: { id: parseInt(document.getElementById('idFornecedor').value) },
		preco: parseFloat(document.getElementById('preco').value),
		quantidadeEstoque: parseInt(document.getElementById('quantidadeEstoque').value),
		dataCadastro: document.getElementById('dataCadastro').value || null
	};
	
	//METODO
	//CABEÇALHO
	//MEU OBJETO
	
	if(editandoId){
		
		await fetch(`${API_ATUALIZAR}/${editandoId}`, {
			method : 'PUT', //METODO DA MINHA API
			headers : {//CABEÇALHO INDICANDO O FORMATO QUE IREI PASSAR OS DADOS
				
				'Content-Type': 'application/json' //SERÁ UM PADRÃO NOSSO
			},
			body : JSON.stringify(peca) //CONVERTE EM FORMATO JSON
		});
		
	} else {
		
		await fetch(API_SALVAR, {
			method : 'POST', //METODO DA MINHA API
			headers : {//CABEÇALHO INDICANDO O FORMATO QUE IREI PASSAR OS DADOS
				
				'Content-Type': 'application/json' //SERÁ UM PADRÃO NOSSO
			},
			body : JSON.stringify(peca) //CONVERTE EM FORMATO JSON
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
	
	if (!confirm('Deseja realmente excluir?')) return;
	
	await fetch(`${API_DELETAR}/${id}`, {
		
		method: 'DELETE'
	});
	
	await listarPecas();
}

function fecharModal(){
	const modalElement = document.getElementById('modalPeca');
	const modal = bootstrap.Modal.getInstance(modalElement);
	if (modal) modal.hide();
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
	
	// Buscando a lista atual para filtrar o ID selecionado (evita quebra se não houver rota buscarid/{id})
	const response = await fetch(API_BUSCAR_TODOS);
	const pecas = await response.json();
	const peca = pecas.find(p => p.id === id);
	
	if (peca) {
		editandoId = id;
		document.getElementById('codigo').value = peca.id;
		document.getElementById('nome').value = peca.nome;
		document.getElementById('prateleira').value = peca.prateleira || '';	
		document.getElementById('numero').value = peca.numero || '';
		document.getElementById('tipo').value = peca.tipo || '';
		document.getElementById('idFornecedor').value = peca.fornecedor ? peca.fornecedor.id : '';
		document.getElementById('preco').value = peca.preco;
		document.getElementById('quantidadeEstoque').value = peca.quantidadeEstoque;
		document.getElementById('dataCadastro').value = peca.dataCadastro || '';
	}
}

// BUSCA ADICIONAL POR FILTRO DE NOME
async function buscarPorNome() {
	const termo = document.getElementById("filtroNome").value.toLowerCase().trim();
	const response = await fetch(API_BUSCAR_TODOS);
	const pecas = await response.json();
	const tbody = document.getElementById("tabelaPecas");
	
	tbody.innerHTML = "";
	const pecasFiltradas = pecas.filter(p => p.nome.toLowerCase().includes(termo));

	pecasFiltradas.forEach(peca => {
		const tr = document.createElement("tr");
		const dataFormatada = peca.dataCadastro ? peca.dataCadastro.split('-').reverse().join('/') : "-";
		const nomeFornecedor = peca.fornecedor ? (peca.fornecedor.razaoSocial || peca.fornecedor.nome) : "Sem Fornecedor";
		const precoFormatado = peca.preco ? `R$ ${parseFloat(peca.preco).toFixed(2).replace('.', ',')}` : "R$ 0,00";

		tr.innerHTML = `
			<td><strong>#${peca.id}</strong></td>
			<td>${peca.nome}</td>
			<td><span class="badge" style="background:var(--surface2); color:var(--text); border:1px solid var(--border);">${peca.prateleira || '-'}</span></td>
			<td>${peca.numero || '-'}</td>
			<td><span class="badge">${peca.tipo}</span></td>
			<td>${nomeFornecedor}</td>
			<td style="font-weight:600; color:var(--text);">${precoFormatado}</td>
			<td style="font-weight:600; color:${peca.quantidadeEstoque <= 3 ? 'var(--danger)' : 'var(--text2)'}">${peca.quantidadeEstoque} un</td>
			<td>${dataFormatada}</td>
			<td>
				<button class="btn btn-ghost" style="height:30px; padding:0 10px; font-size:11px;" onclick="editar(${peca.id})">
				✏️ Editar
				</button>
				<button class="btn btn-danger" style="height:30px; padding:0 10px; font-size:11px;" onclick="deletar(${peca.id})">
				🗑️ Deletar
				</button>
			</td>
		`;
		tbody.appendChild(tr);
	});
}