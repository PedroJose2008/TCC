const API_BUSCAR_TODOS = 'http://localhost:8001/clientes/listartodos';
const API_BUSCAR_ID = 'http://localhost:8001/clientes/listarporid';
const API_GRAVAR = 'http://localhost:8001/clientes/atualizar';
const API_SALVAR = 'http://localhost:8001/clientes/salvar';
const API_DELETAR = 'http://localhost:8001/clientes/deletar';
const API_BUSCAR_NOME = 'http://localhost:8001/clientes/buscarPorNome';

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
            <td>${cli.cpf_cnpj}</td>
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
    document.getElementById("cpf_cnpj").value = "";
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

async function editar(id) {

    const response = await fetch(`${API_BUSCAR_ID}/${id}`);
    const cli = await response.json();

    editandoId = id;
    document.getElementById("modalTitulo").innerText = "Editar Cliente";

    document.getElementById("razaoSocial").value = cli.razaoSocial || "";
    document.getElementById("telefone").value = cli.telefone || "";
    document.getElementById("email").value = cli.email || "";
    document.getElementById("cpf_cnpj").value = cli.cpf_cnpj || "";
    document.getElementById("cep").value = cli.cep || "";
    document.getElementById("numero").value = cli.numero || "";
    document.getElementById("complemento").value = cli.complemento || "";

    document.getElementById("clienteModal").classList.add("active");
}

async function salvarCliente() {

    const cliente = {
        razaoSocial: document.getElementById("razaoSocial").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cpf_cnpj: document.getElementById("cpf_cnpj").value,
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
            <td>${cli.cpf_cnpj}</td>
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

listarClientes();