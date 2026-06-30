const API_OS_LISTAR = 'http://localhost:8000/ordens/listartodos';
const API_OS_BUSCAR_ID = 'http://localhost:8000/ordens/listarporid';
const API_OS_SALVAR = 'http://localhost:8000/ordens/salvar';
const API_OS_ATUALIZAR = 'http://localhost:8000/ordens/atualizar';
const API_OS_DELETAR = 'http://localhost:8000/ordens/deletar';

const API_CLIENTES_LISTAR = 'http://localhost:8000/clientes/listartodos';
const API_KITS_LISTAR = 'http://localhost:8000/kits/listartodos';
const API_PECAS_LISTAR = 'http://localhost:8000/pecas/listartodos';
const API_USUARIOS_LISTAR = 'http://localhost:8000/usuarios/listartodos'; 
const API_PAGAMENTOS_LISTAR = 'http://localhost:8000/pagamentos/listartodos';

const API_OS_LISTAR_PECAS = 'http://localhost:8000/ordens/listarpecas';
const API_OS_VINCULAR_PECA = 'http://localhost:8000/ordens/vincularpeca';
const API_OS_DESVINCULAR_PECA = 'http://localhost:8000/ordens/desvincularpeca';

let editandoOSId = null;
let osSelecionadaParaPecasId = null;

document.addEventListener("DOMContentLoaded", () => {
    listarOrdensServico();
    carregarSelectClientes();
    carregarSelectKits();
    carregarSelectPecas();
    carregarSelectUsuarios();
    carregarSelectPagamentos();

    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalNovaOS')) fecharModalNovaOS();
        if (e.target === document.getElementById('modalPecasOS')) fecharModalPecasOS();
    });
});

// Listar Ordens e buscar a soma das peças de cada uma
async function listarOrdensServico() {
    const response = await fetch(API_OS_LISTAR);
    const ordens = await response.json();

    const tbody = document.getElementById("listaOrdensServico");
    tbody.innerHTML = "";

    if (ordens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text3); padding:20px;">Nenhuma Ordem de Serviço ativa.</td></tr>`;
        return;
    }

    // Usando for...of para podermos rodar requisições assíncronas ordenadas para obter o valor total de peças
    for (const os of ordens) {
        const resPecas = await fetch(`${API_OS_LISTAR_PECAS}/${os.id}`);
        const pecasDaOS = await resPecas.json();

        // Calcula o valor total com base nas peças que estão no modal
        let valorTotalPecas = 0;
        pecasDaOS.forEach(p => {
            if (p.valor) valorTotalPecas += parseFloat(p.valor);
        });

        const valorFormatado = `R$ ${valorTotalPecas.toFixed(2).replace('.', ',')}`;
        const dataFormatada = os.dataAbertura ? os.dataAbertura.split('-').reverse().join('/') : "-";
        
        const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
        const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";

        tbody.innerHTML += `
            <tr>
                <td><strong>#OS-${os.id}</strong></td>
                <td>${nomeCliente}</td>
                <td>${nomeKit}</td>
                <td>${dataFormatada}</td>
                <td><span class="badge-green">${valorFormatado}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-accent" onclick="abrirModalPecasOS(${os.id})">🧩 Peças para Troca</button> 
                        <button class="btn btn-ghost" onclick="editarOS(${os.id})">Editar</button> 
                        <button class="btn btn-danger" onclick="deletarOS(${os.id})">Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    }
}

async function salvarNovaOS() {
    const idCliente = document.getElementById("osCliente").value;
    const idUsuario = document.getElementById("osUsuario").value;
    const idPagamento = document.getElementById("osPagamento").value;
    const idKit = document.getElementById("osKit").value;

    const payload = {
        cliente: idCliente ? { id: parseInt(idCliente) } : null,
        usuario: idUsuario ? { id: parseInt(idUsuario) } : null,
        tipoPagamento: idPagamento ? { id: parseInt(idPagamento) } : null,
        kit: idKit ? { id: parseInt(idKit) } : null,
        dataAbertura: document.getElementById("osData").value,
        status: "Em Manutenção"
    };

    const url = editandoOSId ? `${API_OS_ATUALIZAR}/${editandoOSId}` : API_OS_SALVAR;
    const metodo = editandoOSId ? "PUT" : "POST";

    await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    fecharModalNovaOS();
    window.location.href = "manutencao.html";
}

async function editarOS(id) {
    const response = await fetch(`${API_OS_BUSCAR_ID}/${id}`);
    const os = await response.json();

    editandoOSId = id;
    document.querySelector("#modalNovaOS h3").innerText = `📝 Editar Ordem de Serviço #OS-${id}`;
    
    document.getElementById("osCliente").value = os.cliente ? os.cliente.id : "";
    document.getElementById("osUsuario").value = os.typeUsuario || (os.usuario ? os.usuario.id : "");
    document.getElementById("osPagamento").value = os.tipoPagamento ? os.tipoPagamento.id : "";
    document.getElementById("osKit").value = os.kit ? os.kit.id : "";
    document.getElementById("osData").value = os.dataAbertura || "";

    document.getElementById("modalNovaOS").classList.add("active");
}

async function deletarOS(id) {
    if (confirm("Deseja realmente excluir esta Ordem de Serviço definitivamente?")) {
        await fetch(`${API_OS_DELETAR}/${id}`, { method: "DELETE" });
        listarOrdensServico();
    }
}

// Carregamento dos Selects
async function carregarSelectClientes() {
    const response = await fetch(API_CLIENTES_LISTAR);
    const dados = await response.json();
    const select = document.getElementById("osCliente");
    select.innerHTML = '<option value="">-- Selecione o Cliente --</option>';
    dados.forEach(c => select.innerHTML += `<option value="${c.id}">${c.razaoSocial || c.nome}</option>`);
}

async function carregarSelectKits() {
    const response = await fetch(API_KITS_LISTAR);
    const dados = await response.json();
    const select = document.getElementById("osKit");
    select.innerHTML = '<option value="">-- Nenhum Kit Selecionado --</option>';
    dados.forEach(k => select.innerHTML += `<option value="${k.id}">${k.nome} (Cod: ${k.codigo})</option>`);
}

async function carregarSelectPecas() {
    const response = await fetch(API_PECAS_LISTAR);
    const dados = await response.json();
    const selectModal = document.getElementById("selectPecas");
    selectModal.innerHTML = '<option value="">-- Selecione a Peça que será trocada --</option>';
    dados.forEach(p => selectModal.innerHTML += `<option value="${p.id}">${p.nome} (Cod: ${p.codigo})</option>`);
}

async function carregarSelectUsuarios() {
    const response = await fetch(API_USUARIOS_LISTAR);
    const dados = await response.json();
    const select = document.getElementById("osUsuario");
    select.innerHTML = '<option value="">-- Selecione o Responsável --</option>';
    dados.forEach(u => select.innerHTML += `<option value="${u.id}">${u.nome}</option>`);
}

async function carregarSelectPagamentos() {
    const response = await fetch(API_PAGAMENTOS_LISTAR);
    const dados = await response.json();
    const select = document.getElementById("osPagamento");
    select.innerHTML = '<option value="">-- Escolha a Forma de Pagamento --</option>';
    dados.forEach(p => select.innerHTML += `<option value="${p.id}">${p.descricao || p.nome}</option>`);
}

// --- FUNÇÕES DO MODAL DE PEÇAS ---
async function abrirModalPecasOS(idOS) {
    osSelecionadaParaPecasId = idOS;
    document.getElementById('modalPecasTitle').innerText = `Componentes da OS #OS-${idOS}`;
    await renderizarPecasOS();
    document.getElementById('modalPecasOS').classList.add('active');
}

function fecharModalPecasOS() {
    document.getElementById('modalPecasOS').classList.remove('active');
    osSelecionadaParaPecasId = null;
    listarOrdensServico(); 
}

async function renderizarPecasOS() {
    const tbody = document.getElementById('listaPecasDinamicaOS');
    tbody.innerHTML = '';

    const response = await fetch(`${API_OS_LISTAR_PECAS}/${osSelecionadaParaPecasId}`);
    const pecasDaOS = await response.json();

    if (!pecasDaOS || pecasDaOS.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text3); padding: 16px 0;">Nenhuma peça adicionada para troca nesta manutenção.</td></tr>`;
        return;
    }

    pecasDaOS.forEach(peca => {
        const precoUnitario = peca.valor ? `R$ ${parseFloat(peca.valor).toFixed(2).replace('.', ',')}` : "R$ 0,00";
        tbody.innerHTML += `
          <tr>
            <td style="font-family: monospace; font-weight: 600;">${peca.codigo}</td>
            <td>${peca.nome}</td>
            <td>${precoUnitario}</td>
            <td style="text-align: right;">
              <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="removerPecaOS(${peca.id})">Excluir</button>
            </td>
          </tr>
        `;
    });
}

async function adicionarPecaOS() {
    const select = document.getElementById('selectPecas');
    const pecaId = select.value;

    if (!pecaId) return;

    await fetch(`${API_OS_VINCULAR_PECA}/${osSelecionadaParaPecasId}/${pecaId}`, { method: "POST" });
    select.value = "";
    renderizarPecasOS();
}

async function removerPecaOS(pecaId) {
    if (confirm("Deseja remover esta peça desta Ordem de Serviço?")) {
        await fetch(`${API_OS_DESVINCULAR_PECA}/${osSelecionadaParaPecasId}/${pecaId}`, { method: "DELETE" });
        renderizarPecasOS();
    }
}

function abrirModalNovaOS() {
    editandoOSId = null;
    document.getElementById("osData").valueAsDate = new Date();
    document.querySelector("#modalNovaOS h3").innerText = "📝 Nova Ordem de Serviço";
    
    document.getElementById("osCliente").value = "";
    document.getElementById("osUsuario").value = "";
    document.getElementById("osPagamento").value = "";
    document.getElementById("osKit").value = "";
    
    document.getElementById('modalNovaOS').classList.add('active');
}

function fecharModalNovaOS() {
    document.getElementById('modalNovaOS').classList.remove('active');
}

//teste 23231wqewewqsadass