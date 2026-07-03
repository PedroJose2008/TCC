const API_BUSCAR_TODOS = 'http://localhost:8000/pecas/listartodos';
const API_BUSCAR_ID = 'http://localhost:8000/pecas/listarporid';
const API_GRAVAR = 'http://localhost:8000/pecas/atualizar';
const API_SALVAR = 'http://localhost:8000/pecas/salvar';
const API_DELETAR = 'http://localhost:8000/pecas/deletar';
const API_BUSCAR_NOME = 'http://localhost:8000/pecas/buscarPorNome';
const API_FORNECEDORES = 'http://localhost:8000/fornecedores/listartodos';
const API_CODIGO = 'http://localhost:8000/pecas/cogigoPeca';

let editandoId = null;

const TIPOS_PECAS = ["Motor", "Suspensão", "Freios", "Elétrica", "Transmissão", "Filtros", "Carroceria", "Outros"];

async function popularSelectTipos() {
    let selectTipo = document.getElementById('tipo');
    if (!selectTipo) return;
    selectTipo.innerHTML = '<option value="" disabled selected>Selecione o tipo...</option>';
       
    TIPOS_PECAS.forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo;
        option.text = tipo;
        selectTipo.appendChild(option);
    });
}

async function BuscarFornecedor() {

    let res = await fetch(API_FORNECEDORES);

    let dados = await res.json();

    console.log(dados);

    let select = document.getElementById("idFornecedor");

    select.innerHTML = "";

    dados.forEach(dado => {

        const option = document.createElement("option");

        option.value = dado.id;
        option.text = dado.razaoSocial;

        select.appendChild(option);

    });

}

async function listarPecas() {
    const response = await fetch(API_BUSCAR_TODOS);
    const pecas = await response.json();

    const tbody = document.getElementById("tabelaPecas");
    tbody.innerHTML = "";

    pecas.forEach(p => {
        const tr = document.createElement("tr");
        const dataFormatada = p.dataCadastro ? new Date(p.dataCadastro).toLocaleDateString('pt-BR') : '-';
        const precoFormatado = p.preco ? p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

        tr.innerHTML = `
            <td><span class="badge">${p.codigo || 'AUT'}</span></td>
            <td>${p.nome}</td>
            <td>${p.prateleira || '-'}</td>
			<td>${p.numeroPratelira || '-'}</td>
            <td>${p.tipo}</td>
            <td>${p.fornecedor ? p.fornecedor.razaoSocial : '-'}</td>
            <td>${precoFormatado}</td>
            <td>${p.quantidadeEstoque} </td>
            <td>${dataFormatada}</td>        
            <td>
                <button class="btn btn-warning btn-sm" onclick="editar(${p.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deletar(${p.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function abrirModalCadastro() {

    editandoId = null;

    document.getElementById("pecaForm").reset();
    document.getElementById("modalTitle").innerText = "Cadastrar Nova Peça";

    await popularSelectTipos();
    await BuscarFornecedor();

	const codigoInput = document.getElementById('codigo');
	    if (codigoInput) {
	    
			gerarCodigo();
			
	    }
	
	
	
	
    const modal = new bootstrap.Modal(document.getElementById("modalPeca"));
    modal.show();
}

function abrirModalEdicao() {

    document.getElementById("modalTitle").innerText = "Editar Peça";

    const modal = new bootstrap.Modal(document.getElementById("modalPeca"));
    modal.show();
}

function fecharModal() {

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalPeca"));
    modal.hide();
}

async function deletar(id) {
    if (!confirm("Deseja realmente excluir?")) return;

    await fetch(`${API_DELETAR}/${id}`, {
        method: "DELETE"
    });

    listarPecas();
}

async function editar(id) {

    await popularSelectTipos();
    await BuscarFornecedor();

    const response = await fetch(`${API_BUSCAR_ID}/${id}`);
    const peca = await response.json();

    editandoId = id;

    document.getElementById("codigo").value = peca.codigo;
    document.getElementById("nome").value = peca.nome;
    document.getElementById("prateleira").value = peca.prateleira;
    document.getElementById("tipo").value = peca.tipo;
    document.getElementById("idFornecedor").value = peca.fornecedor.id;
    document.getElementById("preco").value = peca.preco;
    document.getElementById("quantidadeEstoque").value = peca.quantidadeEstoque;

    abrirModalEdicao();
}

async function salvarPeca() {

	const pecaInput= document.getElementById('nome');
	const pecaSemEspaco= pecaInput.value.trim();
	
	if(pecaSemEspaco.length<3){
		alert("A quantidade mínima de caracteres é 3")
		return false;
	}
	
	else if(pecaSemEspaco.length>100){
		alert("A quantidade máxima de caracteres é 100")
		return false;
	}
	
	// se for um número não deixa passar
	else if(!isNaN(pecaSemEspaco)){
		alert("A peça não pode conter somente números")
		return false;
	}
	
	
	
    const peca = {
        codigo: document.getElementById("codigo").value,
        nome: document.getElementById("nome").value,
        prateleira: document.getElementById("prateleira").value,
		numeroPratelira: document.getElementById("numero").value, 
        tipo: document.getElementById("tipo").value,
        fornecedor: {
            id: document.getElementById("idFornecedor").value
        },
        preco: document.getElementById("preco").value,
        quantidadeEstoque: document.getElementById("quantidadeEstoque").value
    };

    if (editandoId) {

        await fetch(`${API_GRAVAR}/${editandoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(peca)
        });

    } else {

        await fetch(API_SALVAR, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(peca)
        });

    }

    fecharModal();
    listarPecas();
}

async function buscarPorNome() {
    const nome = document.getElementById("filtroNome").value;

    if (!nome) {
        listarPecas();
        return;
    }

    const response = await fetch(`${API_BUSCAR_NOME}/${nome}`);
    const pecas = await response.json();

    const tbody = document.getElementById("tabelaPecas");
    tbody.innerHTML = "";

    pecas.forEach(p => {
        const tr = document.createElement("tr");
        const dataFormatada = p.dataCadastro ? new Date(p.dataCadastro).toLocaleDateString('pt-BR') : '-';
        const precoFormatated = p.preco ? p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

        tr.innerHTML = `
            <td><span class="badge">${p.codigo || 'AUT'}</span></td>
            <td>${p.nome}</td>
            <td>${p.prateleira || '-'}</td>
            <td>${p.tipo}</td>
            <td>${p.idFornecedor || '-'}</td>
            <td>${precoFormatated}</td>
            <td>${p.quantidadeEstoque}</td>
            <td>${dataFormatada}</td>        
            <td>
                <button class="btn btn-warning btn-sm" onclick="editar(${p.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deletar(${p.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function limparFiltro() {
    document.getElementById('filtroNome').value = '';
    listarPecas();
}

popularSelectTipos();
listarPecas();

//gera o código da peça
 	async function gerarCodigo (){
	
	const codigoInput= document.getElementById('codigo');
	
	if(codigoInput){
	const response= await fetch(API_CODIGO);
	const codigo= await response.text();
	console.log(codigo);
	codigoInput.value=codigo;
	}
}
