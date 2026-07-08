const API_BUSCAR_TODOS = 'http://localhost:8001/fornecedores/listartodos';
const API_BUSCAR_ID = 'http://localhost:8001/fornecedores/listarporid';
const API_GRAVAR = 'http://localhost:8001/fornecedores/atualizar';
const API_SALVAR = 'http://localhost:8001/fornecedores/salvar';
const API_DELETAR = 'http://localhost:8001/fornecedores/deletar';
const API_BUSCAR_NOME = 'http://localhost:8001/fornecedores/buscarPorNome';

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
    limparFormulario();
}

function limparFormulario() {
    document.getElementById("razaoSocial").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("cnpj").value = "";
    document.getElementById("cep").value = "";
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
    document.getElementById("complemento").value = forn.complemento;

    abrirModal();
}

async function salvarFornecedor() {
    const fornecedor = {
        razaoSocial: document.getElementById("razaoSocial").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cnpj: document.getElementById("cnpj").value,
        cep: document.getElementById("cep").value,
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

listarFornecedores();