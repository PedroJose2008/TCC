const API_BUSCAR_TODOS = 'http://localhost:8000/fornecedores/listartodos';
const API_BUSCAR_ID = 'http://localhost:8000/fornecedores/listarporid';
const API_GRAVAR = 'http://localhost:8000/fornecedores/atualizar';
const API_SALVAR = 'http://localhost:8000/fornecedores/salvar';
const API_DELETAR = 'http://localhost:8000/fornecedores/deletar';
const API_BUSCAR_NOME = 'http://localhost:8000/fornecedores/buscarPorNome'; // Ajuste se buscar por razaoSocial na API

let editandoId = null;

async function listarFornecedores() {
    const response = await fetch(API_BUSCAR_TODOS);
    const fornecedores = await response.json();

    const tbody = document.getElementById("fornecedorTableBody");
    tbody.innerHTML = "";

    fornecedores.forEach(forn => {
        tbody.innerHTML += `
            <tr>
                <td>${forn.razaoSocial}</td>
                <td>${forn.cnpj}</td>
                <td>${forn.telefone}</td>
                <td>${forn.email}</td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="editar(${forn.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletar(${forn.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
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

    // Se tem editandoId, significa que estamos EDITANDO (Inverteu para as APIs certas)
    if (editandoId) {
        await fetch(`${API_GRAVAR}/${editandoId}`, { // ➔ Corrigido: Usa API_GRAVAR (/atualizar)
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fornecedor)
        });
    } else {
        // Se NÃO tem editandoId, significa que é um NOVO cadastro
        await fetch(API_SALVAR, { // ➔ Corrigido: Usa API_SALVAR (/salvar)
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fornecedor)
        });
    }

    fecharModal();
    listarFornecedores();
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

function abrirModal() {
    const modal = new bootstrap.Modal(document.getElementById("fornecedorModal"));
    modal.show();
}

function fecharModal() {
    const modalEl = document.getElementById("fornecedorModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if(modal) {
        modal.hide();
    }
}

async function deletar(id) {
    await fetch(`${API_DELETAR}/${id}`, {
        method: "DELETE"
    });
    listarFornecedores();
}

async function editar(id) {
    const response = await fetch(`${API_BUSCAR_ID}/${id}`);
    const forn = await response.json();

    editandoId = id;

    document.getElementById("razaoSocial").value = forn.razaoSocial || "";
    document.getElementById("telefone").value = forn.telefone || "";
    document.getElementById("email").value = forn.email || "";
    document.getElementById("cnpj").value = forn.cnpj || "";
    document.getElementById("cep").value = forn.cep || "";
    document.getElementById("complemento").value = forn.complemento || "";

    abrirModal();
}

async function buscarFornecedor() {
    const razaoSocial = document.getElementById("filtroNome").value;
    
    if(!razaoSocial) {
        listarFornecedores();
        return;
    }

    const response = await fetch(`${API_BUSCAR_NOME}/${razaoSocial}`);
    const fornecedores = await response.json();

    const tbody = document.getElementById("fornecedorTableBody");
    tbody.innerHTML = "";

    fornecedores.forEach(forn => {
        tbody.innerHTML += `
            <tr>
                <td>${forn.razaoSocial}</td>
                <td>${forn.cnpj}</td>
                <td>${forn.telefone}</td>
                <td>${forn.email}</td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="editar(${forn.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletar(${forn.id})">Excluir</button>
                </td>
            </tr>`;
    });
}

listarFornecedores();