const API_BUSCAR_TODOS = 'http://localhost:8000/clientes/listartodos';
const API_BUSCAR_ID = 'http://localhost:8000/clientes/listarporid';
const API_GRAVAR = 'http://localhost:8000/clientes/atualizar';
const API_SALVAR = 'http://localhost:8000/clientes/salvar';
const API_DELETAR = 'http://localhost:8000/clientes/deletar';
const API_BUSCAR_NOME = 'http://localhost:8000/clientes/buscarPorNome';

let editandoId = null;

// Listar todos os clientes cadastrados
async function listarClientes() {
    const response = await fetch(API_BUSCAR_TODOS);
    const clientes = await response.json();

    const tbody = document.getElementById("clienteTableBody");
    tbody.innerHTML = "";

    clientes.forEach(cli => {
        tbody.innerHTML += `
            <tr>
                <td>${cli.razaoSocial}</td>
                <td>${cli.cpf_cnpj}</td>
                <td>${cli.telefone || '-'}</td>
                <td>${cli.email || '-'}</td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="editar(${cli.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletar(${cli.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// Salvar ou Atualizar dados do Cliente
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
        // Envia atualização via PUT para a rota correta
        await fetch(`${API_GRAVAR}/${editandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });
    } else {
        // Salva novo cliente via POST
        await fetch(API_SALVAR, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });
    }

    fecharModal();
    listarClientes();
    limparFormulario();
}

// Limpar campos de entrada
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

// Funções do Modal Customizado
function abrirModal() {
    document.getElementById("modalTitulo").innerText = "Adicionar Novo Cliente";
    document.getElementById("clienteModal").classList.add("active");
}

function fecharModal() {
    document.getElementById("clienteModal").classList.remove("active");
    limparFormulario();
}

// Deletar Cliente por ID
async function deletar(id) {
    if(confirm("Tem certeza que deseja excluir este cliente?")) {
        await fetch(`${API_DELETAR}/${id}`, {
            method: "DELETE"
        });
        listarClientes();
    }
}

// Carregar dados no Modal para Edição
// Carregar dados no Modal para Edição
async function editar(id) {
    const response = await fetch(`${API_BUSCAR_ID}/${id}`);
    const cli = await response.json();

    editandoId = id;
    document.getElementById("modalTitulo").innerText = "Editar Cliente";

    // Preenche os campos do formulário com os dados que vieram do banco
    document.getElementById("razaoSocial").value = cli.razaoSocial || "";
    document.getElementById("telefone").value = cli.telefone || "";
    document.getElementById("email").value = cli.email || "";
    document.getElementById("cpf_cnpj").value = cli.cpf_cnpj || "";
    document.getElementById("cep").value = cli.cep || "";
    document.getElementById("numero").value = cli.numero || "";
    document.getElementById("complemento").value = cli.complemento || "";

    // CORRIGIDO: Linha limpa para abrir o modal adicionando a classe "active"
    document.getElementById("clienteModal").classList.add("active");
}

// Buscar Clientes por Nome / Razão Social dinamicamente
async function buscarCliente() {
    const nome = document.getElementById("filtroNome").value;
    
    if(!nome) {
        listarClientes();
        return;
    }

    const response = await fetch(`${API_BUSCAR_NOME}/${nome}`);
    const clientes = await response.json();

    const tbody = document.getElementById("clienteTableBody");
    tbody.innerHTML = "";

    clientes.forEach(cli => {
        tbody.innerHTML += `
            <tr>
                <td>${cli.razaoSocial}</td>
                <td>${cli.cpf_cnpj}</td>
                <td>${cli.telefone || '-'}</td>
                <td>${cli.email || '-'}</td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="editar(${cli.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletar(${cli.id})">Excluir</button>
                </td>
            </tr>`;
    });
}

// Inicia listando os dados ao carregar a página
listarClientes();