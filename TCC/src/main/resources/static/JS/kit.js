// Endpoints da API de Kits
const API_KITS_LISTAR = 'http://localhost:8000/kits/listartodos';
const API_KITS_BUSCAR_ID = 'http://localhost:8000/kits/listarporid';
const API_KITS_SALVAR = 'http://localhost:8000/kits/salvar';
const API_KITS_ATUALIZAR = 'http://localhost:8000/kits/atualizar';
const API_KITS_DELETAR = 'http://localhost:8000/kits/deletar';

// Rotas Relacionadas para alimentar os Seletores
const API_CLIENTES_LISTAR = 'http://localhost:8000/clientes/listartodos';
const API_PECAS_LISTAR = 'http://localhost:8000/pecas/listartodos';

// Rotas de Vínculo de Peças (Many-to-Many no seu backend)
const API_KITS_LISTAR_PECAS = 'http://localhost:8000/kits/listarpecas'; 
const API_KITS_VINCULAR = 'http://localhost:8000/kits/vincularpeca'; 
const API_KITS_DESVINCULAR = 'http://localhost:8000/kits/desvincularpeca'; 

let editandoKitId = null;
let kitSelecionadoParaPecasId = null;

// --- INICIALIZAÇÃO DA PÁGINA ---
document.addEventListener("DOMContentLoaded", () => {
    listarKits();
    carregarClientesNoSelect();
    carregarPecasNoSelect();
});

// --- OPERAÇÕES DOS KITS ---

// Listar todos os kits cadastrados
async function listarKits() {
    const response = await fetch(API_KITS_LISTAR);
    const kits = await response.json();
    
    const tbody = document.getElementById("tabelaKits");
    tbody.innerHTML = "";

    if (kits.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="color:var(--text3); padding:20px;">Nenhum kit cadastrado.</td></tr>`;
        return;
    }

    kits.forEach(k => {
        // BUSCA DA RAZÃO SOCIAL: Procura no topo do JSON ou dentro do objeto 'cliente'
        let razaoSocialCliente = "Não Atribuído";
        
        if (k.razaoSocial) {
            razaoSocialCliente = k.razaoSocial;
        } else if (k.cliente && k.cliente.razaoSocial) {
            razaoSocialCliente = k.cliente.razaoSocial;
        } else if (k.clienteNome) {
            razaoSocialCliente = k.clienteNome;
        }

        // PEGA A PRATELEIRA DO KIT
        let prateleiraKit = k.prateleira || "Não Atribuído";

        // Corrigido para preencher exatamente 5 colunas: Código, Nome, Prateleira, Cliente, Ações
        tbody.innerHTML += `
            <tr>
                <td><strong>#${k.codigo}</strong></td>
                <td id="kit-nome-${k.id}">${k.nome}</td>
                <td><span class="badge-green">${prateleiraKit}</span></td>
                <td>${razaoSocialCliente}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-accent" onclick="abrirModalPecas(${k.id}, '${k.codigo}')">🧩 Peças do Kit</button> 
                        <button class="btn btn-ghost" onclick="editarKit(${k.id})">Editar</button> 
                        <button class="btn btn-danger" onclick="deletarKit(${k.id})">Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Salvar (POST) ou Editar (PUT) o Kit
async function salvarKit() {
    const idClienteSelecionado = document.getElementById("kitCliente").value;

    const kit = {
        codigo: document.getElementById("kitCodigo").value,
        nome: document.getElementById("kitNome").value,
        prateleira: document.getElementById("kitPrateleira").value, // Adicionado campo de prateleira no objeto enviado
        idCliente: idClienteSelecionado ? parseInt(idClienteSelecionado) : null,
        cliente: idClienteSelecionado ? { id: parseInt(idClienteSelecionado) } : null
    };

    const url = editandoKitId ? `${API_KITS_ATUALIZAR}/${editandoKitId}` : API_KITS_SALVAR;
    const metodo = editandoKitId ? "PUT" : "POST";

    await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kit)
    });

    fecharModalCadastroKit();
    listarKits();
}

// Resgatar dados do Kit para o Form de Edição
async function editarKit(id) {
    const response = await fetch(`${API_KITS_BUSCAR_ID}/${id}`);
    const k = await response.json();

    editandoKitId = id;
    document.getElementById("formModalTitle").innerText = "Editar Estrutura do Kit";
    document.getElementById("kitCodigo").value = k.codigo || "";
    document.getElementById("kitNome").value = k.nome || "";
    document.getElementById("kitPrateleira").value = k.prateleira || ""; // Resgata a prateleira ao editar
    document.getElementById("kitCliente").value = k.idCliente || "";

    document.getElementById("modalKitForm").classList.add("active");
}

// Excluir um Kit
async function deletarKit(id) {
    if (confirm("Deseja realmente excluir este Kit do sistema?")) {
        await fetch(`${API_KITS_DELETAR}/${id}`, { method: "DELETE" });
        listarKits();
    }
}

// --- POPULAR DINAMICAMENTE OS SELECTS ---

async function carregarClientesNoSelect() {
    const response = await fetch(API_CLIENTES_LISTAR);
    const clientes = await response.json();
    const select = document.getElementById("kitCliente");
    
    select.innerHTML = '<option value="">-- Escolha um Cliente --</option>';
    clientes.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.razaoSocial || c.nome}</option>`;
    });
}

async function carregarPecasNoSelect() {
    const response = await fetch(API_PECAS_LISTAR);
    const pecas = await response.json();
    const select = document.getElementById("selectPecas");
    
    // TEXTO ALTERADO AQUI:
    select.innerHTML = '<option value="">-- Selecione Peças do Kit --</option>';
    
    pecas.forEach(p => {
        let localizacao = p.prateleira ? ` | Prat: ${p.prateleira}` : '';
        select.innerHTML += `<option value="${p.id}">${p.nome} (Cod: ${p.codigo}${localizacao})</option>`;
    });
}

// --- GERENCIAMENTO DE PEÇAS INTERNAS DO KIT (MANY-TO-MANY) ---

async function abrirModalPecas(idKit, codigoKit) {
    kitSelecionadoParaPecasId = idKit;
    const nomeKit = document.getElementById(`kit-nome-${idKit}`).innerText;
    document.getElementById('modalTitle').innerText = `Componentes do ${nomeKit}`;
    document.getElementById('modalSubtitle').innerText = `Código Identificador: #${codigoKit}`;
    
    await renderizarPecasDoKit();
    document.getElementById('modalPecas').classList.add('active');
}

function fecharModalPecas() {
    document.getElementById('modalPecas').classList.remove('active');
    kitSelecionadoParaPecasId = null;
}

// Busca e renderiza as peças vinculadas ao kit
async function renderizarPecasDoKit() {
    const listaTbody = document.getElementById('listaPecasKit');
    listaTbody.innerHTML = '';

    const response = await fetch(`${API_KITS_LISTAR_PECAS}/${kitSelecionadoParaPecasId}`);
    const pecasDoKit = await response.json();

    if (!pecasDoKit || pecasDoKit.length === 0) {
        listaTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text3); padding: 20px 0;">Nenhuma peça vinculada a este kit ainda.</td></tr>`;
        return;
    }

    pecasDoKit.forEach(peca => {
        listaTbody.innerHTML += `
          <tr>
            <td style="font-family: monospace; font-weight: 600;">${peca.codigo}</td>
            <td style="text-align:left;">${peca.nome}</td>
            <td><span class="badge-green">${peca.prateleira || '-'}</span></td>
            <td style="text-align: right;">
              <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="removerPecaDoKit(${peca.id})">Remover</button>
            </td>
          </tr>
        `;
    });
}

// Adiciona o vínculo entre kit e peça enviando a prateleira específica
async function adicionarPecaAoKit() {
    const selectPecas = document.getElementById('selectPecas');
    const pecaId = selectPecas.value;
    const prateleiraInformada = document.getElementById('pecaPrateleira').value;

    if (!pecaId) {
        alert("Por favor, selecione uma peça válida do estoque.");
        return;
    }

    // Passa os parâmetros estruturados. Caso sua API receba prateleira no body ou query param, adapte o body:
    await fetch(`${API_KITS_VINCULAR}/${kitSelecionadoParaPecasId}/${pecaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prateleira: prateleiraInformada }) 
    });

    selectPecas.value = "";
    document.getElementById('pecaPrateleira').value = ""; // Limpa o input após adicionar
    renderizarPecasDoKit();
}

// Remove o vínculo entre kit e peça
async function removerPecaDoKit(pecaId) {
    if (confirm("Deseja desvincular este componente do Kit?")) {
        await fetch(`${API_KITS_DESVINCULAR}/${kitSelecionadoParaPecasId}/${pecaId}`, {
            method: "DELETE"
        });
        renderizarPecasDoKit();
    }
}

// Função para buscar Kits por nome digitado
async function buscarKitPorNome() {
    const nomeBusca = document.getElementById("buscaKitNome").value;

    if (!nomeBusca) {
        listarKits();
        return;
    }

    const response = await fetch(`http://localhost:8000/kits/buscarpornome?nome=${nomeBusca}`);
    const kits = await response.json();
    
    const tbody = document.getElementById("tabelaKits");
    tbody.innerHTML = "";

    if (kits.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="color:var(--text3); padding:20px;">Nenhum kit encontrado com este nome.</td></tr>`;
        return;
    }

    kits.forEach(k => {
        let razaoSocialCliente = "Não Atribuído";
        if (k.razaoSocial) {
            razaoSocialCliente = k.razaoSocial;
        } else if (k.cliente && k.cliente.razaoSocial) {
            razaoSocialCliente = k.cliente.razaoSocial;
        }

        let prateleiraKit = k.prateleira || "Não Atribuído";

        tbody.innerHTML += `
            <tr>
                <td><strong>#${k.codigo}</strong></td>
                <td id="kit-nome-${k.id}">${k.nome}</td>
                <td><span class="badge-green">${prateleiraKit}</span></td>
                <td>${razaoSocialCliente}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-accent" onclick="abrirModalPecas(${k.id}, '${k.codigo}')">🧩 Peças do Kit</button> 
                        <button class="btn btn-ghost" onclick="editarKit(${k.id})">Editar</button> 
                        <button class="btn btn-danger" onclick="deletarKit(${k.id})">Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Função para o botão "Limpar" resetar o campo e a tabela
function limparBuscaKit() {
    document.getElementById("buscaKitNome").value = "";
    listarKits();
}

// --- AUXILIARES DOS MODAIS DE CADASTRO ---
function abrirModalCadastroKit() {
    editandoKitId = null;
    document.getElementById("kitForm").reset();
    document.getElementById("formModalTitle").innerText = "Cadastrar Novo Kit";
    document.getElementById("modalKitForm").classList.add("active");
}

function fecharModalCadastroKit() {
    document.getElementById("modalKitForm").classList.remove("active");
}