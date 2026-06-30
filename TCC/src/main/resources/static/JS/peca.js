// URLs da API de Peças (Porta 8000)
const API_BUSCAR_TODOS = 'http://localhost:8000/pecas/listartodos';
const API_BUSCAR_ID = 'http://localhost:8000/pecas/listarporid';
const API_GRAVAR = 'http://localhost:8000/pecas/atualizar';
const API_SALVAR = 'http://localhost:8000/pecas/salvar';
const API_DELETAR = 'http://localhost:8000/pecas/deletar';
const API_BUSCAR_NOME = 'http://localhost:8000/pecas/buscarPorNome';

// URL para buscar os fornecedores e popular o Select
const API_FORNECEDORES = 'http://localhost:8000/fornecedores/listartodos';

let editandoId = null;

// Categorias/Tipos fixos para o Select de Tipo
const TIPOS_PECAS = ["Motor", "Suspensão", "Freios", "Elétrica", "Transmissão", "Filtros", "Carroceria", "Outros"];

// 1. Carregar os Tipos/Categorias no Select
function popularSelectTipos() {
    const selectTipo = document.getElementById("tipo");
    selectTipo.innerHTML = '<option value="" disabled selected>Selecione o tipo...</option>';
    TIPOS_PECAS.forEach(tipo => {
        selectTipo.innerHTML += `<option value="${tipo}">${tipo}</option>`;
    });
}

// 2. Buscar Fornecedores do Banco e popular o Select dinamicamente
async function carregarFornecedoresSelect() {
    try {
        const response = await fetch(API_FORNECEDORES);
        const fornecedores = await response.json();
        
        const selectForn = document.getElementById("idFornecedor");
        selectForn.innerHTML = '<option value="" disabled selected>Selecione um fornecedor...</option>';
        
        fornecedores.forEach(f => {
            // Usa o ID como value e exibe a Razão Social para o usuário
            selectForn.innerHTML += `<option value="${f.id}">${f.razaoSocial}</option>`;
        });
    } catch (error) {
        console.error("Erro ao carregar lista de fornecedores:", error);
    }
}

// 3. Listar todas as peças na tabela
async function listarPecas() {
    const response = await fetch(API_BUSCAR_TODOS);
    const pecas = await response.json();

    const tbody = document.getElementById("tabelaPecas");
    tbody.innerHTML = "";

    pecas.forEach(p => {
        // Formata a data se existir
        const dataFormatada = p.dataCadastro ? new Date(p.dataCadastro).toLocaleDateString('pt-BR') : '-';
        // Formata o preço em Moeda Real
        const precoFormatado = p.preco ? p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

        tbody.innerHTML += `
            <tr>
                <td><span class="badge">${p.codigo || 'AUT'}</span></td>
                <td>${p.nome}</td>
                <td>${p.prateleira}</td>
                <td>${p.tipo}</td>
                <td>${p.idFornecedor || '-'}</td>
                <td>${precoFormatado}</td>
                <td>${p.quantidadeEstoque} pcs</td>
                <td>${dataFormatada}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-ghost" onclick="editar(${p.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletar(${p.id})">Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// 4. Salvar ou Atualizar Peça (Modificado para Código Manual)
async function salvarPeca() {
    const peca = {
        codigo: document.getElementById("codigo").value, // Captura o código digitado
        nome: document.getElementById("nome").value,
        prateleira: document.getElementById("prateleira").value,
        tipo: document.getElementById("tipo").value,
        idFornecedor: document.getElementById("idFornecedor").value,
        preco: parseFloat(document.getElementById("preco").value),
        quantidadeEstoque: parseInt(document.getElementById("quantidadeEstoque").value)
    };

    if (editandoId) {
        // Se está editando, envia a atualização via PUT
        await fetch(`${API_GRAVAR}/${editandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(peca)
        });
    } else {
        // Se for novo cadastro, também envia o código inserido manualmente via POST
        await fetch(API_SALVAR, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(peca)
        });
    }

    fecharModal();
    listarPecas();
    limparFormulario();
}

// 5. Carregar dados para Edição
async function editar(id) {
    // Garante que os selects estejam carregados antes de preencher os valores
    await carregarFornecedoresSelect();

    const response = await fetch(`${API_BUSCAR_ID}/${id}`);
    const p = await response.json();

    editandoId = id;
    document.getElementById("modalTitle").innerText = "Editar Peça";

    // Preenche os campos
    document.getElementById("codigo").value = p.codigo || "";
    document.getElementById("nome").value = p.nome || "";
    document.getElementById("prateleira").value = p.prateleira || "";
    document.getElementById("tipo").value = p.tipo || "";
    document.getElementById("idFornecedor").value = p.idFornecedor || "";
    document.getElementById("preco").value = p.preco || "";
    document.getElementById("quantidadeEstoque").value = p.quantidadeEstoque || "";

    document.getElementById("modalPeca").classList.add("active");
}

// 6. Deletar Peça
async function deletar(id) {
    if (confirm("Deseja realmente remover esta peça do estoque?")) {
        await fetch(`${API_DELETAR}/${id}`, {
            method: "DELETE"
        });
        listarPecas();
    }
}

// 7. Buscar Peça por Nome dinamicamente
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
        const dataFormatada = p.dataCadastro ? new Date(p.dataCadastro).toLocaleDateString('pt-BR') : '-';
        const precoFormatado = p.preco ? p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

        tbody.innerHTML += `
            <tr>
                <td><span class="badge">${p.codigo || 'AUT'}</span></td>
                <td>${p.nome}</td>
                <td>${p.prateleira}</td>
                <td>${p.tipo}</td>
                <td>${p.idFornecedor || '-'}</td>
                <td>${precoFormatado}</td>
                <td>${p.quantidadeEstoque} pcs</td>
                <td>${dataFormatada}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-ghost" onclick="editar(${p.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletar(${p.id})">Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Funções de Controle do Modal
function abrirModal() {
    document.getElementById("modalTitle").innerText = "Cadastrar Nova Peça";
    limparFormulario();
    carregarFornecedoresSelect(); // Atualiza a lista toda vez que abre para novos cadastros
    document.getElementById("modalPeca").classList.add("active");
}

function fecharModal() {
    document.getElementById("modalPeca").classList.remove("active");
    limparFormulario();
}

function limparFormulario() {
    document.getElementById("pecaForm").reset();
    document.getElementById("codigo").value = "";
    editandoId = null;
}

// Inicialização da Página
popularSelectTipos();
listarPecas();